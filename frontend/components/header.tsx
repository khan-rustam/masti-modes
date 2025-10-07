"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { LogOut, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authApi } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    let mounted = true;
    authApi
      .me()
      .then((res) => {
        if (!mounted) return;
        if (res?.ok) {
          setIsAuthed(true);
          if ((res as any).user?.isAdmin) setIsAdmin(true);
        }
      })
      .catch(() => { });
    return () => {
      mounted = false;
    };
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out">
      <div
        className={`mx-auto transition-all duration-500 px-10 ease-out ${isScrolled
          ? "mt-4 px-10 w-[85%] md:w-[80%] rounded-xl bg-black/10 backdrop-blur-md shadow-2xl shadow-blue-500/10 border border-blue-100/50"
          : "w-full bg-transparent"
          }`}
      >
        <div
          className="container mx-auto flex items-center justify-between transition-all duration-500 ease-out"
          style={{ height: isScrolled ? "50px" : "80px" }}
        >
          <Link
            href="/"
            className="flex items-center gap-3 transition-transform duration-300 hover:scale-105"
          >
            <Image
              src={isScrolled ? "/logo/logo-light.png" : "/logo/logo-light.png"}
              alt="Masti Mode"
              width={140}
              height={26}
              className="h-10 w-auto"
              priority
            />
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm uppercase font-semibold transition-all duration-300 hover:text-[#ffa500] relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-[#ffa500] after:transition-all after:duration-300 hover:after:w-full ${isScrolled ? "text-black" : "text-white"
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <div className="relative hidden sm:block">
              <Search
                className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors duration-300 ${isScrolled ? "text-gray-400" : "text-white/70"
                  }`}
              />
              <Input
                type="search"
                placeholder="Search software..."
                className={`w-[160px] pl-10 lg:w-[200px] transition-all duration-300 bg-white/10 backdrop-blur-md border-white/30 focus:border-white/50 text-white placeholder:text-white/60`}
              />
            </div>
            {isAdmin && (
              <Link href="/admin" className="hidden sm:block">
                <Button className={"bg-white/20 hover:bg-white/30 text-black border-black rounded-xs cursor-pointer"}>
                  Admin
                </Button>
              </Link>
            )}
            {isAuthed && (
              <Button
                onClick={async () => {
                  try {
                    await authApi.logout();
                    setIsAuthed(false);
                    setIsAdmin(false);
                    toast({ title: "Signed out" });
                    window.location.href = "/";
                  } catch { }
                }}
                className={"bg-white/20 hover:bg-white/30 text-black border-white/30 cursor-pointer"}
              >
                <LogOut className="h-5 w-5" />
              </Button>
            )}
            <Button
              size="icon"
              variant="ghost"
              className={`sm:hidden transition-colors duration-300 ${isScrolled
                ? "hover:bg-blue-50 hover:text-blue-600 text-gray-700"
                : "hover:bg-white/20 text-white"
                }`}
            >
              <Search className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
