document.addEventListener("DOMContentLoaded", function () {
    fetch('xml/index.xml')
        .then(response => response.text())
        .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
        .then(data => {
            const persona       = data.querySelector("Persona");
            const perfil        = data.querySelector("PerfilProfesional Descripcion").textContent;
            const experiencias  = data.querySelectorAll("ExperienciaLaboral Trabajo");
            const educacion     = data.querySelectorAll("Educacion Estudio");
            const gruposHab     = data.querySelectorAll("Habilidades Grupo");
            const idiomas       = data.querySelectorAll("Idiomas Idioma");
            const referencias   = data.querySelectorAll("Referencias Referencia");

            // Datos de contacto
            const nombre    = persona.querySelector("Nombre").textContent;
            const correo    = persona.querySelector("Correo").textContent;
            const telefono  = persona.querySelector("Telefono").textContent;
            const github    = persona.querySelector("GitHub")?.textContent || "";
            const ubicacion = persona.querySelector("Ubicacion")?.textContent || "";
            const subtitulo = persona.querySelector("Titulo")?.textContent || "";
            const fechaNac  = persona.querySelector("FechaNacimiento").textContent;

            // Calcular edad
            function calcularEdad(fecha) {
                const hoy = new Date();
                const nac = new Date(fecha);
                let edad = hoy.getFullYear() - nac.getFullYear();
                const m = hoy.getMonth() - nac.getMonth();
                if (m < 0 || (m === 0 && hoy.getDate() < nac.getDate())) edad--;
                return edad;
            }
            const edad = calcularEdad(fechaNac);

            // ── HEADER ──────────────────────────────────────────────
            let html = `
            <div class="cv-header">
                <div class="cv-header-main">
                    <h2 class="cv-name">${nombre}</h2>
                    <p class="cv-subtitle">${subtitulo}</p>
                </div>
                <div class="cv-header-contact">
                    <p>📧 <a href="mailto:${correo}">${correo}</a></p>
                    <p>📱 ${telefono}</p>
                    <p>📍 ${ubicacion}</p>
                    <p>💻 <a href="${github}" target="_blank">github.com/LeandroManna</a></p>
                    <p>🌐 <a href="https://leandromanna.github.io/mi-cv/" target="_blank">leandromanna.github.io/mi-cv</a></p>
                </div>
            </div>`;

            // ── PERFIL ───────────────────────────────────────────────
            html += `
            <div class="cv-section">
                <h3 class="cv-section-title">Perfil Profesional</h3>
                <p class="cv-perfil">${perfil}</p>
            </div>`;

            // ── EXPERIENCIA ──────────────────────────────────────────
            html += `<div class="cv-section"><h3 class="cv-section-title">Experiencia Laboral</h3>`;
            experiencias.forEach(trabajo => {
                const empresa = trabajo.querySelector("Empresa").textContent;
                const cargo   = trabajo.querySelector("Cargo").textContent;
                const periodo = trabajo.querySelector("Periodo").textContent;
                html += `
                <div class="cv-job">
                    <div class="cv-job-header">
                        <div>
                            <span class="cv-job-title">${cargo}</span>
                            <span class="cv-job-company">${empresa}</span>
                        </div>
                        <span class="cv-job-period">${periodo}</span>
                    </div>
                    <ul class="cv-job-tasks">`;
                trabajo.querySelectorAll("Tarea").forEach(t => {
                    html += `<li>${t.textContent}</li>`;
                });
                html += `</ul></div>`;
            });
            html += `</div>`;

            // ── EDUCACIÓN ────────────────────────────────────────────
            html += `<div class="cv-section"><h3 class="cv-section-title">Educación</h3>`;
            educacion.forEach(est => {
                html += `
                <div class="cv-edu">
                    <div class="cv-job-header">
                        <div>
                            <span class="cv-job-title">${est.querySelector("Titulo").textContent}</span>
                            <span class="cv-job-company">${est.querySelector("Institucion").textContent}</span>
                        </div>
                        <span class="cv-job-period">${est.querySelector("Periodo").textContent}</span>
                    </div>
                </div>`;
            });
            html += `</div>`;

            // ── IDIOMAS ──────────────────────────────────────────────
            html += `<div class="cv-section"><h3 class="cv-section-title">Idiomas</h3><div class="cv-idiomas">`;
            idiomas.forEach(idioma => {
                html += `
                <div class="cv-idioma-item">
                    <span class="cv-idioma-nombre">${idioma.querySelector("Nombre").textContent}</span>
                    <span class="cv-idioma-nivel">${idioma.querySelector("Nivel").textContent}</span>
                </div>`;
            });
            html += `</div></div>`;

            // ── REFERENCIAS ──────────────────────────────────────────
            if (referencias.length > 0) {
                html += `<div class="cv-section"><h3 class="cv-section-title">Referencias</h3><div class="cv-referencias">`;
                referencias.forEach(ref => {
                    html += `
                    <div class="cv-ref-item">
                        <span class="cv-ref-nombre">${ref.querySelector("Nombre").textContent}</span>
                        <span class="cv-ref-tel">${ref.querySelector("Telefono").textContent}</span>
                    </div>`;
                });
                html += `</div></div>`;
            }

            document.getElementById("cv-content").innerHTML = html;
        })
        .catch(error => console.error("Error cargando el XML:", error));
});