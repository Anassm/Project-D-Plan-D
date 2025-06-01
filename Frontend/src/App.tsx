import { useState } from "react";
import Header from "./Components/Header/Header";

export default function App() {
  const [data, setData] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [description, setDescription] = useState<string>("");

  return (
    <>
      <Header
        setData={setData}
        setLoading={setLoading}
        setDescription={setDescription}
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
  );
}
