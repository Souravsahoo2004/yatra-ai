// view-my-trip/page.tsx

'use client';

import React from 'react';
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { 
  MapPin, 
  Calendar, 
  MessageCircle, 
  Trash2, 
  Plus,
  Clock,
  ArrowRight
} from 'lucide-react';
import { useMutation } from "convex/react";

interface Trip {
  _id: string;
  title: string;
  destination?: string;
  status: string;
  createdAt: number;
  updatedAt: number;
  tripPlanData?: any;
}

function ViewMyTripsPage() {
  const { user } = useUser();
  const router = useRouter();
  const deleteTrip = useMutation(api.messages.deleteTrip);

  const trips = useQuery(
    api.messages.getUserTrips,
    user ? { userId: user.id } : "skip"
  );

  const handleContinueChat = (tripId: string) => {
    router.push(`/create-new-trip?tripId=${tripId}`);
  };

  const handleDeleteTrip = async (tripId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this trip? This action cannot be undone.")) {
      try {
        await deleteTrip({ tripId: tripId as any });
      } catch (error) {
        console.error("Error deleting trip:", error);
      }
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': 
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'active': 
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'planning': 
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      default: 
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900">
        <p className="text-gray-600 dark:text-gray-400">Please sign in to view your trips.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl bg-white dark:bg-gray-900 min-h-screen transition-colors duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            My Trip Conversations
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Continue planning or review your past trips
          </p>
        </div>
        <Button 
          onClick={() => router.push('/create-new-trip')}
          className="bg-purple-700 hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-500 text-white flex items-center gap-2 px-6 py-2 rounded-lg transition-colors duration-200"
        >
          <Plus className="w-4 h-4" />
          Plan New Trip
        </Button>
      </div>

      {/* Trips Grid */}
      {trips === undefined ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 dark:bg-gray-700 rounded-xl h-48"></div>
            </div>
          ))}
        </div>
      ) : trips.length === 0 ? (
        <div className="text-center py-16">
          <MapPin className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            No trips yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Start planning your first trip with our AI assistant
          </p>
          <Button 
            onClick={() => router.push('/create-new-trip')}
            className="bg-purple-700 hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-500 text-white transition-colors duration-200"
          >
            Plan Your First Trip
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip: Trip) => (
            <div 
              key={trip._id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl dark:hover:shadow-2xl dark:hover:shadow-purple-500/10 transition-all duration-200 cursor-pointer group"
              onClick={() => handleContinueChat(trip._id)}
            >
              {/* Trip Image/Header */}
              <div className="h-32 bg-gradient-to-br from-purple-500 to-blue-600 dark:from-purple-600 dark:to-blue-700 rounded-t-xl relative overflow-hidden">
                <div className="absolute inset-0 bg-black/20 dark:bg-black/30"></div>
                <div className="absolute top-4 right-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(trip.status)}`}>
                    {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="font-semibold text-lg leading-tight line-clamp-2">
                    {trip.title}
                  </h3>
                </div>
              </div>

              {/* Trip Details */}
              <div className="p-4">
                <div className="space-y-3">
                  {trip.destination && (
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      <span className="text-sm truncate">{trip.destination}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Calendar className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm">Created {formatDate(trip.createdAt)}</span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Clock className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm">Updated {formatDate(trip.updatedAt)}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <Button 
                    className="flex-1 bg-purple-700 hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-500 text-white text-sm flex items-center justify-center gap-2 transition-colors duration-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleContinueChat(trip._id);
                    }}
                  >
                    <MessageCircle className="w-4 h-4" />
                    Continue Chat
                    <ArrowRight className="w-3 h-3" />
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20 border-red-200 dark:border-red-800 dark:hover:border-red-700 transition-colors duration-200"
                    onClick={(e) => handleDeleteTrip(trip._id, e)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ViewMyTripsPage;
