'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const HomePage = () => {
  const [makes, setMakes] = useState([]);
  const [selectedMake, setSelectedMake] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [years] = useState(Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i));

  useEffect(() => {
    const fetchMakes = async () => {
      try {
        const response = await fetch('https://vpic.nhtsa.dot.gov/api/vehicles/GetMakesForVehicleType/car?format=json');
        const data = await response.json();
        console.log('Fetched makes:', data); // Перевірте отримані дані
        if (data && data.Results) {
          setMakes(data.Results);
        } else {
          console.error('Invalid data structure:', data);
        }
      } catch (error) {
        console.error('Error fetching makes:', error);
      }
    };

    fetchMakes();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="p-8 bg-white shadow-md rounded-md w-full max-w-xl">
        <h1 className="text-2xl mb-4">Filter Vehicles</h1>
        <div className="mb-4">
          <label htmlFor="make" className="block text-gray-700">Make</label>
          <select
            id="make"
            value={selectedMake}
            onChange={(e) => setSelectedMake(e.target.value)}
            className="w-full mt-1 p-2 border border-gray-300 rounded-md custom-select"
          >
            <option value="">Select Make</option>
            {makes.length ? makes.map((make) => (
              <option key={make.Make_ID} value={make.Make_ID}>
                {make.Make_Name}
              </option>
            )) : <option value="">No makes available</option>}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="year" className="block text-gray-700">Year</label>
          <select
            id="year"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="w-full mt-1 p-2 border border-gray-300 rounded-md"
          >
            <option value="">Select Year</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        <Link href={`/result/${selectedMake}/${selectedYear}`}>
          <a className={`w-full mt-4 py-2 px-4 text-white bg-blue-500 rounded-md text-center ${!selectedMake || !selectedYear ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={!selectedMake || !selectedYear}>
            Next
          </a>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
