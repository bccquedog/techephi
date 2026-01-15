import React, { useEffect } from 'react';
import { ArrowLeft, Shield, Camera, Lock, Bell, Eye, CheckCircle, AlertTriangle, ShoppingBag, ExternalLink } from 'lucide-react';

const SecuritySolutions = ({ onBack, onShowPage }) => {
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
              <Shield className="w-8 h-8 text-[#3B0A69]" />
              <h1 className="text-3xl font-bold text-gray-900">Security (Home & Office)</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#3B0A69] to-purple-900 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4">Comprehensive Security Solutions</h2>
            <p className="text-xl text-purple-100 max-w-3xl mx-auto">
              Protect what matters most with professional security systems including cameras, alarms, access control, and 24/7 monitoring solutions.
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
              <Camera className="w-6 h-6 text-[color:var(--techephi-gold)]" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Surveillance Systems</h3>
            <p className="text-gray-600">
              High-definition security cameras with night vision, motion detection, and remote viewing capabilities for complete property monitoring.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="w-12 h-12 bg-gradient-to-br from-[#3B0A69] to-purple-600 rounded-lg flex items-center justify-center mb-4">
              <Bell className="w-6 h-6 text-[color:var(--techephi-gold)]" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Alarm Systems</h3>
            <p className="text-gray-600">
              Professional alarm systems with door/window sensors, motion detectors, and glass break detection for comprehensive protection.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="w-12 h-12 bg-gradient-to-br from-[#3B0A69] to-purple-600 rounded-lg flex items-center justify-center mb-4">
              <Lock className="w-6 h-6 text-[color:var(--techephi-gold)]" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Access Control</h3>
            <p className="text-gray-600">
              Smart locks, keypad entry systems, and card readers for secure access management and visitor tracking.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="w-12 h-12 bg-gradient-to-br from-[#3B0A69] to-purple-600 rounded-lg flex items-center justify-center mb-4">
              <Eye className="w-6 h-6 text-[color:var(--techephi-gold)]" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Monitoring Services</h3>
            <p className="text-gray-600">
              24/7 professional monitoring with instant alerts and emergency response coordination.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="w-12 h-12 bg-gradient-to-br from-[#3B0A69] to-purple-600 rounded-lg flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6 text-[color:var(--techephi-gold)]" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Environmental Sensors</h3>
            <p className="text-gray-600">
              Smoke detectors, carbon monoxide sensors, water leak detectors, and temperature monitoring for complete safety.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="w-12 h-12 bg-gradient-to-br from-[#3B0A69] to-purple-600 rounded-lg flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-[color:var(--techephi-gold)]" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Smart Integration</h3>
            <p className="text-gray-600">
              Seamless integration with smart home systems for unified control and automation of security features.
            </p>
          </div>
        </div>

        {/* What's Included */}
        <div className="bg-white rounded-lg shadow-sm border p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">What's Included</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              'Security assessment and site survey',
              'Custom security system design',
              'Professional installation of all equipment',
              'Camera placement and optimization',
              'Network setup for remote access',
              'Mobile app configuration',
              'User training and system walkthrough',
              'Integration with existing systems',
              '24/7 monitoring setup (optional)',
              'Maintenance and support',
              'Warranty on all equipment',
              'Regular system updates and upgrades'
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-[#3B0A69] mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Security Features */}
        <div className="bg-white rounded-lg shadow-sm border p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Security Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: 'Video Surveillance',
                items: ['4K and HD cameras', 'Night vision capability', 'Motion detection', 'Cloud and local storage', 'Mobile app viewing', 'Two-way audio']
              },
              {
                title: 'Intrusion Detection',
                items: ['Door/window sensors', 'Motion detectors', 'Glass break sensors', 'Garage door monitoring', 'Perimeter protection', 'Pet-friendly sensors']
              },
              {
                title: 'Access Control',
                items: ['Smart locks', 'Keypad entry', 'Key card systems', 'Biometric access', 'Visitor management', 'Access logs']
              },
              {
                title: 'Monitoring & Alerts',
                items: ['24/7 professional monitoring', 'Mobile push notifications', 'Email alerts', 'SMS notifications', 'Emergency response', 'Activity logs']
              }
            ].map((feature, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <ul className="space-y-2">
                  {feature.items.map((item, itemIndex) => (
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
            <h2 className="text-2xl font-bold text-gray-900">Shop Security Products</h2>
          </div>
          <p className="text-gray-600 mb-6">
            Browse our curated selection of security systems and products from trusted retailers. 
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
          <h2 className="text-3xl font-bold mb-4">Protect Your Property Today</h2>
          <p className="text-xl text-purple-100 mb-6 max-w-2xl mx-auto">
            Get a free security assessment and custom quote for your home or office security needs.
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

export default SecuritySolutions;

