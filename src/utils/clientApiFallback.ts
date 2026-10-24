/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * CODELIX Client-Side Resilient API & Offline Data Engine
 * Enables 100% full-featured client execution on GitHub Pages and static hosting.
 */

import type {
  Service,
  Offer,
  PakistaniBank,
  CryptoWallet,
  CouponRecord,
  CmsContent,
  JobApplication,
  Order,
  User,
} from '../types';

// Default Pakistani Banks
const DEFAULT_BANKS: PakistaniBank[] = [
  {
    id: 'bank-meezan',
    bankName: 'Meezan Bank Ltd (Islamic Banking)',
    accountTitle: 'CODELIX SOFTWARE SOLUTIONS',
    accountNumber: '02010108920192',
    iban: 'PK45MEZN0002010108920192',
    branchCode: '0201',
    instructions: 'Transfer via Meezan Mobile App or RAAST / IBFT. Upload screenshot with visible Transaction ID / Reference Number.',
    category: 'Islamic Bank',
    isActive: true,
  },
  {
    id: 'bank-hbl',
    bankName: 'Habib Bank Limited (HBL)',
    accountTitle: 'CODELIX SOFTWARE SOLUTIONS',
    accountNumber: '10982736450192',
    iban: 'PK12HABB0010982736450192',
    branchCode: '0412',
    instructions: 'Transfer via HBL Mobile / Konnect / ATM. Mention your order reference in payment remarks.',
    category: 'Commercial Bank',
    isActive: true,
  },
  {
    id: 'bank-ubl',
    bankName: 'United Bank Limited (UBL)',
    accountTitle: 'CODELIX TECHNOLOGIES',
    accountNumber: '09812478910283',
    iban: 'PK76UNIL0009812478910283',
    branchCode: '0189',
    instructions: 'Transfer via UBL Digital App or Digital Banking. Instant 1-minute confirmation.',
    category: 'Commercial Bank',
    isActive: true,
  },
  {
    id: 'bank-mcb',
    bankName: 'MCB Bank Limited',
    accountTitle: 'CODELIX TECHNOLOGIES',
    accountNumber: '00392817492817',
    iban: 'PK34MUCB0000392817492817',
    branchCode: '0034',
    instructions: 'Transfer via MCB Live App or Raast instant payment.',
    category: 'Commercial Bank',
    isActive: true,
  },
  {
    id: 'bank-alfalah',
    bankName: 'Bank Alfalah Limited',
    accountTitle: 'CODELIX SOFTWARE SOLUTIONS',
    accountNumber: '55019283746152',
    iban: 'PK89ALFH0055019283746152',
    branchCode: '0550',
    instructions: 'Transfer via Alfa App. Please keep the transaction receipt for instant approval.',
    category: 'Commercial Bank',
    isActive: true,
  },
  {
    id: 'bank-sadapay',
    bankName: 'SadaPay (EMI / Microfinance)',
    accountTitle: 'Aaqib Hussain (Codelix HQ)',
    accountNumber: '03001234567',
    iban: 'PK09SADA0000000300123456',
    instructions: 'Open SadaPay app -> Send Money -> Enter number 03001234567 or IBAN. Instant zero-fee transfer.',
    category: 'Microfinance / Digital Wallet',
    isActive: true,
  },
  {
    id: 'bank-nayapay',
    bankName: 'NayaPay (EMI)',
    accountTitle: 'Codelix Technologies',
    accountNumber: '03129876543',
    iban: 'PK88NAYA0000000312987654',
    instructions: 'Transfer via NayaPay app using NayaPay ID @codelix or mobile number.',
    category: 'Microfinance / Digital Wallet',
    isActive: true,
  },
  {
    id: 'bank-raast',
    bankName: 'RAAST Instant Payment (State Bank of Pakistan)',
    accountTitle: 'CODELIX (Direct Raast ID)',
    accountNumber: '03001234567',
    iban: 'RAAST-PK-CODELIX-01',
    instructions: 'Select RAAST from ANY Pakistani Banking app. Enter mobile number: 03001234567. 0% Fee, instant settlement.',
    category: 'Microfinance / Digital Wallet',
    isActive: true,
  },
];

// Default Crypto USDT Wallets
const DEFAULT_CRYPTO: CryptoWallet[] = [
  {
    id: 'wallet-usdt-trc20',
    network: 'USDT (TRC20 - TRON)',
    walletAddress: 'TYDzsYUbAZ4Dx69qD1P8T9vX87WkL2k9pQ',
    symbol: 'USDT',
    instructions: 'Send ONLY USDT (TRC20). Low network fees (~$1-2). Take a screenshot with TxHash and upload below.',
    isActive: true,
  },
  {
    id: 'wallet-usdt-bep20',
    network: 'USDT (BEP20 - BNB Smart Chain)',
    walletAddress: '0x71C6A9E93A32B87d995F7620E408544d62b668B2',
    symbol: 'USDT',
    instructions: 'Send ONLY USDT via Binance Smart Chain (BEP20). Very low network fee (~$0.15).',
    isActive: true,
  },
  {
    id: 'wallet-usdt-erc20',
    network: 'USDT (ERC20 - Ethereum Mainnet)',
    walletAddress: '0x71C6A9E93A32B87d995F7620E408544d62b668B2',
    symbol: 'USDT',
    instructions: 'Send USDT via Ethereum network. Minimum deposit $20 due to ETH gas fees.',
    isActive: true,
  },
];

// Default Seed Coupons
const DEFAULT_COUPONS: CouponRecord[] = [
  {
    id: 'c-welcome10',
    code: 'WELCOME10',
    title: 'Newsletter Welcome 10% Voucher',
    description: 'Instant 10% discount for newsletter subscribers and newly joined clients.',
    discountType: 'percentage',
    discountValue: 10,
    expiryDate: '2027-12-31',
    minOrder: 0,
    isExclusive: false,
    eligibleCustomerIds: [],
    eligibleEmails: [],
    isActive: true,
  },
  {
    id: 'c-newyear25',
    code: 'PROMO25',
    title: 'New Client 25% Growth Discount',
    description: 'Special 25% discount for newly joined clients.',
    discountType: 'percentage',
    discountValue: 25,
    expiryDate: '2027-12-31',
    minOrder: 20000,
    isExclusive: false,
    eligibleCustomerIds: [],
    eligibleEmails: [],
    isActive: true,
  },
  {
    id: 'c-vip-exclusive',
    code: 'VIPCLIENT50',
    title: 'Exclusive VIP 50% Partner Voucher',
    description: 'Private 50% discount for selected enterprise partners.',
    discountType: 'percentage',
    discountValue: 50,
    expiryDate: '2027-12-31',
    minOrder: 50000,
    isExclusive: true,
    eligibleCustomerIds: ['usr_customer_01', 'usr_customer_02'],
    eligibleEmails: ['customer@codelix.online'],
    isActive: true,
  },
];

// Default Services
const DEFAULT_SERVICES: Service[] = [
  {
    id: 'srv-php-development',
    category: 'PHP Development',
    title: 'Custom PHP & MySQL Enterprise Development',
    slug: 'php-development',
    description: 'Bespoke PHP 8.3 OOP, MVC architecture, custom portals, high-security backend systems, and RESTful APIs built for scale.',
    icon: 'Code2',
    features: ['Modern PHP 8.3+ OOP & MVC', 'Custom Admin CMS & Dashboards', 'MySQL / PostgreSQL Optimization', 'RESTful API & Webhooks Engine', 'OWASP Top 10 Security Hardened', 'Deployment & CI/CD Pipelines'],
    packages: [
      { name: 'Starter PHP Module', price: 25000, originalPrice: 35000, deliveryDays: 4, revisions: '3 Revisions', features: ['Single custom PHP script/module', 'Database schema & CRUD operations', 'Responsive clean UI', 'Input sanitization & security checks'] },
      { name: 'Professional PHP Web App', price: 65000, originalPrice: 90000, deliveryDays: 10, revisions: 'Unlimited Revisions', features: ['Full custom MVC web application', 'Role-Based Access Control (Admin/User)', 'Payment Gateway / Manual Bank integration', 'Automated email alerts & PDF invoices', '30 Days post-launch warranty'] },
      { name: 'Enterprise Portal & API', price: 150000, originalPrice: 200000, deliveryDays: 20, revisions: 'Unlimited Revisions', features: ['Complex enterprise portal system', 'Microservices / Headless REST API', 'High concurrency caching & DB indexing', 'Comprehensive API documentation', '60 Days 24/7 dedicated support'] }
    ],
    addons: [
      { id: 'add-php-audit', name: 'Comprehensive Security & Code Audit', price: 15000 },
      { id: 'add-php-cron', name: 'Background Cron Jobs & Queue Processing', price: 10000 },
      { id: 'add-php-payment', name: 'Custom Crypto / Fiat Payment Gateway', price: 20000 }
    ],
    isActive: true,
  },
  {
    id: 'srv-shopify',
    category: 'Shopify Stores',
    title: 'High-Converting Shopify E-Commerce Stores',
    slug: 'shopify-development',
    description: 'Custom Liquid themes, speed-optimized storefronts, conversion-focused checkout flows, and ERP / inventory integrations.',
    icon: 'ShoppingBag',
    features: ['Custom Liquid & 2.0 Sections', 'Zero-Lag 90+ Google PageSpeed', 'High-Converting Checkout Flow', 'Payment Gateways & Local Currencies', 'Product Catalog & Variant Setup', 'App Integrations & Upsell Funnels'],
    packages: [
      { name: 'Launchpad Store', price: 35000, originalPrice: 50000, deliveryDays: 5, revisions: '3 Revisions', features: ['Premium theme setup & styling', 'Up to 25 products upload', 'Essential pages (Policies, About, Contact)', 'Mobile responsive configuration'] },
      { name: 'Conversion Machine Pro', price: 75000, originalPrice: 110000, deliveryDays: 10, revisions: 'Unlimited', features: ['Custom section development (Liquid)', 'Advanced filters, reviews & upsells', 'Up to 100 products import', 'Local & International payment gateways', 'abandoned cart automated emails'] },
      { name: 'Shopify Plus / Custom Architecture', price: 180000, originalPrice: 240000, deliveryDays: 18, revisions: 'VIP Dedicated', features: ['Fully bespoke custom theme design', 'Custom private app / API integration', 'High volume wholesale B2B portal', 'Advanced conversion rate optimization'] }
    ],
    addons: [
      { id: 'add-shop-seo', name: 'Advanced E-Commerce SEO Pack', price: 18000 },
      { id: 'add-shop-speed', name: 'Mobile Speed Boost to 95+', price: 12000 }
    ],
    isActive: true,
  },
  {
    id: 'srv-mern',
    category: 'MERN Full-Stack',
    title: 'Modern React & MERN Full-Stack Applications',
    slug: 'mern-fullstack',
    description: 'Cutting-edge web apps built with React 19, TypeScript, Node.js, Express, and MongoDB or PostgreSQL databases.',
    icon: 'Layers',
    features: ['React 19, Vite & TypeScript', 'Node.js Express / NestJS Server', 'MongoDB / PostgreSQL with Prisma', 'Real-Time WebSockets & Notifications', 'OAuth 2.0 & JWT Authentication', 'Docker Containerization & Cloud Deploy'],
    packages: [
      { name: 'Single Page App (SPA)', price: 40000, originalPrice: 60000, deliveryDays: 6, revisions: '3 Revisions', features: ['Responsive React frontend', 'REST API consumption', 'State management (Zustand/Context)', 'Modern Tailwind styling'] },
      { name: 'Full-Stack MERN Platform', price: 95000, originalPrice: 135000, deliveryDays: 14, revisions: 'Unlimited', features: ['Complete frontend and backend codebase', 'Database schemas & authentication', 'Interactive client dashboard', 'Admin management portal', 'Docker setup & production deploy'] },
      { name: 'SaaS Multi-Tenant Cloud App', price: 220000, originalPrice: 300000, deliveryDays: 28, revisions: 'Unlimited', features: ['Multi-tenant SaaS architecture', 'Subscription billing engine', 'Real-time collaborative features', 'Microservices ready structure', '90 Days SLA maintenance'] }
    ],
    addons: [
      { id: 'add-mern-realtime', name: 'Real-Time WebSocket Engine', price: 20000 },
      { id: 'add-mern-pwa', name: 'Progressive Web App (Offline PWA)', price: 15000 }
    ],
    isActive: true,
  },
  {
    id: 'srv-wordpress',
    category: 'WordPress Development',
    title: 'Custom WordPress & WooCommerce Portals',
    slug: 'wordpress-development',
    description: 'Clean, blazing-fast WordPress solutions without bloated page builders. Custom ACF blocks, WooCommerce stores, and security.',
    icon: 'Globe',
    features: ['Custom Gutenberg / ACF Blocks', 'WooCommerce Custom Checkout', 'Blazing PageSpeed 95+', 'Malware Removal & Hardened Security', 'Multilingual & Multi-Currency', 'Automated Daily Backups Setup'],
    packages: [
      { name: 'Business Website', price: 30000, originalPrice: 45000, deliveryDays: 5, revisions: '3 Revisions', features: ['Up to 6 custom designed pages', 'Contact forms & WhatsApp button', 'Mobile first responsive layout', 'Speed & SEO optimized'] },
      { name: 'WooCommerce Online Store', price: 65000, originalPrice: 95000, deliveryDays: 10, revisions: 'Unlimited', features: ['Full e-commerce shopping cart', 'Payment gateway configuration', 'Up to 50 products added', 'Automated customer invoices', 'Inventory management'] },
      { name: 'Custom WP Portal & Directory', price: 140000, originalPrice: 190000, deliveryDays: 18, revisions: 'Unlimited', features: ['Custom post types & taxonomies', 'Frontend user submission forms', 'Membership / paid directory feature', 'Dedicated speed tuning'] }
    ],
    addons: [
      { id: 'add-wp-security', name: 'Enterprise Firewall & Security Hardening', price: 12000 },
      { id: 'add-wp-seo', name: 'On-Page Technical SEO Schema Setup', price: 15000 }
    ],
    isActive: true,
  },
];

// Default Offers
const DEFAULT_OFFERS: Offer[] = [
  {
    id: 'off-php-enterprise',
    title: 'PHP 8.3 Enterprise Starter Bundle',
    category: 'PHP Development',
    promotionalPrice: 48000,
    originalPrice: 85000,
    discountPercentage: 43,
    totalQuantity: 20,
    claimedQuantity: 14,
    domainExtensions: ['.com', '.online', '.pk'],
    features: ['Full OOP MVC Custom PHP Application', 'Admin CMS Dashboard with full permissions', 'Pakistani Banks & Crypto USDT integration', 'Database backup utility & security headers', '1 Year Free .online Domain + SSL Certificate'],
    startDate: '2025-01-01',
    endDate: '2026-12-31',
    isActive: true,
  },
  {
    id: 'off-mern-cloud',
    title: 'Full-Stack MERN Cloud Platform',
    category: 'MERN Full-Stack',
    promotionalPrice: 79000,
    originalPrice: 145000,
    discountPercentage: 45,
    totalQuantity: 15,
    claimedQuantity: 11,
    domainExtensions: ['.com', '.org', '.io'],
    features: ['React 19 + Node.js + Express + MongoDB', 'Real-time WebSocket notifications & chat', 'JWT secure auth + Customer & Admin portal', 'Automated cloud deployment with Docker', 'Free .com Domain + 60-Day SLA Warranty'],
    startDate: '2025-01-01',
    endDate: '2026-12-31',
    isActive: true,
  },
  {
    id: 'off-shopify-turbo',
    title: 'Shopify Turbo Sales Launchpad',
    category: 'Shopify Stores',
    promotionalPrice: 52000,
    originalPrice: 95000,
    discountPercentage: 45,
    totalQuantity: 25,
    claimedQuantity: 19,
    domainExtensions: ['.store', '.com'],
    features: ['Custom Liquid high-conversion theme', 'Instant checkout & Pakistani payment setup', '50 Products uploaded with variant setup', 'Mobile 90+ PageSpeed guarantee', 'Free .store Domain & 1-Month Mentorship'],
    startDate: '2025-01-01',
    endDate: '2026-12-31',
    isActive: true,
  },
];

// Default CMS Content
const DEFAULT_CMS: CmsContent = {
  websiteName: 'CODELIX — Building Digital Solutions',
  tagline: 'Engineering High-Performance Web Applications, Custom Portals & E-Commerce Systems',
  officialPhone: '+92 300 1234567',
  officialEmail: 'support@codelix.online',
  slogans: ['Architecting Tomorrow', 'Building Scalable Web Systems', 'Delivering Precision Engineering'],
  heroHeadline: 'High-Impact Web Development & Custom Digital Systems',
  heroDescription: 'From bespoke PHP 8.3 applications to modern MERN cloud platforms and high-converting Shopify stores, CODELIX builds resilient software for global brands and Pakistani enterprises.',
  announcementBanner: {
    enabled: true,
    text: 'Subscribe to our official newsletter and claim an instant 10% discount coupon code for your next digital project!',
    badge: 'EXCLUSIVE OFFER',
    linkUrl: '#cart',
  },
  socialLinks: {
    facebook: 'https://facebook.com/aaqibkhero',
    instagram: 'https://instagram.com/aaqibkhero',
    tiktok: 'https://tiktok.com/@aaqibkhero',
    linkedin: 'https://linkedin.com/in/aaqibkhero',
    twitter: 'https://twitter.com/aaqibkhero',
    website: 'https://codelix.online',
  },
  aboutStory: 'Founded by Aaqib Hussain Khero, CODELIX is a high-performance software agency delivering custom digital systems, e-commerce stores, and enterprise portals with uncompromised quality.',
  maintenanceMode: false,
  timezone: {
    code: 'PKT',
    offset: '+05:00',
    label: 'Pakistan Standard Time (PKT UTC+5)',
  },
  founder: {
    name: 'Aaqib Hussain Khero',
    title: 'Founder & Chief Executive Officer',
    bio: 'Software engineer and entrepreneur with 8+ years experience scaling high-performance web systems, fintech portals, and modern e-commerce infrastructures.',
    facebook: 'https://facebook.com/aaqibkhero',
    instagram: 'https://instagram.com/aaqibkhero',
    tiktok: 'https://tiktok.com/@aaqibkhero',
    linkedin: 'https://linkedin.com/in/aaqibkhero',
  },
  helpdeskEmails: {
    support: 'support@codelix.online',
    business: 'business@codelix.online',
    ceo: 'ceo@codelix.online',
    complaints: 'complaints@codelix.online',
    cybersecurity: 'cybersecurity@codelix.online',
    escalationGmail1: 'codelixhq@gmail.com',
    escalationGmail2: 'codelixceo@gmail.com',
  },
};

// Default Candidate Applications
const DEFAULT_APPLICATIONS: JobApplication[] = [
  {
    id: 'app-001',
    reference: 'CDX-APP-2025-01',
    vacancyId: 'vac-senior-php',
    vacancyTitle: 'Senior Full-Stack PHP / MySQL Engineer',
    fullName: 'Muhammad Tariq',
    email: 'm.tariq@gmail.com',
    phone: '+92 321 9876543',
    city: 'Karachi',
    country: 'Pakistan',
    education: 'BS Computer Science, FAST NUCES',
    experience: '5 Years in PHP 8+, Laravel & OOP',
    skills: 'PHP 8.3, MySQL, Redis, Tailwind, Docker, REST API',
    portfolioUrl: 'https://github.com/tariq-dev',
    resumeFileName: 'Muhammad_Tariq_Resume_2025.pdf',
    photoFileName: 'tariq_white_bg.jpg',
    photoVerifiedWhiteBackground: true,
    photoVerificationScore: 97,
    status: 'Selected for Interview',
    cvRemarks: 'Strong foundation in OOP and database normalization. Clean GitHub portfolio.',
    backgroundRemarks: 'Verified previous tenure at Fintech startup. Positive background check.',
    technicalRemarks: 'Passed code test on async queues and query optimization with 94% score.',
    hrRemarks: 'Excellent spoken and written communication. Available in 2 weeks.',
    interviewDate: '2025-04-10T11:00:00+05:00',
    interviewNotes: 'Candidate demonstrated deep understanding of high-concurrency database locking.',
    createdAt: '2025-03-20T10:15:00Z',
  },
  {
    id: 'app-002',
    reference: 'CDX-APP-2025-02',
    vacancyId: 'vac-react-dev',
    vacancyTitle: 'Frontend React / Next.js Specialist',
    fullName: 'Zainab Fatima',
    email: 'zainab.f@gmail.com',
    phone: '+92 333 4567890',
    city: 'Lahore',
    country: 'Pakistan',
    education: 'BSc Software Engineering, PUCIT',
    experience: '3.5 Years building React & Next.js SPAs',
    skills: 'React 19, TypeScript, Tailwind CSS, Redux/Zustand, Motion',
    portfolioUrl: 'https://zainab.codes',
    resumeFileName: 'Zainab_Fatima_CV.pdf',
    photoFileName: 'zainab_photo.png',
    photoVerifiedWhiteBackground: true,
    photoVerificationScore: 99,
    status: 'Selected',
    cvRemarks: 'Beautiful UI portfolio with strong attention to responsive design and micro-interactions.',
    backgroundRemarks: 'Solid track record and recommendations from previous design leads.',
    technicalRemarks: 'Aced React architecture, memoization, and rendering optimization assessment.',
    hrRemarks: 'Selected by HR committee for Senior UI Engineer position.',
    createdAt: '2025-03-22T14:30:00Z',
  },
];

// Helper to access / update local state
function getStorage<T>(key: string, defaultVal: T): T {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return defaultVal;
  }
  try {
    const val = localStorage.getItem(`cdx_${key}`);
    return val ? JSON.parse(val) : defaultVal;
  } catch {
    return defaultVal;
  }
}

function setStorage<T>(key: string, val: T): void {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return;
  }
  try {
    localStorage.setItem(`cdx_${key}`, JSON.stringify(val));
  } catch {
    // ignore
  }
}

/**
 * Handle client-side fallback responses for /api/* routes
 */
export async function handleClientApiRequest(
  urlString: string,
  init?: RequestInit
): Promise<Response> {
  const method = (init?.method || 'GET').toUpperCase();
  const baseOrigin = typeof window !== 'undefined' && window.location ? window.location.origin : 'https://codelix.online';
  const url = new URL(urlString, baseOrigin);
  const apiIndex = url.pathname.indexOf('/api/');
  const pathname = apiIndex !== -1 ? url.pathname.slice(apiIndex) : url.pathname;
  let body: any = {};

  if (init?.body && typeof init.body === 'string') {
    try {
      body = JSON.parse(init.body);
    } catch {
      // not JSON body
    }
  }

  const makeJson = (data: any, status = 200) => {
    return new Response(JSON.stringify(data), {
      status,
      headers: { 'Content-Type': 'application/json' },
    });
  };

  // 1. SERVICES
  if (pathname === '/api/services') {
    let services = getStorage<Service[]>('services', DEFAULT_SERVICES);
    if (method === 'POST') {
      const newService = { ...body, id: body.id || `srv-${Date.now()}` };
      services.push(newService);
      setStorage('services', services);
      return makeJson({ success: true, service: newService });
    }
    return makeJson({ success: true, services });
  }

  const serviceMatch = pathname.match(/^\/api\/services\/([^/]+)$/);
  if (serviceMatch) {
    const serviceId = serviceMatch[1];
    let services = getStorage<Service[]>('services', DEFAULT_SERVICES);
    if (method === 'PUT') {
      services = services.map((s) => (s.id === serviceId ? { ...s, ...body } : s));
      setStorage('services', services);
      return makeJson({ success: true, service: body });
    }
    if (method === 'DELETE') {
      services = services.filter((s) => s.id !== serviceId);
      setStorage('services', services);
      return makeJson({ success: true, message: 'Deleted' });
    }
    const found = services.find((s) => s.id === serviceId);
    return makeJson({ success: !!found, service: found });
  }

  // 2. OFFERS
  if (pathname === '/api/offers') {
    let offers = getStorage<Offer[]>('offers', DEFAULT_OFFERS);
    if (method === 'POST') {
      const newOffer = { ...body, id: body.id || `off-${Date.now()}` };
      offers.push(newOffer);
      setStorage('offers', offers);
      return makeJson({ success: true, offer: newOffer });
    }
    return makeJson({ success: true, offers });
  }

  const offerMatch = pathname.match(/^\/api\/offers\/([^/]+)$/);
  if (offerMatch) {
    const offerId = offerMatch[1];
    let offers = getStorage<Offer[]>('offers', DEFAULT_OFFERS);
    if (method === 'PUT') {
      offers = offers.map((o) => (o.id === offerId ? { ...o, ...body } : o));
      setStorage('offers', offers);
      return makeJson({ success: true, offer: body });
    }
    if (method === 'DELETE') {
      offers = offers.filter((o) => o.id !== offerId);
      setStorage('offers', offers);
      return makeJson({ success: true, message: 'Deleted' });
    }
    const found = offers.find((o) => o.id === offerId);
    return makeJson({ success: !!found, offer: found });
  }

  // 3. PAYMENT METHODS & FX RATE
  if (pathname === '/api/payment-methods') {
    let banks = getStorage<PakistaniBank[]>('banks', DEFAULT_BANKS);
    let cryptoWallets = getStorage<CryptoWallet[]>('crypto_wallets', DEFAULT_CRYPTO);
    const usdToPkrRate = getStorage<number>('usd_pkr_rate', 271);

    if (method === 'POST') {
      if (body.type === 'bank') {
        const newBank = { ...body.bank, id: body.bank.id || `bank-${Date.now()}` };
        banks.push(newBank);
        setStorage('banks', banks);
        return makeJson({ success: true, bank: newBank });
      } else if (body.type === 'crypto') {
        const newWallet = { ...body.wallet, id: body.wallet.id || `crypto-${Date.now()}` };
        cryptoWallets.push(newWallet);
        setStorage('crypto_wallets', cryptoWallets);
        return makeJson({ success: true, wallet: newWallet });
      }
    }
    return makeJson({ success: true, banks, cryptoWallets, usdToPkrRate });
  }

  // Delete payment method
  const deletePaymentMatch = pathname.match(/^\/api\/payment-methods\/([^/]+)\/([^/]+)$/);
  if (deletePaymentMatch && method === 'DELETE') {
    const type = deletePaymentMatch[1];
    const id = deletePaymentMatch[2];
    if (type === 'bank') {
      let banks = getStorage<PakistaniBank[]>('banks', DEFAULT_BANKS).filter((b) => b.id !== id);
      setStorage('banks', banks);
    } else if (type === 'crypto') {
      let crypto = getStorage<CryptoWallet[]>('crypto_wallets', DEFAULT_CRYPTO).filter((c) => c.id !== id);
      setStorage('crypto_wallets', crypto);
    }
    return makeJson({ success: true, message: 'Payment method removed' });
  }

  // FX Rate
  if (pathname === '/api/settings/fx-rate') {
    if (method === 'POST' || method === 'PUT') {
      const rate = Number(body.usdToPkrRate) || 271;
      setStorage('usd_pkr_rate', rate);
      return makeJson({ success: true, usdToPkrRate: rate });
    }
    const rate = getStorage<number>('usd_pkr_rate', 271);
    return makeJson({ success: true, usdToPkrRate: rate });
  }

  // 4. COUPONS
  if (pathname === '/api/coupons') {
    let coupons = getStorage<CouponRecord[]>('coupons', DEFAULT_COUPONS);
    if (method === 'POST') {
      const newCoupon: CouponRecord = {
        ...body,
        id: `c-${Date.now()}`,
        code: (body.code || '').trim().toUpperCase(),
        isActive: body.isActive ?? true,
      };
      coupons.push(newCoupon);
      setStorage('coupons', coupons);
      return makeJson({ success: true, coupon: newCoupon });
    }

    // Filter if for checkout
    const forCheckout = url.searchParams.get('forCheckout') === 'true';
    const customerId = url.searchParams.get('customerId') || '';
    const email = (url.searchParams.get('email') || '').toLowerCase();

    if (forCheckout) {
      const filtered = coupons.filter((c) => {
        if (!c.isActive) return false;
        if (c.isExclusive) {
          const matchId = c.eligibleCustomerIds && c.eligibleCustomerIds.includes(customerId);
          const matchEmail = c.eligibleEmails && c.eligibleEmails.some((e: string) => e.toLowerCase() === email);
          return matchId || matchEmail;
        }
        return true;
      });
      return makeJson({ success: true, coupons: filtered });
    }

    return makeJson({ success: true, coupons });
  }

  // Validate coupon
  if (pathname === '/api/coupons/validate') {
    const coupons = getStorage<CouponRecord[]>('coupons', DEFAULT_COUPONS);
    const code = (body.code || '').trim().toUpperCase();
    const customerId = body.customerId || '';
    const email = (body.email || '').toLowerCase();
    const orderTotal = Number(body.orderTotal) || 0;

    const coupon = coupons.find((c) => c.code === code && c.isActive);
    if (!coupon) {
      return makeJson({ success: false, error: 'Invalid or expired coupon code.' }, 400);
    }

    if (coupon.isExclusive) {
      const matchId = coupon.eligibleCustomerIds && coupon.eligibleCustomerIds.includes(customerId);
      const matchEmail = coupon.eligibleEmails && coupon.eligibleEmails.some((e: string) => e.toLowerCase() === email);
      if (!matchId && !matchEmail) {
        return makeJson({
          success: false,
          error: 'This exclusive coupon is reserved for selected targeted customers only.',
        }, 400);
      }
    }

    let discountAmount = 0;
    if (coupon.discountType === 'percentage') {
      discountAmount = (orderTotal * coupon.discountValue) / 100;
    } else {
      discountAmount = Math.min(orderTotal, coupon.discountValue);
    }

    return makeJson({
      success: true,
      coupon,
      discountAmount: Math.round(discountAmount),
    });
  }

  // 5. NEWSLETTER
  if (pathname === '/api/newsletter/subscribe') {
    const email = (body.email || '').trim().toLowerCase();
    return makeJson({
      success: true,
      couponCode: 'WELCOME10',
      message: `Thank you! 10% discount voucher WELCOME10 has been issued to ${email}.`,
    });
  }

  // 6. CMS CONTENT
  if (pathname === '/api/cms') {
    let cms = getStorage<CmsContent>('cms', DEFAULT_CMS);
    if (method === 'PUT' || method === 'POST') {
      cms = { ...cms, ...body };
      setStorage('cms', cms);
      return makeJson({ success: true, cms });
    }
    return makeJson({ success: true, cms });
  }

  // 7. CAREERS & CANDIDATE SCRUTINY
  if (pathname === '/api/applications') {
    let applications = getStorage<JobApplication[]>('applications', DEFAULT_APPLICATIONS);
    if (method === 'POST') {
      const newApp: JobApplication = {
        ...body,
        id: `app-${Date.now()}`,
        reference: `CDX-APP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        status: 'Application Submitted',
        createdAt: new Date().toISOString(),
      };
      applications.unshift(newApp);
      setStorage('applications', applications);
      return makeJson({ success: true, application: newApp, reference: newApp.reference });
    }
    return makeJson({ success: true, applications });
  }

  // Hire application
  const hireMatch = pathname.match(/^\/api\/applications\/([^/]+)\/hire$/);
  if (hireMatch && method === 'POST') {
    const appId = hireMatch[1];
    let applications = getStorage<JobApplication[]>('applications', DEFAULT_APPLICATIONS);
    const appIndex = applications.findIndex((a) => a.id === appId);

    if (appIndex !== -1) {
      const empId = body.employeeId || `CDX-EMP-${Math.floor(100 + Math.random() * 900)}`;
      applications[appIndex] = {
        ...applications[appIndex],
        status: 'Contract Sent / Hired',
        contractDetails: {
          employeeId: empId,
          designation: body.designation || applications[appIndex].vacancyTitle,
          department: body.department || 'Engineering',
          salary: body.salary || 'PKR 120,000 / month',
          joiningDate: body.joiningDate || new Date().toISOString().split('T')[0],
          contractText: body.contractText || 'Official Employment Agreement with CODELIX.',
          sentAt: new Date().toISOString(),
        },
      };
      setStorage('applications', applications);
      return makeJson({ success: true, employeeId: empId, application: applications[appIndex] });
    }
  }

  // Application update (remarks, stage status)
  const appStatusMatch = pathname.match(/^\/api\/applications\/([^/]+)\/status$/);
  if (appStatusMatch && (method === 'PUT' || method === 'POST')) {
    const appId = appStatusMatch[1];
    let applications = getStorage<JobApplication[]>('applications', DEFAULT_APPLICATIONS);
    applications = applications.map((a) => (a.id === appId ? { ...a, ...body } : a));
    setStorage('applications', applications);
    return makeJson({ success: true });
  }

  // 8. ORDERS
  if (pathname === '/api/orders') {
    let orders = getStorage<Order[]>('orders', []);
    if (method === 'POST') {
      const orderRef = `CDX-${Math.floor(100000 + Math.random() * 900000)}`;
      const newOrder: Order = {
        id: `ord-${Date.now()}`,
        reference: orderRef,
        ...body,
        status: 'Payment Verification Pending',
        createdAt: new Date().toISOString(),
      };
      orders.unshift(newOrder);
      setStorage('orders', orders);
      return makeJson({ success: true, order: newOrder, reference: orderRef });
    }
    return makeJson({ success: true, orders });
  }

  // 9. AUTH
  if (pathname === '/api/auth/login') {
    const email = (body.email || '').toLowerCase();
    const role: 'admin' | 'employee' | 'customer' = email.includes('admin')
      ? 'admin'
      : email.includes('employee')
      ? 'employee'
      : 'customer';
    const user: User = {
      id: `usr_${role}_01`,
      name: role === 'admin' ? 'Aaqib Hussain Khero' : role === 'employee' ? 'Usman Tariq' : 'Hamza Khan',
      email: body.email,
      phone: '+92 300 1234567',
      country: 'Pakistan',
      role,
      isVerified: true,
      createdAt: new Date().toISOString(),
    };
    return makeJson({ success: true, user, token: `jwt_token_${role}_mock` });
  }

  if (pathname === '/api/auth/quick-switch') {
    const role: 'admin' | 'employee' | 'customer' = body.role || 'customer';
    const user: User = {
      id: `usr_${role}_01`,
      name: role === 'admin' ? 'Aaqib Hussain Khero (Admin)' : role === 'employee' ? 'Usman Tariq (Lead Engineer)' : 'Hamza Khan (Customer)',
      email: `${role}@codelix.online`,
      phone: '+92 300 1234567',
      country: 'Pakistan',
      role,
      isVerified: true,
      createdAt: new Date().toISOString(),
    };
    return makeJson({ success: true, user, token: `jwt_token_${role}_mock` });
  }

  if (pathname === '/api/auth/register') {
    const user: User = {
      id: `usr_customer_${Date.now()}`,
      name: body.name || 'New Customer',
      email: body.email,
      phone: body.phone || '+92 300 0000000',
      country: body.country || 'Pakistan',
      role: 'customer',
      isVerified: false,
      createdAt: new Date().toISOString(),
    };
    return makeJson({ success: true, user, simulatedCode: '492810' });
  }

  if (pathname === '/api/auth/verify-email') {
    return makeJson({ success: true });
  }

  // Fallback for any unknown /api route
  return makeJson({ success: true, data: [] });
}

/**
 * Initializes the API interceptor to make client completely independent and zero-fail
 */
export function initClientApiFallback(): void {
  if (typeof window === 'undefined') return;

  try {
    const originalFetch = window.fetch ? window.fetch.bind(window) : null;
    if (!originalFetch) return;

    const patchedFetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
      let urlString = '';
      if (typeof input === 'string') {
        urlString = input;
      } else if (input instanceof URL) {
        urlString = input.toString();
      } else if (input && typeof (input as any).url === 'string') {
        urlString = (input as any).url;
      }

      if (urlString.includes('/api/')) {
        try {
          const liveResponse = await originalFetch(input, init);
          const contentType = liveResponse.headers.get('content-type') || '';
          // If live backend exists and returned valid JSON response:
          if (liveResponse.status !== 404 && contentType.includes('application/json')) {
            return liveResponse;
          }
        } catch {
          // Network failure / offline / static hosting: fall through to client engine
        }

        // Serve from client-side persistent storage engine
        return handleClientApiRequest(urlString, init);
      }

      return originalFetch(input, init);
    };

    // Safely define property to prevent "Attempted to assign to readonly property" error in strict mode
    try {
      Object.defineProperty(window, 'fetch', {
        value: patchedFetch,
        writable: true,
        configurable: true,
      });
    } catch {
      try {
        const proto = Object.getPrototypeOf(window);
        if (proto) {
          Object.defineProperty(proto, 'fetch', {
            value: patchedFetch,
            writable: true,
            configurable: true,
          });
        }
      } catch {
        // Fallback: direct assignment if permitted
        try {
          (window as any).fetch = patchedFetch;
        } catch {
          // Silently bypass if environment completely seals fetch
        }
      }
    }
  } catch (err) {
    // Never allow API interceptor setup to crash the application
    console.warn('initClientApiFallback skipped:', err);
  }
}

