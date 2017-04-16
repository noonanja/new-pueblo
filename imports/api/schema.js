export const Schema = {};
Schema.publicFields = {};


Schema.users = new SimpleSchema({
  hasStore: { type: Boolean },
  hasGen: { type: Boolean },
});

Schema.publicFields.Users = {
  _id: 1,
  hasStore: 1,
  hasGen: 1,
};


Schema.loads = new SimpleSchema({
  _id: { type: String, regEx: SimpleSchema.RegEx.Id },
  userId: { type: String },
  hasStore: { type: Boolean },
  hasGen: { type: Boolean },
  l: {type: [Number], decimal: true},
  e: {type: [Number], decimal: true},
  s: {type: [Number], decimal: true},
  g: {type: [Number], decimal: true},
});

Schema.publicFields.Loads = {
  userId: 1,
  hasStore: 1,
  hasGen: 1,
  l:1,
  e:1,
  s:1,
  g:1,
};


Schema.aggLoads = new SimpleSchema({
  active: {type: Boolean},
  initial: {type: Boolean, optional: true},
  n : {type: Number},
  l: {type: [Number], decimal: true},
});

Schema.publicFields.AggLoads = {
  active: 1,
  initial: 1,
  n:1,
  l:1,
};

Schema.formInput = new SimpleSchema({
  userTypes: {type: [Number], decimal: true},
  cEfficiency: {type: Number, decimal: true},
  dEfficiency: {type: Number, decimal: true},
  capacity: {type: Number, decimal: true},
  maxChargeRate: {type: Number, decimal: true},
  leakRate: {type: Number, decimal: true},
  maxHourlyProduction: {type: Number, decimal: true},
  maxDailyProduction: {type: Number, decimal: true},
});

Schema.Console = new SimpleSchema({
  name: {type: String},
  timestamp: {type: Date},
  requirements: {type: Schema.formInput},
  passiveLoadValues: {type: [Number]},
  activeAggLoad: {type: [Number]},
  activeLoads: {type: [Schema.loads]},
  error: {type: String, optional: true}
});

Schema.publicFields.Console = {
  _id: 1,
  name: 1,
  timestamp: 1,
  requirements: 1,
  passiveLoadValues: 1,
  activeAggLoad: 1,
  activeLoads: 1,
  error: 1,
};
