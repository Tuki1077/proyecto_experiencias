import { Modal, Form } from 'react-bootstrap';
import { useState } from 'react';
import Button from '../button/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import StyledForm from './StyledForm';
import { postAxios } from '../../axiosCalls';
import { useHistory } from 'react-router-dom';

function RegisterUser() {
  const [formActivate, setFormActivate] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [last, setLast] = useState('');
  const [error, setError] = useState('');
  const history = useHistory();

  async function performLogin(e) {
    try {
      e.preventDefault();

      const body = {
        username,
        email,
        password,
        name,
        last,
      };

      if (password === password2) {
        await postAxios('http://https://bf8t0s9gnh.execute-api.us-east-1.amazonaws.com/users', body);
        history.push({
          pathname: '/register-validate',
          email,
          username,
        });
        setFormActivate(!formActivate);
      }
    } catch (error) {
      setError(error.response?.data?.message);
    }
  }

  return (
    <>
      <Button white onClickButton={() => setFormActivate(!formActivate)}>
        REGISTRARSE
      </Button>

      <Modal show={formActivate} onHide={() => setFormActivate(!formActivate)}>
        <StyledForm>
          <Modal.Header closeButton>
            <Modal.Title>Registro de Usuario</Modal.Title>
          </Modal.Header>
          <Form className="modalBody" onSubmit={performLogin}>
            <Form.Group className="formElement">
              <Form.Label>
                Nombre
                <Form.Control
                  type="text"
                  placeholder="Nombre"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              </Form.Label>
            </Form.Group>
            <Form.Group className="formElement">
              <Form.Label>
                Apellidos
                <Form.Control
                  type="text"
                  placeholder="Apellidos"
                  value={last}
                  onChange={(event) => setLast(event.target.value)}
                />
              </Form.Label>
            </Form.Group>
            <Form.Group className="formElement">
              <Form.Label>
                Nombre de Usuario
                <Form.Control
                  type="text"
                  placeholder="Nombre de Usuario"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                />
              </Form.Label>
            </Form.Group>
            <Form.Group className="formElement">
              <Form.Label>
                Email
                <Form.Control
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </Form.Label>
            </Form.Group>
            <Form.Group className="formElement">
              <Form.Label>
                Contraseña
                <Form.Control
                  type="password"
                  value={password}
                  placeholder="Contraseña"
                  onChange={(event) => setPassword(event.target.value)}
                />
              </Form.Label>
            </Form.Group>
            <Form.Group className="formElement">
              <Form.Label>
                Confirmar Contraseña
                <Form.Control
                  type="password"
                  value={password2}
                  placeholder="Confirmar Contraseña"
                  onChange={(event) => setPassword2(event.target.value)}
                />
              </Form.Label>
            </Form.Group>
            {error && <div className="errorForm">{error}</div>}
            <Button
              white
              onClickButton={() => {
                if (password !== password2) {
                  setError('Las contraseñas no coinciden');
                }

                if (password2 === '') {
                  setError('Debes confirmar la contraseña');
                }
              }}
            >
              Registrarse
            </Button>
          </Form>
        </StyledForm>
      </Modal>
    </>
  );
}

export default RegisterUser;
