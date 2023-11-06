import StyledShop from './StyledShop';
import Button from '../button/Button';
import ItemShop from './ItemShop';
import { Form } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { useContext, useState } from 'react';
import { UserContext } from '../../context/UserContext';
import { postAxios } from '../../axiosCalls';
import { sqlDateFormat } from '../../helpers';

function Shop() {
  let history = useHistory();
  const [checked, setChecked] = useState();
  const [error, setError] = useState();
  const [units, setUnits] = useState(1);

  const { setCartExperience, cartExperience, token } = useContext(UserContext);
  const updateCartStorageInfo = localStorage.getItem('infoCart');
  const updateCartStorageMap = JSON.parse(updateCartStorageInfo);

  function goToHome() {
    history.push('/experiences');
  }

  function isChecked(string) {
    if (string === 'email') {
      setChecked('Para continuar tu viaje, revisa tu email.');
    } else if (string === 'post') {
      setChecked(
        'En unos días, recibiras el paquete para continuar con tu viaje.'
      );
    } else if (string === 'present') {
      setChecked('Tu regalo ha sido enviado.');
    }
  }

  let mappedItems =
    cartExperience.length > 0 ? cartExperience : updateCartStorageMap;

  function removeItem(index) {
    const items = [...cartExperience];
    items.splice(index, 1);
    setCartExperience(items);
  }

  async function postItems() {
    try {
      for (const item of cartExperience) {
        const booking = {
          dateBooking: sqlDateFormat(item.date),
          price: item.exp.precio,
          idExp: item.exp.id,
          units,
        };
        await postAxios('http://https://bf8t0s9gnh.execute-api.us-east-1.amazonaws.com/bookings', booking, token);
      }
    } catch (error) {
      setError(error.response.data.message);
    }
  }
  return (
    <StyledShop>
      {cartExperience.length !== 0 ? (
        <section className="bookingInfo">
          {mappedItems &&
            mappedItems?.map((item, index) => (
              <ItemShop
                key={index}
                name={item?.exp.nombre}
                description={item?.exp.descripcion}
                photo={item?.exp.photos[0].photo}
                precio={item?.exp.precio}
                date={item?.date}
                remove={() => removeItem(index)}
                index={index}
                setUnits={(e) => setUnits(e.target.value)}
                units={units}
              />
            ))}
        </section>
      ) : (
        <div className="emptyCart">
          <h3>El carrito está vacío</h3>
        </div>
      )}

      <section className="searchShop">
        <h4>Por favor seleccione el metodo de envio:</h4>
        <Form className="sendType">
          <Form.Group className="checkboxForm">
            <Form.Check
              type="radio"
              name="envio"
              id="email"
              onChange={() => isChecked('email')}
            />
            <Form.Label htmlFor="email">Vía Email</Form.Label>
          </Form.Group>
          <Form.Group className="checkboxForm">
            <Form.Check
              type="radio"
              name="envio"
              id="post"
              onChange={() => isChecked('post')}
            />
            <Form.Label htmlFor="post">Vía Postal</Form.Label>
          </Form.Group>
          <Form.Group className="checkboxForm">
            <Form.Check
              type="radio"
              name="envio"
              id="present"
              onChange={() => isChecked('present')}
            />
            <Form.Label htmlFor="present">Para Regalo</Form.Label>
          </Form.Group>
          <div className="buttonsShop">
            {error && <span>{error}</span>}
            <Button
              blue
              onClickButton={(e) => {
                e.preventDefault();
                if (token && checked) {
                  alert(checked);
                  postItems();
                  setError();
                  setCartExperience([]);
                  goToHome();
                } else if (!token) {
                  setError('Debes estar registrado para finalizar tu compra');
                } else if (token && !checked) {
                  setError('Debes seleccionar un metodo de envío');
                }
              }}
            >
              Comprar
            </Button>

            <Button onClickButton={() => goToHome()}>Seguir comprando</Button>
          </div>
        </Form>
      </section>
    </StyledShop>
  );
}

export default Shop;
