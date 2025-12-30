"use client";

import { Mail, Linkedin, Globe, Github  } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="max-w-4xl space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold text-white">
          Contact
        </h1>
        <p className="text-sm text-gray-400">
          Get in touch or explore our work online
        </p>
      </div>

      {/* CONTACT CARDS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* LINKEDIN */}
        <ContactCard
          icon={<Linkedin className="h-5 w-5 text-sky-400" />}
          label="LinkedIn"
          value="linkedin.com/in/preritnagpal"
          link="www.linkedin.com/in/preritnagpal"
        />

        {/* PORTFOLIO */}
        <ContactCard
          icon={<Globe className="h-5 w-5 text-emerald-400" />}
          label="Portfolio"
          value="prerit-1906.vercel.app"
          link="https://prerit-1906.vercel.app/"
        />

        <ContactCard
          icon={<Github className="h-5 w-5 text-gray-300" />}
          label="GitHub"
          value="github.com/preritnagpal"
          link="https://github.com/preritnagpal"
        />

        {/* EMAIL */}
        <ContactCard
          icon={<Mail className="h-5 w-5 text-yellow-400" />}
          label="Email"
          value="preritnagpal1234@gmail.com"
          link="mailto:preritnagpal1234@gmail.com"
        />
      </div>

      {/* FOOTER */}
      <div className="pt-8 border-t border-white/10">
        <p className="text-center text-xs text-gray-500">
          © {new Date().getFullYear()} Corevia. All rights reserved.
        </p>
      </div>
    </div>
  );
}

/* ---------- REUSABLE CARD ---------- */
function ContactCard({
  icon,
  label,
  value,
  link,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  link: string;
}) {
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="
        flex items-center gap-4
        rounded-xl border border-white/10
        bg-[#0b1220] p-4
        transition hover:bg-white/5
      "
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 border border-white/10">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-sm text-gray-400">
          {label}
        </p>
        <p className="truncate text-sm font-medium text-white">
          {value}
        </p>
      </div>
    </a>
  );
}
