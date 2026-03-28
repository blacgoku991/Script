'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-black/90 backdrop-blur-xl border-b border-amber-500/10' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #C9A84C, #E8C97A)' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#0A0A0A">
              <path d="M3 4h18v2H3V4zm0 7h18v2H3v-2zm0 7h18v2H3v-2z"/>
            </svg>
          </div>
          <div>
            <span className="font-bold text-white tracking-wide text-sm">
              MALL<span className="text-gold-gradient">SCREEN</span>
            </span>
            <div className="text-[9px] text-amber-500/60 tracking-[0.2em] uppercase -mt-0.5">Morocco Mall</div>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {[
            { label: 'Comment ça marche', href: '#how-it-works' },
            { label: 'Forfaits', href: '#packages' },
            { label: 'Aperçu', href: '#preview' },
            { label: 'FAQ', href: '#faq' },
          ].map(item => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm text-gray-400 hover:text-amber-400 transition-colors duration-200"
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/admin" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
            Admin
          </Link>
          <Link href="/booking">
            <Button size="sm" variant="gold">Réserver l&apos;écran</Button>
          </Link>
        </div>

        {/* Mobile burger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
        >
          <span className={`block w-5 h-0.5 bg-white transition-all ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-5 h-0.5 bg-white transition-all ${mobileOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-0.5 bg-white transition-all ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-xl border-t border-amber-500/10 px-6 py-6 flex flex-col gap-5">
          {[
            { label: 'Comment ça marche', href: '#how-it-works' },
            { label: 'Forfaits', href: '#packages' },
            { label: 'Aperçu', href: '#preview' },
            { label: 'FAQ', href: '#faq' },
          ].map(item => (
            <a
              key={item.href}
              href={item.href}
              className="text-gray-300 hover:text-amber-400 transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </a>
          ))}
          <div className="luxury-divider" />
          <Link href="/booking" onClick={() => setMobileOpen(false)}>
            <Button variant="gold" className="w-full">Réserver l&apos;écran</Button>
          </Link>
        </div>
      )}
    </nav>
  );
}
