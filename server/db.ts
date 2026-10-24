/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * CODELIX Database & State Persistence Engine
 * Extended with Pakistani Banks, Crypto USDT conversion, Coupons, Scrutiny & Founder settings
 */

import fs from 'fs';
import path from 'path';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  role: 'customer' | 'employee' | 'admin';
  passwordHash: string;
  isVerified: boolean;
  verificationCode?: string;
  verificationExpires?: number;
  resetToken?: string;
  resetExpires?: number;
  createdAt: string;
}

export interface Service {
  id: string;
  category: string;
  title: string;
  slug: string;
  description: string;
  icon: string;
  features: string[];
  packages: Array<{
    name: string;
    price: number;
    originalPrice?: number;
    deliveryDays: number;
    revisions: string;
    features: string[];
  }>;
  addons: Array<{
    id: string;
    name: string;
    price: number;
  }>;
  isActive: boolean;
}

export interface Offer {
  id: string;
  title: string;
  category: string;
  promotionalPrice: number;
  originalPrice: number;
  discountPercentage: number;
  totalQuantity: number;
  claimedQuantity: number;
  domainExtensions: string[];
  features: string[];
  disclaimer?: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface PakistaniBank {
  id: string;
  bankName: string;
  accountTitle: string;
  accountNumber: string;
  iban: string;
  branchCode?: string;
  instructions: string;
  category: 'Commercial Bank' | 'Islamic Bank' | 'Microfinance / Digital Wallet';
  isActive: boolean;
}

export interface CryptoWallet {
  id: string;
  symbol: string; // e.g. USDT, BTC, ETH
  network: string; // TRC20, ERC20, BEP20, etc.
  walletAddress: string;
  qrCodeUrl?: string;
  instructions: string;
  isActive: boolean;
}

export interface CouponRecord {
  id: string;
  code: string;
  title: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrder?: number;
  expiryDate: string;
  isExclusive: boolean;
  eligibleCustomerIds: string[];
  eligibleEmails: string[];
  isActive: boolean;
}

export interface Order {
  id: string;
  reference: string; // CDX-ORD-2026-000101
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: Array<{
    serviceId: string;
    serviceTitle: string;
    packageName: string;
    price: number;
    addons?: Array<{ name: string; price: number }>;
    quantity: number;
  }>;
  subtotal: number;
  discount: number;
  total: number;
  currency: string; // PKR
  amountInUsd?: number;
  exchangeRateUsed?: number; // 271
  paymentMethodType?: 'bank' | 'crypto' | 'digital_wallet';
  selectedBankName?: string;
  selectedCryptoNetwork?: string;
  transactionId?: string;
  paymentProofScreenshot?: string;
  status:
    | 'Pending Review'
    | 'Confirmed'
    | 'In Progress'
    | 'Awaiting Customer Feedback'
    | 'Revision in Progress'
    | 'Completed'
    | 'Cancelled';
  paymentStatus: 'Pending' | 'Verification in Progress' | 'Verified' | 'Paid' | 'Rejected';
  paymentVerificationNotes?: string;
  customerRemarks: string;
  businessName?: string;
  websiteUrl?: string;
  preferredDeadline?: string;
  attachments?: Array<{ name: string; size: string; dataUrl?: string }>;
  assignedEmployeeId?: string;
  assignedEmployeeName?: string;
  startDate?: string;
  estimatedCompletionDate?: string;
  overallProgress: number; // 0 - 100
  milestones: Array<{
    id: string;
    title: string;
    weight: number;
    progress: number;
    completed: boolean;
  }>;
  timeline: Array<{
    id: string;
    timestamp: string;
    author: string;
    role: string;
    message: string;
    isPublic: boolean;
  }>;
  createdAt: string;
}

export interface Complaint {
  id: string;
  reference: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  orderReference?: string;
  category: string;
  subject: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  status: 'Submitted' | 'Under Review' | 'Investigation in Progress' | 'Resolution Proposed' | 'Resolved' | 'Closed';
  assignedEmployeeName?: string;
  publicNotes: Array<{ timestamp: string; author: string; message: string }>;
  internalNotes: Array<{ timestamp: string; author: string; message: string }>;
  createdAt: string;
}

export interface Quotation {
  id: string;
  reference: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  serviceCategory: string;
  description: string;
  budgetRange: string;
  preferredTimeline: string;
  referenceUrl?: string;
  status: 'Received' | 'Quotation Prepared' | 'Sent to Customer' | 'Approved' | 'Declined';
  quoteAmount?: number;
  quoteItems?: Array<{ description: string; amount: number }>;
  validUntil?: string;
  staffNotes?: string;
  createdAt: string;
}

export interface Inquiry {
  id: string;
  reference: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  category: string;
  message: string;
  status: 'New' | 'In Progress' | 'Answered' | 'Closed';
  response?: string;
  createdAt: string;
}

export interface DemoRequest {
  id: string;
  reference: string;
  name: string;
  email: string;
  phone: string;
  serviceOrProduct: string;
  preferredDate: string;
  preferredTime: string;
  timezone: string;
  notes?: string;
  status: 'Requested' | 'Confirmed' | 'Rescheduled' | 'Completed' | 'Cancelled';
  createdAt: string;
}

export interface IdeaSubmission {
  id: string;
  reference: string;
  name: string;
  email: string;
  phone: string;
  ideaTitle: string;
  targetAudience: string;
  desiredFeatures: string;
  budget: string;
  timeline: string;
  status: 'Under Review' | 'Feasibility Assessment' | 'Contacted' | 'Archived';
  evaluationNotes?: string;
  createdAt: string;
}

export interface JobVacancy {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
  experience: string;
  salaryRange: string;
  description: string;
  requirements: string[];
  skills: string[];
  positionsCount: number;
  deadline: string;
  isActive: boolean;
}

export interface JobApplication {
  id: string;
  reference: string;
  vacancyId: string;
  vacancyTitle: string;
  fullName: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  education: string;
  experience: string;
  skills: string;
  portfolioUrl?: string;
  coverLetter?: string;
  resumeFileName: string;
  photoFileName?: string;
  photoVerifiedWhiteBackground?: boolean;
  photoVerificationScore?: number;
  status:
    | 'Application Submitted'
    | 'Screening / Under Initial Review'
    | 'Shortlisted'
    | 'Selected for Interview'
    | 'Technical Round'
    | 'Operational Round'
    | 'HR Round'
    | 'Interview Completed'
    | 'Selected'
    | 'Contract Sent / Hired'
    | 'Rejected';
  cvRemarks?: string;
  backgroundRemarks?: string;
  technicalRemarks?: string;
  hrRemarks?: string;
  interviewDate?: string;
  interviewNotes?: string;
  candidateMessage?: string;
  contractDetails?: {
    employeeId: string;
    designation: string;
    department: string;
    salary: string;
    joiningDate: string;
    contractText: string;
    sentAt: string;
  };
  createdAt: string;
}

export interface Employee {
  id: string;
  employeeCode: string; // CDX-EMP-001
  fullName: string;
  designation: string;
  department: string;
  workEmail: string;
  phone: string;
  officeLocation?: string;
  employmentType: 'Full-time' | 'Part-time' | 'Contract';
  role: 'admin' | 'employee';
  assignedRoleTitle: string;
  skills: string[];
  status: 'Active' | 'On Leave' | 'Inactive';
  joiningDate: string;
}

export interface EmailLog {
  id: string;
  recipient: string;
  subject: string;
  templateType: string;
  status: 'Delivered' | 'Queued' | 'Sent via SMTP';
  timestamp: string;
  contentPreview: string;
}

export interface SmtpSettings {
  host: string;
  port: number;
  encryption: 'TLS' | 'SSL' | 'None';
  username: string;
  password?: string;
  fromName: string;
  fromEmail: string;
  replyTo: string;
  emailPrefix?: string;
  isConfigured: boolean;
}

export interface FounderInfo {
  name: string;
  title: string;
  bio: string;
  facebook: string;
  instagram: string;
  tiktok: string;
  linkedin: string;
}

export interface OfficialHelpdeskEmails {
  support: string;
  business: string;
  ceo: string;
  complaints: string;
  cybersecurity: string;
  escalationGmail1: string;
  escalationGmail2: string;
}

export interface TimezoneSettings {
  code: string;
  offset: string;
  label: string;
}

export interface CmsContent {
  websiteName: string;
  tagline: string;
  officialPhone: string;
  officialEmail: string;
  slogans: string[];
  heroHeadline: string;
  heroDescription: string;
  announcementBanner: {
    enabled: boolean;
    text: string;
    badge: string;
    linkUrl: string;
  };
  socialLinks: {
    instagram: string;
    tiktok: string;
    twitter: string;
    linkedin: string;
    website: string;
  };
  aboutStory: string;
  maintenanceMode: boolean;
  timezone: TimezoneSettings;
  founder: FounderInfo;
  helpdeskEmails: OfficialHelpdeskEmails;
}

export interface DatabaseSchema {
  users: User[];
  services: Service[];
  offers: Offer[];
  orders: Order[];
  complaints: Complaint[];
  quotations: Quotation[];
  inquiries: Inquiry[];
  demoRequests: DemoRequest[];
  ideas: IdeaSubmission[];
  vacancies: JobVacancy[];
  applications: JobApplication[];
  employees: Employee[];
  emailLogs: EmailLog[];
  smtp: SmtpSettings;
  cms: CmsContent;
  pakistaniBanks: PakistaniBank[];
  cryptoWallets: CryptoWallet[];
  usdToPkrRate: number; // e.g. 271
  coupons: CouponRecord[];
  counters: {
    order: number;
    complaint: number;
    quotation: number;
    application: number;
    inquiry: number;
    demo: number;
    idea: number;
  };
}

const DB_PATH = path.resolve(process.cwd(), 'server', 'db.json');

function seedInitialData(): DatabaseSchema {
  return {
    users: [
      {
        id: 'usr-admin-1',
        name: 'CODELIX Administrator',
        email: 'admin@codelix.online',
        phone: '+1 902 903 0717',
        country: 'Pakistan',
        role: 'admin',
        passwordHash: 'admin123',
        isVerified: true,
        createdAt: '2026-01-01T00:00:00Z',
      },
      {
        id: 'usr-emp-1',
        name: 'Zubair Ahmed',
        email: 'zubair@codelix.online',
        phone: '+1 902 903 0718',
        country: 'Pakistan',
        role: 'employee',
        passwordHash: 'employee123',
        isVerified: true,
        createdAt: '2026-01-10T00:00:00Z',
      },
      {
        id: 'usr-cust-1',
        name: 'Hamza Khan',
        email: 'hamza.client@example.com',
        phone: '+92 300 1234567',
        country: 'Pakistan',
        role: 'customer',
        passwordHash: 'client123',
        isVerified: true,
        createdAt: '2026-02-15T10:00:00Z',
      },
      {
        id: 'usr-cust-2',
        name: 'Sara Siddiqui',
        email: 'sara.fashion@example.com',
        phone: '+92 321 4455667',
        country: 'Pakistan',
        role: 'customer',
        passwordHash: 'client123',
        isVerified: true,
        createdAt: '2026-02-20T10:00:00Z',
      },
    ],
    employees: [
      {
        id: 'emp-1',
        employeeCode: 'CDX-EMP-001',
        fullName: 'Zubair Ahmed',
        designation: 'Lead Full Stack & PHP Architect',
        department: 'Engineering',
        workEmail: 'zubair@codelix.online',
        phone: '+1 902 903 0718',
        officeLocation: 'Islamabad HQ & Remote',
        employmentType: 'Full-time',
        role: 'employee',
        assignedRoleTitle: 'Senior Project Lead',
        skills: ['PHP 8.3', 'Laravel', 'MySQL', 'React', 'Docker', 'REST API'],
        status: 'Active',
        joiningDate: '2025-06-01',
      },
      {
        id: 'emp-2',
        employeeCode: 'CDX-EMP-002',
        fullName: 'Ayesha Tariq',
        designation: 'Senior UI/UX & Frontend Specialist',
        department: 'Design & Frontend',
        workEmail: 'ayesha@codelix.online',
        phone: '+1 902 903 0719',
        officeLocation: 'Lahore Branch',
        employmentType: 'Full-time',
        role: 'employee',
        assignedRoleTitle: 'UI/UX Engineer',
        skills: ['Figma', 'HTML5/CSS3', 'JavaScript ES6+', 'Tailwind CSS', 'Shopify Liquid'],
        status: 'Active',
        joiningDate: '2025-08-15',
      },
      {
        id: 'emp-3',
        employeeCode: 'CDX-EMP-003',
        fullName: 'Bilal Mustafa',
        designation: 'E-commerce & CMS Engineer',
        department: 'E-Commerce',
        workEmail: 'bilal@codelix.online',
        phone: '+1 902 903 0720',
        officeLocation: 'Karachi Hub',
        employmentType: 'Full-time',
        role: 'employee',
        assignedRoleTitle: 'Shopify & WordPress Lead',
        skills: ['Shopify', 'WooCommerce', 'WordPress', 'Payment Gateways', 'Speed Optimization'],
        status: 'Active',
        joiningDate: '2025-09-01',
      },
    ],
    services: [
      {
        id: 'srv-php',
        category: 'PHP Development',
        title: 'Custom PHP & Web Systems Development',
        slug: 'php-development',
        description: 'High-performance, secure, and object-oriented PHP 8.3+ applications with custom MVC architecture, robust MySQL databases, administrative dashboards, and API integrations.',
        icon: 'Code2',
        features: [
          'Modern PHP 8.3 OOP & MVC Architecture',
          'MySQL / MariaDB Database Architecture with PDO',
          'Custom Administration Panel & User Roles',
          'Automated SMTP Email Integration',
          'Security Hardening (CSRF, XSS, SQLi Protection)',
          'Complete Clean Source Code Delivery',
        ],
        packages: [
          {
            name: 'Basic PHP Web App',
            price: 25000,
            originalPrice: 45000,
            deliveryDays: 7,
            revisions: '3 Revisions',
            features: ['Up to 5 Dynamic Pages', 'Admin Dashboard', 'User Contact Form', 'MySQL Database', '1 Month Support'],
          },
          {
            name: 'E-commerce / Portal System',
            price: 45000,
            originalPrice: 85000,
            deliveryDays: 14,
            revisions: 'Unlimited Revisions',
            features: ['Full Product/Order Management', 'Payment Gateway Integration', 'Customer Portal & Dashboard', 'Automated Invoicing & SMTP', '3 Months Support'],
          },
          {
            name: 'Enterprise Custom Software',
            price: 90000,
            originalPrice: 160000,
            deliveryDays: 25,
            revisions: 'Unlimited Revisions',
            features: ['Multi-Role RBAC Permissions', 'Custom Reporting & Exports', 'Real-time Analytics Dashboard', 'Third-party API Integrations', '6 Months Dedicated Support'],
          },
        ],
        addons: [
          { id: 'ad-php-1', name: 'Mobile API Endpoints (REST)', price: 15000 },
          { id: 'ad-php-2', name: 'Multi-Language Localization', price: 10000 },
          { id: 'ad-php-3', name: 'Advanced Audit & Security Logging', price: 8000 },
        ],
        isActive: true,
      },
      {
        id: 'srv-frontend',
        category: 'HTML, CSS & JavaScript',
        title: 'Modern Responsive Frontend Development',
        slug: 'html-css-javascript',
        description: 'Pixel-perfect, ultra-fast, cross-browser responsive frontend user interfaces built with semantic HTML5, modern CSS3, and JavaScript ES6+.',
        icon: 'Layout',
        features: [
          'Mobile-first responsive design across all screen sizes',
          'Zero-pill clean typography & premium layout',
          'Fast loading speeds & SEO-friendly semantic markup',
          'Smooth micro-interactions and transitions',
          'Cross-browser tested on modern mobile & desktop browsers',
        ],
        packages: [
          {
            name: 'High-Converting Landing Page',
            price: 12000,
            originalPrice: 22000,
            deliveryDays: 3,
            revisions: '3 Revisions',
            features: ['Single Page Responsive Layout', 'Lead Capture Form', 'Hero Video/Animation', 'Performance Optimization'],
          },
          {
            name: 'Complete Corporate Website UI',
            price: 28000,
            originalPrice: 50000,
            deliveryDays: 7,
            revisions: '5 Revisions',
            features: ['Up to 8 Responsive Pages', 'Interactive Components', 'Modal Windows & Sliders', 'SEO Best Practices'],
          },
        ],
        addons: [
          { id: 'ad-fe-1', name: 'Dark Mode / Theme Switcher', price: 5000 },
          { id: 'ad-fe-2', name: 'Custom SVG Iconography & Illustrations', price: 6000 },
        ],
        isActive: true,
      },
      {
        id: 'srv-shopify',
        category: 'Shopify',
        title: 'Shopify Store Setup & Theme Customization',
        slug: 'shopify',
        description: 'Professional Shopify storefronts engineered for high conversions. Includes theme installation, product collections, payments, and checkout optimization.',
        icon: 'ShoppingBag',
        features: [
          'Shopify Store Configuration & Domain Binding',
          'Premium Theme Installation & Brand Customization',
          'Catalog Setup, Collections, & Variants',
          'Payment Gateway & Shipping Rate Rules',
          'Mobile Commerce Optimization',
        ],
        packages: [
          {
            name: 'Store Launch Starter',
            price: 7000,
            originalPrice: 29000,
            deliveryDays: 4,
            revisions: '3 Revisions',
            features: ['Clean Store Setup', 'Up to 20 Products Configured', 'Domain Setup', 'Standard Payment Gateways', 'Promotional Offer'],
          },
          {
            name: 'Shopify Premium Theme Package',
            price: 12000,
            originalPrice: 35000,
            deliveryDays: 6,
            revisions: 'Unlimited Revisions',
            features: ['Premium Paid Theme Setup', 'Up to 50 Products', 'Custom Banner Graphics', 'Apps Integration & Speed Boost'],
          },
          {
            name: 'Full High-Scale Shopify Brand Store',
            price: 32000,
            originalPrice: 70000,
            deliveryDays: 12,
            revisions: 'Unlimited Revisions',
            features: ['Custom Liquid Adjustments', 'Email Marketing Automation', 'Abandoned Cart Recovery', 'Inventory & Sales Sync'],
          },
        ],
        addons: [
          { id: 'ad-sp-1', name: 'Product Review & Trust Badges App Setup', price: 4000 },
          { id: 'ad-sp-2', name: 'Multi-Currency Conversion Setup', price: 5000 },
        ],
        isActive: true,
      },
      {
        id: 'srv-wordpress',
        category: 'WordPress',
        title: 'WordPress Website Design & Customization',
        slug: 'wordpress',
        description: 'Dynamic, secure, and easily manageable WordPress websites customized to represent your brand authority with SEO-ready architecture.',
        icon: 'Globe',
        features: [
          'Modern Responsive WordPress Layouts',
          'Easy-to-use Gutenberg / Elementor CMS Control',
          'Security & Anti-spam Protection',
          'Fast Page Speed & Caching Setup',
          'Contact & Lead Generation Forms',
        ],
        packages: [
          {
            name: 'Business WordPress Website',
            price: 18000,
            originalPrice: 38000,
            deliveryDays: 5,
            revisions: '3 Revisions',
            features: ['5 Core Business Pages', 'Blog Section', 'Contact Form & Google Map', 'Security Hardening'],
          },
          {
            name: 'Corporate Brand WordPress Portal',
            price: 35000,
            originalPrice: 65000,
            deliveryDays: 10,
            revisions: 'Unlimited Revisions',
            features: ['Up to 12 Custom Pages', 'Portfolio / Case Studies', 'Newsletter Integration', 'Advanced On-Page SEO'],
          },
        ],
        addons: [
          { id: 'ad-wp-1', name: 'Speed Optimization to 90+ Google Score', price: 6000 },
          { id: 'ad-wp-2', name: 'Automated Daily Cloud Backups', price: 4000 },
        ],
        isActive: true,
      },
      {
        id: 'srv-woocommerce',
        category: 'WooCommerce',
        title: 'WooCommerce Online Stores',
        slug: 'woocommerce',
        description: 'Robust WooCommerce e-commerce stores with tailored product catalogs, flexible payment gateways, inventory management, and smooth checkouts.',
        icon: 'ShoppingCart',
        features: [
          'Unlimited Products & Categories Structure',
          'Secure Checkout with Local & Global Gateways',
          'Customer Account Management & Order History',
          'Coupon & Discount Rule Engine',
          'Automated Order Notifications via SMTP',
        ],
        packages: [
          {
            name: 'Starter Online Shop',
            price: 24000,
            originalPrice: 55000,
            deliveryDays: 8,
            revisions: '4 Revisions',
            features: ['Up to 30 Products', 'Cart & Single-Page Checkout', 'Shipping Zone Setup', 'Email Order Receipts'],
          },
          {
            name: 'Advanced E-Commerce Store',
            price: 48000,
            originalPrice: 95000,
            deliveryDays: 15,
            revisions: 'Unlimited Revisions',
            features: ['Up to 150 Products', 'Wishlist & Product Filters', 'Stock Tracking & Low Stock Alerts', 'Live Order Tracking'],
          },
        ],
        addons: [
          { id: 'ad-wc-1', name: 'WhatsApp Live Chat Order Integration', price: 4000 },
          { id: 'ad-wc-2', name: 'PDF Invoices & Packing Slips Auto-Generation', price: 5000 },
        ],
        isActive: true,
      },
      {
        id: 'srv-custom-software',
        category: 'Custom Software',
        title: 'Custom Business Software & Management Portals',
        slug: 'custom-software',
        description: 'Tailored enterprise web applications including School Management, Office Management, Inventory Control, and Client Portals engineered to streamline your operations.',
        icon: 'Layers',
        features: [
          'Detailed Business Logic & Workflow Automation',
          'Role-Based Access Control (Admin, Staff, Client)',
          'Comprehensive Data Exporting (Excel / PDF)',
          'High-Security Audit Logs & Activity Trails',
          'Scalable Database & Architecture',
        ],
        packages: [
          {
            name: 'Laravel School Management Software',
            price: 45000,
            originalPrice: 158000,
            deliveryDays: 20,
            revisions: 'Unlimited Revisions',
            features: ['Students, Teachers & Parents Portals', 'Fees & Attendance Management', 'Exams & Report Cards', 'Notice Board & Timetables', 'Promotional Offer'],
          },
          {
            name: 'Custom Office & Operations System',
            price: 75000,
            originalPrice: 140000,
            deliveryDays: 25,
            revisions: 'Unlimited Revisions',
            features: ['Employee Management & Attendance', 'Task & Project Assignment', 'Invoice & Expense Tracking', 'Executive Analytics Dashboard'],
          },
          {
            name: 'Automated Crypto Trading & Analytics Software',
            price: 56000,
            originalPrice: 220000,
            deliveryDays: 21,
            revisions: 'Unlimited Revisions',
            features: ['Multi-Network Integration', 'Configurable Automated Strategies', 'Wallet & Transaction Monitoring', 'Risk Disclaimer Compliant', 'Promotional Offer'],
          },
        ],
        addons: [
          { id: 'ad-cs-1', name: 'SMS Notification Gateway Integration', price: 8000 },
          { id: 'ad-cs-2', name: 'Biometric Attendance Machine Sync', price: 15000 },
        ],
        isActive: true,
      },
    ],
    offers: [
      {
        id: 'off-1',
        title: 'Shopify Store Launch',
        category: 'Shopify',
        promotionalPrice: 7000,
        originalPrice: 29000,
        discountPercentage: 76,
        totalQuantity: 26,
        claimedQuantity: 18,
        domainExtensions: ['.online', '.site', '.store', '.shop', '.xyz', '.space', '.live'],
        features: [
          '1-Year Free Domain (.online, .store, .shop, etc.)',
          'Premium Shopify Theme Setup & Branding',
          'Up to 20 Products & Collections Configured',
          'Payment Gateway & Checkout Setup',
          'First 26 Customers Promotional Access',
        ],
        startDate: '2026-02-01',
        endDate: '2026-12-31',
        isActive: true,
      },
      {
        id: 'off-2',
        title: 'Shopify Premium Theme Package',
        category: 'Shopify',
        promotionalPrice: 12000,
        originalPrice: 35000,
        discountPercentage: 66,
        totalQuantity: 26,
        claimedQuantity: 14,
        domainExtensions: ['.com', '.it.com', '.biz', '.us', '.uk', '.co.uk', '.asia'],
        features: [
          '1-Year Domain (.com, .biz, .us, .uk, etc.)',
          'Premium Paid Theme Installation',
          'High-Conversion Design Customization',
          'Fast Loading Speed Optimization',
          'First 26 Customers Promotional Access',
        ],
        startDate: '2026-02-01',
        endDate: '2026-12-31',
        isActive: true,
      },
      {
        id: 'off-3',
        title: 'PHP Single-Vendor E-commerce Website',
        category: 'PHP Development',
        promotionalPrice: 23000,
        originalPrice: 95000,
        discountPercentage: 76,
        totalQuantity: 6,
        claimedQuantity: 4,
        domainExtensions: ['.com', '.pk', '.online', '.org'],
        features: [
          '1-Year Domain Name Included',
          '1 Month Web Hosting Included',
          'Full-featured PHP E-Commerce Script & Setup',
          'Admin Dashboard & Order Management',
          'SMTP Email Setup & Initial Guidance',
          'Limited to First 6 Customers',
        ],
        startDate: '2026-02-01',
        endDate: '2026-12-31',
        isActive: true,
      },
      {
        id: 'off-4',
        title: 'PHP News and Magazine Website',
        category: 'PHP Development',
        promotionalPrice: 17000,
        originalPrice: 66000,
        discountPercentage: 74,
        totalQuantity: 6,
        claimedQuantity: 3,
        domainExtensions: ['.com', '.news', '.pk', '.net'],
        features: [
          '1-Year Domain Name Included',
          '1 Month Web Hosting Included',
          'Full-featured News CMS & Categories',
          'Ad Management & Social Media Sharing',
          'SMTP Email Setup & Initial Guidance',
          'Limited to First 6 Customers',
        ],
        startDate: '2026-02-01',
        endDate: '2026-12-31',
        isActive: true,
      },
      {
        id: 'off-5',
        title: 'Construction & Renovation Website',
        category: 'Website Development',
        promotionalPrice: 10000,
        originalPrice: 32000,
        discountPercentage: 69,
        totalQuantity: 26,
        claimedQuantity: 12,
        domainExtensions: ['.com', '.build', '.online', '.site'],
        features: [
          '1-Year Domain Name Included',
          '1 Month Web Hosting Included',
          'Showcase of Projects & Services',
          'Estimate Quote Request Form',
          'SMTP Email Setup & Initial Guidance',
          'First 26 Customers Promotional Access',
        ],
        startDate: '2026-02-01',
        endDate: '2026-12-31',
        isActive: true,
      },
      {
        id: 'off-6',
        title: 'Laravel School Management Software',
        category: 'Custom Software',
        promotionalPrice: 45000,
        originalPrice: 158000,
        discountPercentage: 72,
        totalQuantity: 30,
        claimedQuantity: 19,
        domainExtensions: ['.edu', '.org', '.com', '.pk'],
        features: [
          'Students, Teachers, Parents & Admin Portals',
          'Fee Management, Invoicing & Receipts',
          'Exam Schedules, Grading & Report Cards',
          'Attendance, Timetable & Homework Tracking',
          'Notice Board & Multi-Branch Ready',
          'First 30 Educational Institutions',
        ],
        startDate: '2026-02-01',
        endDate: '2026-12-31',
        isActive: true,
      },
      {
        id: 'off-7',
        title: 'Automated Crypto Trading Software',
        category: 'Custom Software',
        promotionalPrice: 56000,
        originalPrice: 220000,
        discountPercentage: 75,
        totalQuantity: 26,
        claimedQuantity: 15,
        domainExtensions: ['.com', '.io', '.app'],
        features: [
          'Multi-Network Support & Web3 Integrations',
          'Configurable Algorithmic Strategies',
          'Wallet Management & Transaction Monitoring',
          'Portfolio Reporting & Analytics Dashboard',
          'First 26 Customers Access',
        ],
        disclaimer: 'Disclaimer: Software performance depends on market conditions and client configurations. CODELIX does not offer investment advice or guarantee profits.',
        startDate: '2026-02-01',
        endDate: '2026-12-31',
        isActive: true,
      },
    ],
    pakistaniBanks: [
      {
        id: 'bnk-1',
        bankName: 'Meezan Bank Limited',
        accountTitle: 'CODELIX SOLUTIONS',
        accountNumber: '01020304050607',
        iban: 'PK45MEZN0001020304050607',
        branchCode: '0102',
        instructions: 'Please transfer funds via Mobile App, ATM, or Raast. Attach payment transaction screenshot.',
        category: 'Islamic Bank',
        isActive: true,
      },
      {
        id: 'bnk-2',
        bankName: 'Habib Bank Limited (HBL)',
        accountTitle: 'CODELIX DIGITAL SOLUTIONS',
        accountNumber: '12345678901234',
        iban: 'PK88HABB0012345678901234',
        branchCode: '1234',
        instructions: 'HBL Konnect or HBL Internet Banking accepted. Include Order Reference in remarks.',
        category: 'Commercial Bank',
        isActive: true,
      },
      {
        id: 'bnk-3',
        bankName: 'United Bank Limited (UBL)',
        accountTitle: 'CODELIX TECH SERVICES',
        accountNumber: '98765432109876',
        iban: 'PK56UNIL0098765432109876',
        branchCode: '0987',
        instructions: 'UBL Digital transfer supported with instant confirmation.',
        category: 'Commercial Bank',
        isActive: true,
      },
      {
        id: 'bnk-4',
        bankName: 'Bank Alfalah',
        accountTitle: 'CODELIX GLOBAL',
        accountNumber: '55667788990011',
        iban: 'PK23ALFH0055667788990011',
        branchCode: '0556',
        instructions: 'Alfa app or counter deposit supported.',
        category: 'Commercial Bank',
        isActive: true,
      },
      {
        id: 'bnk-5',
        bankName: 'MCB Bank Limited',
        accountTitle: 'CODELIX CORP',
        accountNumber: '11223344556677',
        iban: 'PK34MUCB0011223344556677',
        branchCode: '0112',
        instructions: 'MCB Live or 1Link interbank transfer.',
        category: 'Commercial Bank',
        isActive: true,
      },
      {
        id: 'bnk-6',
        bankName: 'Allied Bank Limited (ABL)',
        accountTitle: 'CODELIX TECHNOLOGIES',
        accountNumber: '99887766554433',
        iban: 'PK77ABPA0099887766554433',
        branchCode: '0998',
        instructions: 'myABL transfer supported.',
        category: 'Commercial Bank',
        isActive: true,
      },
      {
        id: 'bnk-7',
        bankName: 'Faysal Bank Limited',
        accountTitle: 'CODELIX ISLAMIC SOLUTIONS',
        accountNumber: '33445566778899',
        iban: 'PK12FAYS0033445566778899',
        branchCode: '0334',
        instructions: 'Faysal Digibank or Raast transfer.',
        category: 'Islamic Bank',
        isActive: true,
      },
      {
        id: 'bnk-8',
        bankName: 'Standard Chartered Pakistan',
        accountTitle: 'CODELIX PRIVATE LIMITED',
        accountNumber: '01234567890123',
        iban: 'PK60SCBL0001234567890123',
        branchCode: '0012',
        instructions: 'Standard Chartered Breeze app or wire transfer.',
        category: 'Commercial Bank',
        isActive: true,
      },
      {
        id: 'bnk-9',
        bankName: 'Bank of Punjab (BOP)',
        accountTitle: 'CODELIX ENTERPRISE',
        accountNumber: '44556677889900',
        iban: 'PK91BPUN0044556677889900',
        branchCode: '0445',
        instructions: 'BOP Mobile Banking or branch deposit.',
        category: 'Commercial Bank',
        isActive: true,
      },
      {
        id: 'bnk-10',
        bankName: 'SadaPay',
        accountTitle: 'AAQIB HUSSAIN KHERO / CODELIX',
        accountNumber: '03001234567',
        iban: 'PK25SADA00000003001234567',
        instructions: 'Select SadaPay in 1Link/Raast or send directly to SadaBiz handle.',
        category: 'Microfinance / Digital Wallet',
        isActive: true,
      },
      {
        id: 'bnk-11',
        bankName: 'NayaPay',
        accountTitle: 'CODELIX BUSINESS',
        accountNumber: '03009030717',
        iban: 'PK36NAYA00000003009030717',
        instructions: 'Transfer to NayaPay ID: @codelix or via 1Link.',
        category: 'Microfinance / Digital Wallet',
        isActive: true,
      },
      {
        id: 'bnk-12',
        bankName: 'Easypaisa / Telenor Microfinance',
        accountTitle: 'CODELIX OFFICIAL / AAQIB HUSSAIN',
        accountNumber: '03459030717',
        iban: 'PK55TMFB00000003459030717',
        instructions: 'Send money to Easypaisa Account: 03459030717 and upload screenshot.',
        category: 'Microfinance / Digital Wallet',
        isActive: true,
      },
      {
        id: 'bnk-13',
        bankName: 'JazzCash / Mobilink Microfinance',
        accountTitle: 'CODELIX SOLUTIONS / AAQIB HUSSAIN',
        accountNumber: '03009030717',
        iban: 'PK77MMBL00000003009030717',
        instructions: 'Send money to JazzCash Mobile Account: 03009030717.',
        category: 'Microfinance / Digital Wallet',
        isActive: true,
      },
      {
        id: 'bnk-14',
        bankName: 'Raast Instant Government ID',
        accountTitle: 'CODELIX VERIFIED RAAST',
        accountNumber: '923009030717',
        iban: 'RAAST-ID-923009030717',
        instructions: 'Instant 0% fee transfer using National Raast ID: 03009030717 from any Pakistani bank app.',
        category: 'Microfinance / Digital Wallet',
        isActive: true,
      },
    ],
    cryptoWallets: [
      {
        id: 'cpt-1',
        symbol: 'USDT',
        network: 'TRC20 (Tron Network - Low Gas)',
        walletAddress: 'TYx78CodelixUsdtTRC20OfficialSecuredWallet999',
        instructions: 'Send USDT on TRC20 network only. Price in USD is automatically converted at 1 USD = 271 PKR.',
        isActive: true,
      },
      {
        id: 'cpt-2',
        symbol: 'USDT',
        network: 'BEP20 (Binance Smart Chain - BSC)',
        walletAddress: '0x3B89f8CodelixUsdtBEP20BinanceOfficial777',
        instructions: 'Send USDT on BNB Smart Chain (BEP20). Confirm transaction hash after sending.',
        isActive: true,
      },
      {
        id: 'cpt-3',
        symbol: 'USDT',
        network: 'ERC20 (Ethereum Mainnet)',
        walletAddress: '0x99A81CodelixUsdtERC20EthereumVault555',
        instructions: 'Send USDT on ERC20 network. Please account for Ethereum gas fees.',
        isActive: true,
      },
      {
        id: 'cpt-4',
        symbol: 'BTC',
        network: 'Bitcoin Mainnet',
        walletAddress: 'bc1qcodelixbtcpaymentssecurestorage2026',
        instructions: 'Send exact BTC equivalent. Minimum 2 blockchain confirmations required.',
        isActive: true,
      },
    ],
    usdToPkrRate: 271, // 1 USD = 271 PKR (Admin configurable)
    coupons: [
      {
        id: 'cpn-1',
        code: 'CODELIX10',
        title: 'Launch Celebration 10% Off',
        description: 'Enjoy 10% discount across all services and promotional bundles.',
        discountType: 'percentage',
        discountValue: 10,
        expiryDate: '2026-12-31',
        isExclusive: false,
        eligibleCustomerIds: [],
        eligibleEmails: [],
        isActive: true,
      },
      {
        id: 'cpn-2',
        code: 'WELCOME10',
        title: 'New Client Welcome Voucher',
        description: 'Special 10% discount voucher for newly registered customers and newsletter subscribers.',
        discountType: 'percentage',
        discountValue: 10,
        expiryDate: '2026-12-31',
        isExclusive: false,
        eligibleCustomerIds: [],
        eligibleEmails: [],
        isActive: true,
      },
      {
        id: 'cpn-3',
        code: 'VIPHAMZA5000',
        title: 'Exclusive VIP Loyalty PKR 5,000 Off',
        description: 'Exclusively allocated for client Hamza Khan on orders above PKR 20,000.',
        discountType: 'fixed',
        discountValue: 5000,
        minOrder: 20000,
        expiryDate: '2026-06-30',
        isExclusive: true,
        eligibleCustomerIds: ['usr-cust-1'],
        eligibleEmails: ['hamza.client@example.com'],
        isActive: true,
      },
    ],
    orders: [
      {
        id: 'ord-1',
        reference: 'CDX-ORD-2026-000101',
        customerId: 'usr-cust-1',
        customerName: 'Hamza Khan',
        customerEmail: 'hamza.client@example.com',
        customerPhone: '+92 300 1234567',
        items: [
          {
            serviceId: 'srv-shopify',
            serviceTitle: 'Shopify Store Launch',
            packageName: 'Store Launch Starter',
            price: 7000,
            quantity: 1,
            addons: [{ name: 'Product Review & Trust Badges App Setup', price: 4000 }],
          },
        ],
        subtotal: 11000,
        discount: 0,
        total: 11000,
        currency: 'PKR',
        amountInUsd: 40.59,
        exchangeRateUsed: 271,
        paymentMethodType: 'bank',
        selectedBankName: 'Meezan Bank Limited',
        transactionId: 'TXN-MEEZAN-9928371',
        paymentProofScreenshot: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="150"><rect width="300" height="150" fill="%23f0f9ff"/><text x="20" y="75" font-family="sans-serif" font-size="14" fill="%230369a1">Verified Bank Receipt: PKR 11,000</text></svg>',
        status: 'In Progress',
        paymentStatus: 'Paid',
        paymentVerificationNotes: 'Meezan Bank transfer reference confirmed by finance team.',
        customerRemarks: 'We sell organic clothing and accessories. We prefer a clean white minimalist design with soft blue accents.',
        businessName: 'Hamza Apparel & Co.',
        websiteUrl: 'https://hamzaapparel.store',
        preferredDeadline: '2026-03-10',
        assignedEmployeeId: 'emp-1',
        assignedEmployeeName: 'Zubair Ahmed',
        startDate: '2026-02-18',
        estimatedCompletionDate: '2026-03-05',
        overallProgress: 65,
        milestones: [
          { id: 'm1', title: 'Architecture & Catalog Planning', weight: 20, progress: 100, completed: true },
          { id: 'm2', title: 'Theme Customization & Branding', weight: 30, progress: 100, completed: true },
          { id: 'm3', title: 'Payment Gateway & Checkout Testing', weight: 25, progress: 60, completed: false },
          { id: 'm4', title: 'Quality Assurance & Customer Review', weight: 15, progress: 0, completed: false },
          { id: 'm5', title: 'Final Handover & Domain Live', weight: 10, progress: 0, completed: false },
        ],
        timeline: [
          {
            id: 'tl-1',
            timestamp: '2026-02-18 10:30',
            author: 'CODELIX System',
            role: 'System',
            message: 'Order placed by customer and assigned reference CDX-ORD-2026-000101.',
            isPublic: true,
          },
          {
            id: 'tl-2',
            timestamp: '2026-02-19 11:00',
            author: 'CODELIX Admin',
            role: 'Admin',
            message: 'Order confirmed and assigned to Lead Engineer Zubair Ahmed.',
            isPublic: true,
          },
          {
            id: 'tl-3',
            timestamp: '2026-02-22 15:45',
            author: 'Zubair Ahmed',
            role: 'Employee',
            message: 'Completed theme styling and logo integration. 20 sample products configured. Commencing payment gateway sandbox tests.',
            isPublic: true,
          },
        ],
        createdAt: '2026-02-18T10:30:00Z',
      },
    ],
    complaints: [
      {
        id: 'cmp-1',
        reference: 'CDX-CMP-2026-000123',
        customerId: 'usr-cust-1',
        customerName: 'Hamza Khan',
        customerEmail: 'hamza.client@example.com',
        orderReference: 'CDX-ORD-2026-000101',
        category: 'Project delay',
        subject: 'Inquiry regarding payment gateway test status',
        description: 'Wanted to check if the payment gateway sandbox credentials provided yesterday were tested successfully.',
        priority: 'Medium',
        status: 'Investigation in Progress',
        assignedEmployeeName: 'Zubair Ahmed',
        publicNotes: [
          {
            timestamp: '2026-02-23 09:15',
            author: 'Zubair Ahmed',
            message: 'Thank you for reaching out! We received the sandbox keys and our team is running the test transactions right now. You will receive an update by 3 PM.',
          },
        ],
        internalNotes: [
          {
            timestamp: '2026-02-23 09:10',
            author: 'Zubair Ahmed',
            message: 'Merchant keys verified. Testing webhook callback response.',
          },
        ],
        createdAt: '2026-02-23T08:30:00Z',
      },
    ],
    quotations: [
      {
        id: 'qt-1',
        reference: 'CDX-QT-2026-000045',
        name: 'Saad Malik',
        email: 'saad.malik@bizgroup.com',
        phone: '+92 321 9876543',
        company: 'BizGroup Global',
        serviceCategory: 'PHP Development',
        description: 'We need a multi-vendor supply chain tracking system with custom warehouse roles and automated PDF shipment receipts.',
        budgetRange: 'PKR 100,000 - 200,000',
        preferredTimeline: '4 Weeks',
        referenceUrl: 'https://bizgroup.com',
        status: 'Sent to Customer',
        quoteAmount: 145000,
        quoteItems: [
          { description: 'Custom PHP 8.3 OOP & MVC Core Architecture', amount: 55000 },
          { description: 'Multi-Role Permissions (Warehouse, Supplier, Admin)', amount: 40000 },
          { description: 'PDF Shipment Waybill Generator & SMTP Alerts', amount: 25000 },
          { description: 'Deployment, Server Hardening & 3 Months Support', amount: 25000 },
        ],
        validUntil: '2026-03-31',
        staffNotes: 'Client has provided detailed requirements. Good prospect.',
        createdAt: '2026-02-20T14:15:00Z',
      },
    ],
    inquiries: [
      {
        id: 'inq-1',
        reference: 'CDX-INQ-2026-000088',
        name: 'Nadia Parveen',
        email: 'nadia.parveen@gmail.com',
        phone: '+92 333 5551234',
        subject: 'WooCommerce vs Shopify for Fashion Retail',
        category: 'Technical Consultation',
        message: 'Could your team advise whether WooCommerce or Shopify would be more cost-effective for a new boutique launching in Lahore?',
        status: 'Answered',
        response: 'Dear Nadia, thank you for contacting CODELIX. Both are fantastic platforms! Shopify offers zero hosting maintenance and fast launch, while WooCommerce gives you 100% control over hosting and data. We have emailed you a detailed comparison guide.',
        createdAt: '2026-02-21T11:20:00Z',
      },
    ],
    demoRequests: [
      {
        id: 'dm-1',
        reference: 'CDX-DEMO-2026-000032',
        name: 'Principal Tariq Aziz',
        email: 'tariq.aziz@oxfordschool.edu.pk',
        phone: '+92 345 8899001',
        serviceOrProduct: 'Laravel School Management Software',
        preferredDate: '2026-03-02',
        preferredTime: '11:00 AM',
        timezone: 'PKT (UTC+5)',
        notes: 'We have 1,200 students across 2 campuses and would like to see the fee collection and report card modules.',
        status: 'Confirmed',
        createdAt: '2026-02-22T16:00:00Z',
      },
    ],
    ideas: [
      {
        id: 'id-1',
        reference: 'CDX-IDEA-2026-000021',
        name: 'Usman Farooq',
        email: 'usman.f@innovate.pk',
        phone: '+92 301 4455667',
        ideaTitle: 'B2B Wholesale Pharmacy Ordering Portal',
        targetAudience: 'Pharmacies and Licensed Medical Distributors',
        desiredFeatures: 'Batch number verification, drug license file uploads, credit limit management, automated order dispatch.',
        budget: 'PKR 150,000 - 300,000',
        timeline: '2 Months',
        status: 'Feasibility Assessment',
        evaluationNotes: 'High viability. Technical stack recommended: Custom PHP MVC with MySQL and encrypted document storage.',
        createdAt: '2026-02-22T17:30:00Z',
      },
    ],
    vacancies: [
      {
        id: 'vac-1',
        title: 'Senior Full Stack PHP & Laravel Developer',
        department: 'Software Engineering',
        location: 'Remote (Pakistan / Worldwide)',
        type: 'Full-time',
        experience: '3+ Years',
        salaryRange: 'PKR 120,000 - 200,000 / month',
        description: 'We are seeking an experienced PHP engineer proficient in modern PHP 8+, Laravel, MySQL, RESTful API design, and clean MVC architecture to lead client web systems.',
        requirements: [
          'Strong command of PHP 8.3+, OOP principles, and MVC frameworks',
          'Proficiency with MySQL database schema design and optimization',
          'Experience building administrative dashboards and customer portals',
          'Knowledge of secure coding practices (CSRF, XSS, sanitization)',
          'Familiarity with Git, Linux environments, and cPanel deployments',
        ],
        skills: ['PHP 8.3', 'Laravel', 'MySQL', 'REST APIs', 'Git', 'HTML/CSS/JS'],
        positionsCount: 2,
        deadline: '2026-04-15',
        isActive: true,
      },
      {
        id: 'vac-2',
        title: 'Shopify & WordPress Frontend Specialist',
        department: 'E-Commerce Solutions',
        location: 'Remote',
        type: 'Full-time',
        experience: '2+ Years',
        salaryRange: 'PKR 80,000 - 140,000 / month',
        description: 'Looking for a skilled frontend and CMS developer with deep expertise in Shopify Liquid theme development, WooCommerce customization, and responsive HTML/CSS/JS.',
        requirements: [
          'Solid portfolio of custom Shopify and WordPress / WooCommerce stores',
          'Expertise in Liquid templating, Gutenberg, and modern CSS/Tailwind',
          'Proven ability to optimize web performance and Core Web Vitals',
          'Mandatory submission of passport-size photo on plain white background',
        ],
        skills: ['Shopify Liquid', 'WordPress', 'WooCommerce', 'Tailwind CSS', 'JavaScript'],
        positionsCount: 1,
        deadline: '2026-04-30',
        isActive: true,
      },
    ],
    applications: [
      {
        id: 'app-1',
        reference: 'CDX-APP-2026-000077',
        vacancyId: 'vac-1',
        vacancyTitle: 'Senior Full Stack PHP & Laravel Developer',
        fullName: 'Kamran Siddiqui',
        email: 'kamran.dev@example.com',
        phone: '+92 312 3456789',
        city: 'Islamabad',
        country: 'Pakistan',
        education: 'BS Computer Science, FAST NUCES',
        experience: '4.5 Years in Web Application Development',
        skills: 'PHP 8.3, Laravel, MySQL, Vue.js, Tailwind, Docker, cPanel',
        portfolioUrl: 'https://github.com/kamransiddiqui-dev',
        coverLetter: 'I have delivered 15+ production PHP systems, custom admin portals, and payment integrations. Passionate about writing clean, maintainable code.',
        resumeFileName: 'Kamran_Siddiqui_Resume_2026.pdf',
        photoFileName: 'Kamran_Passport_Photo.jpg',
        photoVerifiedWhiteBackground: true,
        photoVerificationScore: 94,
        status: 'Shortlisted',
        cvRemarks: 'Impressive code architecture and clean MySQL repository patterns.',
        backgroundRemarks: 'Educational credentials verified with FAST NUCES.',
        technicalRemarks: 'Exceptional answers on PDO transactions and PHP 8.3 match expressions.',
        hrRemarks: 'Excellent communication and positive attitude.',
        interviewDate: '2026-03-01 14:00 PKT',
        candidateMessage: 'Your application has been shortlisted! Our engineering lead will meet you via Google Meet on March 1st at 2:00 PM PKT.',
        createdAt: '2026-02-21T09:00:00Z',
      },
    ],
    emailLogs: [
      {
        id: 'em-1',
        recipient: 'hamza.client@example.com',
        subject: 'Order Received — CDX-ORD-2026-000101 | CODELIX',
        templateType: 'order_received',
        status: 'Sent via SMTP',
        timestamp: '2026-02-18 10:30:15',
        contentPreview: 'Thank you for choosing CODELIX. Your order CDX-ORD-2026-000101 has been received and is under review.',
      },
      {
        id: 'em-2',
        recipient: 'hamza.client@example.com',
        subject: 'Order Confirmed & Project Assigned — CDX-ORD-2026-000101',
        templateType: 'order_confirmed',
        status: 'Sent via SMTP',
        timestamp: '2026-02-19 11:00:42',
        contentPreview: 'Great news! Your project has been confirmed and assigned to Lead Engineer Zubair Ahmed. Estimated completion: March 5, 2026.',
      },
      {
        id: 'em-3',
        recipient: 'kamran.dev@example.com',
        subject: 'Application Status Update: Shortlisted — CDX-APP-2026-000077',
        templateType: 'application_shortlisted',
        status: 'Sent via SMTP',
        timestamp: '2026-02-22 10:15:00',
        contentPreview: 'Congratulations Kamran! You have been shortlisted for the Senior Full Stack PHP Developer role at CODELIX.',
      },
    ],
    smtp: {
      host: 'smtp.mailgun.org',
      port: 587,
      encryption: 'TLS',
      username: 'postmaster@codelix.online',
      password: '••••••••••••••••',
      fromName: 'CODELIX — Building Digital Solutions',
      fromEmail: 'noreply@codelix.online',
      replyTo: 'support@codelix.online',
      emailPrefix: '[CODELIX Solutions]',
      isConfigured: true,
    },
    cms: {
      websiteName: 'CODELIX',
      tagline: 'Building Digital Solutions.',
      officialPhone: '+1 902 903 0717',
      officialEmail: 'contact@codelix.online',
      slogans: [
        'Building Digital Solutions.',
        'Smart Technology. Affordable Solutions.',
        'Your Digital Partner for Business Growth.',
        'From Idea to Launch.',
        'Professional Websites. Powerful Software. Fair Prices.',
      ],
      heroHeadline: 'Your Ideas. Our Technology. Your Digital Growth.',
      heroDescription:
        'From business websites and e-commerce stores to custom PHP applications and advanced software solutions, CODELIX helps turn your ideas into reliable digital products at competitive prices.',
      announcementBanner: {
        enabled: true,
        badge: 'Limited Offer',
        text: 'Save up to 76% on our initial promotional launch packages! First-come first-served.',
        linkUrl: '/offers',
      },
      socialLinks: {
        instagram: 'https://instagram.com/codelixhq',
        tiktok: 'https://tiktok.com/@codelixhq',
        twitter: 'https://twitter.com/codelixhq',
        linkedin: 'https://linkedin.com/company/codelix',
        website: 'https://codelix.online',
      },
      aboutStory:
        'CODELIX is a premier digital engineering and software development company founded by Aaqib Hussain Khero. We bridge the gap between world-class technology and affordability, delivering custom web applications, e-commerce stores, and enterprise business software tailored to your operational goals.',
      maintenanceMode: false,
      timezone: {
        code: 'PKT',
        offset: '+05:00',
        label: 'Pakistan Standard Time (PKT UTC+5)',
      },
      founder: {
        name: 'Aaqib Hussain Khero',
        title: 'Founder & Chief Executive Officer',
        bio: 'Aaqib Hussain Khero is the visionary Founder & CEO behind CODELIX. Under his leadership, CODELIX has engineered transformative digital systems, robust e-commerce solutions, and high-performance custom software for ambitious businesses globally.',
        facebook: '@aaqibkhero',
        instagram: '@aaqibkhero',
        tiktok: '@aaqibkhero',
        linkedin: '@aaqibkhero',
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
    },
    counters: {
      order: 102,
      complaint: 124,
      quotation: 46,
      application: 78,
      inquiry: 89,
      demo: 33,
      idea: 22,
    },
  };
}

class DatabaseManager {
  private data: DatabaseSchema;

  constructor() {
    this.ensureDirectory();
    this.data = this.loadData();
  }

  private ensureDirectory() {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  private loadData(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_PATH)) {
        const raw = fs.readFileSync(DB_PATH, 'utf-8');
        const parsed = JSON.parse(raw);
        // Ensure new structures exist
        const seed = seedInitialData();
        return {
          ...seed,
          ...parsed,
          pakistaniBanks: parsed.pakistaniBanks || seed.pakistaniBanks,
          cryptoWallets: parsed.cryptoWallets || seed.cryptoWallets,
          usdToPkrRate: parsed.usdToPkrRate || seed.usdToPkrRate,
          coupons: parsed.coupons || seed.coupons,
          cms: {
            ...seed.cms,
            ...(parsed.cms || {}),
            founder: parsed.cms?.founder || seed.cms.founder,
            helpdeskEmails: parsed.cms?.helpdeskEmails || seed.cms.helpdeskEmails,
            timezone: parsed.cms?.timezone || seed.cms.timezone,
          },
        };
      }
    } catch (err) {
      console.error('Failed reading db.json, falling back to seed:', err);
    }
    const seed = seedInitialData();
    this.saveData(seed);
    return seed;
  }

  public saveData(data?: DatabaseSchema) {
    if (data) this.data = data;
    try {
      this.ensureDirectory();
      fs.writeFileSync(DB_PATH, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed writing db.json:', err);
    }
  }

  public get(): DatabaseSchema {
    return this.data;
  }

  public nextReference(type: 'order' | 'complaint' | 'quotation' | 'application' | 'inquiry' | 'demo' | 'idea'): string {
    this.data.counters[type] = (this.data.counters[type] || 100) + 1;
    const seq = this.data.counters[type];
    this.saveData();

    const prefixMap = {
      order: 'CDX-ORD',
      complaint: 'CDX-CMP',
      quotation: 'CDX-QT',
      application: 'CDX-APP',
      inquiry: 'CDX-INQ',
      demo: 'CDX-DEMO',
      idea: 'CDX-IDEA',
    };

    const prefix = prefixMap[type];
    const padded = String(seq).padStart(6, '0');
    return `${prefix}-2026-${padded}`;
  }

  public logEmail(recipient: string, subject: string, templateType: string, contentPreview: string) {
    const log: EmailLog = {
      id: `em-${Date.now()}`,
      recipient,
      subject,
      templateType,
      status: this.data.smtp.isConfigured ? 'Sent via SMTP' : 'Delivered',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      contentPreview,
    };
    this.data.emailLogs.unshift(log);
    if (this.data.emailLogs.length > 100) {
      this.data.emailLogs.pop();
    }
    this.saveData();
    return log;
  }
}

export const db = new DatabaseManager();
