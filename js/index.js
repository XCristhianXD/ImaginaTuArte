import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { getFirestore, collection, query, where, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

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

// Función para convertir File a Base64
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(',')[1]); // Solo los datos
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
    });
}

// --------------------
// Abrir/Cerrar ventanas (solo si existen los elementos)
// --------------------

// Función para abrir una ventana
function openWindow(ventanaId) {
    const ventana = document.getElementById(ventanaId);
    if (ventana) {
        ventana.classList.add('show-ventana'); // Añade la clase para mostrar la ventana
    }
}

// Función para cerrar una ventana
function closeWindow(ventanaId) {
    const ventana = document.getElementById(ventanaId);
    if (ventana) {
        ventana.classList.remove('show-ventana'); // Remueve la clase para ocultar la ventana
    }
}

document.querySelectorAll('.open-window').forEach(button => {
    button.addEventListener('click', e => {
        e.preventDefault();
        const ventanaId = button.dataset.window;
        openWindow(ventanaId);

        // Si es un botón del menú hamburguesa, también lo cierra
        const navLinks = document.getElementById("nav-links");
        const menuBtn = document.getElementById("menu-btn");
        if (navLinks && menuBtn && navLinks.classList.contains('show')) {
            menuBtn.classList.remove('active');
            navLinks.classList.remove('show');
        }
    });
});

document.querySelectorAll('.cerrar-ventana').forEach(span => {
    span.addEventListener('click', () => {
        const ventanaId = span.dataset.window;
        closeWindow(ventanaId);
    });
});


// --------------------
// Registro (solo si existe el formulario)
// --------------------
const formRegister = document.getElementById('form-register');
if (formRegister) {
    formRegister.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value.trim();
        const email = document.getElementById('register-email').value.trim();
        const password = document.getElementById('register-password').value;
        const confirm = document.getElementById('confirm_password').value;

        if (password !== confirm) {
            alert("Las contraseñas no coinciden.");
            return;
        }

        try {
            const q = query(collection(db,"usuarios"), where("email","==",email));
            const snapshot = await getDocs(q);
            if (!snapshot.empty) {
                alert("Este email ya está registrado.");
                return;
            }

            // Por defecto, foto en Base64 de la imagen local
            // Asegúrate de que la ruta '/recursos/perfil.png' sea correcta y accesible
            const defaultFoto = await fetch('/recursos/perfil.png')
                .then(res => res.blob())
                .then(fileToBase64);

            await addDoc(collection(db,"usuarios"),{
                username,
                email,
                password,
                foto: defaultFoto,
                info: '',
                imagenes: []
            });

            alert(`Usuario ${username} registrado ✅`);
            closeWindow('registro_ventana');
            formRegister.reset();
        } catch(err){
            console.error(err);
            alert("Error al registrar usuario.");
        }
    });
}

// --------------------
// Login (solo si existe el formulario)
// --------------------
const formLogin = document.getElementById('form-login');
if (formLogin) {
    formLogin.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value;

        try {
            const q = query(collection(db,"usuarios"), where("email","==",email), where("password","==",password));
            const snapshot = await getDocs(q);

            if (!snapshot.empty) {
                const docSnap = snapshot.docs[0];
                const usuarioId = docSnap.id;
                const usuarioData = docSnap.data();

                localStorage.setItem('usuario_id', usuarioId);
                localStorage.setItem('usuario_activo', JSON.stringify(usuarioData));

                window.location.href = "inicio.html";
            } else {
                alert("Email o contraseña incorrectos ❌");
            }
        } catch(err) {
            console.error(err);
            alert("Error al iniciar sesión.");
        }
    });
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
        navLinks.classList.toggle("show");
    });

    // Cierra el menú hamburguesa si se hace clic fuera de él
    document.addEventListener("click", (e) => {
        if (!navLinks.contains(e.target) && !menuBtn.contains(e.target) && navLinks.classList.contains('show')) {
            menuBtn.classList.remove("active");
            navLinks.classList.remove("show");
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    initMenuHamburguesa();
});