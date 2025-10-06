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
    const typingSpeed = isDeleting ? 3 : 8;
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
    <section>
      <div className="relative z-10 mt-10 mb-18 flex items-center justify-center text-center">
        <img
          src="https://res.cloudinary.com/dyv9kenuj/image/upload/v1777604747/relicherobg-noise_tfvizv.jpg"
          alt=""
          className="contrast-more: relative opacity-5 grayscale"
        />
        <div className="absolute w-full flex-col items-center justify-center">
          <p className="mb-6 inline-block rounded-4xl border border-white/10 px-4 py-1.5 text-[12px] -tracking-[0.5px] backdrop-blur-md">
            Multiple AI conversations, one powerful workspace
          </p>

          <h1 className="text-3xl leading-14 font-medium -tracking-[4px] text-white/95 md:text-[54px]">
            Your thoughts Don&apos;t Flow in a Straight <br /> Line Your AI
            should not Either
          </h1>

          <p className="mt-3 text-[15px] -tracking-[0.5px] text-white/80">
            Relic ai lets you run multiple AI chat nodes simultaneously switch
            context <br /> instantly, compare responses, and stay in flow.
          </p>
          <div className="mx-auto flex w-4xl items-center justify-center">
            <button className="mt-8 mr-3 flex cursor-pointer items-center gap-3 border border-white/10 px-8 py-1.5 text-[14px] font-medium -tracking-[0.5px] text-white">
              See How it work <CiMemoPad />
            </button>
            <Link
              href="/dashboard"
              className="mt-8 flex items-center gap-3 bg-white/90 px-7 py-1.5 text-[14px] font-medium -tracking-[0.5px] text-black"
            >
              Get start now <MdArrowForward />
            </Link>
          </div>

          <div className="relative mt-10 inline-block p-0.5">
            <span className="absolute top-0 left-0 h-4 w-4 border-t-2 border-l-2 border-white/70" />

            <span className="absolute top-0 right-0 h-4 w-4 border-t-2 border-r-2 border-white/70" />

            <span className="absolute bottom-0 left-0 h-4 w-4 border-b-2 border-l-2 border-white/70" />

            <span className="absolute right-0 bottom-0 h-4 w-4 border-r-2 border-b-2 border-white/70" />

            <div className="w-2xl text-left backdrop-blur-md">
              <div className="relative flex flex-col border border-white/10 shadow-xl">
                <textarea
                  className="w-full resize-none bg-transparent px-5 py-3 text-[13px] leading-relaxed text-white placeholder-white/80 outline-none"
                  rows={2}
                  placeholder={currentPlaceholder + '|'}
                />
                <div className="flex items-center justify-between rounded-b-md border-t border-[#191919] px-4 py-2">
                  <div className="flex items-center gap-2 text-[12px] font-medium text-white">
                    <span className="flex items-center justify-center gap-1 border border-[#191919] px-2 py-0.5">
                      <FcGoogle size={14} />
                      Gemma-2
                      <IoIosArrowDown />
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <span className="flex items-center justify-center border border-[#191919] p-[6px] text-[13px]">
                      <MdOutlineFullscreenExit />
                    </span>
                    <span className="flex items-center justify-center border border-[#191919] p-[6px] text-[13px]">
                      <IoMicOutline />
                    </span>{' '}
                    <span className="flex items-center justify-center border border-[#191919] p-[6px] text-[13px]">
                      <IoAddOutline />
                    </span>
                    <button className="flex h-7 w-7 items-center justify-center rounded-[2px] bg-white text-black transition-colors hover:bg-gray-200">
                      <IoMdArrowUp />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
