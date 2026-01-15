import React, { useEffect } from 'react';
import { ArrowLeft, Code, Globe, Smartphone, Palette, Zap, Database, Shield, CheckCircle, Monitor } from 'lucide-react';

const WebDesignDevelopment = ({ onBack }) => {
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
              <Code className="w-8 h-8 text-[#3B0A69]" />
              <h1 className="text-3xl font-bold text-gray-900">Web Design and Application Development</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#3B0A69] to-purple-900 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4">Custom Digital Solutions for Your Business</h2>
            <p className="text-xl text-purple-100 max-w-3xl mx-auto">
              From stunning websites to powerful web applications and mobile apps, we create digital solutions that drive results and elevate your online presence.
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
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Website Design</h3>
            <p className="text-gray-600">
              Beautiful, responsive websites that look great on all devices and convert visitors into customers.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="w-12 h-12 bg-gradient-to-br from-[#3B0A69] to-purple-600 rounded-lg flex items-center justify-center mb-4">
              <Code className="w-6 h-6 text-[color:var(--techephi-gold)]" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Web Applications</h3>
            <p className="text-gray-600">
              Custom web applications built to streamline your business processes and improve efficiency.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="w-12 h-12 bg-gradient-to-br from-[#3B0A69] to-purple-600 rounded-lg flex items-center justify-center mb-4">
              <Smartphone className="w-6 h-6 text-[color:var(--techephi-gold)]" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Mobile Apps</h3>
            <p className="text-gray-600">
              Native and cross-platform mobile applications for iOS and Android that engage your users.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="w-12 h-12 bg-gradient-to-br from-[#3B0A69] to-purple-600 rounded-lg flex items-center justify-center mb-4">
              <Palette className="w-6 h-6 text-[color:var(--techephi-gold)]" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">UI/UX Design</h3>
            <p className="text-gray-600">
              User-centered design that creates intuitive, engaging experiences your customers will love.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="w-12 h-12 bg-gradient-to-br from-[#3B0A69] to-purple-600 rounded-lg flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-[color:var(--techephi-gold)]" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">E-Commerce Solutions</h3>
            <p className="text-gray-600">
              Complete online stores with secure payment processing, inventory management, and order tracking.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="w-12 h-12 bg-gradient-to-br from-[#3B0A69] to-purple-600 rounded-lg flex items-center justify-center mb-4">
              <Monitor className="w-6 h-6 text-[color:var(--techephi-gold)]" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Progressive Web Apps</h3>
            <p className="text-gray-600">
              Modern PWAs that combine the best of web and mobile apps for a seamless user experience.
            </p>
          </div>
        </div>

        {/* What's Included */}
        <div className="bg-white rounded-lg shadow-sm border p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">What's Included</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              'Responsive design (mobile, tablet, desktop)',
              'SEO optimization and best practices',
              'Fast loading times and performance optimization',
              'Secure hosting setup and configuration',
              'Content management system (CMS) integration',
              'Contact forms and lead capture systems',
              'Social media integration',
              'Analytics and tracking setup',
              'Cross-browser compatibility',
              'Ongoing maintenance and support',
              'Regular security updates',
              'Backup and recovery solutions'
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-[#3B0A69] mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Development Process */}
        <div className="bg-white rounded-lg shadow-sm border p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Development Process</h2>
          <div className="space-y-6">
            {[
              {
                title: 'Discovery & Planning',
                description: 'We start by understanding your business goals, target audience, and requirements to create a comprehensive project roadmap.'
              },
              {
                title: 'Design & Wireframing',
                description: 'Our design team creates wireframes and mockups that align with your brand and user needs before development begins.'
              },
              {
                title: 'Development',
                description: 'Agile development process with regular updates, testing, and quality assurance to ensure a robust final product.'
              },
              {
                title: 'Testing & Quality Assurance',
                description: 'Thorough testing across devices and browsers to ensure everything works perfectly before launch.'
              },
              {
                title: 'Deployment & Launch',
                description: 'Smooth deployment process with minimal downtime, ensuring your site or app goes live without disruption.'
              },
              {
                title: 'Maintenance & Support',
                description: 'Ongoing support, updates, and maintenance to keep your digital solution running smoothly and securely.'
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
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Technologies We Use</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Frontend</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {['React', 'Vue.js', 'Angular', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Sass', 'HTML5/CSS3'].map((tech) => (
                  <div key={tech} className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="font-medium text-gray-900">{tech}</div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Backend</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {['Node.js', 'Python', 'PHP', 'Java', '.NET', 'Express', 'Django', 'Laravel'].map((tech) => (
                  <div key={tech} className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="font-medium text-gray-900">{tech}</div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Mobile</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {['React Native', 'Flutter', 'Swift', 'Kotlin', 'Ionic', 'Xamarin'].map((tech) => (
                  <div key={tech} className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="font-medium text-gray-900">{tech}</div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Database & Cloud</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {['MySQL', 'PostgreSQL', 'MongoDB', 'Firebase', 'AWS', 'Azure', 'Google Cloud', 'Docker'].map((tech) => (
                  <div key={tech} className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="font-medium text-gray-900">{tech}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Types of Projects */}
        <div className="bg-white rounded-lg shadow-sm border p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Types of Projects We Handle</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              'Corporate websites and landing pages',
              'E-commerce platforms and online stores',
              'Web applications and SaaS platforms',
              'Mobile applications (iOS & Android)',
              'Progressive Web Apps (PWAs)',
              'Content Management Systems',
              'Customer portals and dashboards',
              'API development and integration',
              'Legacy system modernization',
              'Custom business applications'
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-[#3B0A69] mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-br from-[#3B0A69] to-purple-900 text-white rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Build Your Digital Solution?</h2>
          <p className="text-xl text-purple-100 mb-6 max-w-2xl mx-auto">
            Let's discuss your project and create a custom web design or application that drives your business forward.
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

export default WebDesignDevelopment;

