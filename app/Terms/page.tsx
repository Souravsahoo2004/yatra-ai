export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-2xl p-6">
        <h1 className="text-3xl font-bold mb-4">Terms & Conditions</h1>
        <p className="text-gray-700 mb-4">
          Welcome to <strong>Yatra AI</strong>. By using our platform, you agree to comply with the following terms and conditions.
        </p>
        <ul className="list-disc ml-6 text-gray-600 space-y-2">
          <li>Use the service only for lawful travel planning purposes.</li>
          <li>Do not misuse, copy, or redistribute Yatra AI algorithms.</li>
          <li>We reserve the right to suspend accounts for policy violations.</li>
          <li>All bookings and AI suggestions are recommendations only, not guarantees.</li>
        </ul>
        <p className="text-gray-700 mt-6">
          Please review these terms regularly as they may be updated.
        </p>
      </div>
    </div>
  );
}
