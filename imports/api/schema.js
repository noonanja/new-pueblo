export const Schema = {};
Schema.publicFields = {};


Schema.users = new SimpleSchema({
  initial: { type: Boolean },
  hasStore: { type: Boolean },
  hasGen: { type: Boolean },
});

Schema.publicFields.Users = {
  initial: 1,
  hasGen: 1,
  hasStore: 1,
};


Schema.loads = new SimpleSchema({
  userId: { type: String},
  initial: { type: Boolean },
  l: {type: [Number], decimal: true},
  e: {type: [Number], decimal: true},
  s: {type: [Number], decimal: true, optional: true},
  g: {type: [Number], decimal: true, optional: true},
});

Schema.publicFields.Loads = {
  userId: 1,
  initial: 1,
  l:1,
  e:1,
  s:1,
  g:1,
};


Schema.aggLoads = new SimpleSchema({
  initial: { type: Boolean },
  active: {type: Boolean},
  n : {type: Number},
  l: {type: [Number], decimal: true},
});

Schema.publicFields.AggLoads = {
  initial: 1,
  active: 1,
  n:1,
  l:1,
};


Schema.formInput = new SimpleSchema({
  userTypes: {type: [Number]},
  requirements: {type: Number},
  cEfficiency: {type: Number},
  dEfficiency: {type: Number},
  capacity: {type: Number},
  maxChargeRate: {type: Number},
  leakRate: {type: Number},
  maxHourlyProduction: {type: Number},
  maxDailyProduction: {type: Number},
});
