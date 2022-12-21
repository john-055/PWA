
importScripts("js/pouchdb-7.3.1.min.js");
importScripts("js/sw-db.js");

importScripts("js/sw-utils.js");

const CACHE_STATIC_NAME = "pwa-static-v1";
const CACHE_DYNAMIC_NAME = "pwa-dynamic-v1";
const CACHE_INMUTABLE_NAME = "pwa-inmutable-v1";

const APP_SHELL = [
    "/",
    "index.html",
    "acerca.html",
    "comentario.html",
    "contacto.html",
    "img/img5.jpg",
    "img/img2.jpg",
    "img/img3.jfif",
    "img/img4.png",
    "js/scripts.js",
    "index2.html",
    "css/style.css",
    "img/favicon.ico",
    "js/app.js",
    "js/sw-utils.js",
    "js/sw-db.js",
    "js/camara-class.js",

];

const APP_SHELL_INMUTABLE = [
    "https://fonts.googleapis.com/css?family=Quicksand:300,400",
    "https://fonts.googleapis.com/css?family=Lato:400,300",
    //"https://use.fontawesome.com/releases/v5.3.1/css/all.css",
    "https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.7.0/animate.css",
    "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js",
    "js/pouchdb-7.3.1.min.js",
    "https://cdn.startbootstrap.com/sb-forms-latest.js",
    "https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js",
    "https://fonts.googleapis.com/css?family=Nunito:200,200i,300,300i,400,400i,600,600i,700,700i,800,800i,900,900i",
    "https://fonts.googleapis.com/css?family=Varela+Round"
];

self.addEventListener("install", (evento) => {
    const cacheEstatico = caches.open(CACHE_STATIC_NAME).then((cache) => {
        return cache.addAll(APP_SHELL);
    });

    const cacheInmutable = caches.open(CACHE_INMUTABLE_NAME).then((cache) => {
        return cache.addAll(APP_SHELL_INMUTABLE);
    });

    evento.waitUntil(Promise.all([cacheEstatico, cacheInmutable]));
});

self.addEventListener("activate", (evento) => {
    const respuesta = caches.keys().then((llaves) => {
        llaves.forEach((llave) => {
        if (llave !== CACHE_STATIC_NAME && llave.includes("static")) {
            return caches.delete(llave);
        }

        if (llave !== CACHE_DYNAMIC_NAME && llave.includes("dynamic")) {
            return caches.delete(llave);
        }
        });
    });

    evento.waitUntil(respuesta);
});

self.addEventListener("fetch", (evento) => {

    let respuesta;
    if( evento.request.url.includes("/api") ){

        respuesta = manejarPeticionesApi(CACHE_DYNAMIC_NAME, evento.request);

    }else{

        respuesta = caches.match(evento.request).then((res) => {
            if (res) {
                verificarCache(CACHE_STATIC_NAME, evento.request, APP_SHELL_INMUTABLE);
                return res;

            } else {
                return fetch(evento.request).then((newRes) => {
                    return actualizaCache(CACHE_DYNAMIC_NAME, evento.request, newRes);
                });
            } 
    });
    }

    evento.respondWith(respuesta);
});


self.addEventListener("sync", evento => {
    console.log("Sw: sync");

    if(evento.tag == "nuevo-mensaje"){
        const respuesta = enviarMensajes();
        evento.waitUntil(respuesta);
    }
});