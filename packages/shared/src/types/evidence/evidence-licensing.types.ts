/**
 * MIZAN Evidence Licensing & Attribution Standard (Phase 4)
 */

export type LicenceStatus =
  | 'PUBLIC_DOMAIN'
  | 'LICENSED'
  | 'PERMISSION_GRANTED'
  | 'ATTRIBUTION_REQUIRED'
  | 'INTERNAL_USE_ONLY'
  | 'RESTRICTED'
  | 'UNKNOWN';

export interface EvidenceLicensing {
  licenceStatus: LicenceStatus;
  licenceName?: string;
  licenceUrl?: string;
  rightsHolder?: string;
  permissionReference?: string;
  attributionRequired: boolean;
  attributionText?: string;
  commercialUseAllowed: boolean;
  modificationAllowed: boolean;
  redistributionAllowed: boolean;
  expiryDate?: string | null;
}
