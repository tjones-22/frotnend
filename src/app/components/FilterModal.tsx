import { motion } from "framer-motion";
import { useState, useEffect } from "react";

type FilterModalProps = {
  onClose: () => void; // Function to close the modal
  onApplyFilters: (search: string, category: string) => void; // Function to apply filters
};

const FilterModal: React.FC<FilterModalProps> = ({
  onClose,
  onApplyFilters,
}) => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [options, setOptions] = useState<string[]>([]); // Available search options

  // Fetch options based on the selected category
  useEffect(() => {
    const fetchOptions = async () => {
      if (!category) {
        setOptions([]); // Clear options if no category is selected
        return;
      }

      try {
        const res = await fetch(
          `http://localhost:3001/closet/options?category=${category}`
        ); // Replace with your API endpoint
        if (!res.ok) {
          throw new Error("Failed to fetch options");
        }
        const data = await res.json();
        setOptions(data);
      } catch (err) {
        console.error("Error fetching options:", err);
      }
    };

    fetchOptions();
  }, [category]);

  const handleApply = () => {
    onApplyFilters(search, category); // Call onApplyFilters with current input values
    onClose(); // Close the modal
  };

  return (
    <>
      {/* Modal Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="fixed inset-0 z-50 flex items-center justify-center"
      >
        <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
          <h2 className="text-xl font-semibold mb-4">Filter Closet Items</h2>

          {/* Category Dropdown */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border border-gray-300 rounded-md w-full px-3 py-2 mb-4"
          >
            <option value="">Select Category</option>
            <option value="type">Type</option>
            <option value="color">Color</option>
            <option value="style">Style</option>
            <option value="occasion">Occasion</option>
          </select>

          {/* Search Dropdown */}
          {category && (
            <select
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-300 rounded-md w-full px-3 py-2 mb-4"
            >
              <option value="">Select {category}</option>
              {options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          )}

          {/* Apply Filters Button */}
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md w-full"
            onClick={handleApply}
          >
            Apply Filters
          </button>

          {/* Close Modal Button */}
          <button
            className="text-gray-500 mt-4 w-full text-center underline"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </motion.div>
    </>
  );
};

export default FilterModal;