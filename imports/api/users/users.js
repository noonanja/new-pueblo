import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

import { simulate } from './methods.js';

import { Schema } from '../schema.js';
import { denormalizers } from '../denormalizers.js';


class UsersCollection extends Mongo.Collection {
  insert(user, callback) {
    // Call the original `insert` method, which will validate against the schema
    const result = super.insert(user, callback);
    denormalizers.afterInsertUsers(result, user.hasStore, user.hasGen);
    return result;
  }
  update(selector, modifier) {
    denormalizers.beforeUpdateUsers(modifier);
    const result = super.update(selector, modifier);
    denormalizers.afterUpdateUsers(selector, modifier);
    return result;
  }
  remove(selector, callback) {
    const result = super.remove(selector, callback);
    loadsDenormalizer.afterRemoveUsers(selector);
  }
}

export const Users = new UsersCollection('users', { connection: null } ); // local Collection

Users.attachSchema(Schema.users);
