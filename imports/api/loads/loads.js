import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

import { Users } from '../users/users.js';
import { AggLoads } from './aggLoads.js'
import { Schema } from '../schema.js';

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

const aggLoadDenormalizer = {
  afterInsertLoad(loadId) {
    load = Loads.findOne({_id: loadId});
    user = Users.findOne({_id: load.userId});
    AggLoads.update(
      {active: (user.hasGen || user.hasStore)},
      {$inc: {"h1": load.e.h1, "h2": load.e.h2,
              "h3": load.e.h3, "h4": load.e.h4,
              "h5": load.e.h5, "h6": load.e.h6,
              "h7": load.e.h7, "h8": load.e.h8,
              "h9": load.e.h9, "h10": load.e.h10,
              "h11": load.e.h11, "h12": load.e.h12,
              "h13": load.e.h13, "h14": load.e.h14,
              "h15": load.e.h15, "h16": load.e.h16,
              "h17": load.e.h17, "h18": load.e.h18,
              "h19": load.e.h19, "h20": load.e.h20,
              "h21": load.e.h21, "h22": load.e.h22,
              "h23": load.e.h23, "h24": load.e.h24}},
      {upsert: true},
    );
  }
};

Loads.attachSchema(Schema.loads);

Loads.publicFields = {
  userId: 1,
  e: 1,
  // s_n: 1,
  // g_n: 1,
};

Loads.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});
