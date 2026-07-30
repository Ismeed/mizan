export interface RAGDocument {
  id: string;
  source: 'QURAN' | 'HADITH' | 'HANAFI' | 'MALIKI' | 'SHAFII' | 'HANBALI' | 'JAFARI' | 'GENERAL_FIQH';
  reference: string;
  arabicText?: string;
  translationText: string;
  category: 'INHERITANCE' | 'ZAKAT' | 'RIBA' | 'WASAYAH' | 'WAQF' | 'GENERAL';
  relevanceScore: number;
}

export class IslamicRAGEngine {
  private static knowledgeBase: RAGDocument[] = [
    // ── QURANIC VERSES ────────────────────────────────────────────────────────
    {
      id: 'quran_4_11',
      source: 'QURAN',
      reference: 'Surah An-Nisa (4:11)',
      arabicText: 'يُوصِيكُمُ اللَّهُ فِي أَوْلَادِكُمْ ۖ لِلذَّكَرِ مِثْلُ حَظِّ الْأُنثَيَيْنِ',
      translationText: 'Allah instructs you concerning your children: for the male, what is equal to the share of two females. If there are only daughters, two or more, for them is two-thirds of one\'s estate. And if there is only one, for her is half. And for one\'s parents, to each one of them is a sixth of his estate if he left children. If he left no children and his parents inherit from him, then for his mother is one-third. If he has brothers or sisters, for his mother is a sixth, after any bequest he [may have] made or debt.',
      category: 'INHERITANCE',
      relevanceScore: 0.98,
    },
    {
      id: 'quran_4_12',
      source: 'QURAN',
      reference: 'Surah An-Nisa (4:12)',
      arabicText: 'وَلَكُمْ نِصْفُ مَا تَرَكَ أَزْوَاجُكُمْ إِن لَّمْ يَكُن لَّهُنَّ وَلَدٌ',
      translationText: 'And for you is half of what your wives leave if they have no child. But if they have a child, for you is one-fourth of what they leave, after any bequest they [may have] made or debt. And for the wives is one-fourth of what you leave if you have no child. But if you have a child, for them is one-eighth of what you leave...',
      category: 'INHERITANCE',
      relevanceScore: 0.98,
    },
    {
      id: 'quran_4_176',
      source: 'QURAN',
      reference: 'Surah An-Nisa (4:176)',
      arabicText: 'يَسْتَفْتُونَكَ قُلِ اللَّهُ يُفْتِيكُمْ فِي الْكَلَالَةِ',
      translationText: 'They request from you a ruling. Say, "Allah gives you a ruling concerning Kalalah (one who leaves neither ascendants nor descendants). If a man dies leaving no child but has a sister, for her is half of what he should leave. And he inherits from her if she has no child..."',
      category: 'INHERITANCE',
      relevanceScore: 0.95,
    },
    {
      id: 'quran_9_60',
      source: 'QURAN',
      reference: 'Surah At-Tawbah (9:60)',
      arabicText: 'إِنَّمَا الصَّدَقَاتُ لِلْفُقَرَاءِ وَالْمَسَاكِينِ وَالْعَامِلِينَ عَلَيْهَا',
      translationText: 'Zakat expenditures are only for the poor (Fuqara) and for the needy (Masakin) and for those employed to collect [zakat] and for bringing hearts together [for Islam] and for freeing captives and for those in debt and for the cause of Allah and for the [stranded] traveler - an obligation [imposed] by Allah.',
      category: 'ZAKAT',
      relevanceScore: 0.99,
    },
    {
      id: 'quran_9_103',
      source: 'QURAN',
      reference: 'Surah At-Tawbah (9:103)',
      arabicText: 'خُذْ مِنْ أَمْوَالِهِمْ صَدَقَةً تُطَهِّرُهُمْ وَتُزَكِّيهِم بِهَا',
      translationText: 'Take, [O Muhammad], from their wealth a charity by which you purify them and cause them increase, and invoke [Allah\'s blessings] upon them.',
      category: 'ZAKAT',
      relevanceScore: 0.96,
    },
    {
      id: 'quran_2_275',
      source: 'QURAN',
      reference: 'Surah Al-Baqarah (2:275)',
      arabicText: 'وَأَحَلَّ اللَّهُ الْبَيْعَ وَحَرَّمَ الرِّبَا',
      translationText: 'Allah has permitted trade and has forbidden interest (Riba).',
      category: 'RIBA',
      relevanceScore: 0.99,
    },

    // ── HADITH COLLECTIONS ──────────────────────────────────────────────────
    {
      id: 'bukhari_1454',
      source: 'HADITH',
      reference: 'Sahih al-Bukhari 1454',
      translationText: 'No Zakat is due on property until a full lunar year (Hawl) has elapsed, and Nisab for silver is 200 dirhams (595g) and for gold is 20 dinars (85g).',
      category: 'ZAKAT',
      relevanceScore: 0.95,
    },
    {
      id: 'muslim_979',
      source: 'HADITH',
      reference: 'Sahih Muslim 979',
      translationText: 'Prophet Muhammad (ﷺ) established the minimum Nisab thresholds for wealth and stated that 2.5% (1/40th) is obligatory upon qualifying wealth held for a Hawl.',
      category: 'ZAKAT',
      relevanceScore: 0.94,
    },
    {
      id: 'bukhari_2742',
      source: 'HADITH',
      reference: 'Sahih al-Bukhari 2742 (Sa\'d bin Abi Waqqas)',
      translationText: 'The Prophet (ﷺ) said regarding Wasiyyah (Will): "One-third (⅓), and one-third is much. It is better to leave your heirs wealthy than to leave them poor and begging from people."',
      category: 'WASAYAH',
      relevanceScore: 0.97,
    },
    {
      id: 'nasa_2582',
      source: 'HADITH',
      reference: 'Sunan an-Nasa\'i 2582',
      translationText: 'Charity given to a poor stranger is Sadaqah, but given to an eligible relative it is dual: Sadaqah and Silat al-Rahim (strengthening family ties).',
      category: 'ZAKAT',
      relevanceScore: 0.93,
    },

    // ── 5 MADHHAB POSITIONS ────────────────────────────────────────────────
    {
      id: 'hanafi_rules',
      source: 'HANAFI',
      reference: 'Al-Hidayah / Al-Sirajiyyah (Hanafi Fiqh)',
      translationText: 'Hanafi School Rules: 1. Uses Silver Nisab (595g) as preferred threshold for maximum charitable reach. 2. Zakat is due on all gold/silver jewelry regardless of use. 3. Spouse is excluded from Radd surplus distribution. 4. Al-Umariyyatan gives Mother 1/3 of remainder after spouse.',
      category: 'GENERAL',
      relevanceScore: 0.92,
    },
    {
      id: 'maliki_rules',
      source: 'MALIKI',
      reference: 'Al-Mudawwanah (Maliki Fiqh)',
      translationText: 'Maliki School Rules: 1. Personal daily non-extravagant gold jewelry worn by women is exempt from Zakat. 2. Spouse receives Radd surplus in later Maliki consensus. 3. Maternal grandfather does not block maternal grandmother.',
      category: 'GENERAL',
      relevanceScore: 0.91,
    },
    {
      id: 'shafii_rules',
      source: 'SHAFII',
      reference: 'Al-Majmu\' by Imam al-Nawawi (Shafi\'i Fiqh)',
      translationText: 'Shafi\'i School Rules: 1. Customary personal ornaments exempt from Zakat. 2. Surplus estate when no agnates exist goes to Bayt al-Mal (Public Treasury), no Radd to individual Fard heirs.',
      category: 'GENERAL',
      relevanceScore: 0.90,
    },
    {
      id: 'hanbali_rules',
      source: 'HANBALI',
      reference: 'Al-Mughni by Ibn Qudamah (Hanbali Fiqh)',
      translationText: 'Hanbali School Rules: 1. Customary personal jewelry exempt. 2. Paternal Grandfather blocks brothers completely in Ibn Qudamah position. 3. Uterine siblings blocked by grandfather.',
      category: 'GENERAL',
      relevanceScore: 0.90,
    },
    {
      id: 'jafari_rules',
      source: 'JAFARI',
      reference: 'Wasa\'il al-Shia (Ja\'fari Fiqh)',
      translationText: 'Ja\'fari (Shia Ithna Ashari) School Rules: 1. Wives inherit value of building/structures, not land itself. 2. Three Classes/Orders of priority for heirs (Class 1: Parents & Children, Class 2: Grandparents & Siblings, Class 3: Uncles/Aunts). 3. Son of son blocked by living son.',
      category: 'INHERITANCE',
      relevanceScore: 0.91,
    },
  ];

  /**
   * Retrieves relevant Islamic passages for a user query.
   */
  static retrieve(query: string, limit = 4): RAGDocument[] {
    const q = query.toLowerCase();
    const scored = this.knowledgeBase.map(doc => {
      let score = 0;
      if (q.includes('zakat') && doc.category === 'ZAKAT') score += 0.4;
      if ((q.includes('inherit') || q.includes('mirath') || q.includes('share') || q.includes('wife') || q.includes('daughter')) && doc.category === 'INHERITANCE') score += 0.4;
      if ((q.includes('riba') || q.includes('interest')) && doc.category === 'RIBA') score += 0.5;
      if ((q.includes('will') || q.includes('wasiyyah')) && doc.category === 'WASAYAH') score += 0.5;
      if (q.includes('hanafi') && doc.source === 'HANAFI') score += 1.0;
      if (q.includes('maliki') && doc.source === 'MALIKI') score += 1.0;
      if ((q.includes('shafi') || q.includes('shafii')) && doc.source === 'SHAFII') score += 1.0;
      if (q.includes('hanbali') && doc.source === 'HANBALI') score += 1.0;
      if (q.includes('jafari') && doc.source === 'JAFARI') score += 1.0;

      // Text matching
      const words = q.split(/\s+/);
      words.forEach(w => {
        if (w.length > 3 && doc.translationText.toLowerCase().includes(w)) score += 0.1;
      });

      return { ...doc, rawScore: score, relevanceScore: Math.min(1.0, doc.relevanceScore + score) };
    });

    return scored
      .sort((a, b) => b.rawScore - a.rawScore || b.relevanceScore - a.relevanceScore)
      .slice(0, limit);
  }
}
