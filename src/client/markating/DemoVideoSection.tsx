import MarqueeSection from '@/client/markating/MarqueeSection';

export default function DemoVideoSection() {
  return (
    <section
      id="demo-video"
      className="mt-14 flex flex-col bg-black px-4 text-white md:mt-0 md:mb-20 md:px-19"
    >
      <div className="items-center gap-16">
        <div className="flex items-center justify-center">
          <video autoPlay loop muted playsInline className="w-full shadow-2xl">
            <source
              src="https://res.cloudinary.com/dyv9kenuj/video/upload/v1778740598/relicdemov1_1_aurpo2.mp4"
              type="video/mp4"
            />
          </video>
        </div>
      </div>
      <div className="mt-30 flex-col items-center justify-center border-y border-dashed border-white/10 py-10">
        <div className="text-center">
          <h1 className="mb-10 text-[20px] -tracking-[1px] text-white/90">
            Powered by Top AI Models
          </h1>
        </div>{' '}
        <MarqueeSection />
      </div>
    </section>
  );
}
