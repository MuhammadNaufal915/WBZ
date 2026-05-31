import React from 'react';
import '../styles/marquee.css';

const items = [
  { text: 'WBZ', accent: true },
  { text: 'Experience' },
  { text: 'WBZ', accent: true },
  { text: 'Experience' },
  { text: 'WBZ', accent: true },
  { text: 'Experience' },
  { text: 'WBZ', accent: true },
  { text: 'Experience' },
];

export default function Marquee() {
  // Duplicate items for seamless loop
  const allItems = [...items, ...items];

  return (
    <div className="marquee-section" aria-hidden="true">
      <div className="marquee-track">
        {allItems.map((item, i) => (
          <div key={i} className="marquee-item">
            <span className={`marquee-text${item.accent ? ' accent' : ''}`}>
              {item.text}
            </span>
            <span className="marquee-dot" />
          </div>
        ))}
      </div>
    </div>
  );
}
