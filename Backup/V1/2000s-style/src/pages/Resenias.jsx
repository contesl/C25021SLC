import React, { useState, useEffect } from 'react';

const Resenias = () => {
  const [resenias, setResenias] = useState([]); // Estado para almacenar las reseñas
  const [filtro, setFiltro] = useState(''); // Estado para manejar el filtro
  const [loading, setLoading] = useState(true); // Estado para manejar el cargando

  // Función para cargar las reseñas desde la API
  useEffect(() => {
    const fetchResenias = async () => {
      try {
        const response = await fetch('https://dummyjson.com/comments');
        if (!response.ok) {
          throw new Error('Error al cargar las reseñas');
        }
        const data = await response.json();
        setResenias(data.comments); // Guardar las reseñas en el estado
        setLoading(false);
      } catch (error) {
        console.error('Error al cargar los datos:', error);
        setLoading(false);
      }
    };

    fetchResenias();
  }, []);

  // Filtrar las reseñas según el texto ingresado en el filtro
  const reseniasFiltradas = resenias.filter((resenia) =>
    resenia.body.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div>
      <h1>Reseñas</h1>
      <input
        type="text"
        placeholder="Filtrar por palabra clave..."
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        style={{
          padding: '10px',
          marginBottom: '20px',
          width: '100%',
          maxWidth: '400px',
          borderRadius: '5px',
          border: '1px solid #ddd',
        }}
      />
      {loading ? (
        <p>Cargando reseñas...</p>
      ) : (
        <div className="resenias-lista">
          {reseniasFiltradas.length > 0 ? (
            reseniasFiltradas.map((resenia) => (
              <div key={resenia.id} className="resenia-card">
                <h3>{resenia.user.username}</h3>
                <p>{resenia.body}</p>
              </div>
            ))
          ) : (
            <p>No se encontraron reseñas que coincidan con el filtro.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Resenias;