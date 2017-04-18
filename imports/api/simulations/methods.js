import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';

import { Simulations } from './simulations.js';

import { Schema } from '../schema.js';

export const insert = new ValidatedMethod({
  name: 'simulations.start',
  validate: new SimpleSchema({
    formInput: {type: Schema.formInput},
    passiveLoad: {type: Schema.aggLoads},
    activeLoad: {type: Schema.aggLoads},
    activeLoads: {type: [Schema.loads]},
  }).validator(),
  run({formInput, passiveLoad, activeLoad, activeLoads}) {
    return Simulations.insert({
      name: 'sim',
      timestamp: new Date().getTime(),
      requirements: formInput,
      passiveLoad: passiveLoad,
      activeLoad: activeLoad,
      activeLoads: activeLoads,
    });
  },
});

export const simulate = new ValidatedMethod({
  name: 'simulations.simulate',
  validate: new SimpleSchema({
    simId: { type: String, regEx: SimpleSchema.RegEx.Id },
  }).validator(),
  run({simId, activeAggLoad, activeLoads}) {
    if (this.isSimulation) {
      // client only code
    } else {
      _execSync(simId, simUpdateLoads, simErr);
    }
  },
});

const simUpdateLoads = function(_data, simId) {
  // Simulations.update(
  //   {_id: simId},
  //   {
  //     $set: {
  //       // activeAggLoad: [69,69,69],
  //       // activeLoads: activeLoads,
  //     }
  //   }
  // );
};

const simErr = function(_data, simId) {
  Simulations.update(
    {_id: simId},
    {
      $set: {
        error: _data,
      }
    }
  );
};

// Get list of all method names on simulations
const SIMULATIONS_METHODS = _.pluck([
  insert,
  simulate,
], 'name');

if (Meteor.isServer) {
  // Only allow 1 list operations per connection per 5 seconds
  DDPRateLimiter.addRule({
    name(name) {
      return _.contains(SIMULATIONS_METHODS, name);
    },

    // Rate limit per connection ID
    connectionId() { return true; },
  }, 1, 5000);
}
