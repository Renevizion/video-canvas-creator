import { useState } from 'react';
import { motion } from 'framer-motion';
import { Video, Search, Filter, Clock, CheckCircle, AlertCircle, Loader2, Plus, FolderOpen } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { ProjectCard } from '@/components/dashboard/ProjectCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useVideoPlans } from '@/hooks/useVideoData';
import { useNavigate } from 'react-router-dom';

const Projects = () => {
  const navigate = useNavigate();
  const { data: projects = [], isLoading } = useVideoPlans();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.prompt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-background noise-bg">
      <Header />

      <main className="pt-24 px-4 pb-12">
        <div className="container mx-auto max-w-6xl">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
          >
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                <FolderOpen className="w-8 h-8 text-primary" />
                All Projects
              </h1>
              <p className="text-muted-foreground mt-1">
                {projects.length} project{projects.length !== 1 ? 's' : ''} total
              </p>
            </div>
            <Button onClick={() => navigate('/create')} className="gap-2 glow-primary">
              <Plus className="w-4 h-4" />
              New Project
            </Button>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-4 mb-8"
          >
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="analyzing">Analyzing</SelectItem>
                  <SelectItem value="generating_assets">Generating Assets</SelectItem>
                  <SelectItem value="generating_code">Generating Code</SelectItem>
                  <SelectItem value="rendering">Rendering</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </motion.div>

          {/* Projects Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="glass-card aspect-[4/3] animate-pulse bg-muted/50" />
              ))}
            </div>
          ) : filteredProjects.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-card p-12 text-center"
            >
              <Video className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              {searchQuery || statusFilter !== 'all' ? (
                <>
                  <h3 className="text-xl font-semibold text-foreground mb-2">No matching projects</h3>
                  <p className="text-muted-foreground mb-6">
                    Try adjusting your search or filters
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => { setSearchQuery(''); setStatusFilter('all'); }}
                  >
                    Clear Filters
                  </Button>
                </>
              ) : (
                <>
                  <h3 className="text-xl font-semibold text-foreground mb-2">No projects yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Create your first AI-generated video to get started
                  </p>
                  <Button onClick={() => navigate('/create')} className="gap-2">
                    <Plus className="w-4 h-4" />
                    Create First Video
                  </Button>
                </>
              )}
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * Math.min(index, 10) }}
                >
                  <ProjectCard
                    id={project.id}
                    name={project.prompt.slice(0, 50) + (project.prompt.length > 50 ? '...' : '')}
                    status={project.status}
                    createdAt={project.created_at}
                    onOpen={() => navigate(`/project/${project.id}`)}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Projects;
