export default function Getstart() {
  return (
    <div className="relative h-screen">
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <p className="mb-1 text-[30px] font-medium -tracking-[2px]">
          Don&apos;t Go with flow
        </p>
        <div className="relative inline-block p-4">
          <span className="absolute top-0 left-0 h-4 w-4 border-t-2 border-l-2 border-white/30" />

          <span className="absolute top-0 right-0 h-4 w-4 border-t-2 border-r-2 border-white/30" />

          <span className="absolute bottom-0 left-0 h-4 w-4 border-b-2 border-l-2 border-white/30" />

          <span className="absolute right-0 bottom-0 h-4 w-4 border-r-2 border-b-2 border-white/30" />

          <h1 className="border border-dashed border-white/20 px-5 py-13 pr-7 text-[130px] leading-10 font-semibold -tracking-[12px]">
            Getstart with relic.ai
          </h1>
        </div>
      </div>
    </div>
  );
}
