import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { FileText, Video, ExternalLink, Plus, Trash2, Bookmark, Link as LinkIcon } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface Resource {
  id: string;
  title: string;
  url: string;
  type: 'pdf' | 'video' | 'link';
  category: string;
}

const defaultResources: Resource[] = [
  { id: '1', title: 'Loksewa Aayog Official Website', url: 'https://psc.gov.np', type: 'link', category: 'Official' },
  { id: '2', title: 'Computer Fundamentals Notes', url: '#', type: 'pdf', category: 'Notes' },
  { id: '3', title: 'MS Office Tutorial Series', url: '#', type: 'video', category: 'Tutorials' },
  { id: '4', title: 'Previous Year Questions', url: '#', type: 'pdf', category: 'Practice' },
  { id: '5', title: 'Typing Test Practice', url: 'https://www.typingtest.com', type: 'link', category: 'Practice' },
  { id: '6', title: 'Nepali Unicode Typing', url: '#', type: 'link', category: 'Tools' },
];

const categories = ['All', 'Official', 'Notes', 'Tutorials', 'Practice', 'Tools', 'Bookmarks'];

export default function Resources() {
  const [resources, setResources] = useState<Resource[]>(defaultResources);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newResource, setNewResource] = useState({
    title: '',
    url: '',
    type: 'link' as 'pdf' | 'video' | 'link',
    category: 'Bookmarks',
  });
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const saved = localStorage.getItem(`loksewa_resources_${user.email}`);
      if (saved) {
        setResources(JSON.parse(saved));
      }
    }
  }, [user]);

  const saveResources = (newResources: Resource[]) => {
    if (user) {
      localStorage.setItem(`loksewa_resources_${user.email}`, JSON.stringify(newResources));
    }
    setResources(newResources);
  };

  const handleAdd = () => {
    if (!newResource.title.trim() || !newResource.url.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    const resource: Resource = {
      id: Date.now().toString(),
      ...newResource,
    };

    saveResources([...resources, resource]);
    setNewResource({ title: '', url: '', type: 'link', category: 'Bookmarks' });
    setShowAddForm(false);
    toast({ title: "Added!", description: "Resource has been saved." });
  };

  const handleDelete = (id: string) => {
    saveResources(resources.filter(r => r.id !== id));
    toast({ title: "Deleted", description: "Resource has been removed." });
  };

  const filteredResources = selectedCategory === 'All'
    ? resources
    : resources.filter(r => r.category === selectedCategory);

  const getIcon = (type: 'pdf' | 'video' | 'link') => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-5 h-5" />;
      case 'video':
        return <Video className="w-5 h-5" />;
      default:
        return <LinkIcon className="w-5 h-5" />;
    }
  };

  const getIconColor = (type: 'pdf' | 'video' | 'link') => {
    switch (type) {
      case 'pdf':
        return 'text-red-500 bg-red-500/10';
      case 'video':
        return 'text-purple-500 bg-purple-500/10';
      default:
        return 'text-primary bg-primary/10';
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 animate-fade-up">
            <div>
              <h1 className="text-3xl font-bold mb-2">Resources</h1>
              <p className="text-muted-foreground">
                PDF links, videos, and external bookmarks for your preparation
              </p>
            </div>
            <Button variant="hero" onClick={() => setShowAddForm(!showAddForm)}>
              <Plus className="w-4 h-4" />
              Add Resource
            </Button>
          </div>

          {/* Add Form */}
          {showAddForm && (
            <div className="glass-card rounded-xl p-6 mb-6 animate-scale-in">
              <h3 className="font-semibold mb-4">Add New Resource</h3>
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Title</label>
                  <input
                    type="text"
                    value={newResource.title}
                    onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
                    placeholder="Resource title"
                    className="w-full h-10 px-3 rounded-lg bg-secondary border border-border focus:border-primary outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">URL</label>
                  <input
                    type="url"
                    value={newResource.url}
                    onChange={(e) => setNewResource({ ...newResource, url: e.target.value })}
                    placeholder="https://..."
                    className="w-full h-10 px-3 rounded-lg bg-secondary border border-border focus:border-primary outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Type</label>
                  <select
                    value={newResource.type}
                    onChange={(e) => setNewResource({ ...newResource, type: e.target.value as any })}
                    className="w-full h-10 px-3 rounded-lg bg-secondary border border-border focus:border-primary outline-none"
                  >
                    <option value="link">Link</option>
                    <option value="pdf">PDF</option>
                    <option value="video">Video</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Category</label>
                  <select
                    value={newResource.category}
                    onChange={(e) => setNewResource({ ...newResource, category: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg bg-secondary border border-border focus:border-primary outline-none"
                  >
                    {categories.filter(c => c !== 'All').map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAdd}>Save Resource</Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
              </div>
            </div>
          )}

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-muted-foreground hover:text-foreground'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Resources Grid */}
          <div className="grid sm:grid-cols-2 gap-4">
            {filteredResources.map((resource, index) => (
              <a
                key={resource.id}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group glass-card rounded-xl p-5 hover-lift animate-fade-up opacity-0"
                style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'forwards' }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className={`p-2.5 rounded-lg shrink-0 ${getIconColor(resource.type)}`}>
                      {getIcon(resource.type)}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-medium group-hover:text-primary transition-colors truncate">
                        {resource.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs px-2 py-0.5 rounded bg-secondary text-muted-foreground">
                          {resource.category}
                        </span>
                        <span className="text-xs text-muted-foreground uppercase">
                          {resource.type}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    {resource.category === 'Bookmarks' && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleDelete(resource.id);
                        }}
                        className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </a>
            ))}
          </div>

          {filteredResources.length === 0 && (
            <div className="text-center py-12">
              <Bookmark className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No resources in this category</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
