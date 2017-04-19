import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

import { Schema } from '../schema.js';

import { denormalizers } from '../denormalizers.js';


class LoadsCollection extends Mongo.Collection {
  insert(load, callback) {
    const result = super.insert(load, callback);
    denormalizers.afterInsertLoads(this.findOne(result));
    return result;
  }
  update(selector, modifier) {
    denormalizers.beforeUpdateLoads(selector, modifier);
    const result = super.update(selector, modifier);
    denormalizers.afterUpdateLoads(selector, modifier);
    return result;
  }
  remove(selector, callback) {
    denormalizers.beforeRemoveLoads(selector);
    const result = super.remove(selector, callback);
    return result;
  }
}

export const Loads = new LoadsCollection('loads', { connection: null } );

Loads.attachSchema(Schema.loads);
