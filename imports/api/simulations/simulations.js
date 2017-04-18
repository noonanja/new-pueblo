import { simulate } from './methods.js';


export const Simulations = new Mongo.Collection('simulations');

// Deny all client-side updates since we will be using methods to manage this collection
Simulations.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});
