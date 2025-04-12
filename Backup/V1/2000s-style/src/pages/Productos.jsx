import React, { useState, useEffect } from 'react';

const Productos = () => {
  const [productos, setProductos] = useState([]); // Estado para almacenar los productos
  const [loading, setLoading] = useState(true); // Estado para manejar el cargando

  // Función para cargar los productos desde la API
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await fetch('https://dummyjson.com/products');
        if (!response.ok) {
          throw new Error('Error al cargar los productos');
        }
        const data = await response.json();
        const productosValidos = data.products.filter(
          (producto) => producto.category !== 'groceries' // Excluir productos de la categoría "groceries"
        );
        setProductos(productosValidos);
        setLoading(false);
      } catch (error) {
        console.error('Error al cargar los datos:', error);
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  // Renderizar los productos
  return (
    <div>
      <h1>Productos</h1>
      {loading ? (
        <p>Cargando productos...</p>
      ) : (
        <div className="productos-grid">
          {productos.map((producto) => (
            <div key={producto.id} className="producto-card">
              <img
                src={producto.thumbnail}
                alt={producto.title}
                className="producto-imagen"
              />
              <h3>{producto.title}</h3>
              <p>{producto.description}</p>
              <p>Precio: ${producto.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Productos;


