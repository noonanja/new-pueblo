import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

import { simulate } from './methods.js';


export const Loads = new Mongo.Collection('loads'); // Mongo server Collection
// export const Loads = new Mongo.Collection(null); // local Collection

Schema = {}
Schema.loads = new SimpleSchema({
  _id: { type: String, regEx: SimpleSchema.RegEx.Id },
  userId: { type: String, regEx: SimpleSchema.RegEx.Id, optional: true }, // _id of User
  hasStore: { type: Boolean },
  hasGen: { type: Boolean },
  e_n: { type: [Number], decimal: true },
  // s_n: { type: [Number], decimal: true, optional: true },
  // g_n: { type: [Number], decimal: true, optional: true },
});
Loads.attachSchema(Schema.loads);

// Deny all client-side updates since we will be using methods to manage this collection
Loads.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('loads', function usersPublication() {
    return Loads.find();
  });
}
