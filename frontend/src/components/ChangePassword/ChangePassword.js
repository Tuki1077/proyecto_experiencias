import { Form } from 'react-bootstrap';
import Button from '../button/Button';
import StyledChangedPassword from './StyledChangedPassword';
import { useState } from 'react';
import { putAxios } from '../../axiosCalls.js';
import { useLocation, useHistory } from 'react-router-dom';

function ChangePassword() {
  const [error, setError] = useState('');
  const [pass, setPass] = useState('');
  const [repeatPass, setRepeatPass] = useState('');

  const { pathname } = useLocation();
  const history = useHistory();

  const recoverCode = pathname.split('/');

  async function resetPass(e) {
    try {
      e.preventDefault();

      const body = {
        recoverCode: recoverCode[2],
        newPassword: pass,
      };

      if (pass === repeatPass) {
        await putAxios('http://34.67.221.67:8080/users/password/reset', body);
        history.push('/');
      }
    } catch (error) {
      setError(error.response.data.message);
    }
  }

  return (
    <StyledChangedPassword>
      <div className="resetPass_Box">
        <h2>Resetear la Contraseña</h2>
        <Form onSubmit={resetPass}>
          <Form.Group>
            <Form.Label>
              <span>Nueva Contraseña</span>
              <Form.Control
                type="password"
                placeholder="Nueva Contraseña"
                onChange={(e) => setPass(e.target.value)}
              />
            </Form.Label>
          </Form.Group>
          <Form.Group>
            <Form.Label>
              <span>Confirmar Contraseña</span>
              <Form.Control
                type="password"
                placeholder="Confirmar Contraseña"
                onChange={(e) => setRepeatPass(e.target.value)}
              />
            </Form.Label>
          </Form.Group>
          {error && <div className="errorForm">{error}</div>}
          <Button
            blue
            type="submit"
            onClickButton={() => {
              if (pass === '') {
                setError('Obligatorio completar los campos');
              }

              if (pass !== repeatPass) {
                setError('Las contraseñas no coinciden');
              }
            }}
          >
            Resetear Contraseña
          </Button>
        </Form>
      </div>
    </StyledChangedPassword>
  );
}

export default ChangePassword;
