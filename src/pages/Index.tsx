import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, LayoutDashboard } from 'lucide-react';

const Index = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background to-muted/30 p-4">
      <div className="max-w-3xl text-center space-y-8">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2 text-sm text-accent">
            <LayoutDashboard className="h-4 w-4" />
            Admin Dashboard
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
            Manage Your Content
            <span className="text-accent"> With Ease</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A professional admin dashboard for managing users, projects, skills, and CMS content.
            Built with React, TypeScript, and Tailwind CSS.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button size="lg" asChild>
            <Link to="/login">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link to="/signup">
              Create Account
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <div className="space-y-2 p-6 rounded-lg bg-card border">
            <h3 className="font-semibold text-lg">User Management</h3>
            <p className="text-sm text-muted-foreground">
              Manage users, roles, and permissions with ease
            </p>
          </div>
          <div className="space-y-2 p-6 rounded-lg bg-card border">
            <h3 className="font-semibold text-lg">Content Control</h3>
            <p className="text-sm text-muted-foreground">
              Full CRUD operations for all your CMS data
            </p>
          </div>
          <div className="space-y-2 p-6 rounded-lg bg-card border">
            <h3 className="font-semibold text-lg">Modern UI</h3>
            <p className="text-sm text-muted-foreground">
              Clean, responsive design with dark mode support
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
