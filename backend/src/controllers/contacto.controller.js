import nodemailer from "nodemailer";
import { pool } from "../config/db.js";

export const enviarCorreoContacto = async (req, res) => {
  const { nombre, apellido, email, asunto, mensaje } = req.body;
  let conn;

  try {
    conn = await pool.getConnection();

    // Ejecutamos la inserción
    await conn.query(
      "INSERT INTO contactos (nombre, apellido, email, asunto, mensaje) VALUES (?, ?, ?, ?, ?)",
      [nombre, apellido, email, asunto, mensaje]
    );

    console.log("✅ Mensaje guardado en la Base de Datos");

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"${nombre} ${apellido}" <${email}>`,
      to: "soporte.tiendamiaow@gmail.com",
      subject: `📩 Nuevo Mensaje Web: ${asunto}`,
      html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 10px; overflow: hidden;">
                    <div style="background-color: #8f74c5; padding: 20px; text-align: center; color: white;">
                        <h1>Nuevo Contacto Web😺</h1>
                    </div>
                    <div style="padding: 20px; background-color: #f9f9f9;">
                        <p><strong>De:</strong> ${nombre} ${apellido}</p>
                        <p><strong>Email:</strong> ${email}</p>
                        <p><strong>Asunto:</strong> ${asunto}</p>
                        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                        <h3>Mensaje:</h3>
                        <p style="background-color: white; padding: 15px; border-radius: 5px; border: 1px solid #eee;">
                            ${mensaje}
                        </p>
                    </div>
                    <div style="background-color: #2a213a; padding: 10px; text-align: center; color: #888; font-size: 12px;">
                        Mensaje guardado en base de datos y enviado por correo.
                    </div>
                </div>
            `,
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Correo enviado exitosamente");

    res.status(200).json({
      status: "ok",
      message:
        "¡Mensaje recibido! Se guardó en nuestro sistema y te responderemos pronto.",
    });
  } catch (error) {
    console.error("❌ Error en el proceso de contacto:", error);
    res.status(500).json({
      status: "error",
      message: "Hubo un error al procesar tu solicitud.",
    });
  } finally {
    if (conn) conn.release();
  }
};
