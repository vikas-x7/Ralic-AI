import React from 'react';

export default function EventsSection() {
  return (
    <div className="mx-auto mt-32 w-full px-24 pb-32">
      <div className="mb-12 max-w-2xl">
        <h2 className="mb-4 text-[42px] font-medium -tracking-[1px] text-white">
          Core Capabilities
        </h2>
        <p className="mb-6 text-[15px] leading-relaxed -tracking-[0.2px] text-white/60">
          Discover how Relic AI&apos;s node-based canvas breaks you out of the
          linear chat box. Transition seamlessly from AI conversations to
          real-time architecture diagrams, enabling true limitless exploration.
        </p>
        <a
          href="#"
          className="inline-block border-b border-white/30 pb-0.5 text-[14px] text-white/80 transition-colors hover:border-white hover:text-white"
        >
          Explore use cases
        </a>
      </div>

      <div className="grid grid-cols-1 gap-px border border-white/10 bg-white/10 shadow-2xl md:grid-cols-2 lg:grid-cols-4">
        {[
          {
            title:
              'Parallel AI Discussions: Run multiple models and conversations side-by-side',
            dateNum: '01',
            dateStr: 'KEY\nFEATURE',
            image:
              'https://i.pinimg.com/1200x/94/46/52/94465293ff661fd464e06f7b30baada8.jpg',
            hasRegister: true,
          },
          {
            title:
              'Visual Thought Mapping: Organize complex ideas seamlessly on an infinite canvas',
            dateNum: '02',
            dateStr: 'KEY\nFEATURE',
            image:
              'https://i.pinimg.com/736x/84/ee/a5/84eea5979c227bc5ea5ce1a044576a77.jpg',
            hasRegister: false,
          },
          {
            title:
              'Branching Contexts: Span out your thoughts dynamically from any point in the chat',
            dateNum: '03',
            dateStr: 'KEY\nFEATURE',
            image:
              'https://i.pinimg.com/1200x/79/f9/56/79f956294b9fde1d3bbf8b73cd29f46d.jpg',
            hasRegister: true,
          },
          {
            title:
              'Seamless Architecture: Convert conversational insights directly into system diagrams',
            dateNum: '04',
            dateStr: 'KEY\nFEATURE',
            image:
              'https://i.pinimg.com/736x/86/7c/83/867c83b8c949f3a6e89d90fa6643df0e.jpg',
            hasRegister: true,
          },
        ].map((item, idx) => (
          <div
            key={idx}
            className="group flex flex-col bg-black transition-colors"
          >
            <div className="flex-1 p-7">
              <div className="flex items-center gap-3">
                <span className="text-[48px] leading-none font-light -tracking-[2px] text-white">
                  {item.dateNum}
                </span>
                <span className="text-[10px] leading-[1.3] font-medium tracking-wide whitespace-pre-line text-white/40 uppercase">
                  {item.dateStr}
                </span>
              </div>
              <h3 className="mt-10 min-h-[65px] pr-4 text-[14px] leading-relaxed font-medium text-white/80">
                {item.title}
              </h3>
            </div>

            <img
              src={item.image}
              alt={item.title}
              className="h-60 w-full object-cover brightness-[0.7] grayscale filter"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
