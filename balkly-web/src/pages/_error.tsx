import { NextPageContext } from "next";
import Link from "next/link";

interface ErrorProps {
  statusCode?: number;
}

function Error({ statusCode }: ErrorProps) {
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
          {statusCode || "Error"}
        </div>
        <h1 style={{ fontSize: "24px", fontWeight: 600, marginBottom: "8px" }}>
          {statusCode === 404 ? "Page Not Found" : "Something went wrong"}
        </h1>
        <p style={{ color: "#9ca3af", marginBottom: "24px" }}>
          {statusCode === 404
            ? "The page you are looking for doesn't exist."
            : "An unexpected error occurred. Please try again."}
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

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
