import React, { useState } from 'react';
import { Home, Calculator, LineChart, Info } from 'lucide-react';

const CarbonCalculator = () => {
  const [formData, setFormData] = useState({
    electricity: '',
    naturalGas: '',
    heatingOil: '',
    livingSpace: '',
    waterUsage: ''
  });

  const [result, setResult] = useState(null);
  const [showTooltip, setShowTooltip] = useState(null);

  const tooltips = {
    electricity: "To calculate your total electricity usage or costs, review your monthly electricity bills. Each bill will tell you how many kilowatt hours you have used in the month at what cost.",
    naturalGas: "To calculate your total annual natural gas usage or costs, review your monthly utility bills. Each bill will tell you how many cubic meters you have used in the month at what cost.",
    heatingOil: "To calculate your total annual usage or cost of heating oil or other fuels to heat your home, review your monthly bills for heating oil or other home heating fuels. Each bill will tell you how many litres of oil were delivered to you each month at what cost.",
    livingSpace: "For a house, measure the length of a house and multiply it by the width of the house. If you have two stories, multiply by two. For an apartment or condo, first determine the area of each room by multiplying the length and width of each room. Add up the total area measurements for each room.",
    waterUsage: "Average household water consumption:\n1-person: 148 L/day\n2-person: 242 L/day\n3-person: 261 L/day\n4-person: 299 L/day\n5-person: 337 L/day"
  };

  const formatNumber = (num) => {
    return parseFloat(num).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Remove any non-numeric characters except decimal point
    const cleanedValue = value.replace(/[^\d.]/g, '');
    setFormData(prev => ({
      ...prev,
      [name]: cleanedValue
    }));
  };

  const calculateCarbonFootprint = () => {
    // Convert string inputs to numbers
    const electricity = parseFloat(formData.electricity) || 0;
    const naturalGas = parseFloat(formData.naturalGas) || 0;
    const heatingOil = parseFloat(formData.heatingOil) || 0;
    const livingSpace = parseFloat(formData.livingSpace) || 0;
    const waterUsage = parseFloat(formData.waterUsage) || 0;

    // Calculate using the provided formula
    const totalCarbon = 
      (electricity * 0.5) +      // Electricity factor
      (naturalGas * 5.3) +       // Natural gas factor
      (heatingOil * 10) +        // Heating oil factor
      (livingSpace * 0.5) +      // Living space factor
      (waterUsage * 10.6);      // Water usage factor

    setResult({
      total: totalCarbon.toFixed(2),
      breakdown: {
        electricity: (electricity * 0.417).toFixed(2),
        naturalGas: (naturalGas * 5.3).toFixed(2),
        heatingOil: (heatingOil * 10).toFixed(2),
        livingSpace: (livingSpace * 0.5).toFixed(2),
        waterUsage: (waterUsage * 0.008).toFixed(2)
      }
    });
  };

  const InfoIcon = ({ type }) => (
    <button 
      className="ml-2 text-white hover:text-gray-200"
      onMouseEnter={() => setShowTooltip(type)}
      onMouseLeave={() => setShowTooltip(null)}
    >
      <Info size={16} />
      {showTooltip === type && (
        <div className="absolute z-10 p-2 bg-white text-green-900 rounded shadow-lg text-sm max-w-xs whitespace-pre-line">
          {tooltips[type]}
        </div>
      )}
    </button>
  );

  return (
    <div className="min-h-screen bg-green-900">
      <main className="container mx-auto px-6 py-8 mb-16">
        <div className="text-center mb-8">
          <h2 className="text-xl text-white">Carbon Footprint Calculator</h2>
          <p className="bg-white text-green-900 p-4 rounded-lg mt-4 shadow-lg shadow-green-950/50 max-w-md mx-auto border-2 border-green-900">
          A carbon footprint measures the greenhouse gas emissions caused by
           your household's activities. Factors like electricity consumption,
            natural gas usage, heating oil usage, living space size, and water 
            usage influence energy use, resource consumption, and waste generation,
             all of which contribute to your environmental impact.</p>
        </div>

        {/* Center the form content */}
        <div className="flex justify-center">
          <div className="space-y-6 w-full max-w-md">
            {/* Electricity Input */}
            <div>
              <div className="flex items-center mb-2">
                <label className="text-white">Electricity</label>
                <InfoIcon 
                  type="electricity"
                  tooltip={tooltips.electricity}
                  showTooltip={showTooltip}
                  setShowTooltip={setShowTooltip}
                />
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="electricity"
                  value={formData.electricity}
                  onChange={handleInputChange}
                  placeholder="Enter annual electricity usage"
                  className="flex-1 p-2 rounded bg-white/90 text-gray-800"
                />
                <span className="bg-white/90 p-2 rounded text-gray-800 min-w-20 text-center">
                  kWh/yr
                </span>
              </div>
            </div>

            {/* Natural Gas Input */}
            <div>
              <div className="flex items-center mb-2">
                <label className="text-white">Natural Gas</label>
                <InfoIcon 
                  type="naturalGas"
                  tooltip={tooltips.naturalGas}
                  showTooltip={showTooltip}
                  setShowTooltip={setShowTooltip}
                />
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="naturalGas"
                  value={formData.naturalGas}
                  onChange={handleInputChange}
                  placeholder="Enter annual natural gas usage"
                  className="flex-1 p-2 rounded bg-white/90 text-gray-800"
                />
                <span className="bg-white/90 p-2 rounded text-gray-800 min-w-20 text-center">
                  therms/yr
                </span>
              </div>
            </div>

            {/* Heating Oil Input */}
            <div>
              <div className="flex items-center mb-2">
                <label className="text-white">Heating Oil & Other Fuels</label>
                <InfoIcon 
                  type="heatingOil"
                  tooltip={tooltips.heatingOil}
                  showTooltip={showTooltip}
                  setShowTooltip={setShowTooltip}
                />
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="heatingOil"
                  value={formData.heatingOil}
                  onChange={handleInputChange}
                  placeholder="Enter annual heating oil usage"
                  className="flex-1 p-2 rounded bg-white/90 text-gray-800"
                />
                <span className="bg-white/90 p-2 rounded text-gray-800 min-w-20 text-center">
                  gal/yr
                </span>
              </div>
            </div>

            {/* Living Space Input */}
            <div>
              <div className="flex items-center mb-2">
                <label className="text-white">Living Space Area</label>
                <InfoIcon 
                  type="livingSpace"
                  tooltip={tooltips.livingSpace}
                  showTooltip={showTooltip}
                  setShowTooltip={setShowTooltip}
                />
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="livingSpace"
                  value={formData.livingSpace}
                  onChange={handleInputChange}
                  placeholder="Enter living space area"
                  className="flex-1 p-2 rounded bg-white/90 text-gray-800"
                />
                <span className="bg-white/90 p-2 rounded text-gray-800 min-w-20 text-center">
                  ft²
                </span>
              </div>
            </div>

            {/* Water Usage Input */}
            <div>
              <div className="flex items-center mb-2">
                <label className="text-white">Water Usage</label>
                <InfoIcon 
                  type="waterUsage"
                  tooltip={tooltips.waterUsage}
                  showTooltip={showTooltip}
                  setShowTooltip={setShowTooltip}
                />
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="waterUsage"
                  value={formData.waterUsage}
                  onChange={handleInputChange}
                  placeholder="Enter annual water usage"
                  className="flex-1 p-2 rounded bg-white/90 text-gray-800"
                />
                <span className="bg-white/90 p-2 rounded text-gray-800 min-w-20 text-center">
                  gal/yr
                </span>
              </div>
            </div>

            {/* Calculate Button */}
            <div className="flex justify-center mt-8">
              <button
                onClick={calculateCarbonFootprint}
                className="px-8 py-2 bg-white/90 rounded-full text-green-800 font-semibold hover:bg-white transition-colors"
              >
                Calculate
              </button>
            </div>

            {/* Results Section */}
            {result && (
              <div className="mt-8 p-4 bg-white/90 rounded-lg">
                <h3 className="text-xl font-bold text-green-800 mb-4">Carbon Footprint Results</h3>
                <div className="space-y-2">
                  <p className="text-lg font-semibold text-green-800">
                    Total Carbon Footprint: {formatNumber(result.total)} kg CO₂e/year
                  </p>
                  <div className="text-sm text-gray-600">
                    <p>Breakdown:</p>
                    <ul className="list-disc ml-5">
                      <li>Electricity: {formatNumber(result.breakdown.electricity)} kg CO₂e</li>
                      <li>Natural Gas: {formatNumber(result.breakdown.naturalGas)} kg CO₂e</li>
                      <li>Heating Oil: {formatNumber(result.breakdown.heatingOil)} kg CO₂e</li>
                      <li>Living Space: {formatNumber(result.breakdown.livingSpace)} kg CO₂e</li>
                      <li>Water Usage: {formatNumber(result.breakdown.waterUsage)} kg CO₂e</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 w-full bg-white/90 border-t">
        <div className="container mx-auto px-4 py-2">
          <div className="flex justify-around items-center">
            <button className="p-2 text-green-800">
              <Home size={24} />
            </button>
            <button className="p-2 text-green-800">
              <Calculator size={24} />
            </button>
            <button className="p-2 text-green-800">
              <LineChart size={24} />
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default CarbonCalculator;