'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { verifySchema } from '@/schemas/verifySchema';

export default function VerifyAccount() {
  const router = useRouter();
  const params = useParams<{ username: string }>();

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      const response = await axios.post<ApiResponse>(`/api/verify-code`, {
        username: params.username,
        code: data.code,
      });

      toast.success(response.data.message);

      router.replace('/sign-in');
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message ??
          'An error occurred. Please try again.'
      );
    }
  };

  return (
    <div className="min-h-screen w-full flex justify-center items-center bg-black bg-grid-white/[0.1] relative px-4">
      {/* Radial gradient for a glowing effect */}
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>

      <div className="w-full max-w-md p-8 space-y-8 bg-black/60 backdrop-blur-xl border border-neutral-800 rounded-2xl shadow-2xl z-10">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 mb-4">
            Verify Your Account
          </h1>
          <p className="text-neutral-400">
            Enter the verification code sent to your email
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="code"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-neutral-400">
                    Verification Code
                  </FormLabel>
                  <Input
                    {...field}
                    placeholder="123456"
                    className="mt-1 block w-full rounded-lg bg-neutral-900/50 border-neutral-700 text-neutral-200 placeholder:text-neutral-600 focus:border-purple-500 focus:ring focus:ring-purple-500/50 transition-colors"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold shadow-lg hover:shadow-purple-500/40 transition-shadow"
            >
              Verify
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}