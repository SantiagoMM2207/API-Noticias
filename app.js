// =============================
// CONFIGURACIÓN INICIAL
// =============================

// Define cuántas noticias se mostrarán por página
let cantidadNoticias = 7;
let pageFinal = cantidadNoticias;
let pageInicial = 0;
let temaActual = "Tecnología"; // Categoría por defecto

// =============================
// MANEJO DE NOTICIAS DESDE LA API
// =============================

// Objeto para manejar la obtención y visualización de noticias
let noticias = {
    apiKey: "76c9861cc7944a1b87fcc3ed4542ae5f", // Clave de acceso a la API

    // Método para obtener noticias según la categoría dada
    fetchNoticias: function (categoria) {
        fetch(
            `https://newsapi.org/v2/everything?q=${categoria}&language=es&apiKey=${this.apiKey}`
        )
        .then(response => response.json()) // Convierte la respuesta en JSON
        .then(data => this.displayNoticias(data)); // Llama a la función para mostrar las noticias
    },

    // Método que muestra las noticias en la página
    displayNoticias: function (data) {
        // Si no hay artículos en la respuesta, mostrar un mensaje
        if (!data.articles || data.articles.length === 0) {
            document.querySelector(".container-noticias").innerHTML = "<p>No se encontraron noticias.</p>";
            return;
        }

        // Limpiar la lista de noticias solo si es la primera carga de la página
        if (pageInicial == 0) {
            document.querySelector(".container-noticias").innerHTML = "";
        }

        // Iterar sobre las noticias disponibles hasta el límite definido
        for (let i = pageInicial; i < Math.min(pageFinal, data.articles.length); i++) {
            const { title, urlToImage, publishedAt, source, url } = data.articles[i];

            // Crear un contenedor para cada noticia
            let item = document.createElement("div");
            item.className = "item";
            item.onclick = () => window.location.href = url; // Redirige al usuario al artículo completo

            // Crear el título de la noticia
            let h2 = document.createElement("h2");
            h2.textContent = title;

            // Si la noticia tiene una imagen, agregarla
            if (urlToImage) {
                let img = document.createElement("img");
                img.src = urlToImage;
                item.appendChild(img);
            }

            // Crear un contenedor para la fecha y la fuente de la noticia
            let info_item = document.createElement("div");
            info_item.className = "info_item";

            // Mostrar la fecha de publicación en formato DD-MM-YYYY
            let fecha = document.createElement("span");
            fecha.className = "fecha";
            fecha.textContent = publishedAt.split("T")[0].split("-").reverse().join("-");

            // Mostrar la fuente de la noticia
            let fuente = document.createElement("span");
            fuente.className = "fuente";
            fuente.textContent = source.name;

            // Agregar fecha y fuente al contenedor
            info_item.appendChild(fecha);
            info_item.appendChild(fuente);

            // Agregar elementos al contenedor principal de la noticia
            item.appendChild(h2);
            item.appendChild(info_item);
            document.querySelector(".container-noticias").appendChild(item);
        }
    }
};

// =============================
// FUNCIONES DE BÚSQUEDA
// =============================

// Función para buscar noticias de una categoría específica
function buscar(cat) {
    pageInicial = 0; // Reiniciar la paginación
    pageFinal = cantidadNoticias;
    temaActual = cat; // Actualizar el tema actual
    noticias.fetchNoticias(cat); // Llamar a la función de obtención de noticias
}

// Función para realizar una búsqueda con el término ingresado en el input
function buscarTema() {
    let tema = document.querySelector("#busqueda").value.trim(); // Obtener el término ingresado
    if (tema) {
        buscar(tema); // Buscar el tema ingresado
    } else {
        alert("Por favor, ingresa un tema de búsqueda."); // Mostrar alerta si el campo está vacío
    }
}

// =============================
// OBTENCIÓN DE CLIMA (A IMPLEMENTAR)
// =============================

// Llamar a la función para obtener la ubicación del usuario y mostrar el clima
obtenerUbicacion();
