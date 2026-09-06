"use client";

import { useEffect } from "react";

export function useCodeBlockEnhancement() {
  useEffect(() => {
    const enhancements = () => {
      const codeBlocks = document.querySelectorAll("pre");
      
      codeBlocks.forEach((block) => {
        // Skip if already enhanced
        if (block.querySelector("[data-copy-button]")) return;

        const code = block.querySelector("code");
        if (!code) return;

        // Create copy button
        const button = document.createElement("button");
        button.setAttribute("data-copy-button", "true");
        button.className =
          "absolute right-3 top-3 rounded bg-foreground px-2.5 py-1.5 text-xs font-medium text-background opacity-70 transition hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";
        button.textContent = "Copy";
        button.type = "button";
        button.setAttribute("aria-label", "Copy code");

        const copyAndUpdateButton = () => {
          const text = code.textContent || "";
          navigator.clipboard.writeText(text).then(() => {
            button.textContent = "Copied!";
            setTimeout(() => {
              button.textContent = "Copy";
            }, 2000);
          });
        };

        button.addEventListener("click", copyAndUpdateButton);
        button.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            copyAndUpdateButton();
          }
        });

        // Insert button into code block
        block.style.position = "relative";
        block.insertBefore(button, code);
      });
    };

    // Run on mount
    enhancements();

    // Observe for dynamically added code blocks
    const observer = new MutationObserver(() => {
      enhancements();
    });

    observer.observe(document.body, { subtree: true, childList: true });

    return () => observer.disconnect();
  }, []);
}
