import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

import {Schema} from '../schema.js';

export const AggLoads = new Mongo.Collection('aggLoads');

// AGGREGATION OF LOAD COLLECTION
AggLoads.attachSchema(AggSchema);

AggLoads.publicFields = {
  active: 1,
  h1: 1, h2: 1, h3: 1, h4: 1, h5: 1, h6: 1, h7: 1, h8: 1, h9: 1, h10: 1, h11: 1,
  h12: 1, h13: 1, h14: 1, h15: 1, h16: 1, h17: 1, h18: 1, h19: 1, h20: 1, h21: 1,
  h22: 1, h23: 1, h24: 1,
};

AggLoads.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

if (Meteor.isServer) {
  Meteor.publish('aggLoads', function loadsPublication() {
    return AggLoads.find({fields: AggLoads.publicFields});
  });
}
