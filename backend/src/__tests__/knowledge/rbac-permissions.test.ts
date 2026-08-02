import { TransitionGuardService } from '../../features/knowledge/services/transition-guard.service';

describe('Governance Role-Based Access Control (RBAC) & Separation of Duties', () => {
  test('Research Assistant cannot execute technical validation or approval', () => {
    expect(TransitionGuardService.hasAuthority('TECHNICAL_VALIDATION', 'APPROVED', 'RESEARCH_ASSISTANT')).toBe(false);
  });

  test('Sharia Reviewer is authorized for Sharia Review decisions', () => {
    expect(TransitionGuardService.hasAuthority('SHARIA_REVIEW', 'TECHNICAL_VALIDATION', 'SHARIA_REVIEWER')).toBe(true);
  });

  test('Publication Admin can publish indexed records to Production', () => {
    expect(TransitionGuardService.hasAuthority('INDEXED', 'PRODUCTION', 'PUBLICATION_ADMIN')).toBe(true);
  });

  test('Auditor has read-only access and cannot alter record statuses', () => {
    expect(TransitionGuardService.hasAuthority('DRAFT', 'ACADEMIC_REVIEW', 'AUDITOR')).toBe(false);
  });
});
