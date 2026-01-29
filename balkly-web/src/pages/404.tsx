import Link from "next/link";

export default function Custom404() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom right, #0f172a, #1e293b, #0f172a)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ textAlign: "center", color: "white", maxWidth: "400px", padding: "24px" }}>
        <div style={{ fontSize: "80px", fontWeight: "bold", color: "#06b6d4", marginBottom: "16px" }}>
          404
        </div>
        <h1 style={{ fontSize: "24px", fontWeight: 600, marginBottom: "8px" }}>
          Page Not Found
        </h1>
        <p style={{ color: "#9ca3af", marginBottom: "24px" }}>
          The page you are looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          style={{
            display: "inline-block",
            padding: "12px 24px",
            backgroundColor: "#06b6d4",
            color: "white",
            fontWeight: 500,
            borderRadius: "8px",
            textDecoration: "none",
          }}
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
