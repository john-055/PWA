function notifyMe() {
    //Vamos a comprobar si el navegador es compatible con las notificaciones
    if (!("Notification" in window)) {
        alert("This browser does not support desktop notification");
    }
    // Vamos a ver si ya se han concedido permisos de notificación
    else if (Notification.permission === "granted") {
        // Si está bien vamos a crear una notificación
        var body = "Hola, Esta es una notificacion push";
        var icon = "";
        var title = "Notificación";
        var options = {
            body: body,
            icon: icon,
            lang: "ES",
            renotify: "true"
        }
        var notification = new Notification(title,options);
        notification.onclick = function () {
            //action
        };
        setTimeout(notification.close.bind(notification), 5000);
    }
    // De lo contrario, tenemos que pedir permiso al usuario
    else if (Notification.permission !== 'denied') {
        Notification.requestPermission(function (permission) {
            // Si el usuario acepta, vamos a crear una notificación
            if (permission === "granted") {
                var notification = new Notification("Gracias, Ahora podras recibir notifiaciones de nuestra página");
            }
        });
    }
    // Por fin, si el usuario ha denegado notificaciones, y usted
    // Quiere ser respetuoso no hay necesidad de preocuparse más sobre ellos.
}