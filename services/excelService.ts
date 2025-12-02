import * as XLSX from 'xlsx';
import { HouseRecord } from '../types';

export const parseExcelFile = async (file: File): Promise<HouseRecord[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        // Convert to JSON with header row 1
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        if (jsonData.length < 2) {
          reject(new Error("File appears to be empty or missing headers"));
          return;
        }

        const headers = (jsonData[0] as string[]).map(h => h.toLowerCase().trim().replace(/[^a-z0-9]/g, ''));
        const rows = jsonData.slice(1) as string[][];

        // Flexible mapping for various header names
        const mapIndex = (keywords: string[]) => headers.findIndex(h => keywords.some(k => h.includes(k)));
        
        // Updated matchers based on user request ("obilenumber", etc)
        const nameIdx = mapIndex(['name', 'owner', 'person', 'customer', 'houseowner']);
        const locIdx = mapIndex(['location', 'address', 'city', 'place', 'village']);
        const areaIdx = mapIndex(['area', 'sqft', 'size', 'measure']);
        const pinIdx = mapIndex(['pin', 'zip', 'code', 'postal']);
        const mobIdx = mapIndex(['mobile', 'phone', 'cell', 'contact', 'obile', 'number', 'ph']);

        const records: HouseRecord[] = rows.map((row, index) => ({
          id: `row-${index}`,
          name: nameIdx !== -1 ? row[nameIdx] || '' : row[0] || '',
          location: locIdx !== -1 ? row[locIdx] || '' : row[1] || '',
          area: areaIdx !== -1 ? row[areaIdx] || '' : row[2] || '',
          pincode: pinIdx !== -1 ? row[pinIdx] || '' : row[3] || '',
          mobile: mobIdx !== -1 ? row[mobIdx] || '' : row[4] || '',
        })).filter(r => r.name || r.mobile); // Filter empty rows

        resolve(records);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = (error) => reject(error);
    reader.readAsBinaryString(file);
  });
};