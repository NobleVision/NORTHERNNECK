'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface JRGrahamLayoutProps {
  children: React.ReactNode
  currentPage?: string
}

export default function JRGrahamLayout({ children, currentPage = 'booking' }: JRGrahamLayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navigationItems = [
    { name: 'Home', href: '/home', external: false, current: currentPage === 'home' },
    { name: 'About', href: '/about', external: false, current: currentPage === 'about' },
    { name: 'Availability', href: '/availability', external: false, current: currentPage === 'availability' },
    { name: 'Space Rentals', href: '/booking', external: false, current: currentPage === 'booking' },
    { name: 'Northern Neck Baptist Association', href: '/nnba', external: true, url: 'https://www.nnbaptist.org' },
    { name: 'Contact', href: '/contact', external: false, current: currentPage === 'contact' }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header Navigation - Matching JR Graham Center Design */}
      <header className="bg-white border-b-4 border-purple-600">
        <div className="max-w-7xl mx-auto">
          {/* Top Navigation Bar */}
          <nav className="bg-gradient-to-r from-purple-600 to-purple-700 px-4 py-2">
            <div className="flex items-center justify-between">
              {/* Logo/Brand */}
              <div className="flex items-center">
                <Link 
                  href="https://jrgrahamcenter.org/" 
                  className="bg-green-500 text-white px-4 py-2 rounded text-lg font-bold hover:bg-green-600 transition-colors"
                >
                  JRGraham Center
                </Link>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-1">
                {navigationItems.map((item) => (
                  <div key={item.name}>
                    {item.external ? (
                      <a
                        href={item.url || item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`px-4 py-2 text-sm font-medium rounded transition-colors ${
                          item.current
                            ? 'bg-white text-purple-700'
                            : 'text-white hover:bg-purple-500'
                        }`}
                      >
                        {item.name}
                      </a>
                    ) : (
                      <Link
                        href={item.href}
                        className={`px-4 py-2 text-sm font-medium rounded transition-colors ${
                          item.current
                            ? 'bg-white text-purple-700'
                            : 'text-white hover:bg-purple-500'
                        }`}
                      >
                        {item.name}
                      </Link>
                    )}
                  </div>
                ))}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden text-white hover:text-gray-200 focus:outline-none"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>

            {/* Mobile Navigation Menu */}
            {isMenuOpen && (
              <div className="md:hidden mt-2 pb-2">
                <div className="flex flex-col space-y-1">
                  {navigationItems.map((item) => (
                    <div key={item.name}>
                      {item.external ? (
                        <a
                          href={item.url || item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`block px-4 py-2 text-sm font-medium rounded transition-colors ${
                            item.current
                              ? 'bg-white text-purple-700'
                              : 'text-white hover:bg-purple-500'
                          }`}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {item.name}
                        </a>
                      ) : (
                        <Link
                          href={item.href}
                          className={`block px-4 py-2 text-sm font-medium rounded transition-colors ${
                            item.current
                              ? 'bg-white text-purple-700'
                              : 'text-white hover:bg-purple-500'
                          }`}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {item.name}
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer - Matching JR Graham Center Style */}
      <footer className="bg-gray-100 border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Contact Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Joseph R. Graham Center</h3>
              <div className="text-gray-600 space-y-2">
                <p>3989 White Chapel Road</p>
                <p>Lively, VA 22507</p>
                <p className="mt-4">Monthly Fellowship Events for NNBA</p>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>
              <div className="space-y-2">
                <a href="https://jrgrahamcenter.org/" className="block text-gray-600 hover:text-purple-600 transition-colors">
                  Main Website
                </a>
                <a href="https://jrgrahamcenter.org/availability" className="block text-gray-600 hover:text-purple-600 transition-colors">
                  Check Availability
                </a>
                <a href="https://jrgrahamcenter.org/contact" className="block text-gray-600 hover:text-purple-600 transition-colors">
                  Contact Us
                </a>
              </div>
            </div>

            {/* Northern Neck Baptist Association */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Northern Neck Baptist Association</h3>
              <div className="text-gray-600 space-y-2">
                <p>Supporting Baptist churches in the Northern Neck region</p>
                <a 
                  href="https://nnbaptist.org" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block bg-yellow-400 text-black px-4 py-2 rounded font-medium hover:bg-yellow-500 transition-colors mt-2"
                >
                  NNBAPTIST.ORG
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="border-t border-gray-200 mt-8 pt-6 text-center text-gray-500">
            <p>&copy; 2024 Joseph R. Graham Center. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
