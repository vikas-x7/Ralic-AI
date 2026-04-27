import MarqueeSection from '@/client/markating/MarqueeSection';

export default function DemoVideoSection() {
  return (
    <section
      id="demo-video"
      className="mt-14 flex flex-col bg-black text-white md:mt-0 md:mb-20"
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
    </section>
  );
}
