'use client';

import React from 'react';
import Link from 'next/link';
import MarqueeSection from './MarqueeSection';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full overflow-hidden border-t border-white/10 bg-black pt-20 text-white">
      <div className="px-3">
        <div className="flex flex-col justify-between gap-8 md:flex-row">
          <div className="relative mt-8 select-none">
            <div className="flex items-center gap-2 text-xl font-semibold">
              <div className="">
                <img
                  src="/images/logo.png"
                  alt=""
                  className="w-23 bg-black object-center"
                />
              </div>
              <h1 className="-ml-[24px] text-[48px] -tracking-[3px]">
                Ralic ai
              </h1>
            </div>

            <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
          </div>
          <div className="flex w-full flex-wrap items-center gap-x-8 gap-y-4 border-t border-white/10 py-8 md:w-auto md:justify-end md:border-t-0 md:py-8">
            <Link
              href="#"
              className="text-sm font-medium text-white/60 transition-colors hover:text-white"
            >
              Use cases
            </Link>
            <Link
              href="#"
              className="text-sm font-medium text-white/60 transition-colors hover:text-white"
            >
              Diagram Gallery
            </Link>
            <Link
              href="#"
              className="text-sm font-medium text-white/60 transition-colors hover:text-white"
            >
              AI Models
            </Link>
            <Link
              href="#"
              className="text-sm font-medium text-white/60 transition-colors hover:text-white"
            >
              Documentation
            </Link>
            <Link
              href="#"
              className="text-sm font-medium text-white/60 transition-colors hover:text-white"
            >
              Community Canvas
            </Link>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-white/10 py-10 md:flex-row">
          <p className="text-xs text-white/40">
            © {currentYear} Ralic ai. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link
              href="#"
              className="text-xs text-white/40 transition-colors hover:text-white"
            >
              Terms of Service
            </Link>
            <Link
              href="#"
              className="text-xs text-white/40 transition-colors hover:text-white"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>

      <div className="pointer-events-none mt-8 flex w-full justify-center opacity-80">
        <img
          src="https://i.pinimg.com/1200x/51/d9/75/51d9750deca68afc3a73a5fa010c87ac.jpg"
          alt="footer bottom visuals"
          className="w-full object-contain"
        />
      </div>

      <MarqueeSection />
    </footer>
  );
};

export default Footer;
