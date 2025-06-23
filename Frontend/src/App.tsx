import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import Header from "./Components/Header/Header";
import Login from "./Components/Login/Login";

export interface IUser {
  id: number;
  username: string;
  role: string;
  iat: number;
}

export default function App() {
  const [data, setData] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [description, setDescription] = useState<string>("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<IUser | null>(null);

  // Decode token on mount and whenever isLoggedIn changes
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode<IUser>(token);
        setUser(decoded);
        setIsLoggedIn(true);
      } catch (err) {
        console.error("Invalid token:", err);
        setIsLoggedIn(false);
        setUser(null);
      }
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }
  }, [isLoggedIn]);

  return isLoggedIn && user ? (
    <>
      <Header
        user={user} // Pass user info here
        setData={setData}
        setLoading={setLoading}
        setDescription={setDescription}
        onLogout={() => {
          setIsLoggedIn(false);
          setUser(null);
        }}
      />
      <div className="outlet">
        {description && (
          <p>
            <strong>Description:</strong> {description}
          </p>
        )}
        <strong>API DATA:</strong>
        <pre>{loading ? "Loading, please wait..." : data}</pre>
      </div>
    </>
  ) : (
    <Login onLoginSuccess={() => setIsLoggedIn(true)} />
  );
}
