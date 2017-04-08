import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

import { Users } from '../users/users.js';
import { AggLoads } from '../aggLoads/aggLoads.js'
import { Schema } from '../schema.js';

const aggLoadDenormalizer = {
  afterInsertLoad(load) {
    AggLoads.update(
      {active: (!!load.s || !!load.g)},
      {
        $inc: {
            n: 1,
            "l.0":  load.l[0],
            "l.1":  load.l[1],  "l.2":  load.l[2],  "l.3":  load.l[3],  "l.4":  load.l[4],
            "l.5":  load.l[5],  "l.6":  load.l[6],  "l.7":  load.l[7],  "l.8":  load.l[8],
            "l.9":  load.l[9],  "l.10": load.l[10], "l.11": load.l[11], "l.12": load.l[12],
            "l.13": load.l[13], "l.14": load.l[14], "l.15": load.l[15], "l.16": load.l[16],
            "l.17": load.l[17], "l.18": load.l[18], "l.19": load.l[19], "l.20": load.l[20],
            "l.21": load.l[21], "l.22": load.l[22], "l.23": load.l[23],
        },
        $setOnInsert: {
            active: (!!load.s || !!load.g),
            n: 1,
            l: [
              load.l[0],
              load.l[1],  load.l[2],  load.l[3],  load.l[4],
              load.l[5],  load.l[6],  load.l[7],  load.l[8],
              load.l[9],  load.l[10], load.l[11], load.l[12],
              load.l[13], load.l[14], load.l[15], load.l[16],
              load.l[17], load.l[18], load.l[19], load.l[20],
              load.l[21], load.l[22], load.l[23],
            ]
        },
      },
      {upsert: true},
    );
  },
  afterRemoveLoad(load) {
    AggLoads.update(
      {active: (!!load.s || !!load.g) },
      {
        $inc: {
            n: -1,
            "l.0":  -load.l[0],
            "l.1":  -load.l[1],  "l.2":  -load.l[2],  "l.3":  -load.l[3],  "l.4":  -load.l[4],
            "l.5":  -load.l[5],  "l.6":  -load.l[6],  "l.7":  -load.l[7],  "l.8":  -load.l[8],
            "l.9":  -load.l[9],  "l.10": -load.l[10], "l.11": -load.l[11], "l.12": -load.l[12],
            "l.13": -load.l[13], "l.14": -load.l[14], "l.15": -load.l[15], "l.16": -load.l[16],
            "l.17": -load.l[17], "l.18": -load.l[18], "l.19": -load.l[19], "l.20": -load.l[20],
            "l.21": -load.l[21], "l.22": -load.l[22], "l.23": -load.l[23],
        },
      }
    );
  }

};

class LoadsCollection extends Mongo.Collection {
  insert(load, callback) {
    const result = super.insert(load, callback);
    aggLoadDenormalizer.afterInsertLoad(this.findOne(result));
    return result;
  }
  remove(selector, callback) {
    this.find(selector).map(function(load) {
      aggLoadDenormalizer.afterRemoveLoad(load);
    });
    const result = super.remove(selector, callback);
    return result;
  }
}

// export const Loads = new LoadsCollection('loads'); // syncs with server
export const Loads = new LoadsCollection('loads', { connection: null } );

Loads.attachSchema(Schema.loads);

Loads.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});


// Loads.helpers({
//   otherActiveAgg(activeLoad) {
//     loadN = this.load.l;
//     return Math.subtract(l, loadN)
//   }
// });
