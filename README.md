# ImaginaTuArte

**Curso:** Diseño Web II

**Integrantes del grupo:**

* XCristhianXD
* Javier Mancilla
* Herberth Mamani
* Marcelo Llanos

---

## Descripción del sistema

**ImaginaTuArte** es una plataforma web que permite a los usuarios explorar, subir y compartir obras de arte digitales.
El objetivo es ofrecer un espacio donde artistas y aficionados puedan expresar su creatividad, visualizar galerías y participar en una comunidad artística online.

**Características principales:**

* Registro e inicio de sesión de usuarios.
* Subida y visualización de obras de arte.
* Gestión del perfil del usuario.
* Interfaz amigable y navegación intuitiva, optimizada para dispositivos móviles.

---

## Instrucciones de uso

### 1. Clonar el repositorio

```bash
git clone https://github.com/XCristhianXD/ImaginaTuArte.git
```

### 2. Entrar a la carpeta del proyecto

```bash
cd ImaginaTuArte
```

### 3. Abrir la aplicación

* Dado que el proyecto usa solo **Firebase y frontend**, no se requiere servidor adicional.
* Abre `index.html` en tu navegador o usa un hosting como [42Web](https://42web.io/) para publicar la página.

### 4. Uso de la plataforma

1. Accede a la página web.
2. Regístrate o inicia sesión.
3. Sube tus obras de arte desde la sección “Subir”.
4. Explora la galería y visualiza las creaciones de otros usuarios.
5. Edita tu perfil si lo deseas.

---

## Tecnologías utilizadas

* **Frontend:** HTML5, CSS3, JavaScript
* **Backend/Servicios:** Firebase (Firestore, Authentication)
* **Control de versiones:** Git y GitHub
* **Hosting:** [42Web](https://42web.io/)
* **Herramientas adicionales:** Visual Studio Code

---

## Pruebas realizadas

* Pruebas de usabilidad: navegación, accesibilidad y diseño responsivo.
* Pruebas funcionales: formularios, autenticación, subida de obras y flujo principal.
* Pruebas de compatibilidad: navegadores y dispositivos móviles.
* Pruebas de almacenamiento: verificación de datos correctos en Firebase.

**Conclusión:** el sistema funciona correctamente; los datos se guardan correctamente en Firebase y la plataforma es estable.

---

## Estructura del proyecto

```text
ImaginaTuArte/
├── css/
│   └── estilos.css
├── js/
│   └── funciones.js
├── recursos/
│   ├── icon_pagina.png
│   └── ...
├── index.html
├── inicio.html
├── galeria.html
├── subir.html
├── muestra.html
├── modificar.html
├── perfil.html
└── README.md
```

---

## Contribuciones

Si deseas colaborar:

1. Haz un fork del repositorio.
2. Crea una rama con tu feature:

```bash
git checkout -b feature-nueva
```

3. Realiza tus cambios y haz commit:

```bash
git commit -m "Añadir nueva funcionalidad"
```

4. Haz push de tu rama:

```bash
git push origin feature-nueva
```

5. Crea un Pull Request describiendo tus cambios.

---

## Capturas o demostración

Se recomienda incluir capturas o GIFs de:

* Pantalla de registro e inicio de sesión
* Subida de obras con vista previa
* Galería de usuarios

Ejemplo de ruta:

* `docs/screenshots/home.png`
* `docs/screenshots/subir.png`

---

## Licencia

Este proyecto está bajo la licencia **MIT**.
Se permite usar, modificar y distribuir, mencionando la autoría original.

---

## Contacto

Desarrollado por **XCristhianXD**
Para consultas o colaboración, abre un *Issue* o *Pull Request* en el repositorio.

---

## Notas finales

Este proyecto forma parte del proceso de aprendizaje y desarrollo en ingeniería de sistemas, combinando diseño, programación y gestión de bases de datos.
Continuará mejorándose con nuevas funciones y optimizaciones.
