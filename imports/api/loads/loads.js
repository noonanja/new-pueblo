import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

export const Loads = new Mongo.Collection('loads');

Schema = {}
Schema.loads = new SimpleSchema({
  userId: { type: String},
  e_n: { type: [Number], decimal: true},
  s_n: { type: [Number], decimal: true, optional: true },
  g_n: { type: [Number], decimal: true, optional: true },
});
Loads.attachSchema(Schema.loads);

Loads.publicFields = {
  userId: 1,
  e_n: 1,
  s_n: 1,
  g_n: 1,
};

// Deny all client-side updates since we will be using methods to manage this collection
Loads.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('loads', function loadsPublication() {
    return Loads.find({fields: Loads.publicFields});
  });
}
