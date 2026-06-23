'use client';

import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const { data: session } = useSession();

  const fadeIn = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: 10, transition: { duration: 0.3 } },
  };

  return (
    <nav className="sticky top-0 z-50 py-3 px-4 md:px-6 bg-black/50 backdrop-blur-xl border-b border-neutral-800 font-sans">
      <div className="mx-auto max-w-7xl flex items-center justify-between">
        {/* Brand */}
        <Link
          href="/"
          className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 hover:from-white hover:to-gray-300 transition-all"
        >
          True Feedback
        </Link>

        {/* Right section */}
        <div className="flex items-center gap-4">
          <AnimatePresence mode="wait" initial={false}>
            {session ? (
              <motion.div
                key="user-session"
                variants={fadeIn}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="flex items-center gap-4"
              >
                <span className="hidden sm:inline text-sm text-neutral-300 font-mono">
                  Welcome, {session.user?.name ?? session.user?.email}
                </span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => signOut({ callbackUrl: '/sign-in' })}
                  className="border border-neutral-700 bg-neutral-900/50 text-neutral-300 hover:bg-neutral-800 hover:text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Logout
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                key="guest-session"
                variants={fadeIn}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="flex items-center gap-4"
              >
                <Link href="/sign-in">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="border border-transparent text-neutral-300 hover:text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Login
                  </motion.button>
                </Link>
                <Link href="/sign-up">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold px-4 py-2 rounded-lg shadow-lg transition-shadow"
                  >
                    Sign Up
                  </motion.button>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
}
