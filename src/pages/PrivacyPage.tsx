import { Shield, Mail, Database, Lock, UserX, Eye, Server } from 'lucide-react';

export function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-navy-950 py-16">
        <div className="container-page">
          <div className="max-w-3xl mx-auto text-center">
            <Shield className="h-12 w-12 text-dutch-400 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-white">Privacy Policy</h1>
            <p className="mt-4 text-slate-300">Last updated: January 2025</p>
          </div>
        </div>
      </div>

      <div className="container-page py-12">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg border border-slate-200 p-8 md:p-12 space-y-8">
          
          <section>
            <h2 className="text-xl font-bold text-navy-900 mb-3">1. Introduction</h2>
            <p className="text-slate-600 leading-relaxed">
              NLStudyHub ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform. We comply with the General Data Protection Regulation (GDPR) and Dutch privacy laws.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-navy-900 mb-3">2. Information We Collect</h2>
            <div className="space-y-3 text-slate-600">
              <p><strong>Account Information:</strong> When you register, we collect your email address, name, nationality status, and target degree level.</p>
              <p><strong>Roadmap Data:</strong> We store your study preferences, program interests, and progress tracking information to provide personalized guidance.</p>
              <p><strong>Usage Data:</strong> We collect information on how you interact with our platform, including pages visited and features used.</p>
              <p><strong>Technical Data:</strong> IP address, browser type, device information, and cookies.</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-navy-900 mb-3">3. How We Use Your Information</h2>
            <ul className="list-disc list-inside space-y-2 text-slate-600 ml-4">
              <li>To provide and maintain our service</li>
              <li>To personalize your experience and generate roadmaps</li>
              <li>To send you reminders about deadlines (if opted in)</li>
              <li>To improve our platform and user experience</li>
              <li>To comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-navy-900 mb-3">4. Data Storage & Security</h2>
            <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <Database className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-slate-700 text-sm leading-relaxed">
                  Your data is stored securely using <strong>Google Firebase</strong> (Firestore and Authentication). Firebase is GDPR compliant and certified under EU data protection standards. All data transfers are encrypted using SSL/TLS.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-navy-900 mb-3">5. Your Rights (GDPR)</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-lg">
                <UserX className="h-5 w-5 text-navy-600 mb-2" />
                <h3 className="font-semibold text-navy-900 text-sm">Right to Erasure</h3>
                <p className="text-xs text-slate-500 mt-1">Request deletion of your account and all personal data.</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <Lock className="h-5 w-5 text-navy-600 mb-2" />
                <h3 className="font-semibold text-navy-900 text-sm">Right to Access</h3>
                <p className="text-xs text-slate-500 mt-1">Request a copy of all data we hold about you.</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <Eye className="h-5 w-5 text-navy-600 mb-2" />
                <h3 className="font-semibold text-navy-900 text-sm">Right to Rectification</h3>
                <p className="text-xs text-slate-500 mt-1">Update or correct your personal information.</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <Server className="h-5 w-5 text-navy-600 mb-2" />
                <h3 className="font-semibold text-navy-900 text-sm">Data Portability</h3>
                <p className="text-xs text-slate-500 mt-1">Export your data in a machine-readable format.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-navy-900 mb-3">6. Third-Party Services</h2>
            <p className="text-slate-600 leading-relaxed">
              We use the following third-party services:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-slate-600 ml-4">
              <li><strong>Google Firebase</strong> - Authentication and database hosting</li>
              <li><strong>Vercel</strong> - Website hosting and analytics</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-navy-900 mb-3">7. Contact Us</h2>
            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
              <Mail className="h-5 w-5 text-dutch-600" />
              <span className="text-slate-700">For privacy inquiries: privacy@nlstudyhub.com</span>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}