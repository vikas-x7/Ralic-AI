'use client';

import React from 'react';
import Link from 'next/link';
import MarqueeSection from './MarqueeSection';

const Footer = () => {
  return (
    <footer className="w-full overflow-hidden border-t border-white/10 bg-black pt-12 text-white md:pt-20">
      <div className="px-4 md:px-6">
        <div className="flex flex-col justify-between gap-10">
          <div className="relative mt-4 select-none md:mt-8">
            <div className="flex items-center gap-2">
              <img
                src="/images/logo.png"
                alt="Relic AI Logo"
                className="-ml-3 w-12 object-center md:w-23"
              />

              <h1 className="-ml-[10px] text-[28px] font-semibold tracking-tight md:-ml-[24px] md:text-[48px] md:-tracking-[3px]">
                Relic ai
              </h1>
            </div>

            <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-3 py-6 text-[13px] md:justify-end md:gap-x-8 md:py-8 md:text-sm">
            <Link
              href="#"
              className="font-medium text-white/60 transition-colors hover:text-white"
            >
              Use cases
            </Link>

            <Link
              href="#"
              className="font-medium text-white/60 transition-colors hover:text-white"
            >
              Diagram Gallery
            </Link>

            <Link
              href="#"
              className="font-medium text-white/60 transition-colors hover:text-white"
            >
              AI Models
            </Link>

            <Link
              href="#"
              className="font-medium text-white/60 transition-colors hover:text-white"
            >
              Documentation
            </Link>

            <Link
              href="#"
              className="font-medium text-white/60 transition-colors hover:text-white"
            >
              Community Canvas
            </Link>
          </div>
        </div>
      </div>

      <div className="relative mt-6 flex w-full justify-center overflow-hidden opacity-80 md:mt-8">
        <img
          src="https://i.pinimg.com/1200x/51/d9/75/51d9750deca68afc3a73a5fa010c87ac.jpg"
          alt="footer bottom visuals"
          className="w-full object-contain"
        />

        <div className="via-black/ absolute inset-0 bg-gradient-to-b from-black/90 to-transparent" />
      </div>
    </footer>
  );
};

export default Footer;
