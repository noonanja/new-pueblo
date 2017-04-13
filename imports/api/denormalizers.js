import { Users } from './users/users.js';
import { Loads } from './loads/loads.js';
import { AggLoads } from './aggLoads/aggLoads.js';

import { Constraints } from '/lib/constraints.js';

import { drawConsumption } from './loads/hourlyStats.js';

import { check } from 'meteor/check';

export const denormalizers = {
  /////////// AggLoads denormalizer ///////////
  _updateAggLoads(load, addingLoad) {
    // if we are still building the initial aggregate load, use update on both the initial
    // aggregate load document and the final passive load document
    const initialAggLoad = AggLoads.findOne({initial: true});
    const user = Users.findOne(load.userId);
    let query = {active: (user.hasStore || user.hasGen), initial: false};
    if (!!initialAggLoad) {
      if (initialAggLoad.n < Constraints.userCount) {
        query = {active: (user.hasStore || user.hasGen)};
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
            active: (user.hasStore || user.hasGen),
            n: 1,
            l: load.l,
        },
      },
      // use "multi" to update both the document for the initial load
      // and the document being used for the aggregate final load
      {upsert: true, multi: true},
    );
  },

  _loadUpdateHelper(selector, addingLoad) {
    Loads.find(selector).forEach((load) => {
      this._updateAggLoads(load, addingLoad);
    });
  },

  /////////// Users Denormalizer ///////////
  afterInsertUsers(userId, hasStore, hasGen) {
    const le = drawConsumption();
    // Initialize active users with no storage/ generation strategies
    const s = Array.apply(null, Array(24)).map(Number.prototype.valueOf, 0);
    const g = Array.apply(null, Array(24)).map(Number.prototype.valueOf, 0);
    Loads.insert({
      userId: userId,
      l: le,
      e: le,
      s: s,
      g: g,
    });
  },
  beforeUpdateUsers(selector, modifier) {
    // We only support very limited operations directly on users and loads
    check(modifier, { $set: Object });
    const ids = Users.find(selector).map(function(user) {
      return user._id;
    });
    this._loadUpdateHelper({userId: {$in: ids}}, false);
  },
  afterUpdateUsers(selector, modifier) {
    const ids = Users.find(selector).map(function(user) {
      return user._id;
    });
    this._loadUpdateHelper({userId: {$in: ids}}, true);
  },
  afterRemoveUsers(selector) {
    Users.find(selector).forEach((user) => {
      Loads.remove({userId: user._id});
    });
  },

  /////////// Loads Denormalizer ///////////
  afterInsertLoads(load) {
    return this._loadUpdateHelper(load._id, true);
  },
  beforeUpdateLoads(selector, modifier) {
    check(modifier, { $set: Object });
    this._loadUpdateHelper(selector, false);
  },
  afterUpdateLoads(selector, modifier) {
    this._loadUpdateHelper(selector, true);
  },
  beforeRemoveLoads(selector) {
    this._loadUpdateHelper(selector, false);
  },

};
