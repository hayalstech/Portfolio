"use client";

import Link from "next/link";
import { Github, Mail, Linkedin } from "lucide-react";

const navigationLinks = [
  { label: "Home", href: "#home" },
  { label: "Projects", href: "#demos" },
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
    href: "mailto:hayalsew.asrat@gmail.com",
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    href: "#",
  },
];

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="container-premium py-16">
        <div className="grid md:grid-cols-3 gap-12">
          {/* Brand Column */}
          <div>
            <Link href="#home" className="text-2xl font-bold mb-4 block">
              DevLaunch
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
                    className="text-gray-600 hover:text-black transition-colors text-sm"
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
                      link.href.startsWith("mailto") ? undefined : "_blank"
                    }
                    rel={
                      link.href.startsWith("mailto")
                        ? undefined
                        : "noopener noreferrer"
                    }
                    className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors text-sm"
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
          <p className="text-center text-gray-500 text-sm">
            © 2026 DevLaunch. Built by Hayalsew Asrat.
          </p>
        </div>
      </div>
    </footer>
  );
}
