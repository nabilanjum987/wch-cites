import { Globe, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <Link to="/" className="flex items-center gap-2 no-underline">
            <Globe className="w-6 h-6 text-emerald-700" />
            <span className="text-lg font-bold text-gray-900 tracking-tight">
              WorldCityHub
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
            <Link to="/" className="hover:text-emerald-700 transition-colors no-underline text-gray-600">Home</Link>
            <Link to="/pakistan/punjab/lahore/news" className="hover:text-emerald-700 transition-colors no-underline text-gray-600">Lahore News</Link>
          </div>

          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <div className="px-4 py-3 space-y-2">
            <Link to="/" className="block py-2 text-sm font-medium text-gray-600 hover:text-emerald-700 no-underline" onClick={() => setOpen(false)}>Home</Link>
            <Link to="/pakistan/punjab/lahore/news" className="block py-2 text-sm font-medium text-gray-600 hover:text-emerald-700 no-underline" onClick={() => setOpen(false)}>Lahore News</Link>
          </div>
        </div>
      )}
    </nav>
  );
}
