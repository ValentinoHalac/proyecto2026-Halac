const REFERENCIAS = {
    amateur: {nombre: "Amateur", atajadas: 60, golesPorPartido: 1.5, vallas: 20},
    juveniles: {nombre: "Juveniles", atajadas: 65, golesPorPartido: 1.2, vallas: 25},
    primera: {nombre: "Primera", atajadas: 70, golesPorPartido: 1.0, vallas: 30}
};

const MINUTOS_MAXIMOS_POR_PARTIDO = 120;

const CAMPOS_NUMERICOS = [
    {id: "partidos", nombre: "Partidos jugados"},
    {id: "minutos", nombre: "Minutos jugados"},
    {id: "tiros", nombre: "Tiros al arco recibidos"},
    {id: "goles", nombre: "Goles recibidos"},
    {id: "vallas", nombre: "Vallas invictas"}
];

/**
 * Muestra un mensaje de error con un alert y en el recuadro de error, y blanquea el campo con el valor incorrecto.
 * @method mostrarError
 * @param {string} mensaje - Texto que explica el error al usuario
 * @param {HTMLElement} campo - Campo del formulario que tiene el valor incorrecto
 * @return {null} Devuelve null para indicar que los datos no son válidos
 */
const mostrarError = (mensaje, campo) => {
    const recuadro = document.getElementById("mensaje-error");
    alert(mensaje);
    recuadro.textContent = mensaje;
    recuadro.classList.remove("oculto");
    if (campo.tagName === "SELECT") {
        campo.selectedIndex = 0;
    } else {
        campo.value = "";
    }
    campo.focus();
    return null;
};

/**
 * Oculta el recuadro de error y borra su texto.
 * @method ocultarError
 * @return {void}
 */
const ocultarError = () => {
    const recuadro = document.getElementById("mensaje-error");
    recuadro.textContent = "";
    recuadro.classList.add("oculto");
};

/**
 * Vuelve los resultados a su estado inicial, con guiones en lugar de valores.
 * @method reiniciarResultados
 * @return {void}
 */
const reiniciarResultados = () => {
    const idsResultados = ["resultado-atajadas", "resultado-goles-partido", "resultado-goles-90", "resultado-vallas", "valoracion-valor"];
    for (const id of idsResultados) {
        document.getElementById(id).textContent = "—";
    }
    document.getElementById("valoracion-titulo").textContent = "Valoración";
    document.getElementById("valoracion-detalle").textContent = "Cargá tus datos para ver tu valoración.";
    document.getElementById("valoracion").className = "valoracion";
};

/**
 * Lee y valida todos los campos del formulario. Si encuentra un error, avisa al usuario y blanquea el campo.
 * @method validarDatos
 * @return {Object|null} Objeto con el nombre, la categoría y los valores numéricos, o null si algún dato es incorrecto
 */
const validarDatos = () => {
    const campoNombre = document.getElementById("nombre");
    const campoCategoria = document.getElementById("categoria");
    const nombre = campoNombre.value.trim();
    const datos = {nombre: nombre, categoria: campoCategoria.value};

    if (nombre === "") {
        return mostrarError("Completá tu nombre.", campoNombre);
    }
    if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü ]+$/.test(nombre)) {
        return mostrarError("El nombre solo puede tener letras y espacios.", campoNombre);
    }
    if (datos.categoria === "") {
        return mostrarError("Elegí tu categoría.", campoCategoria);
    }

    for (const campo of CAMPOS_NUMERICOS) {
        const entrada = document.getElementById(campo.id);
        const valor = entrada.value.trim();
        if (valor === "") {
            return mostrarError(`Completá el campo «${campo.nombre}».`, entrada);
        }
        if (!/^\d+$/.test(valor)) {
            return mostrarError(`En «${campo.nombre}» ingresá solo números enteros positivos, sin letras, signos ni decimales.`, entrada);
        }
        datos[campo.id] = Number(valor);
    }

    if (datos.partidos === 0) {
        return mostrarError("Los partidos jugados tienen que ser al menos 1.", document.getElementById("partidos"));
    }
    if (datos.minutos === 0) {
        return mostrarError("Los minutos jugados tienen que ser mayores a 0.", document.getElementById("minutos"));
    }
    if (datos.minutos > datos.partidos * MINUTOS_MAXIMOS_POR_PARTIDO) {
        return mostrarError(`En ${datos.partidos} partidos no se pueden jugar más de ${datos.partidos * MINUTOS_MAXIMOS_POR_PARTIDO} minutos (máximo ${MINUTOS_MAXIMOS_POR_PARTIDO} por partido, con alargue).`, document.getElementById("minutos"));
    }
    if (datos.tiros === 0) {
        return mostrarError("Necesitás al menos un tiro al arco recibido para calcular el porcentaje de atajadas.", document.getElementById("tiros"));
    }
    if (datos.goles > datos.tiros) {
        return mostrarError("Los goles recibidos no pueden ser mayores a los tiros al arco recibidos.", document.getElementById("goles"));
    }
    if (datos.vallas > datos.partidos) {
        return mostrarError("Las vallas invictas no pueden ser más que los partidos jugados.", document.getElementById("vallas"));
    }
    if (datos.goles < datos.partidos - datos.vallas) {
        return mostrarError(`Con ${datos.vallas} vallas invictas en ${datos.partidos} partidos, recibiste goles en ${datos.partidos - datos.vallas} partidos, así que no pueden ser menos de ${datos.partidos - datos.vallas} goles. Revisá las vallas invictas.`, document.getElementById("vallas"));
    }
    return datos;
};

/**
 * Calcula las métricas de rendimiento del arquero.
 * @method calcularMetricas
 * @param {Object} datos - Valores validados: partidos, minutos, tiros, goles y vallas
 * @return {Object} Porcentaje de atajadas, goles por partido, goles cada 90 minutos y porcentaje de vallas invictas
 */
const calcularMetricas = (datos) => ({
    atajadas: (datos.tiros - datos.goles) / datos.tiros * 100,
    golesPorPartido: datos.goles / datos.partidos,
    golesCada90: datos.goles / (datos.minutos / 90),
    vallas: datos.vallas / datos.partidos * 100
});

/**
 * Compara las métricas con los valores de referencia de la categoría y arma la valoración.
 * @method obtenerValoracion
 * @param {Object} metricas - Métricas calculadas por calcularMetricas
 * @param {string} categoria - Clave de la categoría elegida (amateur, juveniles o primera)
 * @param {string} nombre - Nombre del arquero
 * @return {Object} Título de la valoración, texto con el detalle y clase CSS para el color
 */
const obtenerValoracion = (metricas, categoria, nombre) => {
    const referencia = REFERENCIAS[categoria];
    const aMejorar = [];

    if (metricas.atajadas <= referencia.atajadas) {
        aMejorar.push("% de atajadas");
    }
    if (metricas.golesPorPartido >= referencia.golesPorPartido) {
        aMejorar.push("goles por partido");
    }
    if (metricas.vallas <= referencia.vallas) {
        aMejorar.push("% de vallas invictas");
    }

    const cumplidas = 3 - aMejorar.length;

    if (cumplidas === 3) {
        return {
            titulo: "Muralla",
            detalle: `${nombre}, cumplís las 3 métricas de tu categoría. ¡Seguí así!`,
            clase: "valoracion-muralla"
        };
    }
    if (cumplidas === 2) {
        return {
            titulo: "Sólido",
            detalle: `${nombre}, cumplís 2 de 3 métricas. Para ser una Muralla, mejorá: ${aMejorar.join(", ")}.`,
            clase: "valoracion-solido"
        };
    }
    return {
        titulo: "En desarrollo",
        detalle: `${nombre}, cumplís ${cumplidas} de 3 métricas. A trabajar: ${aMejorar.join(", ")}.`,
        clase: "valoracion-desarrollo"
    };
};

/**
 * Da formato a un número con coma decimal, como se escribe en Argentina.
 * @method formatearNumero
 * @param {number} numero - Número a formatear
 * @param {number} decimales - Cantidad de decimales a mostrar
 * @return {string} Número formateado como texto
 */
const formatearNumero = (numero, decimales) => numero.toLocaleString("es-AR", {
    minimumFractionDigits: decimales,
    maximumFractionDigits: decimales
});

/**
 * Valida los datos, calcula las métricas y muestra los resultados y la valoración. Se llama al presionar «Calcular».
 * @method calcular
 * @return {void}
 */
const calcular = () => {
    ocultarError();
    const datos = validarDatos();
    if (datos === null) {
        reiniciarResultados();
        return;
    }

    const metricas = calcularMetricas(datos);
    const valoracion = obtenerValoracion(metricas, datos.categoria, datos.nombre);

    document.getElementById("resultado-atajadas").textContent = `${formatearNumero(metricas.atajadas, 1)} %`;
    document.getElementById("resultado-goles-partido").textContent = formatearNumero(metricas.golesPorPartido, 2);
    document.getElementById("resultado-goles-90").textContent = formatearNumero(metricas.golesCada90, 2);
    document.getElementById("resultado-vallas").textContent = `${formatearNumero(metricas.vallas, 1)} %`;
    document.getElementById("valoracion-titulo").textContent = `Valoración para categoría ${REFERENCIAS[datos.categoria].nombre}`;
    document.getElementById("valoracion-valor").textContent = `«${valoracion.titulo}»`;
    document.getElementById("valoracion-detalle").textContent = valoracion.detalle;
    document.getElementById("valoracion").className = `valoracion ${valoracion.clase}`;
};

/**
 * Borra todos los campos del formulario, los resultados y el mensaje de error. Se llama al presionar «Limpiar».
 * @method limpiar
 * @return {void}
 */
const limpiar = () => {
    document.getElementById("formulario-arquero").reset();
    ocultarError();
    reiniciarResultados();
    document.getElementById("nombre").focus();
};
