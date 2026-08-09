import { Fragment } from 'react'
import { useIdioma } from '../context/IdiomaContext'
import { MensajeError } from './MensajeCampo'
import { SERVICIOS, TIPOS_ALOJAMIENTO, claveServicio, claveTipo } from '../utils/catalogos'

/**
 * Los tres `fieldset` del formulario de propiedad, compartidos entre
 * "Publica tu propiedad" (alta) y la edición del panel de anfitrión.
 *
 * El estado y la validación los aporta el componente de página mediante el
 * objeto que devuelve `useFormulario`; aquí solo vive el marcado.
 */
export default function FormularioPropiedad({ formulario }) {
  const { t } = useIdioma()
  const { valores, errores, propsCampo, alternarEnLista, prefijoId } = formulario

  const serviciosElegidos = valores.servicios || []

  return (
    <>
      <fieldset>
        <legend>{t('formPropiedad.generalesLeyenda')}</legend>

        <label htmlFor={`${prefijoId}-nombre`}>{t('formPropiedad.nombre')}</label>
        <input type="text" {...propsCampo('nombre')} value={valores.nombre} required />
        <MensajeError error={errores.nombre} id={`${prefijoId}-nombre-error`} />

        <label htmlFor={`${prefijoId}-tipo`}>{t('formPropiedad.tipo')}</label>
        <select {...propsCampo('tipo')} value={valores.tipo} required>
          {TIPOS_ALOJAMIENTO.map((tipo) => (
            <option value={tipo} key={tipo}>{t(claveTipo(tipo))}</option>
          ))}
        </select>
        <MensajeError error={errores.tipo} id={`${prefijoId}-tipo-error`} />

        <label htmlFor={`${prefijoId}-descripcion`}>{t('formPropiedad.descripcion')}</label>
        <textarea {...propsCampo('descripcion')} value={valores.descripcion} rows="4" maxLength={500} required />
        <MensajeError error={errores.descripcion} id={`${prefijoId}-descripcion-error`} />

        <label htmlFor={`${prefijoId}-ubicacion`}>{t('formPropiedad.ubicacion')}</label>
        <input
          type="text"
          {...propsCampo('ubicacion')}
          value={valores.ubicacion}
          placeholder={t('formPropiedad.ubicacionPlaceholder')}
          required
        />
        <MensajeError error={errores.ubicacion} id={`${prefijoId}-ubicacion-error`} />

        <label htmlFor={`${prefijoId}-capacidad`}>{t('formPropiedad.capacidad')}</label>
        <input type="number" {...propsCampo('capacidad')} value={valores.capacidad} min="1" required />
        <MensajeError error={errores.capacidad} id={`${prefijoId}-capacidad-error`} />

        <label htmlFor={`${prefijoId}-precioNoche`}>{t('formPropiedad.precio')}</label>
        <input type="number" {...propsCampo('precioNoche')} value={valores.precioNoche} min="1" required />
        <MensajeError error={errores.precioNoche} id={`${prefijoId}-precioNoche-error`} />
      </fieldset>

      <fieldset>
        <legend>{t('formPropiedad.serviciosLeyenda')}</legend>

        {SERVICIOS.map((servicio) => {
          const id = `${prefijoId}-servicio-${servicio.replace(/\s+/g, '-')}`
          return (
            <Fragment key={servicio}>
              <input
                type="checkbox"
                id={id}
                name="servicios"
                value={servicio}
                checked={serviciosElegidos.includes(servicio)}
                onChange={() => alternarEnLista('servicios', servicio)}
              />
              <label htmlFor={id}>{t(claveServicio(servicio))}</label>
            </Fragment>
          )
        })}

        <label htmlFor={`${prefijoId}-mascotas`}>{t('formPropiedad.mascotas')}</label>
        <select {...propsCampo('mascotas')} value={valores.mascotas}>
          <option value="si">{t('formPropiedad.si')}</option>
          <option value="no">{t('formPropiedad.no')}</option>
        </select>

        <label htmlFor={`${prefijoId}-fumar`}>{t('formPropiedad.fumar')}</label>
        <select {...propsCampo('fumar')} value={valores.fumar}>
          <option value="si">{t('formPropiedad.si')}</option>
          <option value="no">{t('formPropiedad.no')}</option>
        </select>

        <label htmlFor={`${prefijoId}-hora_entrada`}>{t('formPropiedad.horaEntrada')}</label>
        <input type="time" {...propsCampo('hora_entrada')} value={valores.hora_entrada} required />
        <MensajeError error={errores.hora_entrada} id={`${prefijoId}-hora_entrada-error`} />

        <label htmlFor={`${prefijoId}-hora_salida`}>{t('formPropiedad.horaSalida')}</label>
        <input type="time" {...propsCampo('hora_salida')} value={valores.hora_salida} required />
        <MensajeError error={errores.hora_salida} id={`${prefijoId}-hora_salida-error`} />

        <label htmlFor={`${prefijoId}-politica_cancelacion`}>{t('formPropiedad.politicaCancelacion')}</label>
        <textarea
          {...propsCampo('politica_cancelacion')}
          value={valores.politica_cancelacion}
          rows="3"
          maxLength={500}
          required
        />
        <MensajeError error={errores.politica_cancelacion} id={`${prefijoId}-politica_cancelacion-error`} />
      </fieldset>

      <fieldset>
        <legend>{t('formPropiedad.contactoLeyenda')}</legend>

        <label htmlFor={`${prefijoId}-contacto_telefono`}>{t('formPropiedad.contactoTelefono')}</label>
        <input type="tel" {...propsCampo('contacto_telefono')} value={valores.contacto_telefono} required />
        <MensajeError error={errores.contacto_telefono} id={`${prefijoId}-contacto_telefono-error`} />

        <label htmlFor={`${prefijoId}-contacto_correo`}>{t('formPropiedad.contactoCorreo')}</label>
        <input type="email" {...propsCampo('contacto_correo')} value={valores.contacto_correo} required />
        <MensajeError error={errores.contacto_correo} id={`${prefijoId}-contacto_correo-error`} />

        <label htmlFor={`${prefijoId}-imagenes`}>{t('formPropiedad.imagenes')}</label>
        <input
          type="file"
          {...propsCampo('imagenes')}
          accept=".jpg,.jpeg,.png,.webp"
          multiple
        />
        <p className="ayuda-campo">{t('formPropiedad.ayudaImagenes')}</p>
        <MensajeError error={errores.imagenes} id={`${prefijoId}-imagenes-error`} />

        <label htmlFor={`${prefijoId}-video`}>{t('formPropiedad.video')}</label>
        <input type="file" {...propsCampo('video')} accept=".mp4,.webm" />
        <p className="ayuda-campo">{t('formPropiedad.ayudaVideo')}</p>
        <MensajeError error={errores.video} id={`${prefijoId}-video-error`} />
      </fieldset>
    </>
  )
}
