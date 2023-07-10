import twilio from "twilio";

const accountSid = 'AC91d5a2d4bd26b57833d26c65d4a75a6c';
const authToken = '1b623ebe9984655f5a58859c7b4a6787';

const client = twilio(accountSid, authToken);

export const createSMS = (datos) => {

    const { email, nombre, token, telefono } = datos;
    client.messages
    .create({
        body: `Hola ${nombre}, ingresa al siguiente link para verificar tu cuenta warasdelivery.com/confirmar/${token} `,
        from: 'whatsapp:+14155238886',
        to: 'whatsapp:+51949972514'
    })
    .then(message => console.log('whatsapp enviado'))
};

/*client.messages.create({
    body: `Hola ${nombre}, ingresa al siguiente link para verificar tu cuenta, ${process.env.FRONTEND_URL}/confirmar/${token} `,
    from:"whatsapp:+13613143425",
    to: `whatsapp:+51${telefono}`,
}).then((message) => console.log("whatsapp enviado"))*/
