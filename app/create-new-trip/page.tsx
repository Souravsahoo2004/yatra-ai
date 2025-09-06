// create-new-trip/page.tsx

'use client';

import React, { Suspense } from "react";
import ChatBox from "./_components/ChatBox";

function CreateNewTripContent() {
  return (
    <div className="flex flex-col md:flex-row items-stretch justify-center gap-6 p-4 md:p-10 min-h-[calc(100vh-4rem)] md:min-h-[calc(100vh-5rem)]">
      {/* ChatBox on the left */}
      <div className="w-full flex flex-col h-full">
        <div className="flex-1 h-full">
          <ChatBox />
        </div>
      </div>
    </div>
  );
}

function CreateNewTrip() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-700"></div>
      </div>
    }>
      <CreateNewTripContent />
    </Suspense>
  );
}

export default CreateNewTrip;
