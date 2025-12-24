import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { FileText, Save, Trash2, Plus, CheckCircle } from 'lucide-react';
import { useStats } from '@/contexts/StatsContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface Note {
  id: string;
  title: string;
  content: string;
  type: 'short' | 'long';
  createdAt: string;
}

const sampleQuestions = [
  { type: 'short', question: "What is an Operating System? List its types." },
  { type: 'short', question: "Define Computer Network. What are its advantages?" },
  { type: 'long', question: "Explain the components of a computer system with diagram." },
  { type: 'long', question: "What is Database Management System? Explain its features and advantages." },
];

export default function Subjective() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState<'short' | 'long'>('short');
  const { incrementStat } = useStats();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const saved = localStorage.getItem(`loksewa_notes_${user.email}`);
      if (saved) {
        setNotes(JSON.parse(saved));
      }
    }
  }, [user]);

  const saveNotes = (newNotes: Note[]) => {
    if (user) {
      localStorage.setItem(`loksewa_notes_${user.email}`, JSON.stringify(newNotes));
    }
    setNotes(newNotes);
  };

  const handleSave = () => {
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Error",
        description: "Please fill in both title and content.",
        variant: "destructive",
      });
      return;
    }

    if (selectedNote) {
      const updated = notes.map(n => 
        n.id === selectedNote.id 
          ? { ...n, title, content, type }
          : n
      );
      saveNotes(updated);
      toast({ title: "Saved!", description: "Your note has been updated." });
    } else {
      const newNote: Note = {
        id: Date.now().toString(),
        title,
        content,
        type,
        createdAt: new Date().toISOString(),
      };
      saveNotes([...notes, newNote]);
      incrementStat('subjectiveAnswers', 1);
      toast({ title: "Created!", description: "Your note has been saved." });
    }
    
    handleClear();
  };

  const handleDelete = (id: string) => {
    saveNotes(notes.filter(n => n.id !== id));
    if (selectedNote?.id === id) {
      handleClear();
    }
    toast({ title: "Deleted", description: "Note has been removed." });
  };

  const handleClear = () => {
    setSelectedNote(null);
    setTitle('');
    setContent('');
    setType('short');
  };

  const handleSelect = (note: Note) => {
    setSelectedNote(note);
    setTitle(note.title);
    setContent(note.content);
    setType(note.type);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8 animate-fade-up">
            <h1 className="text-3xl font-bold mb-2">Subjective Notes</h1>
            <p className="text-muted-foreground">
              Prepare for Paper II with short and long answer practice
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Sample Questions */}
            <div className="lg:col-span-1 space-y-4">
              <div className="glass-card rounded-xl p-5">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  Sample Questions
                </h3>
                <div className="space-y-3">
                  {sampleQuestions.map((q, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setTitle(q.question);
                        setType(q.type as 'short' | 'long');
                        setSelectedNote(null);
                      }}
                      className="w-full text-left p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors text-sm"
                    >
                      <span className={`inline-block px-2 py-0.5 rounded text-xs mb-1 ${
                        q.type === 'short' ? 'bg-primary/20 text-primary' : 'bg-accent/20 text-accent'
                      }`}>
                        {q.type === 'short' ? 'Short' : 'Long'}
                      </span>
                      <p className="text-muted-foreground line-clamp-2">{q.question}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Saved Notes */}
              <div className="glass-card rounded-xl p-5">
                <h3 className="font-semibold mb-4">Your Notes ({notes.length})</h3>
                {notes.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No notes yet. Start writing!
                  </p>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {notes.map(note => (
                      <div
                        key={note.id}
                        className={`p-3 rounded-lg cursor-pointer transition-all ${
                          selectedNote?.id === note.id
                            ? 'bg-primary/10 border border-primary/30'
                            : 'bg-secondary/50 hover:bg-secondary'
                        }`}
                        onClick={() => handleSelect(note)}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-sm truncate">{note.title}</p>
                            <span className={`inline-block px-2 py-0.5 rounded text-xs mt-1 ${
                              note.type === 'short' ? 'bg-primary/20 text-primary' : 'bg-accent/20 text-accent'
                            }`}>
                              {note.type}
                            </span>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(note.id);
                            }}
                            className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Editor */}
            <div className="lg:col-span-2">
              <div className="glass-card rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold">
                    {selectedNote ? 'Edit Note' : 'New Note'}
                  </h3>
                  <div className="flex gap-2">
                    <Button
                      variant={type === 'short' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setType('short')}
                    >
                      Short Answer
                    </Button>
                    <Button
                      variant={type === 'long' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setType('long')}
                    >
                      Long Answer
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">
                      Question / Title
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter the question or title..."
                      className="w-full h-12 px-4 rounded-lg bg-secondary border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">
                      Your Answer
                    </label>
                    <textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Write your answer here..."
                      rows={type === 'short' ? 6 : 12}
                      className="w-full px-4 py-3 rounded-lg bg-secondary border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button variant="hero" onClick={handleSave} className="flex-1">
                      <Save className="w-4 h-4" />
                      {selectedNote ? 'Update Note' : 'Save Note'}
                    </Button>
                    {(selectedNote || title || content) && (
                      <Button variant="outline" onClick={handleClear}>
                        <Plus className="w-4 h-4" />
                        New
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
