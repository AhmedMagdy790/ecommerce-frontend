import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-zinc-50 border-t border-zinc-200 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
        {/* Brand Column */}
        <div className="col-span-2 md:col-span-1">
          <a href="/" className="text-xl font-bold tracking-tighter text-zinc-900 block mb-4">
            AURA.
          </a>
          <p className="text-sm text-zinc-500 leading-relaxed">
            Elevating everyday essentials with timeless design and uncompromising quality.
          </p>
        </div>

        {/* Links Columns */}
        <div>
          <h4 className="font-semibold text-zinc-900 mb-4">Shop</h4>
          <ul className="space-y-3 text-sm text-zinc-600">
            <li><a href="#" className="hover:text-zinc-900 transition-colors">New Arrivals</a></li>
            <li><a href="#" className="hover:text-zinc-900 transition-colors">Best Sellers</a></li>
            <li><a href="#" className="hover:text-zinc-900 transition-colors">Accessories</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-zinc-900 mb-4">Support</h4>
          <ul className="space-y-3 text-sm text-zinc-600">
            <li><a href="#" className="hover:text-zinc-900 transition-colors">Contact Us</a></li>
            <li><a href="#" className="hover:text-zinc-900 transition-colors">Shipping Policy</a></li>
            <li><a href="#" className="hover:text-zinc-900 transition-colors">Returns</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-zinc-900 mb-4">Legal</h4>
          <ul className="space-y-3 text-sm text-zinc-600">
            <li><a href="#" className="hover:text-zinc-900 transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-zinc-900 transition-colors">Terms of Service</a></li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-zinc-200 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-xs text-zinc-400">© 2026 AURA Store. All rights reserved.</p>
        <div className="flex gap-6 text-xs text-zinc-500">
          <span>Instagram</span>
          <span>Twitter</span>
          <span>LinkedIn</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;