import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Clock, RotateCcw, BookOpen, ChevronRight } from 'lucide-react';
import { useStats } from '@/contexts/StatsContext';
import { toast } from '@/hooks/use-toast';

const sampleQuestions = [
  {
    id: 1,
    question: "Which of the following is the brain of the computer?",
    options: ["ALU", "CPU", "Memory", "Control Unit"],
    correct: 1,
    topic: "Computer Fundamentals"
  },
  {
    id: 2,
    question: "What does HTML stand for?",
    options: ["Hyper Text Markup Language", "High Tech Modern Language", "Hyperlink Text Management Language", "Home Tool Markup Language"],
    correct: 0,
    topic: "Web Technology"
  },
  {
    id: 3,
    question: "Which key combination is used to paste text?",
    options: ["Ctrl + X", "Ctrl + C", "Ctrl + V", "Ctrl + P"],
    correct: 2,
    topic: "MS Office"
  },
  {
    id: 4,
    question: "What is the extension of Microsoft Word 2016 document?",
    options: [".doc", ".docx", ".txt", ".word"],
    correct: 1,
    topic: "MS Office"
  },
  {
    id: 5,
    question: "Which function key is used for spell check in MS Word?",
    options: ["F5", "F6", "F7", "F8"],
    correct: 2,
    topic: "MS Office"
  },
];

export default function MCQ() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(sampleQuestions.length).fill(null));
  const [isStarted, setIsStarted] = useState(false);
  const { incrementStat } = useStats();

  const question = sampleQuestions[currentQuestion];

  const handleSelect = (index: number) => {
    if (showResult) return;
    setSelectedAnswer(index);
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = index;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < sampleQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(answers[currentQuestion + 1]);
    } else {
      // Calculate score
      let correct = 0;
      answers.forEach((answer, index) => {
        if (answer === sampleQuestions[index].correct) {
          correct++;
        }
      });
      setScore(correct);
      setShowResult(true);
      incrementStat('mcqSets', 1);
      toast({
        title: "Quiz Completed!",
        description: `You scored ${correct} out of ${sampleQuestions.length}`,
      });
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
      setSelectedAnswer(answers[currentQuestion - 1]);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setAnswers(new Array(sampleQuestions.length).fill(null));
    setIsStarted(false);
  };

  if (!isStarted) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <div className="glass-card rounded-2xl p-8 md:p-12 animate-scale-in">
              <div className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-8 h-8 text-primary-foreground" />
              </div>
              <h1 className="text-3xl font-bold mb-4">MCQ Practice</h1>
              <p className="text-muted-foreground mb-8">
                Test your knowledge with objective questions covering Computer Fundamentals, MS Office, Web Technology, and more.
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-8 text-left">
                <div className="p-4 rounded-lg bg-secondary/50">
                  <p className="text-2xl font-bold text-primary">{sampleQuestions.length}</p>
                  <p className="text-sm text-muted-foreground">Questions</p>
                </div>
                <div className="p-4 rounded-lg bg-secondary/50">
                  <p className="text-2xl font-bold text-accent">No Limit</p>
                  <p className="text-sm text-muted-foreground">Time</p>
                </div>
              </div>

              <Button variant="hero" size="xl" onClick={() => setIsStarted(true)} className="w-full sm:w-auto">
                Start Quiz
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (showResult) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto">
            <div className="glass-card rounded-2xl p-8 text-center animate-scale-in">
              <div className="w-20 h-20 rounded-full gradient-bg flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-primary-foreground">{score}/{sampleQuestions.length}</span>
              </div>
              <h2 className="text-2xl font-bold mb-2">Quiz Completed!</h2>
              <p className="text-muted-foreground mb-8">
                You answered {score} out of {sampleQuestions.length} questions correctly.
              </p>

              <div className="space-y-4 mb-8">
                {sampleQuestions.map((q, index) => (
                  <div key={q.id} className={`p-4 rounded-lg text-left ${answers[index] === q.correct ? 'bg-accent/10 border border-accent/30' : 'bg-destructive/10 border border-destructive/30'}`}>
                    <div className="flex items-start gap-3">
                      {answers[index] === q.correct ? (
                        <CheckCircle className="w-5 h-5 text-accent mt-0.5 shrink-0" />
                      ) : (
                        <XCircle className="w-5 h-5 text-destructive mt-0.5 shrink-0" />
                      )}
                      <div>
                        <p className="font-medium text-sm">{q.question}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Correct: {q.options[q.correct]}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Button variant="hero" onClick={handleRestart}>
                <RotateCcw className="w-4 h-4" />
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Progress */}
          <div className="flex items-center justify-between mb-6">
            <span className="text-sm text-muted-foreground">
              Question {currentQuestion + 1} of {sampleQuestions.length}
            </span>
            <span className="px-3 py-1 rounded-full bg-secondary text-sm">{question.topic}</span>
          </div>
          
          <div className="h-2 bg-secondary rounded-full mb-8 overflow-hidden">
            <div 
              className="h-full gradient-bg transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / sampleQuestions.length) * 100}%` }}
            />
          </div>

          {/* Question Card */}
          <div className="glass-card rounded-2xl p-6 md:p-8 mb-6 animate-fade-in" key={question.id}>
            <h2 className="text-xl font-semibold mb-6">{question.question}</h2>
            
            <div className="space-y-3">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleSelect(index)}
                  className={`w-full p-4 rounded-xl text-left transition-all duration-200 border ${
                    selectedAnswer === index
                      ? 'bg-primary/10 border-primary text-foreground'
                      : 'bg-secondary/50 border-transparent hover:bg-secondary hover:border-border'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium ${
                      selectedAnswer === index
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-background'
                    }`}>
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span>{option}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="flex-1"
            >
              Previous
            </Button>
            <Button
              variant="hero"
              onClick={handleNext}
              disabled={selectedAnswer === null}
              className="flex-1"
            >
              {currentQuestion === sampleQuestions.length - 1 ? 'Finish' : 'Next'}
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
