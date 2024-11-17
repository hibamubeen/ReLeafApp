import React, { useState } from 'react';
import { ArrowLeft, Upload, X } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import BillParser from './BillParser.tsx';

interface ChartData {
  name: string;
  value: number;
}

interface BuildingDetailViewProps {
  buildingData: any;
  onClose: () => void;
  onUpdateProperty: (property: any) => void;
}

interface BillUploadSectionProps {
  month: string;
  uploadedFiles: MonthlyBills;
  onFileUpload: (month: string, type: string, fileData: BillData) => void;
}

const BillUploadSection: React.FC<BillUploadSectionProps> = ({ month, uploadedFiles, onFileUpload }) => {
  
  const handleUpload = async (type: string, file: File) => {
    if (!file) return;
    
    try {
      console.log(`Processing ${type} bill for ${month}:`, file);
      
      const reader = new FileReader();
      
      reader.onload = () => {
        // For testing, let's create more realistic mock data based on utility type
        let mockData: BillData;
        
        switch(type) {
          case 'electricity':
            mockData = {
              fileName: file.name,
              data: {
                cost: 1250 + Math.random() * 250, // Random cost between $1250-1500
                usage: 10000 + Math.random() * 2000 // Random usage between 10000-12000 kWh
              }
            };
            break;
            
          case 'water':
            mockData = {
              fileName: file.name,
              data: {
                cost: 300 + Math.random() * 100, // Random cost between $300-400
                usage: 50000 + Math.random() * 10000 // Random usage between 50000-60000 gallons
              }
            };
            break;
            
          case 'heating':
            mockData = {
              fileName: file.name,
              data: {
                cost: 800 + Math.random() * 200, // Random cost between $800-1000
                usage: 500 + Math.random() * 100 // Random usage between 500-600 therms
              }
            };
            break;
            
          default:
            mockData = {
              fileName: file.name,
              data: {
                cost: Math.random() * 1000,
                usage: Math.random() * 100
              }
            };
        }
        
        console.log(`Processed data for ${type} bill:`, mockData);
        onFileUpload(month, type, mockData);
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file');
    }
  };


  return (
    <div className="flex items-center justify-between py-3 border-b">
      <span className="text-gray-700 font-medium w-24">{month}:</span>
      <div className="flex gap-4 flex-1">
        {['heating', 'water', 'electricity'].map((type) => (
          <div key={type} className="flex items-center gap-2">
            <span className="text-sm text-gray-600 capitalize">{type}:</span>
            {uploadedFiles?.[month]?.[type as keyof typeof uploadedFiles[string]] ? (
              <span className="text-green-600 text-sm">
                {uploadedFiles[month][type as keyof typeof uploadedFiles[string]]?.fileName}
              </span>
            ) : (
              <label className="cursor-pointer text-blue-600 hover:text-blue-800 text-sm">
                <Upload size={16} className="inline mr-1" />
                Upload
                <input
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleUpload(type, file);
                  }}
                />
              </label>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const BuildingDetailView: React.FC<BuildingDetailViewProps> = ({ buildingData, onClose, onUpdateProperty }) => {
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [energyData, setEnergyData] = useState([]);
  const [costData, setCostData] = useState([]);
  const [currentAnalysis, setCurrentAnalysis] = useState<any>(null);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Handle file upload and update charts
  const handleFileUpload = (month: string, type: string, fileData: BillData) => {
    console.log(`Updating files for ${month} - ${type}:`, fileData);
    
    setUploadedFiles(prev => {
      const newFiles = {
        ...prev,
        [month]: {
          ...prev[month],
          [type]: fileData
        }
      };

      updateCharts(newFiles);

      
      console.log('Updated files state:', newFiles);
      return newFiles;
    });

    // Update charts whenever a new file is uploaded
    updateCharts({
      ...uploadedFiles,
      [month]: {
        ...(uploadedFiles[month] || {}),
        [type]: fileData
      }
    });

    // Update the property in the parent component
    const updatedProperty = {
      ...buildingData,
      bills: uploadedFiles
    };
    console.log('Updating property with new data:', updatedProperty);
    onUpdateProperty(updatedProperty);
  };

  const handleBulkBillsParsed = (bills: any, analysis: any) => {
    setUploadedFiles(bills);
    setCurrentAnalysis(analysis);
    updateCharts(bills); // Make sure to update charts with the new bills

    
    const updatedProperty = {
      ...buildingData,
      bills: bills
    };
    onUpdateProperty(updatedProperty);
  };

  const updateCharts = (files: any) => {
    const totals = {
      heating: { usage: 0, cost: 0 },
      water: { usage: 0, cost: 0 },
      electricity: { usage: 0, cost: 0 }
    };


    // Calculate totals
    Object.entries(files).forEach(([month, monthData]) => {
      Object.entries(monthData).forEach(([type, fileData]) => {
        if (fileData?.data) {
          totals[type as keyof typeof totals].usage += fileData.data.usage;
          totals[type as keyof typeof totals].cost += fileData.data.cost;
        }
      });
    });

    

    console.log('Calculated totals:', totals);

    // Calculate percentages and update charts
    const totalUsage = Object.values(totals).reduce((sum, { usage }) => sum + usage, 0);
    const totalCost = Object.values(totals).reduce((sum, { cost }) => sum + cost, 0);

    console.log('Total usage:', totalUsage);
    console.log('Total cost:', totalCost);

    if (totalUsage > 0) {
      const newEnergyData = Object.entries(totals).map(([name, { usage }]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value: (usage / totalUsage) * 100
      }));
      
      console.log('New energy distribution data:', newEnergyData);
      setEnergyData(newEnergyData);
    }

    if (totalCost > 0) {
      const newCostData = Object.entries(totals).map(([name, { cost }]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value: (cost / totalCost) * 100
      }));
      
      console.log('New cost distribution data:', newCostData);
      setCostData(newCostData);
    }
  };

  const handleSaveAnalysis = () => {
    if (!currentAnalysis) return;

    const savedAnalysis = {
      buildingId: buildingData.title,
      buildingDetails: buildingData,
      analysis: currentAnalysis,
      date: new Date().toISOString(),
    };

    // Get existing analyses or initialize empty array
    const existingAnalyses = JSON.parse(localStorage.getItem('savedAnalyses') || '[]');
    
    // Add new analysis
    existingAnalyses.push(savedAnalysis);
    
    // Save back to localStorage
    localStorage.setItem('savedAnalyses', JSON.stringify(existingAnalyses));
    
    alert('Analysis saved successfully!');
  };

  const COLORS = ['#00552A', '#007A3D', '#009F50'];

  return (
    
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-green-50 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg shadow-xl">
        {/* Header */}
        <div className="sticky top-0 bg-green-50 border-b border-green-200 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="hover:bg-green-100 p-1 rounded">
              <ArrowLeft size={24} className="text-green-800" />
            </button>
            <h2 className="text-2xl font-semibold text-green-800">{buildingData.title}</h2>
          </div>
          <button onClick={onClose} className="hover:bg-green-100 p-1 rounded">
            <X size={24} className="text-green-800" />
          </button>
        </div>



        {/* Content */}
        <div className="p-6">
          {/* Building Image and Details */}
          <div className="flex gap-6 mb-8">
            <img 
              src={buildingData.imageSrc}
              alt={buildingData.title}
              className="w-96 h-72 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Building Details</h3>
              <div className="space-y-2">
                <p className="text-gray-700">
                  <span className="font-medium">Address:</span> {buildingData.address}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Property Type:</span> {buildingData.propertyType}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Property Acquired:</span> {buildingData.acquisitionDate}
                </p>
                {currentAnalysis && (
                  <button 
                    onClick={handleSaveAnalysis}
                    className="mt-4 bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 transition-colors flex items-center gap-2"
                  >
                    Save Analysis
                  </button>
                )}
              </div>
            </div>
          </div>


          {/* Charts Section */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Emission Distribution</h3>
              {energyData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={energyData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({name, value}) => `${name} ${value.toFixed(1)}%`}
                    >
                      {energyData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-gray-500">
                  Upload bills to see energy distribution
                </div>
              )}
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Cost Distribution</h3>
              {costData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={costData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({name, value}) => `${name} ${value.toFixed(1)}%`}
                    >
                      {costData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-gray-500">
                  Upload bills to see cost distribution
                </div>
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Bulk Upload</h3>
            <BillParser
              onBillsParsed={handleBulkBillsParsed}
              buildingId={buildingData.title}
            />
          </div>

          {/* Monthly Bills Section */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Energy Bills by Month</h3>
            <div className="space-y-2">
              {months.map(month => (
                <BillUploadSection
                  key={month}
                  month={month}
                  uploadedFiles={uploadedFiles}
                  onFileUpload={handleFileUpload}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuildingDetailView;