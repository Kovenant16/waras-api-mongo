import Pedido from "../models/Pedido.js";

//testeo pendiente
const obtenerUltimosVeintePedidos = async (req, res) => {
    //Todo: Revisar si bota los 20 pedidos mas recientes
    const pedidos = await Pedido.find().limit(20);
    res.json(pedidos);
};

//completado
const obtenerPedidosNoEntregados = async (req, res) => {
    const pedidos = await Pedido.find({
        estadoPedido: ["pendiente", "recogido", "sin asignar", "en local"],
    });
    res.json(pedidos);
};

//completado
const obtenerPedidosMotorizadoLogueado = async (req, res) => {
    console.log(req.usuario);
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
        });
    if (!pedido) {
        return res.status(404).json({ msg: "Pedido no encontrado" });
    }

    //validacion de si es administrador o soporte
    if (
        !(req.usuario.rol === "Administrador" || req.usuario.rol === "Soporte")
    ) {
        const error = new Error("No permitido");
        return res.status(404).json({ msg: error.message });
    }
    //validacion de si el motorizado esta consultando su pedido
    if (!(req.usuario._id.toString() === pedido.driver._id.toString())) {
        const error = new Error("No permitido");
        return res.status(404).json({ msg: error.message });
    }

    res.json(pedido);
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
    if (
        !(req.usuario.rol === "Administrador" || req.usuario.rol === "Soporte")
    ) {
        const error = new Error("No permitido");
        return res.status(404).json({ msg: error.message });
    }

    pedido.fecha = req.body.fecha || pedido.fecha;
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
    if (
        !(req.usuario.rol === "Administrador" || req.usuario.rol === "Soporte")
    ) {
        const error = new Error("No permitido");
        return res.status(404).json({ msg: error.message });
    }

    try {
        await pedido.deleteOne()
        res.json({msg: "Pedido eliminado"})
    } catch (error) {
        console.log(error);
        
    }
};

const asignarMotorizado = async (req, res) => {};

const obtenerPedidosPorFecha = async(req, res) => {
    const {fecha} = req.body

    const pedidos = await Pedido.find({fecha})

    console.log(pedidos);
}

export {
    nuevoPedido,
    obtenerPedido,
    editarPedido,
    eliminarPedido,
    asignarMotorizado,
    obtenerPedidosMotorizadoLogueado,
    obtenerPedidosNoEntregados,
    obtenerUltimosVeintePedidos,
    obtenerPedidosPorFecha
};
