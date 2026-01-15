import React, { useEffect } from 'react';
import { ArrowLeft, MessageSquare, TrendingUp, Image, Users, BarChart3, Calendar, CheckCircle } from 'lucide-react';

const SocialMediaManagement = ({ onBack }) => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-600 hover:text-[#3B0A69] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
            <div className="flex items-center gap-3">
              <MessageSquare className="w-8 h-8 text-[#3B0A69]" />
              <h1 className="text-3xl font-bold text-gray-900">Social Media Management</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#3B0A69] to-purple-900 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4">Professional Social Media Strategy & Management</h2>
            <p className="text-xl text-purple-100 max-w-3xl mx-auto">
              Elevate your online presence with strategic social media management that drives engagement, builds your brand, and connects you with your audience.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Services Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="w-12 h-12 bg-gradient-to-br from-[#3B0A69] to-purple-600 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-[color:var(--techephi-gold)]" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Strategy Development</h3>
            <p className="text-gray-600">
              Custom social media strategies tailored to your business goals, target audience, and brand identity.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="w-12 h-12 bg-gradient-to-br from-[#3B0A69] to-purple-600 rounded-lg flex items-center justify-center mb-4">
              <Image className="w-6 h-6 text-[color:var(--techephi-gold)]" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Content Creation</h3>
            <p className="text-gray-600">
              High-quality, engaging content including graphics, videos, and written posts that resonate with your audience.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="w-12 h-12 bg-gradient-to-br from-[#3B0A69] to-purple-600 rounded-lg flex items-center justify-center mb-4">
              <Calendar className="w-6 h-6 text-[color:var(--techephi-gold)]" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Content Scheduling</h3>
            <p className="text-gray-600">
              Strategic posting schedules optimized for maximum engagement across all your social media platforms.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="w-12 h-12 bg-gradient-to-br from-[#3B0A69] to-purple-600 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-[color:var(--techephi-gold)]" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Community Management</h3>
            <p className="text-gray-600">
              Active engagement with your audience, responding to comments, messages, and building meaningful connections.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="w-12 h-12 bg-gradient-to-br from-[#3B0A69] to-purple-600 rounded-lg flex items-center justify-center mb-4">
              <BarChart3 className="w-6 h-6 text-[color:var(--techephi-gold)]" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Analytics & Reporting</h3>
            <p className="text-gray-600">
              Comprehensive performance tracking and monthly reports showing growth, engagement, and ROI.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="w-12 h-12 bg-gradient-to-br from-[#3B0A69] to-purple-600 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-[color:var(--techephi-gold)]" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Growth Optimization</h3>
            <p className="text-gray-600">
              Continuous optimization of your social media presence to increase followers, engagement, and conversions.
            </p>
          </div>
        </div>

        {/* What's Included */}
        <div className="bg-white rounded-lg shadow-sm border p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">What's Included</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              'Platform setup and optimization (Facebook, Instagram, LinkedIn, Twitter, TikTok)',
              'Custom content calendar development',
              'Daily content creation and posting',
              'Community engagement and response management',
              'Hashtag research and strategy',
              'Competitor analysis and market research',
              'Monthly performance reports',
              'Strategy refinement based on analytics',
              'Brand voice and messaging consistency',
              'Crisis management and reputation protection'
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-[#3B0A69] mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Platforms We Manage */}
        <div className="bg-white rounded-lg shadow-sm border p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Platforms We Manage</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {['Facebook', 'Instagram', 'LinkedIn', 'Twitter/X', 'TikTok', 'YouTube', 'Pinterest', 'Snapchat'].map((platform) => (
              <div key={platform} className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="font-semibold text-gray-900">{platform}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-br from-[#3B0A69] to-purple-900 text-white rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Grow Your Social Media Presence?</h2>
          <p className="text-xl text-purple-100 mb-6 max-w-2xl mx-auto">
            Let's discuss how we can help you build a strong online presence and connect with your target audience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/home-solutions"
              className="bg-[color:var(--techephi-gold)] text-[#3B0A69] px-8 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition-colors"
            >
              Request a Quote
            </a>
            <a
              href="tel:407-745-6189"
              className="bg-white text-[#3B0A69] px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Call Us: 407-745-6189
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialMediaManagement;

