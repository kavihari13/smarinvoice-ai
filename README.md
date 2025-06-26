# 📄 Smart Invoice & Credit Note Extraction System (Firebase + Google Document AI)

An end-to-end AI-powered solution to extract invoice data and auto-generate credit notes using Firebase, Google Document AI, and Android.

---

## 🔧 Features

- 🤖 Google Document AI for PDF invoice parsing  
- ☁️ Firebase Storage for storing invoice/credit note files  
- 🔥 Cloud Functions for backend processing  
- 📘 Firestore for storing structured data  
- 📤 Auto-generated credit notes for approved returns  
- 📱 Android frontend integration (upload/view invoices, credit notes)

---

## 🧱 Tech Stack

| Component         | Tech                  |
|------------------|-----------------------|
| Cloud Functions   | Node.js (Firebase)    |
| OCR & Entity Extraction | Google Document AI |
| Database          | Firestore (NoSQL)     |
| File Storage      | Firebase Cloud Storage|
| PDF Generation    | PDFKit / pdf-lib      |
| Notifications     | Firebase Messaging / Twilio |

---

## 📂 Project Structure

functions/
├── index.js # Firebase Functions: invoice + credit note logic
├── service-account.json # Google Document AI credentials
├── utils/
│ └── pdfGenerator.js # Generates credit note PDFs
└── package.json # Dependencies


---

## 🛠️ Setup Instructions

### 1. Firebase Setup
- Create a Firebase project
- Enable:
  - Firestore
  - Cloud Functions
  - Firebase Storage
- Switch to **Blaze Plan**

### 2. Google Document AI Setup
- Enable **Document AI API** in GCP
- Create a **Form Parser Processor**
- Note the `processorId`, `projectId`, and `location`
- Download the **service account key JSON**

### 3. Clone & Configure

```bash
git clone https://github.com/your-repo/invoice-credit-note-system.git
cd functions
npm install

### 4.Update index.js:
const processorId = "YOUR_PROCESSOR_ID";
const projectId = "YOUR_PROJECT_ID";
const location = "us";
Add service-account.json file to functions/.

### 5. Deploy Functions
firebase deploy --only functions
