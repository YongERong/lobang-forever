import { Container, Input, TextField } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router";

const Login = ({ setUser }) => {
  const [nric, setNric] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Mock User
  const credentials = [
    { NRIC: "lebron", password: "james", },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nric, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data);
        navigate("/home");
      } else {
        setError("Invalid credentials");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <Container style={{display: "flex", flexDirection: "column", gap: "0.5em"}}>
      <TextField required label="NRIC" placeholder="eg. S1234567Z" />
      <TextField label="Password" type="password" autoComplete="current-password" />
    </Container>
  );
};

export default Login;
