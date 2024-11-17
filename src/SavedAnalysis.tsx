import React, { useState, useEffect } from 'react';
import { Trash2, AlertTriangle } from 'lucide-react';

interface SavedAnalysis {
  buildingId: string;
  buildingDetails: any;
  analysis: {
    totalEmissions: number;
    emissionsByType: { [key: string]: number };
    costsByType: { [key: string]: number };
    recommendations: string[];
  };
  date: string;
}

const AnalysisCard = ({ analysis, onDelete }: { analysis: SavedAnalysis; onDelete: () => void }) => {
  // Get the highest emission source
  const highestEmission = Object.entries(analysis.analysis.emissionsByType)
    .sort(([, a], [, b]) => b - a)[0];

  // Get the highest cost source
  const highestCost = Object.entries(analysis.analysis.costsByType)
    .sort(([, a], [, b]) => b - a)[0];

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6">
        <div className="flex gap-6">
          <img 
            src={analysis.buildingDetails.imageSrc}
            alt={analysis.buildingDetails.title}
            className="w-48 h-32 object-cover rounded-lg"
          />
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-semibold text-gray-800">
                {analysis.buildingDetails.title}
              </h3>
              <button
                onClick={onDelete}
                className="text-red-500 hover:text-red-600 p-1"
              >
                <Trash2 size={20} />
              </button>
            </div>
            <p className="text-sm text-gray-600 mt-1">{analysis.buildingDetails.address}</p>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="bg-green-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Total Emissions</p>
                <p className="text-lg font-semibold text-green-800">
                  {analysis.analysis.totalEmissions.toLocaleString()} kg CO₂/year
                </p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Total Cost</p>
                <p className="text-lg font-semibold text-green-800">
                  ${Object.values(analysis.analysis.costsByType)
                    .reduce((a, b) => a + b, 0)
                    .toLocaleString()}/year
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Summary and Recommendations */}
        <div className="mt-6 bg-green-50 p-4 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-5 w-5 text-green-700 mt-0.5" />
            <div>
              <h4 className="font-medium text-green-800">Key Findings</h4>
              <ul className="mt-2 space-y-2 text-sm text-green-700">
                <li>• Highest emissions from {highestEmission[0]} ({Math.round(highestEmission[1])} kg CO₂)</li>
                <li>• Highest cost from {highestCost[0]} (${Math.round(highestCost[1]).toLocaleString()})</li>
                {analysis.analysis.recommendations.slice(0, 2).map((rec, index) => (
                  <li key={index}>• {rec}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SavedAnalysis = () => {
  const [savedAnalyses, setSavedAnalyses] = useState<SavedAnalysis[]>([]);

  useEffect(() => {
    const analyses = JSON.parse(localStorage.getItem('savedAnalyses') || '[]');
    setSavedAnalyses(analyses);
  }, []);

  const handleDelete = (index: number) => {
    const newAnalyses = savedAnalyses.filter((_, i) => i !== index);
    localStorage.setItem('savedAnalyses', JSON.stringify(newAnalyses));
    setSavedAnalyses(newAnalyses);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Saved Analyses</h2>
      <div className="space-y-6">
        {savedAnalyses.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No saved analyses yet. Upload bills and save analyses from the building details page.
          </div>
        ) : (
          savedAnalyses.map((analysis, index) => (
            <AnalysisCard
              key={`${analysis.buildingId}-${analysis.date}`}
              analysis={analysis}
              onDelete={() => handleDelete(index)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default SavedAnalysis;