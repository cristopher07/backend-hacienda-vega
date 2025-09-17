const nodemailer = require('nodemailer');

// Configuración del transporter (ajusta con tus credenciales SMTP reales)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'crisrosar9@gmail.com', // Tu correo Gmail
    pass: 'vogu lfzr pkub zala' // Genera en https://myaccount.google.com/apppasswords
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
    console.log("fields----: ", fields);
  const fecha = new Date().toLocaleString('es-MX');
  let tableRows = '';
  for (const [key, value] of Object.entries(fields)) {
    tableRows += `<tr><td style=\"border:1px solid #ccc;padding:4px;\">${key}</td><td style=\"border:1px solid #ccc;padding:4px;\">${value}</td></tr>`;
  }

  const htmlBody = `
    <h2>Notificación de acción: ${action}</h2>
    <p>Fecha: ${fecha}</p>
    <table style=\"border-collapse:collapse;\">
      <thead>
        <tr><th style=\"border:1px solid #ccc;padding:4px;\">Campo</th><th style=\"border:1px solid #ccc;padding:4px;\">Valor</th></tr>
      </thead>
      <tbody>
        ${tableRows}
      </tbody>
    </table>
  `;

  const mailOptions = {
    from: 'Hacienda Vega Notificaciones <crisrosar9@gmail.com>', // Nombre personalizado y correo real
    to,
    subject,
    html: htmlBody
  };

  try {
    return await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error enviando correo-----:', error);
    return { success: false, error: error.message };
  }
}

module.exports = { sendEmail };
