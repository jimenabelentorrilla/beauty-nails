let productos = [];

fetch("/js/productos.json")
    .then(response => response.json())
    .then(data => {
        productos = data;
        cargarProductos(productos);
})


const contenedorProductos = document.querySelector("#contenedor-productos");
const botonesCategorias = document.querySelectorAll(".boton-categoria");
let botonesAgregar = document.querySelectorAll(".producto-agregar");

function cargarProductos(productosElegidos) {

    contenedorProductos.innerHTML = "";

    productosElegidos.forEach(producto => {

        const div = document.createElement("div");
        div.classList.add("producto");
        div.innerHTML = `
            <img class="producto-imagen" src="${producto.imagen}" alt="${producto.titulo}" 
                data-bs-toggle="offcanvas" 
                data-bs-target="#offcanvasRight-${producto.id}" 
                aria-controls="offcanvasRight-${producto.id}">
            <div class="producto-detalles">
                <h3 class="producto-titulo">${producto.titulo}</h3>
                <p class="producto-precio">$${producto.precio}</p>
                <button class="producto-agregar" id="${producto.id}">agregar</button>
            </div>
            <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasRight-${producto.id}" aria-labelledby="offcanvasRightLabel-${producto.id}">
                <div class="offcanvas-header-modal">
                    <h5 id="offcanvasRightLabel-${producto.id}" class="offcanvas-titulo">${producto.titulo}</h5>
                </div>
                <div class="offcanvas-body">
                    <div class="producto-detalles d-flex align-items-center">
                        <img class="producto-imagen-off" src="${producto.imagen}" alt="${producto.titulo}">
                        <p class="offcanvas-descripcion">${producto.descripcion}</p>
                        <div class="d-flex justify-content-between align-items-baseline w-100">
                            <p class="offcanvas-precio"><strong>Precio:</strong> $${producto.precio}</p>
                            <button class="producto-agregar" id="${producto.id}">agregar</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        contenedorProductos.append(div);
    })
    actualizarBotonesAgregar();
}

botonesCategorias.forEach(boton => {
    boton.addEventListener("click", (e) => {

        botonesCategorias.forEach(boton => boton.classList.remove("active"));
        e.currentTarget.classList.add("active");

        if (e.currentTarget.id != "todos") {
            const productosBoton = productos.filter(producto => producto.categoria.id === e.currentTarget.id);
            cargarProductos(productosBoton);
        } else {
            cargarProductos(productos);
        }
    })
});

function actualizarBotonesAgregar() {
    botonesAgregar = document.querySelectorAll(".producto-agregar");

    botonesAgregar.forEach(boton => {
        boton.addEventListener("click", agregarAlCarrito);
    });
}

let productosEnCarrito;

let productosEnCarritoLS = localStorage.getItem("productos-en-carrito");

if (productosEnCarritoLS) {
    productosEnCarrito = JSON.parse(productosEnCarritoLS);
} else {
    productosEnCarrito = [];
}

function agregarAlCarrito(e) {
    Toastify({
        text: "Producto agregado",
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
            x: '1.5rem', // horizontal axis - can be a number or a string indicating unity. eg: '2em'
            y: '4rem' // vertical axis - can be a number or a string indicating unity. eg: '2em'
        },
    }).showToast();

    const idBoton = e.currentTarget.id;
    const productoAgregado = productos.find(producto => producto.id === idBoton);
    
    if(productosEnCarrito.some(producto => producto.id === idBoton)) {
        const index = productosEnCarrito.findIndex(producto => producto.id === idBoton);
        productosEnCarrito[index].cantidad++;
    } else {
        productoAgregado.cantidad = 1;
        productosEnCarrito.push(productoAgregado);
    }

    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
}