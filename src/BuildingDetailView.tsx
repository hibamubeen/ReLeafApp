import React, { useState } from 'react';
import { ArrowLeft, Download, Upload, X } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import CBREmckinney from './CBREmckinney.png';

const BillUploadSection = ({ month, onFileUpload }) => {
  return (
    <div className="flex items-center justify-between py-3 border-b">
      <span className="text-gray-700 font-medium w-24">{month}:</span>
      <div className="flex gap-4 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Heating:</span>
          <label className="cursor-pointer text-blue-600 hover:text-blue-800 text-sm">
            <Upload size={16} className="inline mr-1" />
            Upload
            <input type="file" accept=".pdf" className="hidden" onChange={(e) => onFileUpload(month, 'heating', e.target.files[0])} />
          </label>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Water:</span>
          <label className="cursor-pointer text-blue-600 hover:text-blue-800 text-sm">
            <Upload size={16} className="inline mr-1" />
            Upload
            <input type="file" accept=".pdf" className="hidden" onChange={(e) => onFileUpload(month, 'water', e.target.files[0])} />
          </label>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Electricity:</span>
          <label className="cursor-pointer text-blue-600 hover:text-blue-800 text-sm">
            <Upload size={16} className="inline mr-1" />
            Upload
            <input type="file" accept=".pdf" className="hidden" onChange={(e) => onFileUpload(month, 'electricity', e.target.files[0])} />
          </label>
        </div>
      </div>
    </div>
  );
};

const BuildingDetailView = ({ onClose }) => {
  const [uploadedFiles, setUploadedFiles] = useState({});

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const energyData = [
    { name: 'Space Heating', value: 45 },
    { name: 'Water Heating', value: 18 },
    { name: 'Space Cooling', value: 9 },
    { name: 'Lighting', value: 8 },
    { name: 'Electronics', value: 6 },
    { name: 'Cooking', value: 5 },
    { name: 'Refrigeration', value: 3 },
    { name: 'Other', value: 6 }
  ];

  const costData = [
    { name: 'Electricity', value: 40 },
    { name: 'Natural Gas', value: 35 },
    { name: 'Water', value: 25 }
  ];

  const COLORS = [
    '#00552A', '#007A3D', '#009F50', '#00C463', 
    '#00E976', '#33FF99', '#66FFBB', '#99FFDD'
  ];

  const handleFileUpload = (month, type, file) => {
    setUploadedFiles(prev => ({
      ...prev,
      [month]: {
        ...prev[month],
        [type]: file.name
      }
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-green-50 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg shadow-xl">
        {/* Header */}
        <div className="sticky top-0 bg-green-50 border-b border-green-200 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="hover:bg-green-100 p-1 rounded">
              <ArrowLeft size={24} className="text-green-800" />
            </button>
            <h2 className="text-2xl font-semibold text-green-800">CBRE McKinney Building</h2>
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
              src={CBREmckinney}
              alt="CBRE McKinney Building"
              className="w-96 h-72 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Building Details</h3>
              <div className="space-y-2">
                <p className="text-gray-700">
                  <span className="font-medium">Address:</span> 2100 McKinney Ave Suite 700, Dallas, TX 75201
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Property Type:</span> Building
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Property Acquired:</span> March 2018
                </p>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-2 gap-12 mb-8">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Energy Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={energyData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label
                  >
                    {energyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Cost Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={costData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label
                  >
                    {costData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
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