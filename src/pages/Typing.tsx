import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Keyboard, Clock, Target, RotateCcw, Play, Pause, Check } from 'lucide-react';
import { useStats } from '@/contexts/StatsContext';
import { toast } from '@/hooks/use-toast';

const sampleTexts = {
  english: [
    "The quick brown fox jumps over the lazy dog. This sentence contains every letter of the alphabet at least once.",
    "Computer operators are responsible for ensuring smooth operation of computer systems in organizations.",
    "Nepal's government has been implementing various e-governance initiatives to improve public service delivery.",
    "Information technology plays a crucial role in modern administration and efficient record management.",
  ],
  nepali: [
    "नेपाल एक सुन्दर हिमाली राष्ट्र हो जुन दक्षिण एशियामा अवस्थित छ।",
    "कम्प्युटर अपरेटरहरूले सरकारी कार्यालयहरूमा महत्त्वपूर्ण भूमिका खेल्छन्।",
    "सूचना प्रविधिको विकासले हाम्रो जीवनशैलीमा ठूलो परिवर्तन ल्याएको छ।",
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
    setStartTime(Date.now());
    setInput('');
    setIsComplete(false);
    setElapsedTime(0);
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
      incrementStat('typingMinutes', Math.ceil(elapsedTime / 60));
      toast({
        title: 'Excellent!',
        description: `You completed the typing test with ${wpm} WPM and ${acc}% accuracy.`,
      });
    }
  };

  const formatTime = (seconds: number) =>
    `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`;

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
            Click on the links below for extra practice:
          </p>
          <div className="mt-2 flex gap-4">
            <a href="https://monkeytype.com" target="_blank" className="text-primary hover:underline">
              Monkeytype
            </a>
            <a href="https://sajilotyping.com" target="_blank" className="text-primary hover:underline">
              Sajilo Typing
            </a>
          </div>
        </div>

        {/* Language Toggle */}
        <div className="flex gap-2 mb-6">
          <Button variant={language === 'english' ? 'default' : 'outline'} onClick={() => { setLanguage('english'); handleReset(); }}>
            English
          </Button>
          <Button variant={language === 'nepali' ? 'default' : 'outline'} onClick={() => { setLanguage('nepali'); handleReset(); }}>
            नेपाली
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="glass-card p-4 text-center">
            <Clock className="mx-auto mb-2" />
            <p className="text-xl font-bold">{formatTime(elapsedTime)}</p>
          </div>
          <div className="glass-card p-4 text-center">
            <Keyboard className="mx-auto mb-2" />
            <p className="text-xl font-bold">{wpm}</p>
          </div>
          <div className="glass-card p-4 text-center">
            <Target className="mx-auto mb-2" />
            <p className="text-xl font-bold">{accuracy}%</p>
          </div>
        </div>

        {/* Typing Area */}
        <div className="glass-card p-6">
          <div className="mb-6 font-mono">
            {text.split('').map((char, i) => (
              <span
                key={i}
                className={
                  getCharacterStatus(i) === 'correct'
                    ? 'text-green-500'
                    : getCharacterStatus(i) === 'incorrect'
                    ? 'text-red-500'
                    : 'text-muted-foreground'
                }
              >
                {char}
              </span>
            ))}
          </div>

          {!isStarted ? (
            <Button onClick={handleStart}><Play /> Start</Button>
          ) : (
            <Button onClick={handleReset}><RotateCcw /> Reset</Button>
          )}
        </div>

      </div>
    </Layout>
  );
}
