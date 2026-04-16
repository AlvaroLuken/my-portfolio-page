"use client";

import { useEffect, useRef, useState } from "react";
import BackgroundAudio from "../components/BackgroundAudio";
import ContentLoader from "../components/ContentLoader";
import ContactFormCard from "../components/ContactFormCard";
import InteractiveGlobe from "../components/InteractiveGlobe";
import {
  NAV_ITEMS,
  TAB_PANELS,
  type HomeBioStep,
  type HomeContentItem,
  type HomeContentSection,
  type HomeTabCard,
  type HomeTabId,
  type HomeTabPanel,
} from "./homeData";

function getYouTubeVideoId(url: string) {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtu.be")) {
      return parsed.pathname.slice(1);
    }
    if (parsed.pathname.startsWith("/live/")) {
      return parsed.pathname.replace("/live/", "");
    }
    return parsed.searchParams.get("v");
  } catch {
    return null;
  }
}

function getSocialHandleFromHref(href: string) {
  try {
    const parsed = new URL(href);
    const pathSegment = parsed.pathname
      .split("/")
      .filter(Boolean)
      .at(-1);
    if (!pathSegment) return null;
    return `@${decodeURIComponent(pathSegment).replace(/^@/, "")}`;
  } catch {
    return null;
  }
}

const RESUME_PDF_PATH = "/resume/AL_LUKEN_RESUME_2026.pdf";
const RESUME_PDF_VIEW_PATH = `${RESUME_PDF_PATH}#toolbar=1&navpanes=0&scrollbar=1&zoom=page-width`;

function getProjectBadgeClass(badge: string) {
  const normalized = badge.trim().toLowerCase();
  if (normalized === "founder") return "terrain-stage-card-badge-founder";
  if (normalized === "open source") return "terrain-stage-card-badge-open-source";
  if (normalized === "non-profit") return "terrain-stage-card-badge-non-profit";
  if (normalized === "archived") return "terrain-stage-card-badge-archived";
  if (normalized === "deprecated") return "terrain-stage-card-badge-deprecated";
  if (normalized === "for fun") return "terrain-stage-card-badge-fun";
  return "";
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<HomeTabId | null>(null);
  const [contentView, setContentView] = useState<"video" | "article">("video");
  const [isContentLoading, setIsContentLoading] = useState(false);
  const [hasPreloadedVideos, setHasPreloadedVideos] = useState(false);
  const [loadedVideoCount, setLoadedVideoCount] = useState(0);
  const [activeGalleryCard, setActiveGalleryCard] = useState<HomeTabCard | null>(null);
  const [activeBioImage, setActiveBioImage] = useState<{
    src: string;
    alt: string;
    title: string;
    subtitle: string;
  } | null>(null);
  const [panelOverlayOffsetTop, setPanelOverlayOffsetTop] = useState(0);
  const contentTimerRef = useRef<number | null>(null);
  const loadedVideoIdsRef = useRef<Set<string>>(new Set());
  const stageGridRef = useRef<HTMLDivElement | null>(null);
  const activePanel: HomeTabPanel | null = activeTab ? TAB_PANELS[activeTab] : null;
  const isProjectsPanel = activeTab === "projects";
  const isGalleryPanel = activeTab === "gallery";
  const primaryNavItems = NAV_ITEMS.filter((item) => item.id !== "contact" && item.id !== "resume");
  const utilityNavItems = NAV_ITEMS.filter((item) => item.id === "resume" || item.id === "contact");
  const contentItems: HomeContentItem[] =
    activePanel?.layout === "content"
      ? (activePanel.contentSections ?? []).flatMap((section: HomeContentSection) => section.items)
      : [];
  const contentItemsForView = contentItems.filter((item: HomeContentItem) => item.kind === contentView);
  const contactSocials: HomeTabCard[] = (TAB_PANELS.contact.cards ?? []).filter(
    (card: HomeTabCard) => !!card.logoSrc && !!card.href && card.kind !== "contact-form",
  );
  const allVideoItems = (TAB_PANELS["my-content"].contentSections ?? [])
    .flatMap((section: HomeContentSection) => section.items)
    .filter((item: HomeContentItem) => item.kind === "video");

  useEffect(() => {
    return () => {
      if (contentTimerRef.current) {
        window.clearTimeout(contentTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    stageGridRef.current?.scrollTo({ top: 0, behavior: "auto" });
  }, [activeTab]);

  useEffect(() => {
    if (!activeGalleryCard && !activeBioImage) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveGalleryCard(null);
        setActiveBioImage(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeGalleryCard, activeBioImage]);

  const handleTabChange = (tab: HomeTabId) => {
    if (tab !== "gallery") {
      setActiveGalleryCard(null);
    }
    if (tab !== "bio") {
      setActiveBioImage(null);
    }
    setActiveTab(tab);
    if (tab === "my-content") {
      setContentView("video");
      if (hasPreloadedVideos) {
        setIsContentLoading(false);
        if (contentTimerRef.current) {
          window.clearTimeout(contentTimerRef.current);
        }
        return;
      }
      setIsContentLoading(true);
      if (contentTimerRef.current) {
        window.clearTimeout(contentTimerRef.current);
      }
      const delay = 1500;
      contentTimerRef.current = window.setTimeout(() => {
        if (hasPreloadedVideos) {
          setIsContentLoading(false);
        }
      }, delay);
      if (!hasPreloadedVideos) {
        loadedVideoIdsRef.current.clear();
        setLoadedVideoCount(0);
      }
      return;
    }
    setIsContentLoading(false);
  };

  const handleVideoLoaded = (videoId: string) => {
    if (hasPreloadedVideos) return;
    if (loadedVideoIdsRef.current.has(videoId)) return;
    loadedVideoIdsRef.current.add(videoId);
    const nextCount = loadedVideoIdsRef.current.size;
    setLoadedVideoCount(nextCount);
    if (nextCount >= allVideoItems.length) {
      setHasPreloadedVideos(true);
      setIsContentLoading(false);
    }
  };

  const getPanelScrollTop = () => stageGridRef.current?.scrollTop ?? 0;

  return (
    <div className="terrain-page">
      <main className="terrain-shell">
        <section className="terrain-card">
          <aside className="terrain-left">
            <button
              type="button"
              className="terrain-name-reset"
              onClick={() => {
                setActiveGalleryCard(null);
                setActiveBioImage(null);
                setActiveTab(null);
              }}
            >
              <p className="terrain-name">Alvaro Luken</p>
            </button>
            <h1 className="terrain-title">
              Creative developer, designer, educator, instructor, mentor, and community builder.
            </h1>
            <ul className="terrain-nav">
              {primaryNavItems.map((item) => (
                <li key={item.label}>
                  <button
                    type="button"
                    className={item.id === activeTab ? "is-active" : ""}
                    onClick={() => handleTabChange(item.id)}
                  >
                    <span>{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
            <div className="terrain-left-bottom">
              <p className="terrain-subheader">
                Designing meaningful experiences where story, strategy, and code meet.
              </p>
              <ul className="terrain-nav terrain-nav-utility-list">
                {utilityNavItems.map((item, index) => (
                  <li key={item.id} className={index === 1 ? "terrain-nav-utility-after-divider" : ""}>
                    {index === 1 ? <span className="terrain-nav-utility-divider" aria-hidden="true" /> : null}
                    <button
                      type="button"
                      className={item.id === activeTab ? "is-active" : ""}
                      onClick={() => handleTabChange(item.id)}
                    >
                      <span>{item.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
              <p className="terrain-copy">@2026 Atelier Alvaro Inc.</p>
            </div>
          </aside>

          <section className="terrain-map" aria-label="Interactive Globe">
            <div className="terrain-meta">
              <span>14:42:34 GMT</span>
            </div>
            {activePanel ? (
              <div
                ref={stageGridRef}
                className={`terrain-stage-grid ${activeTab === "resume" ? "is-resume-panel" : ""}`}
                aria-live="polite"
              >
                <header className="terrain-stage-header">
                  <h2>{activePanel.heading}</h2>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveGalleryCard(null);
                      setActiveBioImage(null);
                      setActiveTab(null);
                    }}
                  >
                    Return to Globe
                  </button>
                </header>
                {activePanel.layout === "bio" ? (
                  <>
                    <section className="terrain-bio-intro">
                      <h3>About Me</h3>
                      <p>
                        I am a creative developer, educator, and community builder focused on helping
                        people learn, ship, and grow through thoughtful product experiences and technical storytelling.
                      </p>
                    </section>
                    <ol className="terrain-bio-flow">
                      {activePanel.bioSteps?.map((step: HomeBioStep) => (
                        <li key={`${step.period}-${step.title}`} className="terrain-bio-step">
                          <p className="terrain-bio-period">{step.period}</p>
                          <div className="terrain-bio-body">
                            {step.logoSrc ? (
                              <button
                                type="button"
                                className="terrain-bio-logo-wrap terrain-bio-logo-button"
                                onClick={() => {
                                  setPanelOverlayOffsetTop(getPanelScrollTop());
                                  setActiveBioImage({
                                    src: step.logoSrc ?? "",
                                    alt: step.logoAlt ?? `${step.title} logo`,
                                    title: step.title,
                                    subtitle: step.details,
                                  });
                                }}
                              >
                                <img
                                  src={step.logoSrc}
                                  alt={step.logoAlt ?? `${step.title} logo`}
                                  className="terrain-bio-logo"
                                  loading="lazy"
                                />
                              </button>
                            ) : null}
                            <div>
                              <h3>{step.title}</h3>
                              <p>{step.details}</p>
                              {step.secondaryHref || step.href ? (
                                <div className="terrain-bio-cta-row">
                                  {step.secondaryHref ? (
                                    <a
                                      href={step.secondaryHref}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="terrain-stage-card-cta terrain-stage-card-cta-button terrain-bio-secondary-cta"
                                    >
                                      {step.secondaryLabel ?? "Learn more"}
                                    </a>
                                  ) : null}
                                  {step.href ? (
                                  <a
                                    href={step.href}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="terrain-stage-card-cta terrain-stage-card-cta-button"
                                  >
                                    {step.linkLabel ?? "Visit website"}
                                  </a>
                                  ) : null}
                                </div>
                              ) : null}
                            </div>
                          </div>
                        </li>
                      ))}
                    </ol>
                  </>
                ) : activeTab === "contact" ? (
                  <section className="terrain-contact-tab">
                    <ContactFormCard />
                    <section className="terrain-contact-links" aria-label="Social links">
                      <h3>On the web</h3>
                      <ul>
                        {contactSocials.map((card: HomeTabCard) => (
                          <li key={card.title}>
                            <a
                              href={card.href}
                              target="_blank"
                              rel="noreferrer"
                              className="terrain-contact-link-row"
                              aria-label={card.title}
                              title={card.title}
                            >
                              <img src={card.logoSrc} alt={card.logoAlt ?? `${card.title} logo`} loading="lazy" />
                              <span>{getSocialHandleFromHref(card.href ?? "") ?? card.title}</span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    </section>
                  </section>
                ) : activePanel.layout === "content" ? (
                  <div className="terrain-content-sections">
                    <div className="terrain-content-toggle" role="tablist" aria-label="My content type">
                      <button
                        type="button"
                        role="tab"
                        aria-selected={contentView === "video"}
                        className={contentView === "video" ? "is-active" : ""}
                        onClick={() => {
                          setContentView("video");
                        }}
                      >
                        Browse Video Content
                      </button>
                      <span aria-hidden="true">|</span>
                      <button
                        type="button"
                        role="tab"
                        aria-selected={contentView === "article"}
                        className={contentView === "article" ? "is-active" : ""}
                        onClick={() => setContentView("article")}
                      >
                        Browse Written Content
                      </button>
                    </div>

                    <div className={isContentLoading ? "terrain-content-grid-wrap is-loading" : "terrain-content-grid-wrap"}>
                      {isContentLoading ? (
                        <ContentLoader loadedCount={loadedVideoCount} totalCount={allVideoItems.length} />
                      ) : null}
                      {contentView === "article" ? (
                        <ul className="terrain-written-links" aria-label="Written content links">
                          {contentItemsForView.map((item: HomeContentItem) => (
                            <li key={item.title}>
                              <a href={item.href} target="_blank" rel="noreferrer">
                                {item.title}
                              </a>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="terrain-stage-cards">
                          {contentItemsForView.map((item: HomeContentItem) => {
                            const videoId = item.kind === "video" ? getYouTubeVideoId(item.href) : null;

                            if (item.kind === "video" && videoId) {
                              return (
                                <article key={item.title} className="terrain-stage-card terrain-content-card terrain-video-card">
                                  <div className="terrain-video-embed">
                                    <iframe
                                      src={`https://www.youtube.com/embed/${videoId}`}
                                      title={item.title}
                                      loading={isContentLoading ? "eager" : "lazy"}
                                      onLoad={() => handleVideoLoaded(videoId)}
                                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                      referrerPolicy="strict-origin-when-cross-origin"
                                      allowFullScreen
                                    />
                                  </div>
                                </article>
                              );
                            }

                            return null;
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                ) : activeTab === "resume" ? (
                  <section className="terrain-resume-panel">
                    <div className="terrain-resume-embed-wrap">
                      <iframe
                        src={RESUME_PDF_VIEW_PATH}
                        title="Al Luken Resume 2026"
                        className="terrain-resume-embed"
                      />
                    </div>
                    <a
                      href={RESUME_PDF_PATH}
                      download
                      className="terrain-resume-download"
                    >
                      Download Resume
                    </a>
                  </section>
                ) : (
                  <div className={`terrain-stage-cards ${isGalleryPanel ? "terrain-gallery-grid" : ""}`}>
                    {activePanel.cards?.map((card: HomeTabCard) => {
                      if (card.kind === "contact-form") {
                        return <ContactFormCard key={card.title} />;
                      }

                      const isExternal = !!card.href && card.href.startsWith("http");

                      if (card.href) {
                        return (
                          <a
                            key={card.title}
                            className="terrain-stage-card is-link"
                            href={card.href}
                            target={isExternal ? "_blank" : undefined}
                            rel={isExternal ? "noreferrer" : undefined}
                          >
                            {card.imageSrc ? (
                              <img
                                className="terrain-stage-card-image"
                                src={card.imageSrc}
                                alt={card.imageAlt ?? `${card.title} preview`}
                                loading="lazy"
                              />
                            ) : null}
                            {card.logoSrc ? (
                              <div className="terrain-stage-card-logo-wrap">
                                <img
                                  src={card.logoSrc}
                                  alt={card.logoAlt ?? `${card.title} logo`}
                                  className="terrain-stage-card-logo"
                                  loading="lazy"
                                />
                              </div>
                            ) : null}
                            {card.badges?.length ? (
                              <div className="terrain-stage-card-badges">
                                {card.badges.map((badge: string) => (
                                  <span key={`${card.title}-${badge}`} className={`terrain-stage-card-badge ${getProjectBadgeClass(badge)}`}>
                                    {badge}
                                  </span>
                                ))}
                              </div>
                            ) : null}
                            <h3>{card.title}</h3>
                            <p>{card.subtitle}</p>
                            {isProjectsPanel ? (
                              <div className="terrain-stage-card-footer">
                                <span className="terrain-stage-card-cta terrain-stage-card-cta-button">
                                  {card.cta}
                                </span>
                              </div>
                            ) : (
                              <span className="terrain-stage-card-cta">{card.cta}</span>
                            )}
                          </a>
                        );
                      }

                      if (isGalleryPanel && card.imageSrc) {
                        return (
                          <button
                            key={card.title}
                            type="button"
                            className="terrain-stage-card terrain-gallery-card-button"
                            onClick={() => {
                              setPanelOverlayOffsetTop(getPanelScrollTop());
                              setActiveGalleryCard(card);
                            }}
                          >
                            <img
                              className="terrain-stage-card-image"
                              src={card.imageSrc}
                              alt={card.imageAlt ?? `${card.title} preview`}
                              loading="lazy"
                            />
                            <h3>{card.title}</h3>
                            <p>{card.subtitle}</p>
                          </button>
                        );
                      }

                      return (
                        <article key={card.title} className="terrain-stage-card">
                          {card.imageSrc ? (
                            <img
                              className="terrain-stage-card-image"
                              src={card.imageSrc}
                              alt={card.imageAlt ?? `${card.title} preview`}
                              loading="lazy"
                            />
                          ) : null}
                          {card.logoSrc ? (
                            <div className="terrain-stage-card-logo-wrap">
                              <img
                                src={card.logoSrc}
                                alt={card.logoAlt ?? `${card.title} logo`}
                                className="terrain-stage-card-logo"
                                loading="lazy"
                              />
                            </div>
                          ) : null}
                          {card.badges?.length ? (
                            <div className="terrain-stage-card-badges">
                              {card.badges.map((badge: string) => (
                                <span key={`${card.title}-${badge}`} className={`terrain-stage-card-badge ${getProjectBadgeClass(badge)}`}>
                                  {badge}
                                </span>
                              ))}
                            </div>
                          ) : null}
                          <h3>{card.title}</h3>
                          <p>{card.subtitle}</p>
                          {isProjectsPanel ? (
                            <div className="terrain-stage-card-footer">
                              <span className="terrain-stage-card-cta terrain-stage-card-cta-button">
                                {card.cta}
                              </span>
                            </div>
                          ) : (
                            <span className="terrain-stage-card-cta">{card.cta}</span>
                          )}
                        </article>
                      );
                    })}
                  </div>
                )}
                {activeGalleryCard?.imageSrc && isGalleryPanel ? (
                  <div
                    className="terrain-gallery-lightbox-backdrop"
                    style={{ top: `${panelOverlayOffsetTop}px`, bottom: "auto", height: "100%" }}
                    role="button"
                    tabIndex={0}
                    aria-label="Close image preview"
                    onClick={() => setActiveGalleryCard(null)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        setActiveGalleryCard(null);
                      }
                    }}
                  >
                    <section
                      className="terrain-gallery-lightbox"
                      role="dialog"
                      aria-modal="true"
                      aria-label={activeGalleryCard.title}
                      onClick={(event) => event.stopPropagation()}
                    >
                      <header className="terrain-gallery-lightbox-header">
                        <div>
                          <h3>{activeGalleryCard.title}</h3>
                          <p>{activeGalleryCard.subtitle}</p>
                        </div>
                        <button type="button" onClick={() => setActiveGalleryCard(null)}>
                          Close
                        </button>
                      </header>
                      <div className="terrain-gallery-lightbox-image-wrap">
                        <img
                          src={activeGalleryCard.imageSrc}
                          alt={activeGalleryCard.imageAlt ?? `${activeGalleryCard.title} preview`}
                          className="terrain-gallery-lightbox-image"
                        />
                      </div>
                    </section>
                  </div>
                ) : null}
                {activeBioImage ? (
                  <div
                    className="terrain-gallery-lightbox-backdrop"
                    style={{ top: `${panelOverlayOffsetTop}px`, bottom: "auto", height: "100%" }}
                    role="button"
                    tabIndex={0}
                    aria-label="Close image preview"
                    onClick={() => setActiveBioImage(null)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        setActiveBioImage(null);
                      }
                    }}
                  >
                    <section
                      className="terrain-gallery-lightbox"
                      role="dialog"
                      aria-modal="true"
                      aria-label={activeBioImage.title}
                      onClick={(event) => event.stopPropagation()}
                    >
                      <header className="terrain-gallery-lightbox-header">
                        <div>
                          <h3>{activeBioImage.title}</h3>
                          <p>{activeBioImage.subtitle}</p>
                        </div>
                        <button type="button" onClick={() => setActiveBioImage(null)}>
                          Close
                        </button>
                      </header>
                      <div className="terrain-gallery-lightbox-image-wrap">
                        <img
                          src={activeBioImage.src}
                          alt={activeBioImage.alt}
                          className="terrain-gallery-lightbox-image"
                        />
                      </div>
                    </section>
                  </div>
                ) : null}
              </div>
            ) : (
              <InteractiveGlobe />
            )}
            <BackgroundAudio src="/ElGato.mp4" className="terrain-audio-in-map" />
          </section>
        </section>
      </main>
    </div>
  );
}
