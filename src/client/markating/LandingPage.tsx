'use client';

import Link from 'next/link';
import { FiChevronDown } from 'react-icons/fi';
import { IoMdArrowUp } from 'react-icons/io';
import EventsSection from './EventsSection';
import Footer from './Footer';
import MarqueeSection from '@/client/markating/MarqueeSection';

export default function Hero() {
  return (
    <div className="relative flex flex-col bg-black text-white">
      {/* Background Video */}
      <div
      // dangerouslySetInnerHTML={{
      //   __html: `
      //     <video
      //       src="https://feather-website-assets.s3.us-east-1.amazonaws.com/feather_fold1_slowed.mp4"
      //       autoplay
      //       loop
      //       muted
      //       playsinline
      //       class="pointer-events-none absolute top-0 left-0 h-screen w-full object-cover opacity grayscale"
      //     ></video>
      //   `,
      // }}
      />
      {/* Navbar */}
      <nav className="fixed top-0 right-0 left-0 z-50 flex w-full items-center justify-between border-b border-white/10 bg-black/80 px-20 py-1.5 backdrop-blur-md">
        <div className="flex items-center gap-2 text-xl font-semibold">
          <div className="">
            <img
              src="/images/logo.png"
              alt=""
              className="w-11 bg-black object-center"
            />
          </div>
          <h1 className="mt-1 -ml-4 text-[20px] font-medium -tracking-[1px]">
            Ralic ai
          </h1>
        </div>

        <div className="hidden gap-8 text-sm -tracking-[0.5px] md:flex">
          <div className="flex cursor-pointer items-center gap-1">
            Developers <FiChevronDown size={14} />
          </div>
          <div className="flex cursor-pointer items-center gap-1">
            Resources <FiChevronDown size={14} />
          </div>
          <div className="flex cursor-pointer items-center gap-1">
            Usecases <FiChevronDown size={14} />
          </div>
          <Link href="#">Pricing</Link>
          <Link href="#">Docs</Link>
        </div>

        <div className="flex items-center gap-4">
          <button className="bg-white px-4 py-1 text-sm font-medium -tracking-[0.5px] text-black">
            Login
          </button>
        </div>
      </nav>
      {/* Hero */}
      <div className="relative z-10 mt-20 flex items-center justify-center px-4 text-center">
        <div className="mt-20 w-full">
          <p className="mb-6 inline-block rounded-4xl border border-white/10 px-4 py-1.5 text-[12px] -tracking-[0.5px] backdrop-blur-md">
            Multiple AI conversations, one powerful workspace
          </p>

          <h1 className="text-3xl leading-14 font-medium -tracking-[4px] text-white/95 md:text-[54px]">
            Your thoughts Don&apos;t Flow in a Straight <br /> Line Your AI
            should not Either
          </h1>

          <p className="mt-3 text-[15px] -tracking-[0.5px] text-white/70">
            Ralic ai lets you run multiple AI chat nodes simultaneously switch
            context <br /> instantly, compare responses, and stay in flow.
          </p>

          <button className="mt-8 mr-3 border border-white/10 px-8 py-1 text-[14px] font-medium -tracking-[0.5px] text-white">
            Get started now
          </button>
          <button className="mt-8 bg-white/90 px-8 py-1 text-[14px] font-medium -tracking-[0.5px] text-black">
            Get started now
          </button>

          {/* Prompt Input Component */}
          <div className="mx-auto mt-12 mb-16 max-w-3xl text-left">
            <div className="relative flex flex-col border border-white/10 shadow-xl">
              <textarea
                className="w-full resize-none bg-transparent px-5 py-3 text-[13px] leading-relaxed text-gray-200 placeholder-white/40 outline-none"
                rows={2}
                placeholder="When a lead fills out our demo form, enrich them and route hot ones to the right rep on Slack"
              />
              <div className="flex items-center justify-between rounded-b-md border-t border-[#303030] px-4 py-2">
                <div className="flex items-center gap-2 text-[12px] font-medium text-white/30">
                  <span className="flex h-5 w-5 items-center justify-center rounded border border-[#404040] text-[13px]">
                    ↵
                  </span>
                  <span>to start</span>
                </div>
                <button className="flex h-8 w-8 items-center justify-center bg-white text-black transition-colors hover:bg-gray-200">
                  <IoMdArrowUp />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-25">
        <div className="flex items-center justify-center border border-white/10">
          <img
            src="https://res.cloudinary.com/dyv9kenuj/image/upload/v1776662627/Screenshot_from_2026-04-20_10-51-59_ye8dbr.png"
            alt="preview"
            className="w-full shadow-2xl"
          />
        </div>
      </div>

      <MarqueeSection />
      {/* Events Section */}
      <EventsSection />
      <Footer />
    </div>
  );
}
