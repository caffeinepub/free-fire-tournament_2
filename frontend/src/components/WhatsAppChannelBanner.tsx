import { SiWhatsapp } from 'react-icons/si';

export default function WhatsAppChannelBanner() {
  return (
    <div className="flex justify-center px-4 py-6">
      <a
        href="https://whatsapp.com/channel/0029VbC9jOf6RGJDlryGqR0j"
        target="_blank"
        rel="noopener noreferrer"
        className="group inline-flex items-center gap-3 px-6 py-4 font-rajdhani font-bold text-base sm:text-lg tracking-wide uppercase transition-all duration-300"
        style={{
          background: '#25D366',
          color: '#ffffff',
          borderRadius: '4px',
          boxShadow: '0 0 20px rgba(37,211,102,0.45), 0 4px 16px rgba(0,0,0,0.4)',
          border: '1px solid rgba(37,211,102,0.6)',
          textDecoration: 'none',
        }}
        onMouseEnter={e => {
          const el = e.currentTarget as HTMLAnchorElement;
          el.style.boxShadow = '0 0 40px rgba(37,211,102,0.75), 0 4px 20px rgba(0,0,0,0.5)';
          el.style.background = '#1ebe5d';
          el.style.transform = 'scale(1.03)';
        }}
        onMouseLeave={e => {
          const el = e.currentTarget as HTMLAnchorElement;
          el.style.boxShadow = '0 0 20px rgba(37,211,102,0.45), 0 4px 16px rgba(0,0,0,0.4)';
          el.style.background = '#25D366';
          el.style.transform = 'scale(1)';
        }}
      >
        <SiWhatsapp className="w-6 h-6 flex-shrink-0" style={{ color: '#ffffff' }} />
        <span>Join our WhatsApp Channel for Room ID &amp; Passwords</span>
      </a>
    </div>
  );
}
