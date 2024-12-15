import React from 'react';
import { FaInstagram } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

const Footer = () => {
  return (
    <footer className="bg-[#f8f6f3] shadow-md border-t border-[#eae7e1] m-4">
      <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <a href="/about" className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse">
            <img src="/mainLogo.png" className="h-12" alt="Paeles Logo" />
          </a>
          <div className="flex mt-4 sm:mt-0 justify-start pl-[18px] sm:pl-0 sm:justify-center">
            <a
              href="https://instagram.com/paeles"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 hover:text-pink-600 transition-colors duration-300"
            >
              <FaInstagram className="w-5 h-5" />
              <span className="sr-only">Instagram page</span>
            </a>
            <a
              href="mailto:contact@paeles.com"
              className="text-gray-700 hover:text-red-500 transition-colors duration-300 ms-5"
            >
              <MdEmail className="w-5 h-5" />
              <span className="sr-only">Email us</span>
            </a>
          </div>
        </div>
        <hr className="my-6 border-[#eae7e1] sm:mx-auto lg:my-8" />
        <span className="block text-sm text-gray-600 sm:text-center">
          © 2024-25 <a href="/about" className="hover:underline">Paeles</a>. All Rights Reserved.
        </span>
      </div>
    </footer>
  );
};

export default Footer;
