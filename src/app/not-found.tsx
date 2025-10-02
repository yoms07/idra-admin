import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{ padding: 24 }}>
      <h1>404 - Page not found</h1>
      <p>Check the URL or go back to the home page.</p>
      <Link href="/">Go home</Link>
    </div>
  );
}
