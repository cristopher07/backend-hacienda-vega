const nodemailer = require('nodemailer');

// Configuración del transporter (ajusta con tus credenciales SMTP reales)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'neansanchez@gmail.com', // Tu correo Gmail
    pass: 'qcaz sjva udug qzrl' // Genera en https://myaccount.google.com/apppasswords
  }
});

/**
 * Envía un correo con los datos en formato tabla HTML
 * @param {Object} options
 * @param {string} options.to - Correo destino
 * @param {string} options.subject - Asunto del correo
 * @param {string} options.action - Tipo de acción (create, update, delete)
 * @param {Object} options.fields - Campos a mostrar en la tabla
 */
async function sendEmail({ to, subject, action, fields }) {
  const fecha = new Date().toLocaleString('es-GT');

  let tableRows = '';
  for (const [key, value] of Object.entries(fields)) {
    tableRows += `
      <tr>
        <td style="padding:10px;border-bottom:1px solid #eee;font-weight:600;color:#555;">
          ${key}
        </td>
        <td style="padding:10px;border-bottom:1px solid #eee;color:#333;">
          ${value ?? '-'}
        </td>
      </tr>
    `;
  }

  const htmlBody = `
  <!DOCTYPE html>
  <html lang="es">
  <head>
    <meta charset="UTF-8" />
    <title>${subject}</title>
  </head>
  <body style="margin:0;padding:0;background-color:#f4f6f8;font-family:Arial, Helvetica, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding:30px 15px;">
          
          <!-- CONTENEDOR -->
          <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:6px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,0.08);">

            <!-- HEADER -->
            <tr>
              <td style="background:#1976d2;padding:20px;text-align:center;">
                <h1 style="margin:0;font-size:22px;color:#ffffff;">
                  Hacienda La Vega
                </h1>
                <p style="margin:5px 0 0;color:#e3f2fd;font-size:14px;">
                  Notificación del sistema
                </p>
              </td>
            </tr>

            <!-- BODY -->
            <tr>
              <td style="padding:25px;">
                <h2 style="margin-top:0;color:#333;font-size:18px;">
                  Acción realizada: <span style="color:#1976d2;">${action.toUpperCase()}</span>
                </h2>

                <p style="margin:5px 0 20px;color:#666;font-size:14px;">
                  Fecha y hora: <strong>${fecha}</strong>
                </p>

                <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                  <thead>
                    <tr>
                      <th style="text-align:left;padding:10px;background:#f5f5f5;border-bottom:2px solid #ddd;color:#555;">
                        Campo
                      </th>
                      <th style="text-align:left;padding:10px;background:#f5f5f5;border-bottom:2px solid #ddd;color:#555;">
                        Valor
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    ${tableRows}
                  </tbody>
                </table>
              </td>
            </tr>

            <!-- FOOTER -->
            <tr>
              <td style="background:#fafafa;padding:15px;text-align:center;">
                <p style="margin:0;font-size:12px;color:#999;">
                  Este correo fue generado automáticamente por el sistema.
                </p>
                <p style="margin:5px 0 0;font-size:12px;color:#999;">
                  © ${new Date().getFullYear()} Hacienda La Vega
                </p>
              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>
  </body>
  </html>
  `;

  const mailOptions = {
    from: '"Hacienda La Vega" <neansanchez@gmail.com>',
    to,
    subject,
    html: htmlBody,
  };

  try {
    return await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error enviando correo:', error);
    return { success: false, error: error.message };
  }
}


module.exports = { sendEmail };
