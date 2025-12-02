
import React, { useMemo } from 'react';
import { HouseRecord, GridSettings } from '../types';
import { MapPin, Phone, Map, AlertTriangle } from 'lucide-react';

interface PrintLayoutProps {
  records: HouseRecord[];
  settings: GridSettings;
}

export const PrintLayout: React.FC<PrintLayoutProps> = ({ records, settings }) => {
  
  // A4 Dimensions in mm
  const PAGE_WIDTH_MM = 210;
  const PAGE_HEIGHT_MM = 297;
  const PAGE_MARGIN_MM = 10; // Safe print margin
  
  // Calculate items per page based on mode
  const { itemsPerPage, gridStyle, cardStyle, itemsPerRow } = useMemo(() => {
    if (settings.mode === 'grid') {
      // AUTO GRID MODE
      return {
        itemsPerPage: settings.columns * settings.rows,
        itemsPerRow: settings.columns,
        gridStyle: {
          display: 'grid',
          gridTemplateColumns: `repeat(${settings.columns}, 1fr)`,
          gridTemplateRows: `repeat(${settings.rows}, 1fr)`,
          gap: `${settings.gap}mm`,
          height: '100%',
          width: '100%'
        },
        cardStyle: {
          width: '100%',
          height: '100%'
        }
      };
    } else {
      // EXACT SIZE MODE
      // Calculate how many fit
      const availableWidth = PAGE_WIDTH_MM - (PAGE_MARGIN_MM * 2);
      const availableHeight = PAGE_HEIGHT_MM - (PAGE_MARGIN_MM * 2);
      
      const cols = Math.floor((availableWidth + settings.gap) / (settings.itemWidth + settings.gap));
      const rows = Math.floor((availableHeight + settings.gap) / (settings.itemHeight + settings.gap));
      
      const safeCols = Math.max(1, cols);
      const safeRows = Math.max(1, rows);
      const calculatedItemsPerPage = safeCols * safeRows;

      return {
        itemsPerPage: calculatedItemsPerPage,
        itemsPerRow: safeCols,
        gridStyle: {
          display: 'flex',
          flexWrap: 'wrap' as const,
          gap: `${settings.gap}mm`,
          alignContent: 'flex-start',
          justifyContent: 'flex-start',
        },
        cardStyle: {
          width: `${settings.itemWidth}mm`,
          height: `${settings.itemHeight}mm`,
          flexShrink: 0
        }
      };
    }
  }, [settings]);

  // Pagination
  const pages = useMemo(() => {
    const pgs = [];
    const safeItemsPerPage = Math.max(1, itemsPerPage);
    for (let i = 0; i < records.length; i += safeItemsPerPage) {
      pgs.push(records.slice(i, i + safeItemsPerPage));
    }
    return pgs;
  }, [records, itemsPerPage]);

  return (
    <div className="flex flex-col items-center bg-gray-100 pt-8 pb-20 print:bg-white print:p-0">
      
      {/* Warning if items per page is very low in custom mode */}
      {settings.mode === 'size' && itemsPerPage < 4 && (
        <div className="mb-4 bg-yellow-50 text-yellow-800 px-4 py-2 rounded-lg flex items-center gap-2 border border-yellow-200 shadow-sm max-w-lg print:hidden">
          <AlertTriangle className="w-5 h-5 text-yellow-600" />
          <p className="text-sm">
            <strong>Note:</strong> With size {settings.itemWidth/10}x{settings.itemHeight/10}cm, only {itemsPerPage} label{itemsPerPage !== 1 && 's'} fit per page.
          </p>
        </div>
      )}

      {pages.map((pageRecords, pageIndex) => (
        <div 
          key={pageIndex}
          className="a4-page-preview a4-page relative box-border bg-white"
          style={{ padding: `${PAGE_MARGIN_MM}mm` }} 
        >
            {/* Page Content Grid */}
            <div style={gridStyle}>
                {pageRecords.map((record) => (
                    <div 
                        key={record.id} 
                        className={`flex flex-col overflow-hidden ${settings.showBorders ? 'border border-gray-800' : ''}`}
                        style={{ 
                            ...cardStyle,
                            padding: `${settings.padding}mm` 
                        }}
                    >
                        {settings.designMode === 'modern' ? (
                            // === MODERN DESIGN ===
                            <div className="h-full flex flex-col justify-between" style={{ fontSize: `${settings.fontSize}px`, lineHeight: 1.3 }}>
                                <div className="mb-1">
                                    <div className="font-bold text-gray-900 uppercase tracking-tight break-words line-clamp-2">
                                        {record.name || "Unknown Name"}
                                    </div>
                                </div>
                                <div className="flex-grow space-y-1">
                                    {(record.location || record.area) && (
                                        <div className="flex items-start gap-1 text-gray-700">
                                            <MapPin className="shrink-0 mt-[2px]" style={{ width: `${Math.max(10, settings.fontSize - 2)}px` }} />
                                            <div className="line-clamp-4">
                                                {record.location}
                                                {record.location && record.area && ', '}
                                                {record.area && <span className="whitespace-nowrap font-medium text-gray-800">{record.area}</span>}
                                            </div>
                                        </div>
                                    )}
                                    {record.pincode && (
                                        <div className="flex items-center gap-1 text-gray-600 pl-[1px]">
                                            <Map className="shrink-0" style={{ width: `${Math.max(10, settings.fontSize - 2)}px` }} />
                                            <span>Pin: {record.pincode}</span>
                                        </div>
                                    )}
                                </div>
                                {record.mobile && (
                                    <div className="mt-1 pt-1 border-t border-gray-200 flex items-center gap-1 font-mono font-bold text-gray-900 whitespace-nowrap overflow-hidden">
                                        <Phone className="shrink-0" style={{ width: `${Math.max(10, settings.fontSize - 1)}px` }} />
                                        <span>{record.mobile}</span>
                                    </div>
                                )}
                            </div>
                        ) : (
                            // === SIMPLE DESIGN (NO ICONS, PLAIN TEXT) ===
                            <div className="h-full flex flex-col font-sans" style={{ fontSize: `${settings.fontSize}px`, lineHeight: 1.3 }}>
                                {/* Name */}
                                <div className="font-bold text-black uppercase mb-1 leading-tight break-words">
                                    {record.name}
                                </div>

                                {/* Address Block */}
                                <div className="text-black flex-grow">
                                    {record.location && <div>{record.location}</div>}
                                    {record.area && <div>{record.area}</div>}
                                    {record.pincode && <div>Pincode: {record.pincode}</div>}
                                </div>

                                {/* Phone - Single Line Enforced */}
                                {record.mobile && (
                                    <div className="mt-2 font-bold text-black whitespace-nowrap overflow-hidden text-ellipsis">
                                        Ph: {record.mobile}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="absolute bottom-1 right-2 text-[10px] text-gray-300 print:hidden">
                Page {pageIndex + 1} of {pages.length}
            </div>
        </div>
      ))}
    </div>
  );
};
