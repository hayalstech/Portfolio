"use client";

import Link from "next/link";
import { Github, Mail, Linkedin, Phone } from "lucide-react";

const navigationLinks = [
  { label: "Home", href: "#home" },
  { label: "Live Demos", href: "#demos" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

const developerLinks = [
  {
    icon: Github,
    label: "GitHub",
    href: "https://github.com/hayalstech",
  },
  {
    icon: Mail,
    label: "Email",
    href: "mailto:hayalstech@gmail.com",
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/hayalsewasrat",
  },
  {
    icon: Phone,
    label: "Phone",
    href: "tel:+251987037035",
  },
];

export default function Footer() {
  return (
    <footer className="relative bg-white border-t border-gray-200">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60"
        style={{ backgroundImage: "url(/images/pexels-alex-dos-santos-305643819-26172887 (10).jpg)" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/50 to-white/60" />
      <div className="relative z-10 container-premium py-16">
        <div className="grid md:grid-cols-3 gap-12">
          {/* Brand Column */}
          <div>
            <Link href="#home" className="text-2xl font-bold mb-4 block">
              StackShift
            </Link>
            <p className="text-gray-600 text-sm leading-relaxed">
              Modern full-stack web applications built by Hayalsew Asrat.
              Showcasing real backend functionality with clean, scalable code.
            </p>
          </div>

          {/* Navigation Column */}
          <div>
            <h4 className="font-semibold mb-4">Navigation</h4>
            <ul className="space-y-3">
              {navigationLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-800 hover:text-black transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Developer Links Column */}
          <div>
            <h4 className="font-semibold mb-4">Developer Links</h4>
            <ul className="space-y-3">
              {developerLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target={
                      link.href.startsWith("mailto") ||
                      link.href.startsWith("tel:")
                        ? undefined
                        : "_blank"
                    }
                    rel={
                      link.href.startsWith("mailto") ||
                      link.href.startsWith("tel:")
                        ? undefined
                        : "noopener noreferrer"
                    }
                    className="flex items-center gap-2 text-gray-800 hover:text-black transition-colors text-sm"
                  >
                    <link.icon className="w-4 h-4" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 mt-12 pt-8">
          <p className="text-center text-gray-700 text-sm">
            © 2026 StackShift. Built by Hayalsew Asrat.
          </p>
        </div>
      </div>
    </footer>
  );
}
