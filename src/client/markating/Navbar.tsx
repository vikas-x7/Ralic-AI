import Link from 'next/link';
import { FiChevronDown } from 'react-icons/fi';

export default function Navbar() {
  return (
    <nav className="fixed top-0 right-0 left-0 z-50 flex items-center justify-between border-b border-white/10 px-2 py-2 backdrop-blur-md md:px-10">
      <div className="flex items-center justify-center gap-3 text-xl font-semibold md:gap-2">
        <div className="w-7 md:w-10">
          <img
            src="https://res.cloudinary.com/dyv9kenuj/image/upload/v1777271807/ralicai-removebg-preview_p4egp8.png"
            alt=""
            className="w-11 object-center"
          />
        </div>
        <h1 className="mt-0.5 -ml-4 text-[13px] font-medium -tracking-[0.5px] md:text-[20px] md:-tracking-[1px]">
          Relic ai
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
          href="/login"
          className="cursor-pointer bg-white px-2 py-1 text-[10px] font-medium text-black md:px-4 md:py-1 md:text-[12px] md:-tracking-[0.5px]"
        >
          Get start
        </Link>
      </div>
    </nav>
  );
}
