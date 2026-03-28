import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-amber-500/10 py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-14">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #C9A84C, #E8C97A)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#0A0A0A">
                  <path d="M3 4h18v2H3V4zm0 7h18v2H3v-2zm0 7h18v2H3v-2z"/>
                </svg>
              </div>
              <div>
                <span className="font-bold text-white text-sm tracking-wide">
                  MALL<span className="text-gold-gradient">SCREEN</span>
                </span>
              </div>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
              La première plateforme de réservation d&apos;espace publicitaire sur l&apos;écran géant
              du Morocco Mall, Casablanca.
            </p>
            <div className="flex gap-4 mt-6">
              {['instagram', 'facebook', 'linkedin'].map(social => (
                <a key={social} href="#" className="w-9 h-9 rounded-lg flex items-center justify-center border border-amber-500/20 text-gray-500 hover:text-amber-400 hover:border-amber-500/40 transition-all">
                  <span className="text-xs uppercase">{social[0]}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">Plateforme</h4>
            <ul className="flex flex-col gap-3">
              {[
                { label: 'Réserver l\'écran', href: '/booking' },
                { label: 'Nos forfaits', href: '#packages' },
                { label: 'Aperçu en direct', href: '#preview' },
                { label: 'Comment ça marche', href: '#how-it-works' },
              ].map(link => (
                <li key={link.label}>
                  <a href={link.href} className="text-gray-500 hover:text-amber-400 transition-colors text-sm">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">Support</h4>
            <ul className="flex flex-col gap-3">
              {[
                { label: 'FAQ', href: '#faq' },
                { label: 'Conditions générales', href: '#' },
                { label: 'Politique de contenu', href: '#' },
                { label: 'Contact', href: 'mailto:contact@mallscreen.ma' },
              ].map(link => (
                <li key={link.label}>
                  <a href={link.href} className="text-gray-500 hover:text-amber-400 transition-colors text-sm">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="luxury-divider mb-8" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-gray-600 text-xs">
          <p>© 2025 MallScreen · Morocco Mall · Casablanca · Tous droits réservés</p>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-amber-500/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>Paiements sécurisés par Stripe</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
