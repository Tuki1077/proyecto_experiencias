import axios from 'axios';
import { useEffect, useState, createContext } from 'react';
import { onlyUnique } from '../helpers';
export const FilterContext = createContext();
export const FilterProvider = ({ children }) => {
  const [cities, setCities] = useState([]);

  useEffect(() => {
    async function getCities() {
      try {
        const { data } = await axios.get('http://https://bf8t0s9gnh.execute-api.us-east-1.amazonaws.com:8080/experiences');
        const allCities = data.data.map((city) => city.ciudad);
        setCities(allCities.filter(onlyUnique).sort());
      } catch (error) {
        console.error(error.message);
      }
    }

    getCities();
  }, [setCities]);

  return (
    <FilterContext.Provider value={{ cities }}>
      {children}
    </FilterContext.Provider>
  );
};
