import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

// export const Users = new Mongo.Collection('users'); // Mongo server Collection
export const Users = new Mongo.Collection(null); // local Collection


if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('users', function usersPublication() {
    return Users.find();
  });
}

Meteor.methods({
  'users.simulate' ({userTypes, requirements, cEfficiency, dEfficiency,
                    capacity, maxChargeRate, leakRate, maxHourlyProduction,
                    maxDailyProduction}) {
    new SimpleSchema({
      userTypes: {type: [Number]},
      requirements: {type: Number},
      cEfficiency: {type: Number},
      dEfficiency: {type: Number},
      capacity: {type: Number},
      maxChargeRate: {type: Number},
      leakRate: {type: Number},
      maxHourlyProduction: {type: Number},
      maxDailyProduction: {type: Number},
    }).validate({userTypes, requirements, cEfficiency, dEfficiency, capacity,
                maxChargeRate, leakRate, maxHourlyProduction, maxDailyProduction});

    // Make sure the user is logged in before inserting a task
    // if (! Meteor.userId()) {
    //   throw new Meteor.Error('not-authorized');
    // }

    Users.remove({});

    // insert storers
    for(i = 1; i <= userTypes[0]; i++) {
      Users.insert({
        id: i,
        hasStore: true,
        hasGen: true,
        // e_n: drawConsumption()
      });
    }

    for(i = userTypes[0]+1; i <= userTypes[1]; i++) {
      Users.insert({
        id: i,
        hasStore: true,
        hasGen: false,
        // e_n: drawConsumption()
      });
    }

    for(i = userTypes[1]+1; i <= userTypes[2]; i++) {
      Users.insert({
        id: i,
        hasStore: false,
        hasGen: true,
        // e_n: drawConsumption()
      });
    }

    console.log(Users.find().count());

  },

});
