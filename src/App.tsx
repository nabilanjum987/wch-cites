import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom';

function RedirectToPrayerTimes() {
  const { country, province, city } = useParams();
  const citySlug = city || 'karachi';
  const provinceSlug = province || 'sindh';
  const countrySlug = country || 'pakistan';

  window.location.href = `/${countrySlug}/${provinceSlug}/${citySlug}/prayer-times`;
  return null;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/:country?/:province?/:city?" element={<RedirectToPrayerTimes />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
