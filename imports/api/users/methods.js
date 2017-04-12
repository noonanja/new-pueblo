import { ValidatedMethod } from 'meteor/mdg:validated-method';

import { Users } from './users.js';
import { Loads } from '../loads/loads.js';
import { AggLoads } from '../aggLoads/aggLoads.js';
import { Console } from '../console/console.js'

import { Constraints } from '/lib/constraints.js';
import { Schema } from '../schema.js';

export const resize = new ValidatedMethod({
  name: 'users.resize',
  validate: new SimpleSchema({
      count: {type: Number},
      hasStore: {type: Boolean},
      hasGen: {type: Boolean},
  }).validator(),
  run({count, hasStore, hasGen}) {
    if (count > 0) {
      for (i = 0; i < count; i++) {
        Users.insert({
          hasStore: hasStore,
          hasGen: hasGen,
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
    formInput: {type: Schema.formInput},
  }).validator(),
  run({formInput}) {

    // if (!todo.editableBy(this.userId)) {
    //   throw new Meteor.Error('todos.updateText.unauthorized',
    //     'Cannot edit todos in a private list that is not yours');
    // }

    console.log(AggLoads.find().fetch());

    const passiveUsers = Users.find({hasStore: false, hasGen: false}).count();
    const passiveChanged = Constraints.userCount - (passiveUsers + formInput.userTypes[2]);
    Meteor.call("users.resize", {count: passiveChanged, hasStore:false, hasGen:false}, (error, result) => {
      if (error) {
        console.log(error);
      }
    });

    // insert storer-generators
    const sgCount = Users.find({hasStore: true, hasGen: true}).count();
    const sgChanged = formInput.userTypes[0] - sgCount;
    Meteor.call("users.resize", {count: sgChanged, hasStore:true, hasGen:true}, (error, result) => {
      if (error) {
        console.log(error);
      }
    });

    // insert storers
    const sCount = Users.find({hasStore: true, hasGen: false}).count();
    const sChanged = (formInput.userTypes[1] - formInput.userTypes[0]) - sCount;
    Meteor.call("users.resize", {count: sChanged, hasStore:true, hasGen:false}, (error, result) => {
      if (error) {
        console.log(error);
      }
    });

    // insert generators
    const gCount = Users.find({hasStore: false, hasGen: true}).count();
    const gChanged = (formInput.userTypes[2] - formInput.userTypes[1]) - gCount;
    Meteor.call("users.resize", {count: gChanged, hasStore:false, hasGen:true}, (error, result) => {
      if (error) {
        console.log(error);
      }
    });

    console.log(AggLoads.find().fetch());
    //
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
