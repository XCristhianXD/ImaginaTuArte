import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-analytics.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

// Mostrar imagen de perfil en la cabecera (header-profile-pic)
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

// Config Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDWo3_W03qFc38IV8Lia9_aq5OnD7Iak3I",
  authDomain: "imaginatuarte-13743.firebaseapp.com",
  projectId: "imaginatuarte-13743",
  storageBucket: "imaginatuarte-13743.appspot.com",
  messagingSenderId: "699280977437",
  appId: "1:699280977437aa8d8d0960f4",
  measurementId: "G-J7DVXN5E8R"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

// Elementos DOM
const inputArchivo = document.getElementById('input_archivo_subir');
const vistaPrevia = document.getElementById('vista_previa_subir');
const btnPublicar = document.querySelector('.btn_publicar_subir');
const inputTitulo = document.querySelector('.input_titulo_subir');
const inputDescripcion = document.querySelector('.input_descripcion_subir');
const inputCategoria = document.querySelector('.input_categoria_subir');

let archivoSeleccionado = null;

// Redimensionar imagen a máximo 600x600 (igual al contenedor) sin estirar y devolver Base64
function redimensionarA600(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = e => {
            const img = new Image();
            img.src = e.target.result;
            img.onload = () => {
                let width = img.width;
                let height = img.height;

                const ratio = Math.min(600 / width, 600 / height, 1); // Escalar hasta 600x600
                width = width * ratio;
                height = height * ratio;

                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                resolve(canvas.toDataURL('image/png').split(',')[1]); // Solo Base64
            };
            img.onerror = () => reject("Error cargando la imagen");
        };
        reader.onerror = () => reject("Error leyendo archivo");
        reader.readAsDataURL(file);
    });
}

// Vista previa
inputArchivo.addEventListener('change', async function() {
    const file = this.files[0];
    if (file) {
        archivoSeleccionado = await redimensionarA600(file);
        vistaPrevia.src = 'data:image/png;base64,' + archivoSeleccionado;
        vistaPrevia.style.display = 'block';
        vistaPrevia.alt = ''; // no mostrar texto
        vistaPrevia.style.width = '100%';
        vistaPrevia.style.height = '100%';
        vistaPrevia.style.objectFit = 'contain';
        vistaPrevia.style.borderRadius = '10px';
        vistaPrevia.style.background = '#f0f0f0';
    } else {
        vistaPrevia.src = '';
        vistaPrevia.style.display = 'none';
        archivoSeleccionado = null;
        vistaPrevia.alt = 'Vista previa';
    }
});

// Publicar
btnPublicar.addEventListener('click', async () => {
    const usuarioId = localStorage.getItem("usuario_id");
    if (!usuarioId) { alert("No estás logueado"); return; }

    if (!archivoSeleccionado) { alert('Selecciona un archivo primero'); return; }
    if (!inputTitulo.value.trim() || !inputDescripcion.value.trim()) { alert('Completa todos los campos'); return; }

    try {
        await addDoc(collection(db, 'dibujos'), {
            usuarioId: usuarioId,
            titulo: inputTitulo.value.trim(),
            descripcion: inputDescripcion.value.trim(),
            categoria: inputCategoria.value,
            imagenBase64: archivoSeleccionado,
            fecha: serverTimestamp()
        });

        alert('¡Publicado con éxito!');
        // Reset
        inputTitulo.value = '';
        inputDescripcion.value = '';
        inputCategoria.value = 'anime';
        vistaPrevia.src = '';
        vistaPrevia.style.display = 'none';
        archivoSeleccionado = null;
    } catch (error) {
        alert('Error al publicar: ' + error.message);
    }
});
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

