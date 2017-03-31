import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

export const Loads = new Mongo.Collection('loads');


Schema = {}
Schema.consumption = new SimpleSchema({
  "h1": {type: Number, decimal: true},
  "h2": {type: Number, decimal: true},
  "h3": {type: Number, decimal: true},
  "h4": {type: Number, decimal: true},
  "h5": {type: Number, decimal: true},
  "h6": {type: Number, decimal: true},
  "h7": {type: Number, decimal: true},
  "h8": {type: Number, decimal: true},
  "h9": {type: Number, decimal: true},
  "h10": {type: Number, decimal: true},
  "h11": {type: Number, decimal: true},
  "h12": {type: Number, decimal: true},
  "h13": {type: Number, decimal: true},
  "h14": {type: Number, decimal: true},
  "h15": {type: Number, decimal: true},
  "h16": {type: Number, decimal: true},
  "h17": {type: Number, decimal: true},
  "h18": {type: Number, decimal: true},
  "h19": {type: Number, decimal: true},
  "h20": {type: Number, decimal: true},
  "h21": {type: Number, decimal: true},
  "h22": {type: Number, decimal: true},
  "h23": {type: Number, decimal: true},
  "h24": {type: Number, decimal: true},
});

Schema.loads = new SimpleSchema({
  userId: { type: String},
  e: {type: Schema.consumption, defaultValue: {}},
  // ts: {type: Date},
});
Loads.attachSchema(Schema.loads);

Loads.publicFields = {
  userId: 1,
  e_n: 1,
  // s_n: 1,
  // g_n: 1,
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
