'use client';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader, Send } from 'lucide-react';
import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '@clerk/nextjs';

// UI components
import EmptyBoxState from './EmptyBoxState';
import GroupSizeUi from './GroupSizeUi';
import BudgetUi from './BudgetUi';
import FinalUi from './FinalUi';
import SelectDaysUi from './SelectDaysUi';

type Message = {
  role: 'user' | 'assistant';
  content: string;
  ui?: string;
};

function ChatBox() {
  const { getToken } = useAuth();

  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isFinal, setIsFinal] = useState(false);
  const [tripPlan, setTripPlan] = useState<any>(null);

  // ✅ Generate trip summary with fallbacks
  const generateTripSummary = (plan: any) => {
    if (!plan) return "⚠️ Your trip details are not ready yet.";

    return `✨ Here’s your trip plan:

📍 Destination: ${plan.destination || "Not specified (AI assumed a popular spot)"}
📅 Dates: ${plan.startDate || "Flexible"} → ${plan.endDate || "Flexible"}
👥 Travelers: ${plan.travelers || "Not specified"}
💰 Budget: ${plan.budget || "Estimated by AI"}
🏨 Stay: ${plan.hotel || "Suggested by AI"}
🚌 Activities: ${plan.activities?.join(", ") || "AI will recommend activities"}

🎉 Have a wonderful journey!`;
  };

  // ✅ Send message to API
  const onSend = async () => {
    if (!userInput.trim()) return;

    setLoading(true);

    const newMsg: Message = {
      role: 'user',
      content: userInput.trim(),
    };
    setMessages((prev) => [...prev, newMsg]);
    setUserInput('');

    try {
      const token = await getToken({ template: 'convex' });
      const result = await axios.post(
        '/api/aimmodel',
        {
          messages: [...messages, newMsg],
          isFinal: isFinal,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const resp = result.data || {};

      // ✅ Final confirmation → trip summary
      if (
        isFinal &&
        (newMsg.content.toLowerCase().includes("ok") ||
          newMsg.content.toLowerCase().includes("great"))
      ) {
        setTripPlan(resp?.trip_plan || {});
        const summary = generateTripSummary(resp?.trip_plan);

        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: summary },
        ]);

        setLoading(false);
        return;
      }

      // ✅ Normal response
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: decodeURIComponent(resp?.resp?.replace(/\+/g, ' ') || "🤔 I didn’t understand that."),
          ui: resp?.ui,
        },
      ]);

      // ✅ Mark final step if AI says so
      if (resp?.ui === 'final') {
        setIsFinal(true);
      }
    } catch (error) {
      console.error('❌ Error sending message:', error);

      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: "⚠️ Something went wrong. Please try again." },
      ]);
    }

    setLoading(false);
  };

  // ✅ UI renderer
  const RenderGenerativeUi = (ui?: string) => {
    if (!ui) return null;

    if (ui === 'budget') {
      return <BudgetUi onSelectOption={(v: string) => { setUserInput(v); onSend(); }} />;
    }
    if (ui === 'groupSize') {
      return <GroupSizeUi onSelectOption={(v: string) => { setUserInput(v); onSend(); }} />;
    }
    if (ui === 'tripDuration') {
      return <SelectDaysUi onSelectOption={(v: string) => { setUserInput(v); onSend(); }} />;
    }
    if (ui === 'final') {
      return (
        <FinalUi
          viewTrip={() => {
            console.log("📌 Full Trip Plan:", JSON.stringify(tripPlan, null, 2));
          }}
          tripReady={!!tripPlan}
        />
      );
    }
    return null;
  };

  return (
    <div className="h-[80vh] flex flex-col">
      {/* Empty state */}
      {messages.length === 0 && (
        <EmptyBoxState onSelectOption={(v: string) => { setUserInput(v); onSend(); }} />
      )}

      {/* Messages */}
      <section className="flex-1 overflow-y-auto p-4">
        {messages.map((msg, index) => (
          msg.role === 'user' ? (
            <div className="flex justify-end mt-2" key={index}>
              <div className="max-w-lg bg-purple-700 text-white py-2 rounded-lg p-6">
                {msg.content}
              </div>
            </div>
          ) : (
            <div className="flex justify-start mt-2" key={index}>
              <div className="max-w-lg bg-gray-100 text-black py-2 rounded-lg p-6 whitespace-pre-line">
                {msg.content}
                {RenderGenerativeUi(msg.ui)}
              </div>
            </div>
          )
        ))}

        {loading && (
          <div className="flex justify-start mt-2">
            <div className="max-w-lg bg-gray-100 text-black py-2 rounded-lg p-6 flex items-center gap-2">
              <Loader className="animate-spin" />
              Thinking...
            </div>
          </div>
        )}
      </section>

      {/* Input box */}
      <section>
        <div className="border rounded-2xl p-4 shadow-lg relative w-full max-w-xl">
          <Textarea
            placeholder="Start typing here..."
            className="w-full h-28 bg-transparent border-none focus-visible:ring-0 shadow-none resize-none"
            onChange={(event) => setUserInput(event.target.value)}
            value={userInput}
          />
          <Button
            size={'icon'}
            className="absolute bottom-6 right-6 bg-purple-700 text-white hover:bg-white hover:text-purple-700 shadow-md hover:shadow-purple-500/90 transition-all"
            onClick={onSend}
            disabled={loading}
          >
            {loading ? <Loader className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
      </section>
    </div>
  );
}

export default ChatBox;
