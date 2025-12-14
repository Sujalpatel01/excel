
import React from 'react';
import { GridSettings, PAGE_DIMENSIONS, PageSize } from '../types';
import { Printer, Wand2, RefreshCcw, LayoutGrid, Ruler, BoxSelect, Type, Palette, Download, FileText } from 'lucide-react';

interface ToolbarProps {
  settings: GridSettings;
  setSettings: React.Dispatch<React.SetStateAction<GridSettings>>;
  onPrint: () => void;
  onDownloadPdf: () => void;
  onCleanData: () => void;
  isCleaning: boolean;
  hasApiKey: boolean;
  recordCount: number;
  onReset: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  settings,
  setSettings,
  onPrint,
  onDownloadPdf,
  onCleanData,
  isCleaning,
  hasApiKey,
  recordCount,
  onReset
}) => {

  // Convert mm to cm for display
  const widthCm = Math.round(settings.itemWidth / 10 * 10) / 10;
  const heightCm = Math.round(settings.itemHeight / 10 * 10) / 10;

  const handleDimensionChange = (dimension: 'w' | 'h', valueCm: number) => {
    const valueMm = valueCm * 10;
    setSettings(prev => ({
      ...prev,
      [dimension === 'w' ? 'itemWidth' : 'itemHeight']: valueMm
    }));
  };

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm no-print">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          
          <div className="flex items-center gap-4">
            <div className="bg-indigo-100 p-2 rounded-lg">
              <LayoutGrid className="w-6 h-6 text-indigo-700" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">GridPrint Pro</h1>
              <p className="text-xs text-gray-500">{recordCount} records loaded</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 xl:gap-6">
            
            {/* Page Size Selector */}
            <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Paper Size</label>
                <div className="relative">
                    <select
                        value={settings.pageSize}
                        onChange={(e) => setSettings(p => ({ ...p, pageSize: e.target.value as PageSize }))}
                        className="text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 border p-1.5 bg-gray-50 font-medium pl-8 h-[34px] w-48"
                    >
                        {Object.entries(PAGE_DIMENSIONS).map(([key, config]) => (
                            <option key={key} value={key}>{config.name}</option>
                        ))}
                    </select>
                    <FileText className="w-4 h-4 text-gray-500 absolute left-2.5 top-2.5 pointer-events-none" />
                </div>
            </div>

            {/* Mode Switcher */}
            <div className="flex flex-col gap-1">
                 <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Layout Mode</label>
                 <div className="flex bg-gray-100 p-1 rounded-lg">
                    <button
                        onClick={() => setSettings(p => ({ ...p, mode: 'grid' }))}
                        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                            settings.mode === 'grid' 
                            ? 'bg-white text-indigo-600 shadow-sm' 
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        <BoxSelect className="w-4 h-4" />
                        Auto Grid
                    </button>
                    <button
                        onClick={() => setSettings(p => ({ ...p, mode: 'size' }))}
                        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                            settings.mode === 'size' 
                            ? 'bg-white text-indigo-600 shadow-sm' 
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        <Ruler className="w-4 h-4" />
                        Fixed Size
                    </button>
                </div>
            </div>

            {/* Layout Controls based on Mode */}
            <div className="flex items-center gap-3 border-r pr-6 border-gray-200">
                
                {settings.mode === 'grid' ? (
                    /* GRID MODE CONTROLS */
                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Rows / Cols</label>
                        <select
                            value={`${settings.columns}x${settings.rows}`}
                            onChange={(e) => {
                                const [c, r] = e.target.value.split('x').map(Number);
                                setSettings(prev => ({ ...prev, columns: c, rows: r }));
                            }}
                            className="text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 border p-1.5 bg-gray-50 font-medium w-40 h-[34px]"
                        >
                            <option value="4x4">16/Page (4x4) ★</option>
                            <option value="2x8">16/Page (2x8)</option>
                            <option value="2x4">8/Page (2x4)</option>
                            <option value="3x5">15/Page (3x5)</option>
                            <option value="4x5">20/Page (4x5)</option>
                            <option value="5x5">25/Page (5x5)</option>
                        </select>
                    </div>
                ) : (
                    /* SIZE MODE CONTROLS */
                    <div className="flex items-center gap-2">
                        <div className="flex flex-col gap-1 w-20">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Width (cm)</label>
                            <input 
                                type="number" 
                                step="0.1"
                                value={widthCm}
                                onChange={(e) => handleDimensionChange('w', Number(e.target.value))}
                                className="text-sm border border-indigo-200 bg-indigo-50/50 p-1.5 rounded w-full font-medium focus:ring-2 focus:ring-indigo-500 outline-none h-[34px]"
                            />
                        </div>
                        <span className="mt-5 text-gray-400">x</span>
                        <div className="flex flex-col gap-1 w-20">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Height (cm)</label>
                            <input 
                                type="number" 
                                step="0.1"
                                value={heightCm}
                                onChange={(e) => handleDimensionChange('h', Number(e.target.value))}
                                className="text-sm border border-indigo-200 bg-indigo-50/50 p-1.5 rounded w-full font-medium focus:ring-2 focus:ring-indigo-500 outline-none h-[34px]"
                            />
                        </div>
                    </div>
                )}

                <div className="flex flex-col gap-1 w-24">
                     <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Design</label>
                     <div className="flex bg-gray-100 p-0.5 rounded-md h-[34px]">
                        <button
                            title="Modern Design"
                            onClick={() => setSettings(p => ({ ...p, designMode: 'modern' }))}
                            className={`flex-1 flex items-center justify-center rounded text-xs font-medium transition-all ${
                                settings.designMode === 'modern' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400'
                            }`}
                        >
                            <Palette className="w-4 h-4" />
                        </button>
                        <button
                            title="Simple Text Only"
                            onClick={() => setSettings(p => ({ ...p, designMode: 'simple' }))}
                            className={`flex-1 flex items-center justify-center rounded text-xs font-medium transition-all ${
                                settings.designMode === 'simple' ? 'bg-white text-black shadow-sm' : 'text-gray-400'
                            }`}
                        >
                            <Type className="w-4 h-4" />
                        </button>
                     </div>
                </div>

                <div className="flex flex-col gap-1 w-16">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Font px</label>
                    <input 
                        type="number" 
                        value={settings.fontSize}
                        onChange={(e) => setSettings(p => ({...p, fontSize: Number(e.target.value)}))}
                        className="text-sm border p-1.5 rounded w-full h-[34px]"
                    />
                </div>
                 
                 <div className="flex flex-col gap-1 items-center">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Border</label>
                    <input 
                        type="checkbox"
                        checked={settings.showBorders}
                        onChange={(e) => setSettings(p => ({...p, showBorders: e.target.checked}))}
                        className="h-5 w-5 text-indigo-600 rounded cursor-pointer mt-1.5"
                    />
                 </div>
            </div>


            {/* Actions */}
            <div className="flex items-center gap-2">
                 <button
                    onClick={onReset}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Reset File"
                  >
                    <RefreshCcw className="w-5 h-5" />
                  </button>

              {hasApiKey && (
                <button
                  onClick={onCleanData}
                  disabled={isCleaning}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isCleaning 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200'
                  }`}
                >
                   <Wand2 className={`w-4 h-4 ${isCleaning ? 'animate-spin' : ''}`} />
                   {isCleaning ? 'Cleaning...' : 'AI Clean'}
                </button>
              )}

              <div className="flex bg-indigo-600 rounded-lg shadow-md hover:scale-105 transition-all active:scale-95">
                  <button
                    onClick={onDownloadPdf}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-l-lg border-r border-indigo-700 font-medium"
                    title="Download as PDF"
                  >
                    <Download className="w-4 h-4" />
                    <span className="hidden sm:inline">PDF</span>
                  </button>
                  <button
                    onClick={onPrint}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-r-lg font-medium"
                    title="Print to Paper"
                  >
                    <Printer className="w-4 h-4" />
                    <span className="hidden sm:inline">Print</span>
                  </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
