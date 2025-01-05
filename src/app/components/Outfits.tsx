import { useState } from 'react';
import FilterModal from './FilterModal';
import OutfitCard from './OutfitCard';

const Outfits = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState<{ search: string; category: string }>({
    search: '',
    category: '',
  });
  const [filteredClothes, setFilteredClothes] = useState<any[]>([]);
  const [outfitItems, setOutfitItems] = useState<any[]>([]); // Items in the outfit builder
  const [outfitName, setOutfitName] = useState('');
  const [outfitDescription, setOutfitDescription] = useState('');
  const [notification, setNotification] = useState<boolean>(false); // Notification visibility

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const applyFilters = async (search: string, category: string) => {
    try {
      const response = await fetch(
        `http://localhost:3001/closet/search?search=${encodeURIComponent(search)}&category=${encodeURIComponent(category)}`
      );
      if (!response.ok) throw new Error(`Error fetching clothes: ${response.statusText}`);
      const data = await response.json();
      setFilteredClothes(data);
    } catch (error) {
      console.error('Error fetching clothes:', error);
    }
  };

  const addToOutfit = (item: any) => {
    if (!outfitItems.some((outfitItem) => outfitItem.id === item.id)) {
      setOutfitItems([...outfitItems, item]);
    }
  };

  const removeFromOutfit = (id: number) => {
    setOutfitItems(outfitItems.filter((item) => item.id !== id));
  };

  const saveOutfit = async () => {
    try {
      const response = await fetch('http://localhost:3001/closet/outfits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: outfitName,
          description: outfitDescription,
          items: outfitItems.map((item) => item.id),
        }),
      });
      if (!response.ok) throw new Error(`Error saving outfit: ${response.statusText}`);
      setNotification(true); // Show success notification
      setOutfitName('');
      setOutfitDescription('');
      setOutfitItems([]);
    } catch (error) {
      console.error('Error saving outfit:', error);
      alert('Failed to save the outfit.');
    }
  };

  const closeNotification = () => setNotification(false); // Close notification

  return (
    <div className="flex flex-row w-full h-full gap-4">
      {/* Left: Search Results */}
      <div className="w-1/2">
        <div className="flex justify-between mb-4">
          <button
            onClick={toggleModal}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Filters
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredClothes.map((item) => (
            <OutfitCard
              key={item.id}
              item={item}
              onClick={() => addToOutfit(item)} // Add to outfit when clicked
            />
          ))}
        </div>
      </div>

      {/* Right: Outfit Builder */}
      <div className="w-1/2 bg-gray-100 p-4 rounded-md shadow-md">
        <h3 className="text-xl font-bold mb-4">Outfit Builder</h3>
        <div className="grid grid-cols-1 gap-2 mb-4">
          {outfitItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 bg-white p-2 rounded-md shadow-md"
            >
              <img
                src={item.image}
                alt={item.type}
                className="w-12 h-12 object-cover rounded-md"
              />
              <div className="flex-1">
                <p className="font-bold">{item.type}</p>
                <p className="text-sm text-gray-500">{item.style}</p>
              </div>
              <button
                onClick={() => removeFromOutfit(item.id)}
                className="text-red-500 font-bold"
              >
                x
              </button>
            </div>
          ))}
        </div>
        <input
          type="text"
          value={outfitName}
          onChange={(e) => setOutfitName(e.target.value)}
          placeholder="Outfit Name"
          className="w-full mb-2 px-3 py-2 border rounded-md"
        />
        <textarea
          value={outfitDescription}
          onChange={(e) => setOutfitDescription(e.target.value)}
          placeholder="Description"
          className="w-full mb-2 px-3 py-2 border rounded-md"
        ></textarea>
        <button
          onClick={saveOutfit}
          className="bg-green-500 text-white px-4 py-2 rounded-md w-full"
        >
          Save Outfit
        </button>
      </div>

      {isModalOpen && (
        <FilterModal
          onClose={toggleModal}
          onApplyFilters={applyFilters}
        />
      )}

      {/* Notification Box */}
      {notification && (
        <div className="fixed top-20 right-5 bg-green-500 text-white px-6 py-3 rounded-md shadow-lg z-50">
          <p>Outfit saved successfully!</p>
          <button
            onClick={closeNotification}
            className="text-white font-bold hover:underline mt-2"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default Outfits;