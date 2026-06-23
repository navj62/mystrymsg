'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Autoplay from 'embla-carousel-autoplay';
import messages from '@/messages.json';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen w-full bg-black bg-grid-white/[0.1] relative">
        {/* Adds a radial gradient for a glowing effect from the top */}
        <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
        
        {/* Main content */}
        <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-20 text-white relative z-10">
          <section className="text-center mb-16 max-w-4xl">
            <motion.h1
              className="text-4xl md:text-6xl lg:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 pb-2"
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, type: 'spring', stiffness: 120 }}
            >
              Dive into the World of Anonymous Feedback
            </motion.h1>
            <motion.p
              className="mt-6 text-base md:text-lg text-neutral-300 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              True Feedback – Where your identity remains a secret.
            </motion.p>
          </section>

          {/* Carousel for Messages */}
          <Carousel
            plugins={[Autoplay({ delay: 3000, stopOnInteraction: true })]}
            className="w-full max-w-lg md:max-w-3xl"
          >
            <CarouselContent>
              {messages.map((message, index) => (
                <CarouselItem key={index} className="p-4">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card className="bg-black/40 backdrop-blur-sm border border-white/10 shadow-lg rounded-2xl hover:border-white/20 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-blue-900/50">
                      <CardHeader>
                        <CardTitle className="text-xl font-medium text-neutral-100">
                          {message.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="flex flex-col md:flex-row items-start space-y-3 md:space-y-0 md:space-x-4">
                        <Mail className="w-6 h-6 text-blue-400 flex-shrink-0" />
                        <div>
                          <p className="text-neutral-200">{message.content}</p>
                          <p className="text-xs text-neutral-400 mt-3 font-mono">
                            {message.received}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
            {/* Carousel Controls are hidden for a cleaner look, but you can add them back if you prefer */}
            {/* <div className="flex justify-center mt-6 space-x-4">
              <CarouselPrevious className="bg-black/50 border-white/20 hover:bg-white/10 text-white rounded-full p-2" />
              <CarouselNext className="bg-black/50 border-white/20 hover:bg-white/10 text-white rounded-full p-2" />
            </div> 
            */}
          </Carousel>

          {/* CTA */}
          <motion.div
            className="mt-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <Button
              className="px-8 py-6 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg shadow-lg hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105"
              asChild
            >
              <Link href="/send-feedback">Start Sharing Feedback</Link>
            </Button>
          </motion.div>
        </main>
      </div>

      {/* Footer */}
      <footer className="text-center p-6 bg-black text-neutral-400 text-sm border-t border-white/10">
        © {new Date().getFullYear()} True Feedback. All rights reserved.
      </footer>
    </>
  );
}