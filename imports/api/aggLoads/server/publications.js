import { Meteor } from 'meteor/meteor';

import { AggLoads } from '../aggLoads.js';


AggLoads.publicFields = {
  active: 1,
  l:1,
};

Meteor.publish('aggLoads', function loadsPublication() {
  return AggLoads.find({}, {fields: AggLoads.publicFields});
});
