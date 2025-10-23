import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

// Configuración Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDWo3_W03qFc38IV8Lia9_aq5OnD7Iak3I",
    authDomain: "imaginatuarte-13743.firebaseapp.com",
    projectId: "imaginatuarte-13743",
    storageBucket: "imaginatuarte-13743.appspot.com",
    messagingSenderId: "699280977437",
    appId: "1:699280977437aa8d8d0960f4"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Función para convertir imagen a Base64 hasta 500x500 manteniendo proporción
function fileToBase64Large(file, maxSize = 500) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = e => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                // Escalar manteniendo proporción, no agrandar si es más pequeña
                const scale = Math.min(maxSize / img.width, maxSize / img.height, 1);
                canvas.width = img.width * scale;
                canvas.height = img.height * scale;

                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                const dataUrl = canvas.toDataURL('image/png'); // También puede ser 'image/jpeg'
                resolve(dataUrl.split(',')[1]); // Guardamos solo los bytes
            };
            img.onerror = () => reject("Error al cargar la imagen");
            img.src = e.target.result;
        };
        reader.onerror = () => reject("Error leyendo archivo");
        reader.readAsDataURL(file);
    });
}

document.addEventListener("DOMContentLoaded", async () => {
    const usuarioId = localStorage.getItem("usuario_id");
    if (!usuarioId) {
        alert("Sesión expirada. Inicia sesión de nuevo.");
        window.location.href = "index.html";
        return;
    }

    // Elementos DOM
    const profilePicture = document.getElementById("profile-picture");
    const headerImg = document.getElementById("header-profile-pic");
    const usernameInput = document.getElementById("username");
    const infoInput = document.getElementById("info");
    const uploadPhotoInput = document.getElementById("upload-photo");
    const changePhotoBtn = document.getElementById("change-photo-btn");
    const saveChangesBtn = document.getElementById("save-changes-btn");
    const cancelBtn = document.getElementById("cancel-btn");

    let usuario = {};

    // Cargar datos desde Firestore
    try {
        const docRef = doc(db, "usuarios", usuarioId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            usuario = docSnap.data();

            const fotoSrc = usuario.foto ? `data:image/png;base64,${usuario.foto}` : "/recursos/perfil.png";

            // Mostrar imagenes correctamente
            profilePicture.src = fotoSrc;
            profilePicture.classList.remove("hidden");
            profilePicture.classList.add("fade-in");

            headerImg.src = fotoSrc;
            headerImg.classList.remove("hidden");
            headerImg.classList.add("fade-in");

            usernameInput.value = usuario.username || "";
            infoInput.value = usuario.info || "";

            // Guardamos también en localStorage
            localStorage.setItem("usuario_activo", JSON.stringify(usuario));
        }
    } catch (error) {
        console.error("Error al cargar datos desde Firestore:", error);
        alert("No se pudieron cargar los datos de perfil.");
    }

    // Cambiar foto
    changePhotoBtn.addEventListener("click", () => uploadPhotoInput.click());
    uploadPhotoInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) {
            profilePicture.file = file;
            profilePicture.src = URL.createObjectURL(file); // Preview inmediato
        }
    });

    // Guardar cambios
    saveChangesBtn.addEventListener("click", async () => {
        try {
            let newFotoBase64 = usuario.foto; // Mantener anterior por defecto

            if (profilePicture.file) {
                newFotoBase64 = await fileToBase64Large(profilePicture.file, 500); // Tamaño máximo 500x500
            }

            await updateDoc(doc(db, "usuarios", usuarioId), {
                username: usernameInput.value.trim(),
                info: infoInput.value.trim(),
                foto: newFotoBase64
            });

            // Actualizar localStorage
            usuario.username = usernameInput.value.trim();
            usuario.info = infoInput.value.trim();
            usuario.foto = newFotoBase64;
            localStorage.setItem("usuario_activo", JSON.stringify(usuario));

            alert("Perfil actualizado con éxito ✅");
            window.location.href = "perfil.html";
        } catch (error) {
            console.error("Error al guardar cambios:", error);
            alert("Error al guardar los cambios. Asegúrate de que la imagen sea válida.");
        }
    });

    // Cancelar cambios
    cancelBtn.addEventListener("click", () => window.location.href = "perfil.html");
});
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

