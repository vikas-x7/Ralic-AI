'use client';

import Link from 'next/link';
import { FiChevronDown } from 'react-icons/fi';

export default function Hero() {
  return (
    <div className="relative flex min-h-screen flex-col bg-[#F1F1F1] text-black">
      {/* Background Video */}
      <div
        dangerouslySetInnerHTML={{
          __html: `
            <video
              src="https://feather-website-assets.s3.us-east-1.amazonaws.com/feather_fold1_slowed.mp4"
              autoplay
              loop
              muted
              playsinline
              class="pointer-events-none absolute top-0 left-0 h-screen w-full object-cover opacity grayscale"
            ></video>
          `,
        }}
      />
      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between border-b border-black/10 px-3 py-2">
        <div className="flex items-center gap-2 text-xl font-semibold">
          <div className="">
            <img
              src="/images/logo.png"
              alt=""
              className="w-8 bg-black object-center"
            />
          </div>
          <h1 className="-ml-1 text-[18px] font-medium -tracking-[1px]">
            Kausy ai
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
          <button className="bg-black px-4 py-1.5 text-sm font-medium -tracking-[0.5px] text-white">
            Login
          </button>
        </div>
      </nav>
      {/* Hero */}
      <div className="relative z-10 flex h-[80vh] items-center justify-center px-4 text-center">
        <div className="w-full">
          <p className="mb-6 inline-block rounded-4xl border border-black/20 bg-white/5 px-4 py-1.5 text-[12px] -tracking-[0.5px] backdrop-blur-md">
            Multiple AI conversations, one powerful workspace
          </p>

          <h1 className="text-3xl leading-14 font-medium -tracking-[4px] text-black md:text-[56px]">
            Your thoughts Don&apos;t Flow in a Straight <br /> Line Your AI
            should not Either
          </h1>

          <p className="mt-3 text-[15px] -tracking-[0.5px]">
            Kausy lets you run multiple AI chat nodes simultaneously switch
            context <br /> instantly, compare responses, and stay in flow.
          </p>

          <button className="mt-8 bg-black px-8 py-1.5 font-medium -tracking-[0.5px] text-white">
            Get started now
          </button>
        </div>
      </div>
      {/* <div className="mt-20">
        <div className="relative h-screen w-full overflow-hidden">
         
          <img
            src="https://i.pinimg.com/1200x/d7/78/66/d77866ea70fa97b62e70c25bb23633da.jpg"
            alt="background"
            className="absolute inset-0 h-full w-full object-cover opacity-70"
          />

          
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src="https://res.cloudinary.com/dyv9kenuj/image/upload/q_auto/f_auto/v1776384439/Screenshot_from_2026-04-17_05-35-43_odyvvi.png"
              alt="preview"
              className="w-full shadow-2xl"
            />
          </div>
        </div>
      </div> */}
    </div>
  );
}
