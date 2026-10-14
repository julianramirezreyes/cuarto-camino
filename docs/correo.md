# Correo (verificación y recuperación de contraseña)

El correo sirve para dos cosas: **confirmar la dirección** al registrarse y **restablecer la contraseña**. Se envía por SMTP con
`nodemailer`; no depende de ningún proveedor concreto.

## Qué pasa con y sin SMTP

| Estado | Registro | Entrada | Recuperar contraseña |
| --- | --- | --- | --- |
| **Con** transporte de correo configurado | Se envía un enlace de confirmación; no hay sesión hasta abrirlo | Exige correo confirmado | «¿Olvidaste tu contraseña?» visible; `/cuenta/recuperar` envía el enlace |
| **Sin** SMTP (variables ausentes o incompletas) | Como antes: sesión inmediata, sin verificación | Sin exigir verificación | Sin enlace «¿Olvidaste…?»; `/cuenta/recuperar` explica que no está disponible |

Sin SMTP la app **no bloquea a nadie**, pero también queda con las limitaciones de `docs/cuentas.md` (correo sin confirmar,
sin recuperación). Para un lanzamiento público conviene configurar SMTP.

Cuentas creadas **antes** de activar el correo no están confirmadas: al intentar entrar verán «Tienes que confirmar tu correo» y el
botón «Reenviar correo».

## Configurar SMTP

Variables de entorno (todas obligatorias para activar el modo `smtp`):

| Variable | Significado |
| --- | --- |
| `SMTP_HOST` | Servidor SMTP del proveedor |
| `SMTP_PORT` | Puerto. `465` usa TLS implícito (`secure`); cualquier otro (p. ej. `587`) usa STARTTLS |
| `SMTP_USER` | Usuario SMTP |
| `SMTP_PASS` | Contraseña o clave SMTP |
| `EMAIL_FROM` | Remitente, p. ej. `Cuarto Camino <no-reply@tu-dominio.com>` (debe ser una dirección/dominio autorizado por el proveedor) |

Opcional: `EMAIL_TRANSPORT=smtp|outbox`. Sin definir, se usa `smtp` si las cinco variables están presentes; si no, el correo queda
desactivado. Un valor desconocido también lo desactiva.

Además deben estar bien `BETTER_AUTH_URL` y `APP_URL`: los enlaces del correo se construyen con `BETTER_AUTH_URL`.

### Proveedores habituales

Todos exponen los mismos campos; consulta en la documentación del proveedor los valores exactos de tu cuenta:

- **Resend (SMTP)**, **Brevo (SMTP)**: crea una clave/credencial SMTP en el panel, verifica tu dominio remitente y copia host, puerto,
  usuario y clave a las variables de arriba.
- **Gmail con contraseña de aplicación**: requiere verificación en dos pasos y una contraseña de aplicación; sirve para pruebas
  personales, no para producción con volumen.

## SPF, DKIM y DMARC

Para que los correos lleguen a la bandeja y no a spam, el dominio del remitente debe publicar los registros **SPF** y **DKIM** que
indique el proveedor y una política **DMARC**. Sin ellos, muchos proveedores descartan o marcan el correo. Verifica el dominio en el
panel del proveedor antes de lanzar.

## Outbox de desarrollo y pruebas

`EMAIL_TRANSPORT=outbox` no envía nada: añade cada mensaje, como una línea JSON, a `EMAIL_OUTBOX_FILE` (por defecto
`.tmp/outbox.jsonl`, ignorado por git). Sirve para abrir los enlaces en local y en pruebas automáticas.

- **Se niega a existir en producción**: con `NODE_ENV=production` el transporte lanza un error al construirse y el correo se
  considera desactivado.
- `GET /api/dev/outbox?to=<correo>` devuelve los últimos mensajes de esa dirección. Responde 404 en producción y cuando
  `EMAIL_TRANSPORT` no es `outbox`.
- El archivo contiene enlaces de un solo uso: trátalo como secreto, no lo subas ni lo compartas.

## Notas de seguridad

- Enlaces de verificación y de restablecimiento **caducan a la hora**. El de restablecimiento es de un solo uso.
- Al restablecer la contraseña se **cierran todas las sesiones** y se envía un aviso «Cambiaste tu contraseña».
- La solicitud de restablecimiento responde **igual** exista o no la cuenta; el reenvío de verificación también. El envío se hace
  después de responder (`after()` de Next.js, que en Vercel usa `waitUntil`), así que el tiempo de respuesta no delata si hubo envío
  y un SMTP lento no retrasa el registro.
- No se registran direcciones, cuerpos, enlaces ni textos de error del proveedor: solo el código genérico `email_send_failed`.
  Un fallo de envío no se muestra al usuario; puede pedir «Reenviar correo».
- Reenviar la verificación tiene un enfriamiento de 60 s en la interfaz, además del límite de tasa del servidor (por instancia).
- Sin imágenes remotas ni píxeles de seguimiento; todos los valores dinámicos van escapados en el HTML.
- La página `/cuenta/restablecer` recibe el token en la URL: envía `referrer: no-referrer` y el token solo se usa por POST.
