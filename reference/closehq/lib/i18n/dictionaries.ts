import type { LocaleCode } from './config';

/** Shape of the UI message catalogue (chrome strings localised so far). */
export interface Messages {
  nav: {
    buy: string; sell: string; close: string;
    signIn: string; signUp: string;
    sellList: string; sellListDesc: string;
    sellNow: string; sellNowDesc: string;
    listWithCa: string; listWithCaDesc: string;
    brokerage: string; brokerageDesc: string;
  };
  search: {
    search: string; residential: string;
    tabs: { properties: string; newReleases: string; transactions: string; agents: string };
    sub: { all: string; offplan: string; ready: string; sold: string; rented: string; agents: string; companies: string };
    ph: { properties: string; newReleases: string; transactions: string; agents: string };
  };
  home: {
    notif: string; learnMore: string;
    heroTitle: string; heroSub: string;
    cards: { buy: string; sell: string; close: string; buyCta: string; sellCta: string; closeCta: string };
  };
}

const en: Messages = {
  nav: {
    buy: 'Buy', sell: 'Sell', close: 'Close',
    signIn: 'Sign in', signUp: 'Sign up',
    sellList: 'List your property', sellListDesc: 'List as the owner or POA',
    sellNow: 'Sell now', sellNowDesc: 'Sell directly through iClose',
    listWithCa: 'List with Contract A', listWithCaDesc: 'RERA Form A broker listing',
    brokerage: 'Brokerage portal', brokerageDesc: 'For agents, agencies & freelancers',
  },
  search: {
    search: 'Search', residential: 'Residential',
    tabs: { properties: 'Properties', newReleases: 'New Releases', transactions: 'Transactions', agents: 'Agents' },
    sub: { all: 'All', offplan: 'Off-plan', ready: 'Ready', sold: 'Sold', rented: 'Rented', agents: 'Agents', companies: 'Companies' },
    ph: {
      properties: 'City, community or building',
      newReleases: 'Location, project or developer',
      transactions: 'Search for any location in Dubai',
      agents: 'Enter location or agent name',
    },
  },
  home: {
    notif: 'Investing in Off-Plan? Get Special Pricing & Credits',
    learnMore: 'Learn More',
    heroTitle: 'Never Pay Commission to Buy, Sell, or Close Ever Again!',
    heroSub: 'Investing in Off-Plan? Get Special Pricing & Credits',
    cards: {
      buy: 'Buy with zero commission', sell: 'Sell without commission', close: 'Close & keep 100% commission',
      buyCta: 'How to buy', sellCta: 'How to sell', closeCta: 'How to close',
    },
  },
};

const ar: Messages = {
  nav: {
    buy: 'شراء', sell: 'بيع', close: 'إتمام',
    signIn: 'تسجيل الدخول', signUp: 'إنشاء حساب',
    sellList: 'أدرج عقارك', sellListDesc: 'أدرج كمالك أو وكيل بتفويض',
    sellNow: 'بِع الآن', sellNowDesc: 'بِع مباشرةً عبر iClose',
    listWithCa: 'الإدراج بعقد A', listWithCaDesc: 'إدراج وسيط بنموذج RERA A',
    brokerage: 'بوابة الوساطة', brokerageDesc: 'للوكلاء والشركات والمستقلين',
  },
  search: {
    search: 'بحث', residential: 'سكني',
    tabs: { properties: 'العقارات', newReleases: 'الإطلاقات الجديدة', transactions: 'المعاملات', agents: 'الوكلاء' },
    sub: { all: 'الكل', offplan: 'على الخارطة', ready: 'جاهز', sold: 'مباع', rented: 'مؤجر', agents: 'الوكلاء', companies: 'الشركات' },
    ph: {
      properties: 'مدينة أو منطقة أو مبنى',
      newReleases: 'الموقع أو المشروع أو المطوّر',
      transactions: 'ابحث عن أي موقع في دبي',
      agents: 'أدخل الموقع أو اسم الوكيل',
    },
  },
  home: {
    notif: 'تستثمر على الخارطة؟ احصل على أسعار خاصة ورصيد',
    learnMore: 'اعرف المزيد',
    heroTitle: 'لا تدفع عمولة للشراء أو البيع أو الإتمام مرة أخرى أبداً!',
    heroSub: 'تستثمر على الخارطة؟ احصل على أسعار خاصة ورصيد',
    cards: {
      buy: 'اشترِ بدون عمولة', sell: 'بِع بدون عمولة', close: 'أتمم واحتفظ بـ 100% من العمولة',
      buyCta: 'كيف تشتري', sellCta: 'كيف تبيع', closeCta: 'كيف تُتمم',
    },
  },
};

const ru: Messages = {
  nav: {
    buy: 'Купить', sell: 'Продать', close: 'Закрыть',
    signIn: 'Войти', signUp: 'Регистрация',
    sellList: 'Разместить объект', sellListDesc: 'Как владелец или по доверенности',
    sellNow: 'Продать сейчас', sellNowDesc: 'Продать напрямую через iClose',
    listWithCa: 'Разместить по Контракту A', listWithCaDesc: 'Листинг брокера по форме RERA A',
    brokerage: 'Портал брокера', brokerageDesc: 'Для агентов, агентств и фрилансеров',
  },
  search: {
    search: 'Поиск', residential: 'Жилая',
    tabs: { properties: 'Недвижимость', newReleases: 'Новые проекты', transactions: 'Сделки', agents: 'Агенты' },
    sub: { all: 'Все', offplan: 'Офф-план', ready: 'Готовое', sold: 'Продано', rented: 'Аренда', agents: 'Агенты', companies: 'Компании' },
    ph: {
      properties: 'Город, район или здание',
      newReleases: 'Локация, проект или застройщик',
      transactions: 'Поиск по любой локации в Дубае',
      agents: 'Локация или имя агента',
    },
  },
  home: {
    notif: 'Инвестируете в офф-план? Получите специальные цены и кредиты',
    learnMore: 'Узнать больше',
    heroTitle: 'Никогда больше не платите комиссию за покупку, продажу или закрытие сделки!',
    heroSub: 'Инвестируете в офф-план? Получите специальные цены и кредиты',
    cards: {
      buy: 'Покупайте без комиссии', sell: 'Продавайте без комиссии', close: 'Закрывайте сделки и сохраняйте 100% комиссии',
      buyCta: 'Как купить', sellCta: 'Как продать', closeCta: 'Как закрыть',
    },
  },
};

const zh: Messages = {
  nav: {
    buy: '购买', sell: '出售', close: '成交',
    signIn: '登录', signUp: '注册',
    sellList: '发布房源', sellListDesc: '以业主或授权人身份发布',
    sellNow: '立即出售', sellNowDesc: '通过 iClose 直接出售',
    listWithCa: '使用合同A发布', listWithCaDesc: 'RERA 表格A 经纪挂牌',
    brokerage: '经纪门户', brokerageDesc: '面向经纪人、机构和自由职业者',
  },
  search: {
    search: '搜索', residential: '住宅',
    tabs: { properties: '房产', newReleases: '新盘', transactions: '成交记录', agents: '经纪人' },
    sub: { all: '全部', offplan: '期房', ready: '现房', sold: '已售', rented: '已租', agents: '经纪人', companies: '公司' },
    ph: {
      properties: '城市、社区或楼盘',
      newReleases: '位置、项目或开发商',
      transactions: '搜索迪拜任意位置',
      agents: '输入位置或经纪人姓名',
    },
  },
  home: {
    notif: '投资期房？获取专属价格和积分',
    learnMore: '了解更多',
    heroTitle: '买房、卖房、成交，永不再支付佣金！',
    heroSub: '投资期房？获取专属价格和积分',
    cards: {
      buy: '零佣金购房', sell: '无佣金售房', close: '成交并保留100%佣金',
      buyCta: '如何购买', sellCta: '如何出售', closeCta: '如何成交',
    },
  },
};

const hi: Messages = {
  nav: {
    buy: 'खरीदें', sell: 'बेचें', close: 'क्लोज़ करें',
    signIn: 'साइन इन', signUp: 'साइन अप',
    sellList: 'अपनी संपत्ति सूचीबद्ध करें', sellListDesc: 'मालिक या POA के रूप में',
    sellNow: 'अभी बेचें', sellNowDesc: 'iClose के माध्यम से सीधे बेचें',
    listWithCa: 'कॉन्ट्रैक्ट A के साथ सूचीबद्ध करें', listWithCaDesc: 'RERA फ़ॉर्म A ब्रोकर लिस्टिंग',
    brokerage: 'ब्रोकरेज पोर्टल', brokerageDesc: 'एजेंट, एजेंसियों और फ्रीलांसरों के लिए',
  },
  search: {
    search: 'खोजें', residential: 'आवासीय',
    tabs: { properties: 'संपत्तियाँ', newReleases: 'नई परियोजनाएँ', transactions: 'लेन-देन', agents: 'एजेंट' },
    sub: { all: 'सभी', offplan: 'ऑफ-प्लान', ready: 'रेडी', sold: 'बिका', rented: 'किराया', agents: 'एजेंट', companies: 'कंपनियाँ' },
    ph: {
      properties: 'शहर, समुदाय या इमारत',
      newReleases: 'स्थान, परियोजना या डेवलपर',
      transactions: 'दुबई में कोई भी स्थान खोजें',
      agents: 'स्थान या एजेंट का नाम दर्ज करें',
    },
  },
  home: {
    notif: 'ऑफ-प्लान में निवेश? विशेष मूल्य और क्रेडिट पाएँ',
    learnMore: 'और जानें',
    heroTitle: 'खरीदने, बेचने या क्लोज़ करने पर फिर कभी कमीशन न दें!',
    heroSub: 'ऑफ-प्लान में निवेश? विशेष मूल्य और क्रेडिट पाएँ',
    cards: {
      buy: 'शून्य कमीशन पर खरीदें', sell: 'बिना कमीशन बेचें', close: 'क्लोज़ करें और 100% कमीशन रखें',
      buyCta: 'कैसे खरीदें', sellCta: 'कैसे बेचें', closeCta: 'कैसे क्लोज़ करें',
    },
  },
};

const DICTIONARIES: Record<LocaleCode, Messages> = { en, ar, ru, zh, hi };

export function getMessages(locale: LocaleCode): Messages {
  return DICTIONARIES[locale] ?? en;
}
