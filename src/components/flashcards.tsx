import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, RefreshCw, FileText } from "lucide-react";
import { Flashcard } from "@/lib/schemas";
import { useRouter } from "next/navigation";

type FlashcardsProps = {
  flashcards: Flashcard[];
  clearPDF: () => void;
  title: string;
  currentIndex?: number;
  onNext?: () => void;
  onPrevious?: () => void;
};

export default function Flashcards({
  flashcards,
  clearPDF,
  title = "Flashcards",
  currentIndex,
  onNext,
  onPrevious,
}: FlashcardsProps) {
  const [currentCardIndex, setCurrentCardIndex] = useState(currentIndex || 0);
  const [flipped, setFlipped] = useState(false);
  const [completed, setCompleted] = useState(false);
  const router = useRouter();

  const handleNextCard = () => {
    if (currentCardIndex < flashcards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setFlipped(false);
    } else {
      setCompleted(true);
    }
  };

  const handlePreviousCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setFlipped(false);
    }
  };

  const handleReset = () => {
    setCurrentCardIndex(0);
    setFlipped(false);
    setCompleted(false);
  };

  const handleFlip = () => {
    setFlipped(!flipped);
  };

  const handleNewPDF = () => {
    router.push('/api/quiz/page');
  };

  if (completed) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[100dvh] p-4">
        <div className="w-full max-w-md space-y-8 text-center">
          <h1 className="text-2xl font-bold">Flashcards Completed!</h1>
          <p className="text-muted-foreground">
            You&apos;ve gone through all the flashcards.
          </p>
          <div className="flex flex-col space-y-4">
            <Button onClick={handleReset} className="w-full">
              <RefreshCw className="mr-2 h-4 w-4" />
              Start Over
            </Button>
            <Button onClick={handleNewPDF} variant="outline" className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
              <FileText className="mr-2 h-4 w-4" />
              Upload New PDF
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!flashcards || flashcards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[100dvh] p-4">
        <div className="w-full max-w-md space-y-8 text-center">
          <h1 className="text-2xl font-bold">No Flashcards Available</h1>
          <p className="text-muted-foreground">
            There was an issue generating flashcards. Please try again.
          </p>
          <Button onClick={handleNewPDF} variant="outline" className="w-full">
            <FileText className="mr-2 h-4 w-4" />
            Upload New PDF
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">{title}</h1>
          <div className="text-sm text-muted-foreground">
            {currentCardIndex + 1} / {flashcards.length}
          </div>
        </div>

        <div 
          onClick={handleFlip}
          className="w-full aspect-[3/2] cursor-pointer perspective-1000"
        >
          <motion.div
            className="relative w-full h-full"
            initial={false}
            animate={{ rotateY: flipped ? 180 : 0 }}
            transition={{ duration: 0.6, type: "spring", stiffness: 300, damping: 30 }}
            style={{ transformStyle: "preserve-3d" }}
          >
            <div 
              className={`absolute w-full h-full flex items-center justify-center p-6 rounded-xl 
                bg-gradient-to-br from-white to-purple-50 dark:from-zinc-800 dark:to-purple-900/20
                shadow-lg border border-purple-200/50 dark:border-purple-500/20
                backface-hidden transform-gpu`}
            >
              <h2 className="text-xl font-semibold text-center bg-gradient-to-br from-purple-600 to-blue-600 bg-clip-text text-transparent">
                {flashcards[currentCardIndex].term}
              </h2>
            </div>
            <div 
              className={`absolute w-full h-full flex items-center justify-center p-6 rounded-xl 
                bg-gradient-to-br from-purple-50 to-white dark:from-purple-900/20 dark:to-zinc-800
                shadow-lg border border-purple-200/50 dark:border-purple-500/20
                backface-hidden transform-gpu`}
              style={{ transform: "rotateY(180deg)" }}
            >
              <p className="text-center text-purple-800 dark:text-purple-200">
                {flashcards[currentCardIndex].definition}
              </p>
            </div>
          </motion.div>
        </div>

        <p className="text-sm text-center text-purple-600 dark:text-purple-400">
          Click the card to flip it
        </p>

        <div className="flex justify-between w-full">
          <Button
            onClick={handlePreviousCard}
            disabled={currentCardIndex === 0}
            variant="outline"
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          <Button 
            onClick={handleNextCard}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            {currentCardIndex === flashcards.length - 1 ? "Finish" : "Next"}
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
} 