'use client';

import React from 'react';
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

type TripPlan = {
  destination: string;
  duration: string;
  origin: string;
  budget: string;
  group_size: string;
  hotels: {
    hotel_name: string;
    hotel_address: string;
    price_per_night: string;
    hotel_image_url: string;
    geo_coordinates: { latitude: number; longitude: number; };
    rating: number;
    description: string;
  }[];
  itinerary: {
    day: number;
    day_plan: string;
    best_time_to_visit_day: string;
    activities: {
      place_name: string;
      place_details: string;
      place_image_url: string;
      geo_coordinates: { latitude: number; longitude: number; };
      place_address: string;
      ticket_pricing: string;
      time_travel_each_location: string;
      best_time_to_visit: string;
    }[];
  }[];
};

interface ViewTripProps {
  tripPlan: TripPlan | null;
  tripId: string; // Need tripId to fetch messages
}

const ViewTrip: React.FC<ViewTripProps> = ({ tripPlan, tripId }) => {
  const messages = useQuery(api.messages.getMessages, { tripId });
  const deleteMessage = useMutation(api.messages.deleteMessage);
  const deleteAll = useMutation(api.messages.deleteMessagesForTrip);

  if (!tripPlan) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <p className="text-gray-500 text-lg">⚠️ No trip plan available.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      {/* Trip Details */}
      <div>
        <h1 className="text-3xl font-bold mb-4">📍 Your Trip to {tripPlan.destination}</h1>
        <p className="mb-2">Origin: {tripPlan.origin}</p>
        <p className="mb-2">Duration: {tripPlan.duration}</p>
        <p className="mb-2">Travelers: {tripPlan.group_size}</p>
        <p className="mb-4">Budget: {tripPlan.budget}</p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">🏨 Hotels</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tripPlan.hotels.map((hotel, index) => (
            <div key={index} className="border rounded-lg p-4 shadow">
              <img
                src={hotel.hotel_image_url}
                alt={hotel.hotel_name}
                className="w-full h-40 object-cover rounded mb-2"
              />
              <h3 className="font-bold text-lg">{hotel.hotel_name}</h3>
              <p>{hotel.hotel_address}</p>
              <p>Price/Night: {hotel.price_per_night}</p>
              <p>Rating: {hotel.rating} ⭐</p>
              <p className="text-sm text-gray-600">{hotel.description}</p>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-semibold mt-6 mb-2">🗓 Itinerary</h2>
        {tripPlan.itinerary.map((day, index) => (
          <div key={index} className="border-l-4 border-purple-700 pl-4 mb-4">
            <h3 className="font-bold text-lg">Day {day.day}: {day.day_plan}</h3>
            <p className="text-sm mb-2">Best time to visit: {day.best_time_to_visit_day}</p>

            {day.activities.map((activity, aIndex) => (
              <div key={aIndex} className="flex items-start gap-4 mb-2">
                <img
                  src={activity.place_image_url}
                  alt={activity.place_name}
                  className="w-24 h-16 object-cover rounded"
                />
                <div>
                  <p className="font-semibold">{activity.place_name}</p>
                  <p className="text-sm">{activity.place_details}</p>
                  <p className="text-xs text-gray-500">Address: {activity.place_address}</p>
                  <p className="text-xs text-gray-500">Tickets: {activity.ticket_pricing}</p>
                  <p className="text-xs text-gray-500">Best time: {activity.best_time_to_visit}</p>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Chat Messages */}
      <div>
        <h2 className="text-xl font-bold mt-6">💬 Trip Chat History</h2>
        {!messages && <p>Loading chat...</p>}
        {messages && messages.length === 0 && <p className="text-gray-500">No messages yet.</p>}
        {messages && messages.length > 0 && (
          <ul className="mt-4 space-y-2">
            {messages.map((msg) => (
              <li key={msg._id} className="flex justify-between border p-2 rounded">
                <span>
                  <b>{msg.role}:</b> {msg.content}
                </span>
                <button
                  className="text-red-500 hover:underline"
                  onClick={() => deleteMessage({ messageId: msg._id })}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
        {messages && messages.length > 0 && (
          <button
            className="mt-4 bg-red-600 text-white px-3 py-1 rounded"
            onClick={() => deleteAll({ tripId })}
          >
            Delete All Messages
          </button>
        )}
      </div>
    </div>
  );
};

export default ViewTrip;
