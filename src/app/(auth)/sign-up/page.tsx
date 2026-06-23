'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import Link from 'next/link';
import axios, { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { useDebounceCallback } from 'usehooks-ts';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { signUpSchema } from '@/schemas/signUpSchema';
import { ApiResponse } from '@/types/ApiResponse';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';

const Page = () => {
  const [username, setUsername] = useState('');
  const [usernameMsg, setUsernameMsg] = useState('');
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const debounced = useDebounceCallback(setUsername, 300);
  const router = useRouter();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (username) {
        setIsCheckingUsername(true);
        setUsernameMsg('');
        try {
          const response = await axios.get(
            `/api/check-username-unique?username=${username}`
          );
          setUsernameMsg(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMsg(
            axiosError.response?.data.message ?? 'Error checking username'
          );
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };
    checkUsernameUnique();
  }, [username]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post('/api/sign-up', data);
      toast.success(response.data.message);
      router.replace(`/verify/${data.username}`);
    } catch (error) {
      console.error('Error in signup user', error);
      const axiosError = error as AxiosError<ApiResponse>;
      let errmsg = axiosError.response?.data?.message || 'Signup failed';
      toast.error(errmsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex justify-center items-center bg-black bg-grid-white/[0.1] relative px-4">
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      
      <div className="w-full max-w-md p-8 space-y-8 bg-black/60 backdrop-blur-xl border border-neutral-800 rounded-2xl shadow-2xl z-10">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 mb-4">
            Create Your Account
          </h1>
          <p className="text-neutral-400">
            Join <span className="font-semibold text-neutral-300">True Feedback</span> and start sharing anonymously.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-neutral-400">Choose a Username</FormLabel>
                  <Input
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      debounced(e.target.value);
                    }}
                    placeholder="e.g., anonymous_user"
                    className="mt-1 block w-full rounded-lg bg-neutral-900/50 border-neutral-700 text-neutral-200 placeholder:text-neutral-600 focus:border-purple-500 focus:ring focus:ring-purple-500/50 transition-colors"
                  />
                  {isCheckingUsername && (
                    <p className="text-sm text-neutral-500 flex items-center pt-1">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Checking...
                    </p>
                  )}
                  {!isCheckingUsername && usernameMsg && (
                    <p
                      className={`text-sm pt-1 ${
                        usernameMsg === 'Username is unique'
                          ? 'text-green-400'
                          : 'text-red-400'
                      }`}
                    >
                      {usernameMsg}
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-neutral-400">Email Address</FormLabel>
                  <Input
                    {...field}
                    placeholder="you@example.com"
                    type="email"
                    className="mt-1 block w-full rounded-lg bg-neutral-900/50 border-neutral-700 text-neutral-200 placeholder:text-neutral-600 focus:border-purple-500 focus:ring focus:ring-purple-500/50 transition-colors"
                  />
                  <p className="text-xs text-neutral-500 pt-1">
                    We’ll send you a verification code.
                  </p>
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

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                type="submit"
                className="w-full py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold shadow-lg hover:shadow-purple-500/40 transition-shadow"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </>
                ) : (
                  'Sign Up'
                )}
              </Button>
            </motion.div>
          </form>
        </Form>

        <div className="text-center mt-4 text-neutral-400">
          <p>
            Already have an account?{' '}
            <Link href="/sign-in" className="text-indigo-400 font-medium hover:underline hover:text-indigo-300 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page;
