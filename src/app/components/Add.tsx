import React, { useState } from "react";
import { motion } from "framer-motion";

const Add = () => {
  const [type, setType] = useState("");
  const [color, setColor] = useState("");
  const [style, setStyle] = useState("");
  const [occasion, setOccasion] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!type || !color || !style || !occasion || !image) {
      setError("Please fill in all fields and upload an image.");
      return;
    }

    const formData = new FormData();
    formData.append("type", type);
    formData.append("color", color);
    formData.append("style", style);
    formData.append("occasion", occasion);
    formData.append("image", image); // Appending the image file

    try {
      const res = await fetch("http://localhost:3001/closet/add", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`Failed to add item: ${res.statusText}`);
      }

      const result = await res.json();
      if (result.message === "Item added successfully") {
        setNotification(true); // Show the notification
        setType("");
        setColor("");
        setStyle("");
        setOccasion("");
        setImage(null);
        setError(null);

        // Hide the notification after a few seconds
        setTimeout(() => setNotification(false), 3000);
      } else {
        setError(result.message || "An error occurred");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  return (
    <div>
      <h1 className="text-[35px] text-center underline decoration-2">
        Add New Item to Closet
      </h1>
      {error && <p className="text-red-700 text-20px text-center">{error}</p>}

      {notification && (
        <motion.div
          className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-md z-50"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
        >
          Item added successfully!
          <button
            className="ml-4 text-sm underline"
            onClick={() => setNotification(false)}
          >
            Close
          </button>
        </motion.div>
      )}

      <form
        onSubmit={handleSubmit}
        className="flex flex-col h-[40vh] mt-[5vh] w-full items-center text-[25px]"
      >
        <div className="flex flex-col justify-between h-[30vh] ml-[10vw]">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
            <label htmlFor="type">Type:</label>
            <input
              type="text"
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
              className="bg-gray-100 rounded-md text-[15px] w-[15vw] min-w-[30vw] max-w-[35vw]"
            />
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
            <label htmlFor="color">Color:</label>
            <input
              type="text"
              id="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              required
              className="bg-gray-100 rounded-md text-[15px] w-[15vw] min-w-[30vw] max-w-[35vw]"
            />
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
            <label htmlFor="style">Style:</label>
            <input
              type="text"
              id="style"
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              required
              className="bg-gray-100 rounded-md text-[15px] w-[15vw] min-w-[30vw] max-w-[35vw]"
            />
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
            <label htmlFor="occasion">Occasion:</label>
            <input
              type="text"
              id="occasion"
              value={occasion}
              onChange={(e) => setOccasion(e.target.value)}
              required
              className="bg-gray-100 rounded-md text-[15px] w-[15vw] min-w-[30vw] max-w-[35vw]"
            />
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
            <label htmlFor="image">Image:</label>
            <input
              type="file"
              id="image"
              onChange={handleImageChange}
              accept="image/*"
              required
              className="text-[15px] ml-3 min-w-[30vw] max-w-[35vw]"
            />
          </motion.div>
        </div>

        <motion.button
          type="submit"
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 1 }}
        >
          Add Item
        </motion.button>
      </form>
    </div>
  );
};

export default Add;