import { Users, FolderKanban, Lightbulb, Code } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const DashboardOverview = () => {
  const stats = [
    {
      title: 'Total Users',
      value: '0',
      icon: Users,
      description: 'Registered users',
    },
    {
      title: 'Projects',
      value: '0',
      icon: FolderKanban,
      description: 'Active projects',
    },
    {
      title: 'Skills',
      value: '0',
      icon: Lightbulb,
      description: 'Skills tracked',
    },
    {
      title: 'Technologies',
      value: '0',
      icon: Code,
      description: 'Tech stack items',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
        <p className="text-muted-foreground">Welcome to your admin dashboard</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Welcome to your admin dashboard! Here you can manage:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Users and their roles</li>
              <li>CMS content and data</li>
              <li>Projects with media and links</li>
              <li>Skills and proficiency levels</li>
              <li>Technologies in your stack</li>
              <li>Your admin profile</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardOverview;
