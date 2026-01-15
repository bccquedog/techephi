import React, { useEffect } from 'react';
import { ArrowLeft, Activity, Monitor, Wifi, Server, Shield, CheckCircle, Wrench, ShoppingBag, ExternalLink } from 'lucide-react';

const DesktopSupportNetworking = ({ onBack, onShowPage }) => {
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
              <Activity className="w-8 h-8 text-[#3B0A69]" />
              <h1 className="text-3xl font-bold text-gray-900">Desktop Support & Networking</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#3B0A69] to-purple-900 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4">Expert IT Support & Network Solutions</h2>
            <p className="text-xl text-purple-100 max-w-3xl mx-auto">
              Computer repair, network setup, troubleshooting, and ongoing technical support services to keep your technology running smoothly.
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
              <Monitor className="w-6 h-6 text-[color:var(--techephi-gold)]" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Computer Repair</h3>
            <p className="text-gray-600">
              Hardware diagnostics, component replacement, virus removal, and system optimization to get your computer running like new.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="w-12 h-12 bg-gradient-to-br from-[#3B0A69] to-purple-600 rounded-lg flex items-center justify-center mb-4">
              <Wifi className="w-6 h-6 text-[color:var(--techephi-gold)]" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Network Setup</h3>
            <p className="text-gray-600">
              Complete network installation including routers, switches, access points, and network configuration for optimal performance.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="w-12 h-12 bg-gradient-to-br from-[#3B0A69] to-purple-600 rounded-lg flex items-center justify-center mb-4">
              <Wrench className="w-6 h-6 text-[color:var(--techephi-gold)]" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Troubleshooting</h3>
            <p className="text-gray-600">
              Diagnose and resolve connectivity issues, software problems, and performance bottlenecks quickly and efficiently.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="w-12 h-12 bg-gradient-to-br from-[#3B0A69] to-purple-600 rounded-lg flex items-center justify-center mb-4">
              <Server className="w-6 h-6 text-[color:var(--techephi-gold)]" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Network Infrastructure</h3>
            <p className="text-gray-600">
              Design and implement robust network infrastructure for homes and offices with proper cabling and equipment.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="w-12 h-12 bg-gradient-to-br from-[#3B0A69] to-purple-600 rounded-lg flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-[color:var(--techephi-gold)]" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Security & Backup</h3>
            <p className="text-gray-600">
              Network security configuration, firewall setup, data backup solutions, and cybersecurity best practices.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="w-12 h-12 bg-gradient-to-br from-[#3B0A69] to-purple-600 rounded-lg flex items-center justify-center mb-4">
              <Activity className="w-6 h-6 text-[color:var(--techephi-gold)]" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Ongoing Support</h3>
            <p className="text-gray-600">
              Regular maintenance, updates, monitoring, and helpdesk support to keep your systems running smoothly.
            </p>
          </div>
        </div>

        {/* What's Included */}
        <div className="bg-white rounded-lg shadow-sm border p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">What's Included</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              'On-site or remote support options',
              'Hardware diagnostics and repair',
              'Software installation and updates',
              'Network design and installation',
              'Wi-Fi optimization and coverage',
              'Security configuration',
              'Data backup setup',
              'User training and documentation',
              'Preventive maintenance',
              '24/7 emergency support (optional)',
              'Regular system health checks',
              'Performance optimization'
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-[#3B0A69] mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Service Categories */}
        <div className="bg-white rounded-lg shadow-sm border p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Service Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: 'Computer Services',
                items: ['Hardware repair', 'Virus removal', 'Operating system installation', 'Data recovery', 'Performance optimization', 'Component upgrades']
              },
              {
                title: 'Networking Services',
                items: ['Router configuration', 'Wi-Fi setup and optimization', 'Network cabling', 'Mesh network installation', 'VPN setup', 'Network troubleshooting']
              },
              {
                title: 'Security Services',
                items: ['Firewall configuration', 'Antivirus installation', 'Security updates', 'Password management', 'Encryption setup', 'Security audits']
              },
              {
                title: 'Support Services',
                items: ['Helpdesk support', 'Remote assistance', 'On-site visits', 'Training sessions', 'Documentation', 'Maintenance plans']
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
            Browse our curated selection of IT and networking gear (routers, switches, cables, security tools, and more).
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
          <h2 className="text-3xl font-bold mb-4">Need IT Support?</h2>
          <p className="text-xl text-purple-100 mb-6 max-w-2xl mx-auto">
            Get expert help with your computer and network issues. We're here to keep your technology running smoothly.
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

export default DesktopSupportNetworking;

