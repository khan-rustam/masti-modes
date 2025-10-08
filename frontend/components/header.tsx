"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { LogOut, Search, Grid3X3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authApi } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

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
    { href: "/browse", label: "Browse" },
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact" },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/browse?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery(""); // Clear search after navigation
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out">
      <div
        className={`mx-auto transition-all duration-500 px-10 ease-out ${isScrolled
          ? "mt-4 px-10 w-[85%] md:w-[80%] rounded-xl bg-white/90 backdrop-blur-md shadow-2xl shadow-blue-500/10 border border-blue-100/50"
          : "w-full bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600"
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
            <div className="flex items-center gap-2">
              <span className={`text-2xl font-bold transition-colors duration-300 ${isScrolled ? "text-blue-600" : "text-white"}`}>
                MASTI
              </span>
              <span className={`text-2xl font-bold transition-colors duration-300 ${isScrolled ? "text-orange-500" : "text-orange-300"}`}>
                MODE
              </span>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm uppercase font-semibold transition-all duration-300 hover:text-orange-400 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-orange-400 after:transition-all after:duration-300 hover:after:w-full ${isScrolled ? "text-slate-700 hover:text-orange-500" : "text-white hover:text-orange-300"
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <form onSubmit={handleSearch} className="relative hidden sm:block">
              <Search
                className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors duration-300 ${isScrolled ? "text-gray-400" : "text-white/70"
                  }`}
              />
              <Input
                type="search"
                placeholder="Search software..."
                value={searchQuery}
                onChange={handleSearchChange}
                className={`w-[160px] pl-10 lg:w-[200px] transition-all duration-300 ${isScrolled 
                  ? "bg-white border-gray-200 text-gray-900 placeholder:text-gray-500 focus:border-blue-500" 
                  : "bg-white/20 backdrop-blur-md border-white/30 focus:border-white/50 text-white placeholder:text-white/60"
                }`}
              />
            </form>
            {isAdmin && (
              <Link href="/admin" className="hidden sm:block">
                <Button className={`transition-all duration-300 ${isScrolled 
                  ? "bg-blue-600 hover:bg-blue-700 text-white border-blue-600" 
                  : "bg-white/20 hover:bg-white/30 text-white border-white/30"
                } rounded-md cursor-pointer`}>
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
                className={`transition-all duration-300 ${isScrolled 
                  ? "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200" 
                  : "bg-white/20 hover:bg-white/30 text-white border-white/30"
                } cursor-pointer`}
              >
                <LogOut className="h-5 w-5" />
              </Button>
            )}
            <Button
              size="icon"
              variant="ghost"
              onClick={() => {
                const searchTerm = prompt("Search software:");
                if (searchTerm && searchTerm.trim()) {
                  router.push(`/browse?search=${encodeURIComponent(searchTerm.trim())}`);
                }
              }}
              className={`sm:hidden transition-all duration-300 ${isScrolled
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
