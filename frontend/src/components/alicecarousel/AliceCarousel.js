import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';

import StyledAliceCarousel from './StyledAliceCarousel';
import { useEffect, useState } from 'react';
import { getAxios } from '../../axiosCalls';
import { useHistory } from 'react-router-dom';
import palm from '../../assets/Palmeras.jpg';

const responsive = {
  0: { items: 1 },
  568: { items: 2 },
  780: { items: 3 },
  1024: { items: 4 },
};

function Carousel() {
  const history = useHistory();

  const [allExperiences, setAllExperiences] = useState([]);

  useEffect(() => {
    async function getExperience() {
      try {
        const { data } = await getAxios(
          `http://34.67.221.67:8080/experiences?random=10`
        );

        setAllExperiences(data);
      } catch (error) {}
    }
    getExperience();
  }, []);

  function routeChange(id) {
    let path = `/experience/${id}`;
    history.push(path);
  }

  return (
    <StyledAliceCarousel>
      <h2>Experiencias más destacadas</h2>
      <AliceCarousel
        autoPlay
        autoPlayInterval={5000}
        infinite={true}
        animationType="fadeout"
        animationDuration={500}
        animationEasingFunction="ease"
        disableButtonsControls
        disableDotsControls
        mouseTracking
        items={allExperiences?.map((data, index) => {
          return (
            <div
              key={data?.id}
              onClick={() => routeChange(data?.id)}
              className="item"
              data-value={index}
            >
              <div className="posRel">
                <img
                  width="100%"
                  src={data.photos.length ? data?.photos[0].photo : palm}
                  alt="category"
                />
                <span className="titlePopularExperience">{data?.nombre}</span>
              </div>
            </div>
          );
        })}
        paddingLeft={30}
        paddingRight={30}
        responsive={responsive}
      />
    </StyledAliceCarousel>
  );
}
export default Carousel;
