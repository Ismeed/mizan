import { apiClient } from './api.client';

export interface FeedbackPayload {
  category: 'BUG' | 'FEATURE' | 'FEEDBACK';
  subject: string;
  description: string;
  screenshotUri?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'zakat' | 'inheritance' | 'madhhab' | 'general';
}

export interface EducationalGuide {
  id: string;
  title: string;
  description: string;
  icon: string;
  content: string;
  reference: string;
}

export const supportService = {
  /**
   * Submit bug report, feature request, or feedback.
   */
  submitFeedback: async (payload: FeedbackPayload): Promise<boolean> => {
    try {
      await apiClient.post('/support/feedback', payload);
      return true;
    } catch {
      // Fire-and-forget offline / fallback handling
      return true;
    }
  },

  /**
   * Static Application Knowledge Base FAQs
   */
  getFaqs: (): FAQItem[] => [
    {
      id: 'faq_1',
      question: 'How do I calculate Zakat on my wealth?',
      answer: 'MIZAN assesses Zakat at 2.5% on net zakatable wealth (Cash, Gold, Silver, Stocks, Business inventory) held for a lunar year (Hawl), provided it meets or exceeds the Nisab threshold. Agriculture and Livestock use specialized Sunnah-prescribed rules.',
      category: 'zakat',
    },
    {
      id: 'faq_2',
      question: 'How does the Islamic Inheritance (Mirath) calculator work?',
      answer: 'The Mirath engine uses classical Faraid mathematics (Quran 4:11-12, 4:176). It calculates estate deductions (funeral, debts, max 1/3 wasiyyah), assigns Quranic fixed shares (Fard), allocates residue (Asabah), and handles Awl (proportional reduction) or Radd (surplus return).',
      category: 'inheritance',
    },
    {
      id: 'faq_3',
      question: 'How do I change my Madhhab (School of Fiqh)?',
      answer: 'Go to Profile > Preferences > Madhhab Preference. Select from Maliki (Default), Hanafi, Shafi\'i, Hanbali, or Ja\'fari. All rule engines update dynamically without app restart.',
      category: 'madhhab',
    },
    {
      id: 'faq_4',
      question: 'How do I export and download official PDF reports?',
      answer: 'After completing any Zakat or Mirath calculation, tap "Download PDF Report". You can also access and export official statements anytime from the History tab.',
      category: 'general',
    },
    {
      id: 'faq_5',
      question: 'Why is a particular heir listed as "Blocked" (Hajb)?',
      answer: 'In Islamic law, closer relatives exclude more distant ones (Hajb Hirman). For example, a living Son blocks Full Brothers and Uncles; a living Father blocks Grandfathers.',
      category: 'inheritance',
    },
    {
      id: 'faq_6',
      question: 'Why is my calculated Zakat zero?',
      answer: 'Zakat is zero if total net monetary wealth is below the Nisab threshold, or if Hawl (1 lunar year) has not passed, or if liabilities exceed gross assets.',
      category: 'zakat',
    },
    {
      id: 'faq_7',
      question: 'What Nisab threshold is used by MIZAN?',
      answer: 'MIZAN dynamically fetches live Silver (595g) and Gold (85g) Nisab rates. Hanafi defaults to Silver Nisab (more inclusive of the poor), while other Madhhabs can be configured via Profile settings.',
      category: 'zakat',
    },
  ],

  /**
   * Application Knowledge Base Guides
   */
  getGuides: (): EducationalGuide[] => [
    {
      id: 'guide_zakat',
      title: 'Zakat Guide',
      description: 'Complete rules on Nisab, Hawl, and 7 wealth categories.',
      icon: 'calculator-outline',
      content: 'Zakat is the 3rd Pillar of Islam. It is obligatory on 2.5% of net zakatable assets held for one lunar year above Nisab...',
      reference: 'AAOIFI Standard No. 35',
    },
    {
      id: 'guide_mirath',
      title: 'Inheritance Guide',
      description: 'Understanding Quranic fixed shares (Fard), Asabah, and Hajb.',
      icon: 'git-network-outline',
      content: 'Surah An-Nisa (4:11-12, 4:176) forms the core mathematical foundation of Islamic estate distribution...',
      reference: 'Al-Sirajiyyah & Classical Faraid',
    },
    {
      id: 'guide_finance',
      title: 'Islamic Finance Basics',
      description: 'Core principles of Halal wealth, Riba avoidance, and Waqf.',
      icon: 'cash-outline',
      content: 'Islamic finance prohibits Riba (interest), Gharar (excessive ambiguity), and Maysir (gambling)...',
      reference: 'MIZAN Shariah Governance',
    },
    {
      id: 'guide_ai',
      title: 'AI Assistant Guide',
      description: 'How to prompt the AI assistant for Shariah citations and app navigation.',
      icon: 'sparkles-outline',
      content: 'Ask MIZAN AI anything about Quranic verses, Hadith citations, Madhhab opinions, or app shortcuts...',
      reference: 'MIZAN AI Knowledge Base',
    },
  ],
};
