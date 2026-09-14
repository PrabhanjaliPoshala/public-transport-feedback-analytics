import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ImportSummary } from '../types';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, Database, Sparkles } from 'lucide-react';

export const CSVImportPage: React.FC = () => {
  const { importCSVData } = useApp();
  const [csvContent, setCsvContent] = useState<string>('');
  const [summary, setSummary] = useState<ImportSummary | null>(null);
  const [fileName, setFileName] = useState<string>('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      setCsvContent(text);
    };
    reader.readAsText(file);
  };

  const handleProcessImport = () => {
    if (!csvContent.trim()) return;
    const res = importCSVData(csvContent);
    setSummary(res);
  };

  const loadSampleMTAData = () => {
    const sample = `Created Date,Complaint Type,Descriptor,Borough/Route,Rating,Comment
2026-09-10T17:45:00Z,Crowding,Overcrowded Bus,Route 42,1.0,"Bus was jammed to capacity at 5:45 PM."
2026-09-10T18:10:00Z,Punctuality / Delay,Bus Delay,Route 42,2.0,"Waited 35 minutes for Route 42."
2026-09-11T08:15:00Z,Cleanliness,Dirty Seats,Route 17,3.0,"Seats had sticky spills near the exit."
2026-09-11T17:30:00Z,Crowding,No Standing Room,Route 42,1.0,"Complete overcrowding during peak rush."
2026-09-12T12:00:00Z,Driver Behaviour,Abrupt Braking,Route 4,3.0,"Driver applied hard brakes unexpectedly."
2026-09-12T18:00:00Z,Punctuality / Delay,Bus Bunching,Route 42,2.0,"Two buses arrived back to back after 40 min delay."`;

    setFileName('sample_mta_311_feedback.csv');
    setCsvContent(sample);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-extrabold text-white mb-2">Import Public Transit CSV Dataset</h1>
        <p className="text-slate-400 text-sm">Support for New York MTA 311 or custom customer feedback datasets.</p>
      </div>

      {/* Upload Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl text-center mb-8">
        
        <div className="w-16 h-16 rounded-2xl bg-blue-950 text-blue-400 border border-blue-800 flex items-center justify-center mx-auto mb-4">
          <UploadCloud className="w-8 h-8" />
        </div>

        <h3 className="text-lg font-bold text-white mb-1">Upload CSV Feedback File</h3>
        <p className="text-xs text-slate-400 mb-6">Select a CSV file containing route feedback records</p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <label className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm cursor-pointer transition-colors shadow-md">
            <span>Browse CSV File</span>
            <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
          </label>

          <button
            onClick={loadSampleMTAData}
            className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm border border-slate-700 flex items-center gap-2 transition-colors"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Load Sample MTA 311 Dataset</span>
          </button>
        </div>

        {fileName && (
          <div className="mt-4 p-3 bg-slate-950 rounded-xl border border-slate-800 inline-flex items-center gap-2 text-xs text-slate-300">
            <FileText className="w-4 h-4 text-blue-400" />
            <span>File loaded: <strong>{fileName}</strong></span>
          </div>
        )}
      </div>

      {/* Process Import Button */}
      {csvContent && !summary && (
        <div className="text-center mb-8">
          <button
            onClick={handleProcessImport}
            className="px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-base shadow-lg shadow-emerald-950/40 transition-all hover:scale-105"
          >
            Clean, Transform & Import Records to Database
          </button>
        </div>
      )}

      {/* Import Summary Results Card */}
      {summary && (
        <div className="bg-slate-900 border border-emerald-800 rounded-2xl p-6 shadow-2xl animate-fade-in">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-6">
            <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            <div>
              <h3 className="text-xl font-bold text-white">Dataset Imported Successfully</h3>
              <p className="text-xs text-slate-400">Cleaned and integrated into local dataset</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs mb-6">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <span className="text-slate-400 block">Records Processed</span>
              <span className="text-2xl font-extrabold text-emerald-400">{summary.recordsImported}</span>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <span className="text-slate-400 block">Records Rejected</span>
              <span className="text-2xl font-extrabold text-rose-400">{summary.recordsRejected}</span>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <span className="text-slate-400 block">Routes Detected</span>
              <span className="text-2xl font-extrabold text-blue-400">{summary.routesDetected}</span>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <span className="text-slate-400 block">Date Range</span>
              <span className="font-bold text-white">{summary.dateRange.start} to {summary.dateRange.end}</span>
            </div>
          </div>

          <div>
            <span className="text-xs text-slate-400 block mb-2 font-semibold">Detected Complaint Categories:</span>
            <div className="flex flex-wrap gap-2">
              {summary.categoriesDetected.map((cat) => (
                <span key={cat} className="px-2.5 py-1 rounded bg-purple-950 text-purple-300 text-xs border border-purple-800">
                  {cat}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
