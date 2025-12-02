import React, { useCallback } from 'react';
import { Upload, FileSpreadsheet } from 'lucide-react';

interface DropZoneProps {
  onFileLoaded: (file: File) => void;
}

export const DropZone: React.FC<DropZoneProps> = ({ onFileLoaded }) => {
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        onFileLoaded(files[0]);
      }
    },
    [onFileLoaded]
  );

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileLoaded(e.target.files[0]);
    }
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className="w-full max-w-2xl mx-auto border-2 border-dashed border-indigo-300 rounded-xl bg-indigo-50/50 p-12 text-center hover:bg-indigo-50 transition-colors cursor-pointer group"
    >
      <input
        type="file"
        id="fileInput"
        className="hidden"
        accept=".xlsx, .xls"
        onChange={handleChange}
      />
      <label htmlFor="fileInput" className="cursor-pointer flex flex-col items-center">
        <div className="bg-white p-4 rounded-full shadow-sm mb-4 group-hover:scale-110 transition-transform">
          <FileSpreadsheet className="w-10 h-10 text-indigo-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          Upload your Excel File
        </h3>
        <p className="text-gray-500 mb-6 max-w-sm mx-auto">
          Drag & drop your .xlsx file here, or click to browse. We'll automatically arrange your 200+ records.
        </p>
        <div className="flex items-center gap-2 text-indigo-600 font-medium bg-indigo-100 px-4 py-2 rounded-lg hover:bg-indigo-200 transition-colors">
          <Upload className="w-4 h-4" />
          <span>Select File</span>
        </div>
      </label>
    </div>
  );
};