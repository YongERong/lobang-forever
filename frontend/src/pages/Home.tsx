import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import type { HomeProps } from "../types";
import { Divider, Stack, AppBar, Toolbar, Avatar, IconButton, Menu, MenuItem, Box, Typography } from "@mui/material";
import SHAPDashboard from "../components/SHAPDashboard";
import { metrics } from "../data/mockdata";
import MetricCard from "../components/MetricCard";
import ModelInput from "../components/ModelInput";
import React, { Suspense } from 'react';
const ModelOutput = React.lazy(() => import('../components/ModelOutput'));

const Home = ({ user, setUser }: HomeProps) => {
  

  const navigate = useNavigate();
  // submitResult may be a string error message, a structured ScoreResult, or null
  const [submitResult, setSubmitResult] = useState<string | import('../types').ScoreResult | null>(null);

  useEffect(() => {
    // quick example call to populate initial submitResult so ModelOutput has data
    axios.post('/api/score', {
      video_duration_sec: 30,
      verified_status: 1,
      author_ban_status: 0,
      like_ratio: 0.1,
      share_ratio: 0.05,
      comment_ratio: 0.02,
    })
      .then(response => {
        // backend returns { score: { quality_score, quality_class, watch_duration } }
        // propagate this to the UI result state so ModelOutput shows it
        setSubmitResult(response.data.score);
      })
      .catch(error => console.error('Error fetching data', error));
  }, []);
  useEffect(() => {
    if (!user) {
      navigate("/");
    }
    console.log(submitResult);
  }, [user, navigate, submitResult]);

  const metricData = metrics;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <AppBar position="static" color="transparent" elevation={0} sx={{ mb: 2 }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box component="img" src="/lobang_forever.png" alt="Lobang Forever" sx={{ width: 36, height: 36, mr: 1 }} />
            <Typography variant="h6">Lobang Forever</Typography>
          </Box>
          <Box>
            <IconButton onClick={handleAvatarClick} size="small">
              <Avatar>U</Avatar>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <MenuItem onClick={() => { handleClose(); setUser(null); }}>
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <Stack
      sx={{
        justifyContent: "center",
        alignItems: "center",
      }}
      spacing={2}
      divider={<Divider flexItem />}
    >
      <ModelInput submitResult={submitResult} setSubmitResult={setSubmitResult}/>

      {/* metrics container: constrain to same maxWidth as ModelInput and allow wrap */}
      <Box sx={{ width: '100%', maxWidth: 1200, mx: 'auto', px: { xs: 2, sm: 3, md: 6 } }}>
  <Box sx={{ display: 'flex', gap: 5, flexWrap: 'wrap', justifyContent: 'flex-start', mt: 1 }}>
          {metricData.map((data) => (
            <Box key={data.title} sx={{ flex: '1 1 240px', minWidth: 240 }}>
              <MetricCard data={data} />
            </Box>
          ))}
        </Box>
      </Box>
      <Suspense fallback={<div style={{ height: 200 }}></div>}>
        <ModelOutput submitResult={submitResult} />
      </Suspense>
    </Stack >
    </>
  );
};

export default Home;
