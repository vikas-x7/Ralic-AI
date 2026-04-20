'use client';

import Link from 'next/link';
import { FiChevronDown } from 'react-icons/fi';
import { IoMdArrowForward } from 'react-icons/io';

export default function Navbar() {
  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed top-0 right-0 left-0 z-50">
      <nav className="flex items-center justify-between border-b border-white/10 bg-black px-2 py-2 backdrop-blur-md md:px-17">
        <div className="flex items-center justify-center gap-3 text-xl font-semibold md:gap-2">
          <div className="w-7 md:w-10">
            <img
              src="https://res.cloudinary.com/dyv9kenuj/image/upload/v1777271807/ralicai-removebg-preview_p4egp8.png"
              alt=""
              className="w-11 object-center"
            />
          </div>

          <h1 className="mt-0.5 -ml-4 text-[13px] font-medium -tracking-[0.5px] md:text-[20px] md:-tracking-[1px]">
            Relic AI
          </h1>
        </div>

        <div className="hidden gap-8 text-sm -tracking-[0.5px] md:flex">
          <div
            onClick={() => scrollTo('usecases')}
            className="flex cursor-pointer items-center gap-1"
          >
            Usecases
          </div>
          <div
            onClick={() => scrollTo('demo-video')}
            className="flex cursor-pointer items-center gap-1"
          >
            How it's works
          </div>

          <div className="flex cursor-pointer items-center gap-1">
            Subscription
          </div>

          <Link href="#">Document</Link>
          <div
            onClick={() => scrollTo('faq')}
            className="flex cursor-pointer items-center gap-1"
          >
            FAQ
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="cursor-pointer bg-white px-2 py-1 text-[10px] font-medium text-black md:px-4 md:py-1 md:text-[12px] md:-tracking-[0.5px]"
          >
            Get start
          </Link>
        </div>
      </nav>

      <div className="relative overflow-hidden bg-[#1A1A1A] py-1.5 text-center text-[11px] text-white md:text-[13px]">
        <div className="absolute top-0 left-0 h-full w-20 bg-gradient-to-r from-black to-transparent" />

        <div className="absolute top-0 right-0 h-full w-20 bg-gradient-to-l from-black to-transparent" />

        <span className="relative z-10 flex items-center justify-center gap-3">
          Relic AI is Under Active Development <IoMdArrowForward />
        </span>
      </div>
    </div>
  );
}
