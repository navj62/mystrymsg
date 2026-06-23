'use client';

import { MessageCard } from '@/components/MessageCard';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Message } from '@/model/User';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';
import { Loader2, RefreshCcw } from 'lucide-react';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AcceptMessageSchema, AcceptMessageForm } from '@/schemas/acceptMessageSchema';
import { motion } from 'framer-motion';

function UserDashboard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  const { data: session } = useSession();

  const form = useForm<AcceptMessageForm>({
    resolver: zodResolver(AcceptMessageSchema),
    defaultValues: {
      acceptMessages: false,
    },
  });

  const { register, watch, setValue } = form;
  const acceptMessages = watch('acceptMessages');

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId));
  };

  const fetchAcceptMessages = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>('/api/accept-messages');
      setValue('acceptMessages', response.data.isAcceptingMessages ?? false);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message ?? 'Failed to fetch settings');
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      try {
        const response = await axios.get<ApiResponse>('/api/get-messages');
        setMessages(response.data.messages || []);
        if (refresh) {
          toast.success('Messages refreshed');
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast.error(axiosError.response?.data.message ?? 'Failed to fetch messages');
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    if (!session || !session.user) return;
    fetchMessages();
    fetchAcceptMessages();
  }, [session, fetchAcceptMessages, fetchMessages]);

  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>('/api/accept-messages', {
        acceptMessages: !acceptMessages,
      });
      setValue('acceptMessages', !acceptMessages);
      toast.success(response.data.message);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message ?? 'Failed to update settings');
    }
  };

  if (!session || !session.user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-white" />
      </div>
    );
  }

  const { username } = session.user as User;
  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast.success('Profile URL copied to clipboard!');
  };

  return (
    <div className="min-h-screen w-full bg-black bg-grid-white/[0.1] relative text-white">
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      
      <div className="container mx-auto p-4 md:p-8 relative z-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
          User Dashboard
        </h1>

        <div className="mb-8 p-6 bg-black/40 backdrop-blur-lg border border-neutral-800 rounded-xl shadow-lg">
          <h2 className="text-lg font-semibold mb-3 text-neutral-200">Your Unique Link</h2>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <input
              type="text"
              value={profileUrl}
              disabled
              className="input w-full p-3 rounded-lg bg-neutral-900/50 border-neutral-700 text-neutral-200 font-mono"
            />
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
              <Button onClick={copyToClipboard} className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold shadow-lg hover:shadow-purple-500/40 transition-shadow">
                Copy
              </Button>
            </motion.div>
          </div>
        </div>

        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 p-6 bg-black/40 backdrop-blur-lg border border-neutral-800 rounded-xl shadow-lg">
            <div className="flex items-center space-x-4">
                <Switch
                {...register('acceptMessages')}
                checked={acceptMessages}
                onCheckedChange={handleSwitchChange}
                disabled={isSwitchLoading}
                className="data-[state=checked]:bg-indigo-500 data-[state=unchecked]:bg-neutral-700"
                />
                <span className="text-neutral-300">
                Accepting Messages: <span className={`font-semibold ${acceptMessages ? 'text-green-400' : 'text-red-400'}`}>{acceptMessages ? 'On' : 'Off'}</span>
                </span>
            </div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                    variant="outline"
                    onClick={() => fetchMessages(true)}
                    disabled={isLoading}
                    className="bg-neutral-900/50 border-neutral-700 hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors"
                >
                    {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                    <RefreshCcw className="h-4 w-4" />
                    )}
                    <span className="ml-2">Refresh Messages</span>
                </Button>
            </motion.div>
        </div>

        <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-6 text-neutral-200">Your Messages</h2>
            {isLoading && messages.length === 0 ? (
                <div className="text-center text-neutral-400">Loading messages...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {messages.length > 0 ? (
                    messages.map((message) => (
                        <MessageCard
                        key={String(message._id)}
                        message={message}
                        onMessageDelete={handleDeleteMessage}
                        // Assuming MessageCard is styled to fit the dark theme
                        />
                    ))
                    ) : (
                    <p className="text-center col-span-full text-neutral-400">No messages to display yet.</p>
                    )}
                </div>
            )}
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
