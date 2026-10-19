"use client";

import { useState } from "react";
import { useEffect, useRef } from "react";
import LogoModel from "./LogoModel";

// Shared length for the text reveal and both logo videos so they start and end together.
const ANIMATION_SECONDS = 3;
const events = [
  { name: "Cloud Foundations", date: "18 Nov 2024", description: "A hands-on introduction to cloud thinking, core AWS services, and your first deployment.", tag: "Workshop" },
  { name: "Build Night 01", date: "30 Nov 2024", description: "Bring an idea, find your people, and turn a rough sketch into something that works.", tag: "Community" },
  { name: "Cloud Club Connect", date: "14 Dec 2024", description: "Stories, demos, and honest conversations with students building beyond the classroom.", tag: "Meetup" },
  { name: "Serverless Sprint", date: "11 Jan 2025", description: "A focused build session for shipping small, useful ideas with serverless tools.", tag: "Build day" },
];
const team = [
  { name: "Member 01", role: "Community Lead", initials: "01" },
  { name: "Member 02", role: "Events Lead", initials: "02" },
  { name: "Member 03", role: "Technical Lead", initials: "03" },
  { name: "Member 04", role: "Design Lead", initials: "04" },
  { name: "Member 05", role: "Outreach Lead", initials: "05" },
];

export default function Home() {
  const [finished, setFinished] = useState({ aws: false, bvrit: false });
  const [loaded, setLoaded] = useState({ aws: false, bvrit: false });
  const awsVideo = useRef<HTMLVideoElement>(null);
  const bvritVideo = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [contactSent, setContactSent] = useState(false);
  const [sectionVisible, setSectionVisible] = useState({ events: false, collective: false, contact: false });
  const eventsSection = useRef<HTMLElement>(null);
  const collectiveSection = useRef<HTMLElement>(null);
  const contactSection = useRef<HTMLElement>(null);
  const [aboutVisible, setAboutVisible] = useState(false);
  const aboutSection = useRef<HTMLElement>(null);

  // On refresh, cached videos can finish loading before hydration attaches onLoadedData, so check readyState directly.
  // The timeout keeps the page from staying blank if a video never loads.
  useEffect(() => {
    if ((awsVideo.current?.readyState ?? 0) >= 2) setLoaded((current) => ({ ...current, aws: true }));
    if ((bvritVideo.current?.readyState ?? 0) >= 2) setLoaded((current) => ({ ...current, bvrit: true }));
    const fallback = window.setTimeout(() => setLoaded({ aws: true, bvrit: true }), 3000);
    return () => window.clearTimeout(fallback);
  }, []);

  useEffect(() => {
    const targets = [
      { element: eventsSection.current, key: "events" as const },
      { element: collectiveSection.current, key: "collective" as const },
      { element: contactSection.current, key: "contact" as const },
    ];
    const observers = targets.map(({ element, key }) => {
      if (!element) return null;
      const observer = new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting) return;
        setSectionVisible((current) => ({ ...current, [key]: true }));
        observer.disconnect();
      }, { threshold: 0.2 });
      observer.observe(element);
      return observer;
    });
    return () => observers.forEach((observer) => observer?.disconnect());
  }, []);

  useEffect(() => {
    if (started || !loaded.aws || !loaded.bvrit || !awsVideo.current || !bvritVideo.current) return;

    for (const video of [awsVideo.current, bvritVideo.current]) {
      video.currentTime = 0;
      if (Number.isFinite(video.duration)) video.playbackRate = video.duration / ANIMATION_SECONDS;
    }
    void Promise.all([awsVideo.current.play().catch(() => undefined), bvritVideo.current.play().catch(() => undefined)]);
    setStarted(true);
  }, [loaded.aws, loaded.bvrit]);

  useEffect(() => {
    const section = aboutSection.current;
    if (!section) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setAboutVisible(true);
      observer.disconnect();
    }, { threshold: 0.6 });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const markFinished = (logo: "aws" | "bvrit") => {
    setFinished((current) => ({ ...current, [logo]: true }));
  };

  return (
    <main className="gutter">
      <div className="sheet" aria-label="AWS Student Builder Group BVRIT" style={{ "--anim-duration": `${ANIMATION_SECONDS}s` } as React.CSSProperties}>
        <header className="site-nav">
          <button className="menu-toggle" type="button" aria-label="Toggle navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>
            <span /><span /><span />
          </button>
          <nav className={menuOpen ? "mobile-menu-open" : ""} aria-label="Main navigation">
            <a href="#home" onClick={() => setMenuOpen(false)}>Home</a>
            <a href="#about" onClick={() => setMenuOpen(false)}>About</a>
            <a href="#events" onClick={() => setMenuOpen(false)}>Events</a>
            <a href="#collective" onClick={() => setMenuOpen(false)}>The Collective</a>
            <a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
          </nav>
        </header>
        <div className="label-mask">
          <p className={started ? "center-label is-visible" : "center-label"}>AWS Student Builder Group BVRIT</p>
        </div>
        <div className="logo-stage" aria-label="AWS and BVRIT logo animations">
          <video className="logo-video" muted preload="auto" playsInline onEnded={() => markFinished("aws")} onLoadedData={() => setLoaded((current) => ({ ...current, aws: true }))} onError={() => setLoaded((current) => ({ ...current, aws: true }))} ref={awsVideo}><source src="/aws-logo-transparent.webm" type="video/webm" /><source src="/aws-logo.mp4" type="video/mp4" /></video>
          <span className="logo-cross" aria-hidden="true">×</span>
          <video className="logo-video" muted preload="auto" playsInline onEnded={() => markFinished("bvrit")} onLoadedData={() => setLoaded((current) => ({ ...current, bvrit: true }))} onError={() => setLoaded((current) => ({ ...current, bvrit: true }))} ref={bvritVideo}><source src="/bvrit-logo.webm" type="video/webm" /><source src="/bvrit-logo.mp4" type="video/mp4" /></video>
        </div>
        <blockquote className="hero-quote">
          <p>“Let your imagination roam as freely as the clouds.”</p>
          <cite>~ Annie Leibovitz</cite>
        </blockquote>
        <div className="logo-anchor logo-anchor-hero" data-logo-anchor="hero" aria-hidden="true" />
        <section className="home-section" id="home" ref={aboutSection}>
          <div className="about-layout">
            <div className="about-side">
              <h2 className={aboutVisible ? "about-heading-visible" : "about-heading"}>About</h2>
              <div className="logo-anchor logo-anchor-about" data-logo-anchor="about" data-tone="dark" aria-hidden="true" />
            </div>
            <div className="paper-card">
              <p className={aboutVisible ? "home-copy about-copy-visible" : "home-copy about-copy"}>A student-led space at BVRIT for cloud exploration, creative experiments, and the people who make ideas real.</p>
            </div>
          </div>
        </section>
        <section className={sectionVisible.events ? "events-section section-visible" : "events-section"} id="events" ref={eventsSection}>
          <div className="events-heading"><h2>Events</h2><div className="logo-anchor logo-anchor-events" data-logo-anchor="events" aria-hidden="true" /></div>
          <div className="events-carousel" aria-label="Upcoming events">
            {events.map((event) => (
              <article className="event-card" key={event.name}>
                <div className="event-image" role="img" aria-label={`${event.name} event artwork`} />
                <div className="event-card-body"><div className="event-meta"><span>{event.tag}</span><time>{event.date}</time></div><h3>{event.name}</h3><p>{event.description}</p><a href="#contact">Learn more ↗</a></div>
              </article>
            ))}
          </div>
        </section>
        <section className={sectionVisible.collective ? "collective-section section-visible" : "collective-section"} id="collective" ref={collectiveSection}>
          <div className="collective-heading"><div><p className="collective-kicker">THE PEOPLE BEHIND THE BUILDS</p><h2>The Collective</h2></div><div className="logo-anchor logo-anchor-collective" data-logo-anchor="collective" data-tone="dark" aria-hidden="true" /><span>05 members</span></div>
          <div className="team-grid">
            {team.map((member) => (
              <article className="team-card" key={member.name}>
                <div className="team-photo" aria-label={`${member.name} photo placeholder`}><span>{member.initials}</span></div>
                <div className="team-card-body"><h3>{member.name}</h3><p>{member.role}</p><div className="team-links"><a href="#contact" aria-label={`${member.name} LinkedIn profile`}>LinkedIn ↗</a><a href="#contact" aria-label={`${member.name} Builder profile`}>Builder ↗</a></div></div>
              </article>
            ))}
          </div>
        </section>
        <section className={sectionVisible.contact ? "contact-section section-visible" : "contact-section"} id="contact" ref={contactSection}>
          <div className="contact-intro"><p className="contact-kicker">SAY HELLO</p><h2>Let&apos;s build<br /><em>something.</em></h2><p>Have a question, an idea, or a collaboration in mind? Send us a note.</p><div className="logo-anchor logo-anchor-contact" data-logo-anchor="contact" aria-hidden="true" /></div>
          <form className="contact-form" onSubmit={(event) => { event.preventDefault(); const data = new FormData(event.currentTarget); const subject = encodeURIComponent(`Message from ${data.get("name")}`); const body = encodeURIComponent(`Name: ${data.get("name")}\nEmail: ${data.get("email")}\n\n${data.get("message")}`); window.location.href = `mailto:aws.sbg@bvrit.ac.in?subject=${subject}&body=${body}`; setContactSent(true); }}>
            <label>Name<input name="name" type="text" placeholder="Your name" required /></label>
            <label>Email<input name="email" type="email" placeholder="you@example.com" required /></label>
            <label>Message<textarea name="message" placeholder="Tell us what&apos;s on your mind" rows={4} required /></label>
            <button type="submit">{contactSent ? "Opening your mail app" : "Send message ↗"}</button>
          </form>
          <p className="model-credit">3D AWS logo by <a href="https://sketchfab.com/3d-models/aws-logo-8aefa880ecee48778c4b3725b62c0649" target="_blank" rel="noreferrer">Youssef_0356</a>, CC BY 4.0</p>
        </section>
      </div>
      <LogoModel revealAfterMs={started ? ANIMATION_SECONDS * 1000 : null} />
    </main>
  );
}
