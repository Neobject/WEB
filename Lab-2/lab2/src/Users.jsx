import { useState, useEffect } from "react";
import UserCard from "../components/UserCard.jsx";
import Loader from "../components/Loader.jsx";
import { fetchUsers } from "./services/api.js";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        const data = await fetchUsers();
        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, []);

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(query.toLowerCase())
  );

  if (loading) return <Loader />;
  if (error) return <div style={{ color: "red", textAlign: "center" }}>{error}</div>;

  return (
    <main style={{ padding: 20 }}>
      <input
        placeholder="Пошук користувача"
        value={query}
        onChange={e => setQuery(e.target.value)}
        style={{ padding: 8, marginBottom: 20, width: "100%" }}
      />
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {filtered.map(u => (
          <UserCard key={u.id} user={u} />
        ))}
      </div>
    </main>
  );
}
