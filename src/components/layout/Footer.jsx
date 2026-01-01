import { Icon } from '@iconify/react'
import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-neutral-800 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Info */}
          <div>
            <div className="text-2xl font-bold text-accent mb-4">Runminders</div>
            <p className="text-gray-300">
              Platform terbaru untuk menemukan dan mendaftar event lari di Indonesia.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Tautan</h3>
            <ul className="space-y-2 text-gray-300">
              <li><Link href={'/about'} className="hover:text-accent transition-colors">Tentang Kami</Link></li>
              <li><Link href={'/terms-conditions'} className="hover:text-accent transition-colors">Syarat & Ketentuan</Link></li>
              <li><Link href={'/privacy-policy'} className="hover:text-accent transition-colors">Kebijakan Privasi</Link></li>
              {/* <li><Link href={'/blog'} className="hover:text-accent transition-colors">Blog</Link></li> */}
              <li><Link href={'/contact'} className="hover:text-accent transition-colors">Contact</Link></li>
              <li><Link href={'/faq'} className="hover:text-accent transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Kontak Kami</h3>


            <div className="space-y-3 text-gray-300">
              {/* Email */}
              <div className="flex items-center gap-3">
                <Icon icon="mdi:email-outline" width="20" height="20" />
                <a href="mailto:info@runminders.id" className=" hover:text-accent">info@runminders.id</a>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-3">
                <Icon icon="mdi:phone-outline" width="20" height="20"/>
                <a href="https://wa.me/6281234567890" target="_blank" className=" hover:text-accent">+62 812-3456-7890</a>
              </div>

              {/* Social Media */}
              <div className="flex space-x-4 mt-4">
                <a href="https://wa.me/6281234567890" className="hover:text-accent transition-colors flex items-center gap-1">
                  <Icon icon="mdi:whatsapp" width="20" height="20" />
                  {/* <span className="hidden sm:inline">Instagram</span> */}
                </a>
                <a href="#" className="hover:text-accent transition-colors flex items-center gap-1">
                  <Icon icon="mdi:instagram" width="20" height="20" />
                  {/* <span className="hidden sm:inline">Instagram</span> */}
                </a>
                <a href="#" className="hover:text-accent transition-colors flex items-center gap-1">
                  <Icon icon="simple-icons:threads" width="18" height="18" />
                  {/* <span className="hidden sm:inline">Threads</span> */}
                </a>
                {/* <a href="#" className="hover:text-accent transition-colors flex items-center gap-1">
                  <Icon icon="ic:baseline-tiktok" width="20" height="20" />
                  <span className="hidden sm:inline">Tiktok</span>
                </a> */}
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t  mt-8 pt-8 text-center text-gray-400">
          &copy; 2024 Runminders. All rights reserved.
        </div>
      </div>
    </footer>
  )
}