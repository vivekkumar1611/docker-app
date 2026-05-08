import { useEffect, useState } from "react";
import "./App.css";

const API = "http://16.16.219.151:32374";

function App() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const fetchUsers = async () => {
    const res = await fetch(`${API}/api/users`);
    const data = await res.json();
    setUsers(data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const addUser = async () => {
    if (!name || !email) return;

    await fetch(`${API}/api/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email }),
    });

    setName("");
    setEmail("");

    fetchUsers();
  };

  const deleteUser = async (id) => {
    await fetch(`${API}/api/users/${id}`, {
      method: "DELETE",
    });

    fetchUsers();
  };

  return (
    <div className="container">
      <div className="card">
        <h1>3-Tier App - User Management</h1>

        <div className="form">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button onClick={addUser}>Add User</button>
        </div>

        <div className="users">
          {users.map((user) => (
            <div className="user-card" key={user.id}>
              <div>
                <h3>{user.name}</h3>
                <p>{user.email}</p>
              </div>

              <button
                className="delete-btn"
                onClick={() => deleteUser(user.id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
