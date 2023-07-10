import express from "express";
import {
    
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
    obtenerClientes
} from "../controllers/pedidoController.js";
import checkAuth from "../middleware/checkAuth.js";

const router = express.Router();

router.get("/", checkAuth, );
router.get("/motorizados",  obtenerMotorizados);
router.get("/locales", obtenerLocales)
router.get('/clientes/:telefono', obtenerClientes)
router.get("/ultimosVeintePedidos", checkAuth, obtenerUltimosVeintePedidos);
router.get("/pedidosNoEntregados", checkAuth, obtenerPedidosNoEntregados);
router.get("/pedidosMotorizado", checkAuth, obtenerPedidosMotorizadoLogueado);
router.post('/obtenerPedidosPorFecha', obtenerPedidosPorFecha)
router.post("/", checkAuth, nuevoPedido);
router
    .route("/:id")
    .get(checkAuth, obtenerPedido)
    .put(checkAuth, editarPedido)
    .delete(checkAuth, eliminarPedido);

export default router;
