
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
export type PageSize = 'A4' | 'A3' | 'A2' | 'Legal' | 'Letter';

export const PAGE_DIMENSIONS: Record<PageSize, { width: number; height: number; name: string }> = {
  'A4': { width: 210, height: 297, name: 'A4 (210 × 297 mm)' },
  'A3': { width: 297, height: 420, name: 'A3 (297 × 420 mm)' },
  'A2': { width: 420, height: 594, name: 'A2 (420 × 594 mm)' },
  'Legal': { width: 215.9, height: 355.6, name: 'Legal (8.5 × 14 in)' },
  'Letter': { width: 215.9, height: 279.4, name: 'Letter (8.5 × 11 in)' },
};

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

  // Page Size
  pageSize: PageSize;
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
  
  designMode: 'modern',
  pageSize: 'A4'
};
