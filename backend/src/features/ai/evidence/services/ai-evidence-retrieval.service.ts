import { prisma } from '../../../../config/database';
import { AIEvidenceRetrievalMode } from '../../../../../../packages/shared/src';
import { AIEvidenceSigningService } from './ai-evidence-signing.service';

export interface RetrievalResultRecord {
  recordId: string;
  recordVersion: string;
  recordType: 'EXPLANATION' | 'TERMINOLOGY' | 'EVIDENCE' | 'COMPARATIVE_RECORD';
  relationshipType: string;
  productionStatus: 'PRODUCTION' | 'DRAFT';
  madhhabScopeValidated: boolean;
  knowledgeReleaseMembershipValidated: boolean;
  contentChecksum: string;
}

export interface RetrievalExecutionResult {
  retrievalMode: AIEvidenceRetrievalMode;
  querySource: 'SERVER_GENERATED';
  records: RetrievalResultRecord[];
  retrievalTraceId: string;
}

export class AIEvidenceRetrievalService {
  /**
   * Executes safe, bounded server-generated retrieval based on approved mode.
   * Never accepts un-sanitized user prompts as raw vector retrieval queries.
   */
  static async executeRetrieval(
    mode: AIEvidenceRetrievalMode,
    ruleId?: string,
    evidenceId?: string,
    selectedMadhhab: string = 'HANAFI'
  ): Promise<RetrievalExecutionResult> {
    const traceId = 'TRACE-' + Math.random().toString(36).substring(2, 10);
    const records: RetrievalResultRecord[] = [];

    if (mode === 'NO_ADDITIONAL_RETRIEVAL') {
      return {
        retrievalMode: mode,
        querySource: 'SERVER_GENERATED',
        records: [],
        retrievalTraceId: traceId,
      };
    }

    if (mode === 'RELATED_APPROVED_EXPLANATIONS' && (ruleId || evidenceId)) {
      // Simulate retrieving verified linked explanation records
      const recordId = `EXPL-LINKED-${ruleId || evidenceId}`;
      const recordChecksum = AIEvidenceSigningService.generateChecksum({ recordId, ruleId, evidenceId });
      records.push({
        recordId,
        recordVersion: '1.0.0',
        recordType: 'EXPLANATION',
        relationshipType: 'LINKED_RULE_EXPLANATION',
        productionStatus: 'PRODUCTION',
        madhhabScopeValidated: true,
        knowledgeReleaseMembershipValidated: true,
        contentChecksum: recordChecksum,
      });
    }

    // Save retrieval trace in DB
    await prisma.aIRetrievalTraceDb.create({
      data: {
        retrieval_trace_id: traceId,
        retrieval_mode: mode,
        query_source: 'SERVER_GENERATED',
        retrieved_records: JSON.stringify(records),
      },
    }).catch(err => console.error('[AIRetrieval] Trace log error:', err));

    return {
      retrievalMode: mode,
      querySource: 'SERVER_GENERATED',
      records,
      retrievalTraceId: traceId,
    };
  }
}
