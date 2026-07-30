export type SupportedLanguage = 'en' | 'ar' | 'ha';

export interface Translations {
  // Common UI
  appName: string;
  back: string;
  next: string;
  save: string;
  cancel: string;
  done: string;
  close: string;
  submit: string;
  loading: string;
  error: string;
  success: string;
  search: string;
  viewAll: string;
  details: string;
  delete: string;
  exportPdf: string;
  share: string;
  comingSoon: string;
  step: string;
  preferenceUpdated: string;

  // Navigation
  navHome: string;
  navHistory: string;
  navAiAssistant: string;
  navLearn: string;
  navProfile: string;

  // Profile & Settings
  profileTitle: string;
  preferences: string;
  language: string;
  madhhabPreference: string;
  defaultCurrency: string;
  appSettings: string;
  darkMode: string;
  haptics: string;
  biometrics: string;
  supportSection: string;
  helpSupport: string;
  aboutMizan: string;
  logout: string;
  upgradePremium: string;
  premiumSubtitle: string;

  // Zakat
  zakatTitle: string;
  zakatSubtitle: string;
  cashSavings: string;
  goldSilver: string;
  businessInventory: string;
  investmentsStocks: string;
  agriculture: string;
  livestock: string;
  otherAssets: string;
  crypto: string;
  netWealth: string;
  nisabThreshold: string;
  totalZakatDue: string;
  zakatIsDue: string;
  zakatNotDue: string;

  // Inheritance
  inheritanceTitle: string;
  estateDetails: string;
  addHeirs: string;
  reviewSummary: string;
  inheritanceResults: string;
  totalEstate: string;
  debts: string;
  funeralExpenses: string;
  wasiyyah: string;
  netEstate: string;

  // Help & Support
  helpCenter: string;
  searchHelp: string;
  faqs: string;
  contactSupport: string;
  reportProblem: string;
  educationalResources: string;
  emailSupport: string;
  liveChat: string;
  whatsappSupport: string;
  phoneSupport: string;
}

export const translations: Record<SupportedLanguage, Translations> = {
  en: {
    appName: 'MIZAN',
    back: 'Back',
    next: 'Next',
    save: 'Save',
    cancel: 'Cancel',
    done: 'Done',
    close: 'Close',
    submit: 'Submit',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    search: 'Search...',
    viewAll: 'View All',
    details: 'Details',
    delete: 'Delete',
    exportPdf: 'Export PDF',
    share: 'Share',
    comingSoon: 'Coming Soon',
    step: 'Step',
    preferenceUpdated: 'Preference updated successfully.',

    navHome: 'Home',
    navHistory: 'History',
    navAiAssistant: 'AI Assistant',
    navLearn: 'Learn',
    navProfile: 'Profile',

    profileTitle: 'Profile',
    preferences: 'Preferences',
    language: 'Language',
    madhhabPreference: 'Madhhab Preference',
    defaultCurrency: 'Default Currency',
    appSettings: 'App Settings',
    darkMode: 'Dark Mode',
    haptics: 'Haptic Feedback',
    biometrics: 'Biometric Unlock',
    supportSection: 'Support',
    helpSupport: 'Help & Support',
    aboutMizan: 'About MIZAN',
    logout: 'Log Out',
    upgradePremium: 'Upgrade to Premium',
    premiumSubtitle: 'Get offline access & PDF reports',

    zakatTitle: 'Zakat Calculator',
    zakatSubtitle: 'Calculate your Zakat accurately with Shariah precision',
    cashSavings: 'Cash & Savings',
    goldSilver: 'Gold & Silver',
    businessInventory: 'Business Assets & Inventory',
    investmentsStocks: 'Investments & Stocks',
    agriculture: 'Agriculture',
    livestock: 'Livestock',
    otherAssets: 'Other Zakatable Assets',
    crypto: 'Cryptocurrency',
    netWealth: 'Net Zakatable Wealth',
    nisabThreshold: 'Nisab Threshold',
    totalZakatDue: 'Total Zakat Due',
    zakatIsDue: 'Zakat Obligatory',
    zakatNotDue: 'Below Nisab',

    inheritanceTitle: 'Inheritance (Mirath)',
    estateDetails: 'Estate Details',
    addHeirs: 'Add Heirs',
    reviewSummary: 'Review Summary',
    inheritanceResults: 'Inheritance Results',
    totalEstate: 'Total Estate Value',
    debts: 'Debts (Duyun)',
    funeralExpenses: 'Funeral Expenses (Tajhiz)',
    wasiyyah: 'Will Bequests (Wasiyyah)',
    netEstate: 'Net Distributable Estate',

    helpCenter: 'Help Center',
    searchHelp: 'Search FAQs and support articles...',
    faqs: 'Frequently Asked Questions',
    contactSupport: 'Contact Support',
    reportProblem: 'Report a Problem',
    educationalResources: 'Educational Resources',
    emailSupport: 'Email Support',
    liveChat: 'Live Chat (Coming Soon)',
    whatsappSupport: 'WhatsApp Support',
    phoneSupport: 'Phone Support (Placeholder)',
  },

  ar: {
    appName: 'ميزان',
    back: 'رجوع',
    next: 'التالي',
    save: 'حفظ',
    cancel: 'إلغاء',
    done: 'تم',
    close: 'إغلاق',
    submit: 'إرسال',
    loading: 'جاري التحميل...',
    error: 'خطأ',
    success: 'نجاح',
    search: 'بحث...',
    viewAll: 'عرض الكل',
    details: 'التفاصيل',
    delete: 'حذف',
    exportPdf: 'تصدير PDF',
    share: 'مشاركة',
    comingSoon: 'قريباً',
    step: 'الخطوة',
    preferenceUpdated: 'تم تحديث التفضيلات بنجاح.',

    navHome: 'الرئيسية',
    navHistory: 'السجل',
    navAiAssistant: 'المساعد الذكي',
    navLearn: 'تعلم',
    navProfile: 'الملف الشخصي',

    profileTitle: 'الملف الشخصي',
    preferences: 'التفضيلات',
    language: 'اللغة',
    madhhabPreference: 'المذهب الفقهي',
    defaultCurrency: 'العملة الافتراضية',
    appSettings: 'إعدادات التطبيق',
    darkMode: 'الوضع الداكن',
    haptics: 'الاهتزاز اللمسي',
    biometrics: 'البصمة الحيوية',
    supportSection: 'الدعم والمساعدة',
    helpSupport: 'المساعدة والدعم',
    aboutMizan: 'عن ميزان',
    logout: 'تسجيل الخروج',
    upgradePremium: 'الترقية إلى النسخة المميزة',
    premiumSubtitle: 'احصل على ميزات العمل دون إنترنت وتقارير PDF',

    zakatTitle: 'حاسبة الزكاة',
    zakatSubtitle: 'احسب زكاتك بدقة وفق الأحكام الشرعية',
    cashSavings: 'النقد والمدخرات',
    goldSilver: 'الذهب والفضة',
    businessInventory: 'عروض التجارة والبضائع',
    investmentsStocks: 'الاستثمارات والأسهم',
    agriculture: 'الزروع والثمار',
    livestock: 'الأنعام والماشية',
    otherAssets: 'أصول أخرى تبتغي الزكاة',
    crypto: 'العملات الرقمية',
    netWealth: 'صافي المال الخاضع للزكاة',
    nisabThreshold: 'حد النصاب',
    totalZakatDue: 'إجمالي الزكاة الواجبة',
    zakatIsDue: 'الزكاة واجبة',
    zakatNotDue: 'دون النصاب',

    inheritanceTitle: 'المواريث الشرعية',
    estateDetails: 'تفاصيل التركة',
    addHeirs: 'إضافة الورثة',
    reviewSummary: 'مراجعة المخلص',
    inheritanceResults: 'نتائج قسمة التركة',
    totalEstate: 'إجمالي التركة',
    debts: 'الديون المترتبة',
    funeralExpenses: 'تجهيز المتوفى',
    wasiyyah: 'الوصية',
    netEstate: 'صافي التركة القابلة للتوزيع',

    helpCenter: 'مركز المساعدة',
    searchHelp: 'البحث في الأسئلة الشائعة والمقالات...',
    faqs: 'الأسئلة الشائعة',
    contactSupport: 'التواصل مع الدعم',
    reportProblem: 'الإبلاغ عن مشكلة',
    educationalResources: 'الموارد التعليمية',
    emailSupport: 'الدعم عبر البريد الإلكتروني',
    liveChat: 'المحادثة المباشرة (قريباً)',
    whatsappSupport: 'الدعم عبر واتساب',
    phoneSupport: 'الدعم الهاتفي',
  },

  ha: {
    appName: 'MIZAN',
    back: 'Koma Baya',
    next: 'Na Gaba',
    save: 'Ajiye',
    cancel: 'Soke',
    done: 'Kammala',
    close: 'Rufe',
    submit: 'Aika',
    loading: 'Yana kan yi...',
    error: 'Kuskure',
    success: 'Nasara',
    search: 'Bincika...',
    viewAll: 'Duba Duka',
    details: 'Cikakkun Bayanai',
    delete: 'Goge',
    exportPdf: 'Fitar da PDF',
    share: 'Raba',
    comingSoon: 'Yana Tafe',
    step: 'Mataki',
    preferenceUpdated: 'An sabunta zaɓi cikin nasara.',

    navHome: 'Gida',
    navHistory: 'Tarihi',
    navAiAssistant: 'Mai Taimako AI',
    navLearn: 'Koyo',
    navProfile: 'Profail',

    profileTitle: 'Profail',
    preferences: 'Zaɓuɓɓuka',
    language: 'Yare',
    madhhabPreference: 'Harkokin Madhhab',
    defaultCurrency: 'Kudancin Kudin',
    appSettings: 'Saitunan Manhaja',
    darkMode: 'Yanayin Duhu',
    haptics: 'Tashin Ji',
    biometrics: 'Kulle Biometric',
    supportSection: 'Taimako',
    helpSupport: 'Taimako & Goyon Baya',
    aboutMizan: 'Malamin MIZAN',
    logout: 'Fita',
    upgradePremium: 'Haɓaka zuwa Premium',
    premiumSubtitle: 'Samu damar yin amfani offline & rahotannin PDF',

    zakatTitle: 'Manhajar Lissafin Zakka',
    zakatSubtitle: 'Lissafa Zakkarka bisa ingantaccen tsarin Shari\'a',
    cashSavings: 'Kudi & Adana',
    goldSilver: 'Zinariya & Azurfa',
    businessInventory: 'Kayan Kasuwanci',
    investmentsStocks: 'Zuba Dukiya & Hanun Jari',
    agriculture: 'Noma & Amfanin Gona',
    livestock: 'Dabbobi (Awaki, Shanu, Rakuƙa)',
    otherAssets: 'Sauran Kadarorin Zakka',
    crypto: 'Kudin Crypto',
    netWealth: 'Cikakken Abin Zakka',
    nisabThreshold: 'Kadan Daga Nisabi',
    totalZakatDue: 'Zakkan Da Ake Bida',
    zakatIsDue: 'Zakka Ta Wajibata',
    zakatNotDue: 'Bai Kai Nisabi Ba',

    inheritanceTitle: 'Gado (Mirath)',
    estateDetails: 'Bayanin Dukiya',
    addHeirs: 'Ƙara Masu Gado',
    reviewSummary: 'Bincika Takaitaccen Bayani',
    inheritanceResults: 'Sakamakon Rarraba Gado',
    totalEstate: 'Gaba Ɗayan Dukiya',
    debts: 'Basussuka (Duyun)',
    funeralExpenses: 'Kudin Janaza (Tajhiz)',
    wasiyyah: 'Wasikun Wasiyya',
    netEstate: 'Dukiyar Da Za A Rabar',

    helpCenter: 'Cibiyar Taimako',
    searchHelp: 'Bincika tambayoyi & shafukan taimako...',
    faqs: 'Tambayoyin Da Aka Fiye Yi',
    contactSupport: 'Tuntubi Taimako',
    reportProblem: 'Aiko Da Matsala',
    educationalResources: 'Abubuwan Koyo',
    emailSupport: 'Taimakon Imel',
    liveChat: 'Hirar Kai Tsaye (Yana Tafe)',
    whatsappSupport: 'Taimakon WhatsApp',
    phoneSupport: 'Taimakon Waya',
  },
};
