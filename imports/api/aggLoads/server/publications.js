import { Meteor } from 'meteor/meteor';

import { AggLoads } from '../aggLoads.js';

import { Schema } from '../../schema.js';


Meteor.publish('aggLoads', function loadsPublication() {
  return AggLoads.find({}, {fields: Schema.publicFields.AggLoads});
});
