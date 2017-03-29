import { Loads } from './loads.js';
import { ValidatedMethod } from 'meteor/mdg:validated-method';

import { drawConsumption } from './hourlyStats.js';


export const simulate = new ValidatedMethod({
  name: 'loads.simulate',
  validate: new SimpleSchema({
    loadTypes: {type: [Number]},
    requirements: {type: Number},
    cEfficiency: {type: Number},
    dEfficiency: {type: Number},
    capacity: {type: Number},
    maxChargeRate: {type: Number},
    leakRate: {type: Number},
    maxHourlyProduction: {type: Number},
    maxDailyProduction: {type: Number},
  }).validator(),

  run({loadTypes, requirements, cEfficiency, dEfficiency, capacity, maxChargeRate,
       leakRate, maxHourlyProduction, maxDailyProduction}) {

    // if (!todo.editableBy(this.userId)) {
    //   throw new Meteor.Error('todos.updateText.unauthorized',
    //     'Cannot edit todos in a private list that is not yours');
    // }

    Users.remove({});   // PLACEHOLDER UNTIL NEWLY DEFINED USERS

    // insert storer-generators
    for(i = 1; i <= loadTypes[0]; i++) {
      Loads.insert({
        hasStore: true,
        hasGen: true,
        e_n: drawConsumption(),
      });
    }

    // insert storers
    for(i = loadTypes[0]+1; i <= loadTypes[1]; i++) {
      Loads.insert({
        hasStore: true,
        hasGen: false,
        e_n: drawConsumption()
      });
    }

    // insert generators
    for(i = loadTypes[1]+1; i <= loadTypes[2]; i++) {
      Loads.insert({
        hasStore: false,
        hasGen: true,
        e_n: drawConsumption()
      });
    }

    console.log(Loads.find().count());

  },

});
