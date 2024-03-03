import { fileURLToPath } from 'url';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import express from 'express';
import mongoose from "mongoose";
import { dirname } from 'path';
import { ProductManager } from './dao/Manejadores/ProductManager.js';
import router from './rutas/products.router.js';
import cartRouter from './rutas/carts.router.js'
import routerRealTimesProducts from "./rutas/realTimeProducts.router.js";
import path from 'path';

const p = new ProductManager();

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express();
const port = 8080;

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname + "/public"))

app.use("/products", router)
app.use('/carts', cartRouter)
app.use("/realTimeProducts", routerRealTimesProducts)

app.use(express.static(__dirname + '/views'))
app.use(express.static(path.join(__dirname, 'public')));
app.engine("handlebars", handlebars.engine())
app.set("views", __dirname + '/views')
app.set('view engine', "handlebars")

const httpServer = app.listen(port, () => console.log("Express server On"))

const socketServer = new Server(httpServer)

socketServer.on("connection", (socket) => {
    console.log("Socket Server Ok")

    try {
        const products = p.getProducts();
        socketServer.emit("products", products);
    } catch (error) {
        socketServer.emit('response', { status: 'error', message: error.message });
    }


    socket.on("new-Product", async (newProduct) => {
        try {
            const objectProductNew = {
                title: newProduct.title,
                description: newProduct.description,
                code: newProduct.code,
                price: newProduct.price,
                status: newProduct.status,
                stock: newProduct.stock,
                category: newProduct.category,
                thumbnail: newProduct.thumbnail,

            }
            const pushProduct = p.addProduct(objectProductNew);
            const updatedListProd = p.getProducts();
            socketServer.emit("products", updatedListProd);
            socketServer.emit("response", { status: 'success', message: pushProduct });

        } catch (error) {
            socketServer.emit('response', { status: 'error', message: error.message });
        }
    })

    socket.on("delete-product", async (id) => {
        try {
            const pid = parseInt(id)
            const deleteProduct = p.deleteProduct(pid)
            socketServer.emit("products", deleteProduct)
            socketServer.emit('response', { status: 'success', message: "Se ha eliminado el producto" });
        } catch (error) {
            socketServer.emit('response', { status: 'error', message: error.message });
        }
    })

})


const environment = async () => {
    await mongoose.connect("mongodb+srv://EArraygada:Nico1993@arraygada1.vpmhvb3.mongodb.net/DB?retryWrites=true&w=majority")
        .then(() => {
            console.log("Se ha conectado correctamente a la DB")
        })
        .catch(error => {
            console.error("No se pudo conectar", error)
        })
}

environment();