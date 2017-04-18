import { Meteor } from 'meteor/meteor';

import { Simulations } from '../simulations.js';

import { Schema } from '../../schema.js';

Meteor.publish('simulations', function(_id) {
  console.log(_id);
  return Simulations.find({_id}, {fields: Schema.publicFields.Simulations});
});
