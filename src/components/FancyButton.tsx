import React from "react";
import { motion } from "framer-motion";

type FancyButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  variant?: "primary" | "ghost";
};

export default function FancyButton({
  children,
  variant = "primary",
  disabled,
  ...rest
}: FancyButtonProps) {
  const base = "relative inline-flex items-center justify-center font-semibold rounded-full";
  const size = "px-6 py-3 text-base";
  const disabledClass = disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer";

  // gradient + shadow for "primary"
  const primary =
    "bg-gradient-to-r from-[#6D5BFF] via-[#5CC8FF] to-[#11BFAF] text-white shadow-lg";

  // a subtle glass alternative for ghost
  const ghost = "bg-white/6 text-white border border-white/8";

  return (
    <motion.button
      {...rest}
      disabled={disabled}
      whileHover={disabled ? {} : { y: -4, boxShadow: "0 18px 50px rgba(16,24,40,0.45)" }}
      whileTap={disabled ? {} : { y: 1, scale: 0.995 }}
      initial={{ y: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className={`${base} ${size} ${disabledClass} ${variant === "primary" ? primary : ghost}`}
      style={{
        // subtle 3D transform origin for nicer tilt
        transformStyle: "preserve-3d",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      {/* inner glow / sheen layer */}
      <span
        aria-hidden
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background:
            variant === "primary"
              ? "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))"
              : "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))",
          mixBlendMode: "overlay",
        }}
      />
      {/* tiny highlight strip */}
      <span
        aria-hidden
        className="absolute left-1/2 top-1/4 w-2/3 h-1 rounded-full opacity-30 pointer-events-none"
        style={{
          transform: "translateX(-50%)",
          background:
            "linear-gradient(90deg, rgba(255,255,255,0.6), rgba(255,255,255,0.08) 60%, rgba(255,255,255,0.02))",
          filter: "blur(6px)",
        }}
      />
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}
