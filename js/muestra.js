import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

// 🔧 CONFIGURACIÓN FIREBASE
const firebaseConfig = {
  apiKey: "AIzaSyDWo3_W03qFc38IV8Lia9_aq5OnD7Iak3I",
  authDomain: "imaginatuarte-13743.firebaseapp.com",
  projectId: "imaginatuarte-13743",
  storageBucket: "imaginatuarte-13743.appspot.com",
  messagingSenderId: "699280977437",
  appId: "1:699280977437:web:e2d24c2571aa8d8d0960f4",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 📌 Mostrar imagen de perfil en la cabecera
document.addEventListener("DOMContentLoaded", () => {
  const usuarioActivo = JSON.parse(localStorage.getItem("usuario_activo"));
  const headerImg = document.getElementById("header-profile-pic");

  if (usuarioActivo && headerImg) {
    headerImg.src = usuarioActivo.foto
      ? `data:image/png;base64,${usuarioActivo.foto}`
      : "/recursos/perfil.png";
    headerImg.classList.remove("hidden");
  }
});

// 🖼️ Obtener ID del dibujo desde la URL
const params = new URLSearchParams(window.location.search);
const dibujoId = params.get("id");

if (!dibujoId) {
  alert("No se encontró el dibujo.");
} else {
  cargarDibujo(dibujoId);
}

// 🚀 Cargar dibujo y autor
async function cargarDibujo(id) {
  try {
    const docSnap = await getDoc(doc(db, "dibujos", id));
    if (!docSnap.exists()) {
      alert("No se encontró el dibujo.");
      return;
    }

    const data = docSnap.data();
    document.getElementById("imagen-principal").src = `data:image/png;base64,${data.imagenBase64}`;
    document.getElementById("titulo-imagen").textContent = data.titulo || "Sin título";
    document.getElementById("descripcion-imagen").textContent = data.descripcion || "";
    document.getElementById("categoria-imagen").textContent = `Categoría: ${data.categoria || ""}`;

    // 👤 Mostrar autor
    if (data.usuarioId) {
      const usuarioSnap = await getDoc(doc(db, "usuarios", data.usuarioId));
      if (usuarioSnap.exists()) {
        const user = usuarioSnap.data();
        const perfilImg = document.querySelector("#perfilCreador img");
        const perfilNombre = document.querySelector("#usuario-id");
        const botonSeguir = document.getElementById("botonSeguir");

        perfilImg.src = user.foto ? `data:image/png;base64,${user.foto}` : "/recursos/perfil.png";
        perfilNombre.innerHTML = `${user.username || "Usuario"}`;

        // Ir al perfil al hacer clic en nombre o imagen
        perfilImg.onclick = perfilNombre.onclick = () =>
          (window.location.href = `perfil.html?id=${data.usuarioId}`);

        // Botón seguir SOLO cambia color (no redirige)
        if (botonSeguir) {
          botonSeguir.addEventListener("click", () => {
            botonSeguir.classList.toggle("siguiendo_muestra");
          });
        }
      }
    }

    // Cargar comentarios
    cargarComentarios(id);
    prepararCajaComentario(id);

    // Activar botones de interacción
    configurarBotonesInteraccion();

  } catch (err) {
    console.error("Error cargando dibujo:", err);
  }
}

// 💬 Cargar comentarios (JavaScript puro, ordenados por fecha y hora descendente)
async function cargarComentarios(dibujoId) {
  const contenedor = document.getElementById("contenedor-comentarios");
  contenedor.innerHTML = "";

  try {
    const q = query(collection(db, "comentarios"), where("dibujoId", "==", dibujoId));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      contenedor.innerHTML = "<p>No hay comentarios aún. Sé el primero en comentar.</p>";
      return;
    }

    // Convertir a array
    const comentarios = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      comentarios.push({
        id: docSnap.id,
        usuarioId: data.usuarioId || null,
        texto: data.texto || "",
        fecha: data.fecha?.toDate ? data.fecha.toDate() : new Date(0),
      });
    });

    // Ordenar por fecha descendente (más reciente primero)
    comentarios.sort((a, b) => b.fecha - a.fecha);

    for (const c of comentarios) {
      let usuarioData = { username: "Usuario", foto: null };

      if (c.usuarioId) {
        try {
          const uSnap = await getDoc(doc(db, "usuarios", c.usuarioId));
          if (uSnap.exists()) usuarioData = uSnap.data();
        } catch (e) {
          console.warn("Error obteniendo usuario:", e);
        }
      }

      const div = document.createElement("div");
      div.classList.add("comentario");
      div.innerHTML = `
        <div class="comentario-header">
          <img src="${
            usuarioData.foto
              ? `data:image/png;base64,${usuarioData.foto}`
              : "/recursos/perfil.png"
          }" class="comentario-foto" data-user-id="${c.usuarioId}">
          <strong class="comentario-usuario" data-user-id="${c.usuarioId}">
            ${usuarioData.username || "Usuario"}
          </strong>
        </div>
        <p class="comentario-texto">${c.texto}</p>
        <span class="comentario-fecha">${
          c.fecha instanceof Date ? c.fecha.toLocaleString() : ""
        }</span>
      `;

      contenedor.appendChild(div);
    }

    // Ir al perfil al hacer clic en nombre o foto del comentario
    contenedor.querySelectorAll(".comentario-foto, .comentario-usuario").forEach((el) => {
      el.addEventListener("click", () => {
        const uid = el.dataset.userId;
        if (uid) window.location.href = `perfil.html?id=${uid}`;
      });
    });

  } catch (err) {
    console.error("Error al cargar comentarios:", err);
    contenedor.innerHTML = "<p>Error al cargar comentarios.</p>";
  }
}

// ✏️ Enviar nuevo comentario
function prepararCajaComentario(dibujoId) {
  const usuarioActivo = JSON.parse(localStorage.getItem("usuario_activo"));
  const usuarioId = localStorage.getItem("usuario_id");
  const fotoPerfil = document.getElementById("comentario-foto");
  const botonEnviar = document.getElementById("enviar-comentario");
  const textarea = document.getElementById("nuevo-comentario");

  if (!usuarioActivo || !usuarioId) {
    textarea.disabled = true;
    textarea.placeholder = "Inicia sesión para comentar.";
    botonEnviar.disabled = true;
    return;
  }

  fotoPerfil.src = usuarioActivo.foto
    ? `data:image/png;base64,${usuarioActivo.foto}`
    : "/recursos/perfil.png";

  botonEnviar.onclick = async () => {
    const texto = textarea.value.trim();
    if (!texto) return;

    try {
      await addDoc(collection(db, "comentarios"), {
        dibujoId,
        usuarioId,
        texto,
        fecha: serverTimestamp(),
      });
      textarea.value = "";
      cargarComentarios(dibujoId);
    } catch (err) {
      console.error("Error al enviar comentario:", err);
      alert("Error al enviar comentario.");
    }
  };
}

// ❤️⭐ Botones de interacción
function configurarBotonesInteraccion() {
  const meGusta = document.querySelector(".me_gusta_muestra");
  const guardar = document.querySelector(".guardar_muestra");

  meGusta?.addEventListener("click", function () {
    this.classList.toggle("active");
  });

  guardar?.addEventListener("click", function () {
    this.classList.toggle("active");
  });
}
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