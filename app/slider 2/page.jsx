import Slider from '../../components/Slider'; // Corrige la ruta de importación

export default function SliderPage() {
    const products = [
        { id: 1, name: "Producto 1" },
        { id: 2, name: "Producto 2" },
        { id: 3, name: "Producto 3" },
        { id: 4, name: "Producto 4" },
        { id: 5, name: "Producto 5" },
        { id: 6, name: "Producto 6" },
        { id: 7, name: "Producto 7" },
        { id: 8, name: "Producto 8" },
    ];

    // Función que genera una tarjeta de producto
    const productCard = (product) => (
        <div 
            key={product.id} 
            className="w-[150px] h-[200px] bg-slate-200 p-2 
            border border 1 rounded rounded-lg"
        >
            <p>{product.name}</p>
        </div>
    );

    return (
        <div className="p-2 w-full">
            <h1 className="text-xl font-bold mb-8">Slider de las notas</h1>
            {/* Aquí deberías pasar los props adecuados al componente Slider */}
            <Slider
                height={200} // Establece la altura de las tarjetas
                cardWidth={150} // Establece el ancho de las tarjetas
                items={products.map(productCard)} // Pasa las tarjetas de productos como elementos
            />
        </div>
    );
}
