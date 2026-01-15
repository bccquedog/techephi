import React from 'react';
import { ArrowLeft, User, Award, Target, Users, Phone, Mail, MapPin, Clock, CheckCircle } from 'lucide-react';

const About = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
              <h1 className="text-3xl font-bold text-gray-900">About Tech ePhi</h1>
            </div>
          </div>
          <p className="text-gray-600 mt-2">The Technological Handy Man!</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Hero Section */}
        <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <img src="/logo.png" alt="Tech ePhi logo" className="w-24 h-24 rounded-lg object-contain" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome to Tech ePhi</h2>
            <p className="text-xl text-gray-600 mb-6">
              Your trusted technology partner for smart home implementation, security solutions, 
              and all your tech needs.
            </p>
            <div className="bg-[#3B0A69] text-white px-6 py-3 rounded-lg inline-block">
              <span className="text-lg font-semibold">"The Technological Handy Man!"</span>
            </div>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-6 h-6 text-[#3B0A69]" />
              <h3 className="text-xl font-semibold text-gray-900">Our Mission</h3>
            </div>
            <p className="text-gray-700 leading-relaxed">
              To provide comprehensive technology solutions that simplify and enhance your daily life. 
              We believe technology should work for you, not against you, and we're here to make 
              that happen with expert guidance and reliable service.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center gap-3 mb-4">
              <Award className="w-6 h-6 text-[#3B0A69]" />
              <h3 className="text-xl font-semibold text-gray-900">Our Vision</h3>
            </div>
            <p className="text-gray-700 leading-relaxed">
              To be the leading technology partner for homes and businesses, known for our 
              innovative solutions, exceptional customer service, and commitment to making 
              technology accessible to everyone.
            </p>
          </div>
        </div>

        {/* About Brian Blair */}
        <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <User className="w-6 h-6 text-[#3B0A69]" />
            <h3 className="text-2xl font-semibold text-gray-900">Meet Brian Blair</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <p className="text-gray-700 leading-relaxed mb-4">
                Brian Blair is the founder and owner of Tech ePhi, bringing years of experience 
                in technology consulting and implementation. With a passion for making technology 
                accessible and user-friendly, Brian has helped countless clients transform their 
                homes and businesses with smart technology solutions.
              </p>
              
              <p className="text-gray-700 leading-relaxed mb-4">
                As "The Technological Handy Man," Brian combines technical expertise with a 
                personal touch, ensuring that every project is completed to the highest standards 
                while maintaining clear communication throughout the process.
              </p>

              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="w-4 h-4" />
                <span>Available 7 days a week for your technology needs</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Contact Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[#3B0A69]" />
                    <a href="tel:407-745-6189" className="text-gray-700 hover:text-[#3B0A69]">
                      407-745-6189
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-[#3B0A69]" />
                    <a href="mailto:support@techephi.com" className="text-gray-700 hover:text-[#3B0A69]">
                      support@techephi.com
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Services */}
        <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Users className="w-6 h-6 text-[#3B0A69]" />
            <h3 className="text-2xl font-semibold text-gray-900">Our Services</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Smart Home Implementation</h4>
              <p className="text-sm text-gray-700">
                Complete smart home setup including lighting, security, entertainment, and automation systems.
              </p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Security Solutions</h4>
              <p className="text-sm text-gray-700">
                Home and office security systems, cameras, access control, and monitoring solutions.
              </p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Small Projects</h4>
              <p className="text-sm text-gray-700">
                TV mounting, lighting installation, and other small technology projects around your home.
              </p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Desktop Support</h4>
              <p className="text-sm text-gray-700">
                Computer setup, troubleshooting, software installation, and technical support.
              </p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Networking</h4>
              <p className="text-sm text-gray-700">
                Network setup, WiFi optimization, and connectivity solutions for homes and businesses.
              </p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Social Media Management</h4>
              <p className="text-sm text-gray-700">
                Professional social media management and digital marketing services.
              </p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Web Design and Application Development</h4>
              <p className="text-sm text-gray-700">
                Custom website design, web applications, mobile apps, and digital solutions for your business.
              </p>
            </div>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
          <h3 className="text-2xl font-semibold text-gray-900 mb-6">Why Choose Tech ePhi?</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-gray-900">Expert Knowledge</h4>
                  <p className="text-sm text-gray-700">Years of experience in technology implementation and support</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-gray-900">Personal Service</h4>
                  <p className="text-sm text-gray-700">One-on-one attention and customized solutions for your needs</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-gray-900">Reliable Support</h4>
                  <p className="text-sm text-gray-700">Ongoing support and maintenance for all installed systems</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-gray-900">Quality Products</h4>
                  <p className="text-sm text-gray-700">Only the best, most reliable technology products and brands</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-gray-900">Competitive Pricing</h4>
                  <p className="text-sm text-gray-700">Fair, transparent pricing with no hidden fees</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-gray-900">Local Business</h4>
                  <p className="text-sm text-gray-700">Supporting the local community with trusted, local service</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="bg-[#3B0A69] text-white rounded-lg p-8 text-center">
          <h3 className="text-2xl font-semibold mb-4">Ready to Get Started?</h3>
          <p className="text-lg mb-6 opacity-90">
            Contact us today for a free consultation and let us help you with all your technology needs.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:407-745-6189"
              className="bg-white text-[#3B0A69] px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Call Now: 407-745-6189
            </a>
            <a
              href="mailto:support@techephi.com"
              className="border border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-[#3B0A69] transition-colors"
            >
              Email Us
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};

export default About;
