import { Router } from "express";
import { LoginManagerMongo } from "../dao/manejadores/LoginManagerMongo.js";

const loginRouter = Router();
const userManager = new LoginManagerMongo();

loginRouter.get("/signup", async (req, res) => {
    res.render('signup');
});

loginRouter.get("/", async (req, res) => {
    res.render('login');
});

loginRouter.post("/signup", async (req, res) => {
    const { first_name, last_name, email, password } = req.body;

    if (!first_name || !last_name || !email || !password) {
        return res.status(400).json({ message: "Todos los campos son requeridos" });
    }

    try {
        await userManager.newUser(req.body);
        res.status(200).json({ message: "Usuario creado exitosamente" });
        return res.redirect('/')
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

loginRouter.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Todos los campos son requeridos" });
    }

    try {
        const user = await userManager.byEmail(email);
        if (password !== user.password) {
            return res.status(400).json({ message: "La contraseña no es válida" });
        }

        req.session.user = { email, first_name: user.first_name };
        res.status(200).json({ message: "Inicio de sesión exitoso" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

loginRouter.get("/signout", async (req, res) => {
    req.session.destroy(() => {
        res.status(200).json({ message: "Sesión cerrada exitosamente" });
    });
});

export default loginRouter;