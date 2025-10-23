import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { 
  getFirestore, 
  doc, 
  getDoc, 
  collection, 
  query, 
  where, 
  getDocs 
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

// --- Configuración Firebase ---
const firebaseConfig = {
  apiKey: "AIzaSyDWo3_W03qFc38IV8Lia9_aq5OnD7Iak3I",
  authDomain: "imaginatuarte-13743.firebaseapp.com",
  projectId: "imaginatuarte-13743",
  storageBucket: "imaginatuarte-13743.appspot.com",
  messagingSenderId: "699280977437",
  appId: "1:699280977437:aa8d8d0960f4"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ------------------------------------------------------
// 🧠 Cargar información del perfil y galería
// ------------------------------------------------------
document.addEventListener("DOMContentLoaded", async () => {
  // ✅ Usar el id que realmente guardaste en login
  const usuarioActivo = JSON.parse(localStorage.getItem("usuario_activo"));
  const usuarioId = localStorage.getItem("usuario_id")?.trim();

  if (!usuarioId || !usuarioActivo) {
    window.location.href = "index.html";
    return;
  }

  // --- Mostrar foto en el header ---
  const headerImg = document.getElementById("header-profile-pic");
  if (headerImg) {
    const fotoSrc = usuarioActivo.foto
      ? `data:image/png;base64,${usuarioActivo.foto}`
      : "/recursos/perfil.png";

    // Imagen de perfil en escritorio
    headerImg.src = fotoSrc;
    headerImg.classList.remove("hidden");
  }

  // --- Obtener perfil ---
  const urlParams = new URLSearchParams(window.location.search);
  const perfilId = urlParams.get("id") || usuarioId;
  const esPropietario = perfilId === usuarioId;

  const botonEditar = document.getElementById("edit-profile-btn");
  const perfilImg = document.getElementById("profile-picture");
  const perfilNombre = document.getElementById("username-display");
  const infoPerfil = document.getElementById("info-display");

  if (!esPropietario && botonEditar) botonEditar.style.display = "none";

  try {
    const usuarioData = esPropietario
      ? usuarioActivo
      : (await getDoc(doc(db, "usuarios", perfilId))).data();

    if (!usuarioData) {
      alert("El perfil no existe.");
      window.location.href = "inicio.html";
      return;
    }

    // --- Mostrar datos del perfil ---
    perfilImg.src = usuarioData.foto
      ? `data:image/png;base64,${usuarioData.foto}`
      : "/recursos/perfil.png";
    perfilImg.classList.remove("hidden");

    perfilNombre.textContent = usuarioData.username || "Usuario";
    infoPerfil.textContent = usuarioData.info || "Sin información";

    if (esPropietario && botonEditar) {
      botonEditar.addEventListener("click", () => {
        window.location.href = "modificar.html";
      });
    }

    // --- Cargar galería ---
    await cargarGaleria(perfilId);
  } catch (err) {
    console.error("Error al cargar el perfil:", err);
  }

  initMenuHamburguesa();
});

// ------------------------------------------------------
// 💫 Cargar galería tipo Pinterest
// ------------------------------------------------------
async function cargarGaleria(usuarioId) {
  const galeriaPadre = document.getElementById("galeria-padre");
  galeriaPadre.innerHTML = "";

  try {
    const dibujosQuery = query(
      collection(db, "dibujos"),
      where("usuarioId", "==", usuarioId)
    );
    const querySnapshot = await getDocs(dibujosQuery);

    if (querySnapshot.empty) {
      galeriaPadre.innerHTML = `<p style="text-align:center;">No hay imágenes subidas aún.</p>`;
      return;
    }

    querySnapshot.forEach(doc => {
      const data = doc.data();
      if (!data.imagenBase64) return;

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
