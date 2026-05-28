import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/shared/Navbar';
import NewsPage from './components/city/NewsPage';

function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight mb-4">
            World<span className="text-emerald-700">CityHub</span>
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Live daily data for every city on earth. News, weather, prayer times, and more.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-3xl mx-auto">
          <a
            href="/pakistan/punjab/lahore/news"
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow no-underline group"
          >
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-emerald-700 transition-colors mb-1">
              Lahore News
            </h3>
            <p className="text-sm text-gray-500">Latest stories from Lahore, Punjab, Pakistan</p>
          </a>
          <a
            href="/pakistan/sindh/karachi/news"
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow no-underline group"
          >
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-emerald-700 transition-colors mb-1">
              Karachi News
            </h3>
            <p className="text-sm text-gray-500">Latest stories from Karachi, Sindh, Pakistan</p>
          </a>
          <a
            href="/pakistan/islamabad-capital/islamabad/news"
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow no-underline group"
          >
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-emerald-700 transition-colors mb-1">
              Islamabad News
            </h3>
            <p className="text-sm text-gray-500">Latest stories from Islamabad, Pakistan</p>
          </a>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/:country/:province/:city/news" element={<NewsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
