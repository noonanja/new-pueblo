import { Mongo } from 'meteor/mongo';
import { Schema } from '../schema.js';

export const AggLoads = new Mongo.Collection('aggLoads', { connection: null } );

// Aggregation of the Load collection
AggLoads.attachSchema(Schema.aggLoads);
