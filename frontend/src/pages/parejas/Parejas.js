import { getAxios } from '../../axiosCalls';
import { useEffect, useState } from 'react';
import queryString from 'query-string';
import { sqlDateFormat } from '../../helpers';
import React, { Suspense } from 'react';
import Loading from '../../components/spinner/Loading';

const AllExperiences = React.lazy(() =>
  import('../../components/allexperiences/AllExperiences')
);
function Parejas() {
  const [catParejas, setCatParejas] = useState([]);
  const [selectFilter, setSelectFilter] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [priceFilter, setPriceFilter] = useState({ checked: false, value: '' });
  const [dateFilter, setDateFilter] = useState({ dateStart: '', dateEnd: '' });

  const orderType = selectFilter.split('-').splice(0, 1).join('');
  const orderDirection = selectFilter.split('-').splice(1, 1).join('');

  const cityActive = {
    textDecoration: 'underline',
    textDecorationColor: '#3aabfe',
  };

  useEffect(() => {
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

    const urlFiltered = queryString.stringifyUrl({
      url: 'http://34.67.221.67:8080/experiences?cat=Pareja',
      query: {
        order: `${orderType}`,
        orderDir: `${orderDirection}`,
        city: `${cityFilter}`,
        price: `${priceFilter.value}`,
        dateStart: `${sqlDateFormat(newDateStart)}`,
        dateEnd: `${sqlDateFormat(newDateEnd)}`,
      },
    });

    async function getParejas() {
      try {
        const { data } = await getAxios(urlFiltered);

        setCatParejas(data);
      } catch (error) {
        console.log(error.message);
      }
    }

    getParejas();
  }, [
    selectFilter,
    orderType,
    orderDirection,
    cityFilter,
    priceFilter,
    dateFilter,
  ]);

  return (
    <>
      {catParejas && (
        <Suspense
          fallback={
            <div>
              <Loading />
            </div>
          }
        >
          <AllExperiences
            data={catParejas}
            order={selectFilter}
            filterNull={
              () => 
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

export default Parejas;
