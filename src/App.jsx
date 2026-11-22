import { useEffect, useRef, useState } from 'react'
import { club, departments, featuredEvent, links, mentor, objectives, team } from './content.js'

const nav = [
  { href: '#about', label: 'About' },
  { href: '#event', label: 'Event' },
  { href: '#team', label: 'Team' },
]

const year = new Date().getFullYear()

function ExtLink({ href, label, children, className = '' }) {
  if (!href) return <span className={`opacity-50 ${className}`} title={`${label ?? ''} link coming soon`.trim()} aria-label={label}>{children}</span>
  return <a href={href} target="_blank" rel="noreferrer" aria-label={label} className={className}>{children}</a>
}

function Section({ id, children }) {
  return <section id={id} className="mx-auto max-w-5xl border-t border-line px-4 py-10 sm:px-6 sm:py-14">{children}</section>
}

function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-bg/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
        <a href="#top" className="font-pixel text-[10px] text-heading">
          <span className="text-aws">AWS</span> SBG BVRIT
        </a>
        <nav aria-label="Main" className="flex items-center gap-1 text-sm">
          {nav.map((n) => (
            <a key={n.href} href={n.href} className="hidden px-3 py-2 text-soft hover:text-accent sm:block">{n.label}</a>
          ))}
          <a href="#join" className="ml-2 bg-accent px-3 py-1.5 font-medium text-bg hover:bg-accent-tint">Join</a>
        </nav>
      </div>
    </header>
  )
}

const logoGrid = [
  '..#.#.#..',
  '..#####..',
  '##.....##',
  '.#.....#.',
  '##.....##',
  '.#.....#.',
  '##.....##',
  '..#####..',
  '..#.#.#..',
]

// Blocks appear in a fixed shuffled order so the build-in looks random but never changes between loads.
const logoCells = logoGrid
  .flatMap((row, y) => [...row].map((c, x) => (c === '#' ? { x, y } : null)))
  .filter(Boolean)
  .map((cell, i) => ({ ...cell, order: (i * 17) % 41 }))

const PIXEL_STEP_MS = 35
const LOGO_BUILD_MS = Math.max(...logoCells.map((c) => c.order)) * PIXEL_STEP_MS + 150
// The finished logo is one path, so no seams can show between neighbouring blocks.
const logoPath = logoCells.map(({ x, y }) => `M${x} ${y}h1v1h-1z`).join('')
const skipLogoBuild = typeof window !== 'undefined' &&
  (window.matchMedia('(prefers-reduced-motion: reduce)').matches || document.hidden)

function PixelLogo({ className = '' }) {
  const [done, setDone] = useState(skipLogoBuild)

  // Swap to the solid logo when the build-in time is up, or right away if the tab is hidden,
  // since browsers pause or throttle animations in background tabs and can leave blocks half drawn.
  useEffect(() => {
    if (done) return
    const finish = () => setDone(true)
    const timer = setTimeout(finish, LOGO_BUILD_MS)
    const onHide = () => document.hidden && finish()
    document.addEventListener('visibilitychange', onHide)
    return () => {
      clearTimeout(timer)
      document.removeEventListener('visibilitychange', onHide)
    }
  }, [done])

  return (
    <svg viewBox="0 0 9 9" className={className} role="img" aria-label="AWS Student Builder Group logo">
      {done
        ? <path d={logoPath} fill="#ae5cff" />
        : logoCells.map(({ x, y, order }) => (
          <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill="#ae5cff" shapeRendering="crispEdges" className="pixel-in" style={{ animationDelay: `${order * PIXEL_STEP_MS}ms` }} />
        ))}
    </svg>
  )
}

function Hero() {
  const bvrit = useRef(null)
  useEffect(() => {
    bvrit.current?.play().catch(() => {})
  }, [])

  return (
    <section id="top" className="mx-auto max-w-5xl px-4 pt-10 pb-12 sm:px-6 sm:pt-16 sm:pb-16">
      <div className="mb-6 flex items-center gap-4" aria-label="AWS and BVRIT logos">
        <PixelLogo className="size-[45px] shrink-0 sm:size-[54px]" />
        <span className="text-muted" aria-hidden="true">×</span>
        <video ref={bvrit} className="h-12 w-auto sm:h-16" muted playsInline preload="auto" aria-label="BVRIT logo">
          <source src="/bvrit-logo-alpha.webm" type="video/webm" />
          <source src="/bvrit-logo.mp4" type="video/mp4" />
        </video>
      </div>
      <h1 className="font-pixel text-xl leading-[1.6] text-heading sm:text-3xl">
        AWS Student Builder Group <span className="text-accent">BVRIT</span>
      </h1>
      <p className="mt-4 text-lg text-accent">
        {club.tagline}<span className="cursor" aria-hidden="true" />
      </p>
      <div className="mt-7 flex flex-wrap gap-3 text-sm">
        <a href="#join" className="bg-accent px-5 py-2.5 font-medium text-bg hover:bg-accent-tint">Join the community</a>
        <a href="#event" className="border border-subtle px-5 py-2.5 text-secondary hover:border-accent hover:text-accent">Upcoming event</a>
      </div>
    </section>
  )
}

function About() {
  return (
    <Section id="about">
      <p className="max-w-3xl leading-relaxed text-secondary">{club.about[0]}</p>
    </Section>
  )
}

function Title({ children }) {
  return <h2 className="mb-5 font-pixel text-xs text-heading sm:text-sm">{children}</h2>
}

function Objectives() {
  return (
    <Section id="objectives">
      <Title>Objectives</Title>
      <ul className="list-disc space-y-1.5 pl-5 text-sm text-secondary marker:text-accent">
        {objectives.map((o) => <li key={o.title}>{o.title}</li>)}
      </ul>
    </Section>
  )
}

function Event() {
  const ev = featuredEvent
  const facts = ['December 2026 (tentative)', '2 days', 'In-person', '20–30 students', 'Venue TBA']
  return (
    <Section id="event">
      <div className="border border-line bg-surface p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="border border-green px-2 py-0.5 text-xs text-green">Upcoming</span>
          <span className="border border-yellow px-2 py-0.5 text-xs text-yellow">Tentative</span>
        </div>
        <h3 className="mt-3 text-lg font-bold text-heading">{ev.title}</h3>
        <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted">
          {facts.map((f) => <li key={f}>· {f}</li>)}
        </ul>
        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          {ev.days.map((d) => (
            <details key={d.label} className="group border border-line bg-bg">
              <summary className="cursor-pointer list-none px-4 py-3 text-sm text-heading hover:text-accent">
                <span className="text-accent">{d.label}</span> — {d.title}
                <span className="float-right text-muted group-open:rotate-90">›</span>
              </summary>
              <ul className="space-y-1 px-4 pb-4 text-sm text-soft">
                {d.sessions.map((s) => <li key={s}>– {s}</li>)}
              </ul>
            </details>
          ))}
        </div>
      </div>
    </Section>
  )
}

function LinkedInIcon({ className = 'size-4' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
    </svg>
  )
}

function InstagramIcon({ className = 'size-4' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

function Photo({ person, className = '' }) {
  const initials = person.name.replace(/[^A-Za-z ]/g, ' ').split(/\s+/).filter((w) => w.length > 1).map((w) => w[0]).slice(0, 2).join('')
  return person.photo
    ? <img src={person.photo} alt={person.name} loading="lazy" className={`aspect-square object-cover ${className}`} />
    : <div className={`grid aspect-square place-items-center bg-bg font-pixel text-lg text-subtle ${className}`} aria-hidden="true">{initials}</div>
}

function LinkedIn({ person }) {
  if (!person.linkedin) return null
  return (
    <a href={person.linkedin} target="_blank" rel="noreferrer" aria-label={`${person.name} on LinkedIn`} className="shrink-0 text-soft hover:text-accent">
      <LinkedInIcon />
    </a>
  )
}

function Mentor() {
  return (
    <div className="mb-3 flex items-center gap-4 border border-line bg-surface p-3">
      <Photo person={mentor} className="w-20 shrink-0 sm:w-24" />
      <div className="min-w-0 flex-1">
        <p className="text-xs text-accent">Faculty Mentor</p>
        <p className="text-sm font-medium text-heading">{mentor.name}</p>
        <p className="text-xs text-muted">Associate HOD, CSE</p>
      </div>
      <LinkedIn person={mentor} />
    </div>
  )
}

function Member({ person }) {
  return (
    <li className="border border-line bg-surface">
      <Photo person={person} className="w-full" />
      <div className="flex items-start justify-between gap-1 p-2 sm:p-3">
        <div className="min-w-0">
          <p className="text-xs font-medium text-heading sm:text-sm">{person.name}</p>
          <p className="text-[11px] leading-tight text-muted sm:text-xs">{person.role}</p>
        </div>
        <LinkedIn person={person} />
      </div>
    </li>
  )
}

function Team() {
  return (
    <Section id="team">
      <Title>Team</Title>
      <Mentor />
      <ul className="grid grid-cols-3 gap-2 sm:gap-3 lg:grid-cols-6">
        {team.map((m) => <Member key={m.name} person={m} />)}
      </ul>
    </Section>
  )
}

function Join() {
  const socials = [['Instagram', links.instagram, InstagramIcon], ['LinkedIn', links.linkedin, LinkedInIcon]]
  return (
    <Section id="join">
      <ul className="flex flex-wrap gap-2 text-xs">
        {departments.map((d) => <li key={d} className="border border-subtle px-2.5 py-1 text-soft">{d}</li>)}
      </ul>
      <div className="mt-5 text-sm">
        <ExtLink href={links.joinForm} className="inline-block bg-accent px-5 py-2.5 font-medium text-bg hover:bg-accent-tint">
          {links.joinForm ? 'Apply now' : 'Applications open soon'}
        </ExtLink>
      </div>
      <div className="mt-5 flex gap-5">
        {socials.map(([label, href, Icon]) => (
          <ExtLink key={label} href={href} label={label} className="text-soft hover:text-accent"><Icon className="size-6" /></ExtLink>
        ))}
      </div>
    </Section>
  )
}

export default function App() {
  return (
    <div className="min-h-svh">
      <Nav />
      <main>
        <Hero />
        <About />
        <Objectives />
        <Event />
        <Team />
        <Join />
      </main>
      <footer>
        <p className="border-t border-line px-4 py-5 text-center text-xs text-disabled">© {year} {club.name}</p>
      </footer>
    </div>
  )
}
