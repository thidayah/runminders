import Link from "next/link";

export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:max-w-md">
          {/* Logo */}
          {/* <div className="text-center mb-8">
            <button 
              // onClick={() => window.location.href = '/'}
              className="text-3xl font-bold text-primary hover:scale-105 transform transition-transform duration-200"
            >
              RUNminders
            </button>
          </div> */}

          {/* Content */}
          <div className="bg-white py-8 px-6 sm:px-10 rounded-2xl shadow-xl border border-gray-100">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-neutral-800">{title}</h2>
              <p className="mt-2 text-gray-600">{subtitle}</p>
            </div>

            {children}
          </div>

          {/* Back to Home */}
          <div className="text-center mt-8">
            <Link 
              href={'/'}
              className="text-gray-600 hover:text-accent transition-colors duration-200 flex items-center justify-center gap-2 mx-auto"
            >
              <span>←</span>
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>

      {/* Right Side - Hero Image */}
      <div className="hidden lg:block flex-1 relative">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800&h=1000&fit=crop)'
          }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white via-neutral/95 to-primary"></div>
          
          {/* Content */}
          <div className="relative z-10 h-full flex items-center justify-center p-12">
            <div className="text-white text-center max-w-lg">
              <h3 className="text-4xl font-bold mb-4">Bergabung dengan Platform Event Lari Terbaru</h3>
              <p className="text-xl opacity-90">
                Temukan event seru, capai target personal, dan jelajahi pengalaman lari terbaik bersama <span className=" font-bold text-accent">RUNminders</span>
              </p>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mt-8">
                <div>
                  <div className="text-2xl font-bold">10K+</div>
                  <div className="text-sm opacity-80">Pelari</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">100+</div>
                  <div className="text-sm opacity-80">Event</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">15+</div>
                  <div className="text-sm opacity-80">Kota</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}