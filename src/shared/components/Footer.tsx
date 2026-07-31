import { Mail } from 'lucide-react';
import { Container } from './Container';

// تعريف الروابط كمصفوفات لتسهيل الصيانة
const FOOTER_SECTIONS = [
  {
    title: 'Discovery',
    links: ['The Archive', 'The Journal', 'New Artifacts', 'Collections']
  },
  {
    title: 'Support',
    links: ['Shipping & Returns', 'Privacy Policy', 'Terms of Service', 'Contact Us']
  }
];

const Footer = () => {
  return (
    <footer className="bg-main-bg border-t border-main-border pt-24 pb-12">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Branding Section */}
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-2xl font-black tracking-tighter text-main-text mb-6">STELLAR</h3>
            <p className="text-sm text-gray-500 leading-relaxed mb-8">
              Crafting a digital archive for the curated eye. Modern essentials for a refined, intentional life.
            </p>
            <div className="flex gap-4">
              {/* <SocialLink icon={Instagram} />
              <SocialLink icon={Github} />
              <SocialLink icon={Twitter} /> */}
            </div>
          </div>

          {/* Dynamic Sections */}
          {FOOTER_SECTIONS.map((section) => (
            <div key={section.title}>
              <h4 className="text-xs font-black uppercase tracking-widest text-primary mb-8">
                {section.title}
              </h4>
              <ul className="space-y-4 text-sm text-gray-500">
                {section.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="hover:text-primary transition-colors">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter Section */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-primary mb-8">Newsletter</h4>
            <p className="text-sm text-gray-500 mb-6">Join our archive for early access releases.</p>
            <form className="flex gap-2">
              <input 
                type="email" 
                placeholder="Email Address" 
                className="flex-1 bg-gray-100 border-none rounded-lg px-4 py-3 text-sm focus:ring-1 focus:ring-primary/20 outline-none"
              />
              <button className="bg-primary text-white p-3 rounded-lg hover:opacity-90 transition-all">
                <Mail className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-main-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
            © 2026 STELLAR COMMERCE. DESIGNED FOR THE DIGITAL ARCHIVE.
          </p>
        </div>
      </Container>
    </footer>
  );
};

// المكون المساعد للايقونات
const SocialLink = ({ icon: Icon }: { icon: any }) => (
  <a href="#" className="w-10 h-10 flex items-center justify-center border border-main-border rounded-full hover:bg-primary hover:text-white transition-all text-main-text">
    <Icon className="w-4 h-4" />
  </a>
);

export default Footer;