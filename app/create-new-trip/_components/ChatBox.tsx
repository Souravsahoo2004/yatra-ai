'use client';
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser, useAuth } from "@clerk/nextjs";

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader, Send, MapPin, Calendar, Users, DollarSign, Star, Clock, Building2 } from 'lucide-react';
import React, { useState } from 'react';
import axios from 'axios';

// UI components
import EmptyBoxState from './EmptyBoxState';
import GroupSizeUi from './GroupSizeUi';
import BudgetUi from './BudgetUi';
import FinalUi from './FinalUi';
import SelectDaysUi from './SelectDaysUi';

type Message = {
  role: "user" | "assistant";
  content: string;
  ui?: string;
  tripPlan?: any;
};

function ChatBox() {
  const { getToken } = useAuth();
  const { user } = useUser();

  const saveMessage = useMutation(api.messages.addMessage);

  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isFinal, setIsFinal] = useState(false);
  const [tripPlan, setTripPlan] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [autoGenerating, setAutoGenerating] = useState(false);

  // ✅ Format trip plan for display in chat
  const formatTripPlanForChat = (tripData: any) => {
    if (!tripData?.trip_plan) return "❌ Trip plan not available";

    const trip = tripData.trip_plan;
    
    let formattedPlan = `🎯 Your Complete Trip Plan\n\n`;
    
    // Basic Info
    formattedPlan += `📍 Destination: ${trip.destination}\n`;
    formattedPlan += `🏠 From: ${trip.origin}\n`;
    formattedPlan += `📅 Duration: ${trip.duration}\n`;
    formattedPlan += `👥 Group Size: ${trip.group_size}\n`;
    formattedPlan += `💰 Budget: ${trip.budget}\n\n`;
    
    // Hotels
    if (trip.hotels && trip.hotels.length > 0) {
      formattedPlan += `🏨 Accommodation:\n`;
      trip.hotels.forEach((hotel: any, index: number) => {
        formattedPlan += `${index + 1}. ${hotel.hotel_name}\n`;
        formattedPlan += `   📍 ${hotel.hotel_address}\n`;
        formattedPlan += `   💵 ${hotel.price_per_night}\n`;
        formattedPlan += `   ⭐ Rating: ${hotel.rating}/5\n`;
        formattedPlan += `   📝 ${hotel.description}\n\n`;
      });
    }
    
    // Itinerary
    if (trip.itinerary && trip.itinerary.length > 0) {
      formattedPlan += `📋 Daily Itinerary:\n\n`;
      trip.itinerary.forEach((day: any) => {
        formattedPlan += `Day ${day.day} - ${day.best_time_to_visit_day}\n`;
        formattedPlan += `${day.day_plan}\n\n`;
        
        if (day.activities && day.activities.length > 0) {
          formattedPlan += `Activities:\n`;
          day.activities.forEach((activity: any, index: number) => {
            formattedPlan += `${index + 1}. ${activity.place_name}\n`;
            formattedPlan += `   📝 ${activity.place_details}\n`;
            formattedPlan += `   📍 ${activity.place_address}\n`;
            formattedPlan += `   💵 Entry: ${activity.ticket_pricing}\n`;
            formattedPlan += `   ⏰ Duration: ${activity.time_travel_each_location}\n`;
            formattedPlan += `   🕐 Best Time: ${activity.best_time_to_visit}\n\n`;
          });
        }
      });
    }
    
    formattedPlan += `✨ Have an amazing trip! 🧳\n`;
    
    return formattedPlan;
  };

  // ✅ Handle View Trip button click
  const handleViewTrip = () => {
    console.log("🔍 Checking trip plan:", tripPlan);
    
    if (!tripPlan) {
      console.error("No trip plan available");
      setMessages((prev) => [...prev, {
        role: "assistant",
        content: "❌ Sorry, I don't have your trip plan ready yet. Please try generating it again.",
        ui: "none"
      }]);
      return;
    }

    const formattedTripPlan = formatTripPlanForChat(tripPlan);
    
    const tripDisplayMessage: Message = {
      role: "assistant",
      content: formattedTripPlan,
      ui: "none",
      tripPlan: tripPlan
    };

    setMessages((prev) => [...prev, tripDisplayMessage]);

    if (user) {
      saveMessage({
        tripId: tripPlan?.trip_plan?._id || "temp",
        userId: user.id,
        role: "assistant",
        content: formattedTripPlan,
      }).catch(console.error);
    }

    console.log("📌 Full Trip Plan:", JSON.stringify(tripPlan, null, 2));
  };

  // ✅ Handle View Hotels button click - Show only images
  const handleViewHotels = () => {
    console.log("🏨 Checking hotels in trip plan:", tripPlan);
    
    if (!tripPlan || !tripPlan.trip_plan?.hotels) {
      console.error("No hotels available in trip plan");
      setMessages((prev) => [...prev, {
        role: "assistant",
        content: "❌ Sorry, I don't have hotel recommendations ready yet. Please try generating the trip plan again.",
        ui: "none"
      }]);
      return;
    }

    const hotelDisplayMessage: Message = {
      role: "assistant",
      content: `🏨 Hotel Images for ${tripPlan.trip_plan.destination}`,
      ui: "hotel_images",
      tripPlan: tripPlan
    };

    setMessages((prev) => [...prev, hotelDisplayMessage]);

    if (user) {
      saveMessage({
        tripId: tripPlan?.trip_plan?._id || "temp",
        userId: user.id,
        role: "assistant",
        content: `Hotel images displayed for ${tripPlan.trip_plan.destination}`,
      }).catch(console.error);
    }

    console.log("🏨 Hotel images displayed");
  };

  // ✅ FIXED: Auto-generate trip plan when ui: "final" is received
  const autoGenerateTripPlan = async (currentMessages: Message[]) => {
    if (autoGenerating) return;
    
    setAutoGenerating(true);
    setLoading(true);

    try {
      const token = await getToken({ template: 'convex' });
      
      const finalMessage: Message = {
        role: "user",
        content: "Generate my complete trip plan now"
      };

      console.log("🤖 Auto-generating trip plan...");

      const result = await axios.post(
        '/api/aimmodel',
        {
          messages: [...currentMessages, finalMessage],
          isFinal: true,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          timeout: 45000,
        }
      );

      const resp = result.data || {};
      console.log("📨 Final API Response:", resp);

      if (resp.error) {
        throw new Error(resp.error);
      }

      if (resp.trip_plan) {
        console.log("🎯 Trip plan received:", resp.trip_plan);
        setTripPlan(resp);
        
        const aiMsg: Message = { 
          role: "assistant", 
          content: "🎉 Perfect! Your trip plan is ready. Click the 'View Trip' button below to see your complete itinerary, or 'View Hotels' to see accommodation images!",
          ui: "final",
          tripPlan: resp
        };
        
        setMessages((prev) => [...prev, aiMsg]);
        
        if (user) {
          try {
            await saveMessage({
              tripId: resp.trip_plan._id || "temp",
              userId: user.id,
              role: "assistant",
              content: aiMsg.content,
            });
          } catch (convexError) {
            console.error("❌ Error saving to Convex:", convexError);
          }
        }
      } else {
        throw new Error("No trip plan in response");
      }

    } catch (error: any) {
      console.error('❌ Error auto-generating trip plan:', error);
      
      let errorMessage = "⚠️ I had trouble generating your trip plan. Let me try again...";
      
      if (error.response?.status === 500) {
        errorMessage = "🤖 The AI had trouble creating your trip plan. Please try starting over.";
      } else if (error.message?.includes("timeout")) {
        errorMessage = "⏱️ Trip generation took too long. Please try again.";
      }
      
      setMessages((prev) => [...prev, {
        role: "assistant",
        content: errorMessage,
        ui: "none"
      }]);
    }

    setLoading(false);
    setAutoGenerating(false);
  };

  // ✅ Auto-select UI options
  const handleUiSelection = (value: string) => {
    setUserInput(value);
    setError(null);
    setTimeout(() => {
      onSend();
    }, 100);
  };

  // ✅ MAIN SEND FUNCTION - Fixed flow
  const onSend = async () => {
    if (!userInput.trim() || loading) return;

    setLoading(true);
    setError(null);

    const newMsg: Message = {
      role: "user",
      content: userInput.trim(),
    };

    const updatedMessages = [...messages, newMsg];
    setMessages(updatedMessages);
    setUserInput('');

    try {
      const token = await getToken({ template: 'convex' });
      const result = await axios.post(
        '/api/aimmodel',
        {
          messages: updatedMessages,
          isFinal: false,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          timeout: 30000,
        }
      );

      const resp = result.data || {};
      console.log("📨 API Response:", resp);

      if (!resp.resp && !resp.trip_plan) {
        throw new Error("Invalid API response structure");
      }

      let aiContent = resp.resp || "🤔 I didn't understand that. Could you try again?";
      aiContent = decodeURIComponent(aiContent.replace(/\+/g, ' '));

      const aiMsg: Message = {
        role: "assistant",
        content: aiContent,
        ui: resp.ui || "none",
      };

      const finalMessages = [...updatedMessages, aiMsg];
      setMessages(finalMessages);

      if (resp.ui === 'final') {
        console.log("🚀 Detected final step, auto-generating trip plan...");
        setIsFinal(true);
        
        setTimeout(() => {
          autoGenerateTripPlan(finalMessages);
        }, 1000);
      }

      if (user) {
        try {
          await saveMessage({
            tripId: tripPlan?._id || "temp",
            userId: user.id,
            role: "user",
            content: newMsg.content,
          });
          
          await saveMessage({
            tripId: tripPlan?._id || "temp",
            userId: user.id,
            role: "assistant",
            content: aiMsg.content,
          });
        } catch (convexError) {
          console.error("❌ Error saving to Convex:", convexError);
        }
      }

    } catch (error: any) {
      console.error('❌ Error sending message:', error);
      
      let errorMessage = "⚠️ Something went wrong. Please try again.";
      
      if (error.code === 'ECONNABORTED') {
        errorMessage = "⏱️ Request timed out. Please try again with a shorter message.";
      } else if (error.response?.status === 401) {
        errorMessage = "🔐 Authentication failed. Please refresh the page and try again.";
      } else if (error.response?.status >= 500) {
        errorMessage = "🚫 Server error. Please try again in a moment.";
      }

      setError(errorMessage);
      setMessages((prev) => [
        ...prev,
        { 
          role: "assistant", 
          content: errorMessage,
          ui: "none"
        },
      ]);
    }

    setLoading(false);
  };

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  // ✅ UI renderer with hotel images support
  const RenderGenerativeUi = (ui?: string, messageTripPlan?: any) => {
    if (!ui || ui === 'none') return null;

    try {
      if (ui === 'budget') {
        return <BudgetUi onSelectOption={handleUiSelection} />;
      }
      if (ui === 'groupSize') {
        return <GroupSizeUi onSelectOption={handleUiSelection} />;
      }
      if (ui === 'tripDuration') {
        return <SelectDaysUi onSelectOption={handleUiSelection} />;
      }
      
      if (ui === 'hotel_images') {
        const hotels = messageTripPlan?.trip_plan?.hotels || tripPlan?.trip_plan?.hotels || [];
        
        if (hotels.length === 0) {
          return (
            <div className="mt-4 p-4 border rounded-lg bg-gray-50">
              <p className="text-gray-600">No hotel images available.</p>
            </div>
          );
        }

        return (
          <div className="mt-4 p-4 border rounded-lg bg-gradient-to-r from-blue-50 to-green-50">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="w-5 h-5 text-green-600" />
              <span className="font-semibold text-green-800">Hotel Images</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {hotels.map((hotel: any, index: number) => (
                <div key={index} className="relative group">
                  <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-lg">
                    <img
                      src={hotel.hotel_image_url || `https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400&h=300&fit=crop`}
                      alt={hotel.hotel_name}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.src = `https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400&h=300&fit=crop`;
                      }}
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-2">
                      <p className="text-sm font-medium truncate">{hotel.hotel_name}</p>
                      <p className="text-xs opacity-80">⭐ {hotel.rating}/5</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      }
      
      if (ui === 'final') {
        return (
          <div className="mt-4 p-4 border rounded-lg bg-gradient-to-r from-purple-50 to-blue-50">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-5 h-5 text-purple-600" />
              <span className="font-semibold text-purple-800">
                {tripPlan ? "Trip Ready!" : autoGenerating ? "Generating Trip Plan..." : "Preparing Trip..."}
              </span>
            </div>
            
            {loading || autoGenerating ? (
              <div className="flex items-center justify-center gap-2 py-4">
                <Loader className="animate-spin w-5 h-5 text-purple-600" />
                <span className="text-purple-700">Creating your perfect trip...</span>
              </div>
            ) : tripPlan ? (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Button
                    onClick={handleViewTrip}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 w-full"
                  >
                    <Calendar className="w-4 h-4" />
                    View Trip Plan
                  </Button>
                  
                  <Button
                    onClick={handleViewHotels}
                    className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 w-full"
                  >
                    <Building2 className="w-4 h-4" />
                    View Hotels
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-600">
                <p className="text-sm">Preparing your trip details...</p>
              </div>
            )}
            
            {tripPlan && (
              <div className="mt-3 text-sm text-gray-600 text-center">
                <div className="flex items-center justify-center gap-2 sm:gap-4 text-xs flex-wrap">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {tripPlan?.trip_plan?.destination || 'Destination'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {tripPlan?.trip_plan?.duration || 'Duration'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {tripPlan?.trip_plan?.group_size || 'Group'}
                  </span>
                </div>
              </div>
            )}
          </div>
        );
      }
    } catch (error) {
      console.error("❌ Error rendering UI component:", error);
      return null;
    }
    
    return null;
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 flex flex-col min-h-0">
        {/* Empty state */}
        {messages.length === 0 && (
          <div className="flex-shrink-0">
            <EmptyBoxState onSelectOption={handleUiSelection} />
          </div>
        )}

        {/* Messages - FIXED: Added bottom padding to prevent content hiding behind textarea */}
        <section className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3 md:space-y-4 min-h-0 pb-28 md:pb-32">
          {messages.map((msg, index) => (
            msg.role === 'user' ? (
              <div className="flex justify-end" key={index}>
                <div className="max-w-[85%] md:max-w-lg bg-purple-700 text-white py-2 px-3 md:px-4 rounded-lg text-sm md:text-base">
                  {msg.content}
                </div>
              </div>
            ) : (
              <div className="flex justify-start" key={index}>
                <div className="max-w-[95%] md:max-w-4xl bg-gray-100 text-black py-2 px-3 md:px-4 rounded-lg text-sm md:text-base">
                  <div className="whitespace-pre-line mb-2">
                    {msg.content}
                  </div>
                  {RenderGenerativeUi(msg.ui, msg.tripPlan)}
                </div>
              </div>
            )
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="max-w-[85%] md:max-w-lg bg-gray-100 text-black py-2 px-3 md:px-4 rounded-lg flex items-center gap-2 text-sm md:text-base">
                <Loader className="animate-spin w-4 h-4" />
                <span>{autoGenerating ? "Creating your trip plan..." : "Planning your trip..."}</span>
              </div>
            </div>
          )}

          {error && (
            <div className="flex justify-center">
              <div className="max-w-[90%] md:max-w-lg bg-red-100 text-red-700 py-2 px-3 md:px-4 rounded-lg border border-red-200 text-sm md:text-base">
                {error}
              </div>
            </div>
          )}
        </section>

        {/* FIXED: Textarea always fixed at bottom for both mobile and desktop */}
        <section className="flex-shrink-0 p-3 md:p-4 fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t md:border-t-0 z-50">
          <div className="border rounded-2xl p-3 md:p-4 shadow-lg relative w-full max-w-xl mx-auto">
            <Textarea
              placeholder="Start typing here..."
              className="w-full h-20 md:h-28 bg-transparent border-none focus-visible:ring-0 shadow-none resize-none pr-12 text-sm md:text-base"
              onChange={(event) => setUserInput(event.target.value)}
              value={userInput}
              onKeyPress={handleKeyPress}
              disabled={loading}
            />
            <Button
              size={'icon'}
              className="absolute bottom-4 md:bottom-6 right-4 md:right-6 bg-purple-700 text-white hover:bg-purple-600 shadow-md transition-all w-8 h-8 md:w-10 md:h-10"
              onClick={onSend}
              disabled={loading || !userInput.trim()}
            >
              {loading ? (
                <Loader className="h-3 w-3 md:h-4 md:w-4 animate-spin" />
              ) : (
                <Send className="h-3 w-3 md:h-4 md:w-4" />
              )}
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default ChatBox;
