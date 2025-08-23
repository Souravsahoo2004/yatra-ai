export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-2xl p-6">
        <h1 className="text-3xl font-bold mb-4">Cookies Policy</h1>
        <p className="text-gray-700 mb-4">
          <strong>Yatra AI</strong> uses cookies to enhance your browsing experience and provide personalized recommendations.
        </p>
        <ul className="list-disc ml-6 text-gray-600 space-y-2">
          <li>Cookies help us remember your preferences and past trips.</li>
          <li>We use analytics cookies to improve performance.</li>
          <li>You can disable cookies in your browser at any time.</li>
        </ul>
        <p className="text-gray-700 mt-6">
          By continuing to use Yatra AI, you agree to our use of cookies.
        </p>
      </div>
    </div>
  );
}
