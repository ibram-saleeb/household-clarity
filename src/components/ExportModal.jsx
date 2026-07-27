import React, { useState, useRef } from 'react';
import { X, Download, Upload, FileText, FileCode, CheckCircle, AlertCircle } from 'lucide-react';
import { exportStateToJson, exportStateToCsv, parseStateFromJson } from '../storage/exporter.js';

export function ExportModal({ isOpen, onClose, appState, calculatedData, onImportState }) {
  const [importStatus, setImportStatus] = useState(null); // { success: boolean, message: string }
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleDownloadJson = () => {
    exportStateToJson(appState);
  };

  const handleDownloadCsv = () => {
    exportStateToCsv(appState, calculatedData);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      const result = parseStateFromJson(content);

      if (result.success) {
        onImportState(result.state);
        setImportStatus({
          success: true,
          message: 'Tandem state successfully imported and recalculated!'
        });
      } else {
        setImportStatus({
          success: false,
          message: result.error
        });
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // Reset input
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content export-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <Download className="icon-md text-primary" />
            <div>
              <h3 className="modal-title">Backup, Export & Restore</h3>
              <p className="modal-subtitle">Download your household snapshot or restore from a backup</p>
            </div>
          </div>
          <button className="btn-close" onClick={onClose} aria-label="Close modal">
            <X className="icon-sm" />
          </button>
        </div>

        <div className="modal-body export-modal-body">
          {/* Export Options Grid */}
          <div className="export-grid">
            <div className="export-card">
              <div className="export-card-header">
                <FileCode className="icon-md text-info" />
                <h4>JSON State Backup</h4>
              </div>
              <p className="export-card-desc">
                Full 1-click snapshot of all partners, salaries, super settings, extra incomes, expenses, and scenario settings. Use this file to restore your state anytime.
              </p>
              <button className="btn btn-primary btn-block" onClick={handleDownloadJson}>
                <Download className="icon-sm" /> Download JSON Backup
              </button>
            </div>

            <div className="export-card">
              <div className="export-card-header">
                <FileText className="icon-md text-warning" />
                <h4>CSV Spreadsheet Report</h4>
              </div>
              <p className="export-card-desc">
                Formatted multi-section CSV report containing net cashflow summaries, tax details, and normalised expense breakdowns ready for Microsoft Excel or Google Sheets.
              </p>
              <button className="btn btn-secondary btn-block" onClick={handleDownloadCsv}>
                <Download className="icon-sm" /> Download CSV Report
              </button>
            </div>
          </div>

          <hr className="export-divider" />

          {/* Import / Restore Section */}
          <div className="import-section">
            <div className="import-header">
              <Upload className="icon-md text-primary" />
              <div>
                <h4>Restore From Backup (.json)</h4>
                <p className="import-desc">Select a previously exported Tandem `.json` file to restore your household data.</p>
              </div>
            </div>

            <div className="import-action-row">
              <input
                type="file"
                ref={fileInputRef}
                accept=".json,application/json"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
              <button className="btn btn-outline" onClick={() => fileInputRef.current?.click()}>
                <Upload className="icon-sm" /> Choose Backup File...
              </button>
            </div>

            {importStatus && (
              <div className={`alert-box ${importStatus.success ? 'alert-success' : 'alert-error'}`}>
                {importStatus.success ? (
                  <CheckCircle className="icon-sm inline-icon text-surplus" />
                ) : (
                  <AlertCircle className="icon-sm inline-icon text-deficit" />
                )}
                <span>{importStatus.message}</span>
              </div>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
