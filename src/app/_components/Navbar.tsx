"use client";

import type { Session } from "next-auth";
import { signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggleButton from "./LightDarkToggle";

interface NavbarProps {
  session?: Session | null;
}

const links = [
  { href: "/", label: "Home" },
  { href: "/forum", label: "Forum" },
  { href: "/profile", label: "Profile" },
];

const Navbar: React.FC<NavbarProps> = ({ session }) => {
  const pathname = usePathname() || "/";

  const isActive = (href: string) => {
    // exact match or prefix match if you want /profile/settings to still mark /profile
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <div className="navbar bg-base-100 text-accent-foreground sticky top-0 z-20 shadow-md transition-colors">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost md:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content rounded-box text-accent-foreground z-30 mt-4 w-52 space-y-2 bg-white p-2 shadow"
          >
            {links.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={
                    isActive(href)
                      ? "decoration-accent font-semibold text-black underline"
                      : ""
                  }
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <Link href="/" className="btn btn-ghost text-xl">
          CampusConnect
        </Link>
      </div>
      <div className="navbar-center text-accent hidden md:flex">
        <ul className="menu menu-horizontal text-accent-foreground px-1">
          {links.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className={
                  isActive(href)
                    ? "decoration-accent font-semibold underline"
                    : ""
                }
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="navbar-end flex items-center gap-2">
        {session?.user ? (
          <button className="btn" onClick={() => signOut()}>
            Sign Out
          </button>
        ) : (
          <button className="btn" onClick={() => signIn()}>
            Sign In/Up
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
