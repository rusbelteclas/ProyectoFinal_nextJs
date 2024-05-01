// En create/actions.js

// Función de ejemplo para obtener un producto por ID
export const getProductById = async (productId) => {
    try {
      const product = { id: productId, };
      return { product, error: null };
    } catch (error) {
      return { product: null, error: { message: "Error al obtener el producto" } };
    }
  };
  