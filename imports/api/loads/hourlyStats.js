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
  return consumptionDistribution.map(function(distr) {
    return distr.ppf(Math.random());
  });
}

const kNight = 6.625e-7;
const kDay   = 1.5*kNight;

export const gridK = {
    1:	kNight,
    2:	kNight,
    3:	kNight,
    4:	kNight,
    5:	kNight,
    6:	kNight,
    7:	kNight,
    8:	kNight,
    9:	kDay,
    10:	kDay,
    11:	kDay,
    12:	kDay,
    13:	kDay,
    14:	kDay,
    15:	kDay,
    16:	kDay,
    17:	kDay,
    18:	kDay,
    19:	kDay,
    20:	kDay,
    21:	kDay,
    22:	kDay,
    23:	kDay,
    24:	kDay,
};
