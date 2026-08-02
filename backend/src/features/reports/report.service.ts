import fs from 'fs';
import path from 'path';

export interface HeirShareData {
  name: string;
  count: number;
  share: string;
  amount: number;
  percentage: number;
}

export interface InheritanceReportData {
  referenceNo: string;
  date: string;
  totalEstate: number;
  debts: number;
  funeralExpenses: number;
  wasiyyah: number;
  netEstate: number;
  currency: string;
  method: string;
  heirs: HeirShareData[];
}

export interface ZakatAssetData {
  type: string;
  value: number;
}

export interface ZakatReportData {
  date: string;
  calculationDate: string;
  assets: ZakatAssetData[];
  deductions: ZakatAssetData[];
  netWealth: number;
  nisab: number;
  zakatDue: number;
  currency: string;
}

export class ReportService {
  private logoBase64: string = '';

  constructor() {
    try {
      const possiblePaths = [
        path.join(__dirname, '../../../apps/mobile/assets/logo.png'),
        path.join(process.cwd(), '../apps/mobile/assets/logo.png'),
        path.join(process.cwd(), 'apps/mobile/assets/logo.png'),
      ];
      for (const p of possiblePaths) {
        if (fs.existsSync(p)) {
          this.logoBase64 = fs.readFileSync(p).toString('base64');
          break;
        }
      }
    } catch {
      this.logoBase64 = '';
    }
  }

  private formatCurrency(amount: number, currency: string): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'NGN',
    }).format(amount);
  }

  private getBaseHtml(content: string, title: string): string {
    const logoImgHtml = this.logoBase64
      ? `<img src="data:image/png;base64,${this.logoBase64}" style="height: 72px; width: auto; margin-bottom: 8px; display: inline-block;" />`
      : '';

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>${title}</title>
        <style>
          body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            color: #333;
            margin: 0;
            padding: 40px;
            font-size: 14px;
            line-height: 1.6;
          }
          .header {
            text-align: center;
            margin-bottom: 40px;
            padding-bottom: 20px;
            border-bottom: 3px solid #d4af37;
          }
          .header h1 {
            color: #0d3b2e;
            margin: 5px 0 0 0;
            font-size: 32px;
            letter-spacing: 2.5px;
          }
          .header p {
            color: #777;
            margin: 5px 0 0 0;
            font-weight: 600;
          }
          .content {
            margin-bottom: 40px;
          }
          .meta-info {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
            background: #f9f9f9;
            padding: 15px;
            border-radius: 5px;
          }
          .meta-info div strong {
            color: #0d3b2e;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
          }
          th, td {
            padding: 12px 15px;
            text-align: left;
            border-bottom: 1px solid #ddd;
          }
          th {
            background-color: #0d3b2e;
            color: white;
            font-weight: bold;
          }
          tr:nth-child(even) {
            background-color: #f9f9f9;
          }
          .summary-table {
            width: 50%;
            margin-left: auto;
          }
          .summary-table td {
            padding: 8px 15px;
          }
          .summary-table tr:last-child {
            font-weight: bold;
            background-color: #e9f0ee;
            border-top: 2px solid #0d3b2e;
          }
          .disclaimer {
            font-size: 11px;
            color: #666;
            text-align: justify;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #eee;
          }
          .quran-quote {
            text-align: center;
            font-style: italic;
            color: #0d3b2e;
            margin: 30px 0;
            padding: 15px;
            background-color: #f4f7f6;
            border-left: 4px solid #d4af37;
          }
          .footer {
            text-align: center;
            font-size: 10px;
            color: #999;
            position: fixed;
            bottom: 20px;
            width: calc(100% - 80px);
          }
          .zakat-due {
            background-color: #0d3b2e;
            color: white;
            text-align: center;
            padding: 20px;
            border-radius: 8px;
            margin-top: 30px;
          }
          .zakat-due h2 {
            margin: 0 0 10px 0;
            color: #d4af37;
          }
          .zakat-due .amount {
            font-size: 32px;
            font-weight: bold;
          }
          .text-right {
            text-align: right;
          }
        </style>
      </head>
      <body>
        <div class="header">
          ${logoImgHtml}
          <h1>MIZAN</h1>
          <p>Islamic Financial Assistant</p>
        </div>
        
        <div class="content">
          ${content}
        </div>

        <div class="footer">
          &copy; ${new Date().getFullYear()} MIZAN. Generated automatically.
        </div>
      </body>
      </html>
    `;
  }

  async generateInheritanceReport(data: InheritanceReportData): Promise<Buffer> {
    const htmlContent = `
      <h2 style="color: #0d3b2e; text-align: center; margin-bottom: 30px;">Inheritance (Mirath) Distribution Report</h2>
      
      <div class="meta-info">
        <div>
          <strong>Reference No:</strong> <br>${data.referenceNo}
        </div>
        <div>
          <strong>Date:</strong> <br>${data.date}
        </div>
        <div>
          <strong>Calculation Method:</strong> <br>${data.method}
        </div>
      </div>

      <h3 style="color: #0d3b2e; border-bottom: 1px solid #d4af37; padding-bottom: 5px;">Estate Summary</h3>
      <table class="summary-table" style="width: 100%;">
        <tr>
          <td>Total Estate Value</td>
          <td class="text-right">${this.formatCurrency(data.totalEstate, data.currency)}</td>
        </tr>
        <tr>
          <td>Deductions (Debts)</td>
          <td class="text-right">-${this.formatCurrency(data.debts, data.currency)}</td>
        </tr>
        <tr>
          <td>Funeral Expenses</td>
          <td class="text-right">-${this.formatCurrency(data.funeralExpenses, data.currency)}</td>
        </tr>
        <tr>
          <td>Wasiyyah (Bequest)</td>
          <td class="text-right">-${this.formatCurrency(data.wasiyyah, data.currency)}</td>
        </tr>
        <tr>
          <td>Net Estate for Distribution</td>
          <td class="text-right">${this.formatCurrency(data.netEstate, data.currency)}</td>
        </tr>
      </table>

      <h3 style="color: #0d3b2e; border-bottom: 1px solid #d4af37; padding-bottom: 5px; margin-top: 30px;">Heir Distribution</h3>
      <table>
        <thead>
          <tr>
            <th>Heir</th>
            <th style="text-align: center;">Count</th>
            <th style="text-align: center;">Share Fraction</th>
            <th class="text-right">Amount (${data.currency})</th>
            <th class="text-right">% of Estate</th>
          </tr>
        </thead>
        <tbody>
          ${data.heirs.map(heir => `
            <tr>
              <td>${heir.name}</td>
              <td style="text-align: center;">${heir.count}</td>
              <td style="text-align: center;">${heir.share}</td>
              <td class="text-right">${this.formatCurrency(heir.amount, data.currency)}</td>
              <td class="text-right">${heir.percentage.toFixed(2)}%</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div class="quran-quote">
        "Allah instructs you concerning your children: for the male, what is equal to the share of two females..." 
        <br><br>
        <strong>(Surah An-Nisa 4:11-12)</strong>
      </div>

      <div class="disclaimer">
        <strong>Disclaimer:</strong> This report is generated by the MIZAN Islamic Financial Assistant based on the data provided. The calculations are based on standard Islamic jurisprudence (Fiqh) algorithms. However, Islamic inheritance laws can be highly complex with nuances that software may not fully capture. It is highly recommended to consult with a qualified Islamic scholar or Mufti before finalizing any estate distribution. MIZAN assumes no liability for decisions made solely based on this report.
      </div>
    `;

    const fullHtml = this.getBaseHtml(htmlContent, 'MIZAN - Inheritance Report');
    return this.generatePdfFromHtml(fullHtml);
  }

  async generateZakatReport(data: ZakatReportData): Promise<Buffer> {
    const htmlContent = `
      <h2 style="color: #0d3b2e; text-align: center; margin-bottom: 30px;">Zakat Calculation Report</h2>
      
      <div class="meta-info">
        <div>
          <strong>Report Date:</strong> <br>${data.date}
        </div>
        <div>
          <strong>Zakat Due Date:</strong> <br>${data.calculationDate}
        </div>
        <div>
          <strong>Currency:</strong> <br>${data.currency}
        </div>
      </div>

      <h3 style="color: #0d3b2e; border-bottom: 1px solid #d4af37; padding-bottom: 5px;">Zakatable Assets</h3>
      <table>
        <thead>
          <tr>
            <th>Asset Type</th>
            <th class="text-right">Value (${data.currency})</th>
          </tr>
        </thead>
        <tbody>
          ${data.assets.length > 0 ? data.assets.map(asset => `
            <tr>
              <td>${asset.type}</td>
              <td class="text-right">${this.formatCurrency(asset.value, data.currency)}</td>
            </tr>
          `).join('') : `<tr><td colspan="2" style="text-align: center;">No assets declared</td></tr>`}
        </tbody>
      </table>

      <h3 style="color: #0d3b2e; border-bottom: 1px solid #d4af37; padding-bottom: 5px;">Deductions</h3>
      <table>
        <thead>
          <tr>
            <th>Deduction Type</th>
            <th class="text-right">Amount (${data.currency})</th>
          </tr>
        </thead>
        <tbody>
           ${data.deductions.length > 0 ? data.deductions.map(deduction => `
            <tr>
              <td>${deduction.type}</td>
              <td class="text-right">${this.formatCurrency(deduction.value, data.currency)}</td>
            </tr>
          `).join('') : `<tr><td colspan="2" style="text-align: center;">No deductions declared</td></tr>`}
        </tbody>
      </table>

      <h3 style="color: #0d3b2e; border-bottom: 1px solid #d4af37; padding-bottom: 5px;">Summary</h3>
      <table class="summary-table" style="width: 100%;">
        <tr>
          <td>Total Assets</td>
          <td class="text-right">${this.formatCurrency(data.assets.reduce((sum, a) => sum + a.value, 0), data.currency)}</td>
        </tr>
        <tr>
          <td>Total Deductions</td>
          <td class="text-right">-${this.formatCurrency(data.deductions.reduce((sum, a) => sum + a.value, 0), data.currency)}</td>
        </tr>
        <tr>
          <td>Net Wealth</td>
          <td class="text-right">${this.formatCurrency(data.netWealth, data.currency)}</td>
        </tr>
        <tr>
          <td>Nisab Threshold</td>
          <td class="text-right">${this.formatCurrency(data.nisab, data.currency)}</td>
        </tr>
      </table>

      <div class="zakat-due">
        <h2>Total Zakat Due</h2>
        <div class="amount">${this.formatCurrency(data.zakatDue, data.currency)}</div>
        <p style="margin: 10px 0 0 0; color: #eee; font-size: 12px;">(2.5% of Net Wealth if above Nisab)</p>
      </div>

      <div class="disclaimer">
        <strong>Disclaimer:</strong> This report is for informational purposes only. The accuracy of the Zakat calculation depends on the information you have provided. Zakat is a personal religious obligation. If you have complex financial instruments, business structures, or agricultural produce, please consult with a qualified Islamic scholar or local Zakat authority.
      </div>
    `;

    const fullHtml = this.getBaseHtml(htmlContent, 'MIZAN - Zakat Report');
    return this.generatePdfFromHtml(fullHtml);
  }

  private async generatePdfFromHtml(html: string): Promise<Buffer> {
    const puppeteer = (await import('puppeteer')).default;
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    try {
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: 'networkidle0' });
      
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '20px',
          right: '20px',
          bottom: '20px',
          left: '20px'
        }
      });
      
      return Buffer.from(pdfBuffer);
    } finally {
      await browser.close();
    }
  }
}
