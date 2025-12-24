import { BookOpen, FileText, Layout, Keyboard, Calendar, ExternalLink, Target, Clock, CheckSquare, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatCard } from '@/components/dashboard/StatCard';
import { FeatureCard } from '@/components/dashboard/FeatureCard';
import { useStats } from '@/contexts/StatsContext';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';

const features = [
  {
    icon: <BookOpen className="w-6 h-6" />,
    title: 'MCQ Practice',
    description: 'Objective questions with timed tests and accuracy tracking',
    features: ['Topic-wise questions', 'Timed tests', 'Accuracy tracking', 'Review wrong answers'],
    href: '/mcq',
    color: 'primary' as const,
  },
  {
    icon: <FileText className="w-6 h-6" />,
    title: 'Subjective Notes',
    description: 'Paper II preparation with short and long answer practice',
    features: ['Short answers', 'Long answers', 'Save drafts', 'Model answers'],
    href: '/subjective',
    color: 'accent' as const,
  },
  {
    icon: <Layout className="w-6 h-6" />,
    title: 'Syllabus & Plan',
    description: 'Complete syllabus with completion tracker for all stages',
    features: ['Written exam syllabus', 'Practical topics', 'Interview prep', 'Progress tracking'],
    href: '/syllabus',
    color: 'primary' as const,
  },
  {
    icon: <Keyboard className="w-6 h-6" />,
    title: 'Typing & Practical',
    description: 'English and Nepali typing practice with MS Office tasks',
    features: ['English typing', 'Nepali typing', 'MS Office tasks', 'Time logging'],
    href: '/typing',
    color: 'accent' as const,
  },
  {
    icon: <Calendar className="w-6 h-6" />,
    title: 'Daily Routine',
    description: 'Plan your morning and evening study schedule',
    features: ['Morning routine', 'Evening routine', 'Editable schedule', 'Reminders'],
    href: '/routine',
    color: 'primary' as const,
  },
  {
    icon: <ExternalLink className="w-6 h-6" />,
    title: 'Resources',
    description: 'PDF links, videos, and external bookmarks',
    features: ['PDF materials', 'Video tutorials', 'External links', 'Bookmarks'],
    href: '/resources',
    color: 'accent' as const,
  },
];

const pills = [
  'Written',
  'Practical',
  'Interview',
  'Objective + Subjective',
  'English & Nepali Typing',
];

export default function Dashboard() {
  const { stats } = useStats();
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 py-16 md:py-24 relative">
          <div className="max-w-3xl mx-auto text-center animate-fade-up">
            <p className="text-primary font-medium mb-4">
              Welcome back, {user?.name || 'Student'}! 👋
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-balance">
              Computer Operator{' '}
              <span className="gradient-text">Loksewa Prep Hub</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Your complete preparation dashboard for Nepal Loksewa Aayog Computer Operator (Level 5) examination. Practice MCQs, prepare subjective answers, master typing, and track your progress.
            </p>

            {/* Pills */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {pills.map((pill, index) => (
                <span
                  key={index}
                  className="px-4 py-2 rounded-full bg-secondary text-sm font-medium text-muted-foreground border border-border"
                >
                  {pill}
                </span>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="hero" size="xl">
                <Link to="/mcq">
                  <Target className="w-5 h-5" />
                  Start MCQ Session
                </Link>
              </Button>
              <Button asChild variant="glass" size="xl">
                <Link to="/syllabus">
                  <Layout className="w-5 h-5" />
                  Open Full Syllabus
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 -mt-8 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={<BookOpen className="w-5 h-5" />}
            label="MCQ Sets Done"
            value={stats.mcqSets}
            max={3}
            delay={100}
          />
          <StatCard
            icon={<Clock className="w-5 h-5" />}
            label="Typing Minutes"
            value={stats.typingMinutes}
            max={60}
            suffix=" min"
            delay={200}
          />
          <StatCard
            icon={<CheckSquare className="w-5 h-5" />}
            label="Subjective Answers"
            value={stats.subjectiveAnswers}
            max={2}
            delay={300}
          />
          <StatCard
            icon={<TrendingUp className="w-5 h-5" />}
            label="Syllabus Progress"
            value={stats.syllabusProgress}
            max={100}
            suffix="%"
            delay={400}
          />
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Everything You Need to{' '}
            <span className="gradient-text">Succeed</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Comprehensive tools and resources designed specifically for Loksewa Computer Operator preparation.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              {...feature}
              delay={index * 100}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
