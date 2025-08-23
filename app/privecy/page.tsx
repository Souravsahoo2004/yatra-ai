export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-2xl p-6">
        <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-gray-700 mb-4">
          Your privacy is very important to us at <strong>Yatra AI</strong>. We collect only the data necessary to improve your travel experience.
        </p>
        <ul className="list-disc ml-6 text-gray-600 space-y-2">
          <li>We collect information like name, email, and trip preferences.</li>
          <li>Your data will never be sold to third-party advertisers.</li>
          <li>We may use anonymized data for AI model improvement.</li>
          <li>You can request deletion of your data anytime.</li>
        </ul>
        <p className="text-gray-700 mt-6">
          By using Yatra AI, you consent to our privacy practices.
        </p>
      </div>
    </div>
  );
}
