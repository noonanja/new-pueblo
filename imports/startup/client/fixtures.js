import { Users } from '../../api/users/users.js';
import { Constraints } from '/lib/constraints.js';

// if the database is empty on server start, create some sample data.
Meteor.startup(() => {
  if (Users.find({initial: true, hasStore: false, hasGen: false}).count() === 0) {
    // Add a grid full of passive users
    for (i = 0; i < Constraints.userCount; i++) {
      Users.insert({
        initial: true,
        hasStore: false,
        hasGen: false,
      });
    }
  }
});
