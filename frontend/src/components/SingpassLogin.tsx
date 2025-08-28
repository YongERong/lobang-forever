import { Button, Typography } from "@mui/material";
import { useNavigate } from "react-router";
import type { SingpassLoginProps } from "../types";

const SingpassLogin = ({ setUser }: SingpassLoginProps) => {
  const navigate = useNavigate();

  const fakeLogin = () => {
    setUser({ NRIC: "lebron", password: "james" });
    navigate("/home");
  }

  return (
    <Button
      fullWidth
      variant="contained"
      sx={{
        textTransform: 'none',
        backgroundColor: "#F4333D",
        display: "flex",
        gap: "0.3em",
        py: 1.5,
        borderRadius: '8px',
        '&:hover': {
          backgroundColor: "#B0262D",
        }
      }}
      onClick={fakeLogin}
    >
      <Typography
        sx={{
          fontSize: "17px",
          fontFamily: "Poppins",
          fontWeight: 700,
        }}
      >
        Log in with
      </Typography>
      <img
        src="/singpass_logo_white.svg"
        alt="Log in with sing pass"
        aria-label="sing pass"
        style={{
          height: 14,
          marginTop: 6,
        }}
      />
    </Button>
  );
};

export default SingpassLogin;
