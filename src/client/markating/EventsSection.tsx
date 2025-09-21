import React from 'react';

export default function EventsSection() {
  return (
    <div className="mx-auto mt-32 w-full px-24 pb-32">
      <div className="mb-12 max-w-2xl">
        <h2 className="mb-4 text-[42px] font-medium -tracking-[1px] text-white">
          Events
        </h2>
        <p className="mb-6 text-[15px] leading-relaxed -tracking-[0.2px] text-white/60">
          University events take place throughout the year, from educational
          showpieces to public lectures, national tours and one-off exhibitions.
        </p>
        <a
          href="#"
          className="inline-block border-b border-white/30 pb-0.5 text-[14px] text-white/80 transition-colors hover:border-white hover:text-white"
        >
          See all events
        </a>
      </div>

      <div className="grid grid-cols-1 gap-[1px] border border-white/10 bg-white/10 shadow-2xl md:grid-cols-2 lg:grid-cols-4">
        {[
          {
            title:
              'Student work on display at Khazar University Art Gallery Exhibition',
            dateNum: '5',
            dateStr: 'Dec\nem\nber',
            image:
              'https://i.pinimg.com/736x/82/39/c2/8239c260b887084b9e8719afd0811690.jpg',
            hasRegister: true,
          },
          {
            title:
              'Musical performances by students along with many guest performers',
            dateNum: '7',
            dateStr: 'Dec\nem\nber',
            image:
              'https://i.pinimg.com/736x/af/74/35/af743561dae6fc4f808beb8d0cb1d6aa.jpg',
            hasRegister: false,
          },
          {
            title:
              '"History and Evolution of Typography" lecture with Rizvan Baghirli',
            dateNum: '15',
            dateStr: 'Dec\nem\nber',
            image:
              'https://i.pinimg.com/736x/82/39/c2/8239c260b887084b9e8719afd0811690.jpg',
            hasRegister: true,
          },
          {
            title: 'Inter-Uni Football Tournament: Khazar vs ADU',
            dateNum: '28',
            dateStr: 'Dec\nem\nber',
            image:
              'https://i.pinimg.com/1200x/7c/2c/9c/7c2c9cfc538f253e9562f6dac1399ba2.jpg',
            hasRegister: true,
          },
        ].map((item, idx) => (
          <div
            key={idx}
            className="group flex flex-col bg-black transition-colors"
          >
            <div className="flex-1 p-7">
              <h3 className="mb-10 min-h-[65px] pr-4 text-[14px] leading-relaxed font-medium text-white/80">
                {item.title}
              </h3>
              <div className="flex items-center gap-3">
                <span className="text-[48px] leading-none font-light -tracking-[2px] text-white">
                  {item.dateNum}
                </span>
                <span className="text-[10px] leading-[1.3] font-medium tracking-wide whitespace-pre-line text-white/40 uppercase">
                  {item.dateStr}
                </span>
              </div>
            </div>
            <div
              className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${
                idx === 0
                  ? 'h-100 opacity-100'
                  : 'max-h-0 opacity-0 group-hover:max-h-100 group-hover:opacity-100'
              }`}
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full object-cover brightness-[0.7] contrast-125 filter"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
