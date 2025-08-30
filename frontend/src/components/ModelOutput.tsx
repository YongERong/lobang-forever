import { Box, Paper, Stack, Typography, Chip, Container } from "@mui/material";
import { Gauge } from "@mui/x-charts";
import SHAPDashboard from "./SHAPDashboard";
import { SHAPData } from "../data/mockdata";
import type { ScoreResult } from "../types";

const ModelOutput = ({ submitResult }: { submitResult: string | ScoreResult | null }) => {
  // If submitResult is the structured score object, extract values; otherwise fallback to mock
  const isStructured = typeof submitResult === 'object' && submitResult !== null;
  const data = isStructured
    ? {
        videoQuality: (submitResult as ScoreResult).quality_class || 'Unknown',
        counterfactuals: [],
        quality_score: (submitResult as ScoreResult).quality_score,
        watch_duration: (submitResult as ScoreResult).watch_duration,
      }
    : {
        videoQuality: "Low Quality",
        counterfactuals: [
          "If your video was longer, it would have 20% more views",
          "If your video had more comments, it would have 39% more likes"
        ],
      };

  const getQualityConfig = (type) => {
    switch (type) {
      case "High Quality":
        return {
          color: '#22c55e',
          bgColor: 'rgba(34, 197, 94, 0.1)',
          icon: '🎉',
          message: 'Excellent work!'
        };
      case "Low Quality":
        return {
          color: '#ef4444',
          bgColor: 'rgba(239, 68, 68, 0.1)',
          icon: '📈',
          message: 'Room for improvement'
        };
      case "Medium Quality":
        return {
          color: '#ff7b00ff',
          bgColor: 'rgba(255, 123, 0, 0.1)',
          icon: '⚡',
          message: 'Good progress'
        };
      default:
        return {
          color: '#6b7280',
          bgColor: 'rgba(107, 114, 128, 0.1)',
          icon: '📊',
          message: 'Analysis complete'
        };
    }
  };

  const qualityConfig = getQualityConfig(data.videoQuality);

  return (
    submitResult ? (
      <Box 
        sx={{ 
          py: 4,
          backgroundColor: 'background.default'
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={4} alignItems="center">
            
            {/* Header Section */}
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <Typography 
                variant="h2" 
                sx={{ 
                  fontWeight: 700,
                  color: 'text.primary',
                  mb: 2
                }}
              >
                Video Analytics
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: 'text.secondary',
                  fontWeight: 400
                }}
              >
                AI-powered insights for your content
              </Typography>
            </Box>

            {/* Video Quality Card */}
            <Paper
              elevation={8}
              sx={{
                width: '100%',
                maxWidth: 600,
                p: 4,
                borderRadius: '24px',
                background: 'white',
                boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                border: '1px solid rgba(0,0,0,0.06)',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: `linear-gradient(90deg, ${qualityConfig.color}, ${qualityConfig.color}aa)`,
                }
              }}
            >
              <Stack spacing={2} alignItems="center">
                <Box 
                  sx={{ 
                    fontSize: '3rem',
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                  }}
                >
                  {qualityConfig.icon}
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 600, color: 'text.primary' }}>
                  Your video quality is:
                </Typography>
                <Chip
                  label={data.videoQuality.toUpperCase()}
                  sx={{
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    px: 3,
                    py: 1.5,
                    height: 'auto',
                    color: 'white',
                    background: `linear-gradient(135deg, ${qualityConfig.color}, ${qualityConfig.color}cc)`,
                    boxShadow: `0 4px 20px ${qualityConfig.color}40`,
                    '& .MuiChip-label': {
                      px: 2
                    }
                  }}
                />
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: 'text.secondary',
                    fontStyle: 'italic'
                  }}
                >
                  {qualityConfig.message}
                </Typography>

                {/* Numeric metrics when available */}
                {isStructured && (
                  <Stack direction="row" spacing={3} sx={{ mt: 2 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="caption">Quality Score</Typography>
                      <Typography variant="h5">{(data as any).quality_score ?? '—'}</Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="caption">Watch Duration</Typography>
                      <Typography variant="h5">{(data as any).watch_duration ?? '—'}</Typography>
                    </Box>
                  </Stack>
                )}
              </Stack>
            </Paper>

            {/* Counterfactuals Section */}
            <Paper
              elevation={8}
              sx={{
                width: '100%',
                maxWidth: 800,
                p: 4,
                borderRadius: '24px',
                background: 'white',
                boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                border: '1px solid rgba(0,0,0,0.06)',
              }}
            >
              <Stack spacing={3}>
                <Box sx={{ textAlign: "center" }}>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      mb: 1
                    }}
                  >
                    💡 Improvement Opportunities
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ maxWidth: 500, mx: 'auto', fontSize: '1.1rem' }}
                  >
                    Personalized recommendations to boost your video performance
                  </Typography>
                </Box>

                <Box
                  sx={{
                    maxHeight: 400,
                    overflow: 'auto',
                    '&::-webkit-scrollbar': {
                      width: '8px',
                    },
                    '&::-webkit-scrollbar-track': {
                      background: 'rgba(0,0,0,0.05)',
                      borderRadius: '8px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                      background: '#d1d5db',
                      borderRadius: '8px',
                    },
                  }}
                >
                  <Stack spacing={2}>
                    {data.counterfactuals && data.counterfactuals.map((counterfactual, index) => {
                      const percentageMatch = counterfactual.match(/(\d+)%/);
                      const percentage = percentageMatch ? percentageMatch[1] : null;

                      return (
                        <Paper
                          key={index}
                          elevation={3}
                          sx={{
                            p: 3,
                            borderRadius: '16px',
                            background: 'white',
                            border: '1px solid rgba(0,0,0,0.08)',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            position: 'relative',
                            overflow: 'hidden',
                            '&::before': {
                              content: '""',
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              width: '4px',
                              height: '100%',
                              background: 'linear-gradient(135deg, #4CAF50, #45a049)',
                            },
                            '&:hover': {
                              // transform: 'translateY(-4px) scale(1.01)',
                              boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                            }
                          }}
                        >
                          <Stack direction="row" spacing={3} alignItems="center">
                            <Box
                              sx={{
                                minWidth: 50,
                                height: 50,
                                borderRadius: '12px',
                                background: percentage
                                  ? `linear-gradient(135deg, #4CAF50 0%, #45a049 100%)`
                                  : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontWeight: 'bold',
                                fontSize: '0.9rem',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
                              }}
                            >
                              {percentage ? `+${percentage}%` : `${index + 1}`}
                            </Box>
                            
                            <Box sx={{ flex: 1 }}>
                              <Typography
                                variant="body1"
                                sx={{
                                  fontWeight: 600,
                                  color: 'text.primary',
                                  lineHeight: 1.6,
                                  fontSize: '1.05rem'
                                }}
                              >
                                {counterfactual}
                              </Typography>
                              
                              {percentage && (
                                <Box sx={{ mt: 2 }}>
                                  <Stack direction="row" alignItems="center" spacing={2}>
                                    <Typography
                                      variant="caption"
                                      sx={{
                                        color: 'text.secondary',
                                        fontWeight: 600,
                                        fontSize: '0.8rem'
                                      }}
                                    >
                                      Impact Level
                                    </Typography>
                                    <Box sx={{ flex: 1 }}>
                                      <Box
                                        sx={{
                                          width: '100%',
                                          height: 8,
                                          backgroundColor: 'rgba(0,0,0,0.08)',
                                          borderRadius: 4,
                                          overflow: 'hidden',
                                          position: 'relative'
                                        }}
                                      >
                                        <Box
                                          sx={{
                                            width: `${Math.min(parseInt(percentage), 100)}%`,
                                            height: '100%',
                                            background: 'linear-gradient(90deg, #4CAF50, #45a049, #66BB6A)',
                                            borderRadius: 4,
                                            transition: 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
                                            position: 'relative',
                                            '&::after': {
                                              content: '""',
                                              position: 'absolute',
                                              top: 0,
                                              left: 0,
                                              right: 0,
                                              bottom: 0,
                                              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                                              animation: 'shimmer 2s infinite'
                                            },
                                            '@keyframes shimmer': {
                                              '0%': { transform: 'translateX(-100%)' },
                                              '100%': { transform: 'translateX(100%)' }
                                            }
                                          }}
                                        />
                                      </Box>
                                    </Box>
                                  </Stack>
                                </Box>
                              )}
                            </Box>
                          </Stack>
                        </Paper>
                      );
                    })}
                  </Stack>
                </Box>

                {data.counterfactuals && data.counterfactuals.length === 0 && (
                  <Box
                    sx={{
                      textAlign: 'center',
                      py: 6,
                      color: 'text.secondary'
                    }}
                  >
                    <Typography variant="h6" sx={{ mb: 1, fontSize: '1.2rem' }}>
                      🎬 No recommendations available
                    </Typography>
                    <Typography variant="body1">
                      Upload a video to get personalized improvement suggestions
                    </Typography>
                  </Box>
                )}
              </Stack>
            </Paper>

            {/* SHAP Dashboard */}
            <Box sx={{ width: '100%', maxWidth: 1000 }}>
              <SHAPDashboard data={SHAPData} dataKey={"feature"} />
            </Box>
            
          </Stack>
        </Container>
      </Box>
    ) : (
      <></>
    )
  );
};

export default ModelOutput;
