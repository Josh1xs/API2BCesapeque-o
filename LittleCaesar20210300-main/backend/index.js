import app from "./apps.js";
import "./database.js"

//Creo una funcion para ejecutar el servidor

async function main() {
  app.listen(4000)
  console.log("Servidor corriendo en el puerto 4000");
}

main();