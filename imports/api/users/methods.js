import { Users } from './users.js';
import { Loads } from '../loads/loads.js';
import { AggLoads } from '../loads/aggLoads.js';
import { ValidatedMethod } from 'meteor/mdg:validated-method';

export const insertUser = new ValidatedMethod({
  name: 'users.insert',
  validate: new SimpleSchema({
      hasStore: {type: Boolean},
      hasGen: {type: Boolean}
  }).validator(),
  run({hasStore, hasGen}) {
    return Users.insert({
      hasStore: hasStore,
      hasGen: hasGen
    });
  }
});

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

    Users.remove({});       // PLACEHOLDER UNTIL BULK REMOVAL
    Loads.remove({});       // PLACEHOLDER UNTIL BULK REMOVAL
    AggLoads.remove({});    // PLACEHOLDER UNTIL BULK REMOVAL

    // insert storer-generators
    for(i = 1; i <= userTypes[0]; i++) {
      Meteor.call("users.insert", {hasStore:true, hasGen:true});
    }
    // insert storers
    for(i = userTypes[0]+1; i <= userTypes[1]; i++) {
      Meteor.call("users.insert", {hasStore:true, hasGen:false});
    }
    // insert generators
    for(i = userTypes[1]+1; i <= userTypes[2]; i++) {
      Meteor.call("users.insert", {hasStore:false, hasGen:true});
    }
  },

});
