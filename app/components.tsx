"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import type { ObjectiveIcon } from "./content";

/** A page section that fades its `.reveal-item` children in the first time it scrolls into view. */
export function Section({ id, className, labelledBy, threshold = 0.15, children }: { id: string; className: string; labelledBy?: string; threshold?: number; children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setVisible(true);
      observer.disconnect();
    }, { threshold });
    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold]);

  return (
    <section id={id} ref={ref} aria-labelledby={labelledBy} className={`${className} reveal${visible ? " is-visible" : ""}`}>
      {children}
    </section>
  );
}

/** Stagger index for `.reveal-item` animations. */
export const stagger = (index: number) => ({ "--i": index }) as CSSProperties;

const initials = (name: string) =>
  name.replace(/\s*Ma'am$/i, "").replace(/\./g, " ").split(/\s+/).filter(Boolean).slice(-2).map((word) => word[0].toUpperCase()).join("");

/** Oval portrait: shows the photo when one is set, otherwise an initials placeholder. */
export function Portrait({ name, photo, size = "16rem" }: { name: string; photo?: string; size?: string }) {
  return (
    <div className={photo ? "portrait" : "portrait portrait-placeholder"} role="img" aria-label={photo ? name : `Photo placeholder for ${name}`}>
      {photo ? <Image src={photo} alt="" fill sizes={`(max-width: 560px) 45vw, ${size}`} style={{ objectFit: "cover" }} /> : <span aria-hidden="true">{initials(name)}</span>}
    </div>
  );
}

const iconPaths: Record<ObjectiveIcon, ReactNode> = {
  cloud: <path d="M7 18h10a4 4 0 0 0 .6-7.95A6 6 0 0 0 6.2 9.6 4.2 4.2 0 0 0 7 18z" />,
  build: <path d="M8 8l-4 4 4 4M16 8l4 4-4 4M13.5 5l-3 14" />,
  collab: <><circle cx="6" cy="5" r="2" /><circle cx="6" cy="19" r="2" /><circle cx="18" cy="7" r="2" /><path d="M6 7v10M18 9c0 5-6 4-11 8.4" /></>,
  career: <><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M3 13h18" /></>,
};

export function Icon({ name }: { name: ObjectiveIcon }) {
  return (
    <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {iconPaths[name]}
    </svg>
  );
}

/** Renders a real link when a URL is configured, otherwise a clearly marked placeholder. */
export function MaybeLink({ href, className, children }: { href: string; className?: string; children: ReactNode }) {
  if (href) return <a className={className} href={href} target="_blank" rel="noreferrer">{children}</a>;
  return <span className={`${className ?? ""} link-pending`} aria-disabled="true" title="Official link coming soon">{children}</span>;
}
