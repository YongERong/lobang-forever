import { useEffect } from "react";
import { useNavigate } from "react-router";
import type { HomeProps } from "../types";
import { Divider, Stack } from "@mui/material";
import SHAPDashboard from "../components/SHAPDashboard";
import LogoutButton from "../components/LogoutButton";
import { metrics, SHAPData } from "../data/mockdata";
import MetricCard from "../components/MetricCard";
import VariableInputForm from "../components/ModelInput";

const Home = ({ user, setUser }: HomeProps) => {
  const navigate = useNavigate();
  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  const metricData = metrics;

  return (
    <Stack
      sx={{
        justifyContent: "center",
        alignItems: "center",
      }}
      spacing={2}
      divider={<Divider flexItem />}
    >
      <Stack direction={{xs: "column", md: "row"}} spacing={2}>
        {metricData.map((data) => <MetricCard data={data}/>)}
      </Stack>
      <VariableInputForm />
      <SHAPDashboard data={SHAPData} dataKey={"feature"} />
      <LogoutButton setUser={setUser}/>
    </Stack >
  );
};

export default Home;
