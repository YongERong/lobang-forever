import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import type { HomeProps } from "../types";
import { Divider, Stack } from "@mui/material";
import SHAPDashboard from "../components/SHAPDashboard";
import LogoutButton from "../components/LogoutButton";
import { metrics, SHAPData } from "../data/mockdata";
import MetricCard from "../components/MetricCard";
import ModelInput from "../components/ModelInput";

const Home = ({ user, setUser }: HomeProps) => {
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
        axios.get("/api/score?video_duration_sec=30&verified_status=1&author_ban_status=0&like_ratio=0.1&share_ratio=0.05&comment_ratio=0.02")
            .then(response => setMessage(response.data.score))
            .catch(error => console.error("Error fetching data", error));
    }, []);

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
      // TODO: Temp test to see if it is calling API
      <h1>{message}</h1>
      <Stack direction={{xs: "column", md: "row"}} spacing={2}>
        {metricData.map((data) => <MetricCard data={data}/>)}
      </Stack>
      <ModelInput />
      <SHAPDashboard data={SHAPData} dataKey={"feature"} />
      <LogoutButton setUser={setUser}/>
    </Stack >
  );
};

export default Home;
