import React, { useState, useEffect } from 'react';
import { CodeIcon, Terminal, Cpu, GitBranch, Users, Boxes } from 'lucide-react';
import { generateCode } from '../services/api';
import images from '../../public/assets/images.json';

interface Stats {
  icon: React.ReactNode;
  label: string;
  value: string;
  image: string;
}

const DashboardPage = () => {
  const [prompt, setPrompt] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeTab, setActiveTab] = useState('prompt');

  const stats: Stats[] = [
    { icon: <CodeIcon className="w-6 h-6" />, label: 'Lines Generated', value: '150K+', image: images['code-generation'] },
    { icon: <Terminal className="w-6 h-6" />, label: 'API Endpoints', value: '50+', image: images['api-endpoint'] },
    { icon: <Cpu className="w-6 h-6" />, label: 'Processing Power', value: '2.5x', image: images['processing'] },
    { icon: <GitBranch className="w-6 h-6" />, label: 'Git Commits', value: '1.2K', image: images['git-commit'] },
    { icon: <Users className="w-6 h-6" />, label: 'Active Users', value: '500+', image: images['users'] },
    { icon: <Boxes className="w-6 h-6" />, label: 'Components', value: '200+', image: images['react-component'] },
  ];

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      document.documentElement.style.setProperty('--mouse-x', `${x}%`);
      document.documentElement.style.setProperty('--mouse-y', `${y}%`);
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleGenerateCode = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await generateCode(prompt);
      setGeneratedCode(response.data.code);
    } catch (err) {
      setError('Failed to generate code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCode);
  };

  return (
    <div className="relative min-h-screen p-8 bg-gradient-to-tr from-[#101b30] via-[#1a1f3a] to-[#1a1337] text-white space-y-10">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-xl p-8 border border-purple-500/30 bg-gradient-to-br from-[#241d4a]/60 via-[#31265c]/60 to-[#2a1d4e]/60 shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 via-fuchsia-500/10 to-cyan-500/10 pointer-events-none" />
        <div className="relative z-10 flex items-center justify-between">
          <div className="space-y-4">
            <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-fuchsia-500 to-cyan-400 animate-text-glow">
              🚀 AI Code Generation
            </h1>
            <p className="text-lg text-white/80 max-w-lg">
              Transform your ideas into clean, production-ready code instantly using advanced AI tools.
            </p>
          </div>
          <img src={images['ai-robot']} alt="AI Robot" className="w-36 h-36 animate-float" />
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="relative group rounded-xl p-6 bg-gradient-to-br from-[#2b2d55]/70 to-[#3d2f58]/70 border border-purple-600/20 shadow-md hover:shadow-xl transition-all duration-300"
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br from-purple-400/10 via-pink-400/10 to-blue-400/10 rounded-xl" />
            <div className="relative z-10 flex items-center space-x-4">
              <img src={stat.image} alt={stat.label} className="w-12 h-12 rounded-lg" />
              <div>
                <p className="text-sm text-white/70">{stat.label}</p>
                <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                  {stat.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Prompt Section */}
      <div className="rounded-xl p-8 bg-[#1a1f3a]/60 border border-purple-500/20 shadow-md space-y-6">
        <div className="flex space-x-4">
          {['prompt', 'examples'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-xl transition-all font-semibold ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-md'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              {tab === 'prompt' ? 'Custom Prompt' : 'Examples'}
            </button>
          ))}
        </div>

        {activeTab === 'prompt' ? (
          <div className="space-y-4">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the code you want to generate..."
              className="w-full h-32 p-4 rounded-lg bg-[#1d2238] text-white resize-none border border-purple-500/20 focus:ring-2 focus:ring-cyan-500"
            />
            <div className="flex justify-end">
              <button
                onClick={handleGenerateCode}
                disabled={loading}
                className="px-6 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-semibold shadow hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {loading ? 'Generating...' : 'Generate Code'}
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {['React Component', 'API Endpoint', 'Database Schema', 'Authentication'].map((example) => (
              <div
                key={example}
                onClick={() => {
                  setActiveTab('prompt');
                  setPrompt(`Generate a ${example.toLowerCase()}`);
                }}
                className="cursor-pointer p-4 rounded-lg bg-white/10 hover:bg-white/20 border border-purple-500/20 text-white"
              >
                <h3 className="font-semibold">{example}</h3>
                <p className="text-sm text-white/70">Click to use this template</p>
              </div>
            ))}
          </div>
        )}

        {error && <p className="text-red-400">{error}</p>}

        {generatedCode && (
          <div className="space-y-4 mt-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Generated Code</h3>
              <button
                onClick={copyToClipboard}
                className="px-4 py-1 bg-white/20 rounded-lg hover:bg-white/30 text-white text-sm"
              >
                Copy Code
              </button>
            </div>
            <pre className="bg-white/10 p-4 rounded-lg overflow-x-auto text-sm text-white border border-purple-500/20">
              <code>{generatedCode}</code>
            </pre>
          </div>
        )}
      </div>

      {/* Recent Generations */}
      <div className="rounded-xl p-8 bg-[#1b213a]/60 border border-purple-500/20">
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mb-6">
          Recent Generations
        </h2>
        <div className="space-y-6">
          {[
            {
              title: 'Authentication Component',
              description: 'Generated a secure authentication system with JWT',
              timestamp: '2 hours ago',
              type: 'React Component',
            },
            {
              title: 'User API',
              description: 'Created REST endpoints for user management',
              timestamp: '5 hours ago',
              type: 'API Endpoint',
            },
            {
              title: 'Product Schema',
              description: 'Generated MongoDB schema for product catalog',
              timestamp: '1 day ago',
              type: 'Database Schema',
            },
          ].map((item, index) => (
            <div
              key={index}
              className="p-4 rounded-lg bg-white/10 hover:bg-white/20 transition-colors border border-purple-500/20"
            >
              <h3 className="font-semibold text-white">{item.title}</h3>
              <p className="text-sm text-white/70">{item.description}</p>
              <div className="flex items-center space-x-2 mt-2">
                <span className="text-xs text-white/50">{item.timestamp}</span>
                <span className="text-xs px-2 py-1 rounded-full bg-gradient-to-r from-purple-500 via-fuchsia-500 to-cyan-500 text-white">
                  {item.type}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
