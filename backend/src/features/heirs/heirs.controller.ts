/**
 * MIZAN — Heir Registry Controller (Phase 7)
 *
 * Express handlers for Canonical Heir Registry user and admin API endpoints.
 */

import { Request, Response } from 'express';
import { HeirRegistryService } from './services/heir-registry.service';
import { HeirNormalizationService } from './services/heir-normalization.service';
import { HeirLocalizationService } from './services/heir-localization.service';
import { HeirGroupRegistryService } from './services/heir-group-registry.service';
import { HeirAvailabilityService } from './services/heir-availability.service';
import { HeirDisplayService } from './services/heir-display.service';
import { HeirValidationService } from './services/heir-validation.service';
import { HeirMigrationService } from './services/heir-migration.service';
import { MadhhabCode } from '@mizan/shared';

// ─── User Endpoints ────────────────────────────────────────────────────────────

export async function listSupportedHeirs(req: Request, res: Response): Promise<void> {
  try {
    const madhhab = (req.query.madhhab as MadhhabCode) || 'HANAFI';
    const heirs = await HeirRegistryService.listHeirs(madhhab);
    res.status(200).json({ madhhab, count: heirs.length, heirs });
  } catch (err: any) {
    res.status(500).json({ error: 'INTERNAL_ERROR', message: err.message });
  }
}

export async function getHeirEntity(req: Request, res: Response): Promise<void> {
  try {
    const { heirId } = req.params;
    const entity = await HeirRegistryService.getHeirById(heirId);
    if (!entity) {
      res.status(404).json({ error: 'NOT_FOUND', message: `Heir ID ${heirId} not found` });
      return;
    }
    res.status(200).json(entity);
  } catch (err: any) {
    res.status(500).json({ error: 'INTERNAL_ERROR', message: err.message });
  }
}

export async function normalizeHeirInput(req: Request, res: Response): Promise<void> {
  try {
    const { input, languageTag, selectedMadhhab } = req.body;
    if (!input) {
      res.status(400).json({ error: 'INVALID_REQUEST', message: 'input string is required' });
      return;
    }

    const result = await HeirNormalizationService.normalizeHeirInput({
      input,
      languageTag: languageTag || 'en',
      selectedMadhhab,
    });

    res.status(200).json(result);
  } catch (err: any) {
    res.status(500).json({ error: 'INTERNAL_ERROR', message: err.message });
  }
}

export async function checkHeirAvailability(req: Request, res: Response): Promise<void> {
  try {
    const heirId = req.query.heirId as string;
    const madhhab = (req.query.madhhab as MadhhabCode) || 'HANAFI';

    if (!heirId) {
      res.status(400).json({ error: 'INVALID_REQUEST', message: 'heirId is required' });
      return;
    }

    const result = await HeirAvailabilityService.getHeirAvailability({
      heirId: heirId as any,
      madhhab,
    });

    res.status(200).json(result);
  } catch (err: any) {
    res.status(500).json({ error: 'INTERNAL_ERROR', message: err.message });
  }
}

export async function listHeirGroups(_req: Request, res: Response): Promise<void> {
  try {
    const groups = HeirGroupRegistryService.listGroups();
    res.status(200).json({ count: groups.length, groups });
  } catch (err: any) {
    res.status(500).json({ error: 'INTERNAL_ERROR', message: err.message });
  }
}

export async function getHeirGroup(req: Request, res: Response): Promise<void> {
  try {
    const { groupId } = req.params;
    const madhhab = (req.query.madhhab as MadhhabCode) || 'HANAFI';

    const group = HeirGroupRegistryService.getGroup(groupId);
    if (!group) {
      res.status(404).json({ error: 'NOT_FOUND', message: `Group ID ${groupId} not found` });
      return;
    }

    const resolvedMembers = HeirGroupRegistryService.getGroupMembers(groupId, madhhab);
    res.status(200).json({ group, madhhab, resolvedMembers });
  } catch (err: any) {
    res.status(500).json({ error: 'INTERNAL_ERROR', message: err.message });
  }
}

export async function getDisplaySections(req: Request, res: Response): Promise<void> {
  try {
    const madhhab = (req.query.madhhab as MadhhabCode) || 'HANAFI';
    const languageTag = (req.query.lang as any) || 'en';

    const sections = await HeirDisplayService.getDisplaySections(madhhab, languageTag);
    res.status(200).json({ madhhab, languageTag, sections });
  } catch (err: any) {
    res.status(500).json({ error: 'INTERNAL_ERROR', message: err.message });
  }
}

// ─── Admin Endpoints ───────────────────────────────────────────────────────────

export async function validateHeirEntity(req: Request, res: Response): Promise<void> {
  try {
    const report = HeirValidationService.validateEntity(req.body);
    res.status(report.passed ? 200 : 422).json(report);
  } catch (err: any) {
    res.status(500).json({ error: 'INTERNAL_ERROR', message: err.message });
  }
}

export async function migrateLegacyLabels(req: Request, res: Response): Promise<void> {
  try {
    const { labels } = req.body;
    if (!Array.isArray(labels)) {
      res.status(400).json({ error: 'INVALID_REQUEST', message: 'labels must be an array' });
      return;
    }

    const report = HeirMigrationService.migrateBatch(labels);
    res.status(200).json(report);
  } catch (err: any) {
    res.status(500).json({ error: 'INTERNAL_ERROR', message: err.message });
  }
}
