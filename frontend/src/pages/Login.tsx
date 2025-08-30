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
import { credentials } from "../data/mockdata";

// Read Vite env for TikTok client key and redirect URI
const TIKTOK_CLIENT_KEY = import.meta.env.VITE_TIKTOK_CLIENT_KEY as string | undefined;
const TIKTOK_REDIRECT_URI = import.meta.env.VITE_TIKTOK_REDIRECT_URI as string | undefined;

// PKCE helpers
const base64UrlEncode = (buffer: ArrayBuffer) => {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const b64 = btoa(binary);
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

const sha256 = async (plain: string) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return await crypto.subtle.digest('SHA-256', data);
};

const generateCodeVerifier = (length = 128) => {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  // convert to base64url
  let binary = '';
  for (let i = 0; i < array.length; i++) binary += String.fromCharCode(array[i]);
  const b64 = btoa(binary);
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '').slice(0, length);
};

const generateCodeChallenge = async (verifier: string) => {
  const hashed = await sha256(verifier);
  return base64UrlEncode(hashed);
};

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

  // Handle TikTok OAuth callback: if URL contains code and state, verify and exchange
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const state = params.get('state');

    if (code) {
      // Only proceed if state matches the one we stored before redirect
      const savedState = sessionStorage.getItem('tiktok_oauth_state');
      if (!state || !savedState || state !== savedState) {
        setError('TikTok login failed: invalid state.');
        // Clean URL
        window.history.replaceState({}, document.title, window.location.pathname);
        return;
      }

      // Clear stored state
      sessionStorage.removeItem('tiktok_oauth_state');

      // Exchange the authorization code with the backend.
      // The backend must implement the server-side call to TikTok's /oauth/access_token
      // because it requires the client_secret. POST to a backend endpoint you provide.
      (async () => {
        setLoading(true);
        setError('');
        try {
          const codeVerifier = sessionStorage.getItem('tiktok_code_verifier');
          const resp = await fetch('/auth/tiktok/exchange', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code, redirect_uri: TIKTOK_REDIRECT_URI, code_verifier: codeVerifier })
          });

          if (!resp.ok) {
            const body = await resp.text();
            throw new Error(`Exchange failed: ${body}`);
          }

          const data = await resp.json();
          // Expect the backend to return a user object or token. Adjust according to your API.
          if (data && data.user) {
            setUser(data.user);
            navigate('/home');
          } else if (data && data.access_token) {
            // Optionally fetch user profile from backend or store token and fetch profile
            // For demo, we'll navigate to home and leave auth handling to your app.
            navigate('/home');
          } else {
            setError('TikTok login succeeded but unexpected response from server.');
          }
        } catch (err: any) {
          setError(err?.message || 'TikTok login failed.');
        } finally {
          setLoading(false);
          // Clean URL to remove code/state
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      })();
    }
  }, [setUser, navigate]);

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
            
            {/* TikTok Login Button */}
            <Box sx={{ mt: 2 }}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => {
                  // Build TikTok authorize URL and redirect
                  // Save a random state to sessionStorage to verify on callback
                  const clientKey = TIKTOK_CLIENT_KEY;
                  const redirectUri = TIKTOK_REDIRECT_URI;
                  if (!clientKey || !redirectUri) {
                    // If env vars are not set, show a small error via alert (dev only)
                    alert('TikTok login is not configured. Set VITE_TIKTOK_CLIENT_KEY and VITE_TIKTOK_REDIRECT_URI in your environment.');
                    return;
                  }

                  (async () => {
                    const state = Math.random().toString(36).slice(2);
                    sessionStorage.setItem('tiktok_oauth_state', state);

                    // PKCE: generate code_verifier and code_challenge
                    const codeVerifier = generateCodeVerifier();
                    const codeChallenge = await generateCodeChallenge(codeVerifier);
                    sessionStorage.setItem('tiktok_code_verifier', codeVerifier);

                    const scope = encodeURIComponent('user.info.basic');
                    const url = `https://www.tiktok.com/v2/auth/authorize/?client_key=${encodeURIComponent(clientKey)}&response_type=code&scope=${scope}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${encodeURIComponent(state)}&code_challenge=${encodeURIComponent(codeChallenge)}&code_challenge_method=S256`;

                    // Redirect to TikTok for authorization
                    window.location.href = url;
                  })();
                }}
                sx={{
                  mt: 1,
                  borderRadius: '8px',
                  textTransform: 'none',
                  color: '#111827'
                }}
              >
                Continue with TikTok
              </Button>
            </Box>
          </form>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
