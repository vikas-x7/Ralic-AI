'use client';

import { useState } from 'react';

const faqs1 = [
  {
    question: 'Is Relic AI free to use?',
    answer:
      'We offer a generous free tier for individuals and open-source contributors. For professional teams needing advanced collaboration and premium models, we have scalable paid plans.',
  },
  {
    question: 'Can I use Relic AI in my enterprise environment?',
    answer:
      'Absolutely. We provide enterprise plans with SSO, dedicated support, and custom deployment options including VPC peering and strict compliance standards.',
  },
  {
    question: 'How secure is my data on Relic AI?',
    answer:
      'Security is our top priority. All data is encrypted at rest and in transit. We strictly do not use your proprietary architecture or private diagrams to train our public AI models.',
  },
  {
    question: 'Do you offer a self-hosted option?',
    answer:
      'Currently, we operate as a cloud-first SaaS to ensure real-time collaboration and seamless updates. We are actively exploring self-hosted and on-prem options for our enterprise customers.',
  },
  {
    question: 'What AI models power Relic AI?',
    answer:
      'We utilize state-of-the-art models including GPT-4o, Claude 3.5 Sonnet, and specialized reasoning models to ensure the highest quality of system design and architecture generation.',
  },
];

const faqs2 = [
  {
    question: 'What is Relic AI?',
    answer:
      'Relic AI is a powerful, node-based workspace built specifically for developers and architects. It allows you to run parallel AI conversations and instantly generate complex architecture diagrams using natural language or code, replacing clunky manual drawing tools.',
  },
  {
    question: 'Which diagram types and syntaxes are supported?',
    answer:
      'We support over 20 diagram types including Flowcharts, Sequence Diagrams, ER Diagrams, Git Graphs, and Mindmaps. It is natively integrated with Mermaid and ReactFlow, supporting direct generation through AI chat nodes.',
  },
  {
    question: 'How does the real-time preview work?',
    answer:
      'As you chat with the AI or type your diagram code, Relic AI renders the visual architecture instantly on its infinite canvas, so you can see exactly how your system maps out without switching contexts.',
  },
  {
    question: 'Can I export or share my diagrams and workspace?',
    answer:
      'Yes! Every diagram you create can be exported in high-resolution PNG or SVG formats. You can also generate sharing links to easily collaborate with your team on your entire chat and diagram canvas.',
  },
  {
    question: 'Do I need to manually arrange my nodes?',
    answer:
      'Not typically. By leveraging our AI-assisted layout and declarative code syntaxes like Mermaid, Relic AI automatically handles the layout and routing of your diagrams so you can focus on system design rather than pixel-pushing.',
  },
];

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState<string | null>('1-0');

  return (
    <section className="w-full bg-black px-4 py-14 text-white sm:px-6 md:flex md:px-10 lg:px-16 lg:py-28">
      <div className="mb-10 w-full md:mb-0 md:w-[35%]">
        <h2 className="text-3xl font-medium -tracking-[2px] sm:text-4xl md:text-5xl md:-tracking-[4px]">
          Frequently Asked Questions
        </h2>
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
    </section>
  );
}
