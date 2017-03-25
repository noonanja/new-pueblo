import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Users = new Mongo.Collection('users');

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('users', function usersPublication() {
    return Users.find();
  });
}

Meteor.methods({
  'users.simulate' (userTypes, requirements, cEfficiency, dEfficiency, capacity, maxChargeRate,
     leakRate, maxHourlyProduction, maxDailyProduction) {

      console.log(userTypes);
      console.log(requirements);
      console.log(cEfficiency);
      console.log(dEfficiency);
      console.log(capacity);
      console.log(maxChargeRate);
      console.log(leakRate);
      console.log(maxHourlyProduction);
      console.log(maxDailyProduction);


    check(userTypes, Array);
    check(userTypes[0], Number);
    check(userTypes[1], Number);
    check(userTypes[2], Number);
    check(requirements, Number);
    check(cEfficiency, Number);
    check(dEfficiency, Number);
    check(capacity, Number);
    check(maxChargeRate, Number);
    check(leakRate, Number);
    check(maxHourlyProduction, Number);
    check(maxDailyProduction , Number);

    // Make sure the user is logged in before inserting a task
    // if (! Meteor.userId()) {
    //   throw new Meteor.Error('not-authorized');
    // }

    // insert storers
    for(i = 1; i <= userTypes[0]; i++) {
      Users.insert({
        id: i,
        hasStore: True,
        hasGen: True,
        // e_n: drawConsumption()
      });
    }

    for(i = userTypes[0]+1; i <= userTypes[1]; i++) {
      Users.insert({
        id: i,
        hasStore: True,
        hasGen: False,
        // e_n: drawConsumption()
      });
    }

    for(i = userTypes[1]+1; i <= userTypes[2]; i++) {
      Users.insert({
        id: i,
        hasStore: False,
        hasGen: True,
        // e_n: drawConsumption()
      });
    }


  },

});
