let productosEnCarrito = localStorage.getItem("productos-en-carrito");
productosEnCarrito = JSON.parse(productosEnCarrito);

const contenedorCarritoVacio = document.querySelector("#carrito-vacio");
const contenedorCarritoProductos = document.querySelector("#carrito-productos");
const tablaCarrito = document.querySelector("#tabla-productos");
let botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");
const contenedorCarritoAcciones = document.querySelector("#carrito-acciones");
const botonVaciar = document.querySelector("#carrito-acciones-vaciar");
const contenedorTotal = document.querySelector("#total");
const botonComprar = document.querySelector("#carrito-acciones-comprar");


function cargarProductosCarrito() {
    if (productosEnCarrito && productosEnCarrito.length > 0) {

        contenedorCarritoVacio.classList.add("disabled");

        contenedorCarritoProductos.innerHTML = "";

        productosEnCarrito.forEach(producto => {
            const div = document.createElement("tr");
            div.classList.add("carrito-producto", "table-light");
            div.innerHTML = `
                <td>
                    <img class="carrito-producto-imagen" src="${producto.imagen}" alt="${producto.titulo}">
                </td>
                <td>${producto.titulo}</td>
                <td>${producto.cantidad}</td>
                <td>$${producto.precio}</td>
                <td>$${producto.precio * producto.cantidad}</td>
                <td><button class="carrito-producto-eliminar" id="${producto.id}"><i class="fa-solid fa-trash"></i></button></td>
            `;
            contenedorCarritoProductos.append(div);
        });

        actualizarBotonesEliminar();
        actualizarTotal();
    } else {
        // Mostrar el mensaje de carrito vacío y ocultar la tabla y las acciones
        contenedorCarritoVacio.classList.remove("disabled");
        tablaCarrito.classList.add("disabled");
        contenedorCarritoAcciones.classList.add("disabled");
    }
}

cargarProductosCarrito();


function actualizarBotonesEliminar() {
    botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");

    botonesEliminar.forEach(boton => {
        boton.addEventListener("click", eliminarDelCarrito);
    });
}

function eliminarDelCarrito(e) {
    Toastify({
        text: "Producto eliminado",
        duration: 2500,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
            background: "#BF9D3D",
            borderRadius: "2rem",
            textTransform: "uppercase",
            fontSize: ".75rem"
        },
        offset: {
            x: '1rem', // horizontal axis - can be a number or a string indicating unity. eg: '2em'
            y: '4rem' // vertical axis - can be a number or a string indicating unity. eg: '2em'
        }
    }).showToast();

    const idBoton = e.currentTarget.id;
    const index = productosEnCarrito.findIndex(producto => producto.id === idBoton);
    
    productosEnCarrito.splice(index, 1);
    cargarProductosCarrito();

    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
}

botonVaciar.addEventListener("click", vaciarCarrito);
function vaciarCarrito() {

    Swal.fire({
        title: '¿Estás seguro?',
        icon: 'question',
        html: `Se van a borrar ${productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0)} productos.`,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: 'Sí',
        cancelButtonText: 'No'
    }).then((result) => {
        if (result.isConfirmed) {
            productosEnCarrito.length = 0;
            localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
            cargarProductosCarrito();
        }
    })
}

function actualizarTotal() {
    const totalCalculado = productosEnCarrito.reduce((acc, producto) => acc + (producto.precio * producto.cantidad), 0);
    total.innerText = `$${totalCalculado}`;
}

botonComprar.addEventListener("click", comprarCarrito);

function comprarCarrito() {
    Swal.fire({
        title: "¡Gracias por tu compra!",
        text: "En breve recibirás la confirmación por email",
        icon: "success",
        confirmButtonText: '¡Ir a ver más productos!'
    }).then((result) => {
        // Verifica si el usuario hizo clic en "OK"
        if (result.isConfirmed) {
            // Vaciar carrito
            productosEnCarrito.length = 0;
            localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));

            // Ocultar secciones del carrito
            contenedorCarritoVacio.classList.add("disabled");
            contenedorCarritoProductos.classList.add("disabled");
            contenedorCarritoAcciones.classList.add("disabled");
            tablaCarrito.classList.add("disabled");

            window.location.href = '../pages/productos.html'; 
        }
    });
}
