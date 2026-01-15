import React, { useEffect } from 'react';
import { ArrowLeft, User, Code, Globe, Smartphone, Database, Cloud, Shield, Zap, CheckCircle } from 'lucide-react';

const TechnologySolutions = ({ onBack }) => {
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
              <User className="w-8 h-8 text-[#3B0A69]" />
              <h1 className="text-3xl font-bold text-gray-900">Technology Solutions</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#3B0A69] to-purple-900 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4">Comprehensive Technology Solutions</h2>
            <p className="text-xl text-purple-100 max-w-3xl mx-auto">
              From web design to custom software development, we provide end-to-end technology solutions that transform your business and drive digital success.
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
              <Globe className="w-6 h-6 text-[color:var(--techephi-gold)]" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Web Design & Development</h3>
            <p className="text-gray-600">
              Custom websites that are responsive, fast, and optimized for conversions. From simple landing pages to complex e-commerce platforms.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="w-12 h-12 bg-gradient-to-br from-[#3B0A69] to-purple-600 rounded-lg flex items-center justify-center mb-4">
              <Smartphone className="w-6 h-6 text-[color:var(--techephi-gold)]" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Mobile App Development</h3>
            <p className="text-gray-600">
              Native and cross-platform mobile applications for iOS and Android that provide seamless user experiences.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="w-12 h-12 bg-gradient-to-br from-[#3B0A69] to-purple-600 rounded-lg flex items-center justify-center mb-4">
              <Code className="w-6 h-6 text-[color:var(--techephi-gold)]" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Custom Software Development</h3>
            <p className="text-gray-600">
              Tailored software solutions designed to solve your specific business challenges and streamline operations.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="w-12 h-12 bg-gradient-to-br from-[#3B0A69] to-purple-600 rounded-lg flex items-center justify-center mb-4">
              <Database className="w-6 h-6 text-[color:var(--techephi-gold)]" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Database Design & Management</h3>
            <p className="text-gray-600">
              Efficient database architecture, optimization, and management to ensure your data is secure and accessible.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="w-12 h-12 bg-gradient-to-br from-[#3B0A69] to-purple-600 rounded-lg flex items-center justify-center mb-4">
              <Cloud className="w-6 h-6 text-[color:var(--techephi-gold)]" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Cloud Solutions & Migration</h3>
            <p className="text-gray-600">
              Cloud infrastructure setup, migration services, and ongoing management to scale your business efficiently.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="w-12 h-12 bg-gradient-to-br from-[#3B0A69] to-purple-600 rounded-lg flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-[color:var(--techephi-gold)]" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Digital Transformation</h3>
            <p className="text-gray-600">
              Complete digital transformation strategies to modernize your business processes and improve efficiency.
            </p>
          </div>
        </div>

        {/* What's Included */}
        <div className="bg-white rounded-lg shadow-sm border p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Development Process</h2>
          <div className="space-y-6">
            {[
              {
                title: 'Discovery & Planning',
                description: 'We start by understanding your business goals, target audience, and technical requirements to create a comprehensive project plan.'
              },
              {
                title: 'Design & Prototyping',
                description: 'Our design team creates user-friendly interfaces and prototypes that align with your brand and user needs.'
              },
              {
                title: 'Development & Testing',
                description: 'Agile development process with regular updates, testing, and quality assurance to ensure a robust final product.'
              },
              {
                title: 'Deployment & Launch',
                description: 'Smooth deployment process with minimal downtime, ensuring your solution goes live without disruption.'
              },
              {
                title: 'Maintenance & Support',
                description: 'Ongoing support, updates, and maintenance to keep your technology running smoothly and securely.'
              }
            ].map((step, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-[#3B0A69] text-white rounded-full flex items-center justify-center font-bold">
                  {index + 1}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Technologies */}
        <div className="bg-white rounded-lg shadow-sm border p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Technologies We Work With</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              'React', 'Vue.js', 'Angular', 'Node.js',
              'Python', 'PHP', 'Java', '.NET',
              'MySQL', 'PostgreSQL', 'MongoDB', 'Firebase',
              'AWS', 'Azure', 'Google Cloud', 'Docker'
            ].map((tech) => (
              <div key={tech} className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="font-medium text-gray-900">{tech}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-br from-[#3B0A69] to-purple-900 text-white rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Business?</h2>
          <p className="text-xl text-purple-100 mb-6 max-w-2xl mx-auto">
            Let's discuss your technology needs and create a solution that drives your business forward.
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

export default TechnologySolutions;

