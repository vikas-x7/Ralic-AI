'use client';

import Link from 'next/link';
import { FiChevronDown } from 'react-icons/fi';

export default function Hero() {
  return (
    <div className="relative flex min-h-screen flex-col bg-[#141414] text-white">
      {/* Background Image */}
      <div className="absolute inset-0 -z-10">
        <img
          src="https://i.pinimg.com/1200x/e3/44/8f/e3448fb6daef9bdbe6cb9bc24961e278.jpg"
          alt="background"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black" />
      </div>

      {/* Navbar */}
      <nav className="flex items-center justify-between border-b border-white/10 px-3">
        <div className="flex items-center gap-2 text-xl font-semibold">
          <img src="/images/logo.png" alt="" className="w-11" />
          <h1 className="-ml-3 text-[18px] font-medium -tracking-[1px]">
            Kausy ai
          </h1>
        </div>

        <div className="hidden gap-8 text-sm text-gray-300 md:flex">
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
          <button className="bg-white px-4 py-1 text-sm font-medium text-black">
            Login
          </button>
        </div>
      </nav>

      {/* Hero */}
      <div className="flex flex-1 justify-center px-4 text-center">
        <div className="mt-40 w-full">
          <p className="mb-6 inline-block rounded border border-white/10 px-4 py-1 text-[12px] text-white/60">
            Multiple AI conversations, one powerful workspace
          </p>

          <h1 className="text-5xl font-semibold -tracking-[4px] text-white/80 md:text-5xl">
            Your Thoughts Don t Flow in a Straight <br /> Line Your AI Shouldn t
            Either
          </h1>

          <p className="mt-6 text-[15px] text-white/40">
            Kausy lets you run multiple AI chat nodes simultaneously switch
            context <br /> instantly, compare responses, and stay in flow.
          </p>

          <button className="mt-8 bg-white px-6 py-1 font-medium text-black">
            Get started now
          </button>
        </div>
      </div>
    </div>
  );
}
