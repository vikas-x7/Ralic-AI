import React from 'react';
import { MdArrowOutward } from 'react-icons/md';

export default function FeaturesSection() {
  return (
    <div
      id="usecases"
      className="mx-auto mt-4 w-full px-4 pb-32 md:mt-20 md:px-24"
    >
      <div className="mb-12 flex flex-col items-start justify-center text-center">
        <h2 className="mb-2 text-[25px] font-medium -tracking-[1px] text-white md:text-[42px]">
          What Relic Can Do ?
        </h2>

        <p className="text-start text-[12px] -tracking-[0.2px] text-white/60 md:mb-6 md:w-3xl md:text-[15px]">
          Everything you need to think freely - without losing context, without
          starting over, <br /> and without being boxed into a single thread.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-2 shadow-2xl md:grid-cols-2 lg:grid-cols-4">
        {[
          {
            number: '01',
            title: 'Canvas Nodes',
            description:
              'Every idea gets its own space on an infinite canvas. Open a node, go as deep as you want, and your context stays exactly where you left it — always.',
            points: [
              'Infinite spatial canvas',
              'Full conversation history per node',
              'Zoom in to think, zoom out to see all',
              'Nothing gets buried or lost',
              'Canvas grows with you',
            ],
          },
          {
            number: '02',
            title: 'Visual Thought Mapping',
            description:
              'See your entire thinking laid out in front of you. Connect ideas, organize complex thoughts, and build a map of your mind that makes sense at a glance.',
            points: [
              'Infinite interactive canvas',
              'Connect ideas visually',
              'Organize complex thoughts',
              'Drag and expand nodes',
              'Clarity at every level',
            ],
          },
          {
            number: '03',
            title: 'Branching Contexts',
            description:
              'Mid-conversation and a new idea hits? Branch it. A new node opens right from that moment — carrying full context forward — so both directions keep moving without losing a thing.',
            points: [
              'Branch from any point',
              'Full context in every branch',
              'Explore multiple directions',
              'Nothing disrupted, nothing lost',
              'Speed up ideation naturally',
            ],
          },
          {
            number: '04',
            title: 'Persistent Memory',
            description:
              'Every node, every branch, every conversation lives on your canvas permanently. Come back anytime and pick up exactly where you left off — no re-explaining, no starting over.',
            points: [
              'Every node lives forever',
              'Pick up where you left off',
              'No re-explaining, no starting over',
              'Context never disappears',
              'Canvas gets richer every day',
            ],
          },
        ].map((item, idx) => (
          <div
            key={idx}
            className="group rounded-[3px] bg-white/5 transition-colors"
          >
            <div className="p-6">
              <span className="text-[32px] font-light -tracking-[2px] text-white md:text-[48px]">
                {item.number}
              </span>

              <h3 className="mt-5 text-[20px] font-medium text-white">
                {item.title}
              </h3>

              <div className="mt-6 space-y-1">
                {item.points.map((point, i) => (
                  <div key={i} className="flex items-start gap-2 text-white/60">
                    <span className="mt-1 text-sm">
                      <MdArrowOutward />
                    </span>

                    <p className="text-[13px] leading-relaxed md:text-[14px]">
                      {point}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-20 flex flex-col items-start justify-between gap-8 pt-10 pb-10 md:flex-row">
        <p className="max-w-md text-xl -tracking-[0.5px] text-white">
          Your thinking, laid out exactly the way your mind works spatial,
          connected, and always alive.
        </p>

        <div className="flex gap-8 sm:flex-row sm:gap-16">
          <div>
            <p className="text-xs text-white/40 uppercase">NODES CREATED</p>

            <h2 className="mt-2 text-4xl text-white"> ~2k+</h2>
          </div>

          <div>
            <p className="text-xs text-white/40 uppercase">THINKING SPACE</p>

            <h2 className="mt-2 text-4xl -tracking-[0.5px] text-white">
              Unlimited
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
}
