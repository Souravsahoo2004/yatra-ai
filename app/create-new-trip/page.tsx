import React from "react";
import ChatBox from "./_components/ChatBox";
import MapWrapper from "./mapwrapper";
import AiCallImmediate from "./_components/aiCallImmediate";

function CreateNewTrip() {
  // 🧠 AI-generated trip (in real flow you’ll pass result from ChatBox or server)
  const aiTrip = {
    destination: "Goa",
    startDate: "2025-09-01",
    endDate: "2025-09-07",
    notes: "Beach and adventure trip",
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-10">
      <div>
        <ChatBox />
      </div>

      <div>
        <MapWrapper />
      </div>

      {/* Invisible trip saver */}
      <AiCallImmediate trip={aiTrip} />
    </div>
  );
}

export default CreateNewTrip;
