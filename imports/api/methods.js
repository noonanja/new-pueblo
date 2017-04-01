import { Users } from './users/users.js';
import { Loads } from './loads/loads.js';
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

    Users.remove({});   // PLACEHOLDER UNTIL BULK REMOVAL
    Loads.remove({});   // PLACEHOLDER UNTIL BULK REMOVAL

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

export const getAggLoad = new ValidatedMethod({
  name: 'loads.getAggLoads',
  validate: new SimpleSchema({
    filter: {type: Object, optional: true},
  }).validator(),
  run({filter}) {
    let group = {
      _id: null,
      'agg1':  {$sum: '$e.h1'},  'agg2':  {$sum: '$e.h2'},  'agg3':  {$sum: '$e.h3'},
      'agg4':  {$sum: '$e.h4'},  'agg5':  {$sum: '$e.h5'},  'agg6':  {$sum: '$e.h6'},
      'agg7':  {$sum: '$e.h7'},  'agg8':  {$sum: '$e.h8'},  'agg9':  {$sum: '$e.h9'},
      'agg10': {$sum: '$e.h10'}, 'agg11': {$sum: '$e.h11'}, 'agg12': {$sum: '$e.h12'},
      'agg13': {$sum: '$e.h13'}, 'agg14': {$sum: '$e.h14'}, 'agg15': {$sum: '$e.h15'},
      'agg16': {$sum: '$e.h16'}, 'agg17': {$sum: '$e.h17'}, 'agg18': {$sum: '$e.h18'},
      'agg19': {$sum: '$e.h19'}, 'agg20': {$sum: '$e.h20'}, 'agg21': {$sum: '$e.h21'},
      'agg22': {$sum: '$e.h22'}, 'agg23': {$sum: '$e.h23'}, 'agg24': {$sum: '$e.h24'}
    }
    let aggregation = Loads.aggregate(
      // {$match: filter},
      {$group: group}
    );
    aggregation = _.values(aggregation[0]);
    aggregation.splice(0,1);
    console.log(aggregation);
    return aggregation;
  },
});
