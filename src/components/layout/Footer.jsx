import { Icon } from '@iconify/react'
import Link from "next/link"

export default function Footer() {
  const appMail = process.env.APP_MAIL
  const appPhone = process.env.APP_PHONE
  const appWhatsapp = process.env.APP_WHATSAPP
  const appInstagram = process.env.APP_INSTAGRAM

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
                <a href={`mailto:${appMail}`} className=" hover:text-accent">{appMail}</a>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-3">
                <Icon icon="mdi:phone-outline" width="20" height="20"/>
                <a href={`tel:+${appPhone}`} className=" hover:text-accent">+{appPhone}</a>
              </div>

              {/* Social Media */}
              <div className="flex space-x-4 mt-4">
                <a href={`${appWhatsapp}?text=${encodeURIComponent('Halo Runminders, aku mau bertanya nih..')}`} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors flex items-center gap-1">
                  <Icon icon="mdi:whatsapp" width="20" height="20" />
                </a>
                <a href={appInstagram} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors flex items-center gap-1">
                  <Icon icon="mdi:instagram" width="20" height="20" />
                </a>
                {/* <a href="#" className="hover:text-accent transition-colors flex items-center gap-1">
                  <Icon icon="simple-icons:threads" width="18" height="18" />                  
                </a>
                <a href="#" className="hover:text-accent transition-colors flex items-center gap-1">
                  <Icon icon="ic:baseline-tiktok" width="20" height="20" />
                </a> */}
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t  mt-8 pt-8 text-center text-gray-400">
          &copy; {new Date().getFullYear()} Runminders. All rights reserved.
        </div>
      </div>
    </footer>
  )
}