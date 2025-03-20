# PDF-to-Quiz Generator with Google Gemini  

An AI-powered learning tool that automatically converts PDF documents into interactive quizzes, flashcards, and matching exercises using Google's Gemini Pro AI model and Next.js.  

![PDF to Quiz Generator Screenshot](https://example.com/screenshot.png)  

## 🚀 Features  

- **📝 PDF Parsing:** Upload any PDF document to extract content for learning material generation.  
- **📚 Multiple Learning Formats:**  
  - **Quizzes:** Multiple-choice questions with automated grading.  
  - **Flashcards:** Term-definition pairs for effective memorization.  
  - **Matching Exercises:** Interactive matching items for relationship comprehension.  
- **⏳ Real-time Progress:** Live generation progress indicators.  
- **🎨 Modern UI:** Responsive design with animations and accessibility features.  
- **🧠 AI-Powered:** Leverages Google Gemini Pro for intelligent content analysis.  

## 🛠️ Technology Stack  

- **Frontend:** Next.js 14 with React 18  
- **AI Integration:** Vercel AI SDK with Google Gemini Pro  
- **Styling:** Tailwind CSS with custom animations  
- **Motion:** Framer Motion for smooth transitions  
- **PDF Processing:** Custom PDF parsing pipeline  
- **Validation:** Zod schema validation for AI responses  

## ⚙️ Getting Started  

### 📌 Prerequisites  

- **Node.js 18+** and npm/yarn  
- **Google Gemini API key**  

### 🏷️ Installation  

Clone the repository:  
```sh
git clone https://github.com/yourusername/pdf-to-quiz-googlegemini.git
cd pdf-to-quiz-googlegemini
```

Install dependencies:  
```sh
npm install
# or
yarn install
```

Create a `.env.local` file and add your API key:  
```sh
GOOGLE_GEMINI_API_KEY=your_api_key_here
```

Run the development server:  
```sh
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.  

## 🎯 Usage  

1. **Upload a PDF:** Drag and drop or select a PDF file (max size 10MB).  
2. **Select Format:** Choose between Quiz, Flashcards, or Matching exercises.  
3. **Wait for Generation:** The AI will process your document (typically 15-30 seconds).  
4. **Interact:** Use the generated learning materials directly in the browser.  
5. **Regenerate:** Generate new materials or try different formats with the same PDF.  

## 🔍 How It Works  

1. **PDF content is extracted and preprocessed.**  
2. **The content is sent to Google Gemini through server-side actions.**  
3. **AI analyzes the material and generates structured learning content.**  
4. **The application renders interactive components based on the AI response.**  
5. **Users can interact with the generated materials for learning.**  

## 🛠️ Challenges and Solutions  

- **📝 PDF Parsing:** Implemented robust text extraction with formatting preservation.  
- **🤖 AI Response Consistency:** Created structured schema validation to ensure quality.  
- **🖥️ User Experience:** Built a streaming progress system for long-running operations.  
- **⚡ Next.js Architecture:** Properly structured client/server components for optimal performance.  

## 📜 License  

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.  

## 🙌 Acknowledgements  

- **[Vercel](https://vercel.com/)** for the Next.js framework and AI SDK  
- **[Google](https://ai.google/) Gemini AI model**  
- **[Tailwind CSS](https://tailwindcss.com/)** for styling utilities  
- **[Framer Motion](https://www.framer.com/motion/)** for animations  

## 📞 Contact  

**Your Name** - [your.email@example.com](mailto:your.email@example.com)  

📌 **Project Link:** [GitHub Repository](https://github.com/yourusername/pdf-to-quiz-googlegemini)  

🚀 **Live Deployment:** [Vercel App](https://pdf-to-quiz-googlegemini.vercel.app)  
