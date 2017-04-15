import pymongo
from pymongo import MongoClient

import sys

client = MongoClient('mongodb://127.0.0.1:3001/meteor')
db = client.meteor

def main(args):
    print args;
    print db.console.find_one(args[1])

if __name__ == "__main__":
    main(sys.argv)



# activeLoads.forEach(function(load) {
# //////////////////////////////////////////////////////
# // Given Aggregate Load and the constraints from the form input,
# // minimize the user's cost objective function
# //////////////////////////////////////////////////////
# });

# let otherActiveAgg = math.subtract(activeAggLoad, load.l);
# let sim = Console.findOne({_id: simId});
# let passiveLoadValues = sim.passiveLoadValues;
# let otherAgg = math.add(passiveLoadValues, otherActiveAgg);
