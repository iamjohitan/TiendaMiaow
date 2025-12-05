import nodemailer from "nodemailer";
import { pool } from "../config/db.js";

export const enviarCorreoContacto = async (req, res) => {
  const { nombre, apellido, email, asunto, mensaje } = req.body;
  let conn;

  try {
    // 1. GUARDAR EN DB (Esto ya te funciona)
    conn = await pool.getConnection();
    await conn.query(
      "INSERT INTO contactos (nombre, apellido, email, asunto, mensaje) VALUES (?, ?, ?, ?, ?)",
      [nombre, apellido, email, asunto, mensaje]
    );
    console.log("✅ Mensaje guardado en DB");

    // 2. INTENTAR ENVIAR CORREO
    try {
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com", // Servidor explícito
        port: 465, // Puerto seguro (SSL)
        secure: true, // TRUE es obligatorio para el puerto 465
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
        // Esto ayuda a evitar problemas de timeouts en algunas redes
        tls: {
          rejectUnauthorized: false,
        },
      });

      const mailOptions = {
        from: `"${nombre} ${apellido}" <${email}>`,
        to: "soporte.tiendamiaow@gmail.com", // A dónde llega
        replyTo: email,
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
      console.log("✅ Correo enviado");
    } catch (mailError) {
      // Si el correo falla, solo lo registramos en consola, NO detenemos el proceso
      console.error(
        "⚠️ Error enviando correo (pero se guardó en DB):",
        mailError
      );
    }

    // 3. RESPONDER AL CLIENTE (Siempre exitoso porque se guardó en DB)
    res.status(200).json({
      status: "ok",
      message: "¡Mensaje recibido! Nos pondremos en contacto pronto.",
    });
  } catch (error) {
    console.error("❌ Error general:", error);
    res.status(500).json({ status: "error", message: "Error en el servidor." });
  } finally {
    if (conn) conn.release();
  }
};
