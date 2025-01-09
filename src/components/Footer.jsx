import React from 'react';
import { FaInstagram } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white">
      <div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
        {/* Main Footer Content */}
        <div className="block lg:flex lg:justify-between lg:items-start">
          {/* Logo Section */}
          <div className="flex justify-center lg:justify-start mb-12 lg:mb-0 lg:mr-64">
            <Link to="/">
              <img src="/mainLogo.png" className="h-16 lg:h-20" alt="Paeles Logo" />
            </Link>
          </div>

          {/* Desktop: Right side sections */}
          <div className="hidden lg:flex justify-between gap-32 flex-1">
            {/* Company Section */}
            <div>
              <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase">Company</h2>
              <ul className="text-gray-500 font-medium space-y-4">
                <li><Link to="/about" className="hover:underline whitespace-nowrap">About Us</Link></li>
                <li><Link to="/contact" className="hover:underline">Contact</Link></li>
              </ul>
            </div>

            {/* Legal Section */}
            <div>
              <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase">Legal</h2>
              <ul className="text-gray-500 font-medium space-y-4">
                <li><Link to="/privacy-policy" className="hover:underline">Privacy Policy</Link></li>
                <li><Link to="/shipping-policy" className="hover:underline">Shipping Policy</Link></li>
                <li><Link to="/terms-and-conditions" className="hover:underline">Terms & Conditions</Link></li>
                <li><Link to="/exchange-policy" className="hover:underline">Exchange Policy</Link></li>
              </ul>
            </div>

            {/* Connect Section */}
            <div>
              <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase">Connect</h2>
              <ul className="text-gray-500 font-medium space-y-4">
                <li>
                  <a href="https://www.instagram.com/paeless_/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline flex items-center">
                    <FaInstagram className="w-4 h-4 mr-2" />
                    Instagram
                  </a>
                </li>
                <li>
                  <a href="mailto:contact@paeles.com"
                    className="hover:underline flex items-center">
                    <MdEmail className="w-4 h-4 mr-2" />
                    Email
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Mobile: Stacked sections */}
          <div className="lg:hidden text-center space-y-8">
            {/* Company Section */}
            <div>
              <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase">Company</h2>
              <div className="text-gray-500 space-y-4">
                <div><Link to="/about" className="hover:underline">About Us</Link></div>
                <div><Link to="/contact" className="hover:underline">Contact</Link></div>
              </div>
            </div>

            {/* Legal Section */}
            <div>
              <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase">Legal</h2>
              <div className="text-gray-500 space-y-4">
                <div><Link to="/privacy-policy" className="hover:underline">Privacy Policy</Link></div>
                <div><Link to="/shipping-policy" className="hover:underline">Shipping Policy</Link></div>
                <div><Link to="/terms-and-conditions" className="hover:underline">Terms & Conditions</Link></div>
                <div><Link to="/exchange-policy" className="hover:underline">Exchange Policy</Link></div>
              </div>
            </div>

            {/* Connect Section */}
            <div>
              <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase">Connect</h2>
              <div className="text-gray-500 space-y-4">
                <div>
                  <a href="https://www.instagram.com/paeless_/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline inline-flex items-center justify-center">
                    <FaInstagram className="w-4 h-4 mr-2" />
                    Instagram
                  </a>
                </div>
                <div>
                  <a href="mailto:contact@paeles.com"
                    className="hover:underline inline-flex items-center justify-center">
                    <MdEmail className="w-4 h-4 mr-2" />
                    Email
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <hr className="my-8 border-gray-200" />

        {/* Copyright Section */}
        <div className="text-center">
          <span className="text-sm text-gray-500">
            © 2024-25 Paeles. All Rights Reserved.
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
