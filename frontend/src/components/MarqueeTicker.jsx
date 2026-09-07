import React from 'react';
import { Film, Clapperboard, Sparkles } from 'lucide-react';
import '../styles/marqueeTicker.css';

export default function MarqueeTicker({ reverse = false }) {
  const items = [
    'AVATAR: FIRE AND ASH',
    'TRON: ARES',
    'THE LONG WALK',
    'SPIDER-MAN: BEYOND THE SPIDER-VERSE',
    'YAKINDA SİNEMALARDA',
    'PREMİYER SEZONU'
  ];

  return (
    <div className={`cinematic-marquee-wrap ${reverse ? 'reverse' : ''}`}>
      <div className="marquee-content">
        {[...items, ...items].map((text, idx) => (
          <span key={idx} className="marquee-item">
            <Sparkles size={14} className="marquee-icon" />
            <span>{text}</span>
            <Clapperboard size={14} className="marquee-dot" />
          </span>
        ))}
      </div>
      <div className="marquee-content" aria-hidden="true">
        {[...items, ...items].map((text, idx) => (
          <span key={`dup-${idx}`} className="marquee-item">
            <Sparkles size={14} className="marquee-icon" />
            <span>{text}</span>
            <Clapperboard size={14} className="marquee-dot" />
          </span>
        ))}
      </div>
    </div>
  );
}