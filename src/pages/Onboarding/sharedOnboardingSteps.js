import {
  FiMapPin,
  FiBriefcase,
  FiClipboard,
  FiCamera,
  FiUsers,
  FiBell,
  FiRss,
  FiAward,
} from "react-icons/fi";
import { FaBullseye } from "react-icons/fa";

/** 9 steps shown in the header; first 3 are implemented in SharedOnboarding. */
export const NINE_STEP_META = [
  { key: "location", label: "Location", Icon: FiMapPin },
  { key: "identity", label: "Identity", Icon: FiBriefcase },
  { key: "purpose", label: "Purpose", Icon: FaBullseye },
  { key: "skills", label: "Skills", Icon: FiClipboard },
  { key: "photo", label: "Photo", Icon: FiCamera },
  { key: "connect", label: "Connect", Icon: FiUsers },
  { key: "alerts", label: "Alerts", Icon: FiBell },
  { key: "feed", label: "Feed", Icon: FiRss },
  { key: "complete", label: "Complete", Icon: FiAward },
];
