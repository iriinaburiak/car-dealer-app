import { useRouter } from 'next/router';

const ResultPage = ({ models, makeId, year, error }) => {
  const router = useRouter();

  if (router.isFallback) {
    return <div className="min-h-screen bg-gray-100 flex items-center justify-center">Loading...</div>;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="p-8 bg-red-100 border border-red-400 rounded-md w-full max-w-xl">
          <h1 className="text-2xl mb-4 text-red-800">Error Fetching Data</h1>
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="p-8 bg-white shadow-md rounded-md w-full max-w-xl">
        <h1 className="text-2xl mb-4">Vehicle Models for {makeId} in {year}</h1>
        <ul className="list-disc pl-5">
          {models.length ? models.map((model) => (
            <li key={model.Model_ID} className="mb-2">
              {model.Model_Name}
            </li>
          )) : <li>No models found.</li>}
        </ul>
      </div>
    </div>
  );
};

// Генерація статичних шляхів
export async function generateStaticParams() {
  try {
    const makeResponse = await fetch('https://vpic.nhtsa.dot.gov/api/vehicles/GetMakesForVehicleType/car?format=json');
    if (!makeResponse.ok) {
      throw new Error('Error fetching makes data');
    }
    const makesData = await makeResponse.json();
    const makes = makesData.Results;

    const years = Array.from({ length: new Date().getFullYear() - 2014 }, (_, i) => (2015 + i).toString());

    const paths = [];
    for (const make of makes) {
      for (const year of years) {
        paths.push({
          params: { makeId: make.Make_ID.toString(), year }
        });
      }
    }

    return {
      paths,
      fallback: 'blocking',
    };
  } catch (error) {
    console.error('Error generating static params:', error);
    return {
      paths: [],
      fallback: 'blocking',
    };
  }
}

// Отримання даних
export async function getStaticProps({ params }) {
  const { makeId, year } = params;

  try {
    const res = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeIdYear/makeId/${makeId}/modelyear/${year}?format=json`);
    if (!res.ok) {
      throw new Error(`Error fetching data: ${res.statusText}`);
    }
    const data = await res.json();

    return {
      props: {
        models: data.Results || [],
        makeId,
        year,
      },
      revalidate: 3600,
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      props: {
        models: [],
        makeId,
        year,
        error: error.message || 'An unexpected error occurred.',
      },
    };
  }
}

export default ResultPage;
