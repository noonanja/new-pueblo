import pymongo
from pymongo import MongoClient

import sys

client = MongoClient('mongodb://127.0.0.1:3001/meteor')
db = client.meteor

def main(args):
    print args;
    print db.console.find_one()

if __name__ == "__main__":
    main(sys.argv)
