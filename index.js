const express = require("express");
const soap = require("soap");
const fs = require("fs");

const app = express();
app.use(express.json());

let productos = [
  { id: 1, nombre: "Laptop" },
  { id: 2, nombre: "Mouse" }
];

// GET - obtener todos
app.get("/api/productos", (req, res) => {
   res.json(productos);
});

// POST - agregar producto
app.post("/api/productos", (req, res) => {
   const nuevoProducto = req.body;
   productos.push(nuevoProducto);
   res.json({ mensaje: "Producto agregado" });
});

// PUT - actualizar producto
app.put("/api/productos/:id", (req, res) => {
   const id = parseInt(req.params.id);
   const producto = productos.find(p => p.id === id);

   if (producto) {
      producto.nombre = req.body.nombre;
      res.json({ mensaje: "Producto actualizado" });
   } else {
      res.status(404).json({ error: "Producto no encontrado" });
   }
});

// DELETE - eliminar producto
app.delete("/api/productos/:id", (req, res) => {
   const id = parseInt(req.params.id);
   productos = productos.filter(p => p.id !== id);
   res.json({ mensaje: "Producto eliminado" });
});

// SOAP
const service = {
  ProductoService: {
    ProductoPort: {
      ObtenerProducto: function(args) {
        const producto = productos.find(p => p.id == args.id);
        return {
          nombre: producto ? producto.nombre : "No encontrado"
        };
      }
    }
  }
};

const xml = fs.readFileSync("service.wsdl", "utf8");

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  soap.listen(app, "/soap", service, xml);
  console.log("Servidor corriendo en puerto " + PORT);
});
