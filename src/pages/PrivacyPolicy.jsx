import React from 'react';
import { ArrowLeft, Shield, Eye, Lock, Database, Users, Mail } from 'lucide-react';

const PrivacyPolicy = ({ onBack }) => {
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
              <Shield className="w-8 h-8 text-[#3B0A69]" />
              <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
            </div>
          </div>
          <p className="text-gray-600 mt-2">Last updated: January 6, 2026</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm border p-8">
          
          {/* Introduction */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Introduction</h2>
            <p className="text-gray-700 leading-relaxed">
              Tech ePhi ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy 
              explains how we collect, use, disclose, and safeguard your information when you use our CRM 
              application and related services.
            </p>
          </section>

          {/* Information We Collect */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Database className="w-6 h-6 text-[#3B0A69]" />
              Information We Collect
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Personal Information</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Name and contact information (email, phone number)</li>
                  <li>Business information (company name, address)</li>
                  <li>Account credentials and authentication data</li>
                  <li>Payment and billing information</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Usage Information</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Application usage patterns and preferences</li>
                  <li>Device information and browser type</li>
                  <li>IP address and location data</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Business Data</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Project and job information</li>
                  <li>Client and contractor details</li>
                  <li>Invoice and payment records</li>
                  <li>Communication logs and messages</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Information */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Eye className="w-6 h-6 text-[#3B0A69]" />
              How We Use Your Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Service Delivery</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Provide and maintain our CRM services</li>
                  <li>• Process transactions and payments</li>
                  <li>• Manage user accounts and authentication</li>
                  <li>• Deliver customer support</li>
                </ul>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Communication</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Send important service updates</li>
                  <li>• Provide technical support</li>
                  <li>• Share relevant business information</li>
                  <li>• Send push notifications (with consent)</li>
                </ul>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Improvement</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Analyze usage patterns</li>
                  <li>• Improve application performance</li>
                  <li>• Develop new features</li>
                  <li>• Conduct research and analytics</li>
                </ul>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Security</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Protect against fraud and abuse</li>
                  <li>• Ensure system security</li>
                  <li>• Comply with legal obligations</li>
                  <li>• Enforce our terms of service</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Data Security */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Lock className="w-6 h-6 text-[#3B0A69]" />
              Data Security
            </h2>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-medium text-blue-900 mb-3">We implement industry-standard security measures:</h3>
              <ul className="text-blue-800 space-y-2">
                <li>• <strong>Encryption:</strong> All data is encrypted in transit and at rest</li>
                <li>• <strong>Access Controls:</strong> Strict access controls and authentication</li>
                <li>• <strong>Regular Audits:</strong> Security audits and vulnerability assessments</li>
                <li>• <strong>Secure Infrastructure:</strong> Cloud-based security with Firebase</li>
                <li>• <strong>Employee Training:</strong> Regular security training for our team</li>
              </ul>
            </div>
          </section>

          {/* Data Sharing */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Users className="w-6 h-6 text-[#3B0A69]" />
              Information Sharing
            </h2>
            
            <p className="text-gray-700 mb-4">
              We do not sell, trade, or rent your personal information to third parties. We may share 
              your information only in the following circumstances:
            </p>
            
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li><strong>Service Providers:</strong> Trusted third-party service providers who assist in operating our platform</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
              <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
              <li><strong>Consent:</strong> When you have given explicit consent to share your information</li>
            </ul>
          </section>

          {/* Your Rights */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your Rights</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">Access & Portability</h3>
                <p className="text-sm text-gray-700">Request access to your personal data and receive it in a portable format</p>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">Correction</h3>
                <p className="text-sm text-gray-700">Update or correct inaccurate personal information</p>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">Deletion</h3>
                <p className="text-sm text-gray-700">Request deletion of your personal data (subject to legal requirements)</p>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">Opt-out</h3>
                <p className="text-sm text-gray-700">Opt-out of marketing communications and certain data processing</p>
              </div>
            </div>
          </section>

          {/* Cookies */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Cookies and Tracking</h2>
            
            <p className="text-gray-700 mb-4">
              We use cookies and similar technologies to enhance your experience, analyze usage, 
              and provide personalized content. You can control cookie settings through your browser.
            </p>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Types of Cookies We Use:</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• <strong>Essential Cookies:</strong> Required for basic functionality</li>
                <li>• <strong>Analytics Cookies:</strong> Help us understand how you use our service</li>
                <li>• <strong>Preference Cookies:</strong> Remember your settings and preferences</li>
                <li>• <strong>Security Cookies:</strong> Protect against fraud and ensure security</li>
              </ul>
            </div>
          </section>

          {/* Contact Information */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Mail className="w-6 h-6 text-[#3B0A69]" />
              Contact Us
            </h2>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-700 mb-4">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              
              <div className="space-y-2">
                <p className="text-gray-700">
                  <strong>Email:</strong> 
                  <a href="mailto:support@techephi.com" className="text-[#3B0A69] hover:underline ml-1">
                    support@techephi.com
                  </a>
                </p>
                <p className="text-gray-700">
                  <strong>Phone:</strong> 
                  <a href="tel:407-745-6189" className="text-[#3B0A69] hover:underline ml-1">
                    407-745-6189
                  </a>
                </p>
                <p className="text-gray-700">
                  <strong>Owner:</strong> Brian Blair - Tech ePhi
                </p>
              </div>
            </div>
          </section>

          {/* Updates */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Policy Updates</h2>
            
            <p className="text-gray-700">
              We may update this Privacy Policy from time to time. We will notify you of any 
              material changes by posting the new Privacy Policy on this page and updating the 
              "Last updated" date. Your continued use of our services after any modifications 
              constitutes acceptance of the updated Privacy Policy.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;


