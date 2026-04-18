'use client';

const marqueeImages = [
  'https://thesvg.org/icons/gemini/default.svg',
  'https://thesvg.org/icons/kimi/default.svg',
  'https://thesvg.org/icons/minimax/default.svg',
  'https://thesvg.org/icons/deepseek/default.svg',
  'https://thesvg.org/icons/mistral/default.svg',
  'https://thesvg.org/icons/gemini/default.svg',
  'https://thesvg.org/icons/kimi/default.svg',
  'https://thesvg.org/icons/gemini/default.svg',
  'https://thesvg.org/icons/kimi/default.svg',
  'https://thesvg.org/icons/minimax/default.svg',
  'https://thesvg.org/icons/deepseek/default.svg',
  'https://thesvg.org/icons/mistral/default.svg',
  'https://thesvg.org/icons/gemini/default.svg',
  'https://thesvg.org/icons/kimi/default.svg',
];

export default function MarqueeSection() {
  const marqueeItems = [...marqueeImages, ...marqueeImages];

  return (
    <section className="marquee-fade w-full max-w-full overflow-hidden py-4 backdrop-blur-md">
      <div className="flex w-full overflow-hidden">
        <div className="animate-marquee flex w-max min-w-max items-center">
          {[0, 1].map((group) => (
            <div
              key={group}
              className="flex shrink-0 items-center md:gap-12 md:pr-12"
              aria-hidden={group === 1}
            >
              {marqueeItems.map((image, i) => (
                <div
                  key={`${group}-${i}`}
                  className="flex h-10 w-16 shrink-0 items-center justify-center opacity-70 grayscale transition-opacity duration-300 hover:opacity-100 md:h-12 md:w-20"
                >
                  <img
                    src={image}
                    alt={group === 0 ? `logo-${i + 1}` : ''}
                    className="h-6 w-auto max-w-full object-contain md:h-9"
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
