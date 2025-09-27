"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" disabled>
        <Sun className="h-4 w-4" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="transition-all duration-200"
      data-testid="theme-toggle"
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
      title={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
    >
      {theme === "light" ? (
        <Moon className="h-4 w-4" data-lucide="moon" />
      ) : (
        <Sun className="h-4 w-4" data-lucide="sun" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}

export function ThemeToggleSwitch() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center space-x-2">
        <span className="text-sm">Light</span>
        <div className="w-10 h-5 bg-muted rounded-full"></div>
        <span className="text-sm">Dark</span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm">Light</span>
      <button
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        className={`
          relative w-10 h-5 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
          ${theme === "dark" ? "bg-primary" : "bg-muted"}
        `}
      >
        <div
          className={`
            absolute top-0.5 w-4 h-4 bg-background rounded-full transition-transform duration-200 border
            ${theme === "dark" ? "translate-x-5" : "translate-x-0.5"}
          `}
        />
      </button>
      <span className="text-sm">Dark</span>
    </div>
  );
}