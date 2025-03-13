document.addEventListener("DOMContentLoaded", function() {
    fetch('xml/index.xml') // Asegúrate de que el archivo XML esté en la ruta correcta
        .then(response => response.text())
        .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
        .then(data => {
            let persona = data.querySelector("Persona");
            let perfil = data.querySelector("PerfilProfesional Descripcion").textContent;
            let experiencias = data.querySelectorAll("ExperienciaLaboral Trabajo");
            let educacion = data.querySelectorAll("Educacion Estudio");
            let habilidades = data.querySelectorAll("Habilidades Habilidad");
            let idiomas = data.querySelectorAll("Idiomas Idioma");
            let referencias = data.querySelectorAll("Referencias Referencia");

            // Obtener fecha de nacimiento
            let fechaNacimiento = persona.querySelector("FechaNacimiento").textContent;

            // Función para calcular la edad
            function calcularEdad(fechaNacimiento) {
                let hoy = new Date();
                let nacimiento = new Date(fechaNacimiento);
                let edad = hoy.getFullYear() - nacimiento.getFullYear();
                let mes = hoy.getMonth() - nacimiento.getMonth();
                if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
                    edad--;
                }
                return edad;
            }

            let edadCalculada = calcularEdad(fechaNacimiento);

            // Extraer GitHub
            let github = persona.querySelector("GitHub") ? persona.querySelector("GitHub").textContent : "";

            let cvHTML = `
                <h3>${persona.querySelector("Nombre").textContent}</h3>
                <p><strong>Email:</strong> ${persona.querySelector("Correo").textContent}</p>
                <p><strong>Teléfono:</strong> ${persona.querySelector("Telefono").textContent}</p>
                <p><strong>Edad:</strong> ${edadCalculada} años</p>
                <p><strong>GitHub:</strong> <a href="${github}" target="_blank">${github}</a></p>
                <h4>Perfil Profesional</h4>
                <p>${perfil}</p>
                <h4>Experiencia Laboral</h4>
            `;

            experiencias.forEach(trabajo => {
                cvHTML += `
                    <div class="mb-3">
                        <h5>${trabajo.querySelector("Empresa").textContent}</h5>
                        <p><strong>Cargo:</strong> ${trabajo.querySelector("Cargo").textContent}</p>
                        <p><strong>Periodo:</strong> ${trabajo.querySelector("Periodo").textContent}</p>
                        <ul>
                `;
                trabajo.querySelectorAll("Tarea").forEach(tarea => {
                    cvHTML += `<li>${tarea.textContent}</li>`;
                });
                cvHTML += `</ul></div>`;
            });

            cvHTML += `<h4>Educación</h4>`;
            educacion.forEach(estudio => {
                cvHTML += `
                    <p><strong>${estudio.querySelector("Titulo").textContent}</strong><br>
                    ${estudio.querySelector("Institucion").textContent} (${estudio.querySelector("Periodo").textContent})</p>
                `;
            });

            cvHTML += `<h4>Habilidades</h4><ul>`;
            habilidades.forEach(habilidad => {
                cvHTML += `<li>${habilidad.textContent}</li>`;
            });
            cvHTML += `</ul><h4>Idiomas</h4><ul>`;

            idiomas.forEach(idioma => {
                cvHTML += `<li>${idioma.querySelector("Nombre").textContent} - ${idioma.querySelector("Nivel").textContent}</li>`;
            });
            cvHTML += `</ul>`;

            // Agregar referencias
            if (referencias.length > 0) {
                cvHTML += `<h4>Referencias</h4><ul>`;
                referencias.forEach(ref => {
                    cvHTML += `<li><strong>${ref.querySelector("Nombre").textContent}:</strong> ${ref.querySelector("Telefono").textContent}</li>`;
                });
                cvHTML += `</ul>`;
            }

            document.getElementById("cv-content").innerHTML = cvHTML;
        })
        .catch(error => console.log("Error cargando el XML:", error));
});
