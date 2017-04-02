import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

import { Users } from '../users/users.js';
import { AggLoads } from '../aggLoads/aggLoads.js'
import { Schema } from '../schema.js';

const aggLoadDenormalizer = {
  afterInsertLoad(loadId) {
    load = Loads.findOne({_id: loadId});
    user = Users.findOne({_id: load.userId});
    AggLoads.update(
      {active: (user.hasGen || user.hasStore)},
      {
        $inc: {
            h1: load.e.h1, h2: load.e.h2, h3: load.e.h3, h4: load.e.h4, h5: load.e.h5,
            h6: load.e.h6, h7: load.e.h7, h8: load.e.h8, h9: load.e.h9, h10: load.e.h10,
            h11: load.e.h11, h12: load.e.h12, h13: load.e.h13, h14: load.e.h14,
            h15: load.e.h15, h16: load.e.h16, h17: load.e.h17, h18: load.e.h18,
            h19: load.e.h19, h20: load.e.h20, h21: load.e.h21, h22: load.e.h22,
            h23: load.e.h23, h24: load.e.h24 },
        $setOnInsert: {
            active: true, h1: 0, h2: 0, h3: 0, h4: 0, h5: 0, h6: 0, h7: 0, h8: 0, h9: 0, h10: 0,
            h11: 0, h12: 0, h13: 0, h14: 0, h15: 0, h16: 0, h17: 0, h18: 0,
            h19: 0, h20: 0, h21: 0, h22: 0, h23: 0, h24: 0 },
      },
      {upsert: true},
    );
  }
};

class LoadsCollection extends Mongo.Collection {
  insert(load, callback) {
    const result = super.insert(load, callback);
    aggLoadDenormalizer.afterInsertLoad(result);
    return result;
  }
  // remove(selector, callback) {
  //   Loads.remove({userId: selector});
  //   return super.remove(selector, callback);
  // }
}

export const Loads = new LoadsCollection('loads');

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
