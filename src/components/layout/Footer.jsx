export default function Footer() {
  return (
    <footer className="bg-neutral-800 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Info */}
          <div>
            <div className="text-2xl font-bold text-accent mb-4">RUNminders</div>
            <p className="text-gray-300">
              Platform terbaru untuk menemukan dan mendaftar event lari di Indonesia.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Tautan</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-accent transition-colors">Tentang Kami</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Syarat & Ketentuan</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Kebijakan Privasi</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Blog</a></li>
              {/* <li><a href="#" className="hover:text-accent transition-colors">Kontak</a></li> */}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Kontak Kami</h3>
            <div className="space-y-2 text-gray-300">
              <p>📧 hello@runminders.id</p>
              <p>📞 +62 812-3456-7890</p>
              <div className="flex space-x-4 mt-4">
                <a href="#" className="hover:text-accent transition-colors">Instagram</a>
                <a href="#" className="hover:text-accent transition-colors">Threads</a>
                <a href="#" className="hover:text-accent transition-colors">Tiktok</a>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t  mt-8 pt-8 text-center text-gray-400">
          &copy; 2024 RUNminders. All rights reserved.
        </div>
      </div>
    </footer>
  )
}