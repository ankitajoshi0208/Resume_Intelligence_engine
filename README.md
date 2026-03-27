#  Resume Intelligence Engine
**AI-Powered Resume Diagnostics & ATS Optimization**

The **Resume Intelligence Engine** is a specialized tool designed to help candidates optimize their resumes for modern **Applicant Tracking Systems (ATS)**. Built with a focus on AI/ML integration, it provides deep technical insights and strategic career coaching.

---

## 🌟 Key Features

* **ATS Compatibility Scoring:** Uses NLP to calculate a match percentage between your resume and a specific job description.
* **Keyword Gap Analysis:** Automatically identifies matched and missing technical keywords.
* **AI Evaluation:** Generates a professional profile title and identifies core strengths.
* **Strategic Advice:** Provides actionable steps to improve your resume's impact.
* **Modern Glassmorphism UI:** A sleek, high-performance dashboard built with React and custom CSS animations.

---

## 🛠️ Technical Architecture

### **Backend (Spring Boot)**
* **Java 21 / Spring Boot 3.2.x:** High-performance RESTful API.
* **OpenRouter / Gemini AI:** Advanced Large Language Model integration for resume reasoning.
* **Apache Tika:** Sophisticated document parsing for PDF/Docx support.
* **Maven:** Robust dependency management.

### **Frontend (React)**
* **React.js:** Component-driven UI development.
* **Styled Components:** Custom-themed UI with "Syne" and "Instrument Sans" typography.
* **Dynamic Graphics:** SVG-based score rings and animated background blobs.

---

## 🚀 Getting Started

### **1. Backend Setup (IntelliJ IDEA)**
1.  Open the `Resume_Analyzer` project in IntelliJ.
2.  Navigate to `src/main/resources/application.yml`.
3.  Insert your API Key:
    ```yaml
    openrouter:
      api:
        key: YOUR_API_KEY_HERE
    ```
4.  Run `ResumeAiApplication.java`. (Server starts on port **8080**).

### **2. Frontend Setup (Terminal)**
1.  Open your terminal in the `frontend-react` folder.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Launch the app:
    ```bash
    npm start
    ```
4.  Visit `http://localhost:3000` in your browser.

---



## 📊 How It Works


1.  **Text Extraction:** The engine parses your resume using Apache Tika to extract raw technical data.
2.  **Entity Matching:** The ATSService compares resume tokens against job requirements using localized NLP logic.
3.  **LLM Reasoning:** The AIService sends the extracted data to Gemini 2.0 to generate qualitative feedback.
4.  **UI Rendering:** The React frontend maps the JSON response into interactive diagnostic cards.

---

## UI
<img width="1335" height="604" alt="image" src="https://github.com/user-attachments/assets/43b78fe4-6409-4690-9283-d5f3f39997fd" />

<img width="1105" height="485" alt="image" src="https://github.com/user-attachments/assets/7850d1aa-82f9-4dc0-9b64-d0f617bbc4e8" /><img width="558" height="455" alt="image" src="https://github.com/user-attachments/assets/87ac33af-d416-4231-839f-506429461735" />

<img width="1078" height="574" alt="image" src="https://github.com/user-attachments/assets/579ca78b-e036-4f51-a60c-1021e6677f01" />

<img width="496" height="565" alt="image" src="https://github.com/user-attachments/assets/ad67fb63-d24a-4764-be43-6471d263086f" />



## 👩‍💻 Developer
**Ankita Joshi** *Bachelor of Engineering - CSE (AIML)* *Chandigarh University*

---

### **License**
This project was developed for educational and professional demonstration purposes.
