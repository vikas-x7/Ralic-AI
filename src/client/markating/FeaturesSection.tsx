import React from 'react';
import { MdArrowOutward } from 'react-icons/md';

export default function FeaturesSection() {
  return (
    <div className="mx-auto w-full px-4 pb-32 md:px-18">
      <div className="flex h-[90vh] flex-col items-center justify-between gap-12 border-x border-white/10 px-10 pt-16 pb-16 md:flex-row">
        <div className="max-w-3xl">
          <h2 className="text-[30px] leading-[1] font-normal -tracking-[3px] text-white md:text-[50px]">
            Unify your fragmented thoughts with an infinite spatial canvas for{' '}
            <span className="mt-2 inline-block rounded-[2px] bg-[#e6e6e5] px-2 py-0.5 font-normal text-black">
              context and ideas.
            </span>
          </h2>

          <div className="max-w-2xl md:mt-4">
            <p className="text-[15px] leading-relaxed -tracking-[0.1px] text-white/60">
              Stop losing your creative flow in separate tabs or isolated chats.
              Thinking deeply usually means juggling scattered notes, lost
              history, and broken threads Relic keeps your mind map connected
              and permanently alive.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-[1px] md:grid-cols-2 lg:grid-cols-4">
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
            className="group bg-black transition-colors" // bg-black se thin layout dikhega bina double borders ke
          >
            <div className="border border-white/10 p-6">
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
    </div>
  );
}
