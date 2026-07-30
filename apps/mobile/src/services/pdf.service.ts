import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ZakatResult } from '../types/zakat.types';
import { ZakatEngineResult } from '../engine/zakat/types';
import { InheritanceResult } from '../types/inheritance.types';

const HISTORY_ZAKAT_KEY = 'mizan_saved_zakat';
const HISTORY_INHERITANCE_KEY = 'mizan_saved_inheritance';

function formatCurrency(amount: number, currency = 'NGN'): string {
  const sym: Record<string, string> = { NGN: '₦', USD: '$', GBP: '£', EUR: '€', SAR: 'ر.س', AED: 'د.إ' };
  const prefix = sym[currency] ?? currency + ' ';
  return prefix + amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export const pdfService = {
  /**
   * Saves a Zakat calculation to local persistent storage.
   */
  saveZakatResult: async (result: ZakatResult, debts: string, exempt: string) => {
    try {
      const existing = await AsyncStorage.getItem(HISTORY_ZAKAT_KEY);
      const list = existing ? JSON.parse(existing) : [];
      const newItem = {
        id: 'zk_' + Date.now(),
        date: new Date().toISOString(),
        result,
        debts,
        exempt,
      };
      list.unshift(newItem);
      await AsyncStorage.setItem(HISTORY_ZAKAT_KEY, JSON.stringify(list.slice(0, 50)));
      return true;
    } catch (e) {
      console.error('Failed to save zakat result:', e);
      return false;
    }
  },

  /**
   * Saves an Inheritance calculation to local persistent storage.
   */
  saveInheritanceResult: async (result: InheritanceResult, totalEstate: string, currency: string) => {
    try {
      const existing = await AsyncStorage.getItem(HISTORY_INHERITANCE_KEY);
      const list = existing ? JSON.parse(existing) : [];
      const newItem = {
        id: 'inh_' + Date.now(),
        date: new Date().toISOString(),
        result,
        totalEstate,
        currency,
      };
      list.unshift(newItem);
      await AsyncStorage.setItem(HISTORY_INHERITANCE_KEY, JSON.stringify(list.slice(0, 50)));
      return true;
    } catch (e) {
      console.error('Failed to save inheritance result:', e);
      return false;
    }
  },

  /**
   * Generates and downloads/shares a PDF Report for Zakat Calculation.
   */
  generateAndShareZakatPDF: async (result: ZakatResult, debtsStr = '0', exemptStr = '0') => {
    const currency = result.currency || 'NGN';
    const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const refNo = 'ZK-' + Math.floor(100000 + Math.random() * 900000);

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Zakat Assessment Report - MIZAN</title>
        <style>
          body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            color: #1F2937;
            margin: 0;
            padding: 40px;
            background-color: #FFFFFF;
          }
          .header {
            background-color: #0D1F17;
            color: #FFFFFF;
            padding: 30px;
            border-radius: 12px;
            border-bottom: 4px solid #C9A84C;
            text-align: center;
          }
          .logo {
            font-size: 32px;
            font-weight: bold;
            color: #C9A84C;
            letter-spacing: 4px;
            margin-bottom: 4px;
          }
          .subtitle {
            font-size: 14px;
            color: #E2E8F0;
            text-transform: uppercase;
            letter-spacing: 2px;
          }
          .meta-row {
            display: flex;
            justify-content: space-between;
            margin-top: 30px;
            margin-bottom: 30px;
            padding-bottom: 12px;
            border-bottom: 1px solid #E5E7EB;
            font-size: 13px;
            color: #4B5563;
          }
          .status-badge {
            display: inline-block;
            padding: 8px 16px;
            border-radius: 20px;
            font-weight: bold;
            font-size: 14px;
            background-color: ${result.isDue ? '#DCFCE7' : '#FEE2E2'};
            color: ${result.isDue ? '#15803D' : '#B91C1C'};
          }
          .card {
            background-color: #F9FAFB;
            border: 1px solid #E5E7EB;
            border-radius: 10px;
            padding: 24px;
            margin-bottom: 30px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
          }
          th {
            text-align: left;
            padding: 12px;
            background-color: #F3F4F6;
            color: #374151;
            font-size: 12px;
            text-transform: uppercase;
          }
          td {
            padding: 12px;
            border-bottom: 1px solid #E5E7EB;
            font-size: 14px;
          }
          .total-box {
            background-color: #0D1F17;
            color: #FFFFFF;
            padding: 20px;
            border-radius: 10px;
            text-align: center;
            margin-top: 20px;
            border: 1px solid #C9A84C;
          }
          .total-amount {
            font-size: 32px;
            font-weight: bold;
            color: #C9A84C;
            margin-top: 6px;
          }
          .quran-box {
            background-color: #FFFBEB;
            border-left: 4px solid #C9A84C;
            padding: 16px;
            margin-top: 30px;
            border-radius: 0 8px 8px 0;
            font-style: italic;
            font-size: 13px;
            color: #92400E;
          }
          .footer {
            margin-top: 40px;
            text-align: center;
            font-size: 11px;
            color: #9CA3AF;
            border-top: 1px solid #E5E7EB;
            padding-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">MIZAN</div>
          <div class="subtitle">Official Zakat Assessment Report</div>
        </div>

        <div class="meta-row">
          <div><strong>Date:</strong> ${dateStr}</div>
          <div><strong>Ref No:</strong> ${refNo}</div>
          <div><span class="status-badge">${result.isDue ? 'ZAKAT OBLIGATORY (DUE)' : 'BELOW NISAB (NOT DUE)'}</span></div>
        </div>

        <div class="card">
          <h3 style="margin-top:0; color:#0D1F17;">Wealth Breakdown</h3>
          <table>
            <thead>
              <tr>
                <th>Category</th>
                <th style="text-align:right;">Amount (${currency})</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Total Zakatable Assets</td>
                <td style="text-align:right; font-weight:bold;">${formatCurrency(result.totalZakatableWealth, currency)}</td>
              </tr>
              ${parseFloat(debtsStr) > 0 ? `
              <tr>
                <td style="color:#DC2626;">(-) Outstanding Debts Deducted</td>
                <td style="text-align:right; color:#DC2626;">-${formatCurrency(parseFloat(debtsStr), currency)}</td>
              </tr>` : ''}
              ${parseFloat(exemptStr) > 0 ? `
              <tr>
                <td style="color:#DC2626;">(-) Exemptions Deducted</td>
                <td style="text-align:right; color:#DC2626;">-${formatCurrency(parseFloat(exemptStr), currency)}</td>
              </tr>` : ''}
              <tr style="background-color:#F3F4F6;">
                <td><strong>Net Zakatable Base</strong></td>
                <td style="text-align:right; font-weight:bold; color:#0D1F17;">${formatCurrency(result.netZakatableWealth, currency)}</td>
              </tr>
              <tr>
                <td>Nisab Threshold Required</td>
                <td style="text-align:right;">${formatCurrency(result.nisabThreshold, currency)}</td>
              </tr>
              <tr>
                <td>Applicable Zakat Rate</td>
                <td style="text-align:right;">${(result.zakatRate * 100).toFixed(1)}% (1/40th)</td>
              </tr>
            </tbody>
          </table>

          <div class="total-box">
            <div style="font-size:12px; text-transform:uppercase; letter-spacing:1px; color:#E2E8F0;">Zakat Payable</div>
            <div class="total-amount">${formatCurrency(result.zakatDue, currency)}</div>
          </div>
        </div>

        <div class="quran-box">
          "Take from their wealth a charity by which you purify them and cause them increase..."
          <br><br>
          <strong>— Holy Quran (Surah At-Tawbah 9:103)</strong>
        </div>

        <div class="footer">
          Generated electronically by MIZAN Shariah Platform. Verified for Islamic Jurisprudence Compliance.<br>
          This calculation report is for personal financial guidance.
        </div>
      </body>
      </html>
    `;

    const { uri } = await Print.printToFileAsync({ html: htmlContent });
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri, {
        mimeType: 'application/pdf',
        dialogTitle: 'Save Zakat Assessment PDF Report',
        UTI: 'com.adobe.pdf',
      });
    }
  },

  /**
   * Saves a ZakatEngineResult (new Rule Engine format) to local history.
   */
  saveZakatEngineResult: async (result: ZakatEngineResult) => {
    try {
      const existing = await AsyncStorage.getItem(HISTORY_ZAKAT_KEY);
      const list = existing ? JSON.parse(existing) : [];
      const newItem = { id: 'zk_' + Date.now(), date: new Date().toISOString(), engineResult: result };
      list.unshift(newItem);
      await AsyncStorage.setItem(HISTORY_ZAKAT_KEY, JSON.stringify(list.slice(0, 50)));
      return true;
    } catch (e) {
      console.error('Failed to save zakat engine result:', e);
      return false;
    }
  },

  /**
   * Generates and shares a professional Zakat PDF using the new ZakatEngineResult.
   */
  generateAndShareZakatEnginePDF: async (result: ZakatEngineResult) => {
    const currency = result.currency || 'NGN';
    const sym: Record<string, string> = { NGN: '₦', USD: '$', GBP: '£', EUR: '€' };
    const currSym = sym[currency] ?? currency + ' ';
    const fmt = (n: number) => currSym + n.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const dateStr = new Date(result.calculatedAt).toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' });
    const refNo = 'ZK-' + Math.floor(100000 + Math.random() * 900000);

    const categoryRowsHtml = result.categories.map(cat => {
      const isLivestock = cat.id === 'livestock';
      const metaHtml = cat.metadata
        ? Object.entries(cat.metadata).map(([k, v]) => `<tr><td style="color:#6B7280;padding-left:16px;">${k}</td><td style="text-align:right;color:#6B7280;">${v}</td></tr>`).join('')
        : '';
      return `
        <tr style="background-color:#F9FAFB;">
          <td colspan="3" style="padding:10px 12px;"><strong style="color:#0D1F17;">${cat.name}</strong></td>
        </tr>
        ${!isLivestock && cat.declared > 0 ? `<tr><td style="padding-left:16px;">Declared</td><td></td><td style="text-align:right;">${fmt(cat.declared)}</td></tr>` : ''}
        ${cat.rateLabel !== 'Per Hadith Table' ? `<tr><td style="padding-left:16px;">Rate</td><td></td><td style="text-align:right;font-weight:bold;">${cat.rateLabel}</td></tr>` : ''}
        ${metaHtml}
        ${!isLivestock && cat.isEligible ? `<tr><td style="padding-left:16px;"><strong>Zakat Due</strong></td><td></td><td style="text-align:right;font-weight:bold;color:#C9A84C;">${fmt(cat.zakatDue)}</td></tr>` : ''}
        ${isLivestock && cat.isEligible ? `<tr><td style="padding-left:16px;font-style:italic;color:#92400E;">Payable in kind — consult a scholar.</td><td></td><td></td></tr>` : ''}
        <tr><td colspan="3" style="padding:8px 12px;font-size:12px;color:#6B7280;border-left:3px solid #C9A84C;background:#FFFBEB;">${cat.explanation}</td></tr>
        ${cat.references.map(r => `<tr><td colspan="3" style="padding:4px 12px;font-size:11px;color:#9CA3AF;"><em>${r.text}</em> — ${r.source}</td></tr>`).join('')}
        <tr><td colspan="3" style="padding:0;"><hr style="border:none;border-top:1px solid #E5E7EB;"/></td></tr>
      `;
    }).join('');

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Zakat Assessment Report — MIZAN</title>
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1F2937; margin: 0; padding: 40px; background: #FFF; }
          .header { background: #0D1F17; color: #FFF; padding: 28px 30px; border-radius: 12px; border-bottom: 4px solid #C9A84C; text-align: center; }
          .logo { font-size: 30px; font-weight: 900; color: #C9A84C; letter-spacing: 6px; }
          .tagline { font-size: 12px; color: #A8B8A0; text-transform: uppercase; letter-spacing: 2px; margin-top: 4px; }
          .meta { display: flex; justify-content: space-between; margin: 24px 0; font-size: 12px; color: #6B7280; padding-bottom: 12px; border-bottom: 1px solid #E5E7EB; }
          .status { display: inline-block; padding: 6px 14px; border-radius: 20px; font-weight: bold; font-size: 13px; background: ${result.isDue ? '#DCFCE7' : '#F3F4F6'}; color: ${result.isDue ? '#15803D' : '#6B7280'}; }
          .card { background: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 10px; padding: 22px; margin-bottom: 24px; }
          h3 { color: #0D1F17; margin-top: 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; }
          table { width: 100%; border-collapse: collapse; }
          td { padding: 9px 12px; border-bottom: 1px solid #F3F4F6; font-size: 13px; }
          .total-box { background: #0D1F17; color: #FFF; padding: 20px; border-radius: 10px; text-align: center; margin-top: 16px; border: 1px solid #C9A84C; }
          .total-lbl { font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #A8B8A0; }
          .total-amt { font-size: 30px; font-weight: 900; color: #C9A84C; margin-top: 4px; }
          .quran { background: #FFFBEB; border-left: 4px solid #C9A84C; padding: 14px; margin-top: 24px; border-radius: 0 8px 8px 0; font-style: italic; font-size: 12px; color: #92400E; }
          .disclaimer { margin-top: 32px; padding: 14px; background: #FFF7ED; border-radius: 8px; font-size: 11px; color: #92400E; line-height: 1.6; }
          .footer { margin-top: 30px; text-align: center; font-size: 10px; color: #9CA3AF; border-top: 1px solid #E5E7EB; padding-top: 16px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">MIZAN</div>
          <div class="tagline">Official Zakat Assessment Report</div>
        </div>

        <div class="meta">
          <div><strong>Date:</strong> ${dateStr}</div>
          <div><strong>Ref No:</strong> ${refNo}</div>
          <div><strong>Madhhab:</strong> ${result.madhhab}</div>
          <div><span class="status">${result.isDue ? 'ZAKAT OBLIGATORY' : 'BELOW NISAB'}</span></div>
        </div>

        <div class="card">
          <h3>Overall Summary</h3>
          <table>
            <tr><td>Total Declared Wealth</td><td style="text-align:right;font-weight:bold;">${fmt(result.totalDeclaredWealth)}</td></tr>
            ${result.totalDebts > 0 ? `<tr><td style="color:#DC2626;">(-) Outstanding Debts</td><td style="text-align:right;color:#DC2626;">−${fmt(result.totalDebts)}</td></tr>` : ''}
            <tr><td><strong>Net Zakatable Wealth</strong></td><td style="text-align:right;font-weight:bold;color:#0D1F17;">${fmt(result.netZakatableWealth)}</td></tr>
            <tr><td>Nisab Threshold</td><td style="text-align:right;">${fmt(result.nisabThreshold)}</td></tr>
            <tr><td>Nisab Status</td><td style="text-align:right;font-weight:bold;color:${result.netZakatableWealth >= result.nisabThreshold ? '#15803D' : '#B91C1C'}">${result.netZakatableWealth >= result.nisabThreshold ? 'Meets Nisab ✓' : 'Below Nisab ✗'}</td></tr>
          </table>
          <div class="total-box">
            <div class="total-lbl">Total Zakat Due</div>
            <div class="total-amt">${fmt(result.totalZakatDue)}</div>
          </div>
        </div>

        <div class="card">
          <h3>Breakdown by Wealth Category</h3>
          <table>${categoryRowsHtml}</table>
        </div>

        <div class="quran">
          "Take from their wealth a charity by which you purify them and cause them increase, and invoke blessings upon them."
          <br><br><strong>— Holy Qur'ān (Sūrah At-Tawbah 9:103)</strong>
        </div>

        <div class="disclaimer">
          <strong>Disclaimer:</strong> This Zakat calculation is generated by the MIZAN Rule Engine based on the declared values provided by the user.
          The results are intended for personal guidance only. For binding religious rulings, please consult a qualified Islamic scholar or Mufti.
          MIZAN does not issue Fatwas.
        </div>

        <div class="footer">
          Generated by MIZAN Shariah Platform · ${dateStr} · Ref: ${refNo}
        </div>
      </body>
      </html>
    `;

    const { uri } = await Print.printToFileAsync({ html: htmlContent });
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri, { mimeType: 'application/pdf', dialogTitle: 'Save Zakat Report PDF', UTI: 'com.adobe.pdf' });
    }
  },

  /**
   * Generates and downloads/shares a PDF Report for Inheritance Calculation.
   */
  generateAndShareInheritancePDF: async (
    result: InheritanceResult,
    totalEstateStr = '0',
    debtsStr = '0',
    funeralStr = '0',
    wasiyyahStr = '0',
    currency = 'NGN'
  ) => {
    const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const refNo = 'INH-' + Math.floor(100000 + Math.random() * 900000);

    const activeShares = result.shares.filter(s => !s.isBlocked && s.shareType !== 'BLOCKED' && s.shareType !== 'NONE');
    const blockedShares = result.shares.filter(s => s.isBlocked || s.shareType === 'BLOCKED');

    const activeRowsHtml = activeShares.map(s => `
      <tr>
        <td><strong>${s.label}</strong> (×${s.count})</td>
        <td style="text-align:center;"><span style="background-color:#E0E7FF; color:#3730A3; padding:2px 8px; border-radius:12px; font-weight:bold; font-size:12px;">${s.shareType}</span></td>
        <td style="text-align:center; font-weight:bold; color:#0D1F17;">${s.fractionLabel}</td>
        <td style="text-align:right;">${(s.shareOfEstate * 100).toFixed(2)}%</td>
        <td style="text-align:right; font-weight:bold; color:#0D1F17;">${formatCurrency(s.totalAmount, currency)}</td>
      </tr>
    `).join('');

    const blockedRowsHtml = blockedShares.map(s => `
      <tr style="background-color:#FEF2F2;">
        <td style="color:#991B1B;"><strong>${s.label}</strong> (×${s.count})</td>
        <td style="text-align:center;"><span style="background-color:#FEE2E2; color:#991B1B; padding:2px 8px; border-radius:12px; font-size:11px;">BLOCKED</span></td>
        <td colspan="3" style="font-size:12px; color:#B91C1C;">${s.blockingReason || 'Excluded by higher-priority heirs (Hajb Hirman)'}</td>
      </tr>
    `).join('');

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Islamic Inheritance Report - MIZAN</title>
        <style>
          body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            color: #1F2937;
            margin: 0;
            padding: 40px;
            background-color: #FFFFFF;
          }
          .header {
            background-color: #0D1F17;
            color: #FFFFFF;
            padding: 30px;
            border-radius: 12px;
            border-bottom: 4px solid #C9A84C;
            text-align: center;
          }
          .logo {
            font-size: 32px;
            font-weight: bold;
            color: #C9A84C;
            letter-spacing: 4px;
            margin-bottom: 4px;
          }
          .subtitle {
            font-size: 14px;
            color: #E2E8F0;
            text-transform: uppercase;
            letter-spacing: 2px;
          }
          .meta-row {
            display: flex;
            justify-content: space-between;
            margin-top: 30px;
            margin-bottom: 30px;
            padding-bottom: 12px;
            border-bottom: 1px solid #E5E7EB;
            font-size: 13px;
            color: #4B5563;
          }
          .method-badge {
            display: inline-block;
            padding: 6px 14px;
            border-radius: 20px;
            font-weight: bold;
            font-size: 13px;
            background-color: #FEF3C7;
            color: #92400E;
          }
          .card {
            background-color: #F9FAFB;
            border: 1px solid #E5E7EB;
            border-radius: 10px;
            padding: 24px;
            margin-bottom: 24px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
          }
          th {
            text-align: left;
            padding: 10px;
            background-color: #F3F4F6;
            color: #374151;
            font-size: 11px;
            text-transform: uppercase;
          }
          td {
            padding: 10px;
            border-bottom: 1px solid #E5E7EB;
            font-size: 13px;
          }
          .summary-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 12px;
            margin-top: 10px;
          }
          .summary-box {
            background-color: #FFFFFF;
            border: 1px solid #E5E7EB;
            border-radius: 8px;
            padding: 12px;
            text-align: center;
          }
          .summary-val {
            font-size: 18px;
            font-weight: bold;
            color: #0D1F17;
            margin-top: 4px;
          }
          .quran-box {
            background-color: #FFFBEB;
            border-left: 4px solid #C9A84C;
            padding: 16px;
            margin-top: 24px;
            border-radius: 0 8px 8px 0;
            font-style: italic;
            font-size: 13px;
            color: #92400E;
          }
          .footer {
            margin-top: 40px;
            text-align: center;
            font-size: 11px;
            color: #9CA3AF;
            border-top: 1px solid #E5E7EB;
            padding-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">MIZAN</div>
          <div class="subtitle">Official Islamic Inheritance (Mirath) Statement</div>
        </div>

        <div class="meta-row">
          <div><strong>Date:</strong> ${dateStr}</div>
          <div><strong>Ref No:</strong> ${refNo}</div>
          <div><span class="method-badge">School: ${result.madhhab} (Method: ${result.calculationMethod})</span></div>
        </div>

        <div class="card">
          <h3 style="margin-top:0; color:#0D1F17;">1. Estate Accounting Breakdown</h3>
          <table>
            <tbody>
              <tr>
                <td>Gross Estate Value</td>
                <td style="text-align:right; font-weight:bold;">${formatCurrency(parseFloat(totalEstateStr) || 0, currency)}</td>
              </tr>
              ${parseFloat(debtsStr) > 0 ? `
              <tr>
                <td style="color:#DC2626;">(-) Debts Settled (Duyun)</td>
                <td style="text-align:right; color:#DC2626;">-${formatCurrency(parseFloat(debtsStr), currency)}</td>
              </tr>` : ''}
              ${parseFloat(funeralStr) > 0 ? `
              <tr>
                <td style="color:#DC2626;">(-) Funeral Expenses (Tajhiz)</td>
                <td style="text-align:right; color:#DC2626;">-${formatCurrency(parseFloat(funeralStr), currency)}</td>
              </tr>` : ''}
              ${parseFloat(wasiyyahStr) > 0 ? `
              <tr>
                <td style="color:#DC2626;">(-) Executed Will (Wasiyyah max 1/3)</td>
                <td style="text-align:right; color:#DC2626;">-${formatCurrency(parseFloat(wasiyyahStr), currency)}</td>
              </tr>` : ''}
              <tr style="background-color:#ECFDF5;">
                <td><strong>Net Distributable Estate</strong></td>
                <td style="text-align:right; font-weight:bold; font-size:16px; color:#047857;">${formatCurrency(result.netEstate, currency)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="card">
          <h3 style="margin-top:0; color:#0D1F17;">2. Heir Distribution Shares</h3>
          <table>
            <thead>
              <tr>
                <th>Heir Category</th>
                <th style="text-align:center;">Type</th>
                <th style="text-align:center;">Fraction</th>
                <th style="text-align:right;">% Share</th>
                <th style="text-align:right;">Total Amount (${currency})</th>
              </tr>
            </thead>
            <tbody>
              ${activeRowsHtml}
              ${blockedRowsHtml}
            </tbody>
          </table>
        </div>

        <div class="quran-box">
          "Allah instructs you concerning your children: for the male, what is equal to the share of two females..."
          <br><br>
          <strong>— Holy Quran (Surah An-Nisa 4:11-12)</strong>
        </div>

        <div class="footer">
          Generated electronically by MIZAN Shariah Mirath Engine. Verified against Shariah Faraid Principles.<br>
          This is an official calculation summary. For legal disputes or probate, consult a qualified Mufti or Islamic court.
        </div>
      </body>
      </html>
    `;

    const { uri } = await Print.printToFileAsync({ html: htmlContent });
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri, {
        mimeType: 'application/pdf',
        dialogTitle: 'Save Islamic Inheritance PDF Report',
        UTI: 'com.adobe.pdf',
      });
    }
  },
};
