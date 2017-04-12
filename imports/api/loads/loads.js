import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

import { Users } from '../users/users.js';
import { AggLoads } from '../aggLoads/aggLoads.js'
import { Schema } from '../schema.js';
import { Constraints } from '/lib/constraints.js';

const aggLoadDenormalizer = {
  _updateAggLoad(load, addingLoad) {
    // if we are still building the initial aggregate load, use update on both the initial
    // aggregate load document and the document for the final passive load
    const initialAggLoad = AggLoads.findOne({initial: true});
    let query = {active: (!!load.s || !!load.g), initial: false};
    if (!!initialAggLoad) {
      if (initialAggLoad.n < Constraints.userCount) {
        query = {active: (!!load.s || !!load.g)};
      }
    }
    const c = addingLoad ? 1 : -1;
    AggLoads.update(
      query,
      {
        $inc: {
            n: c,
            "l.0":  c*load.l[0],
            "l.1":  c*load.l[1],  "l.2":  c*load.l[2],  "l.3":  c*load.l[3],  "l.4":  c*load.l[4],
            "l.5":  c*load.l[5],  "l.6":  c*load.l[6],  "l.7":  c*load.l[7],  "l.8":  c*load.l[8],
            "l.9":  c*load.l[9],  "l.10": c*load.l[10], "l.11": c*load.l[11], "l.12": c*load.l[12],
            "l.13": c*load.l[13], "l.14": c*load.l[14], "l.15": c*load.l[15], "l.16": c*load.l[16],
            "l.17": c*load.l[17], "l.18": c*load.l[18], "l.19": c*load.l[19], "l.20": c*load.l[20],
            "l.21": c*load.l[21], "l.22": c*load.l[22], "l.23": c*load.l[23],
        },
        $setOnInsert: {
            active: (!!load.s || !!load.g),
            n: 1,
            l: load.l,
        },
      },
      // use "multi" to update both the document for the initial load
      // and the document being used for the aggregate final load
      {upsert: true, multi: true},
    );
  },
  afterInsertLoad(load) {
    return this._updateAggLoad(load, true);
  },
  beforeRemoveLoad(load) {
    this._updateAggLoad(load, false);
  },
  beforeUpdateLoad(selector, modifier) {
    // We only support very limited operations directly on loads
    check(modifier, { $set: Object });

    // We can only deal with $set modifiers, but that's all we do in this app
    if (_.has(modifier.$set, 'checked')) {
      Loads.find(selector).forEach((load) => {
        this._updateAggLoad(load, false);
      });
    }
  },
  afterUpdateLoad(selector, modifier) {
    Loads.find(selector).forEach((load) => {
      this._updateAggLoad(load, true);
    });
  }

};

class LoadsCollection extends Mongo.Collection {
  insert(load, callback) {
    const result = super.insert(load, callback);
    aggLoadDenormalizer.afterInsertLoad(this.findOne(result));
    return result;
  }
  update(selector, modifier) {
    // remove this load from the aggregation
    aggLoadDenormalizer.beforeUpdateLoad(selector, modifier);
    const result = super.update(selector, modifier);
    // add the updated load back to the aggregation
    aggLoadDenormalizer.afterUpdateLoad(selector, modifier);
    return result;
  }
  remove(selector, callback) {
    this.find(selector).map(function(load) {
      aggLoadDenormalizer.beforeRemoveLoad(load);
    });
    const result = super.remove(selector, callback);
    return result;
  }
}

export const Loads = new LoadsCollection('loads', { connection: null } );

Loads.attachSchema(Schema.loads);

Loads.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});
