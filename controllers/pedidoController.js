import Pedido from "../models/Pedido.js";
import Usuario from "../models/Usuario.js";
import Local from "../models/Local.js";
import Cliente from "../models/Cliente.js";

//testeo pendiente
const obtenerUltimosVeintePedidos = async (req, res) => {
    //Todo: Revisar si bota los 20 pedidos mas recientes
    const pedidos = await Pedido.find()
        .populate(
            "driver",
            "-confirmado -createdAt -habilitado -password -telefono -token -updatedAt -__v"
        )
        .populate(
            "generadoPor",
            "-confirmado -createdAt -habilitado -password -telefono -token -updatedAt -__v"
        )
        .populate(
            "local",
            "-colaboradores -createdAt -direccion -gps -habilitado -telefonoUno -updatedAt -__v"
        )
        .limit(20);
    res.json(pedidos);
};

//completado
const obtenerPedidosNoEntregados = async (req, res) => {
    const pedidos = await Pedido.find({
        estadoPedido: ["pendiente", "recogido", "sin asignar", "en local"],
    })
        .populate(
            "driver",
            "-confirmado -createdAt -habilitado -password -telefono -token -updatedAt -__v"
        )
        .populate(
            "generadoPor",
            "-confirmado -createdAt -habilitado -password -telefono -token -updatedAt -__v"
        )
        .populate(
            "local",
            "-colaboradores -createdAt -direccion -gps -habilitado -telefonoUno -updatedAt -__v"
        )
        .select(
            "-createdAt -gpsCreacion -horaCreacion -medioDePago -updatedAt -__v"
        );
    res.json(pedidos);
};

//completado
const obtenerPedidosMotorizadoLogueado = async (req, res) => {
    const pedidos = await Pedido.find({
        estadoPedido: ["pendiente", "recogido", "sin asignar", "en local"],
    })
        .where("driver")
        .equals(req.usuario);

    res.json(pedidos);
};

//completado
const nuevoPedido = async (req, res) => {
    const pedido = new Pedido(req.body);

    pedido.generadoPor = req.usuario._id;

    try {
        const proyectoAlmacenado = await pedido.save();
        res.json(proyectoAlmacenado);
    } catch (error) {
        console.log(error);
    }
};

//completado, acepta mejoras
const obtenerPedido = async (req, res) => {
    const { id } = req.params;

    const pedido = await Pedido.findById(id)
        .populate({
            path: "driver",
            populate: {
                path: "organizacion",
                select: "-direccion -gps -telefonoUno -colaboradores -habilitado -createdAt -updatedAt -__v",
            },
            select: "-password -confirmado -habilitado -token -createdAt -updatedAt -__v",
        })
        .populate({
            path: "generadoPor",
            select: "-password -confirmado -rol -habilitado -token -createdAt -updatedAt -__v",
            populate: {
                path: "organizacion",
                select: "-direccion -gps -telefonoUno -colaboradores -habilitado -createdAt -updatedAt -__v",
            },
        })
        .populate({
            path: "local",
            select: "-createdAt -habilitado -updatedAt",
        })
        .populate({
            path: "cliente",
            select: "",
        });
    if (!pedido) {
        return res.status(404).json({ msg: "Pedido no encontrado" });
    }

    //validacion de si es administrador o soporte
    if (
        req.usuario.rol.toString() == "administrador" ||
        req.usuario.rol.toString() == "soporte"
    ) {
        return res.json(pedido);
    }

    //validacion de si el motorizado esta consultando su pedido
    if (req.usuario._id.toString() === pedido.driver._id.toString()) {
        return res.json(pedido);
    }
};

//completado
const editarPedido = async (req, res) => {
    const { id } = req.params;

    const pedido = await Pedido.findById(id);

    if (!pedido) {
        const error = new Error("Pedido no encontrado");
        return res.status(404).json({ msg: error.message });
    }

    //validacion de si es administrador o soporte
    // if (
    //     !(req.usuario.rol === "Administrador" || req.usuario.rol === "Soporte")
    // ) {
    //     const error = new Error("No permitido");
    //     return res.status(404).json({ msg: error.message });
    // }

    pedido.fecha = req.body.fecha || pedido.fecha;
    pedido.local = req.body.local || pedido.local;
    pedido.hora = req.body.hora || pedido.hora;
    pedido.direccion = req.body.direccion || pedido.direccion;
    pedido.gps = req.body.gps || pedido.gps;
    pedido.detallePedido = req.body.detallePedido || pedido.detallePedido;
    pedido.tipoPedido = req.body.tipoPedido || pedido.tipoPedido;
    pedido.telefono = req.body.telefono || pedido.telefono;
    pedido.cobrar = req.body.cobrar || pedido.cobrar;
    pedido.delivery = req.body.delivery || pedido.delivery;
    pedido.comVenta = req.body.comVenta || pedido.comVenta;
    pedido.medioDePago = req.body.medioDePago || pedido.medioDePago;
    pedido.driver = req.body.driver || pedido.driver;
    pedido.estadoPedido = req.body.estadoPedido || pedido.estadoPedido;

    try {
        const pedidoAlmacenado = await pedido.save();
        res.json(pedidoAlmacenado);
    } catch (error) {
        console.log(error);
    }
};

//completado
const eliminarPedido = async (req, res) => {
    const { id } = req.params;

    const pedido = await Pedido.findById(id);

    if (!pedido) {
        const error = new Error("Pedido no encontrado");
        return res.status(404).json({ msg: error.message });
    }

    //validacion de si es administrador o soporte
    if (req.usuario.rol === "Administrador" || req.usuario.rol === "Soporte") {
        const error = new Error("No permitido");
        return res.status(404).json({ msg: error.message });
    }

    try {
        await pedido.deleteOne();
        res.json({ msg: "Pedido eliminado" });
    } catch (error) {
        console.log(error);
    }
};

const asignarMotorizado = async (req, res) => {};

const obtenerPedidosPorFecha = async (req, res) => {
    const {fecha} = req.body;
    const pedidos = await Pedido.find({fecha}).populate("driver")

    res.json(pedidos)
    
};

const obtenerMotorizados = async (req, res) => {
    const motorizados = await Usuario.find({ rol: "motorizado" }).select(
        " -createdAt   -password -rol -token -updatedAt -__v "
    );

    res.json(motorizados);
};

const obtenerLocales = async (req, res) => {
    const locales = await Local.find({ habilitado: true }).select(
        " -colaboradores  -createdAt -updatedAt -__v"
    );

    res.json(locales);
};

const obtenerClientes = async (req, res) => {
    const { telefono } = req.body.telefono;
    const clientes = await Cliente.find({});

    console.log(telefono);

    res.json(clientes);
};

export {
    nuevoPedido,
    obtenerPedido,
    editarPedido,
    eliminarPedido,
    asignarMotorizado,
    obtenerPedidosMotorizadoLogueado,
    obtenerPedidosNoEntregados,
    obtenerUltimosVeintePedidos,
    obtenerPedidosPorFecha,
    obtenerMotorizados,
    obtenerLocales,
    obtenerClientes,
};
