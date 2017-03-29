import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

import { simulate } from './methods.js';


export const Users = new Mongo.Collection('users'); // Mongo server Collection
// export const Users = new Mongo.Collection(null); // local Collection

Schema = {}
Schema.users = new SimpleSchema({
  _id: { type: String, regEx: SimpleSchema.RegEx.Id },
  hasStore: { type: Boolean },
  hasGen: { type: Boolean },
  e_n: { type: [Number], decimal: true},
  // s_n: { type: [Number], decimal: true, optional: true },
  // g_n: { type: [Number], decimal: true, optional: true },
});
Users.attachSchema(Schema.users);

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
