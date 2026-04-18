import MarqueeSection from '@/client/markating/MarqueeSection';

export default function ComplexitySection() {
  return (
    <section className="mt-14 flex flex-col bg-black px-4 text-white md:mt-0 md:mb-20 md:px-19">
      <div className="items-center gap-16">
        <div className="flex items-center justify-center rounded-[4px] border border-white/10 bg-white/10 p-3 md:p-10">
          <img
            src="https://res.cloudinary.com/dyv9kenuj/image/upload/v1778436130/Screenshot_from_2026-05-10_23-28-57_xfevr2.png"
            alt="preview"
            className="w-full shadow-2xl"
          />
        </div>
      </div>
      <div className="mt-20">
        <MarqueeSection />
      </div>
    </section>
  );
}
