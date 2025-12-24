import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Keyboard, Clock, Target, RotateCcw, Play, Pause } from 'lucide-react';
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
  const [isActive, setIsActive] = useState(false);
  const [time, setTime] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [errors, setErrors] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const { incrementStat } = useStats();

  /* Load random text */
  useEffect(() => {
    const texts = sampleTexts[language];
    setText(texts[Math.floor(Math.random() * texts.length)]);
    reset();
  }, [language]);

  /* Timer */
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && !isComplete) {
      interval = setInterval(() => {
        setTime((t) => t + 1);
      }, 1000);
    }

    return () => interval && clearInterval(interval);
  }, [isActive, isComplete]);

  /* WPM */
  useEffect(() => {
    if (time > 0 && input.length > 0) {
      const words = input.trim().split(/\s+/).length;
      setWpm(Math.round(words / (time / 60)));
    }
  }, [time, input]);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (isComplete) return;

    if (!isActive) setIsActive(true);

    const value = e.target.value;
    setInput(value);

    let errorCount = 0;
    let correct = 0;

    for (let i = 0; i < value.length; i++) {
      if (value[i] === text[i]) correct++;
      else errorCount++;
    }

    setErrors(errorCount);
    setAccuracy(value.length > 0 ? Math.round((correct / value.length) * 100) : 100);

    /* Completion */
    if (value.length >= text.length) {
      setIsComplete(true);
      setIsActive(false);
      incrementStat('typingMinutes', Math.ceil(time / 60));

      toast({
        title: 'Well done! 🎉',
        description: `${wpm} WPM • ${accuracy}% accuracy • ${errorCount} errors`,
      });
    }
  };

  const reset = () => {
    setInput('');
    setIsActive(false);
    setTime(0);
    setWpm(0);
    setAccuracy(100);
    setErrors(0);
    setIsComplete(false);
  };

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  /* Monkeytype-style character rendering */
  const renderText = () =>
    text.split('').map((char, i) => {
      let className = 'text-muted-foreground';

      if (i < input.length) {
        className =
          input[i] === char
            ? 'text-green-500'
            : 'text-red-500 bg-red-500/20';
      } else if (i === input.length) {
        className = 'bg-primary/20 text-foreground';
      }

      return (
        <span key={i} className={className}>
          {char}
        </span>
      );
    });

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-6">
  <h1 className="text-3xl font-bold">Typing Practice</h1>
  
  <div className="flex gap-4 text-sm">
    <a
      href="https://monkeytype.com"
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-500 hover:underline"
    >
      Practice on Monkeytype →
    </a>

    <a
      href="https://sajilotyping.com"
      target="_blank"
      rel="noopener noreferrer"
      className="text-green-500 hover:underline"
    >
      Practice on Sajilo Typing →
    </a>
  </div>
</div>


        {/* Language Toggle */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={language === 'english' ? 'default' : 'outline'}
            onClick={() => setLanguage('english')}
          >
            English
          </Button>
          <Button
            variant={language === 'nepali' ? 'default' : 'outline'}
            onClick={() => setLanguage('nepali')}
          >
            नेपाली
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="glass-card p-4 text-center">
            <Clock className="mx-auto mb-1" />
            {formatTime(time)}
          </div>
          <div className="glass-card p-4 text-center">
            <Keyboard className="mx-auto mb-1" />
            {wpm} WPM
          </div>
          <div className="glass-card p-4 text-center">
            <Target className="mx-auto mb-1" />
            {accuracy}%
          </div>
          <div className="glass-card p-4 text-center text-red-500">
            Errors: {errors}
          </div>
        </div>

        {/* Typing Area */}
        <div className="glass-card p-6">
          <div className="mb-4 font-mono text-lg leading-relaxed">
            {renderText()}
          </div>

          <textarea
            value={input}
            onChange={handleInput}
            onPaste={(e) => e.preventDefault()}
            disabled={isComplete}
            className="w-full h-32 p-4 font-mono rounded-xl bg-secondary/30 border focus:outline-none"
            placeholder="Start typing..."
          />

          <div className="flex justify-between mt-4">
            <Button onClick={reset}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
