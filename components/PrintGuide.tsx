
import React from 'react';
import { Printer, Check, X, Download, FileText } from 'lucide-react';

interface PrintGuideProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  mode: 'print' | 'pdf';
}

export const PrintGuide: React.FC<PrintGuideProps> = ({ isOpen, onClose, onConfirm, mode }) => {
  if (!isOpen) return null;

  const isPdf = mode === 'pdf';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 print:hidden backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            {isPdf ? (
                 <Download className="w-6 h-6 text-indigo-600" />
            ) : (
                 <Printer className="w-6 h-6 text-indigo-600" />
            )}
            {isPdf ? 'Download as PDF' : 'Ready to Print'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-sm text-gray-600 bg-gray-50 p-4 rounded-lg border border-gray-200">
          <p className="font-medium text-gray-900 mb-2">
            {isPdf ? 'To save as a PDF file:' : 'Printer Settings Checklist:'}
          </p>
          
          <ul className="space-y-3">
            {isPdf && (
                <li className="flex items-start gap-3 bg-indigo-50 p-2 rounded-md border border-indigo-100">
                <div className="bg-indigo-100 p-1 rounded-full text-indigo-700 mt-0.5 shrink-0">
                    <FileText className="w-3 h-3" />
                </div>
                <div>
                    <span className="font-bold text-gray-800">Destination:</span> Select <strong>"Save as PDF"</strong> in the dialog box.
                </div>
                </li>
            )}

            <li className="flex items-start gap-3">
              <div className="bg-green-100 p-1 rounded-full text-green-700 mt-0.5 shrink-0">
                <Check className="w-3 h-3" />
              </div>
              <div>
                <span className="font-bold text-gray-800">Paper Size:</span> Ensure it matches your selection in the toolbar.
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="bg-green-100 p-1 rounded-full text-green-700 mt-0.5 shrink-0">
                <Check className="w-3 h-3" />
              </div>
              <div>
                <span className="font-bold text-gray-800">Margins:</span> Set to <strong>None</strong> or <strong>Minimum</strong>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="bg-green-100 p-1 rounded-full text-green-700 mt-0.5 shrink-0">
                <Check className="w-3 h-3" />
              </div>
              <div>
                <span className="font-bold text-gray-800">Scale:</span> Set to <strong>100%</strong> (Default)
              </div>
            </li>
          </ul>
        </div>

        <div className="mt-8 flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium shadow-md flex items-center justify-center gap-2 transition-transform active:scale-95"
          >
            {isPdf ? <Download className="w-4 h-4" /> : <Printer className="w-4 h-4" />}
            {isPdf ? 'Proceed to Save' : 'Print Now'}
          </button>
        </div>
      </div>
    </div>
  );
};
