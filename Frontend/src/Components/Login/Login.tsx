import { useState } from "react";
import styles from "./Login.module.css";

export default function Login({
  onLoginSuccess,
}: {
  onLoginSuccess: () => void;
}) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await fetch("https://localhost:3000/post/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      const result = await res.json();

      if (res.ok && result.token) {
        localStorage.setItem("token", result.token);
        onLoginSuccess();
      } else {
        setError(result.message || "Login failed.");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred during login.");
    }
  };

  return (
    <div className={styles.background}>
      <div className={styles.container}>
        <h2 className={styles.title}>Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            className={styles.input}
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <input
            className={styles.input}
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button className={styles.button} type="submit">
            Login
          </button>
          {error && <p className={styles.error}>{error}</p>}
        </form>
      </div>
    </div>
  );
}
