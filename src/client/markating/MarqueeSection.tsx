'use client';

const mindMapNodes = [
  {
    name: 'AI-powered canvas for architecture diagrams',
  },
  {
    name: 'Design, visualize, and iterate with intelligent nodes',
  },
  {
    name: 'Build system architectures in minutes, not hours',
  },
  {
    name: 'Node-based workflows powered by AI',
  },
  {
    name: 'From idea to architecture diagram instantly',
  },
  {
    name: 'Collaborate and brainstorm on an infinite canvas',
  },
  {
    name: 'AI-assisted diagram generation and refinement',
  },
  {
    name: 'Think visually, build systematically with ralic.ai',
  },
  {
    name: 'Drag, connect, and let AI do the rest',
  },
  {
    name: 'The smartest way to design your system architecture',
  },
];

export default function MarqueeSection() {
  return (
    <section className="z-200 w-full overflow-hidden backdrop-blur-md">
      <div className="flex">
        <div className="animate-marquee flex whitespace-nowrap">
          {[...mindMapNodes, ...mindMapNodes].map((node, i) => (
            <span
              key={i}
              className="mx-5 text-[13px] opacity-80 transition-opacity duration-200 select-none hover:opacity-100 sm:mx-8 sm:text-[15px] md:mx-10 md:text-[11px]"
            >
              {node.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
