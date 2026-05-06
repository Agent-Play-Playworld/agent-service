export default function HomePage() {
  return (
    <main style={{ fontFamily: "sans-serif", padding: "2rem", lineHeight: 1.5 }}>
      <h1>Agent Service</h1>
      <p>
        Multi-agent customer support runtime for startups, companies, indie
        entrepreneurs, and founders.
      </p>
      <p>
        Agent runtime initializes automatically on server startup. Use the API
        routes below to verify service status:
      </p>
      <ul>
        <li>
          <code>/api/health</code>
        </li>
        <li>
          <code>/api/runtime</code>
        </li>
      </ul>
    </main>
  );
}
