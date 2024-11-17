import React, { useState } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Upload, AlertTriangle, PlayCircle } from 'lucide-react';
import { waterParkData } from './waterParkData.ts';




interface BillParserProps {
  onBillsParsed: (bills: any, analysis: any) => void;
  buildingId: string;
}

interface ParsedBill {
  month: string;
  type: string;
  usage: number;
  cost: number;
}

const BillParser: React.FC<BillParserProps> = ({ onBillsParsed, buildingId }) => {
  const [analysis, setAnalysis] = useState<{
    totalEmissions: number;
    emissionsByType: { [key: string]: number };
    recommendations: string[];
  } | null>(null);

  const handleAutoFill = () => {
    try {
      // Parse the original data
      const parsedBills = parseBillContent(waterParkData);
      
      // Add random variations to each bill
      const randomizedBills = parsedBills.map(bill => {
        // Random variation between -1000 and +1000 dollars
        const costVariation = (Math.random() - 0.5) * 700;
        
        // Calculate usage variation proportionally to cost variation
        const usageVariation = (costVariation / bill.cost) * bill.usage;
  
        return {
          ...bill,
          cost: Math.max(100, bill.cost + costVariation), // Ensure cost doesn't go below $100
          usage: Math.max(
            bill.type === 'electricity' ? 1000 : // min 1000 kWh
            bill.type === 'water' ? 10000 :      // min 10000 gallons
            50,                                  // min 50 therms
            bill.usage + usageVariation
          )
        };
      });
  
      const analysisResult = analyzeEmissions(randomizedBills);
      setAnalysis(analysisResult);
      
      // Convert to the format expected by the app
      const formattedBills = randomizedBills.reduce((acc, bill) => {
        if (!acc[bill.month]) acc[bill.month] = {};
        acc[bill.month][bill.type] = {
          fileName: 'HF-waterpark-data.txt',
          data: {
            usage: Math.round(bill.usage), // Round to whole numbers
            cost: Math.round(bill.cost * 100) / 100 // Round to 2 decimal places
          }
        };
        return acc;
      }, {} as any);
  
      onBillsParsed(formattedBills, analysisResult);
    } catch (error) {
      console.error('Error processing water park data:', error);
    }
  };

  const parseBillContent = (content: string): ParsedBill[] => {
    const lines = content.split('\n');
    const bills: ParsedBill[] = [];
    
    let currentBill: Partial<ParsedBill & { unit?: string }> = {};
    
    lines.forEach(line => {
      const monthMatch = line.match(/Month:\s*(\w+)/);
      const typeMatch = line.match(/Type:\s*(electricity|water|heating)/i);
      const usageMatch = line.match(/Usage:\s*([\d,]+)\s*(kWh|gallons|therms)/);
      const costMatch = line.match(/Cost:\s*\$?([\d,]+\.?\d*)/);

      if (monthMatch) currentBill.month = monthMatch[1];
      if (typeMatch) currentBill.type = typeMatch[1].toLowerCase();
      if (usageMatch) {
        currentBill.usage = parseFloat(usageMatch[1].replace(/,/g, ''));
        currentBill.unit = usageMatch[2];
      }
      if (costMatch) {
        currentBill.cost = parseFloat(costMatch[1].replace(/[$,]/g, ''));
        
        if (currentBill.month && currentBill.type && currentBill.usage && currentBill.cost) {
            bills.push(currentBill as ParsedBill);
            currentBill = {};
          }
        }
    });

    return bills;

  };

  const calculateEmissions = (usage: number, type: string, unit?: string): number => {
    // First, convert all units to a standardized form
    const standardizedUsage = standardizeUnits(usage, type, unit);
    
    // Emission factors (kg CO2 per standardized unit)
    const emissionFactors = {
      electricity: 0.417,     // kg CO2 per kWh
      heating: 5.3,         // kg CO2 per therm (natural gas)
      water: 0.008      // kg CO2 per gallon
    };
  
    return standardizedUsage * emissionFactors[type as keyof typeof emissionFactors];
  };

  const standardizeUnits = (usage: number, type: string, unit?: string): number => {
    switch(type) {
      case 'electricity':
        // Already in kWh
        return usage;
      case 'heating':
        // Convert to therms if not already
        if (unit === 'kWh') {
          return usage / 29.3; // 1 therm = 29.3 kWh
        }
        return usage;
      case 'water':
        // Already in gallons
        return usage;
      default:
        return usage;
    }
  };
  

  const analyzeEmissions = (bills: ParsedBill[]) => {
    const emissionsByType: { [key: string]: number } = {
      electricity: 0,
      heating: 0,
      water: 0
    };
    const costsByType: { [key: string]: number } = {
        electricity: 0,
        heating: 0,
        water: 0
      };


    let totalEmissions = 0;

    bills.forEach(bill => {
        const emissions = calculateEmissions(bill.usage, bill.type);
        emissionsByType[bill.type] += emissions;
        costsByType[bill.type] += bill.cost;
        totalEmissions += emissions;
      });

    // Generate recommendations
    const recommendations = [];
    const highestEmitter = Object.entries(emissionsByType)
      .sort(([, a], [, b]) => b - a)[0][0];

    recommendations.push(`Your highest emissions come from ${highestEmitter}.`);

    if (highestEmitter === 'electricity') {
      recommendations.push('Consider installing LED lighting and energy-efficient appliances.');
      recommendations.push('Implement smart building controls to optimize energy usage.');
    } else if (highestEmitter === 'heating') {
      recommendations.push('Improve building insulation to reduce heat loss.');
      recommendations.push('Consider upgrading to a more efficient heating system.');
    } else if (highestEmitter === 'water') {
      recommendations.push('Install water-efficient fixtures and appliances.');
      recommendations.push('Check for and repair any water leaks.');
    }
    // Add cost-based recommendations
    const highestCost = Object.entries(costsByType)
      .sort(([, a], [, b]) => b - a)[0][0];
    
    if (highestCost == highestEmitter) {
      recommendations.push(`Your highest cost comes from ${highestCost} consumption.`);
      recommendations.push('Consider focusing on both emission and cost reduction strategies.');
    }
    return {
      totalEmissions,
      emissionsByType,
      costsByType,
      recommendations
    };
  };

  const COLORS = ['#047857', '#059669', '#10B981'];

  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-sm">
          <p className="text-sm font-medium">{payload[0].name}</p>
          <p className="text-sm text-green-600">
            ${payload[0].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };


  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
  
    try {
      const text = await file.text();
      const parsedBills = parseBillContent(text);
      const analysisResult = analyzeEmissions(parsedBills);
      setAnalysis(analysisResult);
      
      // Convert to the format expected by the app
      const formattedBills = parsedBills.reduce((acc, bill) => {
        if (!acc[bill.month]) acc[bill.month] = {};
        acc[bill.month][bill.type] = {
          fileName: file.name,
          data: {
            usage: bill.usage,
            cost: bill.cost
          }
        };
        return acc;
      }, {} as any);
  
      onBillsParsed(formattedBills, analysisResult);
    } catch (error) {
      console.error('Error parsing bills:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-center space-x-4">  {/* Added space-x-4 for horizontal spacing */}
        <label className="cursor-pointer bg-green-700 text-white px-6 py-3 rounded-lg hover:bg-green-800 transition-colors flex items-center gap-2">
          <Upload size={20} />
          Upload Yearly Bills
          <input
            type="file"
            accept=".txt"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
        <button
          onClick={handleAutoFill}
          className="bg-green-700 text-white px-6 py-3 rounded-lg hover:bg-green-800 transition-colors flex items-center gap-2"
        >
          <PlayCircle size={20} />
          Load Water Park Data
        </button>
      </div>
      {analysis && (
        <div className="space-y-6">
          {/* Analysis Alert */}
          <div className="bg-green-50 border-l-4 border-green-700 p-4">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-green-700 mr-2" />
              <div>
                <h3 className="text-green-700 font-medium">Emissions Analysis</h3>
                <p className="text-green-600">
                  Total emissions: {analysis.totalEmissions.toLocaleString()} kg CO₂/year
                </p>
                <p className="text-green-600">
                  Total cost: ${Object.values(analysis.costsByType)
                    .reduce((a, b) => a + b, 0)
                    .toLocaleString()}/year
                </p>
              </div>
            </div>
          </div>

          {/* Emissions Bar Chart */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold mb-4">CO₂ Emissions by Category</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={Object.entries(analysis.emissionsByType).map(([name, value]) => ({
                    name: name.charAt(0).toUpperCase() + name.slice(1),
                    emissions: value
                  }))}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => `${(value / 1000).toFixed(1)}k`} />
                  <Tooltip
                    formatter={(value: number) => [`${value.toLocaleString()} kg`, 'CO₂ Emissions']}
                  />
                  <Bar dataKey="emissions" fill="#16a34a" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

                {/* Cost Distribution Pie Chart - Alternative Style */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Cost Breakdown by Category</h3>
        <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Pie
                data={Object.entries(analysis.costsByType).map(([name, value], index) => ({
                    name: name.charAt(0).toUpperCase() + name.slice(1),
                    value: value,
                    displayValue: `$${value.toLocaleString()}`
                }))}
                cx="50%"
                cy="50%"
                labelLine={{
                    stroke: '#047857',
                    strokeWidth: 1
                }}
                label={({
                    cx,
                    cy,
                    midAngle,
                    innerRadius,
                    outerRadius,
                    name,
                    displayValue
                }) => {
                    const RADIAN = Math.PI / 180;
                    const radius = outerRadius * 1.2;
                    const x = cx + radius * Math.cos(-midAngle * RADIAN);
                    const y = cy + radius * Math.sin(-midAngle * RADIAN);

                    return (
                    <text
                        x={x}
                        y={y}
                        fill="#047857"
                        textAnchor={x > cx ? 'start' : 'end'}
                        dominantBaseline="central"
                        className="text-sm font-medium"
                    >
                        {`${name}: ${displayValue}`}
                    </text>
                    );
                }}
                outerRadius={90}
                fill="#8884d8"
                dataKey="value"
                >
                {Object.entries(analysis.costsByType).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
                <Legend
                formatter={(value, entry) => {
                    const { payload } = entry;
                    return `${value}: $${payload.value.toLocaleString()}`;
                }}
                layout="vertical"
                align="right"
                verticalAlign="middle"
                />
            </PieChart>
            </ResponsiveContainer>
        </div>
        <div className="mt-4 text-sm text-gray-600">
            <p className="font-medium">
            Total Annual Cost: ${Object.values(analysis.costsByType)
                .reduce((a, b) => a + b, 0)
                .toLocaleString()}
            </p>
        </div>
        </div>

          {/* Recommendations */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Recommendations</h3>
            <ul className="space-y-2">
              {analysis.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-green-600">•</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillParser;