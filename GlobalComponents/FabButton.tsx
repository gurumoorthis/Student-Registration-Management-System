"use client";

import { Fab } from "@mui/material";
import type { SvgIconComponent } from "@mui/icons-material";

interface FabButtonProps {
  icon: SvgIconComponent;
  onClick?: () => void;
  className?: string;
  ariaLabel?: string;
  color?:
    | "default"
    | "primary"
    | "secondary"
    | "error"
    | "info"
    | "success"
    | "warning";
  size?: "small" | "medium" | "large";
}

export function FabButton({
  icon: Icon,
  onClick,
  className = "",
  ariaLabel = "button",
  color = "primary",
  size = "medium",
}: FabButtonProps) {
  return (
    <Fab
      onClick={onClick}
      aria-label={ariaLabel}
      color={color}
      size={size}
      className={className}
    >
      <Icon fontSize="small" />
    </Fab>
  );
}
