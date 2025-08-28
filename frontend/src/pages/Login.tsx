import {
  Button,
  Card,
  CardActions,
  CardContent,
  TextField,
  Typography,
  Alert,
  Box,
  Container
} from "@mui/material";
import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router";
import TextSpinner from "../components/TextSpinner";
import type { LoginProps } from "../types";

const Login = ({ setUser }: LoginProps) => {
  const [nric, setNric] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Mock User
  const credentials = [
    { NRIC: "lebron", password: "james", },
  ];

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    // Simulate API call for delay & checking
    await new Promise(resolve => setTimeout(resolve, 1000));
    const user = credentials.find(
      cred => cred.NRIC === nric && cred.password === password
    );

    if (user) {
      setUser(user);
      navigate("/home");
    } else {
      setError("Invalid NRIC or password. Please try again.");
    }
    setLoading(false);
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: 400,
          borderRadius: 2,
        }}
      >
        <form onSubmit={handleSubmit}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ textAlign: "center", mb: 3 }}>
              <Typography variant="h4" component="h1" gutterBottom>
                Singpass Login
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Sign in to your account
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                required
                fullWidth
                label="NRIC"
                placeholder="eg. S1234567Z"
                value={nric}
                onChange={(e) => setNric(e.target.value)}
                variant="outlined"
                autoComplete="username"
              />

              <TextField
                required
                fullWidth
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                variant="outlined"
                autoComplete="current-password"
              />
            </Box>
          </CardContent>

          <CardActions sx={{ p: 3, pt: 0, justifyContent: "center", alignItems: "center" }}>
            <Button
              type="submit"
              variant="contained"
              // fullWidth
              size="large"
              disabled={loading || !nric || !password}
              sx={{
                py: 1.5,
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 600,
                width: "80%",
              }}
            >
              {loading ? <TextSpinner text={"Signing In..."} /> : "Sign In"}
            </Button>
          </CardActions>
        </form>
      </Card>
    </Container>
  );
};

export default Login;
