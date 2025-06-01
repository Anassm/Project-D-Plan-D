import React, { useState } from "react";
import logo from "../../assets/logo.png";
import styles from "./Header.module.css";

interface IEndpoint {
  name: string;
  description: string;
  url: string;
}

interface HeaderProps {
  setData: React.Dispatch<React.SetStateAction<string>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
}

export default function Header({
  setData,
  setLoading,
  setDescription,
}: HeaderProps) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(
    localStorage.getItem("token") !== null
  );

  const demo: Array<IEndpoint> = [
    {
      name: "time window, specific date",
      description: "Route to get data between two times on a specific date.",
      url: "https://localhost:3000/api/touchpoint/window?date=2024-09-29&from=14:00&to=15:00",
    },
    {
      name: "Flight number",
      description: "Route to get data by Flight Number.",
      url: "https://localhost:3000/api/touchpoint/flightnumber?flightNumber=TRA5690",
    },
    {
      name: "Airline",
      description: "Route to get data by Airline.",
      url: "https://localhost:3000/api/touchpoint/airline?airlineShortname=LUXAIR",
    },
    {
      name: "Touchpoint",
      description: "Route to get data by Touchpoint.",
      url: "https://localhost:3000/api/touchpoint/touchpoint?touchpoint=Niet-Schengenhal",
    },
    {
      name: "Aircraft type",
      description: "Route to get data by Aircraft Type.",
      url: "https://localhost:3000/api/touchpoint/aircraft?aircraftType=A320N",
    },
    {
      name: "Flight ID",
      description: "Route to get data by Flight ID.",
      url: "https://localhost:3000/api/touchpoint/flightid?flightID=638004",
    },
  ];

  async function login() {
    try {
      const res = await fetch("https://localhost:3000/post/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: "admin1",
          password: "Admin1Admin",
        }),
      });

      const result = await res.json();

      if (result.token) {
        localStorage.setItem("token", result.token);
        setIsLoggedIn(true);
        setData("");
        setDescription("");
        alert("Login successful.");
      } else {
        setData("Login failed.");
      }
    } catch (err) {
      console.error(err);
      setData("Login error.");
    }
  }

  function logout() {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setDescription("");
    setData("");
    alert("Logged out.");
  }

  async function fetchData(endpoint: IEndpoint) {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");
      const isLoggedIn = token !== null;

      const descriptionText = endpoint.description;
      const urlText = isLoggedIn ? endpoint.url : "";

      setDescription(`${descriptionText}\n${urlText}`);

      const response = await fetch(endpoint.url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        setData("Unauthorized: Please log in.");
        return;
      }

      const result = await response.json();
      setData(JSON.stringify(result, null, 2));
    } catch (error) {
      console.error(error);
      setData("Error fetching data.");
    } finally {
      setLoading(false);
    }
  }

  const displayButtons = demo.map((endpoint) => (
    <span
      className={styles.button}
      key={endpoint.name}
      onClick={() => fetchData(endpoint)}
    >
      {endpoint.name}
    </span>
  ));

  return (
    <header>
      <img
        className={styles.logo}
        src={logo}
        alt="Rotterdam the Hague Airport"
      />

      <div className={styles.buttonContainer}>
        <div className={styles.leftButtons}>{displayButtons}</div>

        <div className={styles.loginWrapper}>
          {isLoggedIn ? (
            <span className={styles.button} onClick={logout}>
              Logout
            </span>
          ) : (
            <span className={styles.button} onClick={login}>
              Login
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
