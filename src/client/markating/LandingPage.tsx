'use client';

import Link from 'next/link';
import { FiChevronDown } from 'react-icons/fi';
import { IoMdArrowUp } from 'react-icons/io';
import EventsSection from './EventsSection';
import Footer from './Footer';
import MarqueeSection from '@/client/markating/MarqueeSection';
import ComplexitySection from '@/client/markating/ComplexitySection';
import Faq from '@/client/markating/Faq';
import { MdArrowForward } from 'react-icons/md';
import { CiMemoPad } from 'react-icons/ci';

export default function Hero() {
  return (
    <div className="relative flex flex-col bg-black text-white">
      <img
        src="https://i.pinimg.com/1200x/0e/83/8a/0e838a9ce09afd154ced3ee314635b0a.jpg"
        alt=""
        className="pointer-events-none absolute top-0 left-0 z-0 h-screen w-full object-cover"
      />
      <div className="pointer-events-none absolute top-0 left-0 z-0 h-screen w-full bg-black/30"></div>

      <nav className="fixed top-0 right-0 left-0 z-50 flex w-full items-center justify-between border-b border-white/10 px-20 py-1.5 backdrop-blur-md">
        <div className="flex items-center gap-2 text-xl font-semibold">
          <div className="">
            <img
              src="https://res.cloudinary.com/dyv9kenuj/image/upload/v1777271807/ralicai-removebg-preview_p4egp8.png"
              alt=""
              className="w-11 object-center"
            />
          </div>
          <h1 className="-ml-4 text-[20px] font-medium -tracking-[1px]">
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
          <Link
            href="/auth"
            className="cursor-pointer bg-white px-4 py-1 text-sm font-medium -tracking-[0.5px] text-black"
          >
            Login
          </Link>
        </div>
      </nav>
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 text-center">
        <div className="w-full flex-col items-center justify-center pt-32">
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
          <div className="mx-auto flex w-4xl items-center justify-center">
            <button className="mt-8 mr-3 flex cursor-pointer items-center gap-3 border border-white/10 px-8 py-1 text-[14px] font-medium -tracking-[0.5px] text-white">
              See How it work <CiMemoPad />
            </button>
            <Link
              href="/dashboard"
              className="mt-8 flex items-center gap-3 bg-white/90 px-7 py-1 text-[14px] font-medium -tracking-[0.5px] text-black"
            >
              Get started now <MdArrowForward />
            </Link>
          </div>

          <div className="mx-auto mt-12 mb-16 max-w-3xl text-left backdrop-blur-md">
            <div className="relative flex flex-col border border-white/10 shadow-xl">
              <textarea
                className="w-full resize-none bg-transparent px-5 py-3 text-[13px] leading-relaxed text-black placeholder-white outline-none"
                rows={2}
                placeholder="When a lead fills out our demo form, enrich them and route hot ones to the right rep on Slack"
              />
              <div className="flex items-center justify-between rounded-b-md border-t border-[#303030] px-4 py-2">
                <div className="flex items-center gap-2 text-[12px] font-medium text-white">
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

      <ComplexitySection />

      <EventsSection />

      <Faq />
      <div className="relative">
        <img
          src="https://res.cloudinary.com/dyv9kenuj/image/upload/v1777186392/kunal-patil-8ZKlgI_G-mw-unsplash-noise_ed0zgv.jpg"
          alt=""
          className="h-screen w-full object-cover opacity-50 grayscale"
        />
        <div className="absolute top-[35%] left-[15%]">
          <p className="mb-10 text-center text-[30px] font-medium -tracking-[2px]">
            Don't Go with flow
          </p>
          <div>
            <h1 className="text-[130px] leading-10 font-semibold -tracking-[12px]">
              Get start with ralic.ai
            </h1>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
