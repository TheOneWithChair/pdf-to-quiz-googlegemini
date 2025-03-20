"use client";

import { useState } from "react";
import { experimental_useObject } from "ai/react";
import { questionsSchema, flashcardsSchema, matchingExerciseSchema } from "@/lib/schemas";
import { z } from "zod";
import { toast } from "sonner";
import { FileUp, Plus, Loader2, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Quiz from "@/components/quiz";
import Flashcards from "@/components/flashcards";
import Matching from "@/components/matching";
import { Link } from "@/components/ui/link";
import NextLink from "next/link";
import { generateQuizTitle, generateFlashcardsTitle, generateMatchingTitle } from "../(preview)/actions";
import { AnimatePresence, motion } from "framer-motion";
import { VercelIcon, GitIcon } from "@/components/icons";
import FillInBlanks from "@/components/fill-in-blanks";
import StartsBg from "@/assets/stars.png";

interface FlashcardsProps {
  title: string;
  flashcards: Array<{ term: string; definition: string; }>;
  clearPDF: () => void;
  currentIndex: number;  // Add this
  onNext: () => void;    // Add this
  onPrevious: () => void; // Add this
}

export default function ChatWithFiles() {
  const [files, setFiles] = useState<File[]>([]);
  const [questions, setQuestions] = useState<z.infer<typeof questionsSchema>>(
    [],
  );
  const [flashcards, setFlashcards] = useState<z.infer<typeof flashcardsSchema>>(
    [],
  );
  const [matchingItems, setMatchingItems] = useState<z.infer<typeof matchingExerciseSchema>>(
    [],
  );
  const [fillInBlanksQuestions, setFillInBlanksQuestions] = useState<any[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [title, setTitle] = useState<string>();
  const [flashcardsTitle, setFlashcardsTitle] = useState<string>();
  const [matchingTitle, setMatchingTitle] = useState<string>();
  const [fillInBlanksTitle, setFillInBlanksTitle] = useState<string>();
  const [activeTab, setActiveTab] = useState<'quiz' | 'flashcards' | 'matching' | 'fillInBlanks'>('quiz');
  const [score, setScore] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  const {
    submit: submitQuiz,
    object: partialQuestions,
    isLoading: isLoadingQuiz,
  } = experimental_useObject({
    api: "/api/generate-quiz",
    schema: questionsSchema,
    initialValue: [],
    onError: (error) => {
      console.error("Quiz generation error:", error);
      toast.error("Failed to generate quiz. Please try again.");
      setFiles([]);
    },
    onFinish: ({ object }) => {
      if (object && object.length > 0) {
        setQuestions(object);
        toast.success(`Generated ${object.length} questions successfully!`);
      } else {
        toast.error("No questions were generated. Please try again.");
      }
    },
  });

  const {
    submit: submitFlashcards,
    object: partialFlashcards,
    isLoading: isLoadingFlashcards,
  } = experimental_useObject({
    api: "/api/generate-flashcards",
    schema: flashcardsSchema,
    initialValue: undefined,
    onError: (error) => {
      toast.error("Failed to generate flashcards. Please try again.");
      setFiles([]);
    },
    onFinish: ({ object }) => {
      setFlashcards(object ?? []);
    },
  });

  const {
    submit: submitMatching,
    object: partialMatching,
    isLoading: isLoadingMatching,
  } = experimental_useObject({
    api: "/api/generate-matching",
    schema: matchingExerciseSchema,
    initialValue: undefined,
    onError: (error) => {
      toast.error("Failed to generate matching exercise. Please try again.");
      setFiles([]);
    },
    onFinish: ({ object }) => {
      setMatchingItems(object ?? []);
    },
  });

  const {
    submit: submitFillInBlanks,
    object: partialFillInBlanks,
    isLoading: isLoadingFillInBlanks,
  } = experimental_useObject({
    api: "/api/generate-fillintheblanks",
    schema: z.array(z.object({
      question: z.string(),
      options: z.array(z.string()),
      answer: z.string()
    })),
    initialValue: [],
    onError: (error) => {
      toast.error("Failed to generate fill-in-the-blanks. Please try again.");
      setFiles([]);
    },
    onFinish: ({ object }) => {
      if (object && object.length > 0) {
        setFillInBlanksQuestions(object);
        toast.success(`Generated ${object.length} fill-in-the-blanks questions!`);
      } else {
        toast.error("No fill-in-the-blanks questions were generated. Please try again.");
      }
    },
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    const file = files[0];
    if (file.type !== "application/pdf") {
      toast.error("Please upload a PDF file");
      return;
    }

    setFiles([file]);
  };

  const encodeFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (typeof reader.result === "string") {
          resolve(reader.result.split(",")[1]);
        } else {
          reject(new Error("Failed to encode file"));
        }
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmitWithFiles = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (files.length === 0) {
      toast.error("Please upload a PDF file first");
      return;
    }

    try {
      const encodedFiles = await Promise.all(
        files.map(async (file) => ({
          name: file.name,
          type: file.type,
          data: await encodeFileAsBase64(file),
        })),
      );

      // Set default titles based on file name
      const fileName = files[0].name.replace('.pdf', '');
      setTitle(`Quiz: ${fileName}`);
      setFlashcardsTitle(`Flashcards: ${fileName}`);
      setMatchingTitle(`Matching Exercise: ${fileName}`);

      // Try to generate AI titles in the background
      generateQuizTitle(files[0].name).then(setTitle).catch(() => {});
      generateFlashcardsTitle(files[0].name).then(setFlashcardsTitle).catch(() => {});
      generateMatchingTitle(files[0].name).then(setMatchingTitle).catch(() => {});

      const payload = { files: encodedFiles };
      
      if (activeTab === 'quiz') {
        submitQuiz(payload);
        toast.success('Quiz generation started!');
      } else if (activeTab === 'flashcards') {
        submitFlashcards(payload);
        toast.success('Flashcards generation started!');
      } else if (activeTab === 'matching') {
        submitMatching(payload);
        toast.success('Matching exercise generation started!');
      } else if (activeTab === 'fillInBlanks') {
        submitFillInBlanks(payload);
        toast.success('Fill-in-the-blanks generation started!');
      }
    } catch (error) {
      console.error('Error processing file:', error);
      toast.error('Failed to process file. Please try again.');
    }
  };

  const clearPDF = () => {
    setFiles([]);
    setQuestions([]);
    setFlashcards([]);
    setMatchingItems([]);
    setFillInBlanksQuestions([]);
  };

  const progressQuiz = partialQuestions ? (partialQuestions.length / 4) * 100 : 0;
  const progressFlashcards = partialFlashcards ? (partialFlashcards.length / 8) * 100 : 0;
  const progressMatching = partialMatching ? (partialMatching.length / 6) * 100 : 0;

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex < flashcards.length - 1 ? prevIndex + 1 : 0
    );
  };
  

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : flashcards.length - 1
    );
  };
  

  if (activeTab === 'quiz' && questions.length > 0) {
    return (
      <div className="relative min-h-[100dvh] w-full overflow-hidden">
        {/* Background with stars and gradient */}
        <motion.div
          className="fixed inset-0 z-0"
          style={{
            backgroundImage: `url(${StartsBg.src})`,
            backgroundSize: 'cover',
          }}
          animate={{
            backgroundPositionX: StartsBg.width,
          }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 110,
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(75%_75%_at_center_center,rgb(140,69,255,.5)_15%,rgb(14,0,36,.5)_78%,transparent)] z-0" />
        <Quiz title={title ?? "Quiz"} questions={questions} clearPDF={clearPDF} />
      </div>
    );
  }

  if (activeTab === 'flashcards' && flashcards && flashcards.length > 0) {
    return (
      <div className="relative min-h-[100dvh] w-full overflow-hidden">
        {/* Background with stars and gradient */}
        <motion.div
          className="fixed inset-0 z-0"
          style={{
            backgroundImage: `url(${StartsBg.src})`,
            backgroundSize: 'cover',
          }}
          animate={{
            backgroundPositionX: StartsBg.width,
          }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 110,
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(75%_75%_at_center_center,rgb(140,69,255,.5)_15%,rgb(14,0,36,.5)_78%,transparent)] z-0" />
        
        {/* Back Button */}
        <NextLink 
          href="/"
          className="fixed top-6 left-6 z-50"
          onClick={clearPDF}
        >
          <Button
            variant="ghost"
            className="group bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-sm text-purple-200 hover:text-white rounded-full px-4 py-2 transition-all duration-200"
          >
            <ChevronLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
            Back
          </Button>
        </NextLink>

        {/* Flashcards Component */}
        <div className="relative z-10">
          <Flashcards 
            title={flashcardsTitle ?? "Flashcards"} 
            flashcards={flashcards} 
            clearPDF={clearPDF}
            currentIndex={currentIndex} 
            onNext={handleNext} 
            onPrevious={handlePrevious}
          />
        </div>
      </div>
    );
  }

  if (activeTab === 'matching' && matchingItems && matchingItems.length > 0) {
    return (
      <div className="relative min-h-[100dvh] w-full overflow-hidden">
        {/* Background with stars and gradient */}
        <motion.div
          className="fixed inset-0 z-0"
          style={{
            backgroundImage: `url(${StartsBg.src})`,
            backgroundSize: 'cover',
          }}
          animate={{
            backgroundPositionX: StartsBg.width,
          }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 110,
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(75%_75%_at_center_center,rgb(140,69,255,.5)_15%,rgb(14,0,36,.5)_78%,transparent)] z-0" />
        
        {/* Back Button */}
        <NextLink 
          href="/"
          className="fixed top-6 left-6 z-50"
        >
          <Button
            variant="ghost"
            className="group bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-sm text-purple-200 hover:text-white rounded-full px-4 py-2 transition-all duration-200"
          >
            <ChevronLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
            Back
          </Button>
        </NextLink>

        {/* Matching Component */}
        <div className="relative z-10">
          <Matching title={matchingTitle ?? "Matching Exercise"} matchingItems={matchingItems} clearPDF={clearPDF} />
        </div>
      </div>
    );
  }

  if (activeTab === 'fillInBlanks' && fillInBlanksQuestions.length > 0) {
    return (
      <div className="relative min-h-[100dvh] w-full overflow-hidden">
        {/* Background with stars and gradient */}
        <motion.div
          className="fixed inset-0 z-0"
          style={{
            backgroundImage: `url(${StartsBg.src})`,
            backgroundSize: 'cover',
          }}
          animate={{
            backgroundPositionX: StartsBg.width,
          }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 110,
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(75%_75%_at_center_center,rgb(140,69,255,.5)_15%,rgb(14,0,36,.5)_78%,transparent)] z-0" />
        <FillInBlanks title={fillInBlanksTitle ?? "Fill in the Blanks"} questions={fillInBlanksQuestions} clearPDF={clearPDF} />
      </div>
    );
  }

  return (
    <div className="relative min-h-[100dvh] w-full flex justify-center overflow-hidden">
      {/* Background with stars and gradient */}
      <motion.div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `url(${StartsBg.src})`,
          backgroundSize: 'cover',
        }}
        animate={{
          backgroundPositionX: StartsBg.width,
        }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: 110,
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(75%_75%_at_center_center,rgb(140,69,255,.5)_15%,rgb(14,0,36,.5)_78%,transparent)] z-0"></div>

      {/* Back Button */}
      <NextLink 
        href="/"
        className="fixed top-6 left-6 z-20"
      >
        <Button
          variant="ghost"
          className="group bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-sm text-purple-200 hover:text-white rounded-full px-4 py-2 transition-all duration-200"
        >
          <ChevronLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
          Back
        </Button>
      </NextLink>

      {/* Animated rings */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        className="fixed w-[800px] h-[800px] border border-white/10 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
        className="fixed w-[1000px] h-[1000px] border border-white/5 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0"
      />

      <AnimatePresence>
        {isDragging && (
          <motion.div
            className="fixed pointer-events-none bg-zinc-900/90 h-dvh w-dvw z-10 justify-center items-center flex flex-col gap-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="text-purple-300">Drag and drop files here</div>
            <div className="text-sm text-purple-400">
              {"(PDFs only)"}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-2xl m-4"
      >
        <div className="backdrop-blur-xl bg-gradient-to-br from-white/10 via-purple-500/5 to-blue-500/5 border border-white/10 rounded-2xl shadow-[0_0_50px_rgba(140,69,255,0.1)] overflow-hidden">
          <form onSubmit={handleSubmitWithFiles} className="space-y-6">
            <div className="p-8 text-center space-y-6 bg-gradient-to-b from-purple-500/10 via-purple-400/5 to-transparent">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tighter bg-gradient-to-r from-white via-purple-300 to-blue-300 text-transparent bg-clip-text">
                PDF Learning Tools
              </h1>
              <p className="text-lg md:text-xl max-w-xl mx-auto text-white/70">
                Upload a PDF to generate interactive learning tools based on its content
              </p>
            </div>

            <div className="px-8 space-y-6">
              <div className="flex justify-center gap-2 flex-wrap">
                {['quiz', 'flashcards', 'matching', 'fillInBlanks'].map((tab) => (
                  <Button
                    key={tab}
                    type="button"
                    variant={activeTab === tab ? 'default' : 'secondary'}
                    onClick={() => setActiveTab(tab as any)}
                    className={`
                      ${activeTab === tab 
                        ? 'bg-gradient-to-r from-purple-400 via-purple-500 to-blue-500 hover:from-purple-500 hover:via-purple-600 hover:to-blue-600 text-white border-0 shadow-[0_0_20px_rgba(140,69,255,0.3)]' 
                        : 'bg-white/5 hover:bg-white/10 text-purple-200 border border-white/10'}
                      transition-all duration-300 transform hover:scale-105
                    `}
                  >
                    {tab === 'quiz' ? 'Quiz' : 
                     tab === 'flashcards' ? 'Flashcards' : 
                     tab === 'matching' ? 'Matching' : 'Fill in Blanks'}
                  </Button>
                ))}
              </div>

              <div>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  id="pdf-upload"
                />
                <div 
                  className="border-2 border-dashed border-purple-500/20 rounded-2xl p-8 text-center cursor-pointer 
                    hover:border-purple-500/40 transition-all duration-300 
                    bg-gradient-to-br from-purple-500/5 via-blue-500/5 to-transparent 
                    backdrop-blur-sm hover:shadow-[0_0_30px_rgba(140,69,255,0.1)]"
                  onClick={() => document.getElementById('pdf-upload')?.click()}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.add('border-purple-500');
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.remove('border-purple-500');
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.remove('border-purple-500');
                    const droppedFiles = e.dataTransfer.files;
                    if (droppedFiles[0]?.type !== "application/pdf") {
                      toast.error("Please upload a PDF file");
                      return;
                    }
                    handleFileChange({
                      target: { files: droppedFiles },
                    } as React.ChangeEvent<HTMLInputElement>);
                  }}
                >
                  {files.length > 0 ? (
                    <div className="flex items-center justify-center gap-2 text-purple-300">
                      <FileUp className="h-6 w-6" />
                      <span>{files[0].name}</span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <FileUp className="h-8 w-8 mx-auto text-purple-400" />
                      <p className="text-purple-200">Drag and drop your PDF here, or click to browse</p>
                      <p className="text-sm text-purple-400">PDF files only</p>
                    </div>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                disabled={files.length === 0 || isLoadingQuiz || isLoadingFlashcards || isLoadingMatching || isLoadingFillInBlanks}
                className="w-full bg-gradient-to-r from-purple-400 via-purple-500 to-blue-500 
                  hover:from-purple-500 hover:via-purple-600 hover:to-blue-600 
                  text-white font-medium py-6 rounded-xl 
                  disabled:opacity-50 disabled:cursor-not-allowed 
                  transition-all duration-300 transform hover:scale-[1.02] 
                  shadow-[0_0_20px_rgba(140,69,255,0.2)] 
                  hover:shadow-[0_0_30px_rgba(140,69,255,0.3)]"
              >
                {isLoadingQuiz || isLoadingFlashcards || isLoadingMatching || isLoadingFillInBlanks ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Generating...</span>
                  </div>
                ) : (
                  `Generate ${activeTab === 'quiz' ? 'Quiz' : activeTab === 'flashcards' ? 'Flashcards' : activeTab === 'matching' ? 'Matching Exercise' : 'Fill in Blanks'}`
                )}
              </Button>
            </div>

            {/* Progress bars with updated styling */}
            {(isLoadingQuiz && activeTab === 'quiz' && progressQuiz > 0) && (
              <div className="px-8 pb-8 space-y-2">
                <div className="flex justify-between text-sm text-purple-300">
                  <span>Generating quiz...</span>
                  <span>{Math.round(progressQuiz)}%</span>
                </div>
                <div className="h-2 bg-purple-900/20 rounded-full overflow-hidden backdrop-blur-sm border border-white/5">
                  <motion.div
                    className="h-full bg-gradient-to-r from-purple-400 via-purple-500 to-blue-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressQuiz}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            )}

            {/* Similar progress styling for other types */}
            {(isLoadingFillInBlanks && activeTab === 'fillInBlanks' && partialFillInBlanks && partialFillInBlanks.length > 0) && (
              <div className="px-8 pb-8 space-y-2">
                <div className="flex justify-between text-sm text-purple-300">
                  <span>Generating fill-in-the-blanks...</span>
                  <span>{Math.round((partialFillInBlanks.length / 5) * 100)}%</span>
                </div>
                <div className="h-2 bg-purple-900/20 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${(partialFillInBlanks.length / 5) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            )}
          </form>
        </div>
      </motion.div>

      <motion.div
        className="fixed bottom-6 flex flex-row gap-4 items-center justify-between z-10"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <NextLink
          target="_blank"
          href="https://github.com/vercel-labs/ai-sdk-preview-pdf-support"
          className="flex flex-row gap-2 items-center border border-white/10 px-4 py-2 rounded-full hover:bg-white/5 transition-colors backdrop-blur-sm text-purple-200"
        >
          <GitIcon />
          View Source Code
        </NextLink>

        <NextLink
          target="_blank"
          href="https://vercel.com/templates/next.js/ai-quiz-generator"
          className="flex flex-row gap-2 items-center bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 px-4 py-2 rounded-full text-white transition-colors"
        >
          <VercelIcon size={14} />
          Deploy with Vercel
        </NextLink>
      </motion.div>

      {/* Floating orbs */}
      <motion.div
        animate={{ 
          y: [0, -20, 0],
          opacity: [0.5, 0.8, 0.5]
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="fixed w-32 h-32 rounded-full bg-gradient-to-r from-purple-500/20 to-transparent blur-xl top-20 right-[20%] z-0"
      />
      <motion.div
        animate={{ 
          y: [0, 20, 0],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="fixed w-40 h-40 rounded-full bg-gradient-to-r from-blue-500/20 to-transparent blur-xl bottom-20 left-[15%] z-0"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-6 right-6 backdrop-blur-xl bg-white/5 border border-white/10 rounded-full px-6 py-3"
      >
        <p className="text-purple-200">
          Score: <span className="text-white font-bold">{score}</span>
        </p>
      </motion.div>
    </div>
  );
} 