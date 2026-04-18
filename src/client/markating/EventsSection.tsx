import React from 'react';
import { MdArrowOutward } from 'react-icons/md';

export default function EventsSection() {
  return (
    <div className="mx-auto mt-4 w-full px-4 pb-32 md:mt-20 md:px-24">
      <div className="mb-12 flex flex-col items-center justify-center text-center">
        <h2 className="mb-4 text-[25px] font-medium -tracking-[1px] text-white md:text-[42px]">
          Core Capabilities
        </h2>

        <p className="text-[12px] leading-relaxed -tracking-[0.2px] text-white/60 md:mb-6 md:w-3xl md:text-[15px]">
          Discover how Relic AI&apos;s node-based canvas breaks you out of the
          linear chat box. Transition seamlessly from AI conversations to
          real-time architecture diagrams, enabling true limitless exploration.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 shadow-2xl md:grid-cols-2 lg:grid-cols-4">
        {[
          {
            number: '01',
            title: 'Parallel AI Discussions',
            points: [
              'Run multiple AI models together',
              'Compare outputs side-by-side',
              'Branch conversations instantly',
              'Keep context across threads',
              'Boost research workflows',
            ],
          },
          {
            number: '02',
            title: 'Visual Thought Mapping',
            points: [
              'Infinite interactive canvas',
              'Connect ideas visually',
              'Organize complex systems',
              'Drag and expand nodes',
              'Improve clarity instantly',
            ],
          },
          {
            number: '03',
            title: 'Branching Contexts',
            points: [
              'Expand from any message',
              'Create parallel workflows',
              'Avoid losing context',
              'Explore multiple solutions',
              'Speed up ideation',
            ],
          },
          {
            number: '04',
            title: 'Seamless Architecture',
            points: [
              'Generate diagrams from prompts',
              'Support Mermaid syntax',
              'Real-time architecture preview',
              'Export instantly',
              'Simplify system design',
            ],
          },
        ].map((item, idx) => (
          <div
            key={idx}
            className="group rounded-[3px] bg-white/10 transition-colors"
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
        <p className="max-w-md text-sm text-white">
          Generate and edit complex system architectures instantly through
          natural language and diagram-as-code.
        </p>

        <div className="flex gap-8 sm:flex-row sm:gap-16">
          <div>
            <p className="text-xs text-white/40 uppercase">
              Diagrams generated
            </p>

            <h2 className="mt-2 text-4xl text-white">100+</h2>
          </div>

          <div>
            <p className="text-xs text-white/40 uppercase">
              Supported syntaxes
            </p>

            <h2 className="mt-2 text-4xl text-white">15+</h2>
          </div>
        </div>
      </div>
    </div>
  );
}
