import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

// Configuración Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDWo3_W03qFc38IV8Lia9_aq5OnD7Iak3I",
    authDomain: "imaginatuarte-13743.firebaseapp.com",
    projectId: "imaginatuarte-13743",
    storageBucket: "imaginatuarte-13743.appspot.com",
    messagingSenderId: "699280977437",
    appId: "1:699280977437aa8d8d0960f4",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Mostrar imagen de perfil en la cabecera
document.addEventListener("DOMContentLoaded", () => {
    const usuarioActivo = JSON.parse(localStorage.getItem("usuario_activo"));
    const headerImg = document.getElementById("header-profile-pic");

    if (usuarioActivo && headerImg) {
        const fotoSrc = usuarioActivo.foto
            ? `data:image/png;base64,${usuarioActivo.foto}`
            : "/recursos/perfil.png";
        headerImg.src = fotoSrc;
        headerImg.classList.remove("hidden");
    }
});

// Referencias a los botones de categoría y a los contenedores de las galerías
const btnAnime = document.getElementById('mostrarAnime');
const btnPaisajes = document.getElementById('mostrarPaisajes');
const contAnimeGallery = document.getElementById('anime-gallery'); // Nuevo ID
const contPaisajesGallery = document.getElementById('paisajes-gallery'); // Nuevo ID

// Función para alternar la visibilidad y aplicar estilos de la galería
async function toggleCategoria(categoria) {
    const currentActiveGallery = document.querySelector('.category-content.show');
    let targetGallery;
    let otherGallery;

    if (categoria === 'anime') {
        targetGallery = contAnimeGallery;
        otherGallery = contPaisajesGallery;
    } else {
        targetGallery = contPaisajesGallery;
        otherGallery = contAnimeGallery;
    }

    // Si la galería objetivo ya está activa, la oculta y remueve clases
    if (targetGallery.classList.contains('show')) {
        targetGallery.classList.remove('show', 'gallery-grid');
        targetGallery.innerHTML = ''; // Limpiar contenido al ocultar
        return; // Terminar la función, ya se ocultó
    }

    // Ocultar la galería actualmente activa (si hay una diferente)
    if (currentActiveGallery && currentActiveGallery !== targetGallery) {
        currentActiveGallery.classList.remove('show', 'gallery-grid');
        currentActiveGallery.innerHTML = ''; // Limpiar contenido al ocultar
    }
    
    // Mostrar la galería objetivo y aplicar clases
    targetGallery.classList.add('show', 'gallery-grid');

    // Cargar imágenes solo cuando se muestra la galería
    await cargarImagenes(targetGallery, categoria);
}

// Event Listeners para los botones
btnAnime.addEventListener('click', () => toggleCategoria('anime'));
btnPaisajes.addEventListener('click', () => toggleCategoria('paisajes'));


// ------------------------------------------------------
// 💫 Función para cargar y mostrar imágenes por categoría
// ------------------------------------------------------
async function cargarImagenes(contenedorGaleria, categoria) {
    // Vaciar el contenedor antes de cargar nuevas imágenes para evitar duplicados
    contenedorGaleria.innerHTML = '';

    try {
        const snapshot = await getDocs(collection(db, "dibujos"));

        let count = 0; // Para el ejemplo de la imagen, limitamos a 8 para simular
        snapshot.forEach(doc => {
            const data = doc.data();
            if (!data.imagenBase64 || data.categoria !== categoria) return;

            // Para el ejemplo de la imagen, limita a 8 imágenes
            // if (count >= 8) return;

            const imageContainer = document.createElement('div');
            imageContainer.className = 'image-container';

            const link = document.createElement('a');
            link.href = `muestra.html?id=${doc.id}`;

            const img = document.createElement('img');
            img.src = `data:image/png;base64,${data.imagenBase64}`;
            img.alt = data.titulo || "Imagen sin título";

            link.appendChild(img);
            imageContainer.appendChild(link);
            contenedorGaleria.appendChild(imageContainer);
            count++;
        });

    } catch (err) {
        console.error(`Error cargando imágenes de la categoría ${categoria} desde Firebase:`, err);
    }
}

// --------------------
// 🍔 Menú hamburguesa
// --------------------
function initMenuHamburguesa() {
    const menuBtn = document.getElementById("menu-btn");
    const navLinks = document.getElementById("nav-links");
    if (!menuBtn || !navLinks) return;

    menuBtn.addEventListener("click", () => {
        menuBtn.classList.toggle("active");
        navLinks.classList.toggle("active");
    });
}

// Inicializar menú hamburguesa
document.addEventListener("DOMContentLoaded", initMenuHamburguesa);

