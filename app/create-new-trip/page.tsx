import React from "react";
import ChatBox from "./_components/ChatBox";
import AiCallImmediate from "./_components/aiCallImmediate";
import TripPage from "../trip/page";

function CreateNewTrip() {
  const aiTrip = {
    destination: "Goa",
    startDate: "2025-09-01",
    endDate: "2025-09-07",
    notes: "Beach and adventure trip",
  };

  return (
    <div className="flex flex-col md:flex-row items-stretch justify-center gap-6 p-10 h-screen">
      {/* ChatBox on the left */}
      <div className="w-full md:w-1/2 flex flex-col h-full">
        <div className="flex-1 h-full">
          <ChatBox />
        </div>
      </div>

      {/* TripPage (image/preview) on the right */}
      <div className="w-full md:w-1/2 flex flex-col h-full">
        <div className="flex-1 h-full">
          <TripPage />
        </div>
      </div>

      {/* Invisible trip saver */}
      <AiCallImmediate trip={aiTrip} />
    </div>
  );
}

export default CreateNewTrip;
