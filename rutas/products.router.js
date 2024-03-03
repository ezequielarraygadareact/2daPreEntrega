import express from 'express';
import { ProductManagerMongo } from '../dao/manejadores/ProductManagerMongo.js';

const router = express.Router()

const prct = new ProductManagerMongo();

router.get('/', async (req, res) => {
    try {
        const page = req.query.page ? parseInt(req.query.page) : 1;
        const limit = req.query.limit ? parseInt(req.query.limit) : 10;
        const sortOrder = req.query.sort ? req.query.sort : null;
        const category = req.query.category ? req.query.category : null;

        
        const result = await prct.getProducts(page, limit, sortOrder, category);

        res.render('products', {
            products: result.docs.map(product => product.toObject()),
            totalPages: result.totalPages,
            currentPage: result.page,
            hasNextPage: result.hasNextPage,
            hasPrevPage: result.hasPrevPage
        });
    } catch (error) {
        console.error("No se pudo actualizar el producto", error);
        res.status(500).send({ error: error.message });
    }
});

router.get('/products/:pid', async (req, res) => {
    let { pid } = req.params;
    let result = await prct.getProduct(pid);
        if (result) {
        res.send(`
            <h1>Detalle del Producto</h1>
            <table>
                <tr><th>Id:</th><td>${result._id}</td></tr>
                <tr><th>Título:</th><td>${result.title}</td></tr>
                <tr><th>Descripción:</th><td>${result.description}</td></tr>
                <tr><th>Código:</th><td>${result.code}</td></tr>
                <tr><th>Precio:</th><td>$${result.price}</td></tr>
                <tr><th>Estado:</th><td>${result.status}</td></tr>
                <tr><th>Stock:</th><td>${result.stock}</td></tr>
                <tr><th>Categoría:</th><td>${result.category}</td></tr>
                <tr><th>Imágen:</th><td>${result.thumbnail}</td></tr>
            </table>
        `)
        console.log('Producto encontrado');
    } else {
        res.send('Producto no encontrado');
    }
});

router.get('/:pid', async (req, res) => {
    let { pid } = req.params;
    let result = await prct.getProduct(pid);
    res.send({ result: "success", payload: result });
});

router.post("/", async (req, res) => {
    let { title, description, price, thumbnail, code, stock, category, status } = req.body;
    if (!title || !description || !price || !thumbnail || !code || !stock || !category || !status) {
        res.status(400).send({ status: "error", error: "Todos los campos son obligatorios" });
        return;
    }
    let result = await prct.addProduct({ title, description, price, thumbnail, code, stock, category, status });
    res.send({ result: "success", payload: result });
});

router.put("/:pid", async (req, res) => {
    try {
        let { pid } = req.params;
        let updatedProduct = req.body;
        let result = await prct.updateProduct(pid, updatedProduct);
        res.send({ result: "success", payload: result });
    } catch (error) {
        console.error("No se pudo actualizar el producto", error);
        res.status(500).send({ error: error.message });
    }
});

router.delete("/:pid", async (req, res) => {
    let { pid } = req.params;
    let result = await prct.deleteProduct(pid);
    res.send({ result: "success", payload: result });
});

export default router;