import React, { useEffect } from 'react';
import { ArrowLeft, Settings, Tv, Lightbulb, Smartphone, Wrench, CheckCircle, Zap, ShoppingBag, ExternalLink } from 'lucide-react';

const SmallProjects = ({ onBack, onShowPage }) => {
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
              <Settings className="w-8 h-8 text-[#3B0A69]" />
              <h1 className="text-3xl font-bold text-gray-900">Small Projects</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#3B0A69] to-purple-900 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4">Small Projects, Big Impact</h2>
            <p className="text-xl text-purple-100 max-w-3xl mx-auto">
              TV mounting, lighting installation, smart device setup, and other technology installations to enhance your home or office.
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
              <Tv className="w-6 h-6 text-[color:var(--techephi-gold)]" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">TV Mounting</h3>
            <p className="text-gray-600">
              Professional TV mounting on walls, above fireplaces, or in custom locations. We handle everything from stud finding to cable management.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="w-12 h-12 bg-gradient-to-br from-[#3B0A69] to-purple-600 rounded-lg flex items-center justify-center mb-4">
              <Lightbulb className="w-6 h-6 text-[color:var(--techephi-gold)]" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Lighting Installation</h3>
            <p className="text-gray-600">
              Install smart bulbs, dimmer switches, LED strips, and custom lighting solutions to transform your space.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="w-12 h-12 bg-gradient-to-br from-[#3B0A69] to-purple-600 rounded-lg flex items-center justify-center mb-4">
              <Smartphone className="w-6 h-6 text-[color:var(--techephi-gold)]" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Smart Device Setup</h3>
            <p className="text-gray-600">
              Setup and configuration of smart speakers, thermostats, doorbells, and other IoT devices for seamless integration.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="w-12 h-12 bg-gradient-to-br from-[#3B0A69] to-purple-600 rounded-lg flex items-center justify-center mb-4">
              <Wrench className="w-6 h-6 text-[color:var(--techephi-gold)]" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Device Installation</h3>
            <p className="text-gray-600">
              Install ceiling fans, security cameras, door locks, and other technology devices with professional precision.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="w-12 h-12 bg-gradient-to-br from-[#3B0A69] to-purple-600 rounded-lg flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-[color:var(--techephi-gold)]" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Electrical Work</h3>
            <p className="text-gray-600">
              Outlet installation, switch replacement, and electrical upgrades to support your new technology.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="w-12 h-12 bg-gradient-to-br from-[#3B0A69] to-purple-600 rounded-lg flex items-center justify-center mb-4">
              <Settings className="w-6 h-6 text-[color:var(--techephi-gold)]" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Custom Solutions</h3>
            <p className="text-gray-600">
              Custom mounting solutions, cable management, and technology installations tailored to your specific needs.
            </p>
          </div>
        </div>

        {/* What's Included */}
        <div className="bg-white rounded-lg shadow-sm border p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">What's Included</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              'Professional installation by certified technicians',
              'Proper mounting hardware and materials',
              'Cable management and concealment',
              'Device configuration and setup',
              'Testing and quality assurance',
              'Cleanup after installation',
              'Basic user training',
              'Warranty on installation work',
              'Follow-up support',
              'Safe and secure mounting',
              'Code-compliant electrical work',
              'Professional appearance'
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-[#3B0A69] mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Common Projects */}
        <div className="bg-white rounded-lg shadow-sm border p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Common Small Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: 'TV & Entertainment',
                items: ['TV wall mounting', 'Soundbar installation', 'Streaming device setup', 'Cable management', 'Home theater wiring']
              },
              {
                title: 'Smart Home Devices',
                items: ['Smart thermostat installation', 'Smart doorbell setup', 'Smart lock installation', 'Smart speaker setup', 'Smart switch installation']
              },
              {
                title: 'Lighting',
                items: ['LED strip installation', 'Dimmer switch installation', 'Smart bulb setup', 'Under-cabinet lighting', 'Outdoor lighting']
              },
              {
                title: 'Security & Safety',
                items: ['Security camera installation', 'Motion sensor setup', 'Smoke detector installation', 'Carbon monoxide detector', 'Water leak sensor']
              }
            ].map((category, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">{category.title}</h3>
                <ul className="space-y-2">
                  {category.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start gap-2 text-gray-600">
                      <CheckCircle className="w-4 h-4 text-[#3B0A69] mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Shop Products Section */}
        <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <ShoppingBag className="w-8 h-8 text-[#3B0A69]" />
            <h2 className="text-2xl font-bold text-gray-900">Shop Recommended Products</h2>
          </div>
          <p className="text-gray-600 mb-6">
            Browse our curated selection of products for your project (mounts, cables, smart devices, lighting, and more).
            Tech ePhi clients can access affiliate links and recommendations in the client portal.
          </p>
          <button
            onClick={() => onShowPage && onShowPage('affiliates')}
            className="inline-flex items-center gap-2 bg-[#3B0A69] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#2d0851] transition-colors"
          >
            <ShoppingBag className="w-5 h-5" />
            View Recommended Products
            <ExternalLink className="w-4 h-4" />
          </button>
          <p className="text-sm text-gray-500 mt-4">
            <strong>Note:</strong> Log in to your client portal to access our affiliate store with exclusive product recommendations and links.
          </p>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-br from-[#3B0A69] to-purple-900 text-white rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Need Help With a Small Project?</h2>
          <p className="text-xl text-purple-100 mb-6 max-w-2xl mx-auto">
            Get professional installation and setup services for your technology projects, big or small.
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

export default SmallProjects;

