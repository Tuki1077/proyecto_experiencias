import StyledUserProfile from './StyledUserProfile';
import defaultAvatar from '../../assets/userdefaul.png';
import Button from '../button/Button';
import UserProfile from './UserProfile';
import UserBookings from './UserBookings';
import { useContext, useState } from 'react';
import { UserContext } from '../../context/UserContext';
import { deleteAxios } from '../../axiosCalls';

function UserProfileMain() {
  const infoActive = {
    borderBottom: '5px solid #3aabfe',
  };

  const [showInfo, setShowInfo] = useState({ profile: true, bookings: false });
  const { userInfo, tokenContent, token, logout } = useContext(UserContext);
  const userAvatar = userInfo?.avatar ? userInfo?.avatar : defaultAvatar;
  const completeName = `${userInfo?.nombre} ${userInfo?.apellidos}`;
  const [changeChecked, setChangeChecked] = useState({
    checked: false,
    error: '',
  });
  const [error, setError] = useState('');

  async function performDelete() {
    try {
      if (changeChecked.checked === false) {
        setChangeChecked({
          ...changeChecked,
          error: 'Debes marcar la casilla para poder eliminar el usuario',
        });
      } else {
        await deleteAxios(
          `http://https://bf8t0s9gnh.execute-api.us-east-1.amazonaws.com:8080/users/${tokenContent?.idUser}`,
          token
        );
        logout();
      }
    } catch (error) {
      setError(error.response.data.message);
    }
  }

  return (
    <StyledUserProfile>
      <div className="userProfileHead">
        <h3>{completeName}</h3>
        <img src={userAvatar} alt="user-avatar" />
      </div>
      <div className="userProfileNav">
        <ul>
          <li
            style={showInfo.profile ? infoActive : null}
            onClick={() => setShowInfo({ profile: true, bookings: false })}
          >
            MIS DATOS
          </li>
          <li
            style={showInfo.bookings ? infoActive : null}
            onClick={() => setShowInfo({ profile: false, bookings: true })}
          >
            MIS RESERVAS
          </li>
        </ul>
      </div>
      {showInfo.profile && (
        <>
          <div className="userProfileDele">
            <label>
              <input
                type="checkbox"
                onChange={() =>
                  setChangeChecked({ ...changeChecked, checked: true })
                }
              />
              <span>Acepto eliminar mis datos</span>
            </label>
            <Button red onClickButton={performDelete}>
              ELIMINAR MI CUENTA
            </Button>
            {error && <div className="errorDelete">{error}</div>}
            {changeChecked.error && !changeChecked.checked && (
              <div>{changeChecked.error}</div>
            )}
          </div>
        </>
      )}
      <div className="userProfile_Bookings">
        {showInfo.bookings && <UserBookings />}
        {showInfo.profile && <UserProfile />}
      </div>
    </StyledUserProfile>
  );
}
export default UserProfileMain;
