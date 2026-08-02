import { KnowledgeStatus, GovernanceRole, TransitionRule } from '../types/knowledge.types';

export class TransitionGuardService {
  private static readonly ALLOWED_TRANSITIONS: TransitionRule[] = [
    // Draft submit to Academic Review
    { from: 'DRAFT', to: 'ACADEMIC_REVIEW', requiredRole: ['RESEARCH_ASSISTANT', 'DATA_EDITOR', 'KNOWLEDGE_ADMIN'] },

    // Academic Review outcomes
    { from: 'ACADEMIC_REVIEW', to: 'SHARIA_REVIEW', requiredRole: ['ACADEMIC_REVIEWER', 'KNOWLEDGE_ADMIN'] },
    { from: 'ACADEMIC_REVIEW', to: 'CHANGES_REQUESTED', requiredRole: ['ACADEMIC_REVIEWER', 'KNOWLEDGE_ADMIN'], requireComment: true },
    { from: 'ACADEMIC_REVIEW', to: 'REJECTED', requiredRole: ['ACADEMIC_REVIEWER', 'KNOWLEDGE_ADMIN'], requireComment: true },

    // Sharia Review outcomes
    { from: 'SHARIA_REVIEW', to: 'TECHNICAL_VALIDATION', requiredRole: ['SHARIA_REVIEWER', 'KNOWLEDGE_ADMIN'] },
    { from: 'SHARIA_REVIEW', to: 'CHANGES_REQUESTED', requiredRole: ['SHARIA_REVIEWER', 'KNOWLEDGE_ADMIN'], requireComment: true },
    { from: 'SHARIA_REVIEW', to: 'REJECTED', requiredRole: ['SHARIA_REVIEWER', 'KNOWLEDGE_ADMIN'], requireComment: true },

    // Technical Validation outcomes
    { from: 'TECHNICAL_VALIDATION', to: 'APPROVED', requiredRole: ['TECHNICAL_REVIEWER', 'KNOWLEDGE_ADMIN'] },
    { from: 'TECHNICAL_VALIDATION', to: 'CHANGES_REQUESTED', requiredRole: ['TECHNICAL_REVIEWER', 'KNOWLEDGE_ADMIN'], requireComment: true },
    { from: 'TECHNICAL_VALIDATION', to: 'REJECTED', requiredRole: ['TECHNICAL_REVIEWER', 'KNOWLEDGE_ADMIN'], requireComment: true },

    // Resubmission after changes requested
    { from: 'CHANGES_REQUESTED', to: 'DRAFT', requiredRole: ['RESEARCH_ASSISTANT', 'DATA_EDITOR', 'KNOWLEDGE_ADMIN'] },

    // Approved to Indexing
    { from: 'APPROVED', to: 'INDEXED', requiredRole: ['INDEXING_SERVICE', 'KNOWLEDGE_ADMIN'] },
    { from: 'APPROVED', to: 'DEPRECATED', requiredRole: ['KNOWLEDGE_ADMIN', 'PUBLICATION_ADMIN'] },

    // Indexing to Production
    { from: 'INDEXED', to: 'PRODUCTION', requiredRole: ['PUBLICATION_ADMIN', 'KNOWLEDGE_ADMIN'] },
    { from: 'INDEXED', to: 'DEPRECATED', requiredRole: ['KNOWLEDGE_ADMIN', 'PUBLICATION_ADMIN'] },

    // Deprecation and Archival
    { from: 'PRODUCTION', to: 'DEPRECATED', requiredRole: ['PUBLICATION_ADMIN', 'KNOWLEDGE_ADMIN'] },
    { from: 'DEPRECATED', to: 'ARCHIVED', requiredRole: ['KNOWLEDGE_ADMIN'] },
  ];

  /**
   * Validates if a state transition is permissible under the governance lifecycle rules.
   */
  static isTransitionAllowed(from: KnowledgeStatus, to: KnowledgeStatus): boolean {
    return this.ALLOWED_TRANSITIONS.some(rule => rule.from === from && rule.to === to);
  }

  /**
   * Checks if an actor with a given role has the authority to execute the transition.
   */
  static hasAuthority(from: KnowledgeStatus, to: KnowledgeStatus, actorRole: GovernanceRole): boolean {
    const rule = this.ALLOWED_TRANSITIONS.find(r => r.from === from && r.to === to);
    if (!rule) return false;
    return rule.requiredRole.includes(actorRole);
  }

  /**
   * Evaluates transition validity and role authority, returning human-readable error if denied.
   */
  static validateTransition(
    from: KnowledgeStatus,
    to: KnowledgeStatus,
    actorRole: GovernanceRole,
    comment?: string
  ): { allowed: boolean; reason?: string } {
    if (from === to) {
      return { allowed: false, reason: `Record is already in status '${from}'.` };
    }

    const rule = this.ALLOWED_TRANSITIONS.find(r => r.from === from && r.to === to);
    if (!rule) {
      return {
        allowed: false,
        reason: `Illegal lifecycle transition: '${from}' → '${to}'. Skips and unapproved jumps are forbidden.`,
      };
    }

    if (!rule.requiredRole.includes(actorRole)) {
      return {
        allowed: false,
        reason: `Role '${actorRole}' is not authorized to transition records from '${from}' to '${to}'. Required role(s): ${rule.requiredRole.join(', ')}.`,
      };
    }

    if (rule.requireComment && (!comment || comment.trim().length === 0)) {
      return {
        allowed: false,
        reason: `A formal comment/reason is required for transition '${from}' → '${to}'.`,
      };
    }

    return { allowed: true };
  }
}
