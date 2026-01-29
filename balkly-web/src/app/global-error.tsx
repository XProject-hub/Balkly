"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
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
            <div style={{ fontSize: "64px", marginBottom: "16px" }}>⚠️</div>
            <h1 style={{ fontSize: "24px", fontWeight: 600, marginBottom: "8px" }}>
              Something went wrong
            </h1>
            <p style={{ color: "#9ca3af", marginBottom: "24px" }}>
              A critical error occurred. Please try again.
            </p>
            <button
              onClick={() => reset()}
              style={{
                padding: "12px 24px",
                backgroundColor: "#06b6d4",
                color: "white",
                fontWeight: 500,
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
              }}
            >
              Try Again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
