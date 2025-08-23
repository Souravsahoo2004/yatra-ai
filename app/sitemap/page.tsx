import Link from "next/link";

export default function SitemapPage() {
  const links = [
    { href: "/", label: "Home" },
    { href: "/create-new-trip", label: "Create New Trip" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
    { href: "/blog", label: "Blog" },
    { href: "/terms", label: "Terms" },
    { href: "/privacy", label: "Privacy" },
    { href: "/cookies", label: "Cookies" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-2xl p-6">
        <h1 className="text-3xl font-bold mb-6">Sitemap</h1>
        <ul className="list-disc ml-6 text-blue-600 space-y-3">
          {links.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="hover:underline">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
