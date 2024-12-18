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
        let cantidad = 1; // Inicializamos la cantidad en 1

        const div = document.createElement("div");
        div.classList.add("producto");
        div.innerHTML = `
            <img class="producto-imagen" src="${producto.imagen}" alt="${producto.titulo}" 
                data-bs-toggle="offcanvas" 
                data-bs-target="#offcanvasRight-${producto.id}" 
                aria-controls="offcanvasRight-${producto.id}">
            <div class="producto-detalles">
                <h3 class="producto-titulo">${producto.titulo}</h3>
                
                <div class="cantidad-control">
                <p class="producto-precio">$${producto.precio}</p>
                    <button class="btn-decrementar" id="decrementar-${producto.id}">-</button>
                    <span id="cantidad-${producto.id}">${cantidad}</span>
                    <button class="btn-incrementar" id="incrementar-${producto.id}">+</button>
                </div>
                <button class="producto-agregar" id="${producto.id}" data-cantidad="${cantidad}">Agregar</button>
            </div>
            
            <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasRight-${producto.id}" aria-labelledby="offcanvasRightLabel-${producto.id}">
                <div class="offcanvas-header">
                    <h5 id="offcanvasRightLabel-${producto.id}" class="offcanvas-titulo">${producto.titulo}</h5>
                    <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div class="offcanvas-body">
                    <div class="producto-detalles d-flex align-items-center">
                        <img class="producto-imagen-off" src="${producto.imagen}" alt="${producto.titulo}">
                        <p class="offcanvas-descripcion">${producto.descripcion}</p>
                        <p class="producto-precio">$${producto.precio}</p>                            
                        <button class="producto-agregar" id="${producto.id}" data-cantidad="${cantidad}">Agregar</button>
                    </div>
                </div>
            </div>
        `;

        contenedorProductos.append(div);

        // Eventos para los botones "+" y "-"
        const btnIncrementar = div.querySelector(`#incrementar-${producto.id}`);
        const btnDecrementar = div.querySelector(`#decrementar-${producto.id}`);
        const cantidadSpan = div.querySelector(`#cantidad-${producto.id}`);
        const btnAgregar = div.querySelector(`.producto-agregar`);

        btnIncrementar.addEventListener("click", () => {
            cantidad++;
            cantidadSpan.textContent = cantidad;
            btnAgregar.dataset.cantidad = cantidad; 
        });

        btnDecrementar.addEventListener("click", () => {
            if (cantidad > 1) cantidad--;
            cantidadSpan.textContent = cantidad;
            btnAgregar.dataset.cantidad = cantidad; 
        });
    });

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
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        style: {
            background: "#BF9D3D",
            borderRadius: "2rem",
            textTransform: "uppercase",
            fontSize: ".75rem"
        },
        offset: {
            x: '1.5rem',
            y: '4rem'
        },
    }).showToast();

    const idBoton = e.currentTarget.id;
    const cantidadSeleccionada = parseInt(e.currentTarget.dataset.cantidad); 
    const productoAgregado = productos.find(producto => producto.id === idBoton);

    if (productosEnCarrito.some(producto => producto.id === idBoton)) {
        const index = productosEnCarrito.findIndex(producto => producto.id === idBoton);
        productosEnCarrito[index].cantidad += cantidadSeleccionada; 
    } else {
        productoAgregado.cantidad = cantidadSeleccionada;
        productosEnCarrito.push(productoAgregado);
    }

    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
}