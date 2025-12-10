
export interface GenericItem {
  id: string;
  name: string; // Field Label (e.g., "First Name" or "Pizza Margherita")
  value: string | number; // Default value, Price, or Content
  category: string; // Section Header
  description?: string; // Placeholder or Tooltip
  type?: 'text' | 'number' | 'date' | 'textarea' | 'currency' | 'boolean'; // UI Hint
}

export type LayoutType = 'form' | 'catalog' | 'checklist';

export interface DocumentContext {
  detectedType: string; // e.g., "Passport Application", "Invoice"
  appTitle: string; // e.g., "Passport Renewal Portal"
  actionButtonLabel: string; // e.g., "Submit Application"
  summaryLabel: string; // e.g., "Fields Completed", "Total Amount"
  layoutType: LayoutType; // THE DECISION: How the app should look
}

export interface BusinessRule {
  type: 'threshold_action' | 'threshold_discount'; 
  threshold: number;
  benefitValue: number; 
  originalText: string;
  actionName?: string; 
}

export type Step = 'input' | 'review' | 'app';

export interface AppState {
  // Input Data
  uploadedImages: File[];
  uploadedAudio: File | null;
  manualRuleText: string;

  // Extracted Data
  extractedItems: GenericItem[];
  documentContext: DocumentContext | null;
  rule: BusinessRule | null;

  // UI State
  step: Step;
  isLoading: boolean;
  loadingMessage: string;
}

export type FileType = 'image' | 'audio';
