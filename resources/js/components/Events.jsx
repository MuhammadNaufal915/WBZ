import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MapPin, Clock } from 'lucide-react';
import axios from 'axios';
import '../styles/events.css';

gsap.registerPlugin(ScrollTrigger);

export default function Events() {
  const sectionRef = useRef(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    axios.get('/content/events')
      .then(r => setData(r.data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!data || !data.items || data.items.length === 0) return;
    
    const ctx = gsap.context(() => {
      // Reveal section header
      gsap.to('.events .reveal', {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.events__header',
          start: 'top 90%',
          once: true,
        },
      });

      // Animate event items in list
      gsap.from('.event-item', {
        opacity: 0,
        y: 60,
        duration: 0.9,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.events__list',
          start: 'top 85%',
          once: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [data]);

  if (!data || !data.items || data.items.length === 0) {
    return <section id="events" className="events section" />;
  }

  return (
    <section id="events" className="events section" ref={sectionRef} aria-label="Upcoming Events">
      <div className="container">
        <div className="events__header">
          <div className="events__label reveal">Upcoming Gigs</div>
          <h2 className="events__heading reveal">Events Calendar</h2>
        </div>

        <div className="events__list">
          {data.items.map((event, idx) => {
            const isFinished = event.status === 'finished';

            return (
              <div 
                key={event.id || idx} 
                className={`event-item${isFinished ? ' event-item--finished' : ''}`}
              >
                {/* Date column */}
                <div className="event-item__date">
                  <span className="event-item__date-day">{event.date_day}</span>
                  <span className="event-item__date-month">{event.date_month}</span>
                </div>

                {/* Details column */}
                <div className="event-item__details">
                  <div className="event-item__meta">
                    <span className="event-item__meta-item">
                      <Clock size={13} />
                      {event.time}
                    </span>
                    <span className="event-item__dot" aria-hidden="true" />
                    <span className="event-item__meta-item">
                      <MapPin size={13} />
                      {event.location}
                    </span>
                  </div>
                  <h3 className="event-item__title">{event.title}</h3>
                  <p className="event-item__desc">{event.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
