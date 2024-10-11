"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaBuilding, FaSignInAlt, FaSignOutAlt, FaUser } from "react-icons/fa";
import { toast } from "react-toastify";

import checkAuth from "@/app/actions/checkAuth";
import destroySession from "@/app/actions/destroySession";
import logo from "@/assets/images/logo.svg";

const Header = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogout = async () => {
    try {
      const { success, error } = await destroySession();

      if (success) {
        router.push("/login");
      } else {
        toast.error(error);
      }
    } catch (error) {
      console.error("Failed to logout", error);
      toast.error("Failed to logout");
    }
  };

  useEffect(() => {
    const fetchAuthStatus = async () => {
      const { isAuthenticated } = await checkAuth();
      setIsAuthenticated(isAuthenticated);
    };

    fetchAuthStatus();
  }, []);

  return (
    <header className="bg-gray-100">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/">
              <Image src={logo} alt="Bookit" className="h-12 w-12" priority />
            </Link>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link
                  href="/"
                  className="rounded-md px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-700 hover:text-white"
                >
                  Rooms
                </Link>
                {/* Logged In Only */}
                {isAuthenticated && (
                  <>
                    <Link
                      href="/bookings"
                      className="rounded-md px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-700 hover:text-white"
                    >
                      Bookings
                    </Link>
                    <Link
                      href="/rooms/add"
                      className="rounded-md px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-700 hover:text-white"
                    >
                      Add Room
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right Side Menu */}
          <div className="ml-auto">
            <div className="ml-4 flex items-center md:ml-6">
              {/* Logout only */}
              {!isAuthenticated && (
                <>
                  <Link
                    href="/login"
                    className="mr-3 text-gray-800 hover:text-gray-600"
                  >
                    <FaSignInAlt className="inline mr-1" /> Login
                  </Link>
                  <Link
                    href="/register"
                    className="mr-3 text-gray-800 hover:text-gray-600"
                  >
                    <FaUser className="inline mr-1" /> Register
                  </Link>
                </>
              )}

              {/* Logged In Only */}
              {isAuthenticated && (
                <>
                  <Link href="/rooms/my">
                    <FaBuilding className="inline mr-1" /> My Rooms
                  </Link>
                  <button
                    className="mx-3 text-gray-800 hover:text-gray-600"
                    onClick={handleLogout}
                  >
                    <FaSignOutAlt className="inline mr-1" /> Sign Out
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className="md:hidden">
        <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
          <Link
            href="/"
            className="block rounded-md px-3 py-2 text-base font-medium text-gray-800 hover:bg-gray-700 hover:text-white"
          >
            Rooms
          </Link>
          {/* Logged In Only */}
          <Link
            href="/bookings"
            className="block rounded-md px-3 py-2 text-base font-medium text-gray-800 hover:bg-gray-700 hover:text-white"
          >
            Bookings
          </Link>
          <Link
            href="/rooms/add"
            className="block rounded-md px-3 py-2 text-base font-medium text-gray-800 hover:bg-gray-700 hover:text-white"
          >
            Add Room
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
