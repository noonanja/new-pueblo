var gaussian = require('gaussian');

const hourlyMeanVariance = [
  {mean: 1.22, vrnc: 0.006},
  {mean: 1.17, vrnc: 0.005},
  {mean: 1.14, vrnc: 0.005},
  {mean: 1.13, vrnc: 0.005},
  {mean: 1.1, vrnc: 0.005},
  {mean: 1.20, vrnc: 0.006},
  {mean: 1.28, vrnc: 0.006},
  {mean: 1.35, vrnc: 0.006},
  {mean: 1.39, vrnc: 0.006},
  {mean: 1.43, vrnc: 0.006},
  {mean: 1.45, vrnc: 0.007},
  {mean: 1.47, vrnc: 0.007},
  {mean: 1.49, vrnc: 0.008},
  {mean: 1.50, vrnc: 0.009},
  {mean: 1.51, vrnc: 0.009},
  {mean: 1.51, vrnc: 0.010},
  {mean: 1.53, vrnc: 0.01},
  {mean: 1.56, vrnc: 0.01},
  {mean: 1.56, vrnc: 0.01},
  {mean: 1.55, vrnc: 0.01},
  {mean: 1.53, vrnc: 0.01},
  {mean: 1.48, vrnc: 0.01},
  {mean: 1.39, vrnc: 0.01},
  {mean: 1.30, vrnc: 0.01},
]

const consumptionDistribution = hourlyMeanVariance.map(function({mean, vrnc}) {
  return gaussian(mean, vrnc);
})

export function drawConsumption() {
  a= consumptionDistribution.reduce(function(result, distr, i) {
    result[`h${i+1}`] = distr.ppf(Math.random());
    return result;
  }, {});
  // a =  consumptionDistribution.map(function(distribution) {
  //   return distribution.ppf(Math.random());
  // });
  // console.log(a);
  return a;
}
