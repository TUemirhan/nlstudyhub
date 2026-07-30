import { ShieldCheck, Eye, Database, Cookie, UserCheck, Mail } from 'lucide-react';

const sections = [
  {
    icon: Eye,
    title: 'What we collect',
    body: [
      'NLStudyHub does not require you to create an account to use any of our tools. The Roadmap, Calculator, Program Finder, and Scholarship Database all work without sign-up.',
      'If you contact us by email, we retain your message solely to respond to your inquiry. We do not store emails on third-party servers.',
      'We do not ask for your passport number, BSN, bank details, or any other sensitive personal data at any point.',
    ],
  },
  {
    icon: Database,
    title: 'How we use your data',
    body: [
      'We do not sell, rent, or share any personal information with third parties. There is no advertising on this platform.',
      'Anonymous, aggregated usage statistics (such as which tools are most used) may be collected to improve the platform. These cannot be traced back to any individual.',
      'All calculations in the Cost & IND Calculator are performed locally in your browser. Your financial inputs never leave your device.',
    ],
  },
  {
    icon: Cookie,
    title: 'Cookies and local storage',
    body: [
      'We use essential local storage to remember your Roadmap and Calculator preferences within a single session. This data stays on your device and is not transmitted to our servers.',
      'We do not use tracking cookies, analytics cookies, or advertising cookies.',
    ],
  },
  {
    icon: UserCheck,
    title: 'Your rights',
    body: [
      'Under the GDPR (AVG in the Netherlands), you have the right to access, correct, or delete any personal data we hold about you.',
      'Because we do not maintain user accounts or store personal data on our servers, there is generally nothing to delete. If you have emailed us and want your message removed, contact us and we will delete it promptly.',
      'To exercise any of these rights, email hello@nlstudyhub.nl.',
    ],
  },
];

export function PrivacyPage() {
  return (
    <div>
      <section className="bg-navy-950 py-16 lg:py-20">
        <div className="container-page max-w-3xl">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-7 w-7 text-dutch-500" />
            <h1 className="text-3xl font-extrabold text-white sm:text-4xl">Privacy Policy</h1>
          </div>
          <p className="mt-4 text-slate-400">
            Last updated: {new Date().getFullYear()}
          </p>
          <p className="mt-4 text-lg leading-relaxed text-slate-300">
            Your privacy matters to us. This policy explains, in plain language, what data we collect,
            how we use it, and the rights you have under the EU General Data Protection Regulation (GDPR)
            and the Dutch AVG.
          </p>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container-page max-w-3xl">
          <div className="space-y-12">
            {sections.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={s.title}>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-navy-50">
                      <Icon className="h-5 w-5 text-navy-700" />
                    </div>
                    <h2 className="text-xl font-bold text-navy-900">
                      <span className="text-dutch-500">{String(i + 1).padStart(2, '0')}</span> · {s.title}
                    </h2>
                  </div>
                  <div className="mt-4 space-y-3 pl-13">
                    {s.body.map((p, j) => (
                      <p key={j} className="text-sm leading-relaxed text-slate-600">{p}</p>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-dutch-500" />
              <h3 className="text-sm font-bold text-navy-900">Questions about this policy?</h3>
            </div>
            <p className="mt-2 text-sm text-slate-500">
              Email us at{' '}
              <a href="mailto:hello@nlstudyhub.nl" className="font-semibold text-dutch-600 hover:underline">
                hello@nlstudyhub.nl
              </a>{' '}
              and we will respond within 5 business days.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
