import { Mongo } from 'meteor/mongo';
import { Schema } from '../schema.js';

export const AggLoads = new Mongo.Collection('aggLoads', { connection: null } );

// AGGREGATION OF LOAD COLLECTION
AggLoads.attachSchema(Schema.aggLoads);

AggLoads.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});
