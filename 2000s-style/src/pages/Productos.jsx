import React, { useState, useEffect } from "react";

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [filtroCategoria, setFiltroCategoria] = useState("all");
  const [carrito, setCarrito] = useState(() => {
    // Inicializar el carrito desde localStorage
    return JSON.parse(localStorage.getItem("carrito")) || [];
  });
  const [modalDescripcion, setModalDescripcion] = useState("");

  // Cargar productos desde la API
  useEffect(() => {
    fetch("https://dummyjson.com/products")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al cargar el JSON");
        }
        return response.json();
      })
      .then((data) => {
        const productosFiltrados = data.products.filter(
          (producto) => producto.category !== "groceries"
        );
        setProductos(productosFiltrados);

        // Obtener categorías únicas
        const categoriasUnicas = [
          ...new Set(productosFiltrados.map((producto) => producto.category)),
        ];
        setCategorias(categoriasUnicas);
      })
      .catch((error) => console.error("Error al cargar los datos:", error));
  }, []);

  // Guardar el carrito en localStorage
  useEffect(() => {
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }, [carrito]);

  // Actualizar la cantidad de un producto en el carrito
  const actualizarCantidadCarrito = (id, cantidad) => {
    setCarrito((prevCarrito) =>
      prevCarrito.map((producto) =>
        producto.id === id ? { ...producto, quantity: cantidad } : producto
      )
    );
  };

  // Eliminar un producto del carrito
  const eliminarDelCarrito = (id) => {
    setCarrito((prevCarrito) => prevCarrito.filter((producto) => producto.id !== id));
  };

  // Vaciar el carrito
  const vaciarCarrito = () => {
    setCarrito([]);
  };

  // Añadir un producto al carrito
  const agregarAlCarrito = (producto, cantidad) => {
    if (cantidad > 0) {
      setCarrito((prevCarrito) => {
        const productoEnCarrito = prevCarrito.find((item) => item.id === producto.id);
        if (productoEnCarrito) {
          return prevCarrito.map((item) =>
            item.id === producto.id ? { ...item, quantity: cantidad } : item
          );
        } else {
          return [...prevCarrito, { ...producto, quantity: cantidad }];
        }
      });
      alert(`Añadido al carrito: ${producto.title} (x${cantidad})`);
    } else {
      alert("Por favor, ingresa una cantidad válida.");
    }
  };

  // Filtrar productos por categoría
  const productosFiltrados =
    filtroCategoria === "all"
      ? productos
      : productos.filter((producto) => producto.category === filtroCategoria);

  return (
    <div className="container mt-4">
      {/* Filtro de categorías */}
      <div className="mb-4">
        <label htmlFor="categoriaFiltro" className="form-label">
          Seleccione la categoría o Todas:
        </label>
        <select
          id="categoriaFiltro"
          className="form-select"
          value={filtroCategoria}
          onChange={(e) => setFiltroCategoria(e.target.value)}
        >
          <option value="all">Todas</option>
          {categorias.map((categoria) => (
            <option key={categoria} value={categoria}>
              {categoria}
            </option>
          ))}
        </select>
      </div>

      {/* Lista de productos */}
      <div className="row">
        {productosFiltrados.map((producto) => (
          <div key={producto.id} className="col-sm-12 col-md-6 col-lg-4 mb-4">
            <div className="card h-100">
              <img
                src={producto.thumbnail}
                className="card-img-top"
                alt={producto.title}
                style={{ cursor: "pointer" }}
                onClick={() => setModalDescripcion(producto.description)}
                data-bs-toggle="modal"
                data-bs-target="#descripcionModal"
              />
              <div className="card-body">
                <p>{producto.title}</p>
                <p className="card-text">
                  <strong>Precio:</strong> ${producto.price.toFixed(2)}
                </p>
                <div className="d-flex align-items-center">
                  <label htmlFor={`cantidadProducto${producto.id}`} className="me-2">
                    Cantidad:
                  </label>
                  <input
                    type="number"
                    id={`cantidadProducto${producto.id}`}
                    className="form-control me-2"
                    style={{ width: "120px" }}
                    min="1"
                    defaultValue="1"
                  />
                  <button
                    className="btn btn-sm btn-primary flex-shrink-0"
                    style={{ width: "100px" }}
                    onClick={() =>
                      agregarAlCarrito(
                        producto,
                        parseInt(
                          document.getElementById(`cantidadProducto${producto.id}`).value,
                          10
                        )
                      )
                    }
                  >
                    Comprar
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de descripción ampliada */}
      <div
        className="modal fade"
        id="descripcionModal"
        tabIndex="-1"
        aria-labelledby="descripcionModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="descripcionModalLabel">
                Descripción Ampliada
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Cerrar"
              ></button>
            </div>
            <div className="modal-body">
              <p>{modalDescripcion}</p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal del carrito */}
      <div
        className="modal fade"
        id="carritoModal"
        tabIndex="-1"
        aria-labelledby="carritoModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="carritoModalLabel">
                Carrito de Compras
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Cerrar"
              ></button>
            </div>
            <div className="modal-body">
              {carrito.length > 0 ? (
                <table className="table">
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Cantidad</th>
                      <th>Precio</th>
                      <th>Subtotal</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {carrito.map((producto) => (
                      <tr key={producto.id}>
                        <td>{producto.title}</td>
                        <td>
                          <input
                            type="number"
                            min="1"
                            value={producto.quantity}
                            className="form-control"
                            onChange={(e) =>
                              actualizarCantidadCarrito(
                                producto.id,
                                parseInt(e.target.value, 10)
                              )
                            }
                          />
                        </td>
                        <td>${producto.price.toFixed(2)}</td>
                        <td>${(producto.price * producto.quantity).toFixed(2)}</td>
                        <td>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => eliminarDelCarrito(producto.id)}
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-center">El carrito está vacío.</p>
              )}
            </div>
            <div className="modal-footer">
              {carrito.length > 0 && (
                <div className="me-auto">
                  <h5>
                    Total: $
                    {carrito
                      .reduce(
                        (total, producto) =>
                          total + producto.price * producto.quantity,
                        0
                      )
                      .toFixed(2)}
                  </h5>
                </div>
              )}
              <button
                type="button"
                className="btn btn-warning"
                onClick={vaciarCarrito}
              >
          Vaciar Carrito
        </button>
      </div>
      <div className="modal-footer">
        <button
          type="button"
          className="btn btn-secondary"
          data-bs-dismiss="modal"
        >
          Cerrar
        </button>
      </div>
    </div>
  </div>
</div>

</div>
);
};

export default Productos;

