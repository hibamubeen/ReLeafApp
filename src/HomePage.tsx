import React from 'react';
import { Settings, Bell, Plus, Home, Calculator, ChartLine } from 'lucide-react';
import CBREmckinney from './CBREmckinney.png';


const PropertyCard = ({ title, address, propertyType, acquisitionDate, imageSrc }) => (
  <div className="bg-green-50 rounded-lg p-4 mb-4 flex justify-between items-center">
    <div className="flex-1">
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      <p className="text-sm text-gray-600">{address}</p>
      <p className="text-sm text-gray-600">Property Type: {propertyType}</p>
      <p className="text-sm text-gray-600">Property Acquired: {acquisitionDate}</p>
    </div>
    <div className="w-60 h-30">
      <img 
        src={CBREmckinney}
        alt={title}
        className="w-full h-full object-cover rounded"
      />
    </div>
    <div className="ml-4">
      <button className="text-gray-600 hover:text-gray-800">
        <ChartLine size={24} />
      </button>
    </div>
  </div>
);

const EmissionsChart = () => (
  <div className="bg-white rounded-lg p-4 mb-6">
    <div className="grid grid-cols-2 gap-4 mb-4">
      <div className="p-4 border rounded-lg">
        <p className="text-gray-600 mb-2">Carbon emissions:</p>
        <p className="text-4xl font-bold text-green-800">20,000</p>
        <p className="text-sm text-gray-600">kg/year</p>
      </div>
      <div className="p-4 border rounded-lg">
        <p className="text-gray-600 mb-2">Cost in Dollars:</p>
        <p className="text-4xl font-bold text-green-800">$10,000</p>
        <p className="text-sm text-gray-600">per year</p>
      </div>
    </div>
    <div className="w-full h-64 bg-gray-100 rounded-lg">
      <img 
        src="/api/placeholder/400/256" 
        alt="Emissions Distribution Chart"
        className="w-full h-full object-contain"
      />
    </div>
  </div>
);

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-2 flex justify-between items-center">
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Settings size={24} className="text-gray-600" />
          </button>
          <h1 className="text-2xl font-semibold text-green-800">ReLeaf</h1>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Bell size={24} className="text-gray-600" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Properties Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-800">My properties</h2>
            <button className="bg-green-700 text-white p-2 rounded-full hover:bg-green-800">
              <Plus size={24} />
            </button>
          </div>
          
          <PropertyCard 
            title="CBRE McKinney Building"
            address="2100 McKinney Ave Suite 700, Dallas, TX 75201"
            propertyType="Building"
            acquisitionDate="March 2018"
          />
          
          <PropertyCard 
            title="CBRE Richardson Building"
            address="2375 N Glenville Dr Bldg A, Richardson, TX 75082"
            propertyType="Building"
            acquisitionDate="March 2023"
          />
        </div>

        {/* Overview Section */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Overview</h2>
          <EmissionsChart />
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 w-full bg-white border-t">
        <div className="container mx-auto px-4 py-2">
          <div className="flex justify-around items-center">
            <button className="p-2 text-green-800">
              <Home size={24} />
            </button>
            <button className="p-2 text-gray-400">
              <Calculator size={24} />
            </button>
            <button className="p-2 text-gray-400">
              <ChartLine size={24} />
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default HomePage;