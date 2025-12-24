import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import {
  Keyboard,
  Clock,
  Target,
  RotateCcw,
  Play,
  Pause,
  Check,
} from 'lucide-react';
import { useStats } from '@/contexts/StatsContext';
import { toast } from '@/hooks/use-toast';

const sampleTexts = {
  english: [
    'The quick brown fox jumps over the lazy dog. This sentence contains every letter of the alphabet at least once.',
    'Computer operators are responsible for ensuring smooth operation of computer systems in organizations.',
    "Nepal's government has been implementing various e-governance initiatives to improve public service delivery.",
    'Information technology plays a crucial role in modern administration and efficient record management.',
  ],
  nepali: [
    'नेपाल एक सुन्दर हिमाली राष्ट्र हो जुन दक्षिण एशियामा अवस्थित छ।',
    'कम्प्युटर अपरेटरहरूले सरकारी कार्यालयहरूमा महत्त्वपूर्ण भूमिका खेल्छन्।',
    'सूचना प्रविधिको विकासले हाम्रो जीवनशैलीमा ठूलो परिवर्तन ल्याएको छ।',
  ],
};

export default function Typing() {
  const [language, setLanguage] = useState<'english' | 'nepali'>('english');
  const [text, setText] = useState('');
  const [input, setInput] = useState('');
  const [isStarted, setIsStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [isComplete, setIsComplete] = useState(false);
  const { incrementStat } = useStats();

  useEffect(() => {
    const texts = sampleTexts[language];
    setText(texts[Math.floor(Math.random() * texts.length)]);
  }, [language]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isStarted && !isPaused && !isComplete && startTime) {
      interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        setElapsedTime(elapsed);

        const words = input.trim().split(/\s+/).length;
        const minutes = elapsed / 60;
        if (minutes > 0) {
          setWpm(Math.round(words / minutes));
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isStarted, isPaused, isComplete, startTime, input]);

  const handleStart = () => {
    setIsStarted(true);
    setIsPaused(false);
    setInput('');
    setIsComplete(false);
    setElapsedTime(0);
    setStartTime(Date.now());
  };

  const handlePause = () => setIsPaused(!isPaused);

  const handleReset = () => {
    setIsStarted(false);
    setIsPaused(false);
    setStartTime(null);
    setInput('');
    setElapsedTime(0);
    setWpm(0);
    setAccuracy(100);
    setIsComplete(false);
    const texts = sampleTexts[language];
    setText(texts[Math.floor(Math.random() * texts.length)]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (isPaused || isComplete) return;

    const newInput = e.target.value;
    setInput(newInput);

    let correct = 0;
    for (let i = 0; i < newInput.length; i++) {
      if (newInput[i] === text[i]) correct++;
    }

    const acc =
      newInput.length > 0
        ? Math.round((correct / newInput.length) * 100)
        : 100;

    setAccuracy(acc);

    if (newInput === text) {
      setIsComplete(true);
      const minutes = elapsedTime / 60;
      incrementStat('typingMinutes', Math.ceil(minutes));
      toast({
        title: 'Excellent!',
        description: `You completed the test with ${wpm} WPM and ${acc}% accuracy.`,
      });
    }
  };

  const formatTime = (seconds: number) =>
    `${Math.floor(seconds / 60)}:${(seconds % 60)
      .toString()
      .padStart(2, '0')}`;

  const getCharacterStatus = (index: number) => {
    if (index >= input.length) return 'pending';
    return input[index] === text[index] ? 'correct' : 'incorrect';
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-8 animate-fade-up">
          <h1 className="text-3xl font-bold mb-2">Typing Practice</h1>
          <p className="text-muted-foreground mb-3">
            Improve your typing speed for the practical exam
          </p>

          <p className="text-sm text-muted-foreground">
            Click on the links below for extra practice and make yourself better:
          </p>

          <div className="mt-2 flex gap-4">
            <a
              href="https://monkeytype.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
            >
              Monkeytype
            </a>
            <a
              href="https://sajilotyping.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
            >
              Sajilo Typing
            </a>
          </div>
        </div>

        {/* Language Toggle */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={language === 'english' ? 'default' : 'outline'}
            onClick={() => {
              setLanguage('english');
              handleReset();
            }}
          >
            English
          </Button>
          <Button
            variant={language === 'nepali' ? 'default' : 'outline'}
            onClick={() => {
              setLanguage('nepali');
              handleReset();
            }}
          >
            नेपाली
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="glass-card rounded-xl p-4 text-center">
            <Clock className="w-5 h-5 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold">{formatTime(elapsedTime)}</p>
            <p className="text-xs text-muted-foreground">Time</p>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <Keyboard className="w-5 h-5 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold">{wpm}</p>
            <p className="text-xs text-muted-foreground">WPM</p>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <Target className="w-5 h-5 text-accent mx-auto mb-2" />
            <p className="text-2xl font-bold">{accuracy}%</p>
            <p className="text-xs text-muted-foreground">Accuracy</p>
          </div>
        </div>

        {/* Typing Area */}
        <div className="glass-card rounded-xl p-6 mb-6">
          <div className="mb-6 p-4 rounded-lg bg-secondary/50 font-mono text-lg">
            {text.split('').map((char, index) => {
              const status = getCharacterStatus(index);
              return (
                <span
                  key={index}
                  className={
                    status === 'correct'
                      ? 'text-accent'
                      : status === 'incorrect'
                      ? 'text-destructive bg-destructive/20'
                      : index === input.length
                      ? 'bg-primary/20 animate-pulse'
                      : 'text-muted-foreground'
                  }
                >
                  {char}
                </span>
              );
            })}
          </div>

          {isStarted && !isComplete ? (
            <textarea
              value={input}
              onChange={handleInputChange}
              disabled={isPaused}
              autoFocus
              className="w-full h-32 p-4 rounded-lg bg-secondary font-mono text-lg resize-none"
              placeholder={isPaused ? 'Paused...' : 'Start typing...'}
            />
          ) : isComplete ? (
            <div className="text-center py-8">
              <Check className="w-10 h-10 text-accent mx-auto mb-2" />
              <p className="text-lg font-semibold">
                {wpm} WPM • {accuracy}% Accuracy
              </p>
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              Click Start to begin the typing test
            </p>
          )}

          <div className="flex justify-center gap-4 mt-6">
            {!isStarted ? (
              <Button variant="hero" onClick={handleStart}>
                <Play className="w-4 h-4" /> Start Test
              </Button>
            ) : !isComplete ? (
              <>
                <Button variant="outline" onClick={handlePause}>
                  {isPaused ? <Play /> : <Pause />}
                  {isPaused ? 'Resume' : 'Pause'}
                </Button>
                <Button variant="outline" onClick={handleReset}>
                  <RotateCcw /> Reset
                </Button>
              </>
            ) : (
              <Button variant="hero" onClick={handleReset}>
                <RotateCcw /> Try Again
              </Button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
