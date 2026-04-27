'use client';

import { useState } from 'react';

const faqs1 = [
  {
    question: 'What is Relic AI?',
    answer:
      'Relic AI is a canvas-based AI thinking space where your ideas live as individual nodes each one its own self-contained conversation with full context and memory. It is built for the way your mind actually works non-linear, curious, and always branching.',
  },
  {
    question: 'Is Relic AI free to use?',
    answer:
      'Yes, we offer a generous free tier to get started. For power users who need more canvas space, memory, and advanced features, we have affordable paid plans.',
  },
  {
    question: 'How secure is my data on Relic AI?',
    answer:
      'Security is our top priority. All your conversations, nodes, and canvas data are encrypted at rest and in transit. We never use your private data to train our models.',
  },
  {
    question: 'What AI models power Relic AI?',
    answer:
      'Relic AI is powered by state-of-the-art models including GPT-4o and Claude giving you the best possible thinking partner right inside your canvas.',
  },
  {
    question: 'Can I use Relic AI for team collaboration?',
    answer:
      'Absolutely. You can share your canvas with teammates, collaborate on nodes together, and build a shared thinking space that everyone can contribute to.',
  },
];

const faqs2 = [
  {
    question: 'What is a node in Relic AI?',
    answer:
      'A node is an individual conversation space on your canvas. Each node holds its own full context and history completely independent from every other node. You can go as deep as you want inside any node without it affecting anything else on your canvas.',
  },
  {
    question: 'How does branching work?',
    answer:
      'At any point in any conversation even mid-sentence you can create a branch. A new node opens right from that exact moment, carrying all the context forward. Your original conversation keeps going exactly where it was, and your new branch explores freely. Nothing is lost, nothing is disrupted.',
  },
  {
    question: 'Does Relic AI remember my previous conversations?',
    answer:
      'Yes permanently. Every node, every branch, and every conversation lives on your canvas forever. Come back a week later and pick up exactly where you left off. No re-explaining, no starting over. Your canvas gets richer every time you use it.',
  },
  {
    question: 'Can I run multiple AI conversations at once?',
    answer:
      'Yes. Relic lets you have multiple nodes open and active on your canvas at the same time. While this is possible, our core focus is giving each idea its own deep, contextual space rather than just running parallel chats.',
  },
  {
    question: 'How is Relic AI different from ChatGPT or Claude?',
    answer:
      'Every other AI gives you a single linear thread. Relic gives you a canvas. Your ideas are not messages in a scroll they are nodes in a living map of your thinking. You can branch, connect, revisit, and build on every idea without ever losing context or starting over.',
  },
];

export default function FAQ() {
  // Yahan '1-0' se badalkar null kar diya, ab koi bhi automatic open nahi hoga
  const [activeIndex, setActiveIndex] = useState<string | null>(null);

  return (
    <section id="faq" className="bg-black text-white">
      <div className="mt-30 px-4 text-center">
        <h1 className="text-4xl font-medium -tracking-[2px] md:text-5xl md:-tracking-[4px]">
          Frequently Asked Questions
        </h1>
        <p className="mt-4 text-sm text-white/50 md:text-base">
          Everything to know about Relic AI
        </p>
      </div>

      {/* Grid container responsive layout balanced */}
      <div className="w-full gap-8 bg-black px-4 py-14 sm:px-6 md:grid md:grid-cols-2 md:px-10 lg:px-16 lg:py-24">
        {/* Left Column */}
        <div className="flex w-full flex-col gap-3">
          {faqs1.map((f, i) => {
            const id = `1-${i}`;
            const isOpen = activeIndex === id;
            return (
              <div key={i} className="w-full">
                <button
                  onClick={() => setActiveIndex(isOpen ? null : id)}
                  className="flex w-full items-center justify-between rounded-[4px] border border-white/[0.03] bg-[#0b0b0b] px-5 py-4 text-left transition-colors hover:bg-[#121212]"
                >
                  <span className="pr-4 text-sm leading-6 font-medium sm:text-[15px] md:text-[16px]">
                    {f.question}
                  </span>
                  <span
                    className={`shrink-0 text-xl text-white/60 transition-transform duration-300 ${
                      isOpen ? 'rotate-45 text-white' : ''
                    }`}
                  >
                    +
                  </span>
                </button>
                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen
                      ? 'mt-1 grid-rows-[1fr] opacity-100'
                      : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden rounded-[4px] border border-white/[0.02] bg-[#0b0b0b]">
                    <p className="px-5 py-4 text-[13px] leading-relaxed text-white/60 md:text-[14px]">
                      {f.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column */}
        <div className="mt-3 flex w-full flex-col gap-3 md:mt-0">
          {faqs2.map((f, i) => {
            const id = `2-${i}`;
            const isOpen = activeIndex === id;
            return (
              <div key={i} className="w-full">
                <button
                  onClick={() => setActiveIndex(isOpen ? null : id)}
                  className="flex w-full items-center justify-between rounded-[4px] border border-white/[0.03] bg-[#0b0b0b] px-5 py-4 text-left transition-colors hover:bg-[#121212]"
                >
                  <span className="pr-4 text-sm leading-6 font-medium sm:text-[15px] md:text-[16px]">
                    {f.question}
                  </span>
                  <span
                    className={`shrink-0 text-xl text-white/60 transition-transform duration-300 ${
                      isOpen ? 'rotate-45 text-white' : ''
                    }`}
                  >
                    +
                  </span>
                </button>
                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen
                      ? 'mt-1 grid-rows-[1fr] opacity-100'
                      : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden rounded-[4px] border border-white/[0.02] bg-[#0b0b0b]">
                    <p className="px-5 py-4 text-[13px] leading-relaxed text-white/60 md:text-[14px]">
                      {f.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
