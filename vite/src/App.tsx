import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './components/ui/card';
import { ChartBarIcon, UsersIcon, FolderIcon } from '@heroicons/react/24/outline';

// Pages
const Dashboard = () => (
  <div className="space-y-8">
    {/* Hero Section */}
    <div className="relative overflow-hidden rounded-xl gradient-primary p-8 text-white glossy pattern-dots">
      <div className="relative z-10">
        <h1 className="text-4xl font-bold neon-text">Welcome back, Admin! 👋</h1>
        <p className="mt-2 max-w-2xl text-blue-100">
          Your dashboard is looking great today. Here's what's happening with your projects.
        </p>
      </div>
      <div className="absolute right-0 top-0 h-full w-1/2">
        <img
          src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/react.svg"
          className="absolute right-8 top-1/2 -translate-y-1/2 h-32 w-32 text-white/10 opacity-20 animate-spin-slow"
          style={{ animationDuration: '20s' }}
        />
      </div>
    </div>

    {/* Stats Cards */}
    <div className="grid gap-6 md:grid-cols-3">
      <Card className="glass-card glossy">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium neon-text">Total Revenue</CardTitle>
          <div className="h-8 w-8 rounded-full gradient-success p-2">
            <ChartBarIcon className="h-4 w-4 text-white" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold neon-text-blue">$45,231.89</div>
          <div className="flex items-center text-xs text-emerald-500">
            <svg className="mr-1 h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"/>
            </svg>
            +20.1% from last month
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card glossy">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium neon-text">Active Users</CardTitle>
          <div className="h-8 w-8 rounded-full gradient-secondary p-2">
            <UsersIcon className="h-4 w-4 text-white" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold neon-text-blue">+2,350</div>
          <div className="flex items-center text-xs text-blue-500">
            <svg className="mr-1 h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"/>
            </svg>
            +180.1% from last month
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card glossy">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium neon-text">Active Projects</CardTitle>
          <div className="h-8 w-8 rounded-full gradient-accent p-2">
            <FolderIcon className="h-4 w-4 text-white" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold neon-text-pink">12</div>
          <div className="flex items-center text-xs text-pink-500">
            <svg className="mr-1 h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"/>
            </svg>
            +3 from last month
          </div>
        </CardContent>
      </Card>
    </div>

    {/* Recent Activity */}
    <Card className="glass-card-colored pattern-grid">
      <CardHeader>
        <CardTitle className="neon-text">Recent Activity</CardTitle>
        <CardDescription>Your team's latest actions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[
            {
              title: "New project created",
              description: "Sarah created 'E-commerce Dashboard'",
              time: "2 hours ago",
              icon: "📊",
              color: "gradient-secondary"
            },
            {
              title: "Files uploaded",
              description: "John uploaded 3 new files to 'Design Assets'",
              time: "5 hours ago",
              icon: "📁",
              color: "gradient-accent"
            },
            {
              title: "Team meeting",
              description: "Weekly sync with design team",
              time: "Yesterday",
              icon: "👥",
              color: "gradient-success"
            }
          ].map((item, index) => (
            <div key={index} className="flex items-start space-x-4">
              <div className={`rounded-full p-2 ${item.color}`}>
                <span className="text-xl">{item.icon}</span>
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium neon-text">{item.title}</h4>
                <p className="text-sm text-muted-foreground">{item.description}</p>
                <span className="text-xs text-muted-foreground">{item.time}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
);

const Team = () => (
  <div className="space-y-8">
    {/* Team Header */}
    <div className="relative overflow-hidden rounded-xl gradient-secondary p-8 text-white glossy pattern-dots">
      <div className="relative z-10">
        <h1 className="text-4xl font-bold neon-text-blue">Team Members</h1>
        <p className="mt-2 max-w-2xl text-blue-100">
          Meet the amazing people behind our success.
        </p>
      </div>
      <div className="absolute right-0 top-0 h-full w-1/2">
        <img
          src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/github.svg"
          className="absolute right-8 top-1/2 -translate-y-1/2 h-32 w-32 text-white/10 opacity-20"
        />
      </div>
    </div>

    <div className="grid gap-6 md:grid-cols-3">
      {[
        {
          name: "John Doe",
          role: "Frontend Developer",
          status: "Active",
          avatar: "https://ui-avatars.com/api/?name=John+Doe&background=6366f1&color=fff",
          stats: { projects: 12, commits: "1.2k", tasks: 25 },
          gradient: "gradient-primary"
        },
        {
          name: "Jane Smith",
          role: "UI Designer",
          status: "In Meeting",
          avatar: "https://ui-avatars.com/api/?name=Jane+Smith&background=8b5cf6&color=fff",
          stats: { projects: 8, commits: "856", tasks: 18 },
          gradient: "gradient-secondary"
        },
        {
          name: "Mike Johnson",
          role: "Backend Developer",
          status: "Offline",
          avatar: "https://ui-avatars.com/api/?name=Mike+Johnson&background=ec4899&color=fff",
          stats: { projects: 15, commits: "2.1k", tasks: 32 },
          gradient: "gradient-accent"
        }
      ].map((member) => (
        <Card key={member.name} className="glass-card glossy">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <div className={`p-1 rounded-full ${member.gradient}`}>
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="h-20 w-20 rounded-full ring-2 ring-white/50"
                />
              </div>
              <h3 className="mt-4 text-lg font-semibold neon-text">{member.name}</h3>
              <p className="text-sm text-muted-foreground">{member.role}</p>
              <span className={`mt-2 rounded-full px-3 py-1 text-xs ${
                member.status === 'Active' ? 'gradient-success text-white' :
                member.status === 'In Meeting' ? 'gradient-secondary text-white' :
                'gradient-accent text-white'
              }`}>
                {member.status}
              </span>
              <div className="mt-4 grid w-full grid-cols-3 gap-4 border-t border-white/10 pt-4">
                <div className="text-center">
                  <p className="text-sm font-medium neon-text">{member.stats.projects}</p>
                  <p className="text-xs text-muted-foreground">Projects</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium neon-text">{member.stats.commits}</p>
                  <p className="text-xs text-muted-foreground">Commits</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium neon-text">{member.stats.tasks}</p>
                  <p className="text-xs text-muted-foreground">Tasks</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

const Projects = () => (
  <div className="space-y-8">
    {/* Projects Header */}
    <div className="relative overflow-hidden rounded-xl gradient-success p-8 text-white glossy pattern-dots">
      <div className="relative z-10">
        <h1 className="text-4xl font-bold neon-text">Projects Overview</h1>
        <p className="mt-2 max-w-2xl text-emerald-100">
          Track and manage your ongoing projects efficiently.
        </p>
      </div>
      <div className="absolute right-0 top-0 h-full w-1/2">
        <img
          src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/git.svg"
          className="absolute right-8 top-1/2 -translate-y-1/2 h-32 w-32 text-white/10 opacity-20"
        />
      </div>
    </div>

    <div className="grid gap-6 md:grid-cols-2">
      {[
        {
          name: "E-commerce Platform",
          status: "In Progress",
          completion: "75%",
          gradient: "gradient-primary",
          team: ["JD", "JS", "MJ"],
          dueDate: "Mar 25, 2024",
          priority: "High"
        },
        {
          name: "Mobile App",
          status: "Planning",
          completion: "20%",
          gradient: "gradient-secondary",
          team: ["JS", "MJ"],
          dueDate: "Apr 15, 2024",
          priority: "Medium"
        },
        {
          name: "Dashboard Redesign",
          status: "Review",
          completion: "90%",
          gradient: "gradient-accent",
          team: ["JD", "JS"],
          dueDate: "Mar 10, 2024",
          priority: "High"
        },
        {
          name: "API Integration",
          status: "In Progress",
          completion: "45%",
          gradient: "gradient-success",
          team: ["MJ", "JD"],
          dueDate: "Mar 30, 2024",
          priority: "Medium"
        }
      ].map((project) => (
        <Card key={project.name} className="glass-card glossy">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg neon-text">{project.name}</CardTitle>
              <span className={`rounded-full px-3 py-1 text-xs ${
                project.priority === 'High' ? 'gradient-accent text-white' :
                'gradient-secondary text-white'
              }`}>
                {project.priority}
              </span>
            </div>
            <CardDescription className="flex items-center space-x-2">
              <span>{project.status}</span>
              <span>•</span>
              <span>Due {project.dueDate}</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="mb-1 flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{project.completion}</span>
                </div>
                <div className="progress-bar">
                  <div
                    className={`h-full rounded-full ${project.gradient}`}
                    style={{ width: project.completion }}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex -space-x-2">
                  {project.team.map((member, index) => (
                    <div
                      key={index}
                      className={`flex h-8 w-8 items-center justify-center rounded-full ${project.gradient} text-xs text-white ring-2 ring-white/50`}
                    >
                      {member}
                    </div>
                  ))}
                </div>
                <button className="btn-glass">
                  Details
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="team" element={<Team />} />
          <Route path="projects" element={<Projects />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App; 