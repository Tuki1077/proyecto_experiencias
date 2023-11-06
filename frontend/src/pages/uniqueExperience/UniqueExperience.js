import { getAxios } from '../../axiosCalls';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import React, { Suspense } from 'react';
import Loading from '../../components/spinner/Loading';
const FullExperience = React.lazy(() =>
  import('../../components/fullexperience/FullExperience')
);
function UniqueExperiece() {
  const [uniqueExp, setUniqueExp] = useState([]);

  const { idExp } = useParams();

  useEffect(() => {
    const getUniqueExp = async () => {
      const { data } = await getAxios(
        `http://https://bf8t0s9gnh.execute-api.us-east-1.amazonaws.com:8080/experiences/${Number(idExp)}`
      );

      setUniqueExp(data);
    };
    getUniqueExp();
  }, [idExp]);
  return (
    <div>
      <Suspense
        fallback={
          <div>
            <Loading />
          </div>
        }
      >
        <FullExperience data={uniqueExp} />
      </Suspense>
    </div>
  );
}
export default UniqueExperiece;
