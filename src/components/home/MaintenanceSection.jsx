export default function MaintenanceSection() {
  return (
    <main className="min-h-screen bg-primary-dark text-white flex flex-col items-center justify-center overflow-hidden relative px-4">
      {/* Background track lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute top-0 bottom-0 border-l border-white/5"
            style={{ left: `${(i + 1) * 16.666}%` }}
          />
        ))}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-secondary to-transparent opacity-60" />
        <div className="absolute bottom-2 left-0 right-0 h-px bg-linear-to-r from-transparent via-accent to-transparent opacity-30" />
      </div>

      {/* Glowing orb background */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-secondary-light/10 rounded-full blur-3xl pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center gap-6 max-w-2xl w-full">

        {/* Main title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black leading-tight">
          <span className="text-white">Hello!!</span>
          <br />
          <span className="bg-linear-to-r from-accent via-accent/50 to-white bg-clip-text text-transparent">
            Runminders
          </span>
          <br />
          <span className="text-white text-3xl sm:text-5xl md:text-6xl">
            will be back
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-neutral-light text-base sm:text-lg max-w-md">
          We&apos;re gearing up for the next race. Stay tuned for exciting running events near you.
        </p>

        {/* Pace divider */}
        <div className="flex items-center gap-3 w-full max-w-xs">
          <div className="flex-1 h-px bg-linear-to-r from-transparent to-gray-100/50" />
          <span className="text-accent text-xl">&#9654;</span>
          <div className="flex-1 h-px bg-linear-to-l from-transparent to-gray-100/50" />
        </div>

        {/* Bottom tag */}
        <p className="text-neutral text-xs tracking-widest uppercase mt-2">
          Keep Running. Stay Tuned.
        </p>
      </div>

      {/* Bottom finish line */}
      <div className="absolute bottom-0 left-0 right-0 h-6 flex">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={`flex-1 h-full ${i % 2 === 0 ? 'bg-white/10' : 'bg-transparent'}`}
          />
        ))}
      </div>
    </main>
  )
}
