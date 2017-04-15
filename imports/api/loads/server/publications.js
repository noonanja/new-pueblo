// import { Meteor } from 'meteor/meteor';
//
// import { Loads } from '../loads.js';
// import { Users } from '../users/users.js';
//
// import { Schema } from '../../schema.js';
//
// Meteor.publish('activeLoads', function consolePublication() {
//   const activeUserIds = Users.find({ $or: [{hasStore: true}, {hasGen: true}] }).map(function(doc) {
//     return doc._id;
//   });
//   return Loads.find({userId: {$in: activeUserIds}}, {fields: Schema.PublicFields.Loads});
// });
