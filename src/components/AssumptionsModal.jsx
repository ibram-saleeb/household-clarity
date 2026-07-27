import React from 'react';
import { X, ExternalLink, ShieldCheck, Info } from 'lucide-react';
import { ATO_TAX_CONFIG } from '../config/atoTaxConfig';

export function AssumptionsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <ShieldCheck className="icon-md text-success inline-icon" />
            <h2 className="modal-title">ATO Tax Rates & Financial Assumptions</h2>
          </div>
          <button className="btn-icon-close" onClick={onClose}>
            <X className="icon-sm" />
          </button>
        </div>

        <div className="modal-body">
          <div className="modal-alert modal-alert-info">
            <Info className="icon-sm inline-icon text-info" />
            <div>
              <strong>Source Citation & Effective Date:</strong>
              <p>
                Calculations use official Australian Taxation Office (ATO) individual resident income tax brackets for {ATO_TAX_CONFIG.financialYearLabel} (Stage 3 Tax Cuts). Last verified: <strong>{ATO_TAX_CONFIG.lastVerifiedDate}</strong>.
              </p>
            </div>
          </div>

          <h3 className="modal-section-title">1. ATO Resident Tax Brackets (Stage 3 Rates)</h3>
          <div className="table-responsive">
            <table className="modal-table">
              <thead>
                <tr>
                  <th>Taxable Income Threshold</th>
                  <th>Tax Rate</th>
                  <th>Base Tax Calculation</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>$0 – $18,200</td>
                  <td>0%</td>
                  <td>Nil</td>
                </tr>
                <tr>
                  <td>$18,201 – $45,000</td>
                  <td>16%</td>
                  <td>16c for each $1 over $18,200</td>
                </tr>
                <tr>
                  <td>$45,001 – $135,000</td>
                  <td>30%</td>
                  <td>$4,288 + 30c for each $1 over $45,000</td>
                </tr>
                <tr>
                  <td>$135,001 – $190,000</td>
                  <td>37%</td>
                  <td>$31,288 + 37c for each $1 over $135,000</td>
                </tr>
                <tr>
                  <td>$190,001 and above</td>
                  <td>45%</td>
                  <td>$51,638 + 45c for each $1 over $190,000</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="modal-section-title">2. Medicare Levy & Super Guarantee</h3>
          <ul className="modal-list">
            <li>
              <strong>Medicare Levy:</strong> Standard rate of <code>2.0%</code> applied to gross taxable income.
            </li>
            <li>
              <strong>Superannuation Guarantee (SG):</strong> Default rate of <code>12.0%</code>. Super is treated as money transferred directly to your superannuation fund, so it is excluded from usable spendable cash.
            </li>
            <li>
              <strong>HECS/HELP & Tax Offsets:</strong> This MVP provides an baseline estimate of primary income tax and Medicare levy. Custom tax offsets (LITO), HECS repayments, or private health rebate adjustments are excluded.
            </li>
          </ul>

          <h3 className="modal-section-title">3. Frequency Normalisation Formulae</h3>
          <ul className="modal-list">
            <li><strong>Weekly:</strong> Amount $\times$ 52 weeks / 12 months</li>
            <li><strong>Fortnightly:</strong> Amount $\times$ 26 fortnights / 12 months</li>
            <li><strong>Monthly:</strong> Direct monthly amount</li>
            <li><strong>Annual:</strong> Amount / 12 months</li>
          </ul>

          <div className="modal-alert modal-alert-warning">
            <strong>Important Disclaimer:</strong>
            <p>{ATO_TAX_CONFIG.disclaimer}</p>
          </div>

          <div className="modal-links">
            <a
              href={ATO_TAX_CONFIG.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="link-external"
            >
              Verify rates on official ATO website <ExternalLink className="icon-xs inline-icon" />
            </a>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-primary" onClick={onClose}>
            Got it, Back to App
          </button>
        </div>
      </div>
    </div>
  );
}
