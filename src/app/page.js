"use client";
import { useState, useEffect } from "react";

export default function Page() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    image_url: "",
  });

  // Cargar productos al montar el componente
  useEffect(() => {
    fetchProducts();
  }, []);

  // Obtener productos
  const fetchProducts = async () => {
    try {
      const response = await fetch("/api");
      const data = await response.json();
      setProducts(data.products);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Enviar nuevo producto
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProduct),
      });

      if (response.ok) {
        // Limpiar formulario
        setNewProduct({
          name: "",
          description: "",
          image_url: "",
        });
        // Recargar productos
        fetchProducts();
      }
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Gestión de Productos</h1>

      {/* Formulario de nuevo producto */}
      <div className="mb-8 p-4 bg-gray-600 rounded">
        <h2 className="text-xl font-semibold mb-4">Crear Nuevo Producto</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">Nombre:</label>
            <input
              type="text"
              name="name"
              value={newProduct.name}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Descripción:</label>
            <textarea
              name="description"
              value={newProduct.description}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1">URL de la imagen:</label>
            <input
              type="text"
              name="image_url"
              value={newProduct.image_url}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Crear Producto
          </button>
        </form>
      </div>

      {/* Lista de productos */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Productos Existentes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <div key={product.id} className="border rounded p-4 shadow-sm">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-48 object-cover mb-2 rounded"
              />
              <h3 className="font-semibold">{product.name}</h3>
              <p className="text-gray-600">{product.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
