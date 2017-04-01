import { Meteor } from 'meteor/meteor';
import { AggLoads } from '../../api/loads/loads.js';

// if the database is empty on server start, create some sample data.
Meteor.startup(() => {
  if (AggLoads.find().count() === 0) {
    console.log("ahahahha");
    const data = [
      {
        passive: true,
        l: [
          h1: 0, h2: 0, h3: 0, h4: 0, h5: 0, h6: 0, h7: 0, h8: 0, h9: 0,
          h10: 0, h11: 0, h12: 0, h13: 0, h14: 0, h15: 0, h16: 0, h17: 0,
          h18: 0, h19: 0, h20: 0, h21: 0, h22: 0, h23: 0, h24: 0,
        ],
        passive: false,
        l: [
          h1: 0, h2: 0, h3: 0, h4: 0, h5: 0, h6: 0, h7: 0, h8: 0, h9: 0,
          h10: 0, h11: 0, h12: 0, h13: 0, h14: 0, h15: 0, h16: 0, h17: 0,
          h18: 0, h19: 0, h20: 0, h21: 0, h22: 0, h23: 0, h24: 0,
        ],
      },

    data.forEach((aggregation) => {
      AggLoads.insert({
        passive: aggregation.passive,
        l: aggregation.l,
      });
    });
  }
});
