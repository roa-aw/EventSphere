import { useState } from "react";
import API from "../services/api";

export default function CreateRoomForm({ onSuccess }) {
  const [name, setName] = useState("");
  const [capacity, setCapacity] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateRoom = async () => {
    if (!name.trim() || !capacity) {
      alert("Please fill all required fields");
      return;
    }

    const cap = Number(capacity);
    if (cap <= 0 || isNaN(cap)) {
      alert("Capacity must be greater than 0");
      return;
    }

    if (latitude === "" || longitude === "") {
      alert("Please enter latitude and longitude");
      return;
    }

    const lat = Number(latitude);
    const lng = Number(longitude);

    if (isNaN(lat) || isNaN(lng)) {
      alert("Invalid coordinates");
      return;
    }

    try {
      setLoading(true);

      await API.post("/rooms", {
        name: name.trim(),
        capacity: cap,
        imageUrl,
        latitude: lat,
        longitude: lng,
      });

      // reset form
      setName("");
      setCapacity("");
      setImageUrl("");
      setLatitude("");
      setLongitude("");

      if (onSuccess) onSuccess("Room created successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to create room");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow p-6 max-w-2xl">
      <h2 className="text-xl font-semibold mb-4">Create Room</h2>

      <div className="space-y-4">

        <input
          type="text"
          placeholder="Room name"
          className="w-full border rounded-lg p-3"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="number"
          placeholder="Capacity (number of seats)"
          className="w-full border rounded-lg p-3"
          value={capacity}
          onChange={(e) => setCapacity(e.target.value)}
        />

        <input
          type="text"
          placeholder="Image URL (optional)"
          className="w-full border rounded-lg p-3"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />

        {imageUrl && (
          <img
            src={imageUrl}
            alt="preview"
            className="w-full h-40 object-cover rounded-lg"
          />
        )}

        <input
          type="number"
          placeholder="Latitude"
          className="w-full border rounded-lg p-3"
          value={latitude}
          onChange={(e) => setLatitude(e.target.value)}
        />

        <input
          type="number"
          placeholder="Longitude"
          className="w-full border rounded-lg p-3"
          value={longitude}
          onChange={(e) => setLongitude(e.target.value)}
        />

        <button
          onClick={handleCreateRoom}
          disabled={loading || !name || !capacity}
          className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-3 rounded-lg hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Room"}
        </button>

      </div>
    </div>
  );
}