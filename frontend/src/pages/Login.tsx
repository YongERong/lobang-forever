import {
  Button,
  TextField,
  Typography,
  Box,
  Checkbox,
  FormControlLabel,
  Link,
  Alert,
  Avatar
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import type { FormEvent } from 'react';
import type { LoginProps } from '../types';
import SingpassLogin from "../components/SingpassLogin";
import TextSpinner from "../components/TextSpinner";

const Login = ({ user, setUser }: LoginProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/home");
    }
  }, [user, navigate]);

  // Mock User
  const credentials = [
    { NRIC: "lebron", password: "james" },
  ];

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    const user = credentials.find(
      cred => cred.NRIC === email && cred.password === password
    );

    if (user) {
      setUser(user);
      navigate("/home");
    } else {
      setError("Invalid email or password. Please try again.");
    }
    setLoading(false);
  };

  return (
    <Box sx={{
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#f8f9fa'
    }}>
      <Box sx={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 4,
        backgroundColor: 'white'
      }}>
        <Box sx={{
          width: '100%',
          maxWidth: 400,
          textAlign: 'center'
        }}>
          <Avatar
            src="/lobang_forever.png"
            alt="lobang_forever_logo"
            sx={{
              width: 250,
              height: 250,
              margin: '0 auto',
            }}
          />

          <Typography variant="h4" sx={{
            fontWeight: 600,
            color: '#1f2937',
            marginBottom: 1
          }}>
            Welcome back!
          </Typography>

          <Typography variant="body1" sx={{
            color: '#6b7280',
            marginBottom: 4
          }}>
            Don't have an account yet?{' '}
            <Link href="#" sx={{
              color: '#3b82f6',
              textDecoration: 'none',
              fontWeight: 500,
              '&:hover': {
                textDecoration: 'underline'
              }
            }}>
              Sign up now!
            </Link>
          </Typography>

          {/* Error Message */}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              sx={{
                marginBottom: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  backgroundColor: 'white',
                  '& fieldset': {
                    borderColor: '#d1d5db',
                  },
                  '&:hover fieldset': {
                    borderColor: '#3b82f6',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#3b82f6',
                  },
                }
              }}
            />

            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              InputProps={{
                endAdornment: (
                  <Box
                    component="button"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    sx={{
                      border: 'none',
                      background: 'none',
                      cursor: 'pointer',
                      padding: 1,
                      color: '#6b7280',
                      '&:hover': {
                        color: '#374151'
                      }
                    }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </Box>
                ),
              }}
              sx={{
                marginBottom: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  backgroundColor: 'white',
                  '& fieldset': {
                    borderColor: '#d1d5db',
                  },
                  '&:hover fieldset': {
                    borderColor: '#3b82f6',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#3b82f6',
                  },
                }
              }}
            />

            {/* Remember me and Forgot password */}
            <Box sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 3
            }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    sx={{
                      color: '#d1d5db',
                      '&.Mui-checked': {
                        color: '#3b82f6',
                      },
                    }}
                  />
                }
                label={
                  <Typography sx={{ fontSize: '14px', color: '#6b7280' }}>
                    Remember me
                  </Typography>
                }
              />
              <Link href="#" sx={{
                color: '#3b82f6',
                textDecoration: 'none',
                fontSize: '14px',
                fontFamily: 'roboto, sans-serif',
                fontWeight: 400,
              }}>
                Forgot password?
              </Link>
            </Box>

            {/* Login Button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                // height: "52px",
                backgroundColor: '#3b82f6',
                color: 'white',
                py: 1.5,
                borderRadius: '8px',
                textTransform: 'none',
                fontSize: '16px',
                fontWeight: 600,
                marginBottom: 3,
                '&:hover': {
                  backgroundColor: '#2563eb',
                },
                '&:disabled': {
                  backgroundColor: '#9ca3af',
                }
              }}
            >
              {loading ? <TextSpinner text={"Signing in..."} /> : "Sign in"}
            </Button>

            {/* Divider */}
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: 3,
              color: '#9ca3af',
              fontSize: '14px'
            }}>
              <Box sx={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }} />
              <Typography sx={{ px: 2, fontSize: '14px', color: '#9ca3af' }}>
                OR
              </Typography>
              <Box sx={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }} />
            </Box>

            <SingpassLogin setUser={setUser}/>
          </form>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
