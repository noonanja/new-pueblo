import { Users } from '../../api/users/users.js';
import { AggLoads } from '../../api/aggLoads/aggLoads.js';
import { Constraints } from '/lib/constraints.js';

// if the database is empty on server start, create some sample data.
Meteor.startup(() => {
  if (Users.find({hasStore: false, hasGen: false}).count() === 0) {
    // Prepare AggLoads for the initial and final AggLoads
    AggLoads.insert({
      initial: true,
      active: false,
      n: 0,
      l: [],
    });

    AggLoads.insert({
      initial: false,
      active: false,
      n: 0,
      l: [],
    });

    // Add a grid full of passive users
    for (i = 0; i < Constraints.userCount; i++) {
      Users.insert({
        hasStore: false,
        hasGen: false,
      });
    }
  }
});
