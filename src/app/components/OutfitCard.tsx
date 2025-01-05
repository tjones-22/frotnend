import React from 'react';

type OutfitCardProps = {
  item: {
    id: number;
    type: string;
    color: string;
    style: string;
    occasion: string;
    image: string; // Base64 image
  };
  onClick?: () => void; // Optional onClick handler
};

const OutfitCard: React.FC<OutfitCardProps> = ({ item, onClick }) => {
  return (
    <div
      className="bg-white p-4 rounded-lg shadow-md cursor-pointer"
      onClick={onClick} // Trigger onClick when card is clicked
    >
      {/* Image */}
      <div className="w-full h-[150px] mb-4 overflow-hidden rounded-lg">
        <img
          src={item.image}
          alt={item.type}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Details */}
      <h3 className="text-lg font-semibold">{item.type}</h3>
      <p className="text-sm text-gray-500">Color: {item.color}</p>
      <p className="text-sm text-gray-500">Style: {item.style}</p>
      <p className="text-sm text-gray-500">Occasion: {item.occasion}</p>
    </div>
  );
};

export default OutfitCard;