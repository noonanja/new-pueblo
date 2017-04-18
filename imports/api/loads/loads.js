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
    // remove this load from the aggregation
    denormalizers.beforeUpdateLoads(selector, modifier);
    const result = super.update(selector, modifier);
    // add the updated load back to the aggregation
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
