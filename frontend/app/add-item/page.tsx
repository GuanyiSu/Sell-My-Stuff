"use client";

import { useState } from "react";

export default function AddItemPage() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [contact, setContact] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  console.log('haha')
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!imageFile) {
      alert("Please select an image file");
      return;
    }

    try {
      // 1. Build a FormData object with all fields
      const formData = new FormData();
      formData.append("image", imageFile);
      formData.append("name", name);
      formData.append("price", price);
      formData.append("contact", contact);

      // 2. POST to Flask
      const res = await fetch("http://127.0.0.1:8000/api/products/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json();
        alert(`Error: ${errData.error || "unknown error"}`);
        return;
      }

      // 3. If success, parse JSON
      const newItem = await res.json();
      alert(`Item added successfully! (ID: ${newItem.id})`);

      // 4. Reset form
      setName("");
      setPrice("");
      setContact("");
      setImageFile(null);
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    }
  }

  return (
    <main style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>Add New Item</h1>
      <form onSubmit={handleSubmit} style={{ maxWidth: "400px" }}>
        <div style={{ marginBottom: "10px" }}>
          <label style={{ display: "block" }}>Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setImageFile(e.target.files ? e.target.files[0] : null)
            }
            required
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label style={{ display: "block" }}>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ width: "100%" }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label style={{ display: "block" }}>Price:</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            style={{ width: "100%" }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label style={{ display: "block" }}>Contact:</label>
          <input
            type="text"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            required
            style={{ width: "100%" }}
          />
        </div>

        <button
          type="submit"
          style={{
            backgroundColor: "#0070f3",
            color: "#fff",
            padding: "8px 16px",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Upload
        </button>
      </form>
      <p style={{ marginTop: "20px" }}>
        <a href="/" style={{ color: "#0070f3" }}>
          ← Back to Home
        </a>
      </p>
    </main>
  );
}
