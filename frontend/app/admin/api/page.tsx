export default function AdminApiPage() {
  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <h2 className="text-xl font-semibold mb-4">API Test Panel</h2>
      <ul className="text-sm space-y-2">
        <li><code>GET /api/health</code></li>
        <li><code>GET /api/auth/me</code></li>
      </ul>
    </div>
  )
}


