import { Rating } from '@material-ui/lab';
import { useContext, useState } from 'react';
import { getAxios, putAxios } from '../../axiosCalls';
import Button from '../button/Button';
import UserComment from './UserComment';
import { compareAsc } from 'date-fns';
import { UserContext } from '../../context/UserContext';
function UserRatingBookingItem({ bookingInfo, updateDataBooking, labelName }) {
  const [showRate, setShowRate] = useState(false);

  const [rating, setRating] = useState(bookingInfo.valoracion);
  const { token, tokenContent } = useContext(UserContext);

  const optionsDate = {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  };
  const dateFormat = new Date(bookingInfo.fecha_compra).toLocaleDateString(
    'es-ES',
    optionsDate
  );
  const dateBooking = new Date(bookingInfo.fecha_reserva).toLocaleDateString(
    'es-ES',
    optionsDate
  );

  const dateToday = new Date().toLocaleDateString('es-ES', optionsDate);
  const date1 = dateBooking.split('/').reverse();
  const date2 = dateToday.split('/').reverse();

  const state = compareAsc(
    new Date(date1[0], date1[1], date1[2]),
    new Date(date2[0], date2[1], date2[2])
  );
  const resultUsedExp = state === -1 ? false : true;

  async function updateRating() {
    try {
      const body = {
        vote: rating,
      };

      const { status } = await putAxios(
        `http://3.87.209.149:8080/bookings/${bookingInfo?.id}/rating`,
        body,
        token
      );

      if (status === 200) {
        const { data } = await getAxios(
          `http://3.87.209.149:8080/bookings/${tokenContent.idUser}/bookings`,
          token
        );
        updateDataBooking(data);
      }
    } catch (error) {
      console.error(error.response.data.message);
    }
  }

  return (
    <div className="userBookking">
      <div className="bookingHead">
        <span className="idBooking">ID: {bookingInfo.id}</span>
        <h3>{labelName}</h3>
        <span className="totalPriceBooking">
          {bookingInfo.precio_total}&#8364;
        </span>
      </div>
      <div className="bookingBody">
        <span>Fecha de Compra: {dateFormat}</span>
        <span>Fecha de Reserva: {dateBooking}</span>
      </div>
      <div>
        {resultUsedExp ? (
          <Button red disabled={resultUsedExp}>
            Valora tu Experiencia
          </Button>
        ) : (
          <Button blue onClickButton={() => setShowRate(!showRate)}>
            Valora tu Experiencia
          </Button>
        )}
      </div>
      {showRate && (
        <div className="appreciations">
          <div className="bookingComments">
            <span>Comentario:</span>
            {bookingInfo?.comentario ? (
              bookingInfo?.comentario
            ) : (
              <UserComment
                idBooking={bookingInfo.id}
                updateDataBooking={updateDataBooking}
              />
            )}
          </div>
          <div className="bookingRate">
            <span>Valoración:</span>
            {bookingInfo?.valoracion ? (
              <Rating
                name="rating-experience"
                value={Number(rating)}
                precision={1}
                readOnly
              />
            ) : (
              <Rating
                name="rating-experience"
                value={Number(rating)}
                precision={1}
                onChange={(e, rating) => setRating(rating)}
                onClick={rating > 0 ? updateRating() : null}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
export default UserRatingBookingItem;
