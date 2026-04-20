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
  const [activeIndex, setActiveIndex] = useState<string | null>('1-0');

  return (
    <section id="faq">
      <div className="mt-30 text-center">
        <h1 className="text-5xl font-medium -tracking-[4px]">
          Frequently Asked Questions
        </h1>
        <p className="mt-2 text-white/50">Everything to know about Relic AI</p>
      </div>

      <div className="w-full gap-10 bg-black px-4 py-14 text-white sm:px-6 md:flex md:px-10 lg:px-16 lg:py-28">
        <div className="w-full md:w-[65%]">
          {faqs1.map((f, i) => {
            const id = `1-${i}`;
            return (
              <div key={i} className="mb-3">
                <button
                  onClick={() => setActiveIndex(activeIndex === id ? null : id)}
                  className="flex w-full items-center justify-between bg-[#0b0b0b] px-4 py-4 text-left"
                >
                  <span className="pr-4 text-sm leading-6 sm:text-[15px] md:text-[16px]">
                    {f.question}
                  </span>
                  <span
                    className={`shrink-0 text-xl transition-transform duration-300 ${
                      activeIndex === id ? 'rotate-45' : ''
                    }`}
                  >
                    +
                  </span>
                </button>
                <div
                  className={`grid transition-all duration-300 ${
                    activeIndex === id
                      ? 'grid-rows-[1fr] pb-4 opacity-100'
                      : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="bg-[#0b0b0b] px-4 py-2 text-sm leading-7 text-white/60 md:text-base">
                      {f.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="w-full md:w-[65%]">
          {faqs2.map((f, i) => {
            const id = `2-${i}`;
            return (
              <div key={i} className="mb-3">
                <button
                  onClick={() => setActiveIndex(activeIndex === id ? null : id)}
                  className="flex w-full items-center justify-between bg-[#0b0b0b] px-4 py-4 text-left"
                >
                  <span className="pr-4 text-sm leading-6 sm:text-[15px] md:text-[16px]">
                    {f.question}
                  </span>
                  <span
                    className={`shrink-0 text-xl transition-transform duration-300 ${
                      activeIndex === id ? 'rotate-45' : ''
                    }`}
                  >
                    +
                  </span>
                </button>
                <div
                  className={`grid transition-all duration-300 ${
                    activeIndex === id
                      ? 'grid-rows-[1fr] pb-4 opacity-100'
                      : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="bg-[#0b0b0b] px-4 py-2 text-sm leading-7 text-white/60 md:text-base">
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
