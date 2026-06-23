'use client';

import { Button } from '@/components/ui/button';
import { Loader2, RefreshCcw, Send } from 'lucide-react';
import axios from 'axios';
import { useParams } from 'next/navigation';
import React, { useState } from 'react';
import { toast } from 'sonner';

type SuggestResponse = {
  success: boolean;
  questions: string[];
  fallback?: boolean;
};

const Page = () => {
  const params = useParams<{ username: string }>();
  const username = params?.username;

  const [content, setContent] = useState('');
  const [questions, setQuestions] = useState<string[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [sending, setSending] = useState(false);

  const fetchSuggestions = async () => {
    try {
      setLoadingSuggestions(true);
      const { data } = await axios.post<SuggestResponse>('/api/suggest-messages');
      setQuestions(data.questions ?? []);
      if (data.fallback) {
        toast.message('Showing default suggestions (AI unavailable right now).');
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      // Endpoint already degrades gracefully, but guard the UI anyway.
      toast.error('Could not load suggestions. Try again in a moment.');
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const handleSend = async () => {
    if (content.trim().length < 10) {
      toast.error('Message must be at least 10 characters.');
      return;
    }
    try {
      setSending(true);
      await axios.post('/api/send-message', { username, content });
      toast.success('Message sent anonymously!');
      setContent('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-black text-white">
      <div className="container mx-auto max-w-2xl p-4 md:p-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
          Send an anonymous message
        </h1>
        <p className="text-neutral-400 mb-8">
          to <span className="font-semibold text-neutral-200">@{username}</span>
        </p>

        <div className="p-6 bg-black/40 border border-neutral-800 rounded-xl shadow-lg">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={300}
            rows={4}
            placeholder="Write your anonymous message here..."
            className="w-full p-3 rounded-lg bg-neutral-900/60 border border-neutral-700 text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <div className="mt-4 flex justify-end">
            <Button
              onClick={handleSend}
              disabled={sending}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold"
            >
              {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              <span className="ml-2">Send</span>
            </Button>
          </div>
        </div>

        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-neutral-200">Need ideas?</h2>
            <Button
              variant="outline"
              onClick={fetchSuggestions}
              disabled={loadingSuggestions}
              className="bg-neutral-900/50 border-neutral-700 hover:bg-neutral-800 text-neutral-300 hover:text-white"
            >
              {loadingSuggestions ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCcw className="h-4 w-4" />
              )}
              <span className="ml-2">Suggest Messages</span>
            </Button>
          </div>

          <div className="space-y-3">
            {questions.length === 0 && !loadingSuggestions ? (
              <p className="text-neutral-500 text-sm">
                Click &ldquo;Suggest Messages&rdquo; to get AI-generated questions you can send.
              </p>
            ) : (
              questions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => setContent(q)}
                  className="w-full text-left p-3 rounded-lg bg-neutral-900/40 border border-neutral-800 hover:border-indigo-500 hover:bg-neutral-800/60 transition-colors text-neutral-200"
                >
                  {q}
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
