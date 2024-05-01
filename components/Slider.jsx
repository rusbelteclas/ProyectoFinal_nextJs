export default function Slider({
    items,
    height,
    cardWidth
}) {
    const itemCard = (item, index) => (
        <div 
            key={index} 
            className="absolute"
            style={{
                width: `${cardWidth}px`,
                height: `${height}px`, 
                left: `${index * cardWidth}px`,
                // Agregar estilos adicionales según sea necesario
                border: "1px solid #ccc",
                borderRadius: "8px",
            }}
        >
            {item}
        </div>
    );

    return (
        <div className="overflow-x-auto relative w-full" style={{ height: `${height}px` }}>
            {items?.map((item, index) => itemCard(item, index))}
        </div>
    );
}
