export const Constraints = {}

Constraints.userCount = 30;
Constraints.maxActive = 18;

// Constraints.userCount = 760;
// Constraints.maxActive = 240;

Constraints.defaultUserTypes = [4, 8, 12];
Constraints.defaultStep = 2;
// const defaultUserTypes= [40, 80, 120];
// const defaultStep = 5;

Constraints.defaultCEfficiency = 90;
Constraints.defaultDEfficiency = 110;
Constraints.defaultCapacity = 4.0;
Constraints.defaultMaxChargeRate = .125*Constraints.defaultCapacity;
Constraints.defaultLeakRate = 5;
Constraints.defaultMaxHourlyProduction = 6;
Constraints.defaultMaxDailyProduction = 7;
