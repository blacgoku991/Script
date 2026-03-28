'use client';

import { useState } from 'react';

const FAQS = [
  {
    q: 'Quels formats de fichiers sont acceptés ?',
    a: 'Nous acceptons les images JPG, PNG et WEBP, ainsi que les vidéos MP4, MOV et WEBM. La taille maximale est de 100 MB pour les vidéos et 20 MB pour les images. Nous recommandons une résolution de 1080×1920 px (format portrait) pour un rendu optimal.',
  },
  {
    q: 'Comment fonctionne le processus d\'approbation ?',
    a: 'Après paiement, notre équipe de modération examine votre contenu dans un délai de 6 à 24h selon votre forfait. Si le contenu est approuvé, vous recevrez une confirmation par email. En cas de problème, nous vous contacterons pour demander des modifications.',
  },
  {
    q: 'Puis-je obtenir un remboursement si mon contenu est rejeté ?',
    a: 'Oui. Si votre contenu est définitivement rejeté pour des raisons non conformes à nos règles, vous serez remboursé intégralement. Si c\'est pour des raisons de qualité ou de format, nous vous proposerons d\'abord d\'apporter des corrections.',
  },
  {
    q: 'Quels types de contenu sont interdits ?',
    a: 'Sont interdits : les contenus violents ou explicites, les discours haineux ou discriminatoires, les informations trompeuses ou frauduleuses, les contenus politiques partisans, et tout contenu portant atteinte aux droits d\'auteur. Une charte complète est disponible lors du processus de réservation.',
  },
  {
    q: 'Puis-je choisir l\'heure exacte de diffusion ?',
    a: 'Oui, vous choisissez une date et un créneau horaire disponible lors de votre réservation. Les créneaux sont en demi-heure de 9h à 22h. Votre contenu sera diffusé à l\'heure choisie, répété selon la fréquence de votre forfait.',
  },
  {
    q: 'Combien de fois mon contenu est-il diffusé ?',
    a: 'Votre contenu est diffusé 4 fois par heure (ou 8 fois pour le forfait Exclusif) pendant la durée de votre créneau. Par exemple, un forfait 30 secondes sera diffusé toutes les ~15 minutes sur une rotation horaire.',
  },
  {
    q: 'Puis-je modifier mon créneau après la réservation ?',
    a: 'Les modifications de créneau sont possibles jusqu\'à 48h avant la date de diffusion, sous réserve de disponibilité. Contactez notre équipe par email pour toute demande de modification.',
  },
  {
    q: 'Comment puis-je suivre le statut de ma réservation ?',
    a: 'Vous recevrez un email de confirmation contenant un lien de suivi. Ce lien vous permet de vérifier en temps réel le statut de votre réservation : en attente de révision, approuvée, planifiée, ou diffusée.',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-28 px-6 relative">
      <div className="luxury-divider mb-28" />
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/20 bg-amber-500/5 mb-6">
            <span className="text-amber-500 text-xs font-medium tracking-widest uppercase">Questions fréquentes</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-5">
            Tout ce que vous devez savoir
          </h2>
        </div>

        {/* Accordion */}
        <div className="flex flex-col gap-3">
          {FAQS.map((faq, i) => (
            <div
              key={i}
              className={`glass rounded-2xl overflow-hidden border transition-all duration-300 ${
                openIndex === i ? 'border-amber-500/30' : 'border-amber-500/10'
              }`}
            >
              <button
                className="w-full px-7 py-5 flex items-center justify-between gap-4 text-left"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <span className={`font-semibold transition-colors ${openIndex === i ? 'text-amber-400' : 'text-white'}`}>
                  {faq.q}
                </span>
                <svg
                  className={`w-5 h-5 flex-shrink-0 text-amber-500 transition-transform duration-300 ${openIndex === i ? 'rotate-180' : ''}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <div className={`overflow-hidden transition-all duration-300 ${openIndex === i ? 'max-h-48' : 'max-h-0'}`}>
                <div className="px-7 pb-6 text-gray-400 text-sm leading-relaxed">
                  {faq.a}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
