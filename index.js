const express = require("express");
const soap = require("soap");
const fs = require("fs");

const app = express();
app.use(express.json());

let productos = [
  { id: 1, nombre: "Laptop" },
  { id: 2, nombre: "Mouse" }
];

// REST
app.get("/api/productos", (req, res) => {
  res.json(productos);
});

app.post("/api/productos", (req, res) => {
  const nuevo = {
    id: productos.length + 1,
    nombre: req.body.nombre
  };
  productos.push(nuevo);
  res.status(201).json(nuevo);
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
