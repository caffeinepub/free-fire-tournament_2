import { SiYoutube, SiInstagram, SiFacebook, SiDiscord, SiWhatsapp } from 'react-icons/si';
import { ExternalLink } from 'lucide-react';

const socialLinks = [
  {
    icon: SiYoutube,
    label: 'YouTube',
    href: 'https://youtube.com',
    color: '#ff0000',
    hoverBg: 'rgba(255,0,0,0.1)',
  },
  {
    icon: SiInstagram,
    label: 'Instagram',
    href: 'https://instagram.com',
    color: '#e1306c',
    hoverBg: 'rgba(225,48,108,0.1)',
  },
  {
    icon: SiFacebook,
    label: 'Facebook',
    href: 'https://facebook.com',
    color: '#1877f2',
    hoverBg: 'rgba(24,119,242,0.1)',
  },
];

export default function Contact() {
  return (
    <section id="contact" className="py-20 px-4 sm:px-6" style={{ background: '#0d0d0d' }}>
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="h-px w-12" style={{ background: '#e53e3e' }} />
            <span className="font-rajdhani font-semibold text-sm tracking-widest uppercase" style={{ color: '#e53e3e' }}>
              Get In Touch
            </span>
            <div className="h-px w-12" style={{ background: '#e53e3e' }} />
          </div>
          <h2
            className="font-orbitron font-black text-3xl sm:text-4xl md:text-5xl"
            style={{ color: '#ffffff', textShadow: '0 0 20px rgba(229,62,62,0.2)' }}
          >
            CONTACT & SUPPORT
          </h2>
          <p className="font-rajdhani text-base sm:text-lg mt-3" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Join our community and stay updated on all tournament news.
          </p>
        </div>

        {/* Community Join Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-14 max-w-2xl mx-auto">
          {/* WhatsApp */}
          <a
            href="https://wa.me/1234567890"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 py-5 px-6 font-orbitron font-bold text-sm tracking-wider uppercase transition-all duration-300 group"
            style={{
              background: 'rgba(37, 211, 102, 0.1)',
              border: '1px solid rgba(37, 211, 102, 0.4)',
              color: '#25d366',
              clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLAnchorElement).style.background = '#25d366';
              (e.currentTarget as HTMLAnchorElement).style.color = '#ffffff';
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 0 25px rgba(37,211,102,0.4)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(37, 211, 102, 0.1)';
              (e.currentTarget as HTMLAnchorElement).style.color = '#25d366';
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = 'none';
            }}
          >
            <SiWhatsapp className="w-5 h-5" />
            Join WhatsApp Group
            <ExternalLink className="w-4 h-4 opacity-60" />
          </a>

          {/* Discord */}
          <a
            href="https://discord.gg/freefire"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 py-5 px-6 font-orbitron font-bold text-sm tracking-wider uppercase transition-all duration-300"
            style={{
              background: 'rgba(229, 62, 62, 0.1)',
              border: '1px solid rgba(229, 62, 62, 0.4)',
              color: '#e53e3e',
              clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLAnchorElement).style.background = '#e53e3e';
              (e.currentTarget as HTMLAnchorElement).style.color = '#ffffff';
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 0 25px rgba(229,62,62,0.4)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(229, 62, 62, 0.1)';
              (e.currentTarget as HTMLAnchorElement).style.color = '#e53e3e';
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = 'none';
            }}
          >
            <SiDiscord className="w-5 h-5" />
            Join Discord Server
            <ExternalLink className="w-4 h-4 opacity-60" />
          </a>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-10 max-w-2xl mx-auto">
          <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
          <span className="font-rajdhani text-sm tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.3)' }}>
            Follow Us
          </span>
          <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
        </div>

        {/* Social Media Icons */}
        <div className="flex items-center justify-center gap-6">
          {socialLinks.map(({ icon: Icon, label, href, color, hoverBg }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 group transition-all duration-200"
              aria-label={label}
            >
              <div
                className="w-14 h-14 flex items-center justify-center transition-all duration-200"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.background = hoverBg;
                  (e.currentTarget as HTMLDivElement).style.borderColor = color;
                  (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 15px ${color}40`;
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.04)';
                  (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.1)';
                  (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
                }}
              >
                <Icon className="w-6 h-6" style={{ color }} />
              </div>
              <span className="font-rajdhani text-xs tracking-wider" style={{ color: 'rgba(255,255,255,0.4)' }}>
                {label}
              </span>
            </a>
          ))}
        </div>

        {/* Contact Info */}
        <div
          className="mt-12 p-6 text-center"
          style={{
            background: 'rgba(229,62,62,0.05)',
            border: '1px solid rgba(229,62,62,0.15)',
          }}
        >
          <p className="font-rajdhani font-semibold text-base" style={{ color: 'rgba(255,255,255,0.7)' }}>
            Need help? Contact our support team
          </p>
          <a
            href="mailto:support@freefiretournament.gg"
            className="font-rajdhani text-sm mt-1 inline-block transition-colors duration-200 hover:underline"
            style={{ color: '#e53e3e' }}
          >
            support@freefiretournament.gg
          </a>
          <p className="font-rajdhani text-xs mt-3" style={{ color: 'rgba(255,255,255,0.3)' }}>
            Response time: Within 24 hours. For urgent issues, contact us via WhatsApp.
          </p>
        </div>
      </div>
    </section>
  );
}
