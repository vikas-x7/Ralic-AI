'use client';

export default function CaseStudy() {
  return (
    <section className="w-full px-23 py-16">
      <div className="border border-white/20 bg-black">
        <div className="grid grid-cols-3 border-b border-white/20 text-center text-sm text-white/60">
          <div className="border-r border-white/20 py-6">GRAND AVENUE</div>
          <div className="border-r border-white/20 py-6">gocanvas</div>
          <div className="py-6">Darwinian ventures</div>
        </div>

        <div className="grid lg:grid-cols-[3fr_1fr]">
          <div className="relative flex flex-col justify-between bg-[#F1DF4D] p-10 text-black">
            <div>
              <h2 className="text-2xl font-medium -tracking-[3px] md:text-4xl">
                60% more high-quality leads, reduced prospecting time by 80%,
                and increased conversion rates by 40%.
              </h2>

              <p className="mt-20">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Explicabo adipisci veniam nobis. Delectus labore, laudantium
                impedit quos odit iure aliquam sint cupiditate totam. Dolore
                fuga qui sunt quod, quibusdam recusandae.
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-between border-l border-white/20 p-8">
            <div>
              <span className="border border-white/30 bg-white px-2 py-1 text-xs text-black">
                ROI SUMMARY
              </span>

              <p className="mt-6 text-sm leading-relaxed text-white/60">
                “How Grand Avenue boosted pipeline with Valley’s AI SDR”
              </p>
            </div>

            <button className="mt-10 border border-white/20 px-4 py-2 text-sm transition hover:bg-black hover:text-white">
              Read Now →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
