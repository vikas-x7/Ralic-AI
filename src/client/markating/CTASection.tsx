export default function CTASection() {
  return (
    <div className="relative h-[50vh] overflow-hidden md:h-[100vh]">
      <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
        <p className="mb-1 text-[18px] font-medium tracking-tight sm:text-[24px] md:text-[30px] md:-tracking-[2px]">
          Don&apos;t Go with flow
        </p>

        <div className="relative inline-block p-2 sm:p-3 md:p-4">
          <span className="absolute top-0 left-0 h-3 w-3 border-t-2 border-l-2 border-white/30 sm:h-4 sm:w-4" />

          <span className="absolute top-0 right-0 h-3 w-3 border-t-2 border-r-2 border-white/30 sm:h-4 sm:w-4" />

          <span className="absolute bottom-0 left-0 h-3 w-3 border-b-2 border-l-2 border-white/30 sm:h-4 sm:w-4" />

          <span className="absolute right-0 bottom-0 h-3 w-3 border-r-2 border-b-2 border-white/30 sm:h-4 sm:w-4" />

          <h1 className="border border-dashed border-white/20 px-5 py-4 pr-4 text-[32px] leading-none font-medium -tracking-[2px] sm:px-4 sm:py-10 sm:pr-5 sm:text-[60px] md:px-5 md:py-13 md:pr-7 md:text-[130px] md:leading-10 md:-tracking-[10px]">
            Getstart with Relic ai
          </h1>
        </div>
      </div>
    </div>
  );
}
