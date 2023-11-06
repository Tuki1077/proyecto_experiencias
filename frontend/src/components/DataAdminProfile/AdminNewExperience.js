import { Modal, Form } from 'react-bootstrap';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../context/UserContext';
import Button from '../button/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-datepicker/dist/react-datepicker.css';
import StyledForm from '../RegisterUser/StyledForm';
import DatePicker from 'react-datepicker';
import { useHistory } from 'react-router-dom';

import { onlyUnique, sqlDateFormat } from '../../helpers';
import { getAxios, postAxios } from '../../axiosCalls';

function AdminNeWExperience() {
  const { token } = useContext(UserContext);
  const [formActivate, setFormActivate] = useState(false);
  const [category, setCategory] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [section, setSection] = useState('');
  const [city, setCity] = useState('');
  const [price, setPrice] = useState('');
  const [participants, setParticipants] = useState('');
  const [dStart, setDStart] = useState('');
  const [dStop, setDStop] = useState('');
  const [error, setError] = useState('');
  const [files, setFiles] = useState([]);

  let history = useHistory();
  const dateStart = new Date(dStart).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });
  const dateStop = new Date(dStop).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });

  const onFileChange = (e) => {
    const file = e.target.files;
    setFiles([...file]);
  };

  async function getCategories() {
    const { data } = await getAxios('https://bf8t0s9gnh.execute-api.us-east-1.amazonaws.com/experiences');
    const categories = data.map((category) => category.categoria);
    const allCategories = categories.filter(onlyUnique);
    setCategory(allCategories);
  }

  function onSubmitNewExperience(event) {
    event.preventDefault();
    let payload = new FormData();

    files?.map((file) => payload.append('photo', file));

    const body = {
      name,
      description,
      category: section,
      city,
      price,
      participants,
      dStart: sqlDateFormat(dateStart),
      dStop: sqlDateFormat(dateStop),
    };

    for (const prop of Object.keys(body)) {
      payload.append(prop, body[prop]);
    }

    async function performNewExperience() {
      try {
        await postAxios('https://bf8t0s9gnh.execute-api.us-east-1.amazonaws.com/experiences', payload, token);

        history.go(0);
      } catch (error) {
        setError(error?.response);
      }
    }
    performNewExperience();
  }

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <div>
      <div onClick={() => setFormActivate(!formActivate)}>
        AÑADIR EXPERIENCIA
      </div>
      <Modal show={formActivate} onHide={() => setFormActivate(!formActivate)}>
        <StyledForm>
          <Modal.Header closeButton>
            <Modal.Title>Añade una nueva experiencia</Modal.Title>
          </Modal.Header>
          <Form className="modalBody" onSubmit={onSubmitNewExperience}>
            <Form.Group className="formElement">
              <Form.Label>
                Nombre experiencia
                <Form.Control
                  type="text"
                  placeholder="Nombre de la experiencia"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              </Form.Label>
            </Form.Group>
            <Form.Group className="formElement">
              <Form.Label>
                Ubicación
                <Form.Control
                  type="text"
                  placeholder="Ubicación de la experiencia"
                  value={city}
                  onChange={(event) => setCity(event.target.value)}
                />
              </Form.Label>
            </Form.Group>
            <Form.Group className="formElement">
              <Form.Label>
                Categoria
                <Form.Select
                  value={section}
                  onChange={(event) => setSection(event.target.value)}
                >
                  {category &&
                    category.map((category) => {
                      return <option key={category}>{category}</option>;
                    })}
                </Form.Select>
              </Form.Label>
            </Form.Group>
            <Form.Group className="formElement">
              <Form.Label>
                Precio
                <Form.Control
                  type="text"
                  placeholder="precio"
                  value={price}
                  onChange={(event) => setPrice(event.target.value)}
                />
              </Form.Label>
            </Form.Group>
            <Form.Group className="formElement">
              <Form.Label>
                Nº Participantes
                <Form.Control
                  type="number"
                  placeholder="Número de participantes por día"
                  value={participants}
                  onChange={(event) => setParticipants(event.target.value)}
                />
              </Form.Label>
            </Form.Group>
            <Form.Group className="formElement">
              <Form.Label>
                Fecha de Inicio
                <DatePicker
                  locale="es"
                  dateFormat="dd/MM/yyyy"
                  className="date-picker"
                  selected={dStart}
                  onChange={(date) => setDStart(date)}
                />
              </Form.Label>
            </Form.Group>
            <Form.Group className="formElement">
              <Form.Label>
                Fecha Fin
                <DatePicker
                  locale="es"
                  dateFormat="dd/MM/yyyy"
                  className="date-picker"
                  selected={dStop}
                  onChange={(date) => setDStop(date)}
                />
              </Form.Label>
            </Form.Group>
            <Form.Group className="formElement">
              <Form.Label>
                Descripcion
                <Form.Control
                  as="textarea"
                  style={{ height: 100 + 'px' }}
                  placeholder="Descripción de la actividad"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                />
              </Form.Label>
            </Form.Group>
            <Form.Group className="formElement">
              <Form.Label>
                Imagen
                <Form.Control type="file" multiple onChange={onFileChange} />
              </Form.Label>
            </Form.Group>
            <Form.Group className="formElement checkboxForm">
              <Form.Check type="checkbox" />
              <Form.Label>Aceptar condiciones de uso</Form.Label>
            </Form.Group>
            {error?.data?.message && (
              <div className="errorForm">{error?.data?.message}</div>
            )}
            <Button white>ENVIAR</Button>
          </Form>
        </StyledForm>
      </Modal>
    </div>
  );
}
export default AdminNeWExperience;
