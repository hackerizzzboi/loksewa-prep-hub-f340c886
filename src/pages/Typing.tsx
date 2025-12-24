import { useState, useEffect, useMemo } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Clock, Keyboard, Target, Play, RotateCcw } from 'lucide-react';

/* =======================
   WORD BANKS (INFINITE)
======================= */

const ENGLISH_WORDS = [
  'computer','operator','typing','practice','government','system','network',
  'information','technology','keyboard','accuracy','speed','internet','database',
  'application','software','hardware','security','management','digital','service',
  'record','process','input','output','development','education','administration',
];

const NEPALI_WORDS = [
  'कम्प्युटर','अपरेटर','सरकार','प्रविधि','सूचना','सेवा','प्रणाली','डाटा',
  'इन्टरनेट','सफ्टवेयर','हार्डवेयर','प्रशासन','रिकर्ड','व्यवस्थापन',
  'डिजिटल','शिक्षा','कार्यालय','कार्य','प्रक्रिया','विकास','सुरक्षा',
];

const ENGLISH_SENTENCES = [
  'Computer operators play a vital role in modern offices.',
  'Typing speed and accuracy are important for practical exams.',
  'Information technology improves efficiency and productivity.',
  'Government offices are moving towards digital systems.',
];

const NEPALI_SENTENCES = [
  'कम्प्युटर अपरेटरहरूले कार्यालयको काम सजिलो बनाउँछन्।',
  'टाइपिङ गति र शुद्धता व्यवहारिक परीक्षाका लागि महत्त्वपूर्ण हुन्छ।',
  'सूचना प्रविधिले कार्यक्षमता बढाउँछ।',
  'सरकारी कार्यालयहरू डिजिटल प्रणालीतर्फ अघि बढिरहेका छन्।',
];

/* =======================
   HELPERS
======================= */

const randomFromArray = (arr: string[]) =>
  arr[Math.floor(Math.random() * arr.length)];

const generateWords = (count: number, lang: 'english' | 'nepali') => {
  const bank = lang === 'english' ? ENGLISH_WORDS : NEPALI_WORDS;
  return Array.from({ length: count }, () => randomFromArray(bank)).join(' ');
};

const generateParagraph = (lang: 'english' | 'nepali') => {
  const bank = lang === 'english' ? ENGLISH_SENTENCES : NEPALI_SENTENCES;
  return Array.from({ length: 5 }, () => randomFromArray(bank)).join(' ');
};

/* =======================
   COMPONENT
======================= */

export default function TypingAdvanced() {
  const [language, setLanguage] = useState<'english' | 'nepali'>('english');
  const [mode, setMode] = useState<'words' | 'time' | 'sentence' | 'paragraph'>('words');
  const [wordCount, setWordCount] = useState(50);
  const [timeLimit, setTimeLimit] = useState(60);

  const [text, setText] = useState('');
  const [input, setInput] = useState('');
  const [started, setStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);

  /* =======================
     TEXT GENERATION
  ======================= */
  const generatedText = useMemo(() => {
    if (mode === 'words') return generateWords(wordCount, language);
    if (mode === 'sentence') return randomFromArray(language === 'english' ? ENGLISH_SENTENCES : NEPALI_SENTENCES);
    if (mode === 'paragraph') return generateParagraph(language);
    return generateWords(9999, language); // time mode
  }, [mode, wordCount, language]);

  /* =======================
     START / RESET
  ======================= */
  const startTest = () => {
    setText(generatedText);
    setInput('');
    setStarted(true);
    setTimeLeft(timeLimit);
    setWpm(0);
    setAccuracy(100);
  };

  const resetTest = () => {
    setStarted(false);
    setInput('');
    setText('');
  };

  /* =======================
     TIMER (TIME MODE)
  ======================= */
  useEffect(() => {
    if (!started || mode !== 'time') return;

    if (timeLeft <= 0) {
      setStarted(false);
      return;
    }

    const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [started, timeLeft, mode]);

  /* =======================
     INPUT HANDLER
  ======================= */
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!started) return;

    const val = e.target.value;
    setInput(val);

    let correct = 0;
    for (let i = 0; i < val.length; i++) {
      if (val[i] === text[i]) correct++;
    }

    setAccuracy(val.length ? Math.round((correct / val.length) * 100) : 100);

    const words = val.trim().split(/\s+/).length;
    setWpm(Math.round(words / ((timeLimit - timeLeft + 1) / 60 || 1)));

    if (mode !== 'time' && val === text) {
      setStarted(false);
    }
  };

  /* =======================
     UI
  ======================= */
  return (
    <Layout>
      <div className="max-w-5xl mx-auto space-y-6">

        <h1 className="text-3xl font-bold">Advanced Typing Practice</h1>

        {/* SETTINGS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <select onChange={e => setMode(e.target.value as any)} className="input">
            <option value="words">Words</option>
            <option value="time">Time</option>
            <option value="sentence">Sentence</option>
            <option value="paragraph">Paragraph</option>
          </select>

          <select onChange={e => setLanguage(e.target.value as any)} className="input">
            <option value="english">English</option>
            <option value="nepali">Nepali</option>
          </select>

          {mode === 'words' && (
            <select onChange={e => setWordCount(+e.target.value)} className="input">
              <option value={25}>25 Words</option>
              <option value={50}>50 Words</option>
              <option value={100}>100 Words</option>
              <option value={200}>200 Words</option>
            </select>
          )}

          {mode === 'time' && (
            <select onChange={e => setTimeLimit(+e.target.value)} className="input">
              <option value={60}>1 Minute</option>
              <option value={120}>2 Minutes</option>
              <option value={300}>5 Minutes</option>
            </select>
          )}
        </div>

        {/* STATS */}
        <div className="grid grid-cols-3 gap-4">
          <div className="card"><Clock /> {mode === 'time' ? timeLeft : '∞'}s</div>
          <div className="card"><Keyboard /> {wpm} WPM</div>
          <div className="card"><Target /> {accuracy}%</div>
        </div>

        {/* TEXT */}
        <div className="p-4 bg-secondary rounded-lg font-mono">
          {text.split('').map((c, i) => (
            <span
              key={i}
              className={
                i < input.length
                  ? input[i] === c
                    ? 'text-green-500'
                    : 'text-red-500'
                  : 'text-muted-foreground'
              }
            >
              {c}
            </span>
          ))}
        </div>

        {/* INPUT */}
        <textarea
          value={input}
          onChange={handleChange}
          disabled={!started}
          className="w-full h-32 p-4 font-mono rounded-lg"
          placeholder="Start typing..."
        />

        {/* CONTROLS */}
        <div className="flex gap-4">
          {!started ? (
            <Button onClick={startTest}><Play /> Start</Button>
          ) : (
            <Button variant="outline" onClick={resetTest}><RotateCcw /> Reset</Button>
          )}
        </div>

      </div>
    </Layout>
  );
}
