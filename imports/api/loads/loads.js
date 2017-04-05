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
            "l.h1":  load.l.h1,  "l.h2":  load.l.h2,  "l.h3":  load.l.h3,  "l.h4":  load.l.h4,
            "l.h5":  load.l.h5,  "l.h6":  load.l.h6,  "l.h7":  load.l.h7,  "l.h8":  load.l.h8,
            "l.h9":  load.l.h9,  "l.h10": load.l.h10, "l.h11": load.l.h11, "l.h12": load.l.h12,
            "l.h13": load.l.h13, "l.h14": load.l.h14, "l.h15": load.l.h15, "l.h16": load.l.h16,
            "l.h17": load.l.h17, "l.h18": load.l.h18, "l.h19": load.l.h19, "l.h20": load.l.h20,
            "l.h21": load.l.h21, "l.h22": load.l.h22, "l.h23": load.l.h23, "l.h24": load.l.h24,
        },
        $setOnInsert: {
            active: (!!load.s || !!load.g),
            n: 1,
            l: {
              h1:  load.l.h1,  h2:  load.l.h2,  h3:  load.l.h3,  h4:  load.l.h4,
              h5:  load.l.h5,  h6:  load.l.h6,  h7:  load.l.h7,  h8:  load.l.h8,
              h9:  load.l.h9,  h10: load.l.h10, h11: load.l.h11, h12: load.l.h12,
              h13: load.l.h13, h14: load.l.h14, h15: load.l.h15, h16: load.l.h16,
              h17: load.l.h17, h18: load.l.h18, h19: load.l.h19, h20: load.l.h20,
              h21: load.l.h21, h22: load.l.h22, h23: load.l.h23, h24: load.l.h24,
            }
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
            "l.h1":  -load.l.h1,  "l.h2":  -load.l.h2,  "l.h3":  -load.l.h3,  "l.h4":  -load.l.h4,
            "l.h5":  -load.l.h5,  "l.h6":  -load.l.h6,  "l.h7":  -load.l.h7,  "l.h8":  -load.l.h8,
            "l.h9":  -load.l.h9,  "l.h10": -load.l.h10, "l.h11": -load.l.h11, "l.h12": -load.l.h12,
            "l.h13": -load.l.h13, "l.h14": -load.l.h14, "l.h15": -load.l.h15, "l.h16": -load.l.h16,
            "l.h17": -load.l.h17, "l.h18": -load.l.h18, "l.h19": -load.l.h19, "l.h20": -load.l.h20,
            "l.h21": -load.l.h21, "l.h22": -load.l.h22, "l.h23": -load.l.h23, "l.h24": -load.l.h24,
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

// Loads.publicFields = {
//   userId: 1,
//   e: 1,
//   // s_n: 1,
//   // g_n: 1,
// };
