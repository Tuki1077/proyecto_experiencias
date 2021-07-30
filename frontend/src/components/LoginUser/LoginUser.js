import { Modal, Form } from 'react-bootstrap';
import { useState, useContext } from 'react';
import { postAxios } from '../../axiosCalls';
import Button from '../button/Button';
import StyledForm from '../RegisterUser/StyledForm';
import 'bootstrap/dist/css/bootstrap.min.css';
import { UserContext } from '../../context/UserContext';
function LoginUser() {
  const { setToken, token } = useContext(UserContext);

  const [formActivate, setFormActivate] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');

  function onSubmitLogin(event) {
    event.preventDefault();

    async function performLogin() {
      try {
        const body = {
          username: username ? username : '',
          email: email ? email : '',
          password,
        };

        const { data } = await postAxios(
          'http://localhost:8080/users/login',
          body
        );
        console.log(data);
        console.log(data.token);
        // const { token } = data;
        // console.log(token);
        setToken(data.token);
      } catch (error) {
        console.log('ERROR: ', error);
      }
    }

    performLogin();
  }
  function isValidEmail(mail) {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/.test(mail);
  }

  return (
    <>
      <Button blue barra onClickButton={() => setFormActivate(!formActivate)}>
        INICIAR SESIÓN
      </Button>

      <Modal show={formActivate} onHide={() => setFormActivate(!formActivate)}>
        <StyledForm>
          <Modal.Header closeButton>
            <Modal.Title>Inicio de Sesión</Modal.Title>
          </Modal.Header>
          <Form onSubmit={onSubmitLogin} className="modalBody">
            <Form.Group className="formElement">
              <Form.Label>
                Nombre de Usuario
                <Form.Control
                  onChange={(event) => {
                    setUsername(event.target.value);
                    setEmail(event.target.value);
                  }}
                  value={username}
                  type="text"
                  placeholder="Nombre de Usuario"
                />
              </Form.Label>
            </Form.Group>
            <Form.Group className="formElement">
              <Form.Label>
                Contraseña
                <Form.Control
                  onChange={(event) => setPassword(event.target.value)}
                  value={password}
                  type="password"
                />
              </Form.Label>
            </Form.Group>
            <Button
              type="submit"
              value="Login"
              onClickButton={() => {
                if (!isValidEmail(email)) {
                  setUsername(username);
                  setEmail('');
                } else {
                  setEmail(email);
                  setUsername('');
                }

                if (token) setFormActivate(!formActivate);
              }}
            >
              Iniciar Sesión
            </Button>
            {error && <div>{error} </div>}
          </Form>
        </StyledForm>
      </Modal>
    </>
  );
}

export default LoginUser;
