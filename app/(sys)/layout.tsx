/**
 * System/Admin Layout
 * Layout with sidebar navigation for admin area
 */

import { ReactNode } from "react";
import { SysLayoutClient } from "./SysLayoutClient";

interface SysLayoutProps {
  children: ReactNode;
}

export default function SysLayout({ children }: SysLayoutProps) {
  return <SysLayoutClient>{children}</SysLayoutClient>;
}
