import pymongo
from pymongo import MongoClient

import sys

import numpy as np

import yaml
import os

import cvxopt
from cvxopt import matrix
from cvxopt import solvers

with open(os.path.join(os.path.split(os.path.realpath(__file__))[0],
                       'gridK.yaml'), 'r') as f:
    params_raw = f.read()
params = yaml.load(params_raw)
gridK = params['gridK']

client = MongoClient('mongodb://127.0.0.1:3001/meteor')
db = client.meteor

class Simulation(object):
    """
    Class used to optimize storage and production strategies given
    constraints set by client. Each active user sets their optimal
    strategy given the aggregate loads in the current iteration
    """
    def __init__(self,
                 cEF,
                 dEF,
                 c,
                 mCR,
                 lR,
                 mHP,
                 mDP,
                 passiveLoadValues,
                 activeAggLoad,
                 activeLoads):
        """
        Initialize the class
        Inputs: (all loaded from constaints defined from client)
          Storage Model (constants for each user):
            cEF - charging efficiency, 0 < cEF <= 1
            dEF - discharging efficiency, dEF >= 1
            c   - capacity,
            mCR - max energy stored in a time slot,
            lR  - leakage rate, 0 < lR <= 1,
          Production Model (constants for each user):
            mHP - max hourly production, 0 <= g(h) <= mHP,
            mDP - max daily production, sum[g(h)] <= mDP
          Grid Statistics:
            passiveLoadValues: Aggregate load of passive users (stagnant array for each time slot)
            activeAggLoad:  Aggregate load of active users (array that changes each round)
            activeLoads: List of Load objects
                userId: _id of user responsible for load
                l: net load per hourly time slot (l = e + s - g)
                e: consumption per time slot
                s: net storage per time slot (= amount charged - amount discharged)
                g: generation per time slot
        """
        self.cEF = cEF
        self.dEF = dEF
        self.c = c
        self.mCR = mCR
        self.lR = lR
        self.mHP = mHP
        self.mDP = mDP
        self.passiveLoadValues = passiveLoadValues
        self.activeAggLoad = activeAggLoad
        self.activeLoads = activeLoads

        self.qZero = .25*c
        self.epsilon = 0.0

        """
            Create portion of objective function, a matrix P, and constraint matrices
            G and h, which all will be shared for each user
        """
        self.P = np.zeros((48,48))
        hour = 1
        for i in xrange(0, len(self.P) - 1, 2):
            self.P[i][i]     =  gridK[hour]
            self.P[i][i+1]   = -gridK[hour]
            self.P[i+1][i]   = -gridK[hour]
            self.P[i+1][i+1] =  gridK[hour]
            hour += 1
        self.P = 2*self.P


        # G (122 x 48) matrix for optimization contraints
        self.G = np.zeros((122, 48))
        # h (122 x 1) column vector for optimization contraints
        self.h = np.zeros((122))

        # hourly charge limit
        j = 0
        for i in xrange(0, 24):
            # (amount charged * cEF) - (amount discharged * dEF) <= mCR
            self.h[i]      =  self.mCR
            self.G[i][j]   =  self.cEF
            self.G[i][j+1] = -self.dEF
            j+=2


        # daily charge and discharge limits
        for i in xrange(0, 24):
            # total amount charged or discharged throughout the day,
            # considering leakage, is below battery capacity (if charged)
            # and above remaining charge level (if discharging)
            self.h[i+24] = self.c - self.qZero*(self.lR**(i+1))
            self.h[i+48] = self.qZero*(self.lR**(i+1))
            for j in xrange(0, (2*(i+1)), 2):
                # charge limit
                self.G[i+24][j]   =  (self.lR**((i)-j/2))*self.cEF
                self.G[i+24][j+1] = -(self.lR**((i)-j/2))*self.dEF
                # discharge limit
                self.G[i+48][j]   =  (self.lR**((i)-j/2))*self.dEF
                self.G[i+48][j+1] = -(self.lR**((i)-j/2))*self.cEF

        # (remaining new charge - natural leakage) - initial q charge level =
        # tiny epsilon value
        self.h[72] = self.epsilon + (1 - self.lR**24)*self.qZero
        self.h[73] = self.epsilon + (1 - self.lR**24)*self.qZero
        for j in xrange(0, 48, 2):
            #  remaining new charge < epsilon + natural leakage
            self.G[72][j]   =  (self.lR**(23-j/2))*self.cEF
            self.G[72][j+1] = -(self.lR**(23-j/2))*self.dEF
            # -remaining new charge < epsilon + natural leakage
            self.G[73][j]   =  (self.lR**(23-j/2))*self.dEF
            self.G[73][j+1] = -(self.lR**(23-j/2))*self.cEF

        # hourly charge or discharge must be non-negative
        for i in xrange(0, 48):
            self.G[74+i][i] = -1

    def storer_minimize(self, e, otherAgg):
        """
        Objective function: argmin ~s~ { f(otherAgg) }
                            where f(otherAgg) =
                                sum_(h=1)^24 [
                                    gridK(h) * (otherAgg + e(h) + s(h)) * (e(h) + s(h))
                                ]
        Constraints on s: defined in paper
        We will use the standard form of a Quadratic Programming problem below, defined
        here: courses.csail.mit.edu/6.867/wiki/images/a/a7/Qp-cvxopt.pdf
        """
        q = []
        hour = 1 # prices are indexed from 1
        for i in xrange(0, 47, 2):
            q.append( 2*e[hour-1]*gridK[hour] + gridK[hour]*otherAgg[hour-1])
            q.append(-2*e[hour-1]*gridK[hour] - gridK[hour]*otherAgg[hour-1])
            hour += 1
        q = np.array(q)

        return solvers.qp(matrix(self.P), matrix(q), matrix(self.G), matrix(self.h))['x']

    def simulate(self):
        load = self.activeLoads[4]
        # for load in self.activeLoads:
        otherActiveAgg = np.subtract(self.activeAggLoad, load['l'])
        otherAgg = np.add(self.passiveLoadValues, otherActiveAgg)
        if (load['hasStore'] and not load['hasGen']):
            s = self.storer_minimize(load['e'], otherAgg)
            print "load minimized"
            print load['userId']
            print load['hasStore']
            print load['hasGen']
            print s


def main(args):
    sim = db.console.find_one(args[1])
    passiveLoadValues = sim['passiveLoadValues']
    activeAggLoad = sim['activeAggLoad']
    activeLoads = sim['activeLoads']
    requirements = sim['requirements']
    simulation = Simulation(float(requirements['cEfficiency']) / 100,
                            float(requirements['dEfficiency']) / 100,
                            float(requirements['capacity']),
                            float(requirements['maxChargeRate']),
                            float(requirements['leakRate']) / 100,
                            float(requirements['maxHourlyProduction']),
                            float(requirements['maxDailyProduction']),
                            passiveLoadValues,
                            activeAggLoad,
                            activeLoads
                            )
    simulation.simulate()


if __name__ == "__main__":
    main(["blank", "2XQfPhwtkBptbW8Wc"])
    # main(sys.argv)
