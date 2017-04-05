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
  return consumptionDistribution.reduce(function(result, distr, i) {
    result[`h${i+1}`] = distr.ppf(Math.random());
    return result;
  }, {});
}

export const gridPrices = {
    1:	0.106,
    2:	0.106,
    3:	0.106,
    4:	0.106,
    5:	0.106,
    6:	0.106,
    7:	0.106,
    8:	0.106,
    9:	0.159,
    10:	0.159,
    11:	0.159,
    12:	0.159,
    13:	0.159,
    14:	0.159,
    15:	0.159,
    16:	0.159,
    17:	0.159,
    18:	0.159,
    19:	0.159,
    20:	0.159,
    21:	0.159,
    22:	0.159,
    23:	0.159,
    24:	0.159,
};
