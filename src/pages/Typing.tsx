import { useState, useEffect, useMemo, useRef } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Clock, Keyboard, Target, Play, RotateCcw, Trophy } from 'lucide-react';

/* =====================
   WORD BANKS (INFINITE)
===================== */

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

/* =====================
   HELPERS
===================== */

const rand = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

const genWords = (count: number, lang: 'english' | 'nepali') => {
  const bank = lang === 'english' ? ENGLISH_WORDS : NEPALI_WORDS;
  return Array.from({ length: count }, () => rand(bank)).join(' ');
};

const genParagraph = (lang: 'english' | 'nepali') =>
  Array.from({ length: 5 }, () =>
    rand(lang === 'english' ? ENGLISH_SENTENCES : NEPALI_SENTENCES)
  ).join(' ');

/* =====================
   COMPONENT
===================== */

export default function TypingAdvanced() {
  const [language, setLanguage] = useState<'english' | 'nepali'>('english');
  const [mode, setMode] = useState<'words' | 'time' | 'sentence' | 'paragraph'>('words');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');

  const [wordCount, setWordCount] = useState(50);
  const [timeLimit, setTimeLimit] = useState(60);

  const [text, setText] = useState('');
  const [input, setInput] = useState('');
  const [started, setStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(timeLimit);

  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [errors, setErrors] = useState(0);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const clickSound = useRef<HTMLAudioElement | null>(null);

  /* =====================
     TEXT GENERATION
  ===================== */

  const generatedText = useMemo(() => {
    if (mode === 'words') return genWords(wordCount, language);
    if (mode === 'sentence') return rand(language === 'english' ? ENGLISH_SENTENCES : NEPALI_SENTENCES);
    if (mode === 'paragraph') return genParagraph(language);
    return genWords(5000, language); // time mode
  }, [mode, wordCount, language]);

  /* =====================
     START / RESET
  ===================== */

  const startTest = () => {
    setText(generatedText);
    setInput('');
    setErrors(0);
    setAccuracy(100);
    setWpm(0);
    setStarted(true);
    setTimeLeft(timeLimit);
    textareaRef.current?.focus();
  };

  const resetTest = () => {
    setStarted(false);
    setInput('');
    setText('');
  };

  /* =====================
     TIMER (TIME MODE)
  ===================== */

  useEffect(() => {
    if (!started || mode !== 'time') return;
    if (timeLeft <= 0) {
      finishTest();
      return;
    }
    const t = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(t);
  }, [started, timeLeft, mode]);

  /* =====================
     INPUT HANDLER
  ===================== */

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!started) return;

    const val = e.target.value;
    const lastChar = val[val.length - 1];

    // Typing sound
    clickSound.current?.play().catch(() => {});

    // Backspace penalty
    if (val.length < input.length) setErrors(e => e + 1);

    setInput(val);

    let correct = 0;
    for (let i = 0; i < val.length; i++) {
      if (val[i] === text[i]) correct++;
      else setErrors(e => e + 1);
    }

    const acc = val.length ? Math.max(0, Math.round((correct / val.length) * 100)) : 100;
    setAccuracy(acc);

    const elapsed = (timeLimit - timeLeft + 1) / 60 || 1;
    const words = val.trim().split(/\s+/).length;
    setWpm(Math.round(words / elapsed));

    if (mode !== 'time' && val === text) finishTest();
  };

  /* =====================
     FINISH + LEADERBOARD
  ===================== */

  const finishTest = () => {
    setStarted(false);

    const score = {
      date: new Date().toLocaleString(),
      wpm,
      accuracy,
      language,
      mode,
      difficulty,
    };

    const board = JSON.parse(localStorage.getItem('leaderboard') || '[]');
    localStorage.setItem('leaderboard', JSON.stringify([score, ...board].slice(0, 10)));
  };

  const leaderboard = JSON.parse(localStorage.getItem('leaderboard') || '[]');

  /* =====================
     UI
  ===================== */

  return (
    <Layout>
      <audio ref={clickSound} src="/sounds/key.mp3" preload="auto" />

      <div className="max-w-5xl mx-auto space-y-6 px-3">

        <h1 className="text-3xl font-bold text-center">Advanced Typing Practice</h1>

        {/* SETTINGS */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
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

          <select onChange={e => setDifficulty(e.target.value as any)} className="input">
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          {mode === 'words' && (
            <select onChange={e => setWordCount(+e.target.value)} className="input">
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={200}>200</option>
            </select>
          )}

          {mode === 'time' && (
            <select onChange={e => setTimeLimit(+e.target.value)} className="input">
              <option value={60}>1 min</option>
              <option value={120}>2 min</option>
              <option value={300}>5 min</option>
            </select>
          )}
        </div>

        {/* STATS */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="card"><Clock /> {mode === 'time' ? timeLeft : '∞'}s</div>
          <div className="card"><Keyboard /> {wpm} WPM</div>
          <div className="card"><Target /> {accuracy}%</div>
        </div>

        {/* TEXT */}
        <div className="p-4 bg-secondary rounded-lg font-mono leading-relaxed">
          {text.split('').map((c, i) => (
            <span
              key={i}
              className={
                i === input.length
                  ? 'bg-primary/30 animate-pulse'
                  : i < input.length
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
          ref={textareaRef}
          value={input}
          onChange={handleChange}
          disabled={!started}
          className="w-full h-32 p-4 font-mono rounded-lg resize-none text-lg"
          placeholder="Start typing..."
        />

        {/* CONTROLS */}
        <div className="flex justify-center gap-4">
          {!started ? (
            <Button onClick={startTest}><Play /> Start</Button>
          ) : (
            <Button variant="outline" onClick={resetTest}><RotateCcw /> Reset</Button>
          )}
        </div>

        {/* LEADERBOARD */}
        <div className="glass-card rounded-xl p-4">
          <h3 className="font-semibold flex items-center gap-2 mb-2">
            <Trophy /> Leaderboard
          </h3>
          {leaderboard.map((s: any, i: number) => (
            <p key={i} className="text-sm text-muted-foreground">
              {i + 1}. {s.wpm} WPM • {s.accuracy}% • {s.language}
            </p>
          ))}
        </div>

      </div>
    </Layout>
  );
}
