import React, { useState } from 'react';
import { ArrowLeft, Upload, X } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import CBREmckinney from './CBREmckinney.png';

const BillUploadSection = ({ month, uploadedFiles, onFileUpload }) => {
  // Function to handle file upload
  const handleUpload = async (type, file) => {
    if (!file) return;
    
    try {
      // Read the file to show it was uploaded
      const reader = new FileReader();
      
      reader.onload = () => {
        // Simulate some data from the PDF
        // In reality, you'd want to actually extract this from the PDF
        const mockData = {
          fileName: file.name,
          data: {
            cost: Math.random() * 1000, // Random cost between 0-1000
            usage: Math.random() * 100   // Random usage between 0-100
          }
        };
        
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
            {uploadedFiles?.[month]?.[type] ? (
              <span className="text-green-600 text-sm">
                {uploadedFiles[month][type].fileName}
              </span>
            ) : (
              <label className="cursor-pointer text-blue-600 hover:text-blue-800 text-sm">
                <Upload size={16} className="inline mr-1" />
                Upload
                <input
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={(e) => handleUpload(type, e.target.files[0])}
                />
              </label>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const BuildingDetailView = ({ onClose, buildingData }) => {  // Add buildingData prop
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [energyData, setEnergyData] = useState([]);
  const [costData, setCostData] = useState([]);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Handle file upload and update charts
  const handleFileUpload = (month, type, fileData) => {
    setUploadedFiles(prev => ({
      ...prev,
      [month]: {
        ...prev[month],
        [type]: fileData
      }
    }));

    // Update charts whenever a new file is uploaded
    updateCharts({
      ...uploadedFiles,
      [month]: {
        ...(uploadedFiles[month] || {}),
        [type]: fileData
      }
    });
  };

  // Function to update both charts
  const updateCharts = (files) => {
    const totals = {
      heating: { usage: 0, cost: 0 },
      water: { usage: 0, cost: 0 },
      electricity: { usage: 0, cost: 0 }
    };

    // Calculate totals from all uploaded files
    Object.values(files).forEach(monthData => {
      Object.entries(monthData).forEach(([type, fileData]) => {
        totals[type].usage += fileData.data.usage;
        totals[type].cost += fileData.data.cost;
      });
    });

    // Calculate percentages and update charts
    const totalUsage = Object.values(totals).reduce((sum, { usage }) => sum + usage, 0);
    const totalCost = Object.values(totals).reduce((sum, { cost }) => sum + cost, 0);

    if (totalUsage > 0) {
      setEnergyData(
        Object.entries(totals).map(([name, { usage }]) => ({
          name: name.charAt(0).toUpperCase() + name.slice(1),
          value: (usage / totalUsage) * 100
        }))
      );
    }

    if (totalCost > 0) {
      setCostData(
        Object.entries(totals).map(([name, { cost }]) => ({
          name: name.charAt(0).toUpperCase() + name.slice(1),
          value: (cost / totalCost) * 100
        }))
      );
    }
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
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Energy Distribution</h3>
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