import { ValidatedMethod } from 'meteor/mdg:validated-method';

import { Users } from './users.js';
import { Loads } from '../loads/loads.js';
import { AggLoads } from '../aggLoads/aggLoads.js';
import { Console } from '../console/console.js'

import { Constraints } from '/lib/constraints.js';
import { Schema } from '../schema.js';

export const addActive = new ValidatedMethod({
  name: 'users.addActive',
  validate: new SimpleSchema({
      count: {type: Number},
      hasStore: {type: Boolean},
      hasGen: {type: Boolean},
  }).validator(),
  run({count, hasStore, hasGen}) {
    if (count < 0) {
      throw new Meteor.Error('Can only create active users from addActive');
    }
    const toConvert = Users.find({hasStore: false, hasGen: false}, {limit: Math.abs(count)}).map(function(doc) {
      return doc._id;
    });
    toConvert.forEach(function(id) {
      Users.update({_id: id}, {$set: {hasStore: hasStore, hasGen: hasGen}});
    });
  }
});

export const simulate = new ValidatedMethod({
  name: 'users.simulate',
  validate: new SimpleSchema({
    formInput: {type: Schema.formInput},
  }).validator(),
  run({formInput}) {

    // if (!todo.editableBy(this.userId)) {
    //   throw new Meteor.Error('todos.updateText.unauthorized',
    //     'Cannot edit todos in a private list that is not yours');
    // }

    // reset all users to passive users
    const passiveConvert = Users.find({ $or: [{hasStore: true}, {hasGen: true}] }).map(function(doc) {
      return doc._id;
    });
    passiveConvert.forEach(function(id) {
      Users.update({_id: id}, {$set: {hasStore: false, hasGen: false}});
    });

    // insert storer-generators
    const sgConvert = formInput.userTypes[0];
    Meteor.call("users.addActive", {count: sgConvert, hasStore:true, hasGen:true}, (error, result) => {
      if (error) {
        console.log(error);
      }
    });

    // insert storers
    const sConvert = (formInput.userTypes[1] - formInput.userTypes[0]);
    Meteor.call("users.addActive", {count: sConvert, hasStore:true, hasGen:false}, (error, result) => {
      if (error) {
        console.log(error);
      }
    });

    // insert generators
    const gConvert = (formInput.userTypes[2] - formInput.userTypes[1]);
    Meteor.call("users.addActive", {count: gConvert, hasStore:false, hasGen:true}, (error, result) => {
      if (error) {
        console.log(error);
      }
    });

    // if (Meteor.isServer) {
    //   const cmd = "python " + "../../../../../server/.scripts/argmin.py";
    //   passiveLoad = AggLoads.findOne({active: false});
    //   Console.insert({
    //     timestamp : new Date().getTime(),
    //     requirements: requirements, cEfficiency: cEfficiency, dEfficiency: dEfficiency,
    //     capacity: capacity, maxChargeRate: maxChargeRate, leakRate: leakRate,
    //
    //   });
    //   // let countdown = 5;
    //   // while (countdown > 1) {
    //     activeLoad = AggLoads.findOne({active: true});
    //     Users.find({active: true}).forEach(function(user) {
    //           //////////////////////////////////////////////////////
    //       // Given Aggregate Load and the constraints from the form-input,
    //       // minimize the user's cost objective function
    //         //////////////////////////////////////////////////////
    //       load = Loads.find({userId: user._id});
    //       let otherActiveAgg = Math.subtract(activeLoad, load.l);
    //
    //       let s_prime = _execSync(cmd, consoleInsert, consoleInsert);
    //       let s = s_prime['s'];
    //       let g = s_prime['g'];
    //
    //       // If the NE has been reached, each user updates their strategy "centroid"
    //       Loads.update({userId: user._id},
    //                    {
    //                      $set : {
    //                        l: Math.add(load.e, Math.subtract(s, g)),
    //                        s: s,
    //                        g: g,
    //                      }
    //                    }
    //       );
    //     });
    //     // countdown -= 1;
    //   // }
    // }

  },
});

const consoleInsert = function(_data) {
  Console.insert({
    timestamp : new Date().getTime(),
    data : _data
  });
};
