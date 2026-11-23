"use client";

import { useEffect, useRef, useState } from "react";
import LogoModel from "./LogoModel";
import { Icon, MaybeLink, Portrait, Section, stagger } from "./components";
import { club, departments, featuredEvent, links, mentor, objectives, roadmap, team, vision } from "./content";

// Shared length for the text reveal and both logo videos so they start and end together.
const ANIMATION_SECONDS = 3;

const navItems = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#team", label: "Our Team" },
  { href: "#mentor", label: "Mentor" },
  { href: "#events", label: "Events" },
  { href: "#join", label: "Join Us" },
];

export default function Home() {
  const [loaded, setLoaded] = useState({ aws: false, bvrit: false });
  const awsVideo = useRef<HTMLVideoElement>(null);
  const bvritVideo = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // On refresh, cached videos can finish loading before hydration attaches onLoadedData, so check readyState directly.
  // The timeout keeps the page from staying blank if a video never loads.
  useEffect(() => {
    if ((awsVideo.current?.readyState ?? 0) >= 2) setLoaded((current) => ({ ...current, aws: true }));
    if ((bvritVideo.current?.readyState ?? 0) >= 2) setLoaded((current) => ({ ...current, bvrit: true }));
    const fallback = window.setTimeout(() => setLoaded({ aws: true, bvrit: true }), 3000);
    return () => window.clearTimeout(fallback);
  }, []);

  useEffect(() => {
    if (started || !loaded.aws || !loaded.bvrit || !awsVideo.current || !bvritVideo.current) return;
    for (const video of [awsVideo.current, bvritVideo.current]) {
      video.currentTime = 0;
      if (Number.isFinite(video.duration)) video.playbackRate = video.duration / ANIMATION_SECONDS;
    }
    void Promise.all([awsVideo.current.play().catch(() => undefined), bvritVideo.current.play().catch(() => undefined)]);
    setStarted(true);
  }, [loaded.aws, loaded.bvrit, started]);

  useEffect(() => {
    if (!menuOpen) return;
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") setMenuOpen(false); };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [menuOpen]);

  return (
    <main className="gutter">
      <div className="sheet" style={{ "--anim-duration": `${ANIMATION_SECONDS}s` } as React.CSSProperties}>
        <header className="site-nav">
          <button className="menu-toggle" type="button" aria-label="Toggle navigation" aria-controls="main-nav" aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>
            <span /><span /><span />
          </button>
          <nav id="main-nav" className={menuOpen ? "mobile-menu-open" : ""} aria-label="Main navigation">
            {navItems.map((item) => <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>{item.label}</a>)}
          </nav>
        </header>

        {/* Hero */}
        <div id="home" className="hero">
          <div className="label-mask">
            <h1 className={started ? "center-label is-visible" : "center-label"}>AWS Student Builder Group BVRIT</h1>
          </div>
          <div className="logo-stage" aria-label="AWS and BVRIT logo animations">
            <video className="logo-video" muted preload="auto" playsInline onLoadedData={() => setLoaded((current) => ({ ...current, aws: true }))} onError={() => setLoaded((current) => ({ ...current, aws: true }))} ref={awsVideo}><source src="/aws-logo-transparent.webm" type="video/webm" /><source src="/aws-logo.mp4" type="video/mp4" /></video>
            <span className="logo-cross" aria-hidden="true">×</span>
            <video className="logo-video" muted preload="auto" playsInline onLoadedData={() => setLoaded((current) => ({ ...current, bvrit: true }))} onError={() => setLoaded((current) => ({ ...current, bvrit: true }))} ref={bvritVideo}><source src="/bvrit-logo.webm" type="video/webm" /><source src="/bvrit-logo.mp4" type="video/mp4" /></video>
          </div>
          <div className="hero-tagline">
            <p>{club.tagline}</p>
            <a className="hero-cta" href="#join">Join the community ↓</a>
          </div>
          <div className="logo-anchor logo-anchor-hero" data-logo-anchor="hero" aria-hidden="true" />
        </div>

        {/* About */}
        <Section id="about" className="home-section dark" labelledBy="about-title" threshold={0.4}>
          <div className="about-layout">
            <div className="about-side reveal-item">
              <p className="kicker">WHO WE ARE</p>
              <h2 id="about-title" className="about-title">About<br /><em>us.</em></h2>
              <div className="logo-anchor logo-anchor-about" data-logo-anchor="about" data-tone="dark" aria-hidden="true" />
            </div>
            <div className="paper-card reveal-item" style={stagger(2)}>
              {club.about.map((paragraph) => <p className="home-copy" key={paragraph}>{paragraph}</p>)}
              <p className="paper-sign">— {club.tagline}</p>
            </div>
          </div>
        </Section>

        {/* Objectives */}
        <Section id="objectives" className="block light" labelledBy="objectives-title">
          <div className="section-head reveal-item">
            <div><p className="kicker">WHAT WE DO</p><h2 id="objectives-title">Objectives</h2></div>
            <span className="section-count">04 focus areas</span>
          </div>
          <div className="objective-grid">
            {objectives.map((objective, index) => (
              <article className="objective-card reveal-item" style={stagger(index + 1)} key={objective.title}>
                <div className="objective-top"><Icon name={objective.icon} /><span>{String(index + 1).padStart(2, "0")}</span></div>
                <h3>{objective.title}</h3>
                <p>{objective.description}</p>
              </article>
            ))}
          </div>
        </Section>

        {/* Vision */}
        <Section id="vision" className="vision-section" labelledBy="vision-title" threshold={0.3}>
          <div className="vision-inner">
            <p className="kicker reveal-item" id="vision-title">OUR VISION</p>
            <blockquote className="reveal-item" style={stagger(1)}><p>{vision}</p></blockquote>
          </div>
        </Section>

        {/* Core team */}
        <Section id="team" className="block dark" labelledBy="team-title">
          <div className="section-head reveal-item">
            <div><p className="kicker">THE PEOPLE BEHIND THE BUILDS</p><h2 id="team-title">Core Team</h2></div>
            <div className="logo-anchor logo-anchor-section" data-logo-anchor="team" data-tone="dark" aria-hidden="true" />
            <span className="section-count">{String(team.length).padStart(2, "0")} members</span>
          </div>
          <ul className="team-grid" role="list">
            {team.map((member, index) => (
              <li className={member.featured ? "team-card is-featured reveal-item" : "team-card reveal-item"} style={stagger(index + 1)} key={member.name}>
                <Portrait name={member.name} photo={member.photo} />
                <h3>{member.name}</h3>
                <p>{member.role}</p>
              </li>
            ))}
          </ul>
        </Section>

        {/* Faculty mentor */}
        <Section id="mentor" className="block light" labelledBy="mentor-title">
          <div className="mentor-layout">
            <div className="mentor-portrait reveal-item"><Portrait name={mentor.name} photo={mentor.photo} size="20rem" /></div>
            <div className="mentor-copy reveal-item" style={stagger(2)}>
              <p className="kicker">FACULTY MENTOR</p>
              <h2 id="mentor-title">{mentor.name}</h2>
              <p className="mentor-role">{mentor.role}</p>
              <p className="mentor-dept">{mentor.department}</p>
              <p className="mentor-quote">“{mentor.description}”</p>
            </div>
          </div>
        </Section>

        {/* Events */}
        <Section id="events" className="block dark" labelledBy="events-title">
          <div className="section-head reveal-item">
            <div><p className="kicker">WHAT&apos;S NEXT</p><h2 id="events-title">Upcoming Events</h2></div>
            <div className="logo-anchor logo-anchor-section" data-logo-anchor="events" data-tone="dark" aria-hidden="true" />
            <span className="section-count">{featuredEvent.when}</span>
          </div>

          <article className="event-feature reveal-item" style={stagger(1)} aria-labelledby="event-title">
            <div className="event-hero">
              <div className="event-badges">
                <span className="badge badge-featured">Featured event</span>
                {featuredEvent.statuses.map((status) => <span className="badge" key={status}>{status}</span>)}
              </div>
              <h3 id="event-title">{featuredEvent.title}</h3>
              <p className="event-theme">{featuredEvent.theme}</p>
            </div>
            <dl className="event-details">
              {featuredEvent.details.map((detail) => (
                <div key={detail.label}><dt>{detail.label}</dt><dd>{detail.value}</dd></div>
              ))}
            </dl>
            <p className="event-note">Exact dates and venue have not been finalised yet. They will be announced here and on our social channels.</p>
          </article>

          <div className="day-grid">
            {featuredEvent.days.map((day, index) => (
              <section className="day-card reveal-item" style={stagger(index + 2)} key={day.label} aria-labelledby={`day-${index}`}>
                <p className="day-label">{day.label}</p>
                <h3 id={`day-${index}`}>{day.title}</h3>
                <p className="day-theme">Theme: {day.theme}</p>
                <ol className="session-timeline">
                  {day.sessions.map((session) => <li key={session}>{session}</li>)}
                </ol>
              </section>
            ))}
          </div>
        </Section>

        {/* Roadmap */}
        <Section id="roadmap" className="block light" labelledBy="roadmap-title">
          <div className="section-head reveal-item">
            <div><p className="kicker">WHERE WE&apos;RE HEADED</p><h2 id="roadmap-title">Event Roadmap</h2></div>
            <span className="badge badge-outline">All activities tentative</span>
          </div>
          <ol className="roadmap">
            {roadmap.map((step, index) => (
              <li className="roadmap-step reveal-item" style={stagger(index + 1)} key={step.when}>
                <span className="roadmap-dot" aria-hidden="true" />
                <p className="roadmap-when">{step.when}</p>
                <p className="roadmap-what">{step.activity}</p>
                <span className="roadmap-tag">Tentative</span>
              </li>
            ))}
          </ol>
        </Section>

        {/* Join */}
        <Section id="join" className="block dark join-section" labelledBy="join-title">
          <div className="join-layout">
            <div className="join-copy reveal-item">
              <p className="kicker">JOIN US</p>
              <h2 id="join-title">Be part of something <em>bigger.</em></h2>
              <p className="join-text">Whether you&apos;re passionate about technology, organizing events, designing, marketing or creating content, there&apos;s a place for you in our community.</p>
              <MaybeLink href={links.joinForm} className="cta">Join Our Community ↗</MaybeLink>
              {!links.joinForm && <p className="cta-note">Recruitment form link coming soon.</p>}
              <div className="logo-anchor logo-anchor-join" data-logo-anchor="join" data-tone="dark" aria-hidden="true" />
            </div>
            <div className="join-departments reveal-item" style={stagger(2)}>
              <p className="kicker">OPEN DEPARTMENTS</p>
              <ul className="department-list" role="list">
                {departments.map((department, index) => (
                  <li key={department}><span>{String(index + 1).padStart(2, "0")}</span>{department}</li>
                ))}
              </ul>
            </div>
          </div>
        </Section>

        <footer className="site-footer">
          <div className="footer-brand">
            <p className="footer-name">{club.name}</p>
            <p className="footer-tagline">{club.tagline}</p>
          </div>
          <nav className="footer-social" aria-label="Social media">
            <MaybeLink href={links.instagram}>Instagram ↗</MaybeLink>
            <MaybeLink href={links.linkedin}>LinkedIn ↗</MaybeLink>
            <MaybeLink href={links.github}>GitHub ↗</MaybeLink>
          </nav>
          <div className="footer-legal">
            <p>© 2026 {club.name}. All rights reserved.</p>
            <p className="model-credit">3D AWS logo by <a href="https://sketchfab.com/3d-models/aws-logo-8aefa880ecee48778c4b3725b62c0649" target="_blank" rel="noreferrer">Youssef_0356</a>, CC BY 4.0</p>
          </div>
        </footer>
      </div>
      <LogoModel revealAfterMs={started ? ANIMATION_SECONDS * 1000 : null} />
    </main>
  );
}
