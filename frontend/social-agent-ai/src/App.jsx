import axios from "axios";
import { useState } from "react";

export default function App() {
  const [brand, setBrand] = useState("");
  const [product, setProduct] = useState("");
  const [audience, setAudience] = useState("");
  const [platform, setPlatform] = useState("");
  const [tone, setTone] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    setError("");
    setResult("");

    try {
      const res = await axios.post("http://localhost:5000/generate-content", {
        brand,
        product,
        audience,
        platform,
        tone,
      });

      console.log("FULL RESPONSE:", res.data);

      setResult(res.data.data || "No content returned");
    } catch (err) {
      console.error("Frontend error:", err);
      setError(err?.response?.data?.error || err.message || "Request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "700px",
        margin: "40px auto",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1>AI Social Media Agent</h1>

      <input
        type="text"
        placeholder="Brand"
        value={brand}
        onChange={(e) => setBrand(e.target.value)}
        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
      />

      <input
        type="text"
        placeholder="Product"
        value={product}
        onChange={(e) => setProduct(e.target.value)}
        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
      />

      <input
        type="text"
        placeholder="Audience"
        value={audience}
        onChange={(e) => setAudience(e.target.value)}
        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
      />

      <input
        type="text"
        placeholder="Platform"
        value={platform}
        onChange={(e) => setPlatform(e.target.value)}
        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
      />

      <input
        type="text"
        placeholder="Tone"
        value={tone}
        onChange={(e) => setTone(e.target.value)}
        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
      />

      <button
        onClick={generate}
        disabled={loading}
        style={{
          padding: "12px 20px",
          backgroundColor: "#111",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        {loading ? "Generating..." : "Generate Content"}
      </button>

      {error && <p style={{ color: "red", marginTop: "20px" }}>{error}</p>}

      {result && (
        <div
          style={{
            marginTop: "24px",
            padding: "24px",
            backgroundColor: "#f8f8f8",
            color: "#111",
            borderRadius: "14px",
            whiteSpace: "pre-wrap",
            lineHeight: "1.8",
            fontSize: "17px",
            textAlign: "left",
            boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
          }}
        >
          {result.replace(/\*\*/g, "")}
        </div>
      )}
    </div>
  );
}
