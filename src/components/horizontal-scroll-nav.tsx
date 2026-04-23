"use client";

import React, { useEffect, useRef } from "react";

interface TabItem {
  id: string;
  label: string;
}

interface HorizontalScrollNavProps {
  items: TabItem[];
  activeTab: string;
  onTabClick: (tabId: string) => void;
  t?: (kn: string, en: string) => string;
  className?: string;
}

export default function HorizontalScrollNav({
  items,
  activeTab,
  onTabClick,
  t = (kn, en) => en,
  className = "",
}: HorizontalScrollNavProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  // Auto-center active tab into view
  useEffect(() => {
    const container = containerRef.current;
    const activeButton = tabRefs.current[activeTab];

    if (container && activeButton) {
      const containerRect = container.getBoundingClientRect();
      const buttonRect = activeButton.getBoundingClientRect();

      // Check if button is off-screen to the left
      if (buttonRect.left < containerRect.left) {
        container.scrollTo({
          left: container.scrollLeft + (buttonRect.left - containerRect.left) - 16,
          behavior: "smooth",
        });
      }
      // Check if button is off-screen to the right
      else if (buttonRect.right > containerRect.right) {
        container.scrollTo({
          left: container.scrollLeft + (buttonRect.right - containerRect.right) + 16,
          behavior: "smooth",
        });
      }
    }
  }, [activeTab]);

  return (
    <div
      ref={containerRef}
      className={`sticky top-0 z-40 flex overflow-x-auto scrollbar-hide bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 backdrop-blur-md pt-0 mb-8 scroll-smooth ${className}`}
      style={{ WebkitOverflowScrolling: "touch" }}
    >
      {items.map((item) => (
        <button
          key={item.id}
          ref={(el) => {
            if (el) tabRefs.current[item.id] = el;
          }}
          onClick={() => {
            const el = document.getElementById(item.id);
            if (el) {
              window.scrollTo({
                top: el.offsetTop - 120,
                behavior: "smooth",
              });
            }
            onTabClick(item.id);
          }}
          className={`inline-block flex-shrink-0 px-4 py-3 text-sm md:text-base cursor-pointer transition-all font-semibold whitespace-nowrap border-b-[3px] ${
            activeTab === item.id
              ? "text-blue-600 dark:text-blue-400 border-b-blue-600 dark:border-b-blue-400 shadow-sm"
              : "text-slate-600 dark:text-slate-400 border-b-transparent hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
