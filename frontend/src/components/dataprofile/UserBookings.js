import { useContext, useEffect, useState } from 'react';
import { getAxios } from '../../axiosCalls';
import { UserContext } from '../../context/UserContext';
import UserRatingBookingItem from './UserBookingItem';

function UserBookings() {
  const { tokenContent, token } = useContext(UserContext);
  const [userBookings, setUserBookings] = useState([]);

  useEffect(() => {
    async function getUserBookings() {
      try {
        const { data } = await getAxios(
          `http://https://bf8t0s9gnh.execute-api.us-east-1.amazonaws.com/bookings/${tokenContent.idUser}/bookings`,
          token
        );
        setUserBookings(data);
      } catch (error) {
        console.log('ERROR: ', error);
      }
    }
    getUserBookings();
  }, [token, tokenContent]);

  return (
    <>
      {userBookings &&
        userBookings?.map((booking) => (
          <UserRatingBookingItem
            key={booking.id}
            bookingInfo={booking}
            updateDataBooking={setUserBookings}
            labelName={booking.experience[0].nombre}
          />
        ))}
    </>
  );
}
export default UserBookings;
