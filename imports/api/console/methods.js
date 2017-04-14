import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { Console } from './console.js';

import { Schema } from '../schema.js';


export const simulate = new ValidatedMethod({
  name: 'console.simulate',
  validate: new SimpleSchema({
    formInput: {type: Schema.formInput},
    passiveLoadValues: {type: [Number], decimal: true},
  }).validator(),
  run({formInput, passiveLoadValues}) {
    const id = Console.insert({
      name: 'sim',
      timestamp: new Date().getTime(),
      requirements: formInput,
      passiveLoadValues: passiveLoadValues,
      strategies: {},
    });
    const cmd = "python " + "../../../../../server/.scripts/argmin.py " + id;
    if (this.isSimulation) {
        // Simulation code for the client (optional)
    }
    else {
      let x_prime = _execSync(cmd, consoleInsert, consoleInsert);
      return x_prime;
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
