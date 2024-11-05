// Carga de los módulos
const express = require('express')
const app = express()

// Módulo parar las rutas
const path = require('node:path')

// Obtener el numero del puerto
process.loadEnvFile()
const PORT = process.env.PORT
// console.log(PORT);

// Cargar los datos
const datos = require('../data/ebooks.json')
// console.log(datos);

// Indicar la ruta de los ficheros estáticos
app.use(express.static(path.join(__dirname, "../public")))

// Ruta Home = Raíz
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html")
    // console.log("Estamos en /");
})

// Ruta API Global
app.get("/api", (req, res) => {
    res.json(datos)
})


// Ruta: /api - Devuelve todos los autores, ordenados por apellido
app.get("/api/apellido/:apellido", (req, res) => {
    const apellido = req.params.apellido;
    const autores = datos.filter((autor) =>
        autor.autor_apellido.toLowerCase().includes(apellido.toLowerCase())
    );

    if (autores.length == 0) {
        return res.status(404).send("Autor no encontrado");
    }
    res.json(autores);
});

 // Ruta: /api/nombre_apellido/[nombre]/[apellido] - Devuelve autores por nombre y apellido
 app.get("/api/nombre_apellido/:nombre/:apellido", (req, res) => {
    const nombre = req.params.nombre;
    const apellido = req.params.apellido;
    const autor = datos.filter(
        (autor) =>
            autor.autor_nombre.toLowerCase() === nombre.toLowerCase() &&
            autor.autor_apellido.toLowerCase() === apellido.toLowerCase()
    );

    // Verifica si el array está vacío
    if (autor.length === 0) {
        return res.status(404).send("Autor no encontrado");
    }
    res.json(autor);
});

 // Ruta: /api/nombre?apellido=[primeras letras del apellido] - Devuelve autores con nombre y primeras letras del apellido
app.get('/api/nombre/:nombre', (req, res) => {
    const nombre = req.params.nombre;
    const apellidoInicio = req.query.apellido;
  
    if (apellidoInicio) {
      return res.status(404).json("Autor no encontrado" );
    }
  
    const autoresFiltrados = autores.filter(autor =>
      autor.nombre.toLowerCase() == nombre.toLowerCase() &&
      autor.apellido.toLowerCase().startsWith(apellidoInicio.toLowerCase())
    );
     res.json(autoresFiltrados);
  });

 
  // Devuelve la lista de las obras editadas en el año indicado.
//Por ejemplo : /api/edicion/2022

app.get("/api/edicion/:year", (req, res) => {
    const year = req.params.year;

    const editionYear = datos.flatMap((autor) =>
        autor.obras.filter((obra) => obra.edicion == year)
    );
    // console.log(filtroAño);

    if (editionYear.length == 0) {
        return res.status(404).send(`No hay ninguna obra con el año ${year}`);
    }
    res.json(editionYear);
});
   




 // Cargar la página 404
// app.use((req, res) => res.status(404).sendFile(path.join(__dirname, "../public", "404.html")))
 

// Poner el puerto en escucha
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))