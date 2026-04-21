"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Search, Globe, User } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Home", slug: "/" },
    { name: "Categories", slug: "/categories" },
    { name: "Articles", slug: "/articles" },
    { name: "About", slug: "/about" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full glass-panel">
      <div className="mobile-container">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold tracking-tight text-blue-600 sm:text-2xl">
              Tumakuru<span className="text-slate-900">Connect</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.slug}
                className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
              >
                {link.name}
              </Link>
            ))}
            <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-all">
              <Globe size={20} />
            </button>
            <Link href="/login" className="btn-primary py-2 px-5">
              Login
            </Link>
          </div>

          {/* Mobile Right Icons */}
          <div className="flex items-center md:hidden space-x-4">
            <button className="p-2 text-slate-600">
              <Search size={22} />
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-slate-900 focus:outline-none"
            >
              {isOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white border-b border-slate-200 animate-in slide-in-from-top duration-300">
          <div className="px-4 pt-2 pb-6 space-y-2 shadow-xl">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.slug}
                onClick={() => setIsOpen(false)}
                className="block px-3 py-4 text-base font-semibold text-slate-700 border-b border-slate-50 hover:bg-slate-50"
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4 flex items-center justify-between px-3">
              <button className="flex items-center space-x-2 text-slate-600 font-medium">
                <Globe size={20} />
                <span>ಕನ್ನಡ / English</span>
              </button>
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="btn-primary w-1/2"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;