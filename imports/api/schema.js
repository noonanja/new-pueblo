export const Schema = {};

Schema.consumption = new SimpleSchema({
  h1: {type: Number, decimal: true},
  h2: {type: Number, decimal: true},
  h3: {type: Number, decimal: true},
  h4: {type: Number, decimal: true},
  h5: {type: Number, decimal: true},
  h6: {type: Number, decimal: true},
  h7: {type: Number, decimal: true},
  h8: {type: Number, decimal: true},
  h9: {type: Number, decimal: true},
  h10: {type: Number, decimal: true},
  h11: {type: Number, decimal: true},
  h12: {type: Number, decimal: true},
  h13: {type: Number, decimal: true},
  h14: {type: Number, decimal: true},
  h15: {type: Number, decimal: true},
  h16: {type: Number, decimal: true},
  h17: {type: Number, decimal: true},
  h18: {type: Number, decimal: true},
  h19: {type: Number, decimal: true},
  h20: {type: Number, decimal: true},
  h21: {type: Number, decimal: true},
  h22: {type: Number, decimal: true},
  h23: {type: Number, decimal: true},
  h24: {type: Number, decimal: true},
});

AggSchema = new SimpleSchema([Schema.consumption, {active: {type: Boolean} }]);

Schema.loads = new SimpleSchema({
  userId: { type: String},
  e: {type: Schema.consumption},
  // ts: {type: Date},
});
