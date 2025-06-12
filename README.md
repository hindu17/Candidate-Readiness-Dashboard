# SKANJO CV Matcher

A smart AI-powered tool that matches a candidate’s CV with a job description using Google Gemini API.

🔗 **Live Demo**: [https://candidatereadinessdasboard.netlify.app/]

---

## 🔍 Features

- Paste  CV and JD
- Get match score and optimized CV
- Detect skill gaps with learning suggestions
- Download optimized CV as `.txt`
- Simulate assignment submission with feedback
- Responsive UI built with Tailwind CSS

---

## ⚙️ Tech Stack

- ReactJS
- Tailwind CSS
- Google Gemini API
- Netlify + Netlify Functions

---

## 🚀 Run Locally
# 1. Clone the repository
git clone https://github.com/hindu17/Candidate-Readiness-Dashboard

# 2. Navigate into the project
cd candidate-readiness-dashboard

# 3. Install dependencies
npm install

# 4. Create a .env file
 .env

Inside .env, add:

REACT_APP_GEMINI_API_KEY=your_actual_api_key_here

Then:
# 5. Start the development server
npm run dev

The app will run at: http://localhost:3000/

💡 Usage Instructions
Paste a CV and Job Description.

Click "Match & Score CV".

The Gemini AI API will:

Compare both inputs

Return a match score

Show skill gaps and recommendations

View results in the Score Display and Skill Gaps sections.


🤖 AI Integration
Used Google Gemini API via geminiAPI.js

Cleaned and formatted response using string parsing techniques

🎨 TailwindCSS Usage
Responsive layout with Tailwind (flex, grid, min-h-screen, etc.)

Used utility-first classes for a consistent look

## 📸 Screenshot

![Candidate Readiness Dashboard](.\public\screenshot.png)
