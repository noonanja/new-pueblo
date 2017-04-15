import { ValidatedMethod } from 'meteor/mdg:validated-method';

import { Users } from '../users/users.js';
import { Loads } from '../loads/loads.js';
import { Console } from './console.js';

import { Schema } from '../schema.js';


export const setSim = new ValidatedMethod({
  name: 'console.setSim',
  validate: new SimpleSchema({
    formInput: {type: Schema.formInput},
    passiveLoadValues: {type: [Number], decimal: true},
  }).validator(),
  run({formInput, passiveLoadValues}) {
    return Console.insert({
      name: 'sim',
      timestamp: new Date().getTime(),
      requirements: formInput,
      passiveLoadValues: passiveLoadValues,
      activeAggLoad: null,
      activeLoads: null,
    });
  },
});

export const simulate = new ValidatedMethod({
  name: 'console.simulate',
  validate: new SimpleSchema({
    simId: { type: String, regEx: SimpleSchema.RegEx.Id },
    activeAggLoad: {type: [Number], decimal: true},
    activeLoads: {type: [Schema.loads]},
  }).validator(),
  run({simId, activeAggLoad, activeLoads}) {
    if (this.isSimulation) {
      // client only code
    } else {
      const cmd = "python ../../../../../server/.scripts/argmin.py " + simId;
      Console.update(
        {_id: simId},
        {
          $set: {
            activeAggLoad: activeAggLoad,
            activeLoads: activeLoads,
          }
        }
      );
      _execSync(cmd, consoleInsert, consoleInsert);
    }

  },
});

// if (Meteor.isServer) {
//
//   const cmd = "python " + "../../../../../server/.scripts/argmin.py " + id;
//   let x_prime = _execSync(cmd, consoleInsert, consoleInsert);
//   // let countdown = 5;
//   // while (countdown > 1) {
//     // activeLoad = AggLoads.findOne({active: true});
//     // Users.find({active: true}).forEach(function(user) {
//     //       //////////////////////////////////////////////////////
//     //   // Given Aggregate Load and the constraints from the form input,
//     //   // minimize the user's cost objective function
//     //     //////////////////////////////////////////////////////
//     //   load = Loads.find({userId: user._id});
//     //   let otherActiveAgg = Math.subtract(activeLoad, load.l);
//     //
//     //   let s_prime = _execSync(cmd, consoleInsert, consoleInsert);
//     //   let s = s_prime['s'];
//     //   let g = s_prime['g'];
//     //
//     //   // If the NE has been reached, each user updates their strategy "centroid"
//     //   Loads.update({userId: user._id},
//     //                {
//     //                  $set : {
//     //                    l: Math.add(load.e, Math.subtract(s, g)),
//     //                    s: s,
//     //                    g: g,
//     //                  }
//     //                }
//     //   );
//     // });
//     // countdown -= 1;
//   // }
// }

const consoleInsert = function(_data) {
  Console.insert({
    name: 'python response',
    timestamp : new Date().getTime(),
    data : _data
  });
};
