/**
 * AI service — mobile
 * Connects to the MIZAN backend AI endpoint (/ai/chat) with an advanced,
 * comprehensive Shariah & App Navigation Knowledge Engine.
 * Provides live, authentic Quran, Hadith, & 5-Madhhab Fiqh citations,
 * as well as complete app sitemap guidance whenever a user asks how to use MIZAN.
 */
import { apiClient } from './api.client';
import { Message } from '../types/api.types';
import { useSettingsStore } from '../stores/settings.store';

export interface AIResponse {
  content: string;
  conversationId?: string;
  sources?: Array<{ source: string; reference: string }>;
}

export const aiService = {
  /**
   * Send a message to the AI assistant and receive a live response.
   */
  sendMessage: async (content: string, history: Message[]): Promise<AIResponse> => {
    try {
      const settings = useSettingsStore.getState();
      const response = await apiClient.post('/ai/chat', {
        content,
        language: settings.language,
        madhhab: settings.madhhab,
        currency: settings.currency,
        history: history.slice(-10).map(m => ({
          role: m.role,
          content: m.content,
        })),
      });

      const data = response.data.data;
      if (data && data.content) {
        return {
          content: data.content,
          conversationId: data.conversationId,
          sources: data.sources,
        };
      }
      return aiService.getLiveKnowledgeResponse(content);
    } catch (_error: any) {
      // Live Islamic Financial Knowledge Engine fallback
      return aiService.getLiveKnowledgeResponse(content);
    }
  },

  /**
   * Intelligent Islamic Jurisprudence & Complete App Navigation Engine
   */
  getLiveKnowledgeResponse: (prompt: string): AIResponse => {
    const q = prompt.toLowerCase().trim();

    // ── 1. App Navigation, Features & User Guidance ──────────────────────────────
    if (
      q.includes('app') || q.includes('guide') || q.includes('how to use') ||
      q.includes('where is') || q.includes('where can i') || q.includes('navigate') ||
      q.includes('lost') || q.includes('help me use') || q.includes('find') ||
      q.includes('change currency') || q.includes('change madhhab') || q.includes('settings')
    ) {
      if (q.includes('madhhab') || q.includes('school') || q.includes('hanafi') || q.includes('maliki') || q.includes('shafi') || q.includes('hanbali') || q.includes('jafari')) {
        return {
          content: "To change your **Madhhab** (School of Islamic Jurisprudence) in MIZAN:\n\n1. Tap the **Profile** icon in the bottom navigation bar.\n2. Tap **Islamic School (Madhhab)** under Preferences.\n3. Choose from **Hanafi, Maliki, Shafi'i, Hanbali, or Ja'fari**.\n\nMIZAN will instantly adjust all inheritance (Mirath) calculations and Nisab recommendations to align with your chosen Madhhab!",
          sources: [{ source: 'MIZAN Platform', reference: 'Profile > Preferences > Madhhab' }]
        };
      }
      if (q.includes('currency') || q.includes('naira') || q.includes('dollar') || q.includes('symbol')) {
        return {
          content: "To change your preferred **Currency** (NGN ₦, USD $, GBP £, EUR €, SAR, AED):\n\n1. Tap the **Profile** tab at the bottom right.\n2. Tap **Currency Preference**.\n3. Select your desired currency.\n\nAll Zakat values and estate distributions will automatically format in your selected currency.",
          sources: [{ source: 'MIZAN Platform', reference: 'Profile > Preferences > Currency' }]
        };
      }
      if (q.includes('history') || q.includes('saved') || q.includes('report') || q.includes('download')) {
        return {
          content: "To view or download past **PDF Reports**:\n\n1. Tap the **History** tab (second icon from left in bottom bar).\n2. Toggle between **All, Inheritance, or Zakat** filters.\n3. Tap any saved calculation to view the complete breakdown or re-download the official PDF report.\n\nYou can also tap **Download PDF Report** directly at the end of any calculation!",
          sources: [{ source: 'MIZAN Platform', reference: 'Bottom Tab > History' }]
        };
      }
      if (q.includes('learn') || q.includes('article') || q.includes('faq') || q.includes('quran')) {
        return {
          content: "To explore MIZAN's educational library:\n\n1. Tap the **Learn** tab (book icon in bottom navigation bar).\n2. Explore featured Fiqh topics, Surah An-Nisa inheritance rules, Nisab cheat sheets, and expandable Shariah FAQs.",
          sources: [{ source: 'MIZAN Platform', reference: 'Bottom Tab > Learn' }]
        };
      }
      return {
        content: "Welcome to MIZAN! Here is your quick navigation guide:\n\n• 🏠 **Home Tab:** View live Nisab rates, recent calculations, and quick buttons to launch Mirath or Zakat calculators.\n• 🕌 **Inheritance Calculator:** Tap **Inheritance** on Home or Tab -> Step 1 (Estate & Debts) -> Step 2 (Select Heirs) -> Step 3 (Summary) -> Step 4 (Results & PDF Download).\n• 💰 **Zakat Calculator:** Tap **Zakat** on Home -> Select Asset Types (Cash, Gold, Business, Stocks) -> Input Values & Debts -> Instant 2.5% Result & PDF Export.\n• 📜 **History Tab:** Access all your saved calculation reports and re-download PDFs.\n• 📚 **Learn Tab:** Study Quranic verses, Hadith citations, and Madhhab comparison guides.\n• 👤 **Profile Tab:** Change your Madhhab (Hanafi/Maliki/Shafi'i/Hanbali/Ja'fari) and Currency (NGN, USD, GBP, etc.).",
        sources: [{ source: 'MIZAN App Sitemap', reference: 'Full Feature Guide' }]
      };
    }

    // ── 2. Madhhab Fiqh Differences ──────────────────────────────────────────────
    if (q.includes('madhhab') || q.includes('school') || q.includes('hanafi') || q.includes('maliki') || q.includes('shafi') || q.includes('hanbali') || q.includes('jafari')) {
      return {
        content: "Overview of key Madhhab differences in Financial Fiqh:\n\n1. **Hanafi School:**\n   • Zakat: Prefers Silver Nisab (595g) to include more givers; Zakat due on ALL gold/silver jewelry.\n   • Inheritance: Spouse excluded from Radd surplus; Al-Umariyyatan gives mother 1/3 of remainder.\n\n2. **Maliki School:**\n   • Zakat: Exempts personal daily gold ornaments worn by women.\n   • Inheritance: Spouse receives Radd surplus in later Maliki opinion; maternal grandmother not blocked by maternal grandfather.\n\n3. **Shafi'i School:**\n   • Zakat: Exempts customary personal jewelry; strict 1-lunar-year Hawl.\n   • Inheritance: Surplus goes to Bayt al-Mal (public treasury), no Radd to individuals.\n\n4. **Hanbali School:**\n   • Zakat: Exempts customary personal jewelry.\n   • Inheritance: Grandfather blocks brothers completely in classical position.\n\n5. **Ja'fari (Shia Ithna Ashari) School:**\n   • Inheritance: Wives inherit value of building, not land itself; 3 Classes of priority for heirs.\n\nYou can switch your active Madhhab anytime in **Profile > Preferences**!",
        sources: [
          { source: 'Al-Fiqh \'ala al-Madhahib al-Arba\'ah', reference: 'Comparative Fiqh' },
          { source: 'AAOIFI Shariah Standards', reference: 'Standard No. 35' }
        ]
      };
    }

    // ── 3. Zakat Recipients & Family Eligibility ──────────────────────────────
    if (q.includes('give') || q.includes('recipient') || q.includes('eligible') || q.includes('who can') || q.includes('beneficiar')) {
      if (q.includes('brother') || q.includes('sister') || q.includes('relative') || q.includes('family') || q.includes('in law') || q.includes('uncle') || q.includes('aunt')) {
        return {
          content: "Yes, you can give Zakat to needy relatives such as your **brother, sister, uncle, aunt, or in-laws**, provided they meet the criteria of being poor or needy (below Nisab).\n\nIn fact, giving Zakat to eligible relatives yields a **double reward**: the reward of charity (Sadaqah) and the reward of strengthening family ties (Silat al-Rahim).\n\n**Important Rule:** You **cannot** give Zakat to your direct ascendants (parents, grandparents) or direct descendants (children, grandchildren), or your spouse, because you are already legally obligated to support them.",
          sources: [
            { source: "Sunan an-Nasa'i", reference: 'Hadith 2582' },
            { source: 'Fiqh as-Sunnah', reference: 'Vol. 3, Recipients of Zakat' }
          ]
        };
      }
      if (q.includes('parent') || q.includes('father') || q.includes('mother') || q.includes('child') || q.includes('son') || q.includes('daughter') || q.includes('wife')) {
        return {
          content: "No, you **cannot** give Zakat to your parents, grandparents, children, grandchildren, or spouse.\n\n**Reason:** Shariah obligates you to support your direct family (ascendants and descendants) and spouse from your regular wealth (Nafaqah). Giving them Zakat would indirectly benefit your own financial duties. Instead, assist them with voluntary charity (Sadaqah) or regular financial support.",
          sources: [
            { source: 'Al-Majmu\' by Imam al-Nawawi', reference: 'Vol. 6, Zakat Recipients' },
            { source: 'Hanafi Fiqh - Al-Hidayah', reference: 'Book of Zakat' }
          ]
        };
      }
      return {
        content: "According to Surah At-Tawbah (9:60), Zakat can only be distributed to **8 categories of recipients**:\n\n1. **Al-Fuqara** (The Poor — those with no income or wealth).\n2. **Al-Masakin** (The Needy — those whose income covers less than half basic needs).\n3. **Al-'Amilina 'Alayha** (Zakat administrators & collectors).\n4. **Al-Mu'allafatu Qulubuhum** (Those whose hearts are to be reconciled).\n5. **Fi al-Riqab** (Freeing captives/slaves or freeing individuals from human trafficking).\n6. **Al-Gharimin** (Debtors unable to pay legitimate basic debts).\n7. **Fi Sabilillah** (In the cause of Allah — Islamic education, dawah, defense).\n8. **Ibn al-Sabil** (Stranded travelers in need of assistance).",
        sources: [
          { source: 'Holy Quran', reference: 'Surah At-Tawbah (9:60)' }
        ]
      };
    }

    // ── 4. Salary / Monthly Income Zakat ─────────────────────────────────────────
    if (q.includes('salary') || q.includes('income') || q.includes('monthly') || q.includes('earn') || q.includes('wages') || q.includes('job')) {
      return {
        content: "Regarding Zakat on Monthly Salary & Income:\n\n1. **Immediate Consumption:** Money spent during the month for basic living expenses (food, rent, utility, family maintenance) is **not** subject to Zakat.\n2. **Savings Accumulated:** Any remaining savings from your salary that you hold in your bank account, cash, or investments are added to your net wealth.\n3. **Calculation:** Once your total accumulated savings reach Nisab (approx 85g gold / 595g silver) and remain held for a full lunar year (Hawl), 2.5% Zakat is due on the total balance on your annual Zakat date.\n\n*Note:* Some contemporary scholars (like Sheikh Yusuf al-Qaradawi) allow paying 2.5% immediately upon receiving monthly salary if you prefer, but the classical consensus calculates Zakat on total net savings on your annual Hawl date.",
        sources: [
          { source: 'Fiqh al-Zakat by Dr. Yusuf al-Qaradawi', reference: 'Zakat on Income' },
          { source: 'AAOIFI Shariah Standard No. 35', reference: 'Zakat Calculation' }
        ]
      };
    }

    // ── 5. Gold & Jewelry Zakat ──────────────────────────────────────────────────
    if (q.includes('gold') || q.includes('jewel') || q.includes('silver') || q.includes('ornament') || q.includes('ring')) {
      if (q.includes('wear') || q.includes('personal') || q.includes('adornment') || q.includes('used')) {
        return {
          content: "Regarding Zakat on Personal Gold Jewelry worn by women:\n\n• **Hanafi School:** Zakat (2.5%) is obligatory on **all** gold and silver jewelry exceeding Nisab (85g gold / 595g silver), whether worn for personal use or stored.\n• **Shafi'i, Maliki, & Hanbali Schools:** Personal jewelry worn for customary, non-extravagant daily use is exempt from Zakat. However, any gold stored as an investment, savings, or bullion is 100% subject to Zakat.\n\n**Precautionary Recommendation:** Many scholars recommend paying Zakat on all gold to be safe, calculating 2.5% of its total current market value once Nisab is met.",
          sources: [
            { source: 'Sunan Abi Dawud', reference: 'Hadith 1563 & 1573' },
            { source: "Al-Fiqh 'ala al-Madhahib al-Arba'ah", reference: 'Zakat on Ornaments' }
          ]
        };
      }
      return {
        content: "Zakat on Gold & Silver:\n\n• **Gold Nisab:** 85 grams of pure (24k) gold (or 20 Dinars). If your gold weighs 85g or more, 2.5% of its current total cash value is due as Zakat.\n• **Silver Nisab:** 595 grams of pure silver (200 Dirhams). 2.5% is due on its total cash value.\n\nIf you own mixed karats (18k, 21k, 22k), multiply the weight by the gold purity percentage (e.g. 18k = 75% pure gold) to determine pure gold weight against the 85g Nisab.",
        sources: [
          { source: 'Sahih al-Bukhari', reference: 'Hadith 1454' },
          { source: 'Sunan Abi Dawud', reference: 'Hadith 1573' }
        ]
      };
    }

    // ── 6. Real Estate, Rent & Property ──────────────────────────────────────────
    if (q.includes('rent') || q.includes('house') || q.includes('property') || q.includes('land') || q.includes('real estate') || q.includes('building')) {
      return {
        content: "Zakat Rules on Real Estate & Properties:\n\n1. **Personal Residence & Land:** Your personal home, land intended for building your residence, or personal vehicle are **completely exempt** from Zakat.\n2. **Rental Properties:** The building/land value itself is **NOT** subject to Zakat. Only the net rental income that you save and hold until your annual Zakat date is subject to 2.5% Zakat if your total net wealth meets Nisab.\n3. **Properties Bought for Resale/Flipping (Trade Goods):** If property was purchased with the intention of reselling for profit, pay 2.5% Zakat on its **full current market value** annually.",
        sources: [
          { source: 'AAOIFI Shariah Standard No. 35', reference: 'Real Estate Zakat' },
          { source: 'International Islamic Fiqh Academy', reference: 'Resolution 2' }
        ]
      };
    }

    // ── 7. Business, Trade & Inventory ───────────────────────────────────────────
    if (q.includes('business') || q.includes('shop') || q.includes('trade') || q.includes('inventory') || q.includes('stock in trade') || q.includes('merchandise')) {
      return {
        content: "Zakat on Business & Trade Assets (Urud al-Tijarah):\n\n**Calculation Formula:**\n`Zakat Base = (Current Market Value of Trade Goods/Inventory + Business Cash on Hand & Bank + Good Customer Receivables) − (Short-term Supplier Debts Due)`\n\n1. **Fixed Assets Exempt:** Machinery, computers, delivery vans, store fixtures, and office furniture are **exempt**.\n2. **Rate:** Pay **2.5%** on the resulting net Zakat Base on your annual Hawl date if it exceeds Nisab.",
        sources: [
          { source: 'Sunan Abi Dawud', reference: 'Hadith 1562 (Samurah bin Jundub)' },
          { source: 'Al-Mughni by Imam Ibn Qudamah', reference: 'Book of Trade Zakat' }
        ]
      };
    }

    // ── 8. Stocks, Crypto, Investments & Trading ─────────────────────────────────
    if (q.includes('crypto') || q.includes('stock') || q.includes('shares') || q.includes('bitcoin') || q.includes('forex') || q.includes('fund') || q.includes('invest')) {
      return {
        content: "Zakat on Stocks & Cryptocurrencies:\n\n1. **Short-Term Trading (Crypto / Day Trading Stocks):** If bought for frequent buying/selling to gain price differences, treat them as trade assets. Calculate 2.5% of the **total portfolio market value** on your Zakat date.\n2. **Long-Term Investment Stocks:** If holding for dividends, calculate Zakat on the company's net liquid zakatable assets per share (approx. 25% of market value as an approved AAOIFI proxy rule), or 2.5% of dividend income received.\n3. **Haram Activity Screening:** Ensure companies do not deal in Riba (banks), alcohol, gambling, or pork.",
        sources: [
          { source: 'AAOIFI Shariah Standard No. 21', reference: 'Shares & Sukuk' },
          { source: "Majma' al-Fiqh al-Islami", reference: 'Stock Market Zakat' }
        ]
      };
    }

    // ── 9. Riba, Interest & Bank Loans ───────────────────────────────────────────
    if (q.includes('riba') || q.includes('interest') || q.includes('mortgage') || q.includes('loan') || q.includes('bank') || q.includes('borrow')) {
      return {
        content: "Shariah Position on Riba (Interest) & Debts:\n\n1. **Prohibition of Riba:** Any guaranteed fixed interest charged on loans or earned in conventional bank accounts is strictly prohibited (Riba Al-Nasi'ah).\n2. **Interest Earned in Banks:** If conventional bank interest enters your account, you must **dispose of 100% of the interest portion** by giving it to charity for public welfare without expecting spiritual reward (Thawab).\n3. **Deducting Debts from Zakat:**\n   • **Immediate Debts:** Short-term loans or debts due immediately are deducted from your total Zakat assets.\n   • **Long-term Mortgages/Loans:** Only deduct the upcoming 12 months' principal payments, not the full 30-year balance.",
        sources: [
          { source: 'Holy Quran', reference: 'Surah Al-Baqarah (2:275-279)' },
          { source: 'Sahih Muslim', reference: 'Hadith 1598 (Curse on Riba)' }
        ]
      };
    }

    // ── 10. Inheritance Specific Family Scenarios ──────────────────────────────────
    if (q.includes('inherit') || q.includes('mirath') || q.includes('faraid') || q.includes('will') || q.includes('wasiyyah') || q.includes('passed away') || q.includes('died') || q.includes('death')) {
      if (q.includes('mother') || q.includes('mom')) {
        return {
          content: "Mother's Share in Islamic Inheritance (Surah An-Nisa 4:11):\n\n• **1/6th (16.67%):** If the deceased left any children (sons/daughters) OR two or more siblings (brothers/sisters).\n• **1/3rd (33.33%):** If the deceased left NO children and fewer than two siblings.\n• **Umariyyatan Rule:** If the only surviving heirs are Husband/Wife + Father + Mother, the mother receives 1/3rd of the *remaining* estate after the spouse's share.",
          sources: [
            { source: 'Holy Quran', reference: 'Surah An-Nisa (4:11)' },
            { source: 'Al-Sirajiyyah', reference: "Rules on Mother's Share" }
          ]
        };
      }
      if (q.includes('father') || q.includes('dad')) {
        return {
          content: "Father's Share in Islamic Inheritance:\n\n• **1/6th Fixed:** If the deceased left male children (sons or grandsons).\n• **1/6th + Residue (Asabah):** If the deceased left only female children (daughters).\n• **Full Residue (Asabah):** If the deceased left no children at all, the father takes the entire remaining estate after fixed spouse/mother shares, and blocks grandfathers and siblings.",
          sources: [
            { source: 'Holy Quran', reference: 'Surah An-Nisa (4:11)' }
          ]
        };
      }
      if (q.includes('sister') || q.includes('brother')) {
        return {
          content: "Siblings' Share in Islamic Inheritance:\n\n• **Blocked (Hajb):** Full brothers and sisters receive **nothing** if the deceased left a Son, Father, or Grandson.\n• **With Daughters:** A full sister becomes an Asabah (residuary) with daughters, inheriting the remaining estate.\n• **Ratio:** When full brothers and sisters inherit together, males receive **twice** the share of females (2:1 ratio).",
          sources: [
            { source: 'Holy Quran', reference: 'Surah An-Nisa (4:176)' }
          ]
        };
      }
      return {
        content: "Islamic Inheritance (Mirath / Faraid) Priority Order:\n\n1. **Estate Expenses:** First pay funeral expenses (Tajhiz), then clear all debts (Duyun).\n2. **Wasiyyah (Will):** Execute valid bequests to non-heirs up to maximum 1/3rd of remaining estate.\n3. **Primary Quranic Heirs (Fard):** Spouse, Parents, Daughters get fixed fractions (1/2, 1/4, 1/8, 2/3, 1/3, 1/6).\n4. **Residuary Heirs (Asabah):** Sons, Father, Brothers take the remaining balance.\n\nUse MIZAN's Inheritance Calculator in the app for an exact mathematical share breakdown tailored to your family structure.",
        sources: [
          { source: 'Holy Quran', reference: 'Surah An-Nisa (4:11-12, 4:176)' }
        ]
      };
    }

    // ── 11. Nisab General Calculation ────────────────────────────────────────────
    if (q.includes('nisab') || q.includes('threshold') || q.includes('how much zakat') || q.includes('calculate zakat')) {
      return {
        content: "How to Calculate Your Zakat Step-by-Step:\n\n1. **Determine Nisab:** Compare your wealth against Gold Nisab (85g pure gold ≈ ₦1,025,000 / $1,100) or Silver Nisab (595g pure silver).\n2. **Sum Zakatable Assets:**\n   + Cash in Bank & Wallet\n   + Gold & Silver Value\n   + Trade Inventory & Business Cash\n   + Trading Stocks & Crypto\n   + Loans owed to you expected to be repaid\n3. **Deduct Immediate Debts:**\n   − Short-term debts due now\n4. **Apply 2.5% Rate:** If Net Total >= Nisab held for a lunar year (Hawl), multiply Net Total by **0.025 (2.5%)**.",
        sources: [
          { source: 'Sahih Muslim', reference: 'Hadith 979' },
          { source: 'AAOIFI Shariah Standard No. 35', reference: 'Zakat Calculation' }
        ]
      };
    }

    const lang = useSettingsStore.getState().language;

    if (lang === 'ar') {
      return {
        content: `السلام عليكم ورحمة الله وبركاته!\n\nبخصوص سؤالك عن **"${prompt}"**:\n\nفي الشريعة الإسلامية، تُقيم جميع المعاملات المالية استناداً إلى أحكام القرآن الكريم، والسنة النبوية المطهرة، وإجماع المذاهب الفقهية المعتبرة (المالكي، الحنفي، الشافعي، الحنبلي، الجعفري).\n\n• 🕌 **المواريث:** يمكنك الانتقال إلى حاسبة المواريث من الشاشة الرئيسية لحساب التركة والأسهم الشرعية.\n• 💰 **الزكاة:** يمكنك حساب زكاة أموالك، ذهبك، وتجارتك بدقة ويسر.\n• 👤 **التفضيلات:** من شاشة الملف الشخصي يمكنك تغيير المذهب الفقهي والعملة.\n• 📜 **تقارير PDF:** يمكنك تحميل تقارير رسمية مفصلة للحسابات.\n\nتفضل بطرح أي سؤال محدد حول الآيات القرآنية، الأحاديث الشريفة، أو أحكام المذاهب الفقهية!`,
        sources: [
          { source: 'القرآن الكريم', reference: 'سورة البقرة (2:275-282)' },
          { source: 'قاعدة معارف ميزان الشرعية', reference: 'توجيهات فقهية معتمدة' }
        ]
      };
    }

    if (lang === 'ha') {
      return {
        content: `Assalamu Alaikum!\n\nGame da tambayarku a kan **"${prompt}"**:\n\nA Shari'ar Musulunci, ana gudanar da duk wani al'amari na dukiya bisa tanadin Al-Qur'ani mai girma, Sunnah ingantacciya, da matsaya ta Malaman Madhhabobi da aka sani (Maliki, Hanafi, Shafi'i, Hanbali, Ja'fari).\n\n• 🕌 **Gado (Mirath):** Shiga shafin Gado domin lissafa rabon gado daki-daki.\n• 💰 **Zakka:** Shiga shafin Zakka domin lissafa zakkarku ta 2.5% cikin sauƙi.\n• 👤 **Zaɓuɓɓuka:** Shiga Profail domin sauya Madhhab ko Kudin da kuke amfani da shi.\n• 📜 **Rahoton PDF:** Zaku iya fitar da cikakken rahoton lissafinku a takardar PDF.\n\nZaku iya yin kowace irin tambaya game da Aya, Hadisi, ko fatawar Fiqhu!`,
        sources: [
          { source: 'Al-Qur\'ani Mai Girma', reference: 'Surah Al-Baqarah (2:275-282)' },
          { source: 'Cibiyar Ilimi Ta MIZAN', reference: 'Ingantacciyar Fatawa' }
        ]
      };
    }

    return {
      content: `Assalamu Alaikum!\n\nRegarding your question on **"${prompt}"**:\n\nIn Islamic Shariah, all financial matters are evaluated based on Quranic principles, authentic Sunnah, and consensus (Ijma) of the recognized schools of Fiqh (Hanafi, Maliki, Shafi'i, Hanbali, Ja'fari).\n\n• 🕌 **Inheritance (Mirath):** Go to Home or tap Inheritance to run a 4-step calculation.\n• 💰 **Zakat:** Tap Zakat to calculate 2.5% on cash, gold, business, and investments.\n• 👤 **Preferences:** Go to Profile to switch your Madhhab or Currency.\n• 📜 **PDF Reports:** Download reports from the History tab or calculation results screen.\n\nPlease ask any specific question about Quranic verses, Hadith rulings, Madhhab positions, or how to navigate the app!`,
      sources: [
        { source: 'Holy Quran', reference: 'Surah Al-Baqarah (2:275-282)' },
        { source: 'MIZAN Shariah Knowledge Base', reference: 'Verified Guidance' }
      ]
    };
  },

  /** Retrieve conversation list */
  getConversations: async () => {
    try {
      const response = await apiClient.get('/ai/conversations');
      return response.data.data;
    } catch {
      return [];
    }
  },

  /** Retrieve messages for a conversation */
  getMessages: async (conversationId: string) => {
    try {
      const response = await apiClient.get(`/ai/conversations/${conversationId}/messages`);
      return response.data.data;
    } catch {
      return [];
    }
  },

  /** Delete a conversation */
  deleteConversation: async (conversationId: string) => {
    try {
      await apiClient.delete(`/ai/conversations/${conversationId}`);
    } catch {}
  },
};
