import React, { useEffect } from 'react';
import { ArrowLeft, Globe, Home, Zap, Shield, Smartphone, CheckCircle, Wifi, ShoppingBag, ExternalLink } from 'lucide-react';

const SmartHomeImplementation = ({ onBack, onShowPage }) => {
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
              <Globe className="w-8 h-8 text-[#3B0A69]" />
              <h1 className="text-3xl font-bold text-gray-900">Smart Home Implementation</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#3B0A69] to-purple-900 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4">Transform Your Home Into a Smart Home</h2>
            <p className="text-xl text-purple-100 max-w-3xl mx-auto">
              Complete smart home setup including automation, lighting, security systems, and seamless device integration for a connected living experience.
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
              <Home className="w-6 h-6 text-[color:var(--techephi-gold)]" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Home Automation</h3>
            <p className="text-gray-600">
              Control your entire home from one central hub. Automate lights, thermostats, blinds, and more with voice commands or mobile apps.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="w-12 h-12 bg-gradient-to-br from-[#3B0A69] to-purple-600 rounded-lg flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-[color:var(--techephi-gold)]" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Smart Lighting</h3>
            <p className="text-gray-600">
              Energy-efficient LED lighting systems with color control, scheduling, and automation to create the perfect ambiance.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="w-12 h-12 bg-gradient-to-br from-[#3B0A69] to-purple-600 rounded-lg flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-[color:var(--techephi-gold)]" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Integrated Security</h3>
            <p className="text-gray-600">
              Smart locks, cameras, motion sensors, and alarm systems that integrate seamlessly with your home automation.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="w-12 h-12 bg-gradient-to-br from-[#3B0A69] to-purple-600 rounded-lg flex items-center justify-center mb-4">
              <Smartphone className="w-6 h-6 text-[color:var(--techephi-gold)]" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Voice Control</h3>
            <p className="text-gray-600">
              Integration with Amazon Alexa, Google Assistant, and Apple HomeKit for hands-free control of your entire home.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="w-12 h-12 bg-gradient-to-br from-[#3B0A69] to-purple-600 rounded-lg flex items-center justify-center mb-4">
              <Wifi className="w-6 h-6 text-[color:var(--techephi-gold)]" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Network Infrastructure</h3>
            <p className="text-gray-600">
              Robust Wi-Fi networks and mesh systems to ensure all your smart devices stay connected reliably.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="w-12 h-12 bg-gradient-to-br from-[#3B0A69] to-purple-600 rounded-lg flex items-center justify-center mb-4">
              <Globe className="w-6 h-6 text-[color:var(--techephi-gold)]" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Device Integration</h3>
            <p className="text-gray-600">
              Connect and control devices from different manufacturers through unified platforms and hubs.
            </p>
          </div>
        </div>

        {/* What's Included */}
        <div className="bg-white rounded-lg shadow-sm border p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">What's Included</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              'Complete home assessment and consultation',
              'Custom smart home design and planning',
              'Professional installation of all devices',
              'Network setup and optimization',
              'Device configuration and programming',
              'Mobile app setup and training',
              'Voice assistant integration',
              'Automation scene creation',
              'User training and documentation',
              'Ongoing support and maintenance',
              'Warranty on all installed equipment',
              'Future expansion planning'
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-[#3B0A69] mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Smart Home Systems */}
        <div className="bg-white rounded-lg shadow-sm border p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Smart Home Systems We Work With</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Amazon Alexa', 'Google Home', 'Apple HomeKit', 'SmartThings', 'Hubitat', 'Home Assistant', 'Control4', 'Crestron'].map((system) => (
              <div key={system} className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="font-medium text-gray-900">{system}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Smart Home Categories */}
        <div className="bg-white rounded-lg shadow-sm border p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Smart Home Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: 'Climate Control',
                items: ['Smart thermostats', 'HVAC integration', 'Ceiling fans', 'Window treatments']
              },
              {
                title: 'Entertainment',
                items: ['Smart TVs', 'Whole-home audio', 'Streaming devices', 'Gaming systems']
              },
              {
                title: 'Kitchen & Appliances',
                items: ['Smart refrigerators', 'Ovens and ranges', 'Dishwashers', 'Coffee makers']
              },
              {
                title: 'Outdoor & Landscape',
                items: ['Smart irrigation', 'Outdoor lighting', 'Pool controls', 'Weather stations']
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
            <h2 className="text-2xl font-bold text-gray-900">Shop Smart Home Products</h2>
          </div>
          <p className="text-gray-600 mb-6">
            Browse our curated selection of smart home devices and products from trusted retailers. 
            As a Tech ePhi client, you can access exclusive affiliate links and product recommendations.
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
          <h2 className="text-3xl font-bold mb-4">Ready to Make Your Home Smart?</h2>
          <p className="text-xl text-purple-100 mb-6 max-w-2xl mx-auto">
            Let's discuss your smart home goals and create a customized solution that fits your lifestyle and budget.
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

export default SmartHomeImplementation;

