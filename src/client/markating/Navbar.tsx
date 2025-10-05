import Link from 'next/link';
import { FiChevronDown } from 'react-icons/fi';

export default function Navbar() {
  return (
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
          href="/auth"
          className="cursor-pointer bg-white px-4 py-1 text-sm font-medium -tracking-[0.5px] text-black"
        >
          Get start
        </Link>
      </div>
    </nav>
  );
}
