// app/page.tsx (TypeScript, Server Component)
interface Product {
  id: number;
  name: string;
  image_path: string;
  price: number;
  contact: string;
}

export default async function HomePage() {
  // 1. We fetch the product list from Flask
  const res = await fetch("http://127.0.0.1:8000/api/products", {
    // By default, Next.js might cache the result. 
    // If you want to always get fresh data, you can use:
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  const products: Product[] = await res.json();

  // 2. Render them in the UI
  return (
    <main style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>My Furniture for Sale</h1>
      <p>
        <a
          href="/add-item"
          style={{
            display: "inline-block",
            padding: "8px 12px",
            backgroundColor: "#0070f3",
            color: "#fff",
            borderRadius: "4px",
            textDecoration: "none",
          }}
        >
          + Add New Item
        </a>
      </p>

      {products.length === 0 ? (
        <p>No items found.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {products.map((item) => (
            <li
              key={item.id}
              style={{
                border: "1px solid #ccc",
                margin: "10px 0",
                padding: "10px",
              }}
            >
              <h3 style={{ margin: "0 0 10px" }}>{item.name}</h3>
              <p style={{ margin: 0 }}>
                Price: <strong>${item.price}</strong>
              </p>
              <p style={{ margin: 0 }}>
                Contact: <strong>{item.contact}</strong>
              </p>
              {item.image_path && (
                <div style={{ marginTop: "10px" }}>
                  <img
                    src={`http://127.0.0.1:8000/${item.image_path}`}
                    alt={item.name}
                    style={{ width: "200px", border: "1px solid #ccc" }}
                  />
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

