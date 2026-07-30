import { GraduationCap, Mail, Globe, ShieldCheck, Heart } from 'lucide-react';
import { useRouter, type Route } from '@/router';

const footerLinks: { title: string; links: { label: string; route: Route }[] }[] = [
  {
    title: 'Tools',
    links: [
      { label: 'Immigration Roadmap', route: { name: 'roadmap' } },
      { label: 'Cost & IND Calculator', route: { name: 'calculator' } },
      { label: 'Program Finder', route: { name: 'programs' } },
      { label: 'Scholarships', route: { name: 'scholarships' } },
    ],
  },
  {
    title: 'Platform',
    links: [
      { label: 'About Us', route: { name: 'about' } },
      { label: 'Privacy Policy', route: { name: 'privacy' } },
      { label: 'Terms of Use', route: { name: 'terms' } },
    ],
  },
];

export function Footer() {
  const { navigate } = useRouter();

  return (
    <footer className="border-t border-slate-200 bg-navy-950 text-slate-300">
      <div className="container-page py-12">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand + description */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-dutch-500 text-white">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-base font-extrabold text-white">NLStudyHub</span>
                <span className="text-[10px] font-medium uppercase tracking-wider text-dutch-400">
                  For International Students
                </span>
              </div>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
              The central guidance platform built exclusively for international students navigating
              higher education in the Netherlands — from your first application to your residence
              permit.
            </p>
            <div className="mt-5 flex flex-wrap gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-dutch-400" /> IND-compliant guidance
              </span>
              <span className="flex items-center gap-1.5">
                <Globe className="h-4 w-4 text-dutch-400" /> EU & Non-EU pathways
              </span>
            </div>
          </div>

          {/* Link columns */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h4 className="text-sm font-semibold text-white">{section.title}</h4>
              <ul className="mt-3 space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <button
                      onClick={() => navigate(link.route)}
                      className="text-sm text-slate-400 transition-colors hover:text-dutch-400"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-navy-800 pt-6 sm:flex-row">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} NLStudyHub. Built for international students, by international students.
          </p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate({ name: 'privacy' })}
              className="text-xs text-slate-500 transition-colors hover:text-dutch-400"
            >
              Privacy
            </button>
            <button
              onClick={() => navigate({ name: 'terms' })}
              className="text-xs text-slate-500 transition-colors hover:text-dutch-400"
            >
              Terms
            </button>
            <a
              href="mailto:hello@nlstudyhub.nl"
              className="flex items-center gap-1.5 text-xs text-slate-500 transition-colors hover:text-dutch-400"
            >
              <Mail className="h-3.5 w-3.5" /> hello@nlstudyhub.nl
            </a>
          </div>
        </div>

        {/* Made with */}
        <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-slate-600">
          <Heart className="h-3 w-3 text-dutch-500" /> Made in the Netherlands
        </div>
      </div>
    </footer>
  );
}
