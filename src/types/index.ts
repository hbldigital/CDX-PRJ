/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * CODELIX Shared TypeScript Definitions
 */

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  role: 'customer' | 'employee' | 'admin';
  isVerified: boolean;
  createdAt?: string;
}

export interface ServicePackage {
  name: string;
  price: number;
  originalPrice?: number;
  deliveryDays: number;
  revisions: string;
  features: string[];
}

export interface ServiceAddon {
  id: string;
  name: string;
  price: number;
}

export interface Service {
  id: string;
  category: string;
  title: string;
  slug: string;
  description: string;
  icon: string;
  features: string[];
  packages: ServicePackage[];
  addons: ServiceAddon[];
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

export interface Milestone {
  id: string;
  title: string;
  weight: number;
  progress: number;
  completed: boolean;
}

export interface TimelineEntry {
  id: string;
  timestamp: string;
  author: string;
  role: string;
  message: string;
  isPublic: boolean;
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
  symbol: string;
  network: string;
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
  reference: string;
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
  exchangeRateUsed?: number; // e.g. 271
  paymentMethodType?: 'bank' | 'crypto' | 'digital_wallet';
  selectedBankName?: string;
  selectedCryptoNetwork?: string;
  transactionId?: string;
  paymentProofScreenshot?: string;
  paymentStatus: 'Pending' | 'Verification in Progress' | 'Verified' | 'Paid' | 'Rejected';
  paymentVerificationNotes?: string;
  status:
    | 'Pending Review'
    | 'Confirmed'
    | 'In Progress'
    | 'Awaiting Customer Feedback'
    | 'Revision in Progress'
    | 'Completed'
    | 'Cancelled';
  customerRemarks: string;
  businessName?: string;
  websiteUrl?: string;
  preferredDeadline?: string;
  attachments?: Array<{ name: string; size: string; dataUrl?: string }>;
  assignedEmployeeId?: string;
  assignedEmployeeName?: string;
  startDate?: string;
  estimatedCompletionDate?: string;
  overallProgress: number;
  milestones: Milestone[];
  timeline: TimelineEntry[];
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
  employeeCode: string;
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
  status: string;
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
    facebook?: string;
  };
  aboutStory: string;
  maintenanceMode: boolean;
  timezone?: TimezoneSettings;
  founder?: FounderInfo;
  helpdeskEmails?: OfficialHelpdeskEmails;
}
