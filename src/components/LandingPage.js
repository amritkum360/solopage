import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Globe, FileText, Users } from 'lucide-react';
import Header from './Header';

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      {/* <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Globe className="h-8 w-8 text-blue-600 mr-2" />
              <h1 className="text-2xl font-bold text-gray-900">SoloPage</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/login')}
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                Login
              </button>
              <button
                onClick={() => router.push('/login')}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </header> */}
      <Header />
      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Create Your Perfect
            <span className="text-blue-600"> Single Page</span>
            <br />
            Website in Minutes
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Build beautiful, professional single-page websites for your portfolio, business, or personal brand. 
            Choose from our stunning templates and customize everything to match your style.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/login')}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              Start Building Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
            <button
              onClick={() => router.push('/site/john-doe-portfolio')}
              className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              View Examples
            </button>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Beautiful Templates</h3>
            <p className="text-gray-600">
              Choose from our collection of professionally designed templates for portfolios, businesses, and personal websites.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Globe className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Easy Customization</h3>
            <p className="text-gray-600">
              Customize colors, fonts, content, and layout with our intuitive drag-and-drop editor.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Instant Publishing</h3>
            <p className="text-gray-600">
              Publish your website instantly and get a unique URL to share with the world.
            </p>
          </div>
        </div>

        {/* Template Preview Section */}
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Choose Your Template</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Portfolio</h3>
              <p className="text-gray-600 mb-4">Perfect for showcasing your work and skills</p>
              <button
                onClick={() => router.push('/site/john-doe-portfolio')}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                View Template →
              </button>
            </div>
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Business</h3>
              <p className="text-gray-600 mb-4">Great for small businesses and startups</p>
              <button
                onClick={() => router.push('/site/john-doe-business')}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                View Template →
              </button>
            </div>
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Personal</h3>
              <p className="text-gray-600 mb-4">Simple and clean personal website</p>
              <button
                onClick={() => router.push('/site/john-doe-personal')}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                View Template →
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
