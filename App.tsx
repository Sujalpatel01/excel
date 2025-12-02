
import React, { useState } from 'react';
import { HouseRecord, GridSettings, DEFAULT_SETTINGS } from './types';
import { parseExcelFile } from './services/excelService';
import { cleanDataWithGemini } from './services/geminiService';
import { DropZone } from './components/DropZone';
import { Toolbar } from './components/Toolbar';
import { PrintLayout } from './components/PrintLayout';
import { PrintGuide } from './components/PrintGuide';
import { AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [records, setRecords] = useState<HouseRecord[]>([]);
  const [settings, setSettings] = useState<GridSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isCleaning, setIsCleaning] = useState<boolean>(false);
  
  // Print flow state
  const [showPrintGuide, setShowPrintGuide] = useState<boolean>(false);
  const [printMode, setPrintMode] = useState<'print' | 'pdf'>('print');

  // Check if API key is available
  const hasApiKey = !!process.env.API_KEY;

  const handleFileLoaded = async (file: File) => {
    setLoading(true);
    setError(null);
    try {
      const data = await parseExcelFile(file);
      setRecords(data);
    } catch (err) {
      setError("Failed to parse Excel file. Please ensure it is a valid .xlsx file.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCleanData = async () => {
    if (!hasApiKey) return;
    setIsCleaning(true);
    try {
      const cleaned = await cleanDataWithGemini(records);
      setRecords(cleaned);
    } catch (err) {
      setError("Failed to clean data with Gemini. Check API Key or limits.");
      console.error(err);
    } finally {
      setIsCleaning(false);
    }
  };

  const initiatePrint = () => {
    setPrintMode('print');
    setShowPrintGuide(true);
  };

  const initiateDownloadPdf = () => {
    setPrintMode('pdf');
    setShowPrintGuide(true);
  };

  const handleConfirmPrint = () => {
    setShowPrintGuide(false);
    setTimeout(() => {
        window.print();
    }, 300); // Small delay to allow modal to close completely
  };

  const handleReset = () => {
    setRecords([]);
    setError(null);
  };

  return (
    <div className="min-h-screen">
      <PrintGuide 
        isOpen={showPrintGuide} 
        onClose={() => setShowPrintGuide(false)} 
        onConfirm={handleConfirmPrint}
        mode={printMode}
      />

      {/* If no records, show upload screen */}
      {records.length === 0 ? (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
          <div className="w-full max-w-4xl space-y-8">
            <div className="text-center space-y-2">
              <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">GridPrint Pro</h1>
              <p className="text-lg text-gray-600">The easiest way to print Excel data to A4 labels.</p>
            </div>
            
            <DropZone onFileLoaded={handleFileLoaded} />
            
            {loading && (
               <div className="text-center text-indigo-600 animate-pulse">Processing file...</div>
            )}
            
            {error && (
              <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-center justify-center gap-2">
                <AlertCircle className="w-5 h-5" />
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <div className="h-10 w-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4 text-xl font-bold">1</div>
                    <h3 className="font-semibold mb-2">Upload Excel</h3>
                    <p className="text-sm text-gray-500">Drag and drop your .xlsx file containing owner details.</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                     <div className="h-10 w-10 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-4 text-xl font-bold">2</div>
                    <h3 className="font-semibold mb-2">Check Layout</h3>
                    <p className="text-sm text-gray-500">We automatically arrange 16 records per A4 page (4x4 grid).</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                     <div className="h-10 w-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4 text-xl font-bold">3</div>
                    <h3 className="font-semibold mb-2">Print</h3>
                    <p className="text-sm text-gray-500">Hit print to generate perfectly aligned A4 pages.</p>
                </div>
            </div>
          </div>
        </div>
      ) : (
        /* Main Workspace */
        <>
          <Toolbar 
            settings={settings} 
            setSettings={setSettings} 
            onPrint={initiatePrint}
            onDownloadPdf={initiateDownloadPdf}
            onCleanData={handleCleanData}
            isCleaning={isCleaning}
            hasApiKey={hasApiKey}
            recordCount={records.length}
            onReset={handleReset}
          />
          <PrintLayout records={records} settings={settings} />
        </>
      )}
    </div>
  );
};

export default App;
