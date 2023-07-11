import Usuario from "../models/Usuario.js";
import generarId from "../helpers/generarId.js";
import generarJWT from "../helpers/generarJWT.js";
import { createSMS } from "../helpers/sms.js";
import { emailRegistro, emailOlvidePassword } from "../helpers/email.js";

const registrarUsuario = async (req, res) => {
    //evitar registros duplicados
    const { email } = req.body;
    const existeUsuario = await Usuario.findOne({ email });

    if (existeUsuario) {
        const error = new Error("Usuario ya registrado");
        return res.status(400).json({ msg: error.message });
    }

    try {
        const usuario = new Usuario(req.body);
        //le asignamos un token:
        usuario.token = generarId();
        await usuario.save();
        //enviar el email de confirmacion
        /*createSMS({
            email: usuario.email,
            nombre:usuario.nombre,
            token:usuario.token,
            telefono:usuario.telefono
        })
        */
        emailRegistro({
            email: usuario.email,
            nombre: usuario.nombre,
            token: usuario.token,
            telefono: usuario.telefono,
        });
        res.json({
            msg: "Usuario creado correctamente, te hemos enviado un email para que confirmes tu cuenta",
        });
    } catch (error) {
        console.log(error);
    }
};

const autenticarUsuarioAdmin = async (req, res) => {
    const { email, password } = req.body;

    //comprobar si el usuario existe
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
        const error = new Error("El usuario no existe");
        return res.status(404).json({ msg: error.message });
    }

    //comprobar si el usuario esta confirmado
    if (!usuario.confirmado) {
        const error = new Error("Tu cuenta no ha sido confirmada");
        return res.status(403).json({ msg: error.message });
    }

    //comprobar si el usuario esta habilitado
    if (!usuario.habilitado) {
        const error = new Error("Tu cuenta aun no ha sido habilitada");
        return res.status(403).json({ msg: error.message });
    }

    //comprobar si el usuario es admin o soporte
    if (usuario.rol !== "administrador" && usuario.rol !== "soporte") {
        const error = new Error("No estas habilitado para esta plataforma");
        return res.status(403).json({ msg: error.message });
    }

    //comprobar password
    if (await usuario.comprobarPassword(password)) {
        res.json({
            _id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            token: generarJWT(usuario._id),
        });
    } else {
        const error = new Error("El password es incorrecto");
        return res.status(403).json({ msg: error.message });
    }
};

const confirmarUsuario = async (req, res) => {
    const { token } = req.params;
    const usuarioConfirmar = await Usuario.findOne({ token });
    if (!usuarioConfirmar) {
        const error = new Error("Token no valido");
        return res.status(403).json({ msg: error.message });
    }
    try {
        usuarioConfirmar.token = "";
        usuarioConfirmar.confirmado = true;
        usuarioConfirmar.habilitado = true;
        await usuarioConfirmar.save();
        res.json({ msg: "Usuario confirmado correctamente" });
    } catch (error) {
        console.log(error);
    }
};

const olvidePassword = async (req, res) => {
    const { email } = req.body;

    //comprobar si el usuario existe
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
        const error = new Error("El usuario no existe");
        return res.status(404).json({ msg: error.message });
    }

    try {
        usuario.token = generarId();
        await usuario.save();
        //enviar el email
        emailOlvidePassword({
            email: usuario.email,
            nombre: usuario.nombre,
            token: usuario.token,
            telefono: usuario.telefono,
        })
        res.json({ msg: "Te hemos enviado un email con las instrucciones, revisa tu correo" });
    } catch (error) {
        console.log(error);
    }
};

const comprobarToken = async (req, res) => {
    const { token } = req.params;
    const tokenValido = await Usuario.findOne({ token });

    if (tokenValido) {
        res.json({ msg: "Token valido y usuario existe" });
    } else {
        const error = new Error("Token no valido");
        return res.status(404).json({ msg: error.message });
    }
};

const nuevoPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    const usuario = await Usuario.findOne({ token });

    if (usuario) {
        usuario.password = password;
        usuario.token = "";
        try {
            await usuario.save();
            res.json({ msg: "Password modificado correctamente" });
        } catch (error) {
            console.log(error);
        }
    } else {
        const error = new Error("Token no valido");
        return res.status(404).json({ msg: error.message });
    }
};

const toggleHabilitarUsuario = async(req, res) => {
   
}

const perfil = async (req, res) => {
    const { usuario } = req;

    res.json(usuario);
};

export {
    registrarUsuario,
    autenticarUsuarioAdmin,
    confirmarUsuario,
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    perfil,
};
