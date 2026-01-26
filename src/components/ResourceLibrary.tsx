import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface RemotionPackage {
  name: string;
  description: string;
  installed: boolean;
  priority: 'high' | 'medium' | 'low';
  useCase: string;
  installCommand: string;
}

interface FreeAPI {
  name: string;
  description: string;
  endpoint: string;
  example: string;
  noSignup: boolean;
  category: 'logos' | 'images' | 'data' | 'fonts' | 'charts' | 'qr';
}

export const ResourceLibrary: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'packages' | 'apis'>('packages');
  const [searchQuery, setSearchQuery] = useState('');

  const remotionPackages: RemotionPackage[] = [
    {
      name: '@remotion/transitions',
      description: 'Professional transitions between scenes',
      installed: false,
      priority: 'high',
      useCase: 'Smooth scene changes, slide/fade/wipe effects',
      installCommand: 'npm install @remotion/transitions',
    },
    {
      name: '@remotion/lottie',
      description: 'Embed Lottie animations from LottieFiles.com',
      installed: false,
      priority: 'high',
      useCase: 'Professional animations without After Effects',
      installCommand: 'npm install @remotion/lottie lottie-web',
    },
    {
      name: '@remotion/google-fonts',
      description: '1400+ Google Fonts instantly available',
      installed: false,
      priority: 'high',
      useCase: 'Typography variety without font files',
      installCommand: 'npm install @remotion/google-fonts',
    },
    {
      name: '@remotion/gif',
      description: 'Embed GIFs in your videos',
      installed: false,
      priority: 'medium',
      useCase: 'Memes, reactions, animated content',
      installCommand: 'npm install @remotion/gif',
    },
    {
      name: '@remotion/tailwind',
      description: 'Use Tailwind CSS in Remotion',
      installed: false,
      priority: 'medium',
      useCase: 'Rapid styling with utility classes',
      installCommand: 'npm install @remotion/tailwind tailwindcss',
    },
  ];

  const freeAPIs: FreeAPI[] = [
    {
      name: 'Clearbit Logo API',
      description: 'Company logos - instant, high quality',
      endpoint: 'https://logo.clearbit.com/{domain}',
      example: 'https://logo.clearbit.com/apple.com',
      noSignup: true,
      category: 'logos',
    },
    {
      name: 'Google Favicon API',
      description: 'Website favicons at any size',
      endpoint: 'https://www.google.com/s2/favicons?domain={domain}&sz={size}',
      example: 'https://www.google.com/s2/favicons?domain=google.com&sz=128',
      noSignup: true,
      category: 'logos',
    },
    {
      name: 'UI Avatars',
      description: 'Generate avatars from names',
      endpoint: 'https://ui-avatars.com/api/?name={name}&size={size}',
      example: 'https://ui-avatars.com/api/?name=John+Doe&size=200',
      noSignup: true,
      category: 'images',
    },
    {
      name: 'Picsum Photos',
      description: 'Random high-quality photos',
      endpoint: 'https://picsum.photos/{width}/{height}',
      example: 'https://picsum.photos/800/600',
      noSignup: true,
      category: 'images',
    },
    {
      name: 'DuckDuckGo Instant Answer',
      description: 'Quick facts and definitions',
      endpoint: 'https://api.duckduckgo.com/?q={query}&format=json',
      example: 'https://api.duckduckgo.com/?q=apple+inc&format=json',
      noSignup: true,
      category: 'data',
    },
    {
      name: 'QuickChart',
      description: 'Generate charts as images',
      endpoint: 'https://quickchart.io/chart?c={config}',
      example: 'https://quickchart.io/chart?c={type:"bar",data:{labels:["Q1","Q2"],datasets:[{data:[25,45]}]}}',
      noSignup: true,
      category: 'charts',
    },
    {
      name: 'QR Code API',
      description: 'Generate QR codes on the fly',
      endpoint: 'https://api.qrserver.com/v1/create-qr-code/?size={size}&data={data}',
      example: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://example.com',
      noSignup: true,
      category: 'qr',
    },
  ];

  const filteredPackages = remotionPackages.filter(
    (pkg) =>
      pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAPIs = freeAPIs.filter(
    (api) =>
      api.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      api.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleInstallPackage = async (pkg: RemotionPackage) => {
    // This would trigger actual installation via API
    alert(`Installing ${pkg.name}...\n\nRun this command:\n${pkg.installCommand}`);
  };

  const handleUseAPI = (api: FreeAPI) => {
    // Copy example to clipboard
    navigator.clipboard.writeText(api.example);
    alert(`Example URL copied to clipboard!\n\n${api.example}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Resource Library
        </h1>
        <p className="text-gray-600">
          Remotion packages and free APIs - no signups required!
        </p>
      </div>

      {/* Search */}
      <div className="max-w-7xl mx-auto mb-6">
        <input
          type="text"
          placeholder="Search resources..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex space-x-4 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('packages')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'packages'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Remotion Packages ({filteredPackages.length})
          </button>
          <button
            onClick={() => setActiveTab('apis')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'apis'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Free APIs ({filteredAPIs.length})
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto">
        {activeTab === 'packages' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPackages.map((pkg, index) => (
              <motion.div
                key={pkg.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                {/* Priority Badge */}
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded ${
                      pkg.priority === 'high'
                        ? 'bg-red-100 text-red-800'
                        : pkg.priority === 'medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {pkg.priority.toUpperCase()} PRIORITY
                  </span>
                  {pkg.installed && (
                    <span className="text-green-600 text-sm font-medium">
                      ✓ Installed
                    </span>
                  )}
                </div>

                {/* Package Name */}
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {pkg.name}
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-3">{pkg.description}</p>

                {/* Use Case */}
                <div className="mb-4">
                  <p className="text-xs text-gray-500 uppercase font-semibold mb-1">
                    Use Case
                  </p>
                  <p className="text-sm text-gray-700">{pkg.useCase}</p>
                </div>

                {/* Install Button */}
                <button
                  onClick={() => handleInstallPackage(pkg)}
                  disabled={pkg.installed}
                  className={`w-full py-2 px-4 rounded font-medium transition-colors ${
                    pkg.installed
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {pkg.installed ? 'Already Installed' : 'Install Package'}
                </button>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAPIs.map((api, index) => (
              <motion.div
                key={api.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                {/* Category Badge */}
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2 py-1 text-xs font-semibold rounded bg-green-100 text-green-800">
                    {api.category.toUpperCase()}
                  </span>
                  {api.noSignup && (
                    <span className="text-green-600 text-xs font-medium">
                      ✓ NO SIGNUP
                    </span>
                  )}
                </div>

                {/* API Name */}
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {api.name}
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-3">{api.description}</p>

                {/* Endpoint */}
                <div className="mb-3">
                  <p className="text-xs text-gray-500 uppercase font-semibold mb-1">
                    Endpoint
                  </p>
                  <code className="text-xs bg-gray-100 p-2 rounded block overflow-x-auto">
                    {api.endpoint}
                  </code>
                </div>

                {/* Example */}
                <div className="mb-4">
                  <p className="text-xs text-gray-500 uppercase font-semibold mb-1">
                    Example
                  </p>
                  <div className="bg-gray-50 p-2 rounded">
                    <img
                      src={api.example}
                      alt={`${api.name} example`}
                      className="w-full h-32 object-contain"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                </div>

                {/* Use Button */}
                <button
                  onClick={() => handleUseAPI(api)}
                  className="w-full py-2 px-4 rounded font-medium bg-green-600 text-white hover:bg-green-700 transition-colors"
                >
                  Copy Example URL
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* No Results */}
      {((activeTab === 'packages' && filteredPackages.length === 0) ||
        (activeTab === 'apis' && filteredAPIs.length === 0)) && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No results found for "{searchQuery}"
          </p>
        </div>
      )}
    </div>
  );
};
