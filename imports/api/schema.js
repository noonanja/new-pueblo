export const Schema = {};
Schema.publicFields = {};

Schema.schedule = new SimpleSchema(

  // _.range(1, 25).reduce(function(acc, cur, i) {
  //     acc[`h${i+1}`] =  {type: Number, decimal: true};
  //     return acc;
  // }, {})
);


Schema.aggLoads = new SimpleSchema({
  active: {type: Boolean},
  n : {type: Number},
  l: {type: [Number], decimal: true},
});

Schema.publicFields.AggLoads = {
  active: 1,
  n:1,
  l:1,
};

Schema.loads = new SimpleSchema({
  userId: { type: String},
  l: {type: [Number], decimal: true},
  e: {type: [Number], decimal: true},
  s: {type: [Number], decimal: true, optional: true},
  g: {type: [Number], decimal: true, optional: true},
  // ts: {type: Date},
});

Schema.publicFields.Loads = {
  userId: 1,
  l:1,
  e:1,
  s:1,
  g:1,
};

Schema.users = new SimpleSchema({
  hasStore: { type: Boolean },
  hasGen: { type: Boolean },
});

Schema.publicFields.Users = {
  hasGen: 1,
  hasStore: 1,
};
