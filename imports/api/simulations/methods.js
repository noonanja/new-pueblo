import { ValidatedMethod } from 'meteor/mdg:validated-method';

import { Users } from '../users/users.js';
import { Loads } from '../loads/loads.js';
import { Simulations } from './simulations.js';

import { Schema } from '../schema.js';


export const setSim = new ValidatedMethod({
  name: 'simulations.setSim',
  validate: new SimpleSchema({
    formInput: {type: Schema.formInput},
    passiveLoadValues: {type: [Number], decimal: true},
  }).validator(),
  run({formInput, passiveLoadValues}) {
    return Simulations.insert({
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
  name: 'simulations.simulate',
  validate: new SimpleSchema({
    simId: { type: String, regEx: SimpleSchema.RegEx.Id },
    activeAggLoad: {type: [Number], decimal: true},
    activeLoads: {type: [Schema.loads]},
  }).validator(),
  run({simId, activeAggLoad, activeLoads}) {
    if (this.isSimulation) {
      // client only code
    } else {
      Simulations.update(
        {_id: simId},
        {
          $set: {
            activeAggLoad: activeAggLoad,
            activeLoads: activeLoads,
          }
        }
      );
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
