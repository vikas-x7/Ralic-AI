'use client';

const mindMapNodes = [
  {
    name: 'LaTeX Documents Developer Portfolios Learning Roadmaps',
    img: 'https://thesvg.org/icons/kimi/default.svg',
  },
  {
    name: 'LaTeX Documents Developer Portfolios Learning Roadmaps',
  },
  {
    name: 'LaTeX Documents Developer Portfolios Learning Roadmaps',
  },
  {
    name: 'LaTeX Documents Developer Portfolios Learning Roadmaps',
  },
];

export default function MarqueeSection() {
  return (
    <section className="mt-20 w-full px-24">
      <div className="flex bg-white/80 text-black">
        <div className="animate-marquee flex whitespace-nowrap">
          {[...mindMapNodes, ...mindMapNodes].map((node, i) => (
            <span
              key={i}
              className="mx-5 text-[13px] opacity-80 transition-opacity duration-200 select-none hover:opacity-100 sm:mx-8 sm:text-[15px] md:mx-10 md:text-[10px]"
            >
              {node.img}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
