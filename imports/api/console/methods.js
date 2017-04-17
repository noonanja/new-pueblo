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
      Console.update(
        {_id: simId},
        {
          $set: {
            activeAggLoad: activeAggLoad,
            activeLoads: activeLoads,
          }
        }
      );
      console.log(simId);
      _execSync(simId, consoleUpdateLoads, consoleErr);
    }

  },
});

const consoleUpdateLoads = function(_data, simId) {
  console.log(_data);
  // Console.update(
  //   {_id: simId},
  //   {
  //     $set: {
  //       // activeAggLoad: [69,69,69],
  //       // activeLoads: activeLoads,
  //     }
  //   }
  // );
};

const consoleErr = function(_data, simId) {
  Console.update(
    {_id: simId},
    {
      $set: {
        error: _data,
      }
    }
  );
};
