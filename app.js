// Cantidad de noticias a mostrar por página
let cantidadNoticias = 7;
let pageFinal = cantidadNoticias;
let pageInicial = 0;
let temaActual = "Tecnología";

// Objeto para gestionar la carga de noticias desde la API
let noticias = {
    apiKey: "76c9861cc7944a1b87fcc3ed4542ae5f", // Clave de acceso a la API de noticias
    fetchNoticias: function (categoria) {
        fetch(
            `https://newsapi.org/v2/everything?q=${categoria}&language=es&apiKey=${this.apiKey}`
        )
        .then(response => response.json())
        .then(data => this.displayNoticias(data));
    },

    // Muestra las noticias obtenidas de la API en la interfaz
    displayNoticias: function (data) {
        if (pageInicial == 0) {
            document.querySelector(".container-noticias").innerHTML = ""; // Limpia noticias anteriores
        }

        // Itera sobre las noticias recibidas y las agrega al DOM
        for (let i = pageInicial; i < Math.min(pageFinal, data.articles.length); i++) {
            const { title, urlToImage, publishedAt, source, url } = data.articles[i];

            let item = document.createElement("div");
            item.className = "item";
            item.onclick = () => window.location.href = url; // Redirige a la noticia original

            let h2 = document.createElement("h2");
            h2.textContent = title;

            if (urlToImage) { // Verifica si hay imagen disponible
                let img = document.createElement("img");
                img.src = urlToImage;
                item.appendChild(img);
            }

            let info_item = document.createElement("div");
            info_item.className = "info_item";

            let fecha = document.createElement("span");
            fecha.className = "fecha";
            fecha.textContent = publishedAt.split("T")[0].split("-").reverse().join("-");

            let fuente = document.createElement("span");
            fuente.className = "fuente";
            fuente.textContent = source.name;

            info_item.appendChild(fecha);
            info_item.appendChild(fuente);

            item.appendChild(h2);
            item.appendChild(info_item);
            document.querySelector(".container-noticias").appendChild(item);
        }

        // Agrega un botón "Ver más" si hay más noticias disponibles
        if (!document.querySelector("#btnSiguiente") && pageFinal < data.articles.length) {
            let btnSiguiente = document.createElement("span");
            btnSiguiente.id = "btnSiguiente";
            btnSiguiente.textContent = "Ver más";
            btnSiguiente.onclick = siguiente;
            document.querySelector(".container-noticias").appendChild(btnSiguiente);
        }
    }
};

// Función para buscar noticias por categoría o tema
function buscar(cat) {
    pageInicial = 0;
    pageFinal = cantidadNoticias;
    temaActual = cat;
    noticias.fetchNoticias(cat);
}

// Función para buscar un tema ingresado por el usuario
function buscarTema() {
    let tema = document.querySelector("#busqueda").value;
    buscar(tema);
}

// Función para cargar más noticias dinámicamente
function siguiente() {
    pageInicial = pageFinal + 1;
    pageFinal += cantidadNoticias; // Ajusta el rango de noticias a cargar
    document.querySelector("#btnSiguiente").remove(); // Elimina el botón para evitar duplicados
    noticias.fetchNoticias(temaActual); // Carga más noticias del mismo tema
}

// Cargar noticias iniciales al abrir la página
noticias.fetchNoticias(temaActual);

// API Clima
const apiKeyWeather = "545b737b0dc87f892387cb381d2b4bfe";

// Obtiene los datos del clima en base a latitud y longitud
function obtenerClima(lat, lon) {
    fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKeyWeather}&units=metric&lang=es`
    )
    .then(response => response.json())
    .then(data => {
        document.getElementById("ciudad").textContent = data.name;
        document.getElementById("temp").textContent = `${Math.round(data.main.temp)}°C`;
        document.getElementById("icono-clima").src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    })
    .catch(error => console.error("Error obteniendo el clima:", error));
}

// Obtiene la ubicación del usuario y llama a la API del clima
function obtenerUbicacion() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                obtenerClima(lat, lon);
            },
            error => {
                console.log("No se pudo obtener la ubicación:", error);
                document.getElementById("ciudad").textContent = "Ubicación no permitida";
                obtenerClima(4.6097, -74.0817); // Ubicación por defecto: Bogotá
            }
        );
    } else {
        console.log("Geolocalización no soportada por el navegador.");
        obtenerClima(4.6097, -74.0817); // Bogotá por defecto
    }
}

// Llamar la función de ubicación al cargar la página
obtenerUbicacion();
