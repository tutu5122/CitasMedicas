import axios from 'axios';
import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';
import chalk from 'chalk';
import moment from 'moment';

const app = express();

let usuarios = []

const usuariosFiltrados = ( infoUsuario ) => {
    const { gender, name:{first, last} } = infoUsuario
    //Cada usuario registrado debe tener un campo id único generado por el paquete UUID. 
    //Cada usuario debe tener un campo timestamp almacenando la fecha de registro obtenida y formateada por el paquete Moment.
    usuarios.push({
        Genero : gender,
        Nombre : first,
        Apellido : last,
        ID : uuidv4().slice(0,6),
        timestamp :  moment().format('MMMM Do YYYY, h:mm:ss a')
    })

    console.log(usuarios);
    //usando Lodash para dividir el arreglo en 2 separando los usuarios por sexo.
    return _.partition( usuarios, e => e.Genero == 'female' );
}


app.get('/', (req,res) =>{
    axios.get('https://randomuser.me/api/')
    //usando axios para consultar la data
    .then( (respuesta) => {
        const filtrados = usuariosFiltrados(respuesta.data.results[0]);
       
        //se debe devolverle al cliente una lista con los datos de todos los usuarios registrados
        let mensaje = `
        <h3>Mujeres :</h3>
        <ol>
            ${filtrados[0].map(usuario => `<li>Nombre: ${usuario.Nombre} - Apellido: ${usuario.Apellido} - ID: ${usuario.ID} - Timestamp: ${usuario.timestamp}</li>`).join('')}
        </ol>
        <h3>Hombres :</h3>
        <ol>
            ${filtrados[1].map(usuario => `<li>Nombre: ${usuario.Nombre} - Apellido: ${usuario.Apellido} - ID: ${usuario.ID} - Timestamp: ${usuario.timestamp}</li>`).join('')}
        </ol>`

        res.send(mensaje);

        //En cada consulta también se debe imprimir por la consola del servidor la misma lista de usuarios pero con fondo blanco y color de texto azul usando el paquete Chalk.
        console.log(chalk.bgWhite.blue('Lista de Usuarios en la Consola del Servidor:'));
        filtrados.flat().forEach(usuario => {
            console.log(chalk.bgWhite.blue(`Nombre: ${usuario.Nombre} - Apellido: ${usuario.Apellido} - ID: ${usuario.ID} - Timestamp: ${usuario.timestamp}`));
        });
    })
    .catch(error => {
        console.error('Error al obtener datos:', error);
        res.status(500).json({ error: 'Error al obtener datos' });
    });
});
       
app.listen(3000, ()=> console.log('Servidopr arriba en el puertpo 3000'))