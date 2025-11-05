import React, { useState } from "react";
import axios from "axios";

export default function Login() {
  const [formData, setFormData] = useState({
    username: "", // ✅ Changé de 'email' à 'username'
    password: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  setError("");

  try {
    axios.defaults.withCredentials = true;

    const response = await axios.post("http://localhost:8081/auth/login", {
      username: formData.username,
      password: formData.password
    });

    const { token, expireIn } = response.data;
    localStorage.setItem("token", token);
    localStorage.setItem("token_expiry", expireIn);

    alert("✅ Connexion réussie !");
    window.location.href = "/dashboard";
  } catch (err) {
    console.error("❌ Erreur détaillée:", err);
    if (err.response?.status === 401) setError("❌ Identifiants incorrects");
    else setError("❌ Erreur serveur ou CORS");
  } finally {
    setIsLoading(false);
  }
};

  // 🌆 Style du fond
  const containerStyle = {
    minHeight: "100vh",
    backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('/im1.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "16px"
  };

  const cardStyle = {
    background: "white",
    borderRadius: "20px",
    boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
    padding: "32px",
    width: "100%",
    maxWidth: "400px"
  };

  // ✅ Boutons de test rapide
  const testAccounts = {
    student: { username: "etudiant@univ.edu", password: "etudiant123" },
    teacher: { username: "enseignant@univ.edu", password: "enseignant123" },
    admin: { username: "admin@univ.edu", password: "admin123" }
  };

  const quickLogin = (role) => {
    setFormData(testAccounts[role]);
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <div
            style={{
              width: "60px",
              height: "60px",
              background: "#2563eb",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px"
            }}
          >
            <svg
              style={{ width: "28px", height: "28px", color: "white" }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 
                002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h2 style={{ fontWeight: "700", fontSize: "22px", color: "#1f2937" }}>
            Se connecter
          </h2>
          <p style={{ color: "#6b7280" }}>Application de Gestion d'Emploi du Temps</p>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit}>
          <input
            type="text" // ✅ Changé de 'email' à 'text'
            name="username" // ✅ Changé de 'email' à 'username'
            placeholder="Nom d'utilisateur ou email"
            value={formData.username}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              marginBottom: "12px",
              fontSize: "15px"
            }}
          />

          <input
            type="password"
            name="password"
            placeholder="Mot de passe"
            value={formData.password}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              marginBottom: "12px",
              fontSize: "15px"
            }}
          />

          <div style={{ textAlign: "right", marginBottom: "16px" }}>
            <a
              href="#"
              style={{
                color: "#2563eb",
                fontSize: "14px",
                textDecoration: "none"
              }}
            >
              Mot de passe oublié ?
            </a>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: "100%",
              background: "#2563eb",
              color: "white",
              padding: "12px",
              borderRadius: "25px",
              border: "none",
              fontWeight: "600",
              fontSize: "16px",
              cursor: isLoading ? "not-allowed" : "pointer",
              opacity: isLoading ? 0.7 : 1
            }}
          >
            {isLoading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        {/* ✅ Boutons de test rapide */}
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "10px" }}>
            Test rapide :
          </p>
          <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
            <button
              type="button"
              onClick={() => quickLogin('student')}
              style={{
                padding: "8px 12px",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                background: "#f9fafb",
                fontSize: "12px",
                cursor: "pointer"
              }}
            >
              Étudiant
            </button>
            <button
              type="button"
              onClick={() => quickLogin('teacher')}
              style={{
                padding: "8px 12px",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                background: "#f9fafb",
                fontSize: "12px",
                cursor: "pointer"
              }}
            >
              Enseignant
            </button>
            <button
              type="button"
              onClick={() => quickLogin('admin')}
              style={{
                padding: "8px 12px",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                background: "#f9fafb",
                fontSize: "12px",
                cursor: "pointer"
              }}
            >
              Admin
            </button>
          </div>
        </div>

        {error && (
          <p style={{ 
            color: "#dc2626", 
            marginTop: "12px", 
            textAlign: "center",
            background: "#fef2f2",
            padding: "8px",
            borderRadius: "6px",
            fontSize: "14px"
          }}>
            {error}
          </p>
        )}
      </div>
    </div>
  );
}