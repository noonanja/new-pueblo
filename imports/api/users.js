import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

import { simulate } from './methods.js';

export const Users = new Mongo.Collection('users'); // Mongo server Collection
// export const Users = new Mongo.Collection(null); // local Collection

Users.schema = new SimpleSchema({
  _id: { type: String, regEx: SimpleSchema.RegEx.Id },
  hasStore: { type: Boolean },
  hasGen: { type: Boolean },
});
Users.attachSchema(Users.schema);

// Deny all client-side updates since we will be using methods to manage this collection
Users.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('users', function usersPublication() {
    return Users.find();
  });
}

Meteor.methods({
  [simulate.name]: function(args) {
    simulate.validate.call(this, args);
    simulate.run.call(this, args);
  },

});
