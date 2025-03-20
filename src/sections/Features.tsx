"use client";

import { motion } from "framer-motion";
import { Book, Brain, FileText, FlaskConical, Lightbulb, Puzzle } from "lucide-react";

const features = [
  {
    icon: <Book className="h-6 w-6" />,
    title: "Interactive Quizzes",
    description: "Transform any PDF into engaging multiple-choice quizzes. Test knowledge and track progress with instant feedback.",
    color: "from-purple-500 to-blue-500",
  },
  {
    icon: <FileText className="h-6 w-6" />,
    title: "Fill in the Blanks",
    description: "Generate contextual fill-in-the-blank exercises automatically from your documents for enhanced learning.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: <Brain className="h-6 w-6" />,
    title: "Smart Flashcards",
    description: "Create dynamic flashcards instantly. Perfect for memorization and quick revision sessions.",
    color: "from-cyan-500 to-teal-500",
  },
  {
    icon: <Puzzle className="h-6 w-6" />,
    title: "Matching Exercises",
    description: "Generate matching pairs exercises to test associations and relationships between concepts.",
    color: "from-teal-500 to-emerald-500",
  },
  {
    icon: <FlaskConical className="h-6 w-6" />,
    title: "AI-Powered Analysis",
    description: "Advanced AI algorithms analyze your PDFs to create the most relevant learning materials.",
    color: "from-emerald-500 to-green-500",
  },
  {
    icon: <Lightbulb className="h-6 w-6" />,
    title: "Instant Generation",
    description: "Get learning materials in seconds. Save hours of manual content creation time.",
    color: "from-green-500 to-purple-500",
  },
];

export default function Features() {
  return (
    <section id="features" className="relative py-20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(75%_75%_at_center_center,rgb(140,69,255,.5)_15%,rgb(14,0,36,.5)_78%,transparent)]" />
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        className="absolute w-[800px] h-[800px] border border-white/10 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      />

      {/* Content */}
      <div className="relative container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white via-purple-300 to-blue-300 text-transparent bg-clip-text"
          >
            Powerful Learning Tools
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg text-white/70 max-w-2xl mx-auto"
          >
            Transform your PDFs into interactive learning experiences with our suite of AI-powered tools
          </motion.p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="relative group"
            >
              <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 h-full">
                {/* Feature Icon */}
                <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>

                {/* Feature Content */}
                <h3 className="text-xl font-semibold mb-2 text-white group-hover:text-purple-300 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-white/70 group-hover:text-white/80 transition-colors">
                  {feature.description}
                </p>

                {/* Hover Effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Floating Orbs */}
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
          className="absolute w-32 h-32 rounded-full bg-gradient-to-r from-purple-500/20 to-transparent blur-xl top-20 right-[20%]"
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
          className="absolute w-40 h-40 rounded-full bg-gradient-to-r from-blue-500/20 to-transparent blur-xl bottom-20 left-[15%]"
        />
      </div>
    </section>
  );
}
