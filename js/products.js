let productos = [];

fetch("/js/productos.json")
    .then(response => response.json())
    .then(data => {
        productos = data;
        cargarProductos(productos);
})


const contenedorProductos = document.querySelector("#contenedor-productos");
const botonesCategorias = document.querySelectorAll(".boton-categoria");

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
                <button class="producto-agregar" id="agregar-${producto.id}">Agregar</button>
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
                        <div class="d-flex justify-content-between align-items-baseline w-100">
                            <p class="offcanvas-precio"><strong>Precio:</strong> $${producto.precio}</p>
                            <button class="producto-agregar" id="offcanvas-agregar-${producto.id}">Agregar</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        contenedorProductos.append(div);
    })
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
