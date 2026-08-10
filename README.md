<div align="center">

<img width="1428" alt="VibeShift — Industrial AI Architect" src="https://github.com/user-attachments/assets/0712668e-f8f9-4fe5-b5c8-4f75ed0d4bfd" />

# ⚡ VibeShift — AI Digitalizer

### Turn any document into a production-ready web app. No code. No setup. Just upload.

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-vibeshift--ai--digitalizer.vercel.app-6C47FF?style=for-the-badge)](https://vibeshift-ai-digitalizer.vercel.app)
[![Demo Video](https://img.shields.io/badge/🎬_Demo_Video-Watch_Now-FF0000?style=for-the-badge)](https://drive.google.com/file/d/1QY5M4Jd74g5-qCXYrwLdcC3yz9gWnXNj/view?usp=sharing)

![React](https://img.shields.io/badge/React_19-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Gemini AI](https://img.shields.io/badge/Google_Gemini-8E75B2?style=flat-square&logo=googlegemini&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=flat-square&logo=firebase&logoColor=black)
![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?style=flat-square&logo=vercel&logoColor=white)

</div>

---

## 🚀 What is VibeShift?

**VibeShift** is an autonomous AI architect that converts real-world documents — menus, forms, catalogs, registers — into **live, working web applications in minutes**.

Upload a photo of a restaurant menu → get a full online ordering portal.
Upload a paper admission form → get a digital form with validation and a database.
Upload a product catalog → get an e-commerce storefront with a shopping cart.

The **Autonomous Decision Engine** detects the document's *intent* and builds the right kind of app automatically — structure, UI, and data layer included.

## ✨ Key Features

| Feature | Description |
|---|---|
| 🧠 **Autonomous Decision Engine** | Gemini AI analyzes the document and decides what app to build — no prompts needed |
| 📸 **Document → App** | Upload an image, PDF, or scan; get a deployed application |
| 🛒 **Smart Intent Detection** | Menus become ordering portals, forms become digital forms, catalogs become stores |
| 📊 **Analytics Dashboard** | Live charts and insights for your generated apps |
| 🤖 **Built-in AI Chatbot** | Conversational assistant integrated into every generated app |
| 🔄 **Workflow Agent** | Automates multi-step processes end to end |
| 🎨 **3D Interactive UI** | Modern landing experience with 3D cards and stage effects |
| 🔐 **Auth & Firestore** | Optional Firebase authentication and real-time data storage |

## 🎯 See It In Action

### Step 1 — Upload a document (a restaurant menu)

<div align="center">
  <img width="400" alt="Sample Restaurant Menu" src="https://github.com/user-attachments/assets/3d66c02d-d1f0-4d60-a745-50b81dbc9b96" />
</div>

### Step 2 — VibeShift builds the app automatically

The engine detects the **E-commerce / Ordering** intent and deploys a full ordering portal — selectable items, live shopping cart, instant online ordering. Zero code written.

<div align="center">
  <img width="600" alt="Generated Ordering App" src="https://github.com/user-attachments/assets/ef150320-f3b9-47ca-8a7d-aa17365aea01" />
</div>

<div align="center">

**🔥 [Try it live →](https://vibeshift-ai-digitalizer.vercel.app)** &nbsp;•&nbsp; **🎬 [Watch the demo video →](https://drive.google.com/file/d/1QY5M4Jd74g5-qCXYrwLdcC3yz9gWnXNj/view?usp=sharing)**

</div>

## 🛠️ Tech Stack

- **Frontend:** React 19 + TypeScript + Vite 6
- **Styling:** Tailwind CSS 4, Motion (animations), Lucide icons
- **AI:** Google Gemini (`@google/genai`)
- **Charts:** Recharts
- **Backend:** Firebase / Firestore (optional)
- **Hosting:** Vercel

## ⚙️ Run Locally

```bash
# 1. Clone the repo
git clone https://github.com/vaibhav410/VibeShift-AI-Digitalizer.git
cd VibeShift-AI-Digitalizer

# 2. Install dependencies
npm install

# 3. Add your Gemini API key
cp .env.example .env.local
# then edit .env.local and set GEMINI_API_KEY=your_key_here

# 4. Start the dev server
npm run dev
```

Open **http://localhost:3000** — you're live. 🎉

> Get a free Gemini API key at [Google AI Studio](https://aistudio.google.com/apikey).

## 📁 Project Structure

```
├── App.tsx                 # Main application shell & routing
├── components/
│   ├── LandingPage.tsx     # 3D animated landing experience
│   ├── UploadDashboard.tsx # Document upload & processing
│   ├── AnalysisReview.tsx  # AI analysis review step
│   ├── FormPreview.tsx     # Generated app preview
│   ├── AnalyticsDashboard.tsx
│   ├── Chatbot.tsx         # Integrated AI assistant
│   ├── WorkflowAgent.tsx   # Multi-step automation agent
│   └── ...
├── services/gemini.ts      # Gemini AI service layer
├── firebase.ts             # Firestore integration
└── firestore.rules         # Database security rules
```

## 🌍 Why It Matters

In many colleges and local communities, essential processes still run on paper — admission forms, canteen menus, event registrations. VibeShift removes the technical barrier entirely: **if you can take a photo, you can launch an app.**

---

<div align="center">

Built with ❤️ by **[Vaibhav Kumar Kanojia](https://github.com/vaibhav410)**

⭐ Star this repo if you find it useful!

</div>
