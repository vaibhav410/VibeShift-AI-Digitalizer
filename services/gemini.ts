
import { GoogleGenAI, Type } from "@google/genai";
import { GenericItem, BusinessRule, DocumentContext } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const fileToGenerativePart = async (file: File): Promise<{ inlineData: { data: string; mimeType: string } }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const base64Data = base64String.split(',')[1];
      resolve({
        inlineData: {
          data: base64Data,
          mimeType: file.type
        }
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const extractDataFromImages = async (imageParts: Array<{ inlineData: { data: string; mimeType: string } }>): Promise<{ items: GenericItem[], context: DocumentContext }> => {
  const modelId = "gemini-2.5-flash";

  const response = await ai.models.generateContent({
    model: modelId,
    contents: {
      parts: [
        ...imageParts,
        {
          text: `You are the VibeShift Universal AI Architect. Your goal is to reverse-engineer ANY visual document into a functional application.
          
          Analyze the image (Screenshot, Photo, PDF scan, Form, Receipt, Menu, etc.) and generate the optimal app structure.

          --- PHASE 1: CLASSIFICATION & LAYOUT ---
          Analyze the visual hierarchy to determine 'layoutType':
          1. 'catalog': Best for Lists of Products, Food Menus, Service Price Lists, or Invoice Line Items where the user might want to "Select/Order". (Key feature: Items with prices).
          2. 'checklist': Best for Inspection logs, To-Do lists, Requirements, or Audit forms. (Key feature: Checkboxes, Boolean/Status).
          3. 'form': The Universal Fallback. Use this for Applications, Registration forms, Business Cards, ID Cards, Receipts (header data), Surveys, or general Data Entry.

          --- PHASE 2: INTELLIGENT EXTRACTION ---
          Extract all relevant data points into 'items'.
          - **Forms:** Detect field labels. If the form is blank, 'value' is empty. If filled (like a receipt/invoice), extract the OCR text as the 'value' so it can be edited/verified.
          - **Menus/Catalogs:** 'name' is the item title. 'value' MUST be the numeric price (strip currency symbols).
          - **Business Cards/IDs:** Map Name, Email, Phone, Company, Address to text fields.
          
          --- PHASE 3: METADATA INFERENCE ---
          - 'appTitle': Invent a professional title based on the content (e.g., "Expense Tracker", "Lead Capture", "Inventory Portal", "Patient Intake").
          - 'detectedType': specific document type (e.g., "Uber Receipt", "Dental Intake Form", "Restaurant Menu").
          
          Make the application "Production-Ready" by inferring appropriate input types (date, currency, text, textarea, number).
          `
        }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          context: {
            type: Type.OBJECT,
            properties: {
              detectedType: { type: Type.STRING },
              appTitle: { type: Type.STRING },
              actionButtonLabel: { type: Type.STRING },
              summaryLabel: { type: Type.STRING },
              layoutType: { type: Type.STRING, enum: ['form', 'catalog', 'checklist'] }
            },
            required: ["detectedType", "appTitle", "actionButtonLabel", "summaryLabel", "layoutType"]
          },
          items: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                name: { type: Type.STRING },
                value: { type: Type.STRING },
                category: { type: Type.STRING },
                description: { type: Type.STRING },
                type: { type: Type.STRING, enum: ['text', 'number', 'date', 'textarea', 'currency', 'boolean'] }
              },
              required: ["id", "name", "category"]
            }
          }
        },
        required: ["context", "items"]
      }
    }
  });

  if (response.text) {
    try {
      return JSON.parse(response.text) as { items: GenericItem[], context: DocumentContext };
    } catch (e) {
      console.error("Failed to parse extracted data", e);
      return { 
        items: [], 
        context: { 
          detectedType: "Unknown", 
          appTitle: "Data Entry Portal", 
          actionButtonLabel: "Submit Data", 
          summaryLabel: "Fields",
          layoutType: 'form' 
        } 
      };
    }
  }
  return { 
    items: [], 
    context: { 
      detectedType: "Unknown", 
      appTitle: "Data Entry Portal", 
      actionButtonLabel: "Submit Data", 
      summaryLabel: "Fields",
      layoutType: 'form'
    } 
  };
};

const RULE_PROMPT = `Analyze the input business rule using the RAG logic engine.
Extract the threshold logic.
If the rule implies a discount/deduction, use 'threshold_discount'.
If the rule implies an action/flag/alert/waiver, use 'threshold_action'.
Capture the action name if applicable (e.g., "Free Shipping", "Manager Review").`;

const RULE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    type: { type: Type.STRING, enum: ["threshold_action", "threshold_discount"] },
    threshold: { type: Type.NUMBER },
    benefitValue: { type: Type.NUMBER },
    actionName: { type: Type.STRING },
    originalText: { type: Type.STRING }
  },
  required: ["type", "threshold", "benefitValue", "originalText"]
};

export const extractRuleFromAudio = async (base64Audio: string, mimeType: string): Promise<BusinessRule> => {
  const modelId = "gemini-2.5-flash";
  const response = await ai.models.generateContent({
    model: modelId,
    contents: { parts: [{ inlineData: { data: base64Audio, mimeType: mimeType } }, { text: RULE_PROMPT }] },
    config: { responseMimeType: "application/json", responseSchema: RULE_SCHEMA }
  });
  if (response.text) try { return JSON.parse(response.text); } catch (e) {}
  return getDefaultRule();
};

export const extractRuleFromText = async (textRule: string): Promise<BusinessRule> => {
  const modelId = "gemini-2.5-flash";
  const response = await ai.models.generateContent({
    model: modelId,
    contents: { parts: [{ text: `Rule: "${textRule}"\n\n${RULE_PROMPT}` }] },
    config: { responseMimeType: "application/json", responseSchema: RULE_SCHEMA }
  });
  if (response.text) try { return JSON.parse(response.text); } catch (e) {}
  return getDefaultRule();
};

function getDefaultRule(): BusinessRule {
  return { type: 'threshold_action', threshold: 1000000, benefitValue: 0, originalText: "No specific rule detected." };
}
