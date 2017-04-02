import { Meteor } from 'meteor/meteor';

import { Users } from '../users.js';


Users.publicFields = {
  hasGen: 1,
  hasStore: 1,
};

Meteor.publish('users', function usersPublication() {
  return Users.find({fields: Users.publicFields});
});
