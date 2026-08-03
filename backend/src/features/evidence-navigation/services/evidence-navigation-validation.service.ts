import {
  EvidenceNavigationPayload,
  isValidEvidenceNavigationAction,
  isValidEvidenceNavigationOriginType,
  EvidenceNavigationErrorResponse,
  NavigationErrorCode,
} from '../../../../../packages/shared/src';
import { EvidenceNavigationSigningService } from './evidence-navigation-signing.service';

export interface ValidationResult {
  isValid: boolean;
  errorCode?: NavigationErrorCode;
  fieldPath?: string;
  message?: string;
  sanitizedPayload?: EvidenceNavigationPayload;
}

export class EvidenceNavigationValidationService {
  /**
   * Performs full structural, security, checksum, and semantic validation on a payload.
   */
  static validatePayload(payload: any): ValidationResult {
    if (!payload || typeof payload !== 'object') {
      return {
        isValid: false,
        errorCode: 'INVALID_NAVIGATION_PAYLOAD',
        message: 'Payload must be a valid JSON object',
      };
    }

    // 1. Required core fields
    if (!payload.navigationId || typeof payload.navigationId !== 'string') {
      return {
        isValid: false,
        errorCode: 'INVALID_NAVIGATION_PAYLOAD',
        fieldPath: 'navigationId',
        message: 'Missing or invalid navigationId',
      };
    }

    if (payload.payloadVersion !== '1.0.0') {
      return {
        isValid: false,
        errorCode: 'UNSUPPORTED_PAYLOAD_VERSION',
        fieldPath: 'payloadVersion',
        message: `Unsupported payload version: ${payload.payloadVersion}. Only '1.0.0' supported.`,
      };
    }

    if (!payload.action || !isValidEvidenceNavigationAction(payload.action)) {
      return {
        isValid: false,
        errorCode: 'UNKNOWN_NAVIGATION_ACTION',
        fieldPath: 'action',
        message: `Unknown or unauthorized navigation action: '${payload.action}'`,
      };
    }

    if (!payload.origin || !payload.origin.originType || !isValidEvidenceNavigationOriginType(payload.origin.originType)) {
      return {
        isValid: false,
        errorCode: 'UNKNOWN_ORIGIN_TYPE',
        fieldPath: 'origin.originType',
        message: `Unknown or unauthorized origin type: '${payload.origin?.originType}'`,
      };
    }

    if (!payload.evidence || !payload.evidence.evidenceId) {
      return {
        isValid: false,
        errorCode: 'MISSING_EVIDENCE_ID',
        fieldPath: 'evidence.evidenceId',
        message: 'Missing evidence.evidenceId in payload',
      };
    }

    if (!payload.profile || !payload.profile.selectedMadhhab || !payload.profile.languageTag) {
      return {
        isValid: false,
        errorCode: 'INVALID_NAVIGATION_PAYLOAD',
        fieldPath: 'profile',
        message: 'Profile context must include selectedMadhhab and languageTag',
      };
    }

    // 2. Action-specific contract validations
    const actionValidation = this.validateActionSpecificFields(payload);
    if (!actionValidation.isValid) {
      return actionValidation;
    }

    // 3. Open Redirect check on returnRoute
    if (payload.origin?.returnRoute) {
      const route = payload.origin.returnRoute;
      if (route.startsWith('http://') || route.startsWith('https://') || route.startsWith('//')) {
        return {
          isValid: false,
          errorCode: 'INVALID_NAVIGATION_PAYLOAD',
          fieldPath: 'origin.returnRoute',
          message: 'External URLs are strictly prohibited as return routes (Open Redirect defense)',
        };
      }
    }

    // 4. Checksum validation (if security block present)
    if (payload.security && payload.security.payloadChecksum) {
      const calculatedChecksum = EvidenceNavigationSigningService.generatePayloadChecksum(payload);
      if (payload.security.payloadChecksum !== calculatedChecksum) {
        return {
          isValid: false,
          errorCode: 'PAYLOAD_CHECKSUM_MISMATCH',
          fieldPath: 'security.payloadChecksum',
          message: 'Payload checksum mismatch. Content has been tampered with or modified.',
        };
      }
    }

    // 5. Signature validation if present
    if (payload.security?.signature) {
      const isValidSig = EvidenceNavigationSigningService.verifySignature(
        payload.security.payloadChecksum,
        payload.navigationId,
        payload.security.signature
      );
      if (!isValidSig) {
        return {
          isValid: false,
          errorCode: 'INVALID_NAVIGATION_SIGNATURE',
          fieldPath: 'security.signature',
          message: 'Digital signature verification failed for navigation payload',
        };
      }
    }

    return { isValid: true, sanitizedPayload: payload };
  }

  /**
   * Action-specific field requirements validation.
   */
  private static validateActionSpecificFields(payload: any): ValidationResult {
    const action = payload.action;

    if (
      action === 'OPEN_AI_RESULT_EVIDENCE' ||
      action === 'OPEN_AI_RULE_EVIDENCE' ||
      action === 'OPEN_AI_HIJAB_EVIDENCE' ||
      action === 'OPEN_AI_MIRATH_SHARE_EVIDENCE' ||
      action === 'OPEN_AI_ZAKAT_EVIDENCE' ||
      action === 'OPEN_AI_NISAB_EVIDENCE' ||
      action === 'OPEN_AI_LIVESTOCK_EVIDENCE' ||
      action === 'OPEN_AI_AGRICULTURE_EVIDENCE'
    ) {
      if (!payload.calculation || !payload.calculation.calculationId || !payload.calculation.resultId || !payload.calculation.resultItemId) {
        return {
          isValid: false,
          errorCode: 'RESULT_ITEM_NOT_FOUND',
          fieldPath: 'calculation',
          message: `Action '${action}' requires valid calculationId, resultId, and resultItemId`,
        };
      }

      if (!payload.evidence?.resultEvidenceLinkId) {
        return {
          isValid: false,
          errorCode: 'EVIDENCE_LINK_NOT_FOUND',
          fieldPath: 'evidence.resultEvidenceLinkId',
          message: `Action '${action}' requires resultEvidenceLinkId`,
        };
      }
    }

    if (action === 'OPEN_AI_REPORT_EVIDENCE') {
      if (!payload.report || !payload.report.reportId || !payload.report.reportSectionId) {
        return {
          isValid: false,
          errorCode: 'REPORT_SECTION_NOT_FOUND',
          fieldPath: 'report',
          message: "Action 'OPEN_AI_REPORT_EVIDENCE' requires reportId and reportSectionId",
        };
      }
    }

    if (action === 'OPEN_COMPARATIVE_MADHHAB_EVIDENCE') {
      if (!payload.comparison || !payload.comparison.comparisonRecordId) {
        return {
          isValid: false,
          errorCode: 'COMPARATIVE_CONTEXT_UNAVAILABLE',
          fieldPath: 'comparison.comparisonRecordId',
          message: "Action 'OPEN_COMPARATIVE_MADHHAB_EVIDENCE' requires comparisonRecordId",
        };
      }
    }

    return { isValid: true };
  }

  /**
   * Helper to format standardized error response.
   */
  static formatErrorResponse(
    status: 'INVALID' | 'UNAUTHORIZED' | 'NOT_FOUND' | 'INTEGRITY_FAILURE',
    code: NavigationErrorCode,
    message: string,
    fieldPath?: string,
    navId?: string
  ): EvidenceNavigationErrorResponse {
    return {
      status,
      error: {
        errorCode: code,
        category: status === 'UNAUTHORIZED' ? 'AUTHORIZATION' : status === 'INTEGRITY_FAILURE' ? 'INTEGRITY' : 'VALIDATION',
        fieldPath,
        navigationId: navId,
        retryable: false,
        reviewRequired: false,
        messageKey: `errors.${code}`,
        message,
      },
    };
  }
}
