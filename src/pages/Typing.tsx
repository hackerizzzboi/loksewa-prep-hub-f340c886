import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Keyboard, Clock, Play, Pause, RotateCcw, BarChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUserData } from '@/contexts/UserDataContext';

const sampleTexts = {
  english: [
    'The quick brown fox jumps over the lazy dog. This sentence contains every letter of the English alphabet.',
    'Nepal is a beautiful country located in South Asia between China and India.',
    'Computer operators play a vital role in government offices by managing digital systems.',
    'Good governance ensures transparency, accountability, and citizen participation.',
  ],
  nepali: [
    'नेपाल एक सुन्दर हिमाली राष्ट्र हो। यहाँ विश्वको सबैभन्दा अग्लो हिमाल सगरमाथा अवस्थित छ।',
    'सरकारी कार्यालयमा कम्प्युटर अपरेटरको भूमिका महत्वपूर्ण छ।',
    'सुशासन भनेको पारदर्शिता, जवाफदेहिता र नागरिक सहभागिता हो।',
  ],
};

export default function TypingPage() {
  const [mode, setMode] = useState<'english' | 'nepali'>('english');
  const [isActive, setIsActive] = useState(false);
  const [time, setTime] = useState(0);
  const [text, setText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [errors, setErrors] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [sessionComplete, setSessionComplete] = useState(false);

  const { stats, updateStats } = useUserData();

  const getRandomText = useCallback((lang: 'english' | 'nepali') => {
    const texts = sampleTexts[lang];
    return texts[Math.floor(Math.random() * texts.length)];
  }, []);

  useEffect(() => {
    setText(getRandomText(mode));
  }, [mode, getRandomText]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && !sessionComplete) {
      interval = setInterval(() => {
        setTime((t) => t + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, sessionComplete]);

  useEffect(() => {
    if (time > 0 && userInput.length > 0) {
      const words = userInput.trim().split(/\s+/).length;
      const minutes = time / 60;
      setWpm(Math.round(words / minutes));
    }
  }, [time, userInput]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!isActive) setIsActive(true);
    
    const value = e.target.value;
    setUserInput(value);

    // Calculate errors
    let errorCount = 0;
    for (let i = 0; i < value.length; i++) {
      if (value[i] !== text[i]) {
        errorCount++;
      }
    }
    setErrors(errorCount);

    // Calculate accuracy
    const totalTyped = value.length;
    const correctChars = totalTyped - errorCount;
    setAccuracy(totalTyped > 0 ? Math.round((correctChars / totalTyped) * 100) : 100);

    // Check completion
    if (value.length >= text.length) {
      setSessionComplete(true);
      setIsActive(false);
      updateStats({ typingMinutes: stats.typingMinutes + Math.ceil(time / 60) });
    }
  };

  const resetSession = () => {
    setIsActive(false);
    setTime(0);
    setUserInput('');
    setErrors(0);
    setWpm(0);
    setAccuracy(100);
    setSessionComplete(false);
    setText(getRandomText(mode));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const renderText = () => {
    return text.split('').map((char, index) => {
      let className = 'text-muted-foreground';
      if (index < userInput.length) {
        className = userInput[index] === char ? 'text-accent' : 'text-destructive bg-destructive/20';
      } else if (index === userInput.length) {
        className = 'text-foreground bg-primary/20';
      }
      return (
        <span key={index} className={className}>
          {char}
        </span>
      );
    });
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 rounded-xl bg-orange-500/10">
            <Keyboard className="w-6 h-6 text-orange-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Typing Practice</h1>
            <p className="text-sm text-muted-foreground">Improve your English & Nepali typing speed</p>
          </div>
        </div>
      </motion.div>

      {/* Mode Toggle */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex gap-2 mb-6"
      >
        <Button
          variant={mode === 'english' ? 'hero' : 'outline'}
          onClick={() => { setMode('english'); resetSession(); }}
        >
          English
        </Button>
        <Button
          variant={mode === 'nepali' ? 'hero' : 'outline'}
          onClick={() => { setMode('nepali'); resetSession(); }}
        >
          नेपाली (Nepali)
        </Button>
      </motion.div>

      {/* Stats Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
      >
        <div className="glass rounded-xl p-4 text-center">
          <Clock className="w-5 h-5 text-primary mx-auto mb-1" />
          <p className="text-2xl font-bold text-foreground">{formatTime(time)}</p>
          <p className="text-xs text-muted-foreground">Time</p>
        </div>
        <div className="glass rounded-xl p-4 text-center">
          <BarChart className="w-5 h-5 text-accent mx-auto mb-1" />
          <p className="text-2xl font-bold text-foreground">{wpm}</p>
          <p className="text-xs text-muted-foreground">WPM</p>
        </div>
        <div className="glass rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-foreground">{accuracy}%</p>
          <p className="text-xs text-muted-foreground">Accuracy</p>
        </div>
        <div className="glass rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-destructive">{errors}</p>
          <p className="text-xs text-muted-foreground">Errors</p>
        </div>
      </motion.div>

      {/* Typing Area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass rounded-3xl p-6"
      >
        {/* Text to Type */}
        <div className="p-4 bg-secondary/50 rounded-xl mb-4 text-lg leading-relaxed font-mono">
          {renderText()}
        </div>

        {/* Input Area */}
        <textarea
          value={userInput}
          onChange={handleInputChange}
          disabled={sessionComplete}
          placeholder={`Start typing ${mode === 'nepali' ? 'in Nepali' : 'in English'}...`}
          className="w-full h-32 p-4 bg-secondary/30 rounded-xl border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none text-lg font-mono text-foreground placeholder:text-muted-foreground"
        />

        {/* Controls */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            {isActive ? (
              <Button variant="outline" onClick={() => setIsActive(false)} className="gap-2">
                <Pause className="w-4 h-4" />
                Pause
              </Button>
            ) : (
              <Button variant="outline" onClick={() => !sessionComplete && setIsActive(true)} className="gap-2">
                <Play className="w-4 h-4" />
                {time > 0 ? 'Resume' : 'Start'}
              </Button>
            )}
          </div>
          <Button variant="heroOutline" onClick={resetSession} className="gap-2">
            <RotateCcw className="w-4 h-4" />
            New Text
          </Button>
        </div>

        {/* Completion Message */}
        {sessionComplete && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-accent/10 border border-accent/30 rounded-xl text-center"
          >
            <p className="text-lg font-semibold text-accent mb-1">Great job! 🎉</p>
            <p className="text-sm text-muted-foreground">
              You typed {text.length} characters at {wpm} WPM with {accuracy}% accuracy.
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
