import { Check, X } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Question } from '@/lib/schemas'


interface QuizReviewProps {
  questions: Question[]
  userAnswers: string[]
}

export default function QuizReview({ questions, userAnswers }: QuizReviewProps) {
  const answerLabels: ("A" | "B" | "C" | "D")[] = ["A", "B", "C", "D"]

  return (
    <Card className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm border-purple-200/50 dark:border-purple-500/20">
      <CardHeader>
        <CardTitle className="text-2xl font-bold bg-gradient-to-br from-purple-600 to-blue-600 bg-clip-text text-transparent">Quiz Review</CardTitle>
      </CardHeader>
      <CardContent>
        {questions.map((question, questionIndex) => (
          <div key={questionIndex} className="mb-8 last:mb-0">
            <h3 className="text-lg font-semibold mb-4 bg-gradient-to-br from-purple-600 to-blue-600 bg-clip-text text-transparent">
              {question.question}
            </h3>
            <div className="space-y-2">
              {question.options.map((option, optionIndex) => {
                const currentLabel = answerLabels[optionIndex]
                const isCorrect = currentLabel === question.answer
                const isSelected = currentLabel === userAnswers[questionIndex]
                const isIncorrectSelection = isSelected && !isCorrect

                return (
                  <div
                    key={optionIndex}
                    className={`flex items-center p-4 rounded-lg backdrop-blur-sm shadow-sm ${
                      isCorrect
                        ? 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-500'
                        : isIncorrectSelection
                        ? 'bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 border border-red-500'
                        : 'bg-white/80 dark:bg-zinc-900/80 border border-purple-200/50 dark:border-purple-500/20'
                    }`}
                  >
                    <span className={`text-lg font-medium mr-4 w-6 ${
                      isCorrect 
                        ? 'text-green-600 dark:text-green-400'
                        : isIncorrectSelection
                        ? 'text-red-600 dark:text-red-400'
                        : 'text-purple-600 dark:text-purple-400'
                    }`}>
                      {currentLabel}
                    </span>
                    <span className={`flex-grow ${
                      isCorrect 
                        ? 'text-green-700 dark:text-green-300'
                        : isIncorrectSelection
                        ? 'text-red-700 dark:text-red-300'
                        : 'text-foreground'
                    }`}>
                      {option}
                    </span>
                    {isCorrect && (
                      <Check className="ml-2 text-green-600 dark:text-green-400" size={20} />
                    )}
                    {isIncorrectSelection && (
                      <X className="ml-2 text-red-600 dark:text-red-400" size={20} />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

