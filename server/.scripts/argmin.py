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
        self.cEF = cEF;
        self.dEF = dEF;
        self.c = c;
        self.mCR = mCR;
        self.lR = lR;
        self.mHP = mHP;
        self.mDP = mDP;
        self.passiveLoadValues = passiveLoadValues;
        self.activeAggLoad = activeAggLoad;
        self.activeLoads = activeLoads;

    def simulate(self):
        load = self.activeLoads[4]
        # for load in self.activeLoads:
        otherActiveAgg = np.subtract(self.activeAggLoad, load['l'])
        otherAgg = np.add(self.passiveLoadValues, otherActiveAgg)
        if (load['hasStore'] and not load['hasGen']):
            s = self.storer_minimize(load['e'], otherAgg)
            print s

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
        P = np.zeros((48,48))
        h = 1
        for i in xrange(0, len(P) - 1, 2):
            P[i][i] = gridK[h] * self.cEF * self.cEF
            P[i][i+1]= -gridK[h] * self.cEF * self.dEF
            P[i+1][i] = -gridK[h] * self.cEF * self.dEF
            P[i+1][i+1] = gridK[h] * self.dEF * self.dEF
            h += 1
        # P = matrix()
        q = []
        h = 1 # prices are indexed from 1
        for i in xrange(0, 47, 2):
            q.append( 2*self.cEF*e[h-1]*gridK[h] + gridK[h]*otherAgg[h-1]*self.cEF)
            q.append(-2*self.dEF*e[h-1]*gridK[h] + gridK[h]*otherAgg[h-1]*self.dEF)
            h += 1
        # q = matrix(2 * q)

        G = np.zeros((122, 48))
        j = 0
        for i in xrange(0, 24):
            G[i][j] = self.cEF
            G[i][j+1] = self.dEF
            j+=2
        for i in xrange(0, 24):
            for j in xrange(0, (2*(i+1)), 2):
                # charge limit
                G[i+24][j]   =  (self.lR**((i)-j/2))*self.cEF
                G[i+24][j+1] = -(self.lR**((i)-j/2))*self.dEF
                # discharge limit
                G[i+48][j]   =  (self.lR**((i)-j/2))*self.dEF
                G[i+48][j+1] = -(self.lR**((i)-j/2))*self.cEF
        for j in xrange(0, 48, 2):
            # final charge equals initial charge
            G[72][j]   =  (self.lR**(23-j/2))*self.cEF
            G[72][j+1] = -(self.lR**(23-j/2))*self.dEF
            # final charge equals initial charge
            G[73][j]   =  (self.lR**(23-j/2))*self.dEF
            G[73][j+1] = -(self.lR**(23-j/2))*self.cEF

        print G[47]
        print G[72]
            # G[i] = np.array([])
        # G = matrix()
        # h = matrix()
        #
        # sol = solvers.qp(P, q, G, h)


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
    main(["blank", "nyxLNXycgos47koD8"])
    # main(sys.argv)
