import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export function Dashboard() {
  const navigate = useNavigate(); // ✅ hook must be called here, not inside a function

  const getType = async (e) => {
    e.preventDefault();

    try {
        
        const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8081/auth/type", {
        headers: {
            Authorization: `${token}`, // ✅ attach the token here
          },
      });
      const type = response.data.type; // ✅ extract data from response
      const id = response.data.id;

      if (type === "TEACHER") {
        navigate(`/dashboard/teacher/${id}`);
      } else if (type === "STUDENT") {
        navigate(`/dashboard/student/${id}`);
      } else {
        console.error("Unknown user type:", type);
      }
    } catch (error) {
      console.error("Error fetching user type:", error);
    }
  };

  useEffect(() => {
    getType({ preventDefault: () => {} }); // fake event to avoid errors
  }, []);

  return (
    <div className="p-4">
      <h1>Dashboard</h1>
      <button onClick={getType}>Go to my dashboard</button>
    </div>
  );
}
