import React, { useState } from 'react';
import BuildingDetailView from './BuildingDetailView.tsx';
import { Settings, Bell, Plus, Home, Calculator, ChartLine, Leaf, DollarSign, X, Upload } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import CBREmckinney from './CBREmckinney.png';

// Centralized styles object
const styles = {
  // Layout styles
  container: "min-h-screen bg-gray-50",
  mainContent: "container mx-auto px-4 py-6 space-y-8 pb-24",
  
  // Header styles
  header: {
    wrapper: "bg-white border-b",
    container: "container mx-auto px-4 py-2 flex justify-between items-center",
    title: "text-2xl font-semibold text-green-800",
    iconButton: "p-2 hover:bg-gray-100 rounded-full",
    icon: "text-gray-600"
  },

  // Navigation styles
  navigation: {
    wrapper: "fixed bottom-0 w-full bg-white border-t",
    container: "container mx-auto px-4 py-2",
    buttons: "flex justify-around items-center",
    activeButton: "p-2 text-green-800",
    inactiveButton: "p-2 text-gray-400"
  },

  // Section styles
  section: {
    title: "text-2xl font-semibold text-gray-800 mb-6",
    headerContainer: "flex justify-between items-center mb-4"
  },

  // Property Card styles
  propertyCard: {
    wrapper: "bg-green-800 rounded-xl p-6 flex flex-col h-full cursor-pointer hover:bg-gray-100 transition-colors duration-200 group",
    content: "flex-1 mb-4",
    title: "text-xl font-semibold text-white group-hover:text-gray-800 mb-3",
    text: "text-white group-hover:text-gray-800 text-sm mb-2",
    imageContainer: "w-full h-48 mb-4",
    image: "w-full h-full object-cover rounded-lg",
    footer: "flex justify-between items-center mt-auto",
    iconContainer: "flex justify-end",
    iconButton: "text-white group-hover:text-gray-800 transition-colors duration-200"
  },

  // Property Grid
  propertyGrid: "grid grid-cols-1 md:grid-cols-2 gap-6",

  // Metric Card styles
  metricCard: {
    wrapper: "bg-white rounded-xl shadow-sm p-6 text-center transform transition-all duration-200 hover:scale-105 border-2 border-transparent hover:border-green-600",
    iconWrapper: (color) => `inline-flex items-center justify-center w-12 h-12 rounded-full mb-4 bg-${color}-100`,
    icon: (color) => `text-${color}-600 w-6 h-6`,
    label: "text-gray-600 text-sm font-medium mb-2",
    valueContainer: "flex items-baseline justify-center",
    value: "text-4xl font-bold text-gray-900",
    unit: "ml-1 text-gray-500 text-sm"
  },

  // Emissions Chart styles
  emissionsChart: {
    wrapper: "space-y-8",
    grid: "grid grid-cols-1 md:grid-cols-2 gap-6",
    chartCard: {
      wrapper: "bg-white rounded-xl shadow-sm p-6",
      header: "flex items-center justify-between mb-6",
      title: "text-lg font-semibold text-gray-800",
      controls: "flex space-x-2",
      select: "text-sm border rounded-md px-3 py-1.5 text-gray-600",
      chartContainer: "w-full h-64 bg-gray-50 rounded-lg overflow-hidden",
      chart: "w-full h-full object-cover"
    }
  },
  // Add Property Button
  addButton: "bg-green-700 text-white p-2 rounded-full hover:bg-green-800 transition-colors",
  modal: {
    overlay: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4",
    container: "bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto",
    header: "flex items-center justify-between p-6 border-b",
    title: "text-xl font-semibold text-gray-800",
    closeButton: "p-2 hover:bg-gray-100 rounded-full text-gray-600",
    form: {
      imageUpload: {
        wrapper: "flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg",
        preview: "relative w-32 h-32",
        previewImage: "w-full h-full object-cover rounded-lg",
        removeButton: "absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-sm",
        uploadButton: "flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-green-500"
      },
      wrapper: "p-6 space-y-6",
      inputGroup: "space-y-1",
      label: "block text-sm font-medium text-gray-700",
      input: "mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm",
      buttons: "flex gap-4 justify-end p-6 border-t bg-gray-50",
      cancelButton: "px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium",
      submitButton: "px-4 py-2 rounded-md bg-green-700 text-white hover:bg-green-800 font-medium"
    }
  }

};

// Sample data for the emissions trend
const emissionsData = [
  { month: 'Jan', emissions: 1800 },
  { month: 'Feb', emissions: 1950 },
  { month: 'Mar', emissions: 1750 },
  { month: 'Apr', emissions: 1850 },
  { month: 'May', emissions: 1650 },
  { month: 'Jun', emissions: 1700 },
  { month: 'Jul', emissions: 1600 },
  { month: 'Aug', emissions: 1550 },
  { month: 'Sep', emissions: 1500 },
  { month: 'Oct', emissions: 1450 },
  { month: 'Nov', emissions: 1400 },
  { month: 'Dec', emissions: 1350 }
];

// Custom tooltip component for the line graph
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border rounded-lg shadow-sm">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-sm text-green-600">
          {payload[0].value.toLocaleString()} kg CO₂
        </p>
      </div>
    );
  }
  return null;
};

// Property Card Component
const PropertyCard = ({ title, address, propertyType, acquisitionDate, imageSrc, onClick }) => (
  <div className={styles.propertyCard.wrapper} onClick={onClick}>
    <div className={styles.propertyCard.content}>
      <h3 className={styles.propertyCard.title}>{title}</h3>
      <div className={styles.propertyCard.imageContainer}>
        <img 
          src={imageSrc} // Changed from CBREmckinney to imageSrc
          alt={title}
          className={styles.propertyCard.image}
        />
      </div>
      <p className={styles.propertyCard.text}>{address}</p>
      <p className={styles.propertyCard.text}>Property Type: {propertyType}</p>
      <p className={styles.propertyCard.text}>Property Acquired: {acquisitionDate}</p>
    </div>
    <div className={styles.propertyCard.footer}>
      <div className={styles.propertyCard.iconContainer}>
        <button className={styles.propertyCard.iconButton}>
          <ChartLine size={24} />
        </button>
      </div>
    </div>
  </div>
);

// Metric Card Component
const MetricCard = ({ icon: Icon, label, value, unit, color = "green" }) => (
  <div className={styles.metricCard.wrapper}>
    <div className={styles.metricCard.iconWrapper(color)}>
      <Icon className={styles.metricCard.icon(color)} />
    </div>
    <h3 className={styles.metricCard.label}>{label}</h3>
    <div className={styles.metricCard.valueContainer}>
      <span className={styles.metricCard.value}>{value}</span>
      <span className={styles.metricCard.unit}>{unit}</span>
    </div>
  </div>
);

const EmissionsChart = () => (
  <div className={styles.emissionsChart.wrapper}>
    <div className={styles.emissionsChart.grid}>
      <MetricCard
        icon={Leaf}
        label="Carbon Emissions"
        value="20,000"
        unit="kg/year"
        color="green"
      />
      <MetricCard
        icon={DollarSign}
        label="Annual Cost"
        value="10,000"
        unit="USD/year"
        color="green"
      />
    </div>

    <div className={styles.emissionsChart.chartCard.wrapper}>
      <div className={styles.emissionsChart.chartCard.header}>
        <h3 className={styles.emissionsChart.chartCard.title}>Emissions Trend</h3>
        <div className={styles.emissionsChart.chartCard.controls}>
          <select className={styles.emissionsChart.chartCard.select}>
            <option>Last 12 months</option>
            <option>Last 6 months</option>
            <option>Last 30 days</option>
          </select>
        </div>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={emissionsData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="month" 
              tick={{ fill: '#666' }}
              tickLine={{ stroke: '#666' }}
            />
            <YAxis 
              tick={{ fill: '#666' }}
              tickLine={{ stroke: '#666' }}
              tickFormatter={(value) => `${value}kg`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="emissions"
              stroke="#16a34a"
              strokeWidth={2}
              dot={{ stroke: '#16a34a', strokeWidth: 2, fill: 'white' }}
              activeDot={{ r: 6, stroke: '#16a34a', strokeWidth: 2, fill: 'white' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  </div>
);



const AddPropertyModal = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    title: '',
    address: '',
    propertyType: 'Building',
    acquisitionDate: '',
    thumbnail: null
  });

  const [thumbnailPreview, setThumbnailPreview] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result);
        setFormData(prev => ({ ...prev, thumbnail: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({
      ...formData,
      imageSrc: thumbnailPreview || CBREmckinney // Use the uploaded image if available
    });
    onClose();
  };

  return (
    <div className={styles.modal.overlay}>
      <div className={styles.modal.container}>
        <div className={styles.modal.header}>
          <h2 className={styles.modal.title}>Add New Property</h2>
          <button onClick={onClose} className={styles.modal.closeButton}>
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className={styles.modal.form.wrapper}>
          <div className={styles.modal.form.inputGroup}>
            <label className={styles.modal.form.label}>Property Name</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={styles.modal.form.input}
              placeholder="Enter property name"
              required
            />
          </div>

          <div className={styles.modal.form.inputGroup}>
            <label className={styles.modal.form.label}>Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className={styles.modal.form.input}
              placeholder="Enter property address"
              required
            />
          </div>

          <div className={styles.modal.form.inputGroup}>
            <label className={styles.modal.form.label}>Property Type</label>
            <select
              name="propertyType"
              value={formData.propertyType}
              onChange={handleChange}
              className={styles.modal.form.input}
              required
            >
              <option value="Building">Building</option>
              <option value="Office">Office</option>
              <option value="Retail">Retail</option>
              <option value="Industrial">Industrial</option>
            </select>
          </div>
          <div className={styles.modal.form.inputGroup}>
            <label className={styles.modal.form.label}>Property Thumbnail</label>
            <div className="mt-2 flex items-center gap-4">
              {thumbnailPreview ? (
                <div className="relative w-32 h-32">
                  <img 
                    src={thumbnailPreview} 
                    alt="Preview" 
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setThumbnailPreview(null);
                      setFormData(prev => ({ ...prev, thumbnail: null }));
                    }}
                    className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-sm"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-green-500">
                  <Upload className="w-6 h-6 text-gray-400" />
                  <span className="text-sm text-gray-500 mt-2">Upload</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          <div className={styles.modal.form.inputGroup}>
            <label className={styles.modal.form.label}>Acquisition Date</label>
            <input
              type="date"
              name="acquisitionDate"
              value={formData.acquisitionDate}
              onChange={handleChange}
              className={styles.modal.form.input}
              required
            />
          </div>

          <div className={styles.modal.form.buttons}>
            <button
              type="button"
              onClick={onClose}
              className={styles.modal.form.cancelButton}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.modal.form.submitButton}
            >
              Add Property
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Update HomePage component to include property management
const HomePage = () => {
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [properties, setProperties] = useState([
    {
      title: "CBRE McKinney Building",
      address: "2100 McKinney Ave Suite 700, Dallas, TX 75201",
      propertyType: "Building",
      acquisitionDate: "March 2018",
      imageSrc: CBREmckinney
    },
    {
      title: "CBRE Richardson Building",
      address: "2375 N Glenville Dr Bldg A, Richardson, TX 75082",
      propertyType: "Building",
      acquisitionDate: "March 2023",
      imageSrc: CBREmckinney
    }
  ]);

  const handleAddProperty = (newProperty) => {
    setProperties([...properties, newProperty]);
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header.wrapper}>
        <div className={styles.header.container}>
          <button className={styles.header.iconButton}>
            <Settings size={24} className={styles.header.icon} />
          </button>
          <h1 className={styles.header.title}>ReLeaf</h1>
          <button className={styles.header.iconButton}>
            <Bell size={24} className={styles.header.icon} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.mainContent}>
        {/* Overview Section */}
        <div>
          <h2 className={styles.section.title}>Overview</h2>
          <EmissionsChart />
        </div>
        {/* Properties Section */}
        <div>
          <div className={styles.section.headerContainer}>
            <h2 className={styles.section.title}>My properties</h2>
            <button 
              className={styles.addButton}
              onClick={() => setShowAddModal(true)}
            >
              <Plus size={24} />
            </button>
          </div>
          
          <div className={styles.propertyGrid}>
            {properties.map((property, index) => (
              <PropertyCard 
                key={index}
                {...property}
                onClick={() => setSelectedBuilding(property.title)}
              />
            ))}
          </div>
        </div>

      </main>

      {/* Bottom Navigation */}
      <nav className={styles.navigation.wrapper}>
        <div className={styles.navigation.container}>
          <div className={styles.navigation.buttons}>
            <button className={styles.navigation.activeButton}>
              <Home size={24} />
            </button>
            <button className={styles.navigation.inactiveButton}>
              <Calculator size={24} />
            </button>
            <button className={styles.navigation.inactiveButton}>
              <ChartLine size={24} />
            </button>
          </div>
        </div>
      </nav>

      {/* Add Property Modal */}
      {showAddModal && (
              <AddPropertyModal 
                onClose={() => setShowAddModal(false)}
                onAdd={handleAddProperty}
              />
      )}

      {/* Building Detail Modal */}
      {selectedBuilding && (
        <BuildingDetailView 
          onClose={() => setSelectedBuilding(null)}
          buildingData={properties.find(p => p.title === selectedBuilding)}
        />
      )}
    </div>
  );
};

export default HomePage;