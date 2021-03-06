export const Constraints = {}

Constraints.userCount = 30;
Constraints.maxActive = 18;
Constraints.defaultUserTypes = [4, 8, 12];
Constraints.defaultStep = 2;

// Constraints.userCount = 1000;
// Constraints.maxActive = 240;
// Constraints.defaultUserTypes= [40, 80, 120];
// Constraints.defaultStep = 5;

Constraints.defaultCEfficiency = 90.0;
Constraints.defaultDEfficiency = 110.0;
Constraints.defaultCapacity = 4.0;
Constraints.defaultMaxChargeRate = .125*Constraints.defaultCapacity; // divide by h?
Constraints.defaultLeakRate = 99.6;


Constraints.defaultMaxHourlyProduction = 6;
Constraints.defaultMaxDailyProduction = 7;
