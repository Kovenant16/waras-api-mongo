import Local from "../models/Local.js";


const agregarLocal = async (req, res) =>{
    

    try {
        const local = new Local(req.body);
        const localAlmacenado = await local.save()

        res.json(localAlmacenado)
        
    } catch (error) {
        console.log(error);
        
    }
}

export {agregarLocal}