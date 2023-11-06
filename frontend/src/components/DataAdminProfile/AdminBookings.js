import AdminBookingsItem from './AdminBookingsItem';
import { useContext, useEffect, useState } from 'react';
import { getAxios } from '../../axiosCalls';
import { UserContext } from '../../context/UserContext';

function AdminBookings() {
  const { token } = useContext(UserContext);
  const [allBookings, setAllBookings] = useState([]);

  useEffect(() => {
    async function getAllBookings() {
      try {
        const { data } = await getAxios(
          `http://34.67.221.67:8080/bookings`,
          token
        );

        setAllBookings(data);
      } catch (error) {
        console.log('ERROR: ', error);
      }
    }
    getAllBookings();
  }, [token]);

  return (
    <table className="tableData">
      <tbody>
        {allBookings?.map((booking) => (
          <AdminBookingsItem key={booking.id} info={booking} />
        ))}
      </tbody>
    </table>
  );
}

export default AdminBookings;
