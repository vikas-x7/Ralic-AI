export default function ComplexitySection() {
  return (
    <section id="use-case" className="bg-black px-23 py-24 text-white">
      <div className="mx-auto">
        <div className="flex flex-col items-start justify-between gap-8 border-b border-white/10 pb-10 md:flex-row">
          <p className="max-w-md text-sm text-white/60">
            Generate and edit complex system architectures instantly through
            natural language and diagram-as-code.
          </p>

          <div className="flex flex-col gap-8 sm:flex-row sm:gap-16">
            <div>
              <p className="text-xs text-white/40 uppercase">
                Diagrams generated
              </p>
              <h2 className="mt-2 text-4xl">100+</h2>
            </div>

            <div>
              <p className="text-xs text-white/40 uppercase">
                Supported syntaxes
              </p>
              <h2 className="mt-2 text-4xl">15+</h2>
            </div>
          </div>
        </div>

        <div className="mt-20 grid items-start gap-16 md:grid-cols-2">
          <div>
            <div className="mb-4 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-white" />
              <span className="text-xs text-white/50 uppercase">
                AI-Powered Architecture
              </span>
            </div>

            <h1 className="text-5xl leading-11 -tracking-[3px] md:text-6xl">
              Built to handle <br /> complexity
            </h1>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            <div className="border-l border-white/10 pl-4">
              <p className="font-medium">AI & Code Native</p>
              <p className="mt-2 text-sm text-white/50">
                Use conversational AI or raw Mermaid natively
              </p>
            </div>

            <div className="border-l border-white/10 pl-4">
              <p className="font-medium">Real-time preview</p>
              <p className="mt-2 text-sm text-white/50">
                See architecture changes instantly
              </p>
            </div>

            <div className="border-l border-white/10 pl-4">
              <p className="font-medium">Export anywhere</p>
              <p className="mt-2 text-sm text-white/50">
                High-res PNG, SVG, and sharing links
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-20 items-center gap-16">
        <div className="flex items-center justify-center border border-white/10">
          <img
            src="https://res.cloudinary.com/dyv9kenuj/image/upload/v1776662627/Screenshot_from_2026-04-20_10-51-59_ye8dbr.png"
            alt="preview"
            className="w-full shadow-2xl"
          />
        </div>
      </div>
    </section>
  );
}
