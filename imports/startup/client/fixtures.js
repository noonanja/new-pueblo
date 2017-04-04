import { Users } from '../../api/users/users.js';
import { Constraints } from '/lib/constraints.js';

// if the database is empty on server start, create some sample data.
Meteor.startup(() => {
  if (Users.find({hasStore: false, hasGen: false}).count() === 0) {
    // pre-populate grid with some passive users to reduce future insertion
    Meteor.call("users.resize", {count: Constraints.userCount - Constraints.maxActive, hasStore:false, hasGen:false}, (error, result) => {
      if (error) {
        console.log(error);
      }
    });
  }
});
