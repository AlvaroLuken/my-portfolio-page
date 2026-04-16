export type HomeTabId = "bio" | "projects" | "gallery" | "my-content" | "resume" | "contact";

export type HomeTabCard = {
  title: string;
  subtitle: string;
  cta: string;
  kind?: "default" | "contact-form";
  category?: "book" | "movie";
  badges?: string[];
  href?: string;
  imageSrc?: string;
  imageAlt?: string;
  logoSrc?: string;
  logoAlt?: string;
};

export type HomeContentItem = {
  title: string;
  subtitle: string;
  href: string;
  imageSrc?: string;
  imageAlt?: string;
  kind: "video" | "article";
};

export type HomeContentSection = {
  title: string;
  items: HomeContentItem[];
};

export type HomeBioStep = {
  period: string;
  title: string;
  details: string;
  logoSrc?: string;
  logoAlt?: string;
  href?: string;
  linkLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
};

export type HomeTabPanel = {
  heading: string;
  layout: "cards" | "bio" | "content";
  cards?: HomeTabCard[];
  bioSteps?: HomeBioStep[];
  contentSections?: HomeContentSection[];
};
