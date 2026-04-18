'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

import { IoIosArrowDown, IoMdArrowUp } from 'react-icons/io';
import EventsSection from './EventsSection';
import Footer from './Footer';

import ComplexitySection from '@/client/markating/ComplexitySection';
import Faq from '@/client/markating/Faq';
import { MdArrowForward, MdOutlineFullscreenExit } from 'react-icons/md';
import { CiMemoPad } from 'react-icons/ci';
import { IoAddOutline, IoMicOutline } from 'react-icons/io5';
import Getstart from './Getstart';
import Navbar from './Navbar';
import { FcGoogle } from 'react-icons/fc';
import MarqueeSection from '@/client/markating/MarqueeSection';

export default function Hero() {
  const placeholders = [
    'When a lead fills out our demo form, enrich them and route hot ones to the right rep on Slack',
    'Design a scalable microservices architecture for an e-commerce platform',
    'Create a system flow for a real-time chat application with WebSockets',
    'Map out the authentication flow using NextAuth and PostgreSQL',
  ];

  const [currentPlaceholder, setCurrentPlaceholder] = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const typingSpeed = isDeleting ? 3 : 20;
    const currentText = placeholders[placeholderIndex];

    const handleTyping = () => {
      if (!isDeleting && charIndex < currentText.length) {
        setCurrentPlaceholder(currentText.substring(0, charIndex + 1));
        setCharIndex((prev) => prev + 1);
      } else if (isDeleting && charIndex > 0) {
        setCurrentPlaceholder(currentText.substring(0, charIndex - 1));
        setCharIndex((prev) => prev - 1);
      } else if (!isDeleting && charIndex === currentText.length) {
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && charIndex === 0) {
        setIsDeleting(false);
        setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, placeholderIndex]);

  return (
    <section className="relative">
      <div className="md:mt z-10 mt-30 flex items-start justify-center text-center md:mt-0">
        <div className="relative flex w-full items-center justify-center overflow-hidden border-white/10 md:h-screen md:w-[90vw] md:border-x">
          <div className="w-full flex-col items-center justify-center">
            <p className="mb-2 inline-block rounded-4xl border border-white/10 px-4 py-1 text-[10px] tracking-[0] backdrop-blur-md md:mb-6 md:px-4 md:py-1.5 md:text-[12px] md:-tracking-[0.5px]">
              Multiple AI conversations, one powerful workspace
            </p>

            <h1 className="text-[23px] leading-7 font-medium -tracking-[1.5px] text-white/95 md:text-3xl md:text-[54px] md:leading-14 md:-tracking-[4px]">
              Your thoughts Don&apos;t Flow in a Straight <br /> Line Your AI
              should not Either
            </h1>

            <p className="mt-3 text-[9px] text-white/80 md:text-[15px] md:-tracking-[0.5px]">
              Relic ai lets you run multiple AI chat nodes simultaneously switch
              context <br /> instantly, compare responses, and stay in flow.
            </p>

            <div className="mx-auto mt-4 flex w-full items-center justify-center md:mt-8 md:w-4xl">
              <button className="mr-3 flex cursor-pointer items-center gap-1 border border-white/10 px-3 py-1 text-[10px] font-medium -tracking-[0.5px] text-white md:px-8 md:py-1.5 md:text-[14px]">
                See How it work <CiMemoPad />
              </button>

              <Link
                href="/dashboard"
                className="flex items-center gap-1 bg-white/90 px-2 py-1 text-[10px] font-medium -tracking-[0.5px] text-black md:px-7 md:py-1.5 md:text-[14px]"
              >
                Get start now <MdArrowForward />
              </Link>
            </div>

            <div className="relative mx-auto mt-5 inline-block w-[330px] p-0.5 md:w-full md:max-w-2xl">
              <span className="absolute top-0 left-0 h-2 w-2 border-t-2 border-l-2 border-white/70 md:h-4 md:w-4" />
              <span className="absolute top-0 right-0 h-2 w-2 border-t-2 border-r-2 border-white/70 md:h-4 md:w-4" />
              <span className="absolute bottom-0 left-0 h-2 w-2 border-b-2 border-l-2 border-white/70 md:h-4 md:w-4" />
              <span className="absolute right-0 bottom-0 h-2 w-2 border-r-2 border-b-2 border-white/70 md:h-4 md:w-4" />

              <div className="w-full backdrop-blur-md">
                <div className="relative flex flex-col border border-white/10 shadow-xl">
                  <textarea
                    className="h-10 w-full resize-none bg-transparent px-3 pt-2 text-[8px] leading-relaxed text-white placeholder-white/80 outline-none md:h-20 md:px-4 md:pt-4 md:text-[14px]"
                    rows={3}
                    placeholder={currentPlaceholder + '|'}
                  />

                  <div className="flex flex-row items-center justify-between border-t border-[#191919] px-3 py-1 sm:px-4 md:py-2">
                    <div className="flex items-center">
                      <button className="flex items-center gap-1 rounded-sm border border-[#191919] px-2 py-1 text-[8px] font-medium text-white transition-colors hover:bg-white/5 md:gap-2 md:text-[12px]">
                        <FcGoogle className="text-[9px] md:text-[14px]" />
                        <span>Gemma 2</span>
                        <IoIosArrowDown className="opacity-70" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="flex items-center gap-1 sm:gap-2">
                        <button className="flex h-6 w-6 items-center justify-center rounded-[2px] border border-[#191919] text-white transition-colors hover:bg-white/5 sm:h-7 sm:w-7">
                          <MdOutlineFullscreenExit className="text-[13px] md:text-[18px]" />
                        </button>

                        <button className="flex h-6 w-6 items-center justify-center rounded-[2px] border border-[#191919] text-white transition-colors hover:bg-white/5 sm:h-7 sm:w-7">
                          <IoMicOutline className="text-[13px] md:text-[18px]" />
                        </button>

                        <button className="flex h-6 w-6 items-center justify-center rounded-[2px] border border-[#191919] text-white transition-colors hover:bg-white/5 sm:h-7 sm:w-7">
                          <IoAddOutline className="text-[13px] md:text-[18px]" />
                        </button>
                      </div>

                      <button className="flex h-5 w-5 items-center justify-center rounded-[2px] bg-white text-black transition-transform hover:scale-105 active:scale-95 sm:h-7 sm:w-7">
                        <IoMdArrowUp className="text-[13px] md:text-[18px]" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden md:flex">
          <div className="z- pointer-events-none absolute inset-x-0 bottom-0 h-35 bg-gradient-to-t from-black to-transparent" />
        </div>
      </div>
    </section>
  );
}
