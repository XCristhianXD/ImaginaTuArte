import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { 
  getFirestore, 
  collection, 
  getDocs 
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

// --- Configuración Firebase ---
const firebaseConfig = {
  apiKey: "AIzaSyDWo3_W03qFc38IV8Lia9_aq5OnD7Iak3I",
  authDomain: "imaginatuarte-13743.firebaseapp.com",
  projectId: "imaginatuarte-13743",
  storageBucket: "imaginatuarte-13743.appspot.com",
  messagingSenderId: "699280977437",
  appId: "1:699280977437aa8d8d0960f4",
};

// Inicializar Firebase y Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", async () => {
  const usuarioActivo = JSON.parse(localStorage.getItem("usuario_activo"));
  const usuarioId = usuarioActivo?.id?.trim() || localStorage.getItem("usuario_id")?.trim();

  // Si no hay usuario logueado, redirigir
  if (!usuarioId || !usuarioActivo) {
    window.location.href = "index.html";
    return;
  }

  // --- Mostrar foto del usuario activo en el header ---
  const headerImg = document.getElementById("header-profile-pic");
  if (headerImg) {
    const fotoHeader = usuarioActivo.foto
      ? `data:image/png;base64,${usuarioActivo.foto}`
      : "/recursos/perfil.png";
    headerImg.src = fotoHeader;
    headerImg.classList.remove("hidden");
  }

  // --- Cargar TODAS las imágenes ---
  await cargarGaleria();

  // --- Inicializar menú hamburguesa ---
  initMenuHamburguesa();
});

// ------------------------------------------------------
// 💫 Cargar galería tipo Pinterest (todas las imágenes)
// ------------------------------------------------------
async function cargarGaleria() {
  let galeriaPadre = document.getElementById("galeria-padre");
  if (!galeriaPadre) {
    galeriaPadre = document.createElement("div");
    galeriaPadre.id = "galeria-padre";
    galeriaPadre.className = "gallery-grid";
    document.body.appendChild(galeriaPadre);
  }

  galeriaPadre.innerHTML = "";

  try {
    // ✅ Obtener todos los documentos de la colección "dibujos"
    const querySnapshot = await getDocs(collection(db, "dibujos"));

    if (querySnapshot.empty) {
      const aviso = document.createElement("p");
      aviso.textContent = "No hay imágenes subidas aún.";
      aviso.style.textAlign = "center";
      galeriaPadre.appendChild(aviso);
      return;
    }

    querySnapshot.forEach(doc => {
      const data = doc.data();
      if (data.imagenBase64) {
        const contenedor = document.createElement("div");
        contenedor.className = "image-container";

        const link = document.createElement("a");
        link.href = `muestra.html?id=${doc.id}`;

        const img = document.createElement("img");
        img.src = `data:image/png;base64,${data.imagenBase64}`;
        img.alt = data.titulo || "Imagen";

        link.appendChild(img);
        contenedor.appendChild(link);
        galeriaPadre.appendChild(contenedor);
      }
    });
  } catch (err) {
    console.error("Error al cargar la galería:", err);
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