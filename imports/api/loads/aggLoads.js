import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

import {Schema} from '../schema.js';

export const AggLoads = new Mongo.Collection('aggLoads');

// AGGREGATION OF LOAD COLLECTION
AggLoads.attachSchema(AggSchema);

AggLoads.publicFields = {
  active: 1,
  l: 1,
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
