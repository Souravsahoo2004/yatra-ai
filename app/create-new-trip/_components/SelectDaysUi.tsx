'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

function SelectDaysUi({ onSelectOption }: any) {
  const [days, setDays] = useState(7);

  const increaseDays = () => setDays(days + 1);
  const decreaseDays = () => {
    if (days > 1) setDays(days - 1); // Prevent going below 1
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg max-w-sm mx-auto text-center">
      <h2 className="font-semibold text-lg mb-4">
        How many days do you want to travel?
      </h2>

      <div className="flex items-center justify-center gap-6 mb-4">
        <button
          onClick={decreaseDays}
          className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-xl font-bold"
        >
          -
        </button>

        <span className="text-xl font-bold">{days} Days</span>

        <button
          onClick={increaseDays}
          className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-xl font-bold"
        >
          +
        </button>
      </div>

      <Button
        className="bg-purple-700 hover:bg-purple-600 text-white font-medium py-2 px-6 rounded-lg"
        onClick={() => {onSelectOption(`Days: ${days} Days`);}}
      >
        Confirm
      </Button>
    </div>
  );
}

export default SelectDaysUi;
