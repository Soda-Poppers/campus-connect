"use client";

import Image from "next/image";

// import type { Session } from "next-auth";
// import { signIn, signOut } from "next-auth/react";
// import Link from "next/link";

// interface NavbarProps {
//   session?: Session | null;
// }

// const Navbar: React.FC<NavbarProps> = ({ session }) => {
//   return (
//     <div className="navbar shadow-sm">
//       <div className="navbar-start">
//         <div className="dropdown">
//           <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-5 w-5"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               {" "}
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="2"
//                 d="M4 6h16M4 12h8m-8 6h16"
//               />{" "}
//             </svg>
//           </div>
//           <ul
//             tabIndex={0}
//             className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
//           >
//             <li>
//               <a>Home</a>
//             </li>
//             <li>
//               <a>Forum</a>
//             </li>

//             <li>
//               <Link href="/profile">Profile</Link>
//             </li>
//           </ul>
//         </div>
//         <a className="btn btn-ghost text-xl">CampusConnect</a>
//       </div>
//       <div className="navbar-center hidden lg:flex">
//         <ul className="menu menu-horizontal px-1">
//           <li>
//             <a>Home</a>
//           </li>
//           <li>
//             <a>Forum</a>
//           </li>

//           <li>
//             <Link href="/profile">Profile</Link>
//           </li>
//         </ul>
//       </div>
//       <div className="navbar-end">
//         {session?.user ? (
//           <a className="btn" onClick={() => signOut()}>
//             Sign Out
//           </a>
//         ) : (
//           <a className="btn" onClick={() => signIn()}>
//             Sign In/Up
//           </a>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Navbar;


import type { Session } from "next-auth";
import { signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { Menu, X, User, Home, MessageSquare, LogOut, LogIn } from "lucide-react";

interface NavbarProps {
  session?: Session | null;
}

const Navbar: React.FC<NavbarProps> = ({ session }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#151b4d] to-[#8a704d] flex items-center justify-center transform group-hover:scale-105 transition-transform duration-200">
                <Image
                  src="/images/CCSquare.jpeg"
                  alt="CampusConnect Logo"
                  width={100}
                  height={100}
                  priority
                />
              </div>

              <span className="text-xl font-bold bg-gradient-to-r from-[#151b4d] to-[#8a704d] bg-clip-text text-transparent">
                CampusConnect
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Link
              href="/"
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-700 hover:text-[#151b4d] hover:bg-gray-50 transition-all duration-200 group"
            >
              <Home className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
              <span className="font-medium">Home</span>
            </Link>

            {session?.user && (
              <Link
                href="/profile"
                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-700 hover:text-[#151b4d] hover:bg-gray-50 transition-all duration-200 group"
              >
                <User className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                <span className="font-medium">Profile</span>
              </Link>
            )}
          </div>

          {/* Desktop Auth Button */}
          <div className="hidden md:flex items-center space-x-4">
            {session?.user ? (
              <div className="flex items-center space-x-3">
                {session.user.image && (
                  <img
                    src={session.user.image}
                    alt="Profile"
                    className="w-8 h-8 rounded-full border-2 border-[#8a704d]/20"
                  />
                )}
                <span className="text-sm text-gray-600 hidden lg:block">
                  {session.user.name}
                </span>
                <button
                  onClick={() => signOut()}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-[#151b4d] to-[#8a704d] text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="font-medium">Sign Out</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => signIn()}
                className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-[#151b4d] to-[#8a704d] text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                <LogIn className="w-4 h-4" />
                <span className="font-medium">Sign In</span>
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-lg text-gray-600 hover:text-[#151b4d] hover:bg-gray-50 transition-all duration-200"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen
          ? 'max-h-96 opacity-100 pb-4'
          : 'max-h-0 opacity-0 overflow-hidden'
          }`}>
          <div className="pt-4 space-y-2">
            <Link
              href="/"
              onClick={closeMobileMenu}
              className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:text-[#151b4d] hover:bg-gray-50 transition-all duration-200"
            >
              <Home className="w-5 h-5" />
              <span className="font-medium">Home</span>
            </Link>

            {session?.user && (
              <Link
                href="/profile"
                onClick={closeMobileMenu}
                className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:text-[#151b4d] hover:bg-gray-50 transition-all duration-200"
              >
                <User className="w-5 h-5" />
                <span className="font-medium">Profile</span>
              </Link>
            )}

            {/* Mobile Auth Section */}
            <div className="">
              {session?.user ? (
                <div className="space-y-3">
                  {session.user.image && (
                    <div className="flex items-center space-x-3 px-4">
                      <img
                        src={session.user.image}
                        alt="Profile"
                        className="w-10 h-10 rounded-full border-2 border-[#8a704d]/20"
                      />
                      <div>
                        <p className="font-medium text-gray-900">{session.user.name}</p>
                        <p className="text-sm text-gray-500">{session.user.email}</p>
                      </div>
                    </div>
                  )}
                  <button
                    onClick={async () => {
                      await signOut();
                      closeMobileMenu();
                    }}
                    className="flex items-center space-x-3 w-full px-4 py-3 bg-gradient-to-r from-[#151b4d] to-[#8a704d] text-white rounded-lg hover:shadow-lg transition-all duration-200"
                  >

                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Sign Out</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={async () => {
                    await signIn();
                    closeMobileMenu();
                  }}
                  className="flex items-center space-x-3 w-full px-4 py-3 bg-gradient-to-r from-[#151b4d] to-[#8a704d] text-white rounded-lg hover:shadow-lg transition-all duration-200"
                >
                  <LogIn className="w-5 h-5" />
                  <span className="font-medium">Sign In / Log In</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

