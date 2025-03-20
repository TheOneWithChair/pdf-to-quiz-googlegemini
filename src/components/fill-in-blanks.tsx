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

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-white dark:from-zinc-900 dark:to-zinc-800 p-4">
      <div className="absolute top-4 right-4 px-4 py-2 bg-purple-600/10 dark:bg-purple-400/10 rounded-lg">
        <span className="text-purple-600 dark:text-purple-400 font-medium">Points: {points}</span>
      </div>

      <Button
        onClick={() => router.back()}
        variant="ghost"
        className="absolute top-4 left-4 text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
      >
        <ChevronLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      <div className="w-full max-w-4xl">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
            {title || "Fill in the Blanks"}
          </h2>
          <p className="text-xl text-purple-600/70 dark:text-purple-400/70 mt-2">
            Select two cards to fill in the missing words
          </p>
        </motion.div>

        <motion.div 
          className="space-y-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="bg-white/50 dark:bg-zinc-800/50 border border-purple-200/50 dark:border-purple-800/50 rounded-xl p-6 shadow-lg backdrop-blur-sm">
            <p className="text-purple-900 dark:text-purple-100 mb-4 text-lg text-center">
              {currentQuestion?.question || "Loading question..."}
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              {currentQuestion?.options.map((word, index) => (
                <motion.div
                  key={index}
                  className={`cursor-pointer p-4 rounded-xl text-center transition-all duration-300
                    ${selectedCards.includes(word)
                      ? checkAnswer()
                        ? 'bg-green-500/10 border-green-500/50 shadow-green-500/10'
                        : 'bg-purple-500/10 border-purple-500/50 shadow-purple-500/10'
                      : 'bg-white/50 dark:bg-zinc-900/50 border-purple-200/50 dark:border-purple-800/50 hover:border-purple-400/50'}
                    border backdrop-blur-sm`}
                  onClick={() => !fixedCards.includes(word) && handleCardClick(word)}
                  whileHover={{ scale: fixedCards.includes(word) ? 1 : 1.05 }}
                  whileTap={{ scale: fixedCards.includes(word) ? 1 : 0.95 }}
                >
                  <p className={`text-sm md:text-base ${
                    selectedCards.includes(word)
                      ? checkAnswer()
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-purple-600 dark:text-purple-400'
                      : 'text-purple-900 dark:text-purple-100'
                  }`}>
                    {word}
                  </p>
                </motion.div>
              ))}
            </div>

            {selectedCards.length === 2 && (
              <div className={`mt-6 text-center text-lg ${
                checkAnswer() ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {checkAnswer() ? 'Correct!' : 'Try again!'}
              </div>
            )}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex justify-center mt-8 gap-4"
        >
          <Button
            onClick={clearPDF}
            variant="ghost"
            className="text-purple-600 hover:text-purple-700 hover:bg-purple-600/10 dark:text-purple-400 dark:hover:text-purple-300 dark:hover:bg-purple-400/10"
          >
            <RotateCw className="h-4 w-4 mr-2" />
            New PDF
          </Button>

          {checkAnswer() && (
            <Button
              onClick={resetGame}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
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