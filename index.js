import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import conectarDB from "./config/db.js";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import pedidoRoutes from "./routes/pedidoRoutes.js";
import localRoutes from "./routes/localRoutes.js";
import clienteRoutes from "./routes/clienteRoutes.js";

const app = express();
app.use(express.json());
dotenv.config();
conectarDB();

//cors

//const whitelist = [process.env.FRONTEND_URL];

const whitelist = ['https://admin.warasdelivery.com', "http://localhost:5173"];



//Cors con acceso a un dominio

// const corsOptions = {
//     origin: function (origin, callback) {

//         if (whitelist.includes(origin)) {
//             callback(null, true);
//         } else {
//             callback(new Error("Error de cors de aca"));
//         }
//     },
// };


// app.use(cors({
//     origin: 'https://admin.warasdelivery.com'
//   }));

//   app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', 'https://admin.warasdelivery.com');
//     next();
//   });


//cors con acceso a todos
app.use(cors())



//Routing
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/pedidos", pedidoRoutes);
app.use("/api/locales", localRoutes);
app.use("/api/clientes", clienteRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`servidor corriendo en el puerto ${PORT}`);
});
