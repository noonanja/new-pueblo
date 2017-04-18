import { Meteor } from 'meteor/meteor';

import { Simulations } from '../simulations.js';

import { Schema } from '../../schema.js';

Meteor.publish('simulations', function() {
  return Simulations.find({}, {fields: Schema.PublicFields.Simulations});
});
