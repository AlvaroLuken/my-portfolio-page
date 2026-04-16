import type { HomeTabId } from "./homeTypes";
import { TAB_PANELS as HOME_TAB_PANELS } from "./homePanels";

export const NAV_ITEMS: { id: HomeTabId; label: string }[] = [
  { id: "bio", label: "Bio" },
  { id: "projects", label: "Projects" },
  { id: "gallery", label: "Gallery" },
  { id: "my-content", label: "My Content" },
  { id: "resume", label: "Resume" },
  { id: "contact", label: "Contact" },
];
export type {
  HomeTabId,
  HomeTabCard,
  HomeContentItem,
  HomeContentSection,
  HomeBioStep,
  HomeTabPanel,
} from "./homeTypes";
export const TAB_PANELS = HOME_TAB_PANELS;
