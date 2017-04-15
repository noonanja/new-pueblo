import pymongo
from pymongo import MongoClient

import sys

import numpy as np



client = MongoClient('mongodb://127.0.0.1:3001/meteor')
db = client.meteor

def main(args):
    sim = db.console.find_one(args[1])
    requirements = sim['requirements']
    passiveLoadValues = sim['passiveLoadValues']
    activeAggLoad = sim['activeAggLoad']
    activeLoads = sim['activeLoads']
    for load in activeLoads:
        otherActiveAgg = np.subtract(activeAggLoad, load['l'])
        otherAgg = np.add(passiveLoadValues, otherActiveAgg)
        


if __name__ == "__main__":
    main(sys.argv)
