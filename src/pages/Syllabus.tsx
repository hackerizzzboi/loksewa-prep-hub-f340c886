import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { CheckCircle, Circle, BookOpen, Monitor, Users, ChevronDown, ChevronRight } from 'lucide-react';
import { useStats } from '@/contexts/StatsContext';
import { useAuth } from '@/contexts/AuthContext';

interface Topic {
  id: string;
  title: string;
  subtopics?: string[];
}

interface Section {
  id: string;
  title: string;
  icon: React.ReactNode;
  topics: Topic[];
}

const syllabusData: Section[] = [
  {
    id: 'written',
    title: 'Written Exam',
    icon: <BookOpen className="w-5 h-5" />,
    topics: [
      { 
        id: 'w1', 
        title: 'Computer Fundamentals',
        subtopics: ['Introduction to Computer', 'Computer Organization', 'Number System', 'Memory & Storage']
      },
      { 
        id: 'w2', 
        title: 'Operating System',
        subtopics: ['Types of OS', 'Windows & Linux', 'File Management', 'Process Management']
      },
      { 
        id: 'w3', 
        title: 'MS Office Applications',
        subtopics: ['MS Word', 'MS Excel', 'MS PowerPoint', 'MS Access']
      },
      { 
        id: 'w4', 
        title: 'Computer Network',
        subtopics: ['Network Types', 'Protocols', 'Internet Basics', 'Network Security']
      },
      { 
        id: 'w5', 
        title: 'Database Management',
        subtopics: ['DBMS Concepts', 'SQL Basics', 'Normalization', 'ER Diagrams']
      },
      { 
        id: 'w6', 
        title: 'Web Technology',
        subtopics: ['HTML', 'CSS', 'JavaScript Basics', 'Web Browsers']
      },
      { 
        id: 'w7', 
        title: 'E-Governance',
        subtopics: ['E-governance in Nepal', 'Digital Nepal Framework', 'IT Policy']
      },
    ],
  },
  {
    id: 'practical',
    title: 'Practical Exam',
    icon: <Monitor className="w-5 h-5" />,
    topics: [
      { id: 'p1', title: 'English Typing (40 WPM)' },
      { id: 'p2', title: 'Nepali Typing (25 WPM)' },
      { id: 'p3', title: 'MS Word - Document Formatting' },
      { id: 'p4', title: 'MS Excel - Formulas & Charts' },
      { id: 'p5', title: 'MS PowerPoint - Presentation' },
      { id: 'p6', title: 'Internet & Email' },
    ],
  },
  {
    id: 'interview',
    title: 'Interview Preparation',
    icon: <Users className="w-5 h-5" />,
    topics: [
      { id: 'i1', title: 'Technical Questions' },
      { id: 'i2', title: 'Behavioral Questions' },
      { id: 'i3', title: 'Current Affairs' },
      { id: 'i4', title: 'Government Policies' },
      { id: 'i5', title: 'Communication Skills' },
    ],
  },
];

export default function Syllabus() {
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['written']));
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set());
  const { updateStats } = useStats();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const saved = localStorage.getItem(`loksewa_syllabus_${user.email}`);
      if (saved) {
        setCompleted(new Set(JSON.parse(saved)));
      }
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(`loksewa_syllabus_${user.email}`, JSON.stringify([...completed]));
      
      // Calculate progress
      const totalTopics = syllabusData.reduce((acc, section) => {
        return acc + section.topics.reduce((topicAcc, topic) => {
          return topicAcc + (topic.subtopics ? topic.subtopics.length : 1);
        }, 0);
      }, 0);
      
      const progress = Math.round((completed.size / totalTopics) * 100);
      updateStats({ syllabusProgress: progress });
    }
  }, [completed, user, updateStats]);

  const toggleComplete = (id: string) => {
    setCompleted(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const toggleSection = (id: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const toggleTopic = (id: string) => {
    setExpandedTopics(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const getSectionProgress = (section: Section) => {
    let total = 0;
    let done = 0;
    section.topics.forEach(topic => {
      if (topic.subtopics) {
        topic.subtopics.forEach(sub => {
          total++;
          if (completed.has(`${topic.id}-${sub}`)) done++;
        });
      } else {
        total++;
        if (completed.has(topic.id)) done++;
      }
    });
    return { done, total, percentage: total > 0 ? Math.round((done / total) * 100) : 0 };
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8 animate-fade-up">
            <h1 className="text-3xl font-bold mb-2">Syllabus & Study Plan</h1>
            <p className="text-muted-foreground">
              Track your progress through the complete Loksewa Computer Operator syllabus
            </p>
          </div>

          {/* Overall Progress */}
          <div className="glass-card rounded-xl p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Overall Progress</h3>
              <span className="text-2xl font-bold gradient-text">
                {(() => {
                  const total = syllabusData.reduce((acc, s) => acc + getSectionProgress(s).total, 0);
                  const done = syllabusData.reduce((acc, s) => acc + getSectionProgress(s).done, 0);
                  return total > 0 ? Math.round((done / total) * 100) : 0;
                })()}%
              </span>
            </div>
            <div className="h-3 bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full gradient-bg transition-all duration-500"
                style={{ 
                  width: `${(() => {
                    const total = syllabusData.reduce((acc, s) => acc + getSectionProgress(s).total, 0);
                    const done = syllabusData.reduce((acc, s) => acc + getSectionProgress(s).done, 0);
                    return total > 0 ? Math.round((done / total) * 100) : 0;
                  })()}%` 
                }}
              />
            </div>
          </div>

          {/* Sections */}
          <div className="space-y-4">
            {syllabusData.map(section => {
              const progress = getSectionProgress(section);
              const isExpanded = expandedSections.has(section.id);
              
              return (
                <div key={section.id} className="glass-card rounded-xl overflow-hidden">
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full p-5 flex items-center justify-between hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        {section.icon}
                      </div>
                      <div className="text-left">
                        <h3 className="font-semibold">{section.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {progress.done} of {progress.total} completed
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="hidden sm:block w-32">
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <div 
                            className="h-full gradient-bg transition-all duration-300"
                            style={{ width: `${progress.percentage}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-sm font-medium">{progress.percentage}%</span>
                      {isExpanded ? (
                        <ChevronDown className="w-5 h-5 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                  </button>
                  
                  {isExpanded && (
                    <div className="border-t border-border p-4 space-y-2 animate-fade-in">
                      {section.topics.map(topic => {
                        const hasSubtopics = topic.subtopics && topic.subtopics.length > 0;
                        const isTopicExpanded = expandedTopics.has(topic.id);
                        
                        return (
                          <div key={topic.id}>
                            <div 
                              className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                                hasSubtopics ? 'cursor-pointer hover:bg-secondary/50' : ''
                              }`}
                              onClick={() => hasSubtopics && toggleTopic(topic.id)}
                            >
                              {!hasSubtopics && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleComplete(topic.id);
                                  }}
                                  className="shrink-0"
                                >
                                  {completed.has(topic.id) ? (
                                    <CheckCircle className="w-5 h-5 text-accent" />
                                  ) : (
                                    <Circle className="w-5 h-5 text-muted-foreground" />
                                  )}
                                </button>
                              )}
                              {hasSubtopics && (
                                isTopicExpanded ? (
                                  <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0" />
                                ) : (
                                  <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
                                )
                              )}
                              <span className={!hasSubtopics && completed.has(topic.id) ? 'line-through text-muted-foreground' : ''}>
                                {topic.title}
                              </span>
                            </div>
                            
                            {hasSubtopics && isTopicExpanded && (
                              <div className="ml-8 space-y-1 mt-1">
                                {topic.subtopics!.map(subtopic => {
                                  const subId = `${topic.id}-${subtopic}`;
                                  return (
                                    <button
                                      key={subId}
                                      onClick={() => toggleComplete(subId)}
                                      className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/50 transition-colors text-left"
                                    >
                                      {completed.has(subId) ? (
                                        <CheckCircle className="w-4 h-4 text-accent shrink-0" />
                                      ) : (
                                        <Circle className="w-4 h-4 text-muted-foreground shrink-0" />
                                      )}
                                      <span className={`text-sm ${completed.has(subId) ? 'line-through text-muted-foreground' : ''}`}>
                                        {subtopic}
                                      </span>
                                    </button>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Layout>
  );
}
