import { CircularProgress, Container } from "@mui/material";
import type { TextSpinnerProps } from "../types";

const TextSpinner = ({ text }: TextSpinnerProps) => {
  return (
    <Container sx={{ display: "flex", gap: "0.5em", alignItems: "center", justifyContent: "center" }}>
      <CircularProgress size="20px"/>
      {text}
    </Container>
  );
};

export default TextSpinner;
