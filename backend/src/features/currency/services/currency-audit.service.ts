/**
 * Currency Audit Service
 * Phase 12 — MIZAN Currency Architecture
 */

import crypto from 'crypto';

export interface CurrencyAuditEvent {
  eventId: string;
  eventType:
    | 'VALIDATE_CURRENCY'
    | 'CONVERT_CURRENCY'
    | 'ALLOCATE_MIRATH_MONEY'
    | 'CALCULATE_ZAKAT_MONEY'
    | 'LOAD_EXCHANGE_RATE'
    | 'MANUAL_RATE_ENTRY'
    | 'ROUNDING_APPLIED';
  currencyCode?: string;
  calculationId?: string;
  actorId: string;
  details: Record<string, any>;
  timestamp: string;
}

export class CurrencyAuditService {
  private static eventsLog: CurrencyAuditEvent[] = [];

  public static logEvent(
    eventType: CurrencyAuditEvent['eventType'],
    actorId: string,
    details: Record<string, any>,
    options?: { currencyCode?: string; calculationId?: string }
  ): CurrencyAuditEvent {
    const event: CurrencyAuditEvent = {
      eventId: `CURR-AUD-${crypto.randomUUID()}`,
      eventType,
      actorId,
      currencyCode: options?.currencyCode,
      calculationId: options?.calculationId,
      details,
      timestamp: new Date().toISOString(),
    };

    this.eventsLog.push(event);
    return event;
  }

  public static getEventsForCalculation(calculationId: string): CurrencyAuditEvent[] {
    return this.eventsLog.filter((e) => e.calculationId === calculationId);
  }
}
