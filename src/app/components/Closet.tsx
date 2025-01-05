import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ClosetItem {
  id: number;
  type: string;
  color: string;
  style: string;
  occasion: string;
  imageUrl: string | null;
}

interface Outfit {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  items: ClosetItem[];
}

const Closet: React.FC = () => {
  const [closetItems, setClosetItems] = useState<ClosetItem[]>([]);
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [showOutfits, setShowOutfits] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedOutfit, setSelectedOutfit] = useState<Outfit | null>(null); // For fullscreen modal

  const visibleCount = 3;
  const totalItems = showOutfits ? outfits.length : closetItems.length;

  const fetchData = async () => {
    setLoading(true);
    try {
      const endpoint = showOutfits ? "outfits" : "";
      const res = await fetch(`http://localhost:3001/closet/${endpoint}`);
      if (!res.ok) {
        throw new Error(`Failed to fetch: ${res.statusText}`);
      }
      const data = await res.json();
      showOutfits ? setOutfits(data) : setClosetItems(data);
    } catch (err) {
      console.error(err instanceof Error ? err.message : "Fetch error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [showOutfits]);

  const moveLeft = () => {
    setCurrentIndex((prev) => (prev - 1 + totalItems) % totalItems);
  };

  const moveRight = () => {
    setCurrentIndex((prev) => (prev + 1) % totalItems);
  };

  const getPosition = (index: number) => {
    const position = (index - currentIndex + totalItems) % totalItems;
    if (position === 0) return { scale: 1.2, zIndex: 10, opacity: 1 }; // Middle card
    if (position === 1 || position === totalItems - 1)
      return { scale: 0.9, zIndex: 5, opacity: 0.8 }; // Side cards
    return { scale: 0.7, zIndex: 1, opacity: 0 }; // Hidden cards
  };

  const deleteItem = async (id: number) => {
    try {
      const endpoint = showOutfits
        ? `http://localhost:3001/closet/outfits/${id}`
        : `http://localhost:3001/closet/delete/${id}`;
      const res = await fetch(endpoint, { method: "DELETE" });

      if (!res.ok) {
        throw new Error(`Failed to delete: ${res.statusText}`);
      }

      if (showOutfits) {
        setOutfits((prev) => prev.filter((outfit) => outfit.id !== id));
      } else {
        setClosetItems((prev) => prev.filter((item) => item.id !== id));
      }
    } catch (err) {
      console.error(err instanceof Error ? err.message : "Delete error");
    }
  };

  if (loading) {
    return <div className="loader ml-[25vw] mt-[10vh]"></div>;
  }

  const items = showOutfits ? outfits : closetItems;

  return (
    <div className="relative w-full h-full flex flex-col items-center">
      <h1 className="text-[35px] text-center font-bold">
        {showOutfits ? "Outfits" : "Closet Items"}
      </h1>
      <div className="flex justify-center my-4">
        <button
          onClick={() => setShowOutfits(!showOutfits)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 transition"
        >
          {showOutfits ? "Show Closet" : "Show Outfits"}
        </button>
      </div>

      <div className="relative w-full max-w-[90%] h-[500px] flex items-center justify-center overflow-hidden">
        {totalItems > 1 && (
          <button
            onClick={moveLeft}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-300 p-3 rounded-full shadow-md hover:bg-gray-400 transition"
          >
            {"<"}
          </button>
        )}

        <div className="relative flex items-center justify-center w-full h-full">
          <AnimatePresence>
            {items.map((item, index) => {
              const { scale, zIndex, opacity } = getPosition(index);

              return (
                <motion.div
                  key={`${item.id}-${index}`}
                  className="absolute w-[300px] h-[400px] p-6 bg-white rounded-lg shadow-md transition-all duration-500 cursor-pointer"
                  style={{
                    transform: `scale(${scale})`,
                    zIndex,
                    opacity,
                  }}
                  onClick={() =>
                    "items" in item ? setSelectedOutfit(item) : null
                  } // Open modal for outfits
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent modal opening
                      deleteItem(item.id);
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-600 transition z-10 shadow-md"
                    aria-label="Delete Item"
                  >
                    &times;
                  </button>
                  {"items" in item ? (
                    <>
                      <h2 className="text-lg font-bold text-center">
                        {item.name}
                      </h2>
                      <p className="text-sm text-center">
                        {item.description}
                      </p>
                      <div className="flex flex-wrap justify-center gap-2 mt-4">
                        {item.items.map((clothing) => (
                          <img
                            key={clothing.id}
                            src={clothing.imageUrl || "/placeholder.png"}
                            alt={`${clothing.type} image`}
                            className="w-[80px] h-[80px] object-cover rounded-md"
                          />
                        ))}
                      </div>
                    </>
                  ) : (
                    <>
                      <img
                        src={item.imageUrl || "/placeholder.png"}
                        alt={item.type}
                        className="w-full h-[200px] object-cover rounded-md mt-8"
                      />
                      <h2 className="text-lg font-bold text-center">
                        {item.type.toUpperCase()}
                      </h2>
                      <p className="text-center">Color: {item.color}</p>
                      <p className="text-center">Style: {item.style}</p>
                      <p className="text-center">Occasion: {item.occasion}</p>
                    </>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {totalItems > 1 && (
          <button
            onClick={moveRight}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-300 p-3 rounded-full shadow-md hover:bg-gray-400 transition"
          >
            {">"}
          </button>
        )}
      </div>

      {/* Fullscreen Modal */}
      {selectedOutfit && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="relative bg-white w-[90%] max-w-[600px] h-[80%] p-6 rounded-lg overflow-auto shadow-lg">
            <button
              onClick={() => setSelectedOutfit(null)}
              className="absolute top-2 right-2 bg-red-500 text-white w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-600 transition z-10 shadow-md"
              aria-label="Close Modal"
            >
              &times;
            </button>
            <h2 className="text-lg font-bold text-center mb-4">
              {selectedOutfit.name}
            </h2>
            <p className="text-center mb-4">{selectedOutfit.description}</p>
            <div className="flex flex-col items-center gap-4">
              {selectedOutfit.items.map((clothing) => (
                <img
                  key={clothing.id}
                  src={clothing.imageUrl || "/placeholder.png"}
                  alt={`${clothing.type} image`}
                  className="w-[80%] h-auto object-cover rounded-md"
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Closet;