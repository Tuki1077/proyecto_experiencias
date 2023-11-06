import { useState } from 'react';
import { Form } from 'react-bootstrap';
import { putAxios } from '../../axiosCalls';
import Button from '../button/Button';
import StyledEmailRecoverPass from './StyledEmailRecoverPass';

function EmailRecoverPass() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [content, setContent] = useState(true);

  const body = {
    email,
  };

  async function recoverPass(e) {
    try {
      e.preventDefault();

      await putAxios('http://34.67.221.67:8080/users/password/recover', body);

      setContent(!content);
    } catch (error) {
      setError(error.response.data.message);
    }
  }

  return (
    <StyledEmailRecoverPass>
      <div className="verifyEmail_Pass">
        {content && (
          <>
            <h2>Introduce tu email</h2>
            <Form>
              <Form.Control
                type="email"
                placeholder="tuemail@email.com"
                onChange={(e) => setEmail(e.target.value)}
              />
              {error && <div className="errorForm">{error}</div>}
              <Button blue onClickButton={recoverPass}>
                Enviar
              </Button>
            </Form>
          </>
        )}
        {!content && (
          <h2>
            Se ha enviado un email de verificación a la cuenta de correo {email}{' '}
            para poder recordar la contraseña. Por favor, haga click en el
            enlace que se le proporciona en el correo electrónico para poder
            cambiar la contraseña
          </h2>
        )}
      </div>
    </StyledEmailRecoverPass>
  );
}

export default EmailRecoverPass;
