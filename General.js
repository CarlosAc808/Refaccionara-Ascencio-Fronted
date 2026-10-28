const items = document.querySelectorAll(".item");
const indicador = document.getElementById("indicador");

function moverIndicador(el) {
    indicador.style.top = el.offsetTop + "px";
    indicador.style.height = el.offsetHeight + "px";
}

function cerrarTodo() {
    document.getElementById('section_Inventario').style.display = 'none';
    document.getElementById('section_Movimientos').style.display = 'none';
    document.getElementById('section_Distribuidor').style.display = 'none';
    document.getElementById('section_Alertas').style.display = 'none';
}

// inicial
moverIndicador(document.querySelector(".item.active"));

items.forEach(item => {
    item.addEventListener("click", function() {

        document.querySelector(".item.active").classList.remove("active");
        this.classList.add("active");

        moverIndicador(this);
    });
});


function Invetario(){
    cerrarTodo();
    document.getElementById('section_Inventario').style.display = 'block';
    if (typeof listadoInventario === 'function') {
        listadoInventario();
    }
}

function Movimientos(){
    cerrarTodo();
    document.getElementById('section_Movimientos').style.display = 'block';
    if (typeof cargarHistorialStock === 'function') {
        cargarHistorialStock();
    }
}

function Distribuidores(){
    cerrarTodo();
    document.getElementById('section_Distribuidor').style.display = 'block';
    if (typeof listadoDistribuidor === 'function') {
        listadoDistribuidor();
    }
}

function Alertas(){
    cerrarTodo();
    document.getElementById('section_Alertas').style.display = 'block';
    if (typeof listadoUsuario === 'function') {
        listadoUsuario();
    }
}








function Entrada() {
    const tipoMov = document.getElementById("tipo_movimiento");
    if (tipoMov) tipoMov.value = "entrada";

    const btnEntrada = document.getElementById("Tipo_Entrada");
    const btnSalida = document.getElementById("Tipo_Salida");
    if (btnEntrada) btnEntrada.classList.add("active-entrada");
    if (btnSalida) btnSalida.classList.remove("active-salida");

    const envEntrada = document.getElementById("Enviar_Entrada");
    const envSalida = document.getElementById("Enviar_Salidas");
    if (envEntrada) envEntrada.style.display = "block";
    if (envSalida) envSalida.style.display = "none";

    // 🔥 MOSTRAR proveedor
    const grupoProv = document.getElementById("grupo_proveedor");
    if (grupoProv) grupoProv.style.display = "block";
}

function Salida() {
    const tipoMov = document.getElementById("tipo_movimiento");
    if (tipoMov) tipoMov.value = "salida";

    const btnEntrada = document.getElementById("Tipo_Entrada");
    const btnSalida = document.getElementById("Tipo_Salida");
    if (btnSalida) btnSalida.classList.add("active-salida");
    if (btnEntrada) btnEntrada.classList.remove("active-entrada");

    const envEntrada = document.getElementById("Enviar_Entrada");
    const envSalida = document.getElementById("Enviar_Salidas");
    if (envEntrada) envEntrada.style.display = "none";
    if (envSalida) envSalida.style.display = "block";

    const grupoProv = document.getElementById("grupo_proveedor");
    if (grupoProv) grupoProv.style.display = "none";

    // opcional: limpiar valor
    const provId = document.getElementById("proveedor_id");
    if (provId) provId.value = "";
}



function abrirModal() {
  const modal = document.getElementById("modalDistribuidor");
  if (modal) {
    const form = document.getElementById("Agregar_Distribuidor");
    if (form) form.reset();
    const idInput = document.getElementById("id_Distribuidor");
    if (idInput) idInput.value = "";
    const titulo = modal.querySelector("h3");
    if (titulo) titulo.textContent = "Agregar Distribuidor";
    modal.style.display = "flex";
  }
}

function cerrarModal() {
  document.getElementById("modalDistribuidor").style.display = "none";
}


function abrirModalProducto() {
  document.getElementById("modalProducto").style.display = "flex";
}

function cerrarModalProducto() {
  document.getElementById("modalProducto").style.display = "none";
}

function abrirModalCategoria(){
    document.getElementById("modalCategoria").style.display = "flex";
}
function cerrarModalCategoria() {
  document.getElementById("modalCategoria").style.display = "none";
}



function abrirModalusuario() {
  const modal = document.getElementById("modalUsuario");
  if (modal) {
    const form = document.getElementById("Agregar_Usuario");
    if (form) form.reset();
    const idInput = document.getElementById("id_login");
    if (idInput) idInput.value = "";
    const titulo = modal.querySelector("h3");
    if (titulo) titulo.textContent = "Agregar Usuario";
    modal.style.display = "flex";
  }
}

function cerrarModalusuario() {
  document.getElementById("modalUsuario").style.display = "none";
}


//----------------------------------Agregar / Editar Usuario----------------------------------------

    const formulario4 = document.getElementById("Agregar_Usuario");
    if (formulario4) {
        formulario4.addEventListener("submit", (event) => {
            event.preventDefault(); // Evita la recarga de la página
            let urlMethod = "usuario";
            
            const formData = new FormData(formulario4);
            const idInput = document.getElementById("id_login");
            const esEdicion = idInput && idInput.value !== "";

            if (esEdicion) {
                urlMethod = "update_usuarios/" + idInput.value;
                formData.append("_method", "PUT");
            }

            fetch("http://127.0.0.1:8000/api/" + urlMethod, {
                method: "POST",
                body: formData
            })
            .then(async res => {
                const data = await res.json().catch(() => ({}));
                if (!res.ok) {
                    throw new Error(data.message || "Error al procesar la solicitud");
                }
                return data;
            })
            .then(data => {
                Swal.fire({
                    title: esEdicion ? "¡Usuario actualizado con éxito!" : "¡Usuario registrado con éxito!",
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false
                });

                const modal = document.getElementById("modalUsuario");
                if (modal) modal.style.display = "none";
                formulario4.reset();
                if (idInput) idInput.value = "";

                listadoUsuario();
            })
            .catch(err => {
                console.error("Error al guardar usuario:", err);
                Swal.fire("Error", err.message || "No se pudo guardar el usuario", "error");
            });
        });
    }

    function AlertaUsuario() {
        // Manejado en el evento submit tras completar la petición
    }




window.todosLosUsuarios = [];
let paginaActualUsuario = 1;
const itemsPorPaginaUsuario = 10;
let usuariosFiltrados = [];

function cambiarPaginaUsuario(nuevaPagina) {
    const totalPaginas = Math.ceil((usuariosFiltrados || []).length / itemsPorPaginaUsuario) || 1;
    if (nuevaPagina < 1 || nuevaPagina > totalPaginas) return;
    paginaActualUsuario = nuevaPagina;
    renderizarPaginacionUsuarios();
    renderizarTablaUsuarios();
}

function renderizarPaginacionUsuarios() {
    const nav = document.getElementById("user-pagination") || document.querySelector(".user-pagination");
    if (!nav) return;

    const totalItems = (usuariosFiltrados || []).length;
    const totalPaginas = Math.ceil(totalItems / itemsPorPaginaUsuario) || 1;

    let html = "";
    const disablePrev = paginaActualUsuario <= 1;
    html += `<button class="user-page-nav" type="button" ${disablePrev ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : `onclick="cambiarPaginaUsuario(${paginaActualUsuario - 1})"`}>Anterior</button>`;

    for (let p = 1; p <= totalPaginas; p++) {
        const isActive = p === paginaActualUsuario;
        html += `<button class="user-page-num ${isActive ? 'active' : ''}" type="button" ${isActive ? 'aria-current="page"' : `onclick="cambiarPaginaUsuario(${p})"`}>${p}</button>`;
    }

    const disableNext = paginaActualUsuario >= totalPaginas;
    html += `<button class="user-page-nav" type="button" ${disableNext ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : `onclick="cambiarPaginaUsuario(${paginaActualUsuario + 1})"`}>Siguiente</button>`;

    nav.innerHTML = html;
}

function obtenerInicialesUsuario(nombre, correo) {
    const cleanName = (nombre && nombre !== "null") ? nombre.trim() : "";
    if (cleanName) {
        const parts = cleanName.split(/\s+/);
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return cleanName.substring(0, 2).toUpperCase();
    }
    if (correo) {
        const userPart = correo.split('@')[0];
        return userPart.substring(0, 2).toUpperCase();
    }
    return "US";
}

function formatearNombreUsuario(nombre, correo, id) {
    if (nombre && nombre !== "null" && nombre.trim() !== "") {
        return nombre.trim();
    }
    if (correo) {
        const userPart = correo.split('@')[0];
        return userPart.charAt(0).toUpperCase() + userPart.slice(1);
    }
    return `Usuario #${id}`;
}

function obtenerRolUsuario(item) {
    if (item.rol) return item.rol;
    const nom = (item.nombre || "").toLowerCase();
    const cor = (item.correo || "").toLowerCase();
    if (item.id === 1 || item.id === 4 || nom.includes("pablo") || cor.includes("admin") || cor.includes("pablo")) {
        return "Administrador";
    }
    return "Operador";
}

function listadoUsuario() {
    const urlListado = "http://127.0.0.1:8000/api/getUsuario?_t=" + Date.now();
    fetch(urlListado, { cache: "no-store" })
    .then(response => response.json())
    .then(data => {
        if (!data || !data.usuario) return;
        window.todosLosUsuarios = data.usuario;

        // Métricas de usuarios
        const total = window.todosLosUsuarios.length;
        const admins = window.todosLosUsuarios.filter(u => obtenerRolUsuario(u) === "Administrador").length;
        const operadores = total - admins;

        const totalEl = document.getElementById("user-total");
        const activosEl = document.getElementById("user-activos");
        const adminsEl = document.getElementById("user-admins");
        const chipTotal = document.getElementById("user-chip-total");
        const chipAdmins = document.getElementById("user-chip-admins");
        const chipOperadores = document.getElementById("user-chip-operadores");
        const chipActivos = document.getElementById("user-chip-activos");
        const totalCountEl = document.getElementById("user-total-count");

        if (totalEl) totalEl.textContent = total;
        if (activosEl) activosEl.textContent = total;
        if (adminsEl) adminsEl.textContent = admins;
        if (chipTotal) chipTotal.textContent = total;
        if (chipAdmins) chipAdmins.textContent = admins;
        if (chipOperadores) chipOperadores.textContent = operadores;
        if (chipActivos) chipActivos.textContent = total;
        if (totalCountEl) totalCountEl.textContent = total;

        aplicarFiltrosUsuarios();
    })
    .catch(err => console.error("Error al cargar usuarios:", err));
}

function renderizarTablaUsuarios() {
    const tabla = document.getElementById("Listado_Usuario");
    if (!tabla) return;
    tabla.innerHTML = "";

    const totalItems = (usuariosFiltrados || []).length;
    const totalCountEl = document.getElementById("user-total-count");
    if (totalCountEl) totalCountEl.textContent = totalItems;

    if (!usuariosFiltrados || usuariosFiltrados.length === 0) {
        tabla.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; padding: 36px; color: #94A3B8; font-size: 14px;">
                    No se encontraron usuarios registrados.
                </td>
            </tr>
        `;
        const shownCountEl = document.getElementById("user-shown-count");
        if (shownCountEl) shownCountEl.textContent = "0";
        return;
    }

    const inicio = (paginaActualUsuario - 1) * itemsPorPaginaUsuario;
    const fin = inicio + itemsPorPaginaUsuario;
    const itemsPagina = usuariosFiltrados.slice(inicio, fin);

    const shownCountEl = document.getElementById("user-shown-count");
    if (shownCountEl) shownCountEl.textContent = itemsPagina.length;

    itemsPagina.forEach(item => {
        const initials = obtenerInicialesUsuario(item.nombre, item.correo);
        const displayName = formatearNombreUsuario(item.nombre, item.correo, item.id);
        const rol = obtenerRolUsuario(item);
        const isAdmin = rol === "Administrador";
        const roleClass = isAdmin ? "user-role-pill admin" : "user-role-pill";
        const userSub = item.correo ? `@${item.correo.split('@')[0]}` : `ID: #${item.id}`;

        const fila = `
            <tr>
                <td>
                    <div class="user-name-cell">
                        <div class="user-avatar">${initials}</div>
                        <div class="user-info">
                            <span class="user-name">${displayName}</span>
                            <span class="user-sub">${userSub}</span>
                        </div>
                    </div>
                </td>
                <td class="user-email">${item.correo || '-'}</td>
                <td>
                    <span class="${roleClass}">${rol}</span>
                </td>
                <td>
                    <span class="user-status-badge">Activo</span>
                </td>
                <td style="text-align: right;">
                    <div class="actions-cell-wrap">
                        <button type="button" class="btn-action-edit" onclick="editarUsuario(${item.id})" title="Editar usuario">
                            <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                        </button>
                        <button type="button" class="btn-action-delete" onclick="eliminarUsuario(${item.id})" title="Eliminar usuario">
                            <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                <line x1="10" y1="11" x2="10" y2="17"></line>
                                <line x1="14" y1="11" x2="14" y2="17"></line>
                            </svg>
                        </button>
                    </div>
                </td>
            </tr>
        `;
        tabla.innerHTML += fila;
    });
}

function editarUsuario(id) {
    const modal = document.getElementById("modalUsuario");
    if (!modal) return;

    const idInput = document.getElementById("id_login");
    const nombreInput = document.getElementById("nombre");
    const correoInput = document.getElementById("correo");
    const passInput = document.getElementById("password");
    const tituloModal = modal.querySelector("h3");

    if (tituloModal) tituloModal.textContent = "Editar Usuario";
    if (idInput) idInput.value = id;
    if (passInput) passInput.value = "";

    // Cargar datos previos de memoria
    const user = (window.todosLosUsuarios || []).find(u => u.id == id);
    if (user) {
        if (nombreInput) nombreInput.value = (user.nombre && user.nombre !== "null") ? user.nombre : "";
        if (correoInput) correoInput.value = (user.correo) ? user.correo : "";
    }

    // Traer datos actualizados del backend
    fetch("http://127.0.0.1:8000/api/get_usuarios/" + id + "?_t=" + Date.now(), { cache: "no-store" })
    .then(res => res.json())
    .then(data => {
        const u = (data.usuario && data.usuario[0]) ? data.usuario[0] : (data.usuario || null);
        if (u) {
            if (nombreInput) nombreInput.value = (u.nombre && u.nombre !== "null") ? u.nombre : "";
            if (correoInput) correoInput.value = u.correo || "";
        }
    })
    .catch(() => {});

    modal.style.display = "flex";
}

function eliminarUsuario(id) {
    Swal.fire({
        title: "¿Eliminar usuario?",
        text: "Esta acción no se puede deshacer.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DC2626",
        cancelButtonColor: "#6B7280",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar"
    }).then((result) => {
        if (result.isConfirmed) {
            fetch("http://127.0.0.1:8000/api/delete_Usuario/" + id, {
                method: "DELETE"
            })
            .then(() => {
                Swal.fire({
                    icon: "success",
                    title: "¡Eliminado!",
                    text: "Usuario eliminado correctamente.",
                    timer: 1500,
                    showConfirmButton: false
                });
                listadoUsuario();
            })
            .catch(err => {
                console.error("Error al eliminar usuario:", err);
                Swal.fire("Error", "No se pudo eliminar el usuario", "error");
            });
        }
    });
}

function aplicarFiltrosUsuarios(resetearPagina = false) {
    if (!window.todosLosUsuarios) return;
    let filtrados = [...window.todosLosUsuarios];

    // Buscador
    const buscador = document.getElementById("buscadorUsuario");
    const query = buscador ? buscador.value.toLowerCase().trim() : "";
    if (query) {
        filtrados = filtrados.filter(item => {
            const nom = (item.nombre || "").toLowerCase();
            const cor = (item.correo || "").toLowerCase();
            const id = String(item.id || "");
            return nom.includes(query) || cor.includes(query) || id.includes(query);
        });
    }

    // Filtro por Rol
    const filtroRol = document.getElementById("filtroRolUsuario");
    if (filtroRol && filtroRol.value) {
        filtrados = filtrados.filter(item => {
            const r = obtenerRolUsuario(item).toLowerCase();
            return filtroRol.value === "admin" ? r === "administrador" : r === "operador";
        });
    }

    // Ordenar
    const ordenSelect = document.getElementById("ordenarUsuario");
    if (ordenSelect && ordenSelect.value) {
        if (ordenSelect.value === "nombre-asc") {
            filtrados.sort((a, b) => (a.nombre || a.correo || "").localeCompare(b.nombre || b.correo || ""));
        } else if (ordenSelect.value === "nombre-desc") {
            filtrados.sort((a, b) => (b.nombre || b.correo || "").localeCompare(a.nombre || a.correo || ""));
        }
    }

    usuariosFiltrados = filtrados;
    const totalPaginas = Math.ceil(usuariosFiltrados.length / itemsPorPaginaUsuario) || 1;

    if (resetearPagina || paginaActualUsuario > totalPaginas) {
        paginaActualUsuario = 1;
    }
    if (paginaActualUsuario < 1) {
        paginaActualUsuario = 1;
    }

    renderizarPaginacionUsuarios();
    renderizarTablaUsuarios();
}

listadoUsuario();



// --------------------------------Agregar Categoria--------------------------------------
        const formulario3 = document.getElementById("Agregar_categoria");
        formulario3.addEventListener(
    "submit",
    (event) => {
        event.preventDefault(); // Evita la recarga de la página
        let urlMethod = "AddCategoria";
        
        const formData = new FormData(formulario3);
        const id = document.getElementById("id_Categoria");

        if(id.value != "") {
            urlMethod = "update_categorias/"+id.value;
            formData.append("_method", "PUT");
        }

        fetch(
            "http://127.0.0.1:8000/api/"+ urlMethod,
            {
                method: "POST",
                body: formData
            }
        )  
       
    }
);


    function AlertaCategoria(){
    Swal.fire({
        title: "Categoria Registrada con exito!",
        icon: "success"
    }).then(() => {
        document.getElementById("modalCategoria").style.display = "none";

        // (opcional)
        formulario.reset();
    });
}














//-------------------------------- PARA AGREGAR Distribuidor --------------------------------------

    const formulario = document.getElementById("Agregar_Distribuidor");
        formulario.addEventListener(
    "submit",
    (event) => {
        event.preventDefault(); // Evita la recarga de la página
        let urlMethod = "Distribuidor";
        
        const formData = new FormData(formulario);
        const id = document.getElementById("id_Distribuidor");

        const esEdicion = id && id.value != "";
        if(esEdicion) {
            urlMethod = "update_distribuidor/"+id.value;
            formData.append("_method", "PUT");
        }

        fetch(
            "http://127.0.0.1:8000/api/"+ urlMethod,
            {
                method: "POST",
                body: formData
            })
            .then(res => res.json())
            .then(() => {
                Swal.fire({
                    title: esEdicion ? "¡Distribuidor actualizado con éxito!" : "¡Distribuidor registrado con éxito!",
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false
                });

                const modal = document.getElementById("modalDistribuidor");
                if (modal) modal.style.display = "none";

                formulario.reset();
                if (id) id.value = "";

                listadoDistribuidor();
            })
            .catch(err => {
                console.error("Error al guardar distribuidor:", err);
                Swal.fire("Error", "No se pudo guardar el distribuidor", "error");
            });

    });

    function AlertaDistribuidor(){
        // Manejado en el evento submit tras completar la petición
    }


function obtenerInicialesDistribuidor(nombre) {
    if (!nombre) return "DS";
    const parts = nombre.trim().split(/\s+/);
    if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return (nombre.substring(0, 2)).toUpperCase();
}

function obtenerCategoriaDistribuidor(item) {
    if (item.categoria) return item.categoria;
    const n = (item.nombre || "").toLowerCase();
    if (n.includes("eléctric") || n.includes("electric")) return "Eléctrico";
    if (n.includes("chevron") || n.includes("oil") || n.includes("lubric")) return "Lubricantes";
    if (n.includes("samsung") || n.includes("sony") || n.includes("electro")) return "Electrónica";
    if (n.includes("apple") || n.includes("tech") || n.includes("cisco")) return "Tecnología";
    if (n.includes("logíst") || n.includes("transp") || n.includes("express")) return "Transporte";
    return "Suministros";
}

window.todosLosDistribuidores = [];
let paginaActualDist = 1;
const itemsPorPaginaDist = 10;
let distribuidoresFiltrados = [];

function cambiarPaginaDistribuidor(nuevaPagina) {
    const totalPaginas = Math.ceil((distribuidoresFiltrados || []).length / itemsPorPaginaDist) || 1;
    if (nuevaPagina < 1 || nuevaPagina > totalPaginas) return;
    paginaActualDist = nuevaPagina;
    renderizarPaginacionDistribuidores();
    renderizarTablaDistribuidores();
}

function renderizarPaginacionDistribuidores() {
    const nav = document.getElementById("dist-pagination") || document.querySelector(".dist-pagination");
    if (!nav) return;

    const totalItems = (distribuidoresFiltrados || []).length;
    const totalPaginas = Math.ceil(totalItems / itemsPorPaginaDist) || 1;

    let html = "";
    const disablePrev = paginaActualDist <= 1;
    html += `<button class="dist-page-nav" type="button" ${disablePrev ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : `onclick="cambiarPaginaDistribuidor(${paginaActualDist - 1})"`}>Anterior</button>`;

    for (let p = 1; p <= totalPaginas; p++) {
        const isActive = p === paginaActualDist;
        html += `<button class="dist-page-num ${isActive ? 'active' : ''}" type="button" ${isActive ? 'aria-current="page"' : `onclick="cambiarPaginaDistribuidor(${p})"`}>${p}</button>`;
    }

    const disableNext = paginaActualDist >= totalPaginas;
    html += `<button class="dist-page-nav" type="button" ${disableNext ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : `onclick="cambiarPaginaDistribuidor(${paginaActualDist + 1})"`}>Siguiente</button>`;

    nav.innerHTML = html;
}

function listadoDistribuidor() {
    const urlListado = "http://127.0.0.1:8000/api/MostrarDistribuidor?_t=" + Date.now();
    fetch(urlListado, { cache: "no-store" })
    .then(response => response.json())
    .then(data => {
        if (!data || !data.distribuidores) return;
        window.todosLosDistribuidores = data.distribuidores;

        // Métricas de distribuidores
        const distTotalEl = document.getElementById("dist-total");
        const distActivosEl = document.getElementById("dist-activos");
        const chipTotalCount = document.getElementById("chip-total-count");
        const chipActivosCount = document.getElementById("chip-activos-count");
        const totalCount = document.getElementById("dist-total-count");

        const total = window.todosLosDistribuidores.length;
        if (distTotalEl) distTotalEl.textContent = total;
        if (distActivosEl) distActivosEl.textContent = total;
        if (chipTotalCount) chipTotalCount.textContent = total;
        if (chipActivosCount) chipActivosCount.textContent = total;
        if (totalCount) totalCount.textContent = total;

        aplicarFiltrosDistribuidores();
    })
    .catch(err => console.error("Error al cargar distribuidores:", err));
}

function renderizarTablaDistribuidores() {
    const tabla = document.getElementById("datosDistribuidor");
    if (!tabla) return;
    tabla.innerHTML = "";

    const totalItems = (distribuidoresFiltrados || []).length;
    const totalCountEl = document.getElementById("dist-total-count");
    if (totalCountEl) totalCountEl.textContent = totalItems;

    if (!distribuidoresFiltrados || distribuidoresFiltrados.length === 0) {
        tabla.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 36px; color: #94A3B8; font-size: 14px;">
                    No se encontraron distribuidores registrados.
                </td>
            </tr>
        `;
        const shownCountEl = document.getElementById("dist-shown-count");
        if (shownCountEl) shownCountEl.textContent = "0";
        return;
    }

    const inicio = (paginaActualDist - 1) * itemsPorPaginaDist;
    const fin = inicio + itemsPorPaginaDist;
    const itemsPagina = distribuidoresFiltrados.slice(inicio, fin);

    const shownCountEl = document.getElementById("dist-shown-count");
    if (shownCountEl) shownCountEl.textContent = itemsPagina.length;

    itemsPagina.forEach(item => {
        const initials = obtenerInicialesDistribuidor(item.nombre);
        const cat = obtenerCategoriaDistribuidor(item);
        const fila = `
            <tr>
                <td>
                    <div class="dist-name-cell">
                        <div class="dist-avatar">${initials}</div>
                        <div class="dist-info">
                            <span class="dist-name">${item.nombre || "Distribuidor"}</span>
                        </div>
                    </div>
                </td>
                <td class="dist-location" title="${item.ubicacion || ''}">${item.ubicacion || '-'}</td>
                <td class="dist-phone">${item.telefono || '-'}</td>
                <td class="dist-email">${item.email || '-'}</td>
                <td>
                    <span class="dist-category-pill">${cat}</span>
                </td>
                <td>
                    <span class="dist-status-badge activo">Activo</span>
                </td>
                <td style="text-align: right;">
                    <div class="actions-cell-wrap">
                        <button type="button" class="btn-action-edit" onclick="editarDistribuidor(${item.id})" title="Editar distribuidor">
                            <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                        </button>
                        <button type="button" class="btn-action-delete" onclick="eliminarDistribuidor(${item.id})" title="Eliminar distribuidor">
                            <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                <line x1="10" y1="11" x2="10" y2="17"></line>
                                <line x1="14" y1="11" x2="14" y2="17"></line>
                            </svg>
                        </button>
                    </div>
                </td>
            </tr>
        `;
        tabla.innerHTML += fila;
    });
}

function editarDistribuidor(id) {
    const dist = (window.todosLosDistribuidores || []).find(d => d.id == id);
    const modal = document.getElementById("modalDistribuidor");
    if (!modal) return;

    const idInput = document.getElementById("id_Distribuidor");
    const nombreInput = document.getElementById("nombre_distribuidor");
    const ubicacionInput = document.getElementById("ubicacion_distribuidor");
    const telInput = document.getElementById("telefono_distribuidor");
    const emailInput = document.getElementById("email_distribuidor");
    const tituloModal = modal.querySelector("h3");

    if (tituloModal) tituloModal.textContent = "Editar Distribuidor";
    if (idInput) idInput.value = id;
    if (nombreInput) nombreInput.value = (dist && dist.nombre) ? dist.nombre : "";
    if (ubicacionInput) ubicacionInput.value = (dist && dist.ubicacion) ? dist.ubicacion : "";
    if (telInput) telInput.value = (dist && dist.telefono) ? dist.telefono : "";
    if (emailInput) emailInput.value = (dist && dist.email) ? dist.email : "";

    modal.style.display = "flex";
}

function eliminarDistribuidor(id) {
    Swal.fire({
        title: "¿Eliminar distribuidor?",
        text: "Esta acción no se puede deshacer.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DC2626",
        cancelButtonColor: "#6B7280",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar"
    }).then((result) => {
        if (result.isConfirmed) {
            fetch("http://127.0.0.1:8000/api/delete_distribuidor/" + id, {
                method: "DELETE"
            })
            .then(() => {
                Swal.fire({
                    icon: "success",
                    title: "¡Eliminado!",
                    text: "Distribuidor eliminado correctamente.",
                    timer: 1500,
                    showConfirmButton: false
                });
                listadoDistribuidor();
            })
            .catch(err => {
                console.error("Error al eliminar distribuidor:", err);
                Swal.fire("Error", "No se pudo eliminar el distribuidor", "error");
            });
        }
    });
}

function aplicarFiltrosDistribuidores(resetearPagina = false) {
    if (!window.todosLosDistribuidores) return;
    let filtrados = [...window.todosLosDistribuidores];

    // Buscador
    const buscador = document.getElementById("buscadorProveedor");
    const query = buscador ? buscador.value.toLowerCase().trim() : "";
    if (query) {
        filtrados = filtrados.filter(item => {
            const nom = (item.nombre || "").toLowerCase();
            const ubi = (item.ubicacion || "").toLowerCase();
            const tel = (item.telefono || "").toLowerCase();
            const email = (item.email || "").toLowerCase();
            return nom.includes(query) || ubi.includes(query) || tel.includes(query) || email.includes(query);
        });
    }

    // Ordenar
    const ordenSelect = document.getElementById("ordenarDist");
    if (ordenSelect && ordenSelect.value) {
        if (ordenSelect.value === "nombre-asc") {
            filtrados.sort((a, b) => (a.nombre || "").localeCompare(b.nombre || ""));
        } else if (ordenSelect.value === "nombre-desc") {
            filtrados.sort((a, b) => (b.nombre || "").localeCompare(a.nombre || ""));
        }
    }

    distribuidoresFiltrados = filtrados;
    const totalPaginas = Math.ceil(distribuidoresFiltrados.length / itemsPorPaginaDist) || 1;

    if (resetearPagina || paginaActualDist > totalPaginas) {
        paginaActualDist = 1;
    }
    if (paginaActualDist < 1) {
        paginaActualDist = 1;
    }

    renderizarPaginacionDistribuidores();
    renderizarTablaDistribuidores();
}

// Listeners interactivos
document.addEventListener("DOMContentLoaded", () => {
    const inputBuscaDist = document.getElementById("buscadorProveedor");
    if (inputBuscaDist) {
        inputBuscaDist.addEventListener("input", () => aplicarFiltrosDistribuidores(true));
    }

    const selectOrdenDist = document.getElementById("ordenarDist");
    if (selectOrdenDist) {
        selectOrdenDist.addEventListener("change", () => aplicarFiltrosDistribuidores(true));
    }

    const selectEstadoDist = document.getElementById("filtroEstadoDist");
    if (selectEstadoDist) {
        selectEstadoDist.addEventListener("change", () => aplicarFiltrosDistribuidores(true));
    }

    document.querySelectorAll(".dist-chip").forEach(chip => {
        chip.addEventListener("click", function() {
            document.querySelectorAll(".dist-chip").forEach(c => c.classList.remove("active"));
            this.classList.add("active");
            aplicarFiltrosDistribuidores();
        });
    });
});

listadoDistribuidor();



fetch('http://127.0.0.1:8000/api/MostrarCategorias')
    .then(response => response.json())
    .then(data => {
        const select = document.getElementById('categoria_id');
        data.categorias.forEach(categoria => {   // <-- nota data.categorias
            const option = document.createElement('option');
            option.value = categoria.id;
            option.textContent = categoria.nombre;
            select.appendChild(option);
        });
    })
    .catch(error => console.error('Error cargando categorías:', error));


    fetch('http://127.0.0.1:8000/api/MostrarDistribuidor')
    .then(response => response.json())
    .then(data => {
        const select = document.getElementById('proveedor_id');
        data.distribuidores.forEach(distribuidor => {   // <-- nota data.distribuidores
            const option = document.createElement('option');
            option.value = distribuidor.id;
            option.textContent = distribuidor.nombre;
            select.appendChild(option);
        });
    })
    .catch(error => console.error('Error cargando distribuidores:', error));






//-------------------------------- PARA AGREGAR Inventario --------------------------------------
const formulario1 = document.getElementById("Agregar_ProductoS");
if (formulario1) {
    formulario1.addEventListener("submit", (event) => {
        event.preventDefault(); // Evita la recarga de la página
        let urlMethod = "AgregarInventario";
        
        const formData = new FormData(formulario1);
        const id = document.getElementById("id_Producto");

        if (id && id.value != "") {
            urlMethod = "update_usuarios/" + id.value;
            formData.append("_method", "PUT");
        }

        fetch("http://127.0.0.1:8000/api/" + urlMethod, {
            method: "POST",
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            if (typeof Swal !== 'undefined') {
                Swal.fire({
                    icon: 'success',
                    title: '¡Producto Guardado!',
                    text: 'El producto se registró correctamente en el inventario.',
                    timer: 2000,
                    showConfirmButton: false
                });
            }
            formulario1.reset();
            if (typeof cerrarModalProducto === 'function') cerrarModalProducto();
            listadoInventario();
        })
        .catch(err => {
            console.error("Error al guardar producto:", err);
            if (typeof Swal !== 'undefined') {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Ocurrió un error al guardar el producto.'
                });
            }
        });
    });
}

window.todosLosProductos = [];
let paginaActualInv = 1;
const itemsPorPaginaInv = 10;
let productosFiltrados = [];

function cambiarPaginaInventario(nuevaPagina) {
    const totalPaginas = Math.ceil((productosFiltrados || []).length / itemsPorPaginaInv) || 1;
    if (nuevaPagina < 1 || nuevaPagina > totalPaginas) return;
    paginaActualInv = nuevaPagina;
    renderizarPaginacionInventario();
    renderizarTablaInventario();
}

function renderizarPaginacionInventario() {
    const nav = document.getElementById("inv-pagination") || document.querySelector("#section_Inventario .mov-pagination");
    if (!nav) return;

    const totalItems = (productosFiltrados || []).length;
    const totalPaginas = Math.ceil(totalItems / itemsPorPaginaInv) || 1;

    let html = "";
    const disablePrev = paginaActualInv <= 1;
    html += `<button type="button" class="mov-page-btn" ${disablePrev ? 'disabled style="opacity: 0.4; cursor: not-allowed;"' : `onclick="cambiarPaginaInventario(${paginaActualInv - 1})"`}>Anterior</button>`;

    for (let p = 1; p <= totalPaginas; p++) {
        const isActive = p === paginaActualInv;
        html += `<button type="button" class="mov-page-btn ${isActive ? 'active' : ''}" ${isActive ? 'aria-current="page"' : `onclick="cambiarPaginaInventario(${p})"`}>${p}</button>`;
    }

    const disableNext = paginaActualInv >= totalPaginas;
    html += `<button type="button" class="mov-page-btn" ${disableNext ? 'disabled style="opacity: 0.4; cursor: not-allowed;"' : `onclick="cambiarPaginaInventario(${paginaActualInv + 1})"`}>Siguiente</button>`;

    nav.innerHTML = html;
}

function aplicarFiltrosInventario(resetearPagina = false) {
    if (!window.todosLosProductos) return;
    let filtrados = [...window.todosLosProductos];

    const inputBuscador = document.getElementById("buscador");
    const query = inputBuscador ? inputBuscador.value.toLowerCase().trim() : "";

    const selectCategoria = document.getElementById("filtroCategoria");
    const categoria = selectCategoria ? selectCategoria.value.toLowerCase().trim() : "";

    if (query) {
        filtrados = filtrados.filter(item => {
            const nom = (item.nombre || "").toLowerCase();
            const desc = (item.descripcion || "").toLowerCase();
            const cat = (item.categoria || "").toLowerCase();
            return nom.includes(query) || desc.includes(query) || cat.includes(query);
        });
    }

    if (categoria) {
        filtrados = filtrados.filter(item => {
            const cat = (item.categoria || "").toLowerCase();
            return cat.includes(categoria);
        });
    }

    productosFiltrados = filtrados;
    const totalPaginas = Math.ceil(productosFiltrados.length / itemsPorPaginaInv) || 1;

    if (resetearPagina || paginaActualInv > totalPaginas) {
        paginaActualInv = 1;
    }
    if (paginaActualInv < 1) {
        paginaActualInv = 1;
    }

    renderizarPaginacionInventario();
    renderizarTablaInventario();
}

function renderizarTablaInventario() {
    let tabla = document.getElementById("MostrarInventario");
    if (!tabla) return;
    tabla.innerHTML = "";

    const totalItems = (productosFiltrados || []).length;
    const footerCountEl = document.getElementById("inv-footer-count");

    if (!productosFiltrados || productosFiltrados.length === 0) {
        tabla.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 36px; color: #9CA3AF; font-size: 14px;">
                    No se encontraron productos en inventario.
                </td>
            </tr>
        `;
        if (footerCountEl) footerCountEl.textContent = `Mostrando 0 de 0 productos`;
        return;
    }

    const inicio = (paginaActualInv - 1) * itemsPorPaginaInv;
    const fin = inicio + itemsPorPaginaInv;
    const itemsPagina = productosFiltrados.slice(inicio, fin);

    if (footerCountEl) {
        footerCountEl.textContent = `Mostrando ${itemsPagina.length} de ${totalItems} productos`;
    }

    itemsPagina.forEach(item => {
        const esBajo = parseInt(item.cantidad) < 10;
        const cantidadHtml = esBajo 
            ? `<span class="badge-stock-bajo"><svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg> Bajo (${item.cantidad})</span>`
            : `<span class="inv-cantidad-normal">${item.cantidad}</span>`;

        const precioFmt = item.precio ? `$${parseFloat(item.precio).toFixed(2)}` : "$0.00";
        const imagenSrc = item.imagen ? `http://127.0.0.1:8000/${item.imagen}` : "";

        let fila = `<tr class="mov-tr">`;
        fila += `<td class="mov-td-producto">${item.nombre}</td>`;
        fila += `<td class="inv-td-desc" title="${item.descripcion || ''}">${item.descripcion || '-'}</td>`;
        fila += `<td class="mov-td-precio">${precioFmt}</td>`;
        fila += `<td>${cantidadHtml}</td>`;
        // Respetar apartado de imagen con src correcto y vista previa limpia
        fila += `<td>
            <div class="inv-img-container">
                <img src="${imagenSrc}" width="150px" alt="${item.nombre}" class="inv-img-thumb" onerror="this.onerror=null; this.src='https://placehold.co/150x100?text=Sin+Imagen';">
            </div>
        </td>`;
        fila += `<td><span class="badge-estado-activo">Activo</span></td>`;
        fila += `<td class="categoria"><span class="badge-categoria-pill">${item.categoria || 'Sin categoría'}</span></td>`;
        fila += `</tr>`;
        tabla.innerHTML += fila;
    });
}

function listadoInventario() {
    const urlListado = "http://127.0.0.1:8000/api/MostrarInventario?_t=" + Date.now();
    fetch(urlListado, { cache: "no-store" })
    .then(response => response.json())
    .then(data => {
        if (!data || !data.producto) return;
        window.todosLosProductos = data.producto;

        // Métricas de inventario
        const totalProdEl = document.getElementById("inv-total-productos");
        const stockTotalEl = document.getElementById("inv-stock-total");
        const bajoStockEl = document.getElementById("inv-bajo-stock");
        const totalCatEl = document.getElementById("inv-total-categorias");

        let totalProductos = window.todosLosProductos.length;
        let sumaStock = window.todosLosProductos.reduce((acc, p) => acc + (parseInt(p.cantidad) || 0), 0);
        let bajoStockCount = window.todosLosProductos.filter(p => parseInt(p.cantidad) < 10).length;
        let categoriasUnicas = [...new Set(window.todosLosProductos.map(p => p.categoria).filter(Boolean))];

        if (totalProdEl) totalProdEl.textContent = totalProductos;
        if (stockTotalEl) stockTotalEl.textContent = sumaStock.toLocaleString();
        if (bajoStockEl) bajoStockEl.textContent = bajoStockCount;
        if (totalCatEl) totalCatEl.textContent = categoriasUnicas.length;

        const select = document.getElementById("filtroCategoria");
        if (select) {
            const valorActual = select.value;
            select.innerHTML = `<option value="">Todas</option>`;
            categoriasUnicas.forEach(cat => {
                select.innerHTML += `<option value="${cat}">${cat}</option>`;
            });
            if (valorActual) select.value = valorActual;
        }

        aplicarFiltrosInventario();
    })
    .catch(error => console.error("Error al cargar inventario:", error));
}
listadoInventario();



    fetch('http://127.0.0.1:8000/api/MostrarInventario')
    .then(response => response.json())
    .then(data => {
        const select = document.getElementById('select_producto');
        data.producto.forEach(distribuidor => {   
            const option = document.createElement('option');
            option.value = distribuidor.id;
            option.textContent = distribuidor.nombre;
            select.appendChild(option);
        });
    })
    .catch(error => console.error('Error cargando producto:', error));


    fetch('http://127.0.0.1:8000/api/MostrarDistribuidor')
    .then(response => response.json())
    .then(data => {
        const select = document.getElementById('proveedor_id_producto');
        data.distribuidores.forEach(distribuidor => {   // <-- nota data.distribuidores
            const option = document.createElement('option');
            option.value = distribuidor.id;
            option.textContent = distribuidor.nombre;
            select.appendChild(option);
        });
    })
    .catch(error => console.error('Error cargando distribuidores:', error));




//----------------------------------------------Agregar Entrada / Salida------------------------------------

const formulario2 = document.getElementById("formulario_movimientos");

if (formulario2) {
    formulario2.addEventListener("submit", (event) => {
        event.preventDefault();

        const formData = new FormData(formulario2);
        const tipo = document.getElementById("tipo_movimiento") ? document.getElementById("tipo_movimiento").value : "";

        let urlMethod = "";

        if (tipo === "entrada") {
            urlMethod = "Entradas";   
        } else if (tipo === "salida") {
            urlMethod = "Salidas";    
        } else {
            alert("Selecciona Entrada o Salida");
            return;
        }

        fetch("http://127.0.0.1:8000/api/" + urlMethod, {
            method: "POST",
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            if (typeof Swal !== 'undefined') {
                Swal.fire({
                    icon: 'success',
                    title: '¡Movimiento Registrado!',
                    text: `${tipo === 'entrada' ? 'Entrada' : 'Salida'} guardada con éxito.`,
                    timer: 2000,
                    showConfirmButton: false
                });
            }
            limpiarFormularioMovimiento();
            cargarHistorialStock();
        })
        .catch(err => {
            console.error("Error al registrar movimiento:", err);
            if (typeof Swal !== 'undefined') {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Ocurrió un error al procesar el movimiento.'
                });
            }
        });
    });
}

// Cargar y renderizar historial de movimientos
window.todosLosMovimientos = [];
let paginaActualMov = 1;
const itemsPorPaginaMov = 10;
let movimientosFiltrados = [];

function cambiarPaginaMovimiento(nuevaPagina) {
    const totalPaginas = Math.ceil((movimientosFiltrados || []).length / itemsPorPaginaMov) || 1;
    if (nuevaPagina < 1 || nuevaPagina > totalPaginas) return;
    paginaActualMov = nuevaPagina;
    renderizarPaginacionMovimientos();
    renderizarTablaMovimientos();
}

function renderizarPaginacionMovimientos() {
    const nav = document.getElementById("mov-pagination") || document.querySelector(".mov-pagination");
    if (!nav) return;

    const totalItems = (movimientosFiltrados || []).length;
    const totalPaginas = Math.ceil(totalItems / itemsPorPaginaMov) || 1;

    let html = "";
    const disablePrev = paginaActualMov <= 1;
    html += `<button type="button" class="mov-page-btn" id="mov-page-prev" ${disablePrev ? 'disabled style="opacity: 0.4; cursor: not-allowed;"' : `onclick="cambiarPaginaMovimiento(${paginaActualMov - 1})"`}>Anterior</button>`;

    for (let p = 1; p <= totalPaginas; p++) {
        const isActive = p === paginaActualMov;
        html += `<button type="button" class="mov-page-btn ${isActive ? 'active' : ''}" ${isActive ? 'aria-current="page"' : `onclick="cambiarPaginaMovimiento(${p})"`}>${p}</button>`;
    }

    const disableNext = paginaActualMov >= totalPaginas;
    html += `<button type="button" class="mov-page-btn" id="mov-page-next" ${disableNext ? 'disabled style="opacity: 0.4; cursor: not-allowed;"' : `onclick="cambiarPaginaMovimiento(${paginaActualMov + 1})"`}>Siguiente</button>`;

    nav.innerHTML = html;
}

function cargarHistorialStock() {
    fetch("http://127.0.0.1:8000/api/historial?_t=" + Date.now(), { cache: "no-store" })
    .then(res => res.json())
    .then(data => {
        window.todosLosMovimientos = Array.isArray(data) ? data : [];
        actualizarMetricasMovimientos(window.todosLosMovimientos);
        aplicarFiltrosMovimientos();
    })
    .catch(err => {
        console.error("Error cargando historial de stock:", err);
    });
}

function actualizarMetricasMovimientos(data) {
    const totalEl = document.getElementById("metric-total-mov");
    const entradasEl = document.getElementById("metric-entradas-hoy");
    const salidasEl = document.getElementById("metric-salidas-hoy");
    const stockEl = document.getElementById("metric-stock-disponible");

    const total = data.length;
    const entradas = data.filter(item => item.tipo === "Entrada").length;
    const salidas = data.filter(item => item.tipo === "Salida").length;

    if (totalEl) totalEl.textContent = total;
    if (entradasEl) entradasEl.textContent = entradas;
    if (salidasEl) salidasEl.textContent = salidas;

    // Calcular suma total de stock desde la API de inventario
    fetch("http://127.0.0.1:8000/api/MostrarInventario")
    .then(res => res.json())
    .then(inv => {
        if (inv && inv.producto && stockEl) {
            const totalStock = inv.producto.reduce((sum, p) => sum + (parseInt(p.cantidad) || 0), 0);
            stockEl.textContent = totalStock.toLocaleString();
        }
    })
    .catch(() => {
        if (stockEl) stockEl.textContent = "1,240";
    });
}

function aplicarFiltrosMovimientos(resetearPagina = false) {
    if (!window.todosLosMovimientos) return;
    let filtrados = [...window.todosLosMovimientos];

    const inputBuscadorMov = document.getElementById("buscadorMovimientos");
    const query = inputBuscadorMov ? inputBuscadorMov.value.toLowerCase().trim() : "";
    if (query) {
        filtrados = filtrados.filter(item => {
            const prod = (item.producto || "").toLowerCase();
            const tipo = (item.tipo || "").toLowerCase();
            const fecha = (item.fecha_movimiento || "").toLowerCase();
            return prod.includes(query) || tipo.includes(query) || fecha.includes(query);
        });
    }

    movimientosFiltrados = filtrados;
    const totalPaginas = Math.ceil(movimientosFiltrados.length / itemsPorPaginaMov) || 1;

    if (resetearPagina || paginaActualMov > totalPaginas) {
        paginaActualMov = 1;
    }
    if (paginaActualMov < 1) {
        paginaActualMov = 1;
    }

    renderizarPaginacionMovimientos();
    renderizarTablaMovimientos();
}

function renderizarTablaMovimientos() {
    const tabla = document.getElementById("datosStock");
    if (!tabla) return;
    tabla.innerHTML = "";

    const totalItems = (movimientosFiltrados || []).length;
    const footerCount = document.getElementById("mov-footer-count");

    if (!movimientosFiltrados || movimientosFiltrados.length === 0) {
        tabla.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 36px; color: #9CA3AF; font-size: 14px;">
                    No se encontraron movimientos registrados.
                </td>
            </tr>
        `;
        if (footerCount) footerCount.textContent = `Mostrando 0 de 0 movimientos`;
        return;
    }

    const inicio = (paginaActualMov - 1) * itemsPorPaginaMov;
    const fin = inicio + itemsPorPaginaMov;
    const itemsPagina = movimientosFiltrados.slice(inicio, fin);

    if (footerCount) {
        footerCount.textContent = `Mostrando ${itemsPagina.length} de ${totalItems} movimientos`;
    }

    itemsPagina.forEach(item => {
        const isEntrada = item.tipo === "Entrada";
        const badgeClase = isEntrada ? "badge-tipo-entrada" : "badge-tipo-salida";
        const iconSvg = isEntrada
            ? `<svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 14l-7 7m0 0l-7-7m7 7V3" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"></path></svg>`
            : `<svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 10l7-7m0 0l7 7m-7-7v18" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"></path></svg>`;
        
        const cantPrefijo = isEntrada ? `+` : `-`;
        const cantClase = isEntrada ? "mov-cant-entrada" : "mov-cant-salida";
        const precio = item.precio_compra ? `$${parseFloat(item.precio_compra).toFixed(2)}` : "$0.00";

        tabla.innerHTML += `
            <tr class="mov-tr">
                <td>
                    <span class="${badgeClase}">
                        ${iconSvg}
                        ${item.tipo}
                    </span>
                </td>
                <td class="mov-td-producto">${item.producto || "Sin especificar"}</td>
                <td class="mov-td-cantidad ${cantClase}">${cantPrefijo}${item.cantidad}</td>
                <td class="mov-td-fecha">${item.fecha_movimiento || "-"}</td>
                <td class="mov-td-precio">${precio}</td>
                <td style="text-align: right;">
                    <button type="button" onclick='descargarPDF(${JSON.stringify(item)})' class="btn-pdf-ticket">
                        <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg>
                        PDF
                    </button>
                </td>
            </tr>
        `;
    });
}

// Buscador en vivo de movimientos
const inputBuscadorMov = document.getElementById("buscadorMovimientos");
if (inputBuscadorMov) {
    inputBuscadorMov.addEventListener("input", function() {
        aplicarFiltrosMovimientos(true);
    });
}

// Helpers para la interfaz de movimientos
function focusFormMovimiento() {
    const card = document.getElementById("card_registro_movimiento");
    if (card) {
        card.scrollIntoView({ behavior: "smooth" });
        const prod = document.getElementById("select_producto");
        if (prod) prod.focus();
    }
}

function limpiarFormularioMovimiento() {
    const form = document.getElementById("formulario_movimientos");
    if (form) form.reset();
    Entrada();
    const fechaInput = document.getElementById("fecha_movimiento");
    if (fechaInput) {
        fechaInput.value = new Date().toISOString().slice(0, 10);
    }
}

// Inicializar fecha de hoy por defecto y cargar historial inicial
const fechaInicial = document.getElementById("fecha_movimiento");
if (fechaInicial && !fechaInicial.value) {
    fechaInicial.value = new Date().toISOString().slice(0, 10);
}

cargarHistorialStock();



//Generar pdf 

function descargarPDF(item) {

    let ventana = window.open("", "_blank");

    ventana.document.write(`<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>Refaccionaria Ascencio</title>

<style>
body {
    font-family: 'Segoe UI', Arial;
    background: #eef2f7;
    padding: 30px;
}

/* CONTENEDOR */
.factura {
    max-width: 800px;
    margin: auto;
    background: white;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 8px 20px rgba(0,0,0,0.1);
}

/* HEADER */
.header {
    background: #0f172a;
    color: white;
    padding: 25px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.logo {
    font-size: 22px;
    font-weight: bold;
}

.info-empresa {
    text-align: right;
    font-size: 13px;
    color: #cbd5e1;
}

/* TITULO */
.titulo {
    padding: 20px;
    border-bottom: 1px solid #e5e7eb;
    font-size: 18px;
    font-weight: bold;
}

/* TABLA */
.tabla {
    width: 100%;
    border-collapse: collapse;
}

.tabla th {
    background: #f1f5f9;
    padding: 12px;
    text-align: left;
    font-size: 13px;
}

.tabla td {
    padding: 12px;
    border-bottom: 1px solid #e5e7eb;
}

/* BADGES */
.badge {
    padding: 6px 14px;
    border-radius: 20px;
    font-size: 12px;
    color: white;
}

.entrada {
    background: #22c55e;
}

.salida {
    background: #ef4444;
}

/* TOTAL */
.total {
    text-align: right;
    padding: 20px;
    font-size: 18px;
    font-weight: bold;
}

/* FOOTER */
.footer {
    text-align: center;
    font-size: 12px;
    padding: 15px;
    color: #6b7280;
}

@media print {
    body {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
    }
}
</style>

</head>
<body>

<div class="factura">

    <!-- HEADER -->
    <div class="header">
        <div class="logo">Refaccionaria Ascencio</div>
        <div class="info-empresa">
            Ciudad del Carmen, Campeche<br>
            Tel: 938-136-6383<br>
        </div>
    </div>

    <!-- TITULO -->
    <div class="titulo">
        Reporte de Movimiento
    </div>

    <!-- TABLA -->
    <table class="tabla">
        <thead>
            <tr>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Tipo</th>
                <th>Fecha</th>
                <th>Precio</th>
                <th>Precio Iva</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td id="producto">---</td>
                <td id="cantidad">---</td>
                <td id="tipo">---</td>
                <td id="fecha">---</td>
                <td id="precio">---</td>
                <td id="precio+Iva">0.16</td>
            </tr>
        </tbody>
    </table>

    <!-- TOTAL -->
    <div class="total">
        Total: <span id="total">$0</span>
    </div>

    <!-- FOOTER -->
    <div class="footer">
        Refaccionaria Ascencio © 2026
    </div>

</div>

</body>
</html>`);

    ventana.document.close();

    ventana.onload = () => {

ventana.document.getElementById("producto").innerText = item.producto;
ventana.document.getElementById("cantidad").innerText = item.cantidad;
ventana.document.getElementById("fecha").innerText = item.fecha_movimiento;

// precio base
let precio = parseFloat(item.precio_compra);
ventana.document.getElementById("precio").innerText = "$" + precio.toFixed(2);

let tipoClase = item.tipo === "Entrada" ? "entrada" : "salida";

ventana.document.getElementById("tipo").innerHTML =
    `<span class="badge ${tipoClase}">${item.tipo}</span>`;

// 🔥 cálculos
let subtotal = item.cantidad * precio;
let iva = subtotal * 0.16;
let total = subtotal + iva;

// mostrar total
ventana.document.getElementById("total").innerText = "$" + total.toFixed(2);

        ventana.print();
    };
}


//_---------------------------------------Buscador y Filtro Inventario-----------------------------
document.addEventListener("DOMContentLoaded", function() {
    const buscador = document.getElementById("buscador");
    if (buscador) {
        buscador.addEventListener("input", function() {
            aplicarFiltrosInventario(true);
        });
    }

    const filtroCategoria = document.getElementById("filtroCategoria");
    if (filtroCategoria) {
        filtroCategoria.addEventListener("change", function() {
            aplicarFiltrosInventario(true);
        });
    }
});

//_---------------------------------------Buscador Proveedores-----------------------------
document.addEventListener("DOMContentLoaded", function() {
    const buscador = document.getElementById("buscadorProveedor");
    if (buscador) {
        buscador.addEventListener("input", function() {
            aplicarFiltrosDistribuidores(true);
        });
    }
});

// ---------------------------------------Controles y Buscador Usuarios-----------------------------------
document.addEventListener("DOMContentLoaded", function() {

    const buscador = document.getElementById("buscadorUsuario");
    if (buscador) {
        buscador.addEventListener("input", function() {
            aplicarFiltrosUsuarios(true);
        });
    }

    const filtroRol = document.getElementById("filtroRolUsuario");
    if (filtroRol) {
        filtroRol.addEventListener("change", function() {
            aplicarFiltrosUsuarios(true);
        });
    }

    const ordenar = document.getElementById("ordenarUsuario");
    if (ordenar) {
        ordenar.addEventListener("change", function() {
            aplicarFiltrosUsuarios(true);
        });
    }

    document.querySelectorAll(".user-chip").forEach(chip => {
        chip.addEventListener("click", function() {
            document.querySelectorAll(".user-chip").forEach(c => c.classList.remove("active"));
            this.classList.add("active");

            const filter = this.getAttribute("data-filter");
            if (filtroRol) {
                if (filter === "admin") filtroRol.value = "admin";
                else if (filter === "operador") filtroRol.value = "operador";
                else filtroRol.value = "";
            }
            aplicarFiltrosUsuarios(true);
        });
    });

});




function Cerrar_sesion(){
    localStorage.removeItem("nombre_usuario");
    window.location.href="Login.html";
}

const usuario = localStorage.getItem("nombre_usuario");
    if (usuario === null) {
        window.location.href = "Login.html";
    } else {
        document.getElementById("nombre_usuario").innerText = " " + usuario;
    }