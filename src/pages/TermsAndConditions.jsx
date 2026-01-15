import React from 'react';
import { ArrowLeft, FileText, AlertTriangle, DollarSign, Shield, Users, Mail, Phone } from 'lucide-react';

const TermsAndConditions = ({ onBack }) => {
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
              <FileText className="w-8 h-8 text-[#3B0A69]" />
              <h1 className="text-3xl font-bold text-gray-900">Terms and Conditions</h1>
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
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Agreement to Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              These Terms and Conditions ("Terms") govern your use of Tech ePhi's CRM application 
              and related services ("Service") operated by Tech ePhi ("us," "we," or "our"). 
              By accessing or using our Service, you agree to be bound by these Terms.
            </p>
          </section>

          {/* Service Description */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Service Description</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Tech ePhi provides a comprehensive Customer Relationship Management (CRM) platform 
              designed to help businesses manage their clients, projects, invoices, and communications. 
              Our services include:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Client and project management tools</li>
              <li>Invoice generation and payment tracking</li>
              <li>Communication and messaging features</li>
              <li>Document storage and file management</li>
              <li>Reporting and analytics capabilities</li>
              <li>Mobile application access</li>
            </ul>
          </section>

          {/* User Accounts */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Users className="w-6 h-6 text-[#3B0A69]" />
              User Accounts
            </h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Account Creation</h3>
                <p className="text-gray-700">
                  To access our Service, you must create an account by providing accurate and 
                  complete information. You are responsible for maintaining the confidentiality 
                  of your account credentials.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Account Security</h3>
                <p className="text-gray-700">
                  You are responsible for all activities that occur under your account. 
                  Notify us immediately of any unauthorized use of your account or any 
                  other breach of security.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Account Termination</h3>
                <p className="text-gray-700">
                  We reserve the right to terminate or suspend your account at any time 
                  for violation of these Terms or for any other reason at our discretion.
                </p>
              </div>
            </div>
          </section>

          {/* Acceptable Use */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-[#3B0A69]" />
              Acceptable Use Policy
            </h2>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-4">
              <h3 className="font-medium text-yellow-900 mb-3">You agree NOT to:</h3>
              <ul className="text-yellow-800 space-y-2">
                <li>• Use the Service for any illegal or unauthorized purpose</li>
                <li>• Violate any laws or regulations while using the Service</li>
                <li>• Transmit any harmful, threatening, or offensive content</li>
                <li>• Attempt to gain unauthorized access to our systems</li>
                <li>• Interfere with or disrupt the Service or servers</li>
                <li>• Use automated systems to access the Service without permission</li>
                <li>• Share your account credentials with others</li>
              </ul>
            </div>
          </section>

          {/* Payment Terms */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <DollarSign className="w-6 h-6 text-[#3B0A69]" />
              Payment Terms
            </h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Fees and Billing</h3>
                <p className="text-gray-700">
                  Service fees are clearly displayed before purchase. All fees are non-refundable 
                  unless otherwise specified. We reserve the right to change our pricing with 
                  reasonable notice.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Payment Methods</h3>
                <p className="text-gray-700">
                  We accept various payment methods including credit cards, debit cards, 
                  and other secure payment options. All payments are processed securely 
                  through our payment partners.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Refunds</h3>
                <p className="text-gray-700">
                  Refunds are handled on a case-by-case basis. Contact our support team 
                  to discuss any refund requests. Refunds may take 5-10 business days 
                  to process.
                </p>
              </div>
            </div>
          </section>

          {/* Intellectual Property */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Intellectual Property</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Our Rights</h3>
                <p className="text-gray-700">
                  The Service and its original content, features, and functionality are owned 
                  by Tech ePhi and are protected by international copyright, trademark, and 
                  other intellectual property laws.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Your Content</h3>
                <p className="text-gray-700">
                  You retain ownership of any content you upload to the Service. By using 
                  the Service, you grant us a license to use, store, and process your 
                  content as necessary to provide the Service.
                </p>
              </div>
            </div>
          </section>

          {/* Privacy and Data */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Shield className="w-6 h-6 text-[#3B0A69]" />
              Privacy and Data Protection
            </h2>
            
            <p className="text-gray-700 leading-relaxed mb-4">
              Your privacy is important to us. Our collection and use of personal information 
              is governed by our Privacy Policy, which is incorporated into these Terms by reference.
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-medium text-blue-900 mb-3">Data Security:</h3>
              <ul className="text-blue-800 space-y-2">
                <li>• All data is encrypted in transit and at rest</li>
                <li>• Regular security audits and updates</li>
                <li>• Access controls and authentication measures</li>
                <li>• Compliance with industry security standards</li>
              </ul>
            </div>
          </section>

          {/* Limitation of Liability */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Limitation of Liability</h2>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h3 className="font-medium text-red-900 mb-3">Important Legal Notice:</h3>
              <p className="text-red-800 text-sm leading-relaxed">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, TECH EPHI SHALL NOT BE LIABLE FOR ANY 
                INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING 
                WITHOUT LIMITATION, LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE 
                LOSSES, RESULTING FROM YOUR USE OF THE SERVICE.
              </p>
            </div>
          </section>

          {/* Service Availability */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Service Availability</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Uptime</h3>
                <p className="text-gray-700">
                  We strive to maintain high service availability but cannot guarantee 
                  100% uptime. We will make reasonable efforts to notify users of 
                  planned maintenance and service interruptions.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Updates and Changes</h3>
                <p className="text-gray-700">
                  We may update, modify, or discontinue features of the Service at any time. 
                  We will provide reasonable notice of significant changes that may affect 
                  your use of the Service.
                </p>
              </div>
            </div>
          </section>

          {/* Termination */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Termination</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Termination by You</h3>
                <p className="text-gray-700">
                  You may terminate your account at any time by contacting our support team. 
                  Upon termination, your access to the Service will cease immediately.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Termination by Us</h3>
                <p className="text-gray-700">
                  We may terminate or suspend your account immediately, without prior notice, 
                  for conduct that we believe violates these Terms or is harmful to other users.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Effect of Termination</h3>
                <p className="text-gray-700">
                  Upon termination, your right to use the Service will cease immediately. 
                  We may delete your account and data after a reasonable period, subject 
                  to our data retention policies.
                </p>
              </div>
            </div>
          </section>

          {/* Governing Law */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Governing Law</h2>
            
            <p className="text-gray-700 leading-relaxed">
              These Terms shall be governed by and construed in accordance with the laws of 
              the State of Florida, United States, without regard to its conflict of law provisions. 
              Any disputes arising from these Terms or your use of the Service shall be resolved 
              in the courts of Florida.
            </p>
          </section>

          {/* Changes to Terms */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Changes to Terms</h2>
            
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to modify these Terms at any time. We will notify users 
              of any material changes by posting the new Terms on this page and updating 
              the "Last updated" date. Your continued use of the Service after any modifications 
              constitutes acceptance of the updated Terms.
            </p>
          </section>

          {/* Contact Information */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Mail className="w-6 h-6 text-[#3B0A69]" />
              Contact Information
            </h2>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-700 mb-4">
                If you have any questions about these Terms and Conditions, please contact us:
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

          {/* Acknowledgment */}
          <section className="mb-8">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="font-medium text-green-900 mb-3">Acknowledgment</h3>
              <p className="text-green-800 text-sm leading-relaxed">
                By using our Service, you acknowledge that you have read and understood these 
                Terms and Conditions and agree to be bound by them. If you do not agree to 
                these Terms, please do not use our Service.
              </p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;


