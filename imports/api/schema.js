export const Schema = {};

Schema.consumption = new SimpleSchema({
  h1: {type: Number, decimal: true, defaultValue: 0},
  h2: {type: Number, decimal: true, defaultValue: 0},
  h3: {type: Number, decimal: true, defaultValue: 0},
  h4: {type: Number, decimal: true, defaultValue: 0},
  h5: {type: Number, decimal: true, defaultValue: 0},
  h6: {type: Number, decimal: true, defaultValue: 0},
  h7: {type: Number, decimal: true, defaultValue: 0},
  h8: {type: Number, decimal: true, defaultValue: 0},
  h9: {type: Number, decimal: true, defaultValue: 0},
  h10: {type: Number, decimal: true, defaultValue: 0},
  h11: {type: Number, decimal: true, defaultValue: 0},
  h12: {type: Number, decimal: true, defaultValue: 0},
  h13: {type: Number, decimal: true, defaultValue: 0},
  h14: {type: Number, decimal: true, defaultValue: 0},
  h15: {type: Number, decimal: true, defaultValue: 0},
  h16: {type: Number, decimal: true, defaultValue: 0},
  h17: {type: Number, decimal: true, defaultValue: 0},
  h18: {type: Number, decimal: true, defaultValue: 0},
  h19: {type: Number, decimal: true, defaultValue: 0},
  h20: {type: Number, decimal: true, defaultValue: 0},
  h21: {type: Number, decimal: true, defaultValue: 0},
  h22: {type: Number, decimal: true, defaultValue: 0},
  h23: {type: Number, decimal: true, defaultValue: 0},
  h24: {type: Number, decimal: true, defaultValue: 0},
});

AggSchema = new SimpleSchema({active: {type: Boolean}}, [Schema.consumption]);

Schema.loads = new SimpleSchema({
  userId: { type: String},
  e: {type: Schema.consumption},
  // ts: {type: Date},
});
