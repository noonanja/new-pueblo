import { Meteor } from 'meteor/meteor';

import { Users } from '../users.js';

import { Schema } from '../../schema.js';

Meteor.publish('users', function usersPublication() {
  return Users.find({fields: Schema.PublicFields.Users});
});
