import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import { authRouter }        from './features/auth/auth.routes';
import { inheritanceRouter } from './features/inheritance/inheritance.routes';
import { zakatRouter }       from './features/zakat/zakat.routes';
import { aiRouter }          from './features/ai/ai.routes';
import { reportRouter }       from './features/reports/report.routes';
import { notificationRouter } from './features/notifications/notification.routes';
import { supportRouter }      from './features/support/support.routes';
import { adminRouter }        from './features/admin/admin.routes';
import { knowledgeAdminRouter } from './features/knowledge/knowledge-admin.routes';
import { profileRouter }        from './features/profile/profile.routes';
import { rulesAdminRouter }     from './features/rules/rules.routes';
import { evidenceNavigationRouter, adminEvidenceNavigationRouter } from './features/evidence-navigation/evidence-navigation.routes';
import { aiEvidenceRouter, adminAiEvidenceRouter } from './features/ai/evidence/ai-evidence.routes';

// ── API Routes ────────────────────────────────────────────────────────────────
app.use('/api/auth',          authRouter);
app.use('/api/inheritance',   inheritanceRouter);
app.use('/api/zakat',         zakatRouter);
app.use('/api/ai/evidence',   aiEvidenceRouter);
app.use('/api/ai',            aiRouter);
app.use('/api/reports',       reportRouter);
app.use('/api/profile',       profileRouter);
app.use('/api/notifications', notificationRouter);
app.use('/api/support',       supportRouter);
app.use('/api/evidence',      evidenceRouter);
app.use('/api/evidence-navigation', evidenceNavigationRouter);
app.use('/api/admin/evidence-navigation', adminEvidenceNavigationRouter);
app.use('/api/admin/ai',      adminAiEvidenceRouter);
app.use('/api/admin/evidence', adminEvidenceRouter);
app.use('/api/admin/knowledge', knowledgeAdminRouter);
app.use('/api/admin/rules',     rulesAdminRouter);
app.use('/api/admin',         adminRouter);
app.use('/api/hijab',         hijabRouter);
app.use('/api/mirath/heirs',  heirsRouter);
app.use('/api/zakat/categories', zakatCategoriesRouter);
app.use('/api/zakat/livestock', livestockRouter);
app.use('/api/zakat/agriculture', agricultureRouter);
app.use('/api/explanations',  explanationsRouter);
app.use('/api',               currencyRouter);
app.use('/api',               resultsRouter);




// ── 404 Handler ───────────────────────────────────────────────────────────────
app.use((_req, res) => {
  sendError(res, 'Route not found', 404);
});

// ── Global Error Handler ──────────────────────────────────────────────────────
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[Error]', err.message ?? err);

  if (err.code === 'P2025') {
    return sendError(res, 'Resource not found', 404);
  }

  // Determine appropriate HTTP status code
  let statusCode = err.statusCode || 400;
  const msg = err.message || '';

  if (msg.includes('Account not found') || msg.includes('not found')) {
    statusCode = err.statusCode || 404;
  } else if (msg.includes('Invalid email or password') || msg.includes('Unauthorized')) {
    statusCode = err.statusCode || 401;
  } else if (msg.includes('Forbidden') || msg.includes('do not own') || msg.includes('suspended')) {
    statusCode = err.statusCode || 403;
  }

  sendError(res, msg || 'Internal Server Error', statusCode);
});

export default app;
