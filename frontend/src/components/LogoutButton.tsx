import { Button } from "@mui/material";
import type { LogoutProps } from "../types";

const LogoutButton = ({ setUser }: LogoutProps) => {
  return (
    <Button
      variant="contained"
      onClick={() => setUser(null)}
    >
      Logout
    </Button>
  );
}

export default LogoutButton;
