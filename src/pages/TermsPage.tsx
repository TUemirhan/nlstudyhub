import { FileText, Scale, AlertCircle, Mail } from 'lucide-react';

const sections = [
  {
    title: 'Acceptance of terms',
    body: [
      'By accessing and using NLStudyHub (the "Platform"), you agree to be bound by these Terms of Use. If you do not agree with any part of these terms, please do not use the Platform.',
      'We may update these terms from time to time. Continued use of the Platform after changes are posted constitutes acceptance of the updated terms.',
    ],
  },
  {
    title: 'Information accuracy',
    body: [
      'We make every effort to ensure that information about deadlines, tuition fees, IND requirements, and scholarship amounts is accurate and up to date. However, figures change annually and individual universities may revise their requirements without notice.',
      'All information on this Platform is provided for general guidance only and does not constitute legal, immigration, or financial advice. You should always verify critical information with the official source (IND, Nuffic, your university, or Studielink) before making decisions.',
      'The IND study norm, statutory tuition fees, and scholarship amounts displayed are based on the most recent publicly available data for the 2025-2026 academic year.',
    ],
  },
  {
    title: 'No guarantee of admission or visa',
    body: [
      'Using our Roadmap, Calculator, or Program Finder does not guarantee admission to any university, approval of a visa or residence permit, or receipt of any scholarship.',
      'Decisions on admission, visa issuance, and scholarship awards rest solely with the respective universities, the IND, and scholarship providers. NLStudyHub is an independent information platform and is not affiliated with any Dutch government body or university.',
    ],
  },
  {
    title: 'Intellectual property',
    body: [
      'All content on this Platform — including text, data, design, and code — is the property of NLStudyHub unless otherwise stated. You may not copy, redistribute, or republish content without permission.',
      'University names, program names, and official requirements belong to their respective institutions and are referenced here for informational purposes only.',
    ],
  },
  {
    title: 'Limitation of liability',
    body: [
      'NLStudyHub and its contributors are not liable for any losses or damages arising from the use of, or reliance on, information provided on this Platform.',
      'We are not responsible for the content of external websites linked from this Platform. Visiting those links is at your own risk.',
    ],
  },
  {
    title: 'Prohibited uses',
    body: [
      'You may not use this Platform to scrape, harvest, or automatically extract data for commercial purposes.',
      'You may not attempt to disrupt, overload, or gain unauthorised access to any part of the Platform or its underlying infrastructure.',
    ],
  },
];

export function TermsPage() {
  return (
    <div>
      <section className="bg-navy-950 py-16 lg:py-20">
        <div className="container-page max-w-3xl">
          <div className="flex items-center gap-3">
            <Scale className="h-7 w-7 text-dutch-500" />
            <h1 className="text-3xl font-extrabold text-white sm:text-4xl">Terms of Use</h1>
          </div>
          <p className="mt-4 text-slate-400">
            Last updated: {new Date().getFullYear()}
          </p>
          <p className="mt-4 text-lg leading-relaxed text-slate-300">
            These terms govern your use of NLStudyHub. Please read them carefully — they explain what
            we provide, what we do not guarantee, and your responsibilities as a user.
          </p>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container-page max-w-3xl">
          {/* Disclaimer callout */}
          <div className="mb-10 flex items-start gap-3 rounded-2xl border border-dutch-200 bg-dutch-50 p-5">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-dutch-600" />
            <p className="text-sm leading-relaxed text-navy-800">
              <strong>Important:</strong> NLStudyHub is an independent platform and is not affiliated
              with the Dutch government, IND, Nuffic, or any university. All information is provided for
              guidance only and should be verified with official sources before making decisions.
            </p>
          </div>

          <div className="space-y-10">
            {sections.map((s, i) => (
              <div key={s.title}>
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-dutch-500" />
                  <h2 className="text-xl font-bold text-navy-900">
                    <span className="text-dutch-500">{String(i + 1).padStart(2, '0')}</span> · {s.title}
                  </h2>
                </div>
                <div className="mt-4 space-y-3 pl-8">
                  {s.body.map((p, j) => (
                    <p key={j} className="text-sm leading-relaxed text-slate-600">{p}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-dutch-500" />
              <h3 className="text-sm font-bold text-navy-900">Questions about these terms?</h3>
            </div>
            <p className="mt-2 text-sm text-slate-500">
              Email us at{' '}
              <a href="mailto:hello@nlstudyhub.nl" className="font-semibold text-dutch-600 hover:underline">
                hello@nlstudyhub.nl
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
