import { Router } from 'express';
import { ProfileController } from './profile.controller';
import { authMiddleware } from '../../shared/middleware/auth.middleware';

const router = Router();

// User Preferences Routes (Auth required)
router.get('/users/me/preferences', authMiddleware, ProfileController.getUserPreferences);
router.patch('/users/me/preferences', authMiddleware, ProfileController.updateUserPreferences);

// Central Registries Routes (Public / Auth)
router.get('/preferences/madhhabs', ProfileController.getMadhhabs);
router.get('/preferences/currencies', ProfileController.getCurrencies);
router.get('/preferences/languages', ProfileController.getLanguages);

// Calculation Profile Resolution & Snapshot Routes
router.post('/calculations/profile/resolve', authMiddleware, ProfileController.resolveProfilePreview);
router.get('/calculations/:calculationId/profile', authMiddleware, ProfileController.getCalculationProfile);

export { router as profileRouter };
