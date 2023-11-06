import { Form } from 'react-bootstrap';
import Button from '../button/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useContext, useState } from 'react';
import { UserContext } from '../../context/UserContext';
import { putAxios } from '../../axiosCalls';
import { BsBoxArrowInRight } from 'react-icons/bs';
import ChangePassProfile from './ChangePassProfile';

function UserProfile() {
  const { token, tokenContent, userInfo, setUserInfo } =
    useContext(UserContext);
  const [passChange, setPassChange] = useState(false);
  const [file, setFile] = useState();
  const [error, setError] = useState();
  const INITIAL_USERINFO = {
    name: userInfo?.nombre,
    last: userInfo?.apellidos,
    dni: userInfo?.dni || '',
    phone: userInfo?.telefono || '',
    bio: userInfo?.bio || '',
    address: userInfo?.direccion || '',
    postalCode: userInfo?.cp || '',
    username: userInfo?.username,
    email: userInfo?.email,
    avatar: userInfo?.avatar,
  };

  const [dataUser, setDataUser] = useState(INITIAL_USERINFO);
  const [changeChecked, setChangeChecked] = useState({
    checked: false,
    error: '',
  });

  async function updateUser(e) {
    try {
      e.preventDefault();

      if (changeChecked.checked === false) {
        setChangeChecked({
          ...changeChecked,
          error: 'Debes aceptar la condiciones para actualizar tus datos',
        });
      } else {
        const body = {
          dni: dataUser.dni,
          phone: dataUser.phone,
          address: dataUser.address,
          bio: dataUser.bio,
          cp: dataUser.postalCode,
          email: dataUser.email,
        };

        if (file) {
          let photo = new FormData();
          photo.append('avatar', file);

          await putAxios(
            `http://https://bf8t0s9gnh.execute-api.us-east-1.amazonaws.com:8080/users/${tokenContent?.idUser}`,
            photo,
            token
          );
        }

        const { data } = await putAxios(
          `http://https://bf8t0s9gnh.execute-api.us-east-1.amazonaws.com:8080/users/${tokenContent?.idUser}`,
          body,
          token
        );

        setUserInfo({
          ...data,
          avatar: `http://https://bf8t0s9gnh.execute-api.us-east-1.amazonaws.com:8080/uploads/${data.avatar}`,
        });
      }
    } catch (error) {
      setError(error.response?.data?.message);
    }
  }

  const onFileChange = (e) => {
    const file = e.target.files[0];

    setFile(file);
    setUserInfo({
      ...userInfo,
      avatar: URL.createObjectURL(e.target.files[0]),
    });
  };

  return (
    <>
      <Form className="modalBody" onSubmit={updateUser}>
        <Form.Group>
          <Form.Label className="editInfoLabel">
            <span>Avatar</span>
            <Form.Control type="file" onChange={onFileChange} />
          </Form.Label>
        </Form.Group>
        <Form.Group>
          <Form.Label className="editInfoLabel">
            <span>Nombre</span>
            <Form.Control
              type="text"
              value={dataUser.name}
              onChange={(e) =>
                setDataUser({ ...dataUser, name: e.target.value })
              }
              disabled
            />
          </Form.Label>
        </Form.Group>
        <Form.Group>
          <Form.Label className="editInfoLabel">
            <span>Apellidos</span>
            <Form.Control type="text" value={dataUser.last} disabled />
          </Form.Label>
        </Form.Group>
        <Form.Group>
          <Form.Label className="editInfoLabel">
            <span>DNI</span>
            {userInfo?.dni ? (
              <Form.Control
                type="text"
                placeholder="DNI"
                value={dataUser.dni}
                onChange={(e) =>
                  setDataUser({ ...dataUser, dni: e.target.value })
                }
                disabled
              />
            ) : (
              <Form.Control
                type="text"
                placeholder="DNI"
                value={dataUser.dni}
                onChange={(e) =>
                  setDataUser({ ...dataUser, dni: e.target.value })
                }
              />
            )}
          </Form.Label>
        </Form.Group>
        <Form.Group className="textareaBox">
          <Form.Label className="editInfoLabel">
            <span>Biografía</span>
            <Form.Control
              as="textarea"
              style={{ height: '200px' }}
              value={dataUser.bio}
              placeholder="Biografía"
              onChange={(e) =>
                setDataUser({ ...dataUser, bio: e.target.value })
              }
            />
          </Form.Label>
        </Form.Group>
        <Form.Group>
          <Form.Label className="editInfoLabel">
            <span>Teléfono</span>
            <Form.Control
              type="text"
              value={dataUser.phone}
              placeholder="Teléfono"
              onChange={(e) =>
                setDataUser({ ...dataUser, phone: e.target.value })
              }
            />
          </Form.Label>
        </Form.Group>
        <Form.Group>
          <Form.Label className="editInfoLabel">
            <span>Dirección</span>
            <Form.Control
              type="text"
              value={dataUser.address}
              placeholder="Dirección"
              onChange={(e) =>
                setDataUser({ ...dataUser, address: e.target.value })
              }
            />
          </Form.Label>
        </Form.Group>
        <Form.Group>
          <Form.Label className="editInfoLabel">
            <span>Código Postal</span>
            <Form.Control
              type="text"
              value={dataUser.postalCode}
              placeholder="Código Postal"
              onChange={(e) =>
                setDataUser({ ...dataUser, postalCode: e.target.value })
              }
            />
          </Form.Label>
        </Form.Group>
        <Form.Group>
          <Form.Label className="editInfoLabel">
            <span>Nombre de Usuario</span>
            <Form.Control type="text" value={dataUser.username} disabled />
          </Form.Label>
        </Form.Group>
        <Form.Group>
          <Form.Label className="editInfoLabel">
            <span>Email</span>
            <Form.Control
              type="email"
              value={dataUser.email}
              placeholder="Email"
              onChange={(e) =>
                setDataUser({ ...dataUser, email: e.target.value })
              }
            />
          </Form.Label>
        </Form.Group>
        <Form.Group className="changePass">
          <span>Modificar contraseña</span>
          <BsBoxArrowInRight
            size="1.5rem"
            color="#3aabfe"
            className="iconPass"
            onClick={() => setPassChange(!passChange)}
          />
          {passChange && (
            <ChangePassProfile
              activate={passChange}
              onHideActivate={() => setPassChange(!passChange)}
            />
          )}
        </Form.Group>
        <Form.Group>
          {error && <div className="errorForm">{error}</div>}
          <Form.Label>
            <Form.Check
              type="checkbox"
              onChange={() =>
                setChangeChecked({
                  ...changeChecked,
                  checked: !changeChecked.checked,
                })
              }
            />
            <span>Aceptar condiciones de actualizado de datos.</span>
          </Form.Label>
          {changeChecked.error && !changeChecked.checked && (
            <div className="errorForm">{changeChecked.error}</div>
          )}
          <Button blue className="editInfoButton">
            EDITAR INFORMACIÓN
          </Button>
        </Form.Group>
      </Form>
    </>
  );
}
export default UserProfile;
