import Link from 'next/link'
import { Facebook, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer>
      {/* Newsletter Section */}
      <div className="bg-primary-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 text-center">
          <span className="section-label text-primary-200">Stay Connected</span>
          <h3 className="font-display text-2xl md:text-3xl font-bold text-white mb-3">
            Get Exclusive Offers & Health Tips
          </h3>
          <p className="text-primary-100 mb-6 text-sm max-w-md mx-auto">
            Subscribe to our newsletter for early access to new products, seasonal offers, and healthy snacking guides.
          </p>
          <div className="flex max-w-md mx-auto gap-2">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-4 py-3 rounded-l-md text-secondary-900 text-sm outline-none border-2 border-transparent focus:border-primary-300"
            />
            <button className="bg-[#2c1f0e] hover:bg-[#3d2c1a] text-white font-bold px-6 py-3 rounded-r-md text-sm uppercase tracking-wide transition-colors whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="bg-[#2c1f0e] text-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-14">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center text-white font-display font-bold text-lg">S</div>
                <div>
                  <div className="font-display text-xl font-bold leading-none">SEHATFULL</div>
                  <div className="text-[10px] tracking-widest text-primary-300 uppercase">Healthy Supplements</div>
                </div>
              </div>
              <p className="text-secondary-300 text-sm leading-relaxed mb-5">
                Quality health supplements and nutritious products for your wellness journey.
              </p>
              <div className="flex gap-3">
                <a href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary-500 transition-colors">
                  <Facebook size={16} />
                </a>
                <a href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary-500 transition-colors">
                  <Instagram size={16} />
                </a>
                <a href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary-500 transition-colors">
                  <Youtube size={16} />
                </a>
              </div>
            </div>

            {/* Collections */}
            <div>
              <h3 className="font-body font-bold text-sm uppercase tracking-widest text-primary-300 mb-5">Our Products</h3>
              <ul className="space-y-2.5">
                {[
                  { label: 'Vitamins & Minerals', href: '/shop?category=vitamins' },
                  { label: 'Protein Supplements', href: '/shop?category=protein' },
                  { label: 'Natural Herbs', href: '/shop?category=herbs' },
                  { label: 'Energy Boosters', href: '/shop?category=energy' },
                  { label: 'Wellness Bundles', href: '/shop?category=bundles' },
                  { label: 'New Arrivals', href: '/shop?sort=newest' },
                ].map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-secondary-300 hover:text-primary-300 text-sm transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-body font-bold text-sm uppercase tracking-widest text-primary-300 mb-5">Customer Care</h3>
              <ul className="space-y-2.5">
                {[
                  { label: 'About Us', href: '/about' },
                  { label: 'Blog', href: '/blog' },
                  { label: 'Track Order', href: '/track-order' },
                  { label: 'Contact Us', href: '/contact' },
                  { label: 'Shipping Policy', href: '/shipping' },
                  { label: 'Returns & Refunds', href: '/returns' },
                  { label: 'FAQ', href: '/faq' },
                ].map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-secondary-300 hover:text-primary-300 text-sm transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-body font-bold text-sm uppercase tracking-widest text-primary-300 mb-5">Get In Touch</h3>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <Mail size={16} className="text-primary-400 mt-0.5 flex-shrink-0" />
                  <a href="mailto:founder@sehatfull.in" className="text-secondary-300 hover:text-primary-300 text-sm transition-colors">
                    founder@sehatfull.in
                  </a>
                </li>
                <li className="flex gap-3">
                  <Phone size={16} className="text-primary-400 mt-0.5 flex-shrink-0" />
                  <span className="text-secondary-300 text-sm">+91 XXX XXX XXXX</span>
                </li>
                <li className="flex gap-3">
                  <MapPin size={16} className="text-primary-400 mt-0.5 flex-shrink-0" />
                  <span className="text-secondary-300 text-sm leading-relaxed">
                    We Work Forum, 16A Cybercity,<br />9th Floor, Phase III,<br />Gurugram, HR 122002
                  </span>
                </li>
              </ul>
 
              {/* Trust badges */}
              <div className="mt-6 grid grid-cols-2 gap-2">
                {['🔒 Secure Pay', '🚚 Fast Ship', '✅ 100% Natural', '↩️ Easy Returns'].map((badge) => (
                  <div key={badge} className="text-[11px] text-secondary-400 bg-white/5 rounded px-2 py-1.5 text-center">
                    {badge}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 w-full">
          <div className="max-w-7xl mx-auto px-4 lg:px-8 py-5 flex flex-col md:flex-row items-center justify-between gap-3 w-full">
            <p className="text-secondary-500 text-xs">
              © {new Date().getFullYear()} SEHATFULL FOODS. All rights reserved.
            </p>
            <div className="flex gap-5 text-xs text-secondary-500">
              <Link href="/privacy" className="hover:text-primary-400 transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-primary-400 transition-colors">Terms of Use</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
