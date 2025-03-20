"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { RotateCw, ArrowRight, ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

// Define question structure
interface Question {
  question: string;
  options: string[];
  answer: string;
}

interface FillInBlanksProps {
  title: string;
  questions: Question[];
  clearPDF: () => void;
}

export default function FillInBlanks({ title, questions, clearPDF }: FillInBlanksProps) {
  // State management
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [fixedCards, setFixedCards] = useState<string[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [points, setPoints] = useState(0);
  const router = useRouter();

  useEffect(() => {
    if (questions?.length) {
      setCurrentQuestion(questions[0]);
    }
  }, [questions]);

  // Handle card selection logic
  const handleCardClick = (word: string) => {
    if (selectedCards.includes(word)) {
      setSelectedCards(selectedCards.filter(w => w !== word));
    } else {
      if (selectedCards.length === 2) {
        setSelectedCards([selectedCards[1], word]);
      } else {
        setSelectedCards([...selectedCards, word]);
      }

      if (currentQuestion?.answer) {
        const answers = currentQuestion.answer.split(" ");
        const newSelected = selectedCards.length === 2 ? [selectedCards[1], word] : [...selectedCards, word];
        
        if (newSelected.length === 2 && answers.every(answer => newSelected.includes(answer))) {
          setFixedCards(answers);
          setPoints(points + 1);
        }
      }
    }
  };

  const checkAnswer = () => {
    if (!currentQuestion?.answer || !selectedCards.length) return false;
    return selectedCards.length === 2 && 
           currentQuestion.answer.split(" ").every(word => selectedCards.includes(word));
  };

  const resetGame = () => {
    setSelectedCards([]);
    setFixedCards([]);
    const nextQuestion = questions[Math.floor(Math.random() * questions.length)];
    setCurrentQuestion(nextQuestion);
  };

  const handleNewPDF = () => {
    // First try to clear the PDF if that function exists
    if (typeof clearPDF === 'function') {
      clearPDF();
    }
    
    // Then redirect to the home page
    router.push('/');
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Hero Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-white dark:from-zinc-900 dark:to-zinc-800">
        <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02]" />
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10" />
      </div>

      {/* Points Display */}
      <div className="absolute top-4 right-4 px-4 py-2 bg-white/10 backdrop-blur-sm border border-purple-200/20 dark:border-purple-800/20 rounded-lg shadow-lg">
        <span className="text-purple-600 dark:text-purple-400 font-medium">Points: {points}</span>
      </div>

      {/* Back Button */}
      <Button
        onClick={() => router.back()}
        variant="ghost"
        className="absolute top-4 left-4 text-purple-600 hover:text-purple-700 hover:bg-purple-600/10 dark:text-purple-400 dark:hover:text-purple-300 backdrop-blur-sm"
      >
        <ChevronLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      <div className="relative w-full max-w-4xl mx-auto p-4">
        {/* Title Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12 pt-16"
        >
          <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
            {title || "Fill in the Blanks"}
          </h2>
          <p className="text-xl bg-clip-text text-transparent bg-gradient-to-r from-purple-600/70 to-blue-600/70 mt-2">
            Select two cards to fill in the missing words
          </p>
        </motion.div>

        {/* Game Section */}
        <motion.div 
          className="space-y-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="bg-white/30 dark:bg-zinc-800/30 border border-purple-200/50 dark:border-purple-800/50 rounded-xl p-6 shadow-lg backdrop-blur-md">
            <p className="text-purple-900 dark:text-purple-100 mb-4 text-lg text-center font-medium">
              {currentQuestion?.question || "Loading question..."}
            </p>
            
            {/* Cards Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              {currentQuestion?.options.map((word, index) => (
                <motion.div
                  key={index}
                  className={`cursor-pointer p-4 rounded-xl text-center transition-all duration-300
                    ${selectedCards.includes(word)
                      ? checkAnswer()
                        ? 'bg-gradient-to-br from-green-500/20 to-green-600/20 border-green-500/50'
                        : 'bg-gradient-to-br from-purple-500/20 to-blue-500/20 border-purple-500/50'
                      : 'bg-white/40 dark:bg-zinc-900/40 border-purple-200/50 dark:border-purple-800/50 hover:border-purple-400/50'}
                    border backdrop-blur-sm hover:shadow-lg`}
                  onClick={() => !fixedCards.includes(word) && handleCardClick(word)}
                  whileHover={{ scale: fixedCards.includes(word) ? 1 : 1.02 }}
                  whileTap={{ scale: fixedCards.includes(word) ? 1 : 0.98 }}
                >
                  <p className={`text-sm md:text-base font-medium ${
                    selectedCards.includes(word)
                      ? checkAnswer()
                        ? 'text-green-600 dark:text-green-400'
                        : 'bg-clip-text text-transparent bg-gradient-to-br from-purple-600 to-blue-600'
                      : 'text-purple-900 dark:text-purple-100'
                  }`}>
                    {word}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Answer Feedback */}
            {selectedCards.length === 2 && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-6 text-center text-lg font-medium ${
                  checkAnswer() 
                    ? 'bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-green-600'
                    : 'bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-red-600'
                }`}
              >
                {checkAnswer() ? 'Correct!' : 'Try again!'}
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex justify-center mt-8 gap-4"
        >
          <Button
            onClick={handleNewPDF}
            variant="outline"
            className="border-purple-200/50 dark:border-purple-800/50 hover:bg-purple-50 dark:hover:bg-purple-900/20 text-purple-600 dark:text-purple-400 backdrop-blur-sm"
          >
            <RotateCw className="h-4 w-4 mr-2" />
            New PDF
          </Button>

          {checkAnswer() && (
            <Button
              onClick={resetGame}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-purple-500/25"
            >
              <ArrowRight className="h-4 w-4 mr-2" />
              Next Question
            </Button>
          )}
        </motion.div>
      </div>
    </div>
  );
}