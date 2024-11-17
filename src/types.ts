// src/types.ts

export interface BillData {
    fileName: string;
    data: {
      cost: number;
      usage: number;
    };
  }
  
  export interface MonthlyBills {
    [key: string]: {
      heating?: BillData;
      water?: BillData;
      electricity?: BillData;
    };
  }
  
  export interface Building {
    title: string;
    address: string;
    propertyType: string;
    acquisitionDate: string;
    imageSrc: string;
    bills: MonthlyBills;
  }
  
  export interface MonthlyTotals {
    [key: string]: {
      emissions: number;
      cost: number;
    };
  }
  
  export interface ChartDataPoint {
    month: string;
    emissions: number;
  }
  
  export interface BuildingDetailViewProps {
    onClose: () => void;
    buildingData: Building;
    onUpdateProperty: (updatedProperty: Building) => void;
  }