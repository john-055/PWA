
var url = window.location.href;
var swLocation = '/PWA/sw.js';


if ( navigator.serviceWorker ) {


    if ( url.includes('localhost') ) {
        swLocation = '/sw.js';
    }

    navigator.serviceWorker.register( swLocation );
}





// Referencias de jQuery

var cancelarBtn = $('#cancel-btn');
var postBtn     = $('#post-btn');
var txtComentario = $('#comentario');
var txtname  = $('#nombre');
var timeline    = $('#timeline');



function crearMensajeHTML(nombre, comentario, foto) {

    // console.log(mensaje, personaje, lat, lng);

    var content =`
    <div class="col-md-6 col-lg-4 mb-5">
        <div class="portfolio-item mx-auto" >
            <div class="portfolio-item-caption d-flex align-items-center justify-content-center h-100 w-100">
                <div class="portfolio-item-caption-content"><p>Nombre: ${nombre} <br> Comento: ${comentario} </p></div>
            </div>`;
            if ( foto ) {
                content += `
                        <br>
                        <img class="img-fluid" src="${foto}" alt="..." />
                `;
            }
            content += `</div>
            </div>
            `;

    timeline.prepend(content);
    cancelarBtn.click();

}

// Boton de enviar mensaje
postBtn.on('click', function() {

    var nombre = txtname.val();
    var comentario = txtComentario.val();
    if ( nombre.length === 0 ) {

        return;
    }
    if ( comentario.length === 0 ) {
        
        return;
    }

    var data  = {
        nombre,
        comentario,
        foto
    }

    fetch("/api", {
        method : "POST",
        headers : {
            "Content-Type" : "application/json"
        },
        body : JSON.stringify( data )
    })
    .then( resp => resp.json() )
    .then( resp => console.log("funciona:", resp))
    .catch( error => console.log("Falla: ", error) );

    crearMensajeHTML( nombre, comentario, foto );

});

function listarMensajes() {

    fetch("/api")
        .then(resp => resp.json() )
        .then(datos => {
            console.log( datos );
            datos.forEach(coment => {
                crearMensajeHTML( coment.nombre, coment.comentario, coment.foto );
            });
        });

}

function verificarConexion(){
    if(navigator.onLine){
        console.log("Si hay Conexion");
    }
    else{
        console.log("No hay conexion");
    }
}

listarMensajes();
window.addEventListener("online", verificarConexion);
window.addEventListener("offline", verificarConexion);

var foto = null;



//Camara 
var btnPhoto = $("#photo-btn");
var btnTomarFoto = $("#tomar-foto-btn");
var contenedorCamara = $(".camara-contenedor");

const camara = new Camara($("#player")[0]);

btnPhoto.on("click", () => {

    console.log("boton camara");
    contenedorCamara.removeClass("oculto");
    camara.encender();
});

btnTomarFoto.on("click", () => {

    console.log("boton tomar foto");
    foto = camara.tomaraFoto();
    console.log(foto);
    camara.apagar();

});