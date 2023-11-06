import { useContext, useState } from 'react';
import { Modal, Form } from 'react-bootstrap';
import DatePicker, { registerLocale } from 'react-datepicker';
import { GoTrashcan } from 'react-icons/go';
import { BsX } from 'react-icons/bs';
import { MdEdit } from 'react-icons/md';
import { sqlDateFormat } from '../../helpers';
import Button from '../button/Button';
import StyledForm from '../RegisterUser/StyledForm';
import { v4 as uuidv4 } from 'uuid';
import es from 'date-fns/locale/es';
import { deleteAxios, getAxios, postAxios, putAxios } from '../../axiosCalls';
import { UserContext } from '../../context/UserContext';
import { compareAsc } from 'date-fns';

registerLocale('es', es);

function AdminExperiencesItem({ experience, updateDataExp, categories }) {
  const optionsDate = {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  };

  const dateInit = new Date(experience?.fecha_inicio);
  const dateFinal = new Date(experience?.fecha_fin);

  const [formActivate, setFormActivate] = useState(false);
  const { token } = useContext(UserContext);

  const [name, setName] = useState(experience?.nombre);
  const [city, setCity] = useState(experience?.ciudad);
  const [cat, setCat] = useState(experience?.categoria);
  const [price, setPrice] = useState(experience?.precio);
  const [participants, setParticipants] = useState(
    experience?.num_participantes
  );
  const [initDate, setInitDate] = useState(dateInit);
  const [finishDate, setFinishDate] = useState(dateFinal);
  const [description, setDescription] = useState(experience?.descripcion);
  const [error, setError] = useState('');
  const [errorDel, setErrorDel] = useState();
  const [expPhoto, setExpPhoto] = useState(experience?.photos);
  const [files, setFiles] = useState();
  const [changeChecked, setChangeChecked] = useState({
    checked: false,
    error: '',
  });

  const onFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  async function putEditInfo(e) {
    e.preventDefault();

    let payload = new FormData();
    files?.map((file) => payload.append('photo', file));

    const body = {
      name,
      city,
      category: cat,
      price,
      participants,
      sDate: sqlDateFormat(initDate.toLocaleDateString('es-ES', optionsDate)),
      fDate: sqlDateFormat(finishDate.toLocaleDateString('es-ES', optionsDate)),
      description,
    };

    if (!changeChecked.checked) {
      setChangeChecked({
        ...changeChecked,
        error:
          'Debes aceptar la condiciones para actualizar los datos de la experiencia',
      });
    } else {
      try {
        if (files?.length > 0) {
          await postAxios(
            `http://https://bf8t0s9gnh.execute-api.us-east-1.amazonaws.com/experiences/${experience.id}/photo`,
            payload,
            token
          );
        }
        const { status } = await putAxios(
          `http://https://bf8t0s9gnh.execute-api.us-east-1.amazonaws.com/experiences/${experience.id}`,
          body,
          token
        );

        if (status === 200) {
          const { data } = await getAxios('http://https://bf8t0s9gnh.execute-api.us-east-1.amazonaws.com/experiences');
          updateDataExp(data);
        }
        setFormActivate(!formActivate);
      } catch (error) {
        setError(error.response.data.message);
      }
    }
  }

  async function deletePhoto(idExp, idPhoto) {
    try {
      const { data } = await deleteAxios(
        `http://https://bf8t0s9gnh.execute-api.us-east-1.amazonaws.com/experiences/${idExp}/photo/${idPhoto}`,
        token
      );
      setExpPhoto(data.photos);
    } catch (error) {
      setErrorDel(error.response.data.message);
    }
  }

  async function deleteExperience() {
    try {
      const doYouDelete = window.confirm(
        'Estás seguro de que quieres borrar esta experiencia?'
      );

      if (doYouDelete) {
        const { status } = await deleteAxios(
          `http://https://bf8t0s9gnh.execute-api.us-east-1.amazonaws.com/experiences/${experience.id}`,
          token
        );

        if (status === 200) {
          const { data } = await getAxios('http://https://bf8t0s9gnh.execute-api.us-east-1.amazonaws.com/experiences');
          updateDataExp(data);
        }
      }
    } catch (error) {
      setErrorDel(error.response.data.message);
    }
  }

  const dateExperience = new Date(experience.fecha_fin).toLocaleDateString(
    'es-ES',
    optionsDate
  );
  const today = new Date().toLocaleDateString('es-ES', optionsDate);
  const date1 = dateExperience.split('/').reverse();
  const date2 = today.split('/').reverse();
  const state = compareAsc(
    new Date(date1[0], date1[1], date1[2]),
    new Date(date2[0], date2[1], date2[2])
  );
  const stateExperience = state === 1 ? 'Activa' : 'No activa';
  return (
    <>
      <tr className="sectionData">
        <td className="dataInfo">
          <ul>
            <li>
              <h3>{experience?.nombre}</h3>
            </li>
            <li>Ubicación: {experience?.ciudad}</li>
            <li>Categoría: {experience?.categoria}</li>
            <li className="avaliable">
              <span>Plazas por día: {experience?.num_participantes}</span>
              <span></span>
            </li>
            <li className="dataInfoRow">
              <span>
                Desde: {dateInit.toLocaleDateString('es-ES', optionsDate)}
              </span>
              <span>
                Hasta: {dateFinal.toLocaleDateString('es-ES', optionsDate)}
              </span>
            </li>
          </ul>
          <span>Estado: {stateExperience}</span>
        </td>
        <td className="buttonsAdmin">
          <MdEdit onClick={() => setFormActivate(!formActivate)} />
          <Modal
            show={formActivate}
            onHide={() => setFormActivate(!formActivate)}
          >
            <StyledForm>
              <Modal.Header closeButton>
                <Modal.Title>Edita la experiencia</Modal.Title>
              </Modal.Header>
              <Form className="modalBody" onSubmit={putEditInfo}>
                <Form.Group className="formElement">
                  <Form.Label>
                    Nombre experiencia
                    <Form.Control
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </Form.Label>
                </Form.Group>
                <Form.Group className="formElement">
                  <Form.Label>
                    Ubicación
                    <Form.Control
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </Form.Label>
                </Form.Group>
                <Form.Group className="formElement">
                  <Form.Label>
                    Categoria
                    <Form.Select
                      onChange={(e) => setCat(e.target.value)}
                      value={cat}
                    >
                      {categories.map((category) => {
                        return (
                          <option key={uuidv4()} defaultValue={category}>
                            {category}
                          </option>
                        );
                      })}
                    </Form.Select>
                  </Form.Label>
                </Form.Group>
                <Form.Group className="formElement">
                  <Form.Label>
                    Precio
                    <Form.Control
                      type="text"
                      value={price + '€'}
                      onChange={(e) =>
                        setPrice(Number(e.target.value.replace('€', '')))
                      }
                    />
                  </Form.Label>
                </Form.Group>
                <Form.Group className="formElement">
                  <Form.Label>
                    Nº Participantes
                    <Form.Control
                      type="number"
                      value={participants}
                      onChange={(e) => setParticipants(e.target.value)}
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
                      selected={initDate}
                      onChange={(date) => setInitDate(date)}
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
                      selected={finishDate}
                      onChange={(date) => setFinishDate(date)}
                    />
                  </Form.Label>
                </Form.Group>
                <Form.Group className="formElement">
                  <Form.Label>
                    Descripcion
                    <Form.Control
                      as="textarea"
                      style={{ height: 100 + 'px' }}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </Form.Label>
                </Form.Group>
                <Form.Group className="formElement">
                  <span className="labelForm">Foto/s de la experiencia</span>
                  <ul className="photoAdminEdit">
                    {expPhoto?.map((photo, index) => (
                      <li key={index}>
                        <img src={photo.photo} alt={photo.id} />
                        <BsX
                          onClick={() => deletePhoto(experience?.id, photo.id)}
                          className="btnDel"
                          size="1.5rem"
                          color="#FFF"
                        />
                      </li>
                    ))}
                  </ul>
                  <Form.Label>
                    Añadir Foto/s
                    <Form.Control
                      type="file"
                      multiple
                      onChange={onFileChange}
                    />
                  </Form.Label>
                </Form.Group>
                <Form.Group className="formElement checkboxForm">
                  <Form.Check
                    type="checkbox"
                    onChange={() =>
                      setChangeChecked({
                        ...changeChecked,
                        checked: true,
                      })
                    }
                  />
                  <Form.Label>Aceptar condiciones de uso</Form.Label>
                </Form.Group>
                {changeChecked.error && !changeChecked.checked && (
                  <div className="errorForm">{changeChecked.error}</div>
                )}
                {error && <div className="errorForm">{error}</div>}
                <Button white>ENVIAR</Button>
              </Form>
            </StyledForm>
          </Modal>

          <GoTrashcan onClick={() => deleteExperience()} />
        </td>
      </tr>
      {errorDel && <div className="errorForm">{errorDel}</div>}
    </>
  );
}

export default AdminExperiencesItem;
