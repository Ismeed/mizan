import { Request, Response } from 'express';
import { ReportService, InheritanceReportData, ZakatReportData } from './report.service';
import { InheritanceService } from '../inheritance/inheritance.service';
import { ZakatService } from '../zakat/zakat.service';
import { sendError } from '../../shared/utils/response.utils';
import { Readable } from 'stream';

const reportService = new ReportService();
const inheritanceService = new InheritanceService();
const zakatService = new ZakatService();

export class ReportController {
  async getInheritanceReport(req: Request, res: Response) {
    try {
      const calculationId = req.params.calculationId;
      const user = (req as any).user;
      
      const calc = await inheritanceService.getById(calculationId, user.id);
      
      if (!calc.inheritance) {
        return sendError(res, 'Inheritance details not found', 400);
      }

      const inheritance = calc.inheritance;
      const data: InheritanceReportData = {
        referenceNo: calc.id.split('-')[0].toUpperCase(),
        date: calc.created_at.toISOString().split('T')[0],
        totalEstate: Number(inheritance.total_estate),
        debts: Number(inheritance.debts),
        funeralExpenses: Number(inheritance.funeral_expenses),
        wasiyyah: Number(inheritance.wasiyyah),
        netEstate: Number(inheritance.net_estate),
        currency: inheritance.currency || 'USD',
        method: inheritance.madhhab,
        heirs: inheritance.heirs.map(h => ({
          name: h.heir_type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase()),
          count: h.count,
          share: `${h.share_fraction_num}/${h.share_fraction_den}`,
          amount: Number(h.share_amount),
          percentage: (Number(h.share_amount) / Number(inheritance.net_estate)) * 100 || 0
        }))
      };

      const pdfBuffer = await reportService.generateInheritanceReport(data);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="mizan-inheritance-report-${data.referenceNo}.pdf"`);
      res.setHeader('Content-Length', pdfBuffer.length);
      
      const stream = new Readable();
      stream.push(pdfBuffer);
      stream.push(null);
      stream.pipe(res);
      
    } catch (error: any) {
      console.error('[Report Error]', error);
      const status = error.statusCode || 500;
      return sendError(res, error.message || 'Failed to generate inheritance report', status);
    }
  }

  async getZakatReport(req: Request, res: Response) {
    try {
      const calculationId = req.params.calculationId;
      const user = (req as any).user;
      
      const calc = await zakatService.getById(calculationId, user.id);
      
      if (!calc.zakat) {
        return sendError(res, 'Zakat details not found', 400);
      }

      const zakat = calc.zakat;
      const data: ZakatReportData = {
        date: new Date().toISOString().split('T')[0],
        calculationDate: calc.created_at.toISOString().split('T')[0],
        assets: zakat.assets.map(a => ({
          type: a.description || a.asset_type.replace(/_/g, ' '),
          value: Number(a.value)
        })),
        deductions: [
          { type: 'Debts', value: Number(zakat.total_debts) },
          ...(Number(zakat.exempt_amount) > 0 ? [{ type: 'Exemptions', value: Number(zakat.exempt_amount) }] : [])
        ],
        netWealth: Number(zakat.net_wealth),
        nisab: Number(zakat.nisab_threshold),
        zakatDue: Number(zakat.zakat_due),
        currency: zakat.currency || 'USD'
      };

      const pdfBuffer = await reportService.generateZakatReport(data);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="mizan-zakat-report-${calc.id.split('-')[0].toUpperCase()}.pdf"`);
      res.setHeader('Content-Length', pdfBuffer.length);
      
      const stream = new Readable();
      stream.push(pdfBuffer);
      stream.push(null);
      stream.pipe(res);
      
    } catch (error: any) {
      console.error('[Report Error]', error);
      const status = error.statusCode || 500;
      return sendError(res, error.message || 'Failed to generate zakat report', status);
    }
  }
}
