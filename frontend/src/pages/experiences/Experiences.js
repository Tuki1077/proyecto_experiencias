import { getAxios } from '../../axiosCalls';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';
import { sqlDateFormat } from '../../helpers';
import React, { Suspense } from 'react';
import Loading from '../../components/spinner/Loading';

const AllExperiences = React.lazy(() =>
  import('../../components/allexperiences/AllExperiences')
);
function Experiences() {
  const [experienceSearch, setExperienceSearch] = useState([]);
  const [selectFilter, setSelectFilter] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [priceFilter, setPriceFilter] = useState({ checked: false, value: '' });
  const [dateFilter, setDateFilter] = useState({ dateStart: '', dateEnd: '' });

  const location = useLocation();
  // eslint-disable-next-line

  const cityActive = {
    textDecoration: 'underline',
    textDecorationColor: '#3aabfe',
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);

    const orderType = selectFilter.split('-').splice(0, 1).join('');
    const orderDirection = selectFilter.split('-').splice(1, 1).join('');

    const newDateStart =
      dateFilter.dateStart &&
      dateFilter.dateStart.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
      });
    const newDateEnd =
      dateFilter.dateEnd &&
      dateFilter.dateEnd.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
      });

    let urlFiltered = queryString.stringifyUrl({
      url: 'http://https://bf8t0s9gnh.execute-api.us-east-1.amazonaws.com/experiences',
      query: {
        searchExp: `${
          searchParams.has('searchExp') ? searchParams.get('searchExp') : ''
        }`,
        searchCity: `${
          searchParams.has('searchCity') ? searchParams.get('searchCity') : ''
        }`,
        order: `${orderType}`,
        orderDir: `${orderDirection}`,
        city: `${cityFilter}`,
        price: `${priceFilter.value}`,
        dateStart: `${sqlDateFormat(newDateStart)}`,
        dateEnd: `${sqlDateFormat(newDateEnd)}`,
      },
    });

    async function getExperiencesFiltered() {
      try {
        const { data } = await getAxios(urlFiltered);

        setExperienceSearch(data);
      } catch (error) {
        console.log(error.message);
      }
    }

    getExperiencesFiltered();
  }, [selectFilter, cityFilter, priceFilter, dateFilter, location]);

  return (
    <>
      {experienceSearch && (
        <Suspense
          fallback={
            <div>
              <Loading />
            </div>
          }
        >
          <AllExperiences
            data={experienceSearch}
            order={selectFilter}
            filterNull={() =>
              setSelectFilter('') &
              setCityFilter('') &
              setPriceFilter({ checked: false, value: '' }) &
              setDateFilter({ dateStart: '', dateEnd: '' })
            }
            onChangeSelect={(e) => setSelectFilter(e.target.value)}
            onClickCity={(e) => setCityFilter(e.target.innerHTML)}
            cityActive={cityFilter && cityActive}
            cityFilterSelected={cityFilter}
            priceFilter={priceFilter.checked}
            onChangePrice={(e) =>
              setPriceFilter({
                checked: !priceFilter.checked,
                value: e.target.value,
              })
            }
            dateStartFilter={dateFilter.dateStart}
            changeDatePickerStart={(date) =>
              setDateFilter({ ...dateFilter, dateStart: date })
            }
            dateEndFilter={dateFilter.dateEnd}
            changeDatePickerEnd={(date) =>
              setDateFilter({ ...dateFilter, dateEnd: date })
            }
          />
        </Suspense>
      )}
    </>
  );
}
export default Experiences;
