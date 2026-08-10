
export interface GenericItem {
  id: string;
  name: string;
  label?: string;
  value: string | number;
  category: string;
  description?: string;
  type?: 'text' | 'number' | 'date' | 'textarea' | 'currency' | 'boolean';
  sku?: string;
  stockCount?: number;
  taxRate?: string;
  margin?: string;
  department?: string;
  severity?: 'Critical' | 'High' | 'Medium' | 'Low';
  remediationText?: string;
  validationRule?: string;
}

export type LayoutType = 'form' | 'catalog' | 'checklist';
export type Language = 'en' | 'hi';
export type IndustryType = 'academic' | 'commercial' | 'vendor' | 'default';

export interface DocumentContext {
  detectedType: string;
  appTitle: string;
  actionButtonLabel: string;
  summaryLabel: string;
  layoutType: LayoutType;
  type?: string;
  confidence?: number;
  isUnrelated?: boolean;
  unrelatedType?: string;
  isMenu?: boolean;
}

export interface BusinessRule {
  type: 'threshold_action' | 'threshold_discount' | 'discount' | 'flag'; 
  threshold: number;
  benefitValue: number; 
  originalText: string;
  actionName?: string; 
  description?: string;
  logic?: string;
  value?: number;
}

export type View = 'landing' | 'auth' | 'projects' | 'upload' | 'preview' | 'analytics';
export type UploadStep = 'upload' | 'processing' | 'review';

export interface Project {
  id: string;
  title: string;
  type: string;
  responses: number;
  status: 'active' | 'draft' | 'paused';
  lastEdited: string;
  items: GenericItem[];
  context: DocumentContext;
  rule: BusinessRule | null;
  icon?: any;
  color?: string;
}

export interface AppState {
  user: string | null;
  view: View;
  uploadStep: UploadStep;
  projects: Project[];
  currentProject: Project | null;
  uploadedImages: File[];
  uploadedAudio: File | null;
  manualRuleText: string;
  extractedItems: GenericItem[];
  documentContext: DocumentContext | null;
  rule: BusinessRule | null;
  isLoading: boolean;
  loadingMessage: string;
}

export type FileType = 'image' | 'audio';
