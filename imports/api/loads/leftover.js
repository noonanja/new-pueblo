// import { Meteor } from 'meteor/meteor';
// import { Mongo } from 'meteor/mongo';
//
//
//
// Loads.publicFields = {
//   userId: 1,
//   e: 1,
//   // s_n: 1,
//   // g_n: 1,
// };
//
// // Deny all client-side updates since we will be using methods to manage this collection
// Loads.deny({
//   insert() { return true; },
//   update() { return true; },
//   remove() { return true; },
// });
//
// if (Meteor.isServer) {
//   // This code only runs on the server
//   Meteor.publish('aggLoad', function loadsPublication() {
//     let group = {
//       _id: null,
//       'agg1':  {$sum: '$e.h1'},  'agg2':  {$sum: '$e.h2'},  'agg3':  {$sum: '$e.h3'},
//       'agg4':  {$sum: '$e.h4'},  'agg5':  {$sum: '$e.h5'},  'agg6':  {$sum: '$e.h6'},
//       'agg7':  {$sum: '$e.h7'},  'agg8':  {$sum: '$e.h8'},  'agg9':  {$sum: '$e.h9'},
//       'agg10': {$sum: '$e.h10'}, 'agg11': {$sum: '$e.h11'}, 'agg12': {$sum: '$e.h12'},
//       'agg13': {$sum: '$e.h13'}, 'agg14': {$sum: '$e.h14'}, 'agg15': {$sum: '$e.h15'},
//       'agg16': {$sum: '$e.h16'}, 'agg17': {$sum: '$e.h17'}, 'agg18': {$sum: '$e.h18'},
//       'agg19': {$sum: '$e.h19'}, 'agg20': {$sum: '$e.h20'}, 'agg21': {$sum: '$e.h21'},
//       'agg22': {$sum: '$e.h22'}, 'agg23': {$sum: '$e.h23'}, 'agg24': {$sum: '$e.h24'}
//     }
//     let aggregation = Loads.aggregate(
//       // {$match: filter},
//       {$group: group}
//     );
//     aggregation = _.values(aggregation[0]);
//     aggregation.splice(0,1);
//     console.log(aggregation);
//     // return aggregation;
//     return Loads.find({fields: Loads.publicFields});
//   });
// }
//
// if (Meteor.isServer) {
//   // This code only runs on the server
//   Meteor.publish('aggLoads', function loadsPublication() {
//     // let group = {
//     //   _id: null,
//     //   'agg1':  {$sum: '$e.h1'},  'agg2':  {$sum: '$e.h2'},  'agg3':  {$sum: '$e.h3'},
//     //   'agg4':  {$sum: '$e.h4'},  'agg5':  {$sum: '$e.h5'},  'agg6':  {$sum: '$e.h6'},
//     //   'agg7':  {$sum: '$e.h7'},  'agg8':  {$sum: '$e.h8'},  'agg9':  {$sum: '$e.h9'},
//     //   'agg10': {$sum: '$e.h10'}, 'agg11': {$sum: '$e.h11'}, 'agg12': {$sum: '$e.h12'},
//     //   'agg13': {$sum: '$e.h13'}, 'agg14': {$sum: '$e.h14'}, 'agg15': {$sum: '$e.h15'},
//     //   'agg16': {$sum: '$e.h16'}, 'agg17': {$sum: '$e.h17'}, 'agg18': {$sum: '$e.h18'},
//     //   'agg19': {$sum: '$e.h19'}, 'agg20': {$sum: '$e.h20'}, 'agg21': {$sum: '$e.h21'},
//     //   'agg22': {$sum: '$e.h22'}, 'agg23': {$sum: '$e.h23'}, 'agg24': {$sum: '$e.h24'}
//     // }
//     // let aggregation = Loads.aggregate(
//     //   // {$match: filter},
//     //   {$group: group}
//     // );
//     // aggregation = _.values(aggregation[0]);
//     // aggregation.splice(0,1);
//     // console.log(aggregation);
//     // return aggregation;
//     return Loads.find({fields: Loads.publicFields});
//   });
// }
