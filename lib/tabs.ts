import type { IconName } from "../components/ui";

export type Tab = "Home" | "Directory" | "Routes" | "Profile";

export const TABS: { key: Tab; label: string; icon: IconName }[] = [
  { key: "Home", label: "Home", icon: "home" },
  { key: "Directory", label: "Directory", icon: "list" },
  { key: "Routes", label: "Routes", icon: "map" },
  { key: "Profile", label: "Profile", icon: "profile" },
];
