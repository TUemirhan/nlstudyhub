import { Scale, AlertTriangle, BookOpen, Copyright, RefreshCw, Ban } from 'lucide-react';

export function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-navy-950 py-16">
        <div className="container-page">
          <div className="max-w-3xl mx-auto text-center">
            <Scale className="h-12 w-12 text-dutch-400 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-white">Terms of Service</h1>
            <p className="mt-4 text-slate-300">Effective Date: August 2026</p>
          </div>
        </div>
      </div>

      <div className="container-page py-12">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg border border-slate-200 p-8 md:p-12 space-y-8">
          
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
            <p className="text-sm text-amber-800">
              <strong>Important Disclaimer:</strong> NLStudyHub is an informational platform only. We do not provide official immigration, legal, or financial advice. Always verify visa requirements and application procedures directly with the <strong>IND (Immigration and Naturalisation Service)</strong> and your chosen universities.
            </p>
          </div>

          <section>
            <h2 className="text-xl font-bold text-navy-900 mb-3">1. Acceptance of Terms</h2>
            <p className="text-slate-600 leading-relaxed">
              By accessing or using NLStudyHub, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-navy-900 mb-3">2. Description of Service</h2>
            <p className="text-slate-600 leading-relaxed mb-3">
              NLStudyHub provides tools and information to help international students research study opportunities in the Netherlands, including:
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-600 ml-4">
              <li>University and program directories</li>
              <li>Scholarship databases</li>
              <li>Cost calculators and financial planning tools</li>
              <li>Personalized roadmaps for application procedures</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-navy-900 mb-3">3. User Accounts</h2>
            <div className="space-y-2 text-slate-600">
              <p>When you create an account with us, you must provide accurate and complete information. You are responsible for:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Maintaining the confidentiality of your account password</li>
                <li>All activities that occur under your account</li>
                <li>Notifying us immediately of any unauthorized access</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-navy-900 mb-3">4. No Professional Advice</h2>
            <div className="p-4 bg-red-50 border border-red-100 rounded-lg">
              <p className="text-sm text-red-800 leading-relaxed">
                <strong>Legal & Immigration Disclaimer:</strong> The content on NLStudyHub is for general informational purposes only. It does not constitute legal, immigration, or financial advice. Visa requirements, tuition fees, and regulations change frequently. You must verify all information with official sources (IND, universities, DUO) before making decisions.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-navy-900 mb-3">5. Intellectual Property</h2>
            <div className="flex items-start gap-3">
              <Copyright className="h-5 w-5 text-navy-600 mt-0.5" />
              <div className="text-slate-600">
                <p>All content, features, and functionality on NLStudyHub—including text, graphics, logos, and software—are the exclusive property of NLStudyHub and are protected by international copyright, trademark, and other intellectual property laws.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-navy-900 mb-3">6. User Content</h2>
            <p className="text-slate-600 leading-relaxed">
              Any data you input (roadmap preferences, saved items) remains your property. By using our service, you grant us a license to store and process this data solely for the purpose of providing our services to you.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-navy-900 mb-3">7. Termination</h2>
            <div className="flex items-start gap-3">
              <Ban className="h-5 w-5 text-navy-600 mt-0.5" />
              <div className="text-slate-600">
                <p>We may terminate or suspend your account immediately, without prior notice or liability, for any reason, including breach of these Terms. Upon termination, your right to use the service will immediately cease.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-navy-900 mb-3">8. Changes to Terms</h2>
            <div className="flex items-start gap-3">
              <RefreshCw className="h-5 w-5 text-navy-600 mt-0.5" />
              <div className="text-slate-600">
                <p>We reserve the right to modify or replace these Terms at any time. We will provide notice of any significant changes by posting the new Terms on this page and updating the effective date.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-navy-900 mb-3">9. Contact Us</h2>
            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
              <BookOpen className="h-5 w-5 text-dutch-600" />
              <span className="text-slate-700">Questions about these Terms? Contact us at: legal@nlstudyhub.com</span>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}