import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

import { Schema } from '../schema.js';

export const AggLoads = new Mongo.Collection('aggLoads');

// AGGREGATION OF LOAD COLLECTION
AggLoads.attachSchema(AggSchema);

AggLoads.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});
