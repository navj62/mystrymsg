'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { signIn } from 'next-auth/react';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { signInSchema } from '@/schemas/signInSchema';
import { motion } from 'framer-motion';

export default function SignInForm() {
  const router = useRouter();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: '',
      password: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    const result = await signIn('credentials', {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    });

    if (result?.error) {
      if (result.error === 'CredentialsSignin') {
        toast.error('Incorrect username or password');
      } else {
        toast.error('An unexpected error occurred');
      }
    }

    if (result?.url) {
      toast.success('Signed in successfully!');
      router.replace('/dashboard');
    }
  };

  return (
    <div className="min-h-screen w-full flex justify-center items-center bg-black bg-grid-white/[0.1] relative">
      {/* Adds a radial gradient for a glowing effect */}
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      
      <div className="w-full max-w-md p-8 space-y-8 bg-black/60 backdrop-blur-xl border border-neutral-800 rounded-2xl shadow-2xl z-10">
        {/* Heading */}
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 mb-4">
            Welcome Back 👋
          </h1>
          <p className="text-neutral-400">
            Sign in to continue your <span className="font-semibold text-neutral-300">True Feedback</span> journey
          </p>
        </div>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-neutral-400">Email / Username</FormLabel>
                  <Input
                    {...field}
                    placeholder="your.email@example.com"
                    className="mt-1 block w-full rounded-lg bg-neutral-900/50 border-neutral-700 text-neutral-200 placeholder:text-neutral-600 focus:border-purple-500 focus:ring focus:ring-purple-500/50 transition-colors"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-neutral-400">Password</FormLabel>
                  <Input
                    type="password"
                    {...field}
                    placeholder="••••••••"
                    className="mt-1 block w-full rounded-lg bg-neutral-900/50 border-neutral-700 text-neutral-200 placeholder:text-neutral-600 focus:border-purple-500 focus:ring focus:ring-purple-500/50 transition-colors"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                className="w-full py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold shadow-lg hover:shadow-purple-500/40 transition-shadow"
                type="submit"
              >
                Sign In
              </Button>
            </motion.div>
          </form>
        </Form>

        {/* Footer */}
        <div className="text-center mt-4 text-neutral-400">
          <p>
            Not a member yet?{' '}
            <Link href="/sign-up" className="text-indigo-400 font-medium hover:underline hover:text-indigo-300 transition-colors">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
