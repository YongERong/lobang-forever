import { useEffect } from "react";
import { useNavigate } from "react-router";
import type { HomeProps } from "../types";
import { Stack } from "@mui/material";
import SHAPDashboard from "../components/ShapDashboard";

const mockData = [
  { feature: "feat1", importance: 0.5 },
  { feature: "feat2", importance: -0.1 },
  { feature: "feat3", importance: -0.4 }
];

const Home = ({ user }: HomeProps) => {
  const navigate = useNavigate();
  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate])
  return (
    <Stack sx={{
      justifyContent: "center",
      alignItems: "center",
    }}>
      <SHAPDashboard data={mockData} dataKey={"feature"} />
    </Stack>
  );
};

export default Home;
