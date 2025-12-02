
export interface HouseRecord {
  id: string;
  name: string;
  location: string;
  area: string;
  pincode: string;
  mobile: string;
  [key: string]: string; // Allow flexible keys during parsing
}

export type LayoutMode = 'grid' | 'size';
export type DesignMode = 'modern' | 'simple';

export interface GridSettings {
  columns: number;
  rows: number;
  gap: number;
  fontSize: number;
  showBorders: boolean;
  padding: number;
  
  // New settings for exact sizing
  mode: LayoutMode;
  itemWidth: number; // in mm
  itemHeight: number; // in mm
  
  // Design style
  designMode: DesignMode;
}

export const DEFAULT_SETTINGS: GridSettings = {
  columns: 4,
  rows: 4, // 4x4 = 16 items per page
  gap: 4, // mm
  fontSize: 12, // px
  showBorders: true,
  padding: 5, // mm
  
  mode: 'grid',
  itemWidth: 100, // default 10cm if switched to size mode
  itemHeight: 50, // default 5cm
  
  designMode: 'modern'
};
