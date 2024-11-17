// src/utils/billUtils.ts
import { MonthlyBills, MonthlyTotals, ChartDataPoint } from '../types';

// Function to calculate total emissions from energy usage
export const calculateEmissions = (usage: number, type: string): number => {
  // Emission factors (kg CO2 per unit)
  const emissionFactors: { [key: string]: number } = {
    electricity: 0.92, // kg CO2 per kWh
    heating: 0.18,    // kg CO2 per kWh of natural gas
    water: 0.419      // kg CO2 per cubic meter
  };

  return usage * (emissionFactors[type] || 0);
};

// Function to calculate monthly totals
export const calculateMonthlyData = (files: MonthlyBills) => {
  const monthlyTotals: MonthlyTotals = {};
  let annualEmissions = 0;
  let annualCost = 0;

  Object.entries(files).forEach(([month, monthData]) => {
    let monthlyEmissions = 0;
    let monthlyCost = 0;

    Object.entries(monthData).forEach(([type, fileData]) => {
      if (fileData?.data) {
        monthlyEmissions += calculateEmissions(fileData.data.usage, type);
        monthlyCost += fileData.data.cost;
      }
    });

    monthlyTotals[month] = {
      emissions: monthlyEmissions,
      cost: monthlyCost
    };

    annualEmissions += monthlyEmissions;
    annualCost += monthlyCost;
  });

  return {
    monthlyTotals,
    annualEmissions,
    annualCost
  };
};

// Function to format monthly data for charts
export const formatMonthlyDataForChart = (monthlyTotals: MonthlyTotals): ChartDataPoint[] => {
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  return months.map(month => ({
    month,
    emissions: monthlyTotals[month]?.emissions || 0
  }));
};