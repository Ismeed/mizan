import { TransitionGuardService } from '../../features/knowledge/services/transition-guard.service';

describe('Knowledge Governance Lifecycle - State Machine & Transition Guards', () => {
  test('Allows valid sequential status transition DRAFT → ACADEMIC_REVIEW', () => {
    const val = TransitionGuardService.validateTransition('DRAFT', 'ACADEMIC_REVIEW', 'RESEARCH_ASSISTANT');
    expect(val.allowed).toBe(true);
  });

  test('Blocks illegal status jumps (DRAFT → PRODUCTION)', () => {
    const val = TransitionGuardService.validateTransition('DRAFT', 'PRODUCTION', 'KNOWLEDGE_ADMIN');
    expect(val.allowed).toBe(false);
    expect(val.reason).toContain('Illegal lifecycle transition');
  });

  test('Blocks unauthorized roles from triggering transitions (DATA_EDITOR approving Sharia Review)', () => {
    const val = TransitionGuardService.validateTransition('SHARIA_REVIEW', 'TECHNICAL_VALIDATION', 'DATA_EDITOR');
    expect(val.allowed).toBe(false);
    expect(val.reason).toContain('Role \'DATA_EDITOR\' is not authorized');
  });

  test('Requires comment/reason when requesting changes', () => {
    const valWithoutComment = TransitionGuardService.validateTransition('ACADEMIC_REVIEW', 'CHANGES_REQUESTED', 'ACADEMIC_REVIEWER', '');
    expect(valWithoutComment.allowed).toBe(false);
    expect(valWithoutComment.reason).toContain('formal comment/reason is required');

    const valWithComment = TransitionGuardService.validateTransition('ACADEMIC_REVIEW', 'CHANGES_REQUESTED', 'ACADEMIC_REVIEWER', 'Citation on page 14 needs verification.');
    expect(valWithComment.allowed).toBe(true);
  });
});
