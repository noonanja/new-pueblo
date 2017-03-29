import { Users } from './users.js';
import { ValidatedMethod } from 'meteor/mdg:validated-method';

import { drawConsumption } from './hourlyStats.js';


export const simulate = new ValidatedMethod({
  name: 'users.simulate',
  validate: new SimpleSchema({
    userTypes: {type: [Number]},
    requirements: {type: Number},
    cEfficiency: {type: Number},
    dEfficiency: {type: Number},
    capacity: {type: Number},
    maxChargeRate: {type: Number},
    leakRate: {type: Number},
    maxHourlyProduction: {type: Number},
    maxDailyProduction: {type: Number},
  }).validator(),

  run({userTypes, requirements, cEfficiency, dEfficiency, capacity, maxChargeRate,
       leakRate, maxHourlyProduction, maxDailyProduction}) {

    // if (!todo.editableBy(this.userId)) {
    //   throw new Meteor.Error('todos.updateText.unauthorized',
    //     'Cannot edit todos in a private list that is not yours');
    // }

    Users.remove({});   // PLACEHOLDER UNTIL NEWLY DEFINED USERS

    // insert storer-generators
    for(i = 1; i <= userTypes[0]; i++) {
      Users.insert({
        hasStore: true,
        hasGen: true,
        e_n: drawConsumption(),
      });
    }

    // insert storers
    for(i = userTypes[0]+1; i <= userTypes[1]; i++) {
      Users.insert({
        hasStore: true,
        hasGen: false,
        e_n: drawConsumption()
      });
    }

    // insert generators
    for(i = userTypes[1]+1; i <= userTypes[2]; i++) {
      Users.insert({
        hasStore: false,
        hasGen: true,
        e_n: drawConsumption()
      });
    }

  },

});
