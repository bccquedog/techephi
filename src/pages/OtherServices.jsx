import React, { useEffect } from 'react';
import { ArrowLeft, MoreHorizontal, Lightbulb, Wrench, GraduationCap, CheckCircle, Mail, Phone } from 'lucide-react';

const OtherServices = ({ onBack }) => {
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
              <MoreHorizontal className="w-8 h-8 text-[#3B0A69]" />
              <h1 className="text-3xl font-bold text-gray-900">Other Services</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#3B0A69] to-purple-900 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4">Don't See What You Need?</h2>
            <p className="text-xl text-purple-100 max-w-3xl mx-auto">
              We're here to help! Whether it's a unique technology challenge or a service not listed, we can likely assist or point you in the right direction.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Services We Can Help With */}
        <div className="bg-white rounded-lg shadow-sm border p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Additional Services We Offer</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                icon: Lightbulb,
                title: 'Technology Consulting',
                description: 'Expert advice on technology decisions, infrastructure planning, and digital strategy.'
              },
              {
                icon: Wrench,
                title: 'IT Support & Maintenance',
                description: 'Ongoing technical support, system maintenance, and troubleshooting for your business.'
              },
              {
                icon: GraduationCap,
                title: 'Training & Education',
                description: 'Staff training on new systems, software, and technology best practices.'
              },
              {
                icon: CheckCircle,
                title: 'System Integration',
                description: 'Connecting different systems and platforms to work seamlessly together.'
              },
              {
                icon: Mail,
                title: 'Email Marketing Solutions',
                description: 'Email campaign setup, automation, and management to reach your customers effectively.'
              },
              {
                icon: Phone,
                title: 'VoIP & Communication Systems',
                description: 'Business phone systems, VoIP setup, and unified communications solutions.'
              }
            ].map((service, index) => (
              <div key={index} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-gradient-to-br from-[#3B0A69] to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <service.icon className="w-6 h-6 text-[color:var(--techephi-gold)]" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{service.title}</h3>
                  <p className="text-gray-600">{service.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Custom Solutions */}
        <div className="bg-white rounded-lg shadow-sm border p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Custom Solutions</h2>
          <p className="text-gray-700 text-lg mb-6">
            Every business is unique, and sometimes you need a solution that doesn't fit into a standard category. We specialize in creating custom technology solutions tailored to your specific needs.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              'Custom workflow automation',
              'Specialized software development',
              'Unique hardware integrations',
              'Bespoke system architecture',
              'Custom API development',
              'Tailored security solutions',
              'Industry-specific applications',
              'Legacy system modernization'
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-[#3B0A69] mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* How We Can Help */}
        <div className="bg-white rounded-lg shadow-sm border p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">How We Can Help</h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-[#3B0A69] text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Consultation</h3>
                <p className="text-gray-600">
                  We'll discuss your needs, challenges, and goals to understand what you're looking for.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-[#3B0A69] text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Solution Design</h3>
                <p className="text-gray-600">
                  We'll design a custom solution or recommend the best approach for your specific situation.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-[#3B0A69] text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Implementation</h3>
                <p className="text-gray-600">
                  If we can help, we'll implement the solution. If not, we'll connect you with the right resources.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-br from-[#3B0A69] to-purple-900 text-white rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Let's Discuss Your Needs</h2>
          <p className="text-xl text-purple-100 mb-6 max-w-2xl mx-auto">
            Have a unique requirement or question? We're here to help. Reach out and let's explore how we can assist you.
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
            <a
              href="mailto:support@techephi.com"
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-[#3B0A69] transition-colors"
            >
              Email Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtherServices;

