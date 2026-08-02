import { Request, Response } from 'express';
import { EvidenceRegistryService } from './services/evidence-registry.service';
import { AIEvidenceContextService } from './services/ai-evidence-context.service';
import { EvidenceImportService } from './services/evidence-import.service';
import { EvidenceExportService } from './services/evidence-export.service';
import { RuleEvidenceLinkService } from './services/rule-evidence-link.service';
import { EvidenceCitationService } from './services/evidence-citation.service';

export class EvidenceController {
  // GET /api/evidence/:evidenceId
  static async getEvidenceById(req: Request, res: Response) {
    try {
      const { evidenceId } = req.params;
      const { version, madhhab, languageTag } = req.query;

      const evidence = await EvidenceRegistryService.getEvidenceById({
        evidenceId,
        version: version as string,
        madhhab: madhhab as string,
        languageTag: languageTag as string,
      });

      if (!evidence) {
        return res.status(404).json({ success: false, error: 'Evidence record not found or not published' });
      }

      const citation = EvidenceCitationService.formatCitation(
        evidence,
        (languageTag as string) || 'en',
        (madhhab as string) || 'HANAFI'
      );

      return res.json({
        success: true,
        data: {
          evidence,
          citation,
        },
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  // GET /api/calculations/:calculationId/evidence
  static async getEvidenceForCalculation(req: Request, res: Response) {
    try {
      const { calculationId } = req.params;
      // Mock / query evidence linked to rules in calculation
      return res.json({
        success: true,
        data: {
          calculationId,
          evidenceLinks: [],
        },
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  // POST /api/ai/evidence-context
  static async getAIEvidenceContext(req: Request, res: Response) {
    try {
      const { evidenceId, version, ruleId, ruleVersion, madhhab, languageTag, decisionType, structuredDecision } = req.body;

      const evidence = await EvidenceRegistryService.getEvidenceById({
        evidenceId,
        version,
        madhhab,
        languageTag,
        allowDraft: true,
      });

      if (!evidence) {
        return res.status(404).json({ success: false, error: 'Evidence record not found' });
      }

      const aiContext = AIEvidenceContextService.prepareContext({
        module: 'MIRATH',
        selectedMadhhab: madhhab || 'HANAFI',
        ruleId: ruleId || 'RULE-UNKNOWN',
        ruleVersion: ruleVersion || '1.0.0',
        decisionType: decisionType || 'SHARE_ALLOCATION',
        structuredDecision: structuredDecision || {},
        evidence,
        languageTag,
      });

      return res.json({
        success: true,
        data: aiContext,
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  // POST /api/admin/evidence/import
  static async importEvidence(req: Request, res: Response) {
    try {
      const { records, isTestFixture } = req.body;
      const user = (req as any).user;

      if (!Array.isArray(records)) {
        return res.status(400).json({ success: false, error: 'Records must be an array' });
      }

      const result = await EvidenceImportService.importEvidenceArray(records, {
        importedBy: user?.id || 'ADMIN_USER',
        sourceLabel: 'ADMIN_IMPORT',
        isTestFixture,
      });

      return res.json({
        success: true,
        data: result,
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  // GET /api/admin/evidence/export
  static async exportEvidence(req: Request, res: Response) {
    try {
      const { status } = req.query;
      const json = await EvidenceExportService.exportJson((status as string) || 'PRODUCTION');

      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', 'attachment; filename="mizan-evidence-export.json"');
      return res.send(json);
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  // POST /api/admin/evidence/link-rule
  static async linkRule(req: Request, res: Response) {
    try {
      const linkData = req.body;
      const created = await RuleEvidenceLinkService.createLink(linkData);

      return res.json({
        success: true,
        data: created,
      });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }
}
