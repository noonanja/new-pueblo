import { ValidatedMethod } from 'meteor/mdg:validated-method';

import { Users } from './users.js';
import { Loads } from '../loads/loads.js';
import { AggLoads } from '../aggLoads/aggLoads.js';

import { Constraints } from '/lib/constraints.js';

export const resize = new ValidatedMethod({
  name: 'users.resize',
  validate: new SimpleSchema({
      count: {type: Number},
      hasStore: {type: Boolean},
      hasGen: {type: Boolean}
  }).validator(),
  run({count, hasStore, hasGen}) {
    if (count > 0) {
      for (i = 0; i < count; i++) {
        Users.insert({
          hasStore: hasStore,
          hasGen: hasGen
        });
      }
    }
    else if (count < 0) {
      const toRemove = Users.find({hasStore: hasStore, hasGen: hasGen}, {limit: Math.abs(count)}).map(function(doc) {
        return doc._id;
      });
      return Users.remove({_id: {$in: toRemove}});
    }
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

    // insert passive
    const passiveUsers = Users.find({hasStore: false, hasGen: false}).count();
    const passiveChanged = Constraints.userCount - (passiveUsers + userTypes[2]);
    Meteor.call("users.resize", {count: passiveChanged, hasStore:false, hasGen:false}, (error, result) => {
      if (error) {
        console.log(error);
      }
    });


    // insert storer-generators
    const sgCount = Users.find({hasStore: true, hasGen: true}).count();
    const sgChanged = userTypes[0] - sgCount;
    Meteor.call("users.resize", {count: sgChanged, hasStore:true, hasGen:true}, (error, result) => {
      if (error) {
        console.log(error);
      }
    });

    // insert storers
    const sCount = Users.find({hasStore: true, hasGen: false}).count();
    const sChanged = (userTypes[1] - userTypes[0]) - sCount;
    Meteor.call("users.resize", {count: sChanged, hasStore:true, hasGen:false}, (error, result) => {
      if (error) {
        console.log(error);
      }
    });

    // insert generators
    const gCount = Users.find({hasStore: false, hasGen: true}).count();
    const gChanged = (userTypes[2] - userTypes[1]) - gCount;
    Meteor.call("users.resize", {count: gChanged, hasStore:false, hasGen:true}, (error, result) => {
      if (error) {
        console.log(error);
      }
    });

  },

});
