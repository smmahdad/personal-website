"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { site } from "@/content/site";

export function MobileNav({ currentPath }: { currentPath: string }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        className="font-mono text-[12px] tracking-[0.16em] uppercase text-muted"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? "Close" : "Menu"}
      </button>
      {open ? (
        <nav
          id={panelId}
          aria-label="Mobile"
          className="absolute inset-x-0 top-[57px] z-20 border-b border-line bg-bg/95 px-5 py-4 backdrop-blur-sm"
        >
          <ul className="flex flex-col gap-3">
            {site.nav.map((item) => {
              const active =
                currentPath === item.href ||
                currentPath === item.href.replace(/\/$/, "");
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`block py-1 text-sm tracking-[0.12em] uppercase ${
                      active ? "text-brass" : "text-ink"
                    }`}
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      ) : null}
    </div>
  );
}
