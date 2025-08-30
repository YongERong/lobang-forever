import axios from "axios";
import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Paper,
  Switch,
  FormControlLabel,
  Alert,
  CircularProgress,
  Divider,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';
import type { FormValues, InputField, ScoreResult } from '../types';
import type { Dispatch, SetStateAction } from 'react';
import { modelInputs } from '../data/mockdata';

const inputs = modelInputs;

  interface ModelInputProps {
    submitResult: string | ScoreResult | null;
    setSubmitResult: Dispatch<SetStateAction<string | ScoreResult | null>>;
  }

  const ModelInput: React.FC<ModelInputProps> = ({ submitResult, setSubmitResult }) => {
    const [mode, setMode] = useState<1 | 2>(1);
    const [linkValue, setLinkValue] = useState<string>('');
    const [formValues, setFormValues] = useState<FormValues>({});
    const [isLoading, setIsLoading] = useState<boolean>(false);


    const handleModeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setMode(event.target.checked ? 2 : 1);
      setSubmitResult('');
      // Reset form values when switching modes
      setFormValues({});
      setLinkValue('');
    };

    const handleLinkChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setLinkValue(event.target.value);
    };

    const handleInputChange = (feature: string, value: string, dtype: string) => {
      let processedValue: string | number = value;

      if (dtype === "int") {
        if (value === "") {
          processedValue = "";
        } else {
          const intValue = parseInt(value, 10);
          processedValue = isNaN(intValue) ? value : intValue;
        }
      } else if (dtype === "float") {
        if (value === "") {
          processedValue = "";
        } else {
          const floatValue = parseFloat(value);
          processedValue = isNaN(floatValue) ? value : floatValue;
        }
      }

      setFormValues(prev => ({
        ...prev,
        [feature]: processedValue
      }));
    };

    const getSelectOptions = (feature: string): string[] => {
      switch (feature) {
        case 'verified_status':
          return ['verified', 'not verified'];
        case 'author_ban_status':
          return ['active', 'under scrutiny', 'banned'];
        default:
          return [];
      }
    };

    const validateForm = (): boolean => {
      if (mode === 1) {
        return linkValue.trim() !== '';
      } else {
        // Check if all required fields are filled
        return inputs.every(input => {
          const value = formValues[input.feature];
          // For numeric fields, 0 is a valid value, so we need to check differently
          if (input.dtype === 'int' || input.dtype === 'float') {
            return value !== undefined && value !== '';
          }
          // For string fields
          return value !== undefined && value !== '';
        });
      }
    };

    const simulateAPICall = async (data: any) => {
      try {
        // Frontend proxy is configured in vite.config.ts to forward /api to the backend
        const response = await axios.post('/api/score', data);
        // Expecting response.data.score from backend
        return response.data.score;
      } catch (err) {
        console.error(err);
        throw err;
      }
    };

    const handleSubmit = async () => {
      if (!validateForm()) {
        setSubmitResult('Please fill in all required fields');
        return;
      }

      setIsLoading(true);
      setSubmitResult('');

      try {
        // Build payload to match backend VideoMetrics schema
        const defaults = {
          video_duration_sec: 0,
          verified_status: 0,
          author_ban_status: 0,
          like_ratio: 0.0,
          share_ratio: 0.0,
          comment_ratio: 0.0,
          title_length: 0,
          description_length: 0,
          edge_intensity: 0.0,
          color_histogram: 0.0,
          spectral_entropy: 0.0,
          audio_intensity: 0.0,
        } as any;

        const mapVerified = (v: any) => {
          // assumption: 'verified' -> 1, 'not verified' -> 0
          if (v === 'verified' || v === 1) return 1;
          return 0;
        };

        const mapAuthorBan = (v: any) => {
          // assumption: 'active' -> 0, 'under scrutiny' -> 1, 'banned' -> 2
          if (v === 'active' || v === 0) return 0;
          if (v === 'under scrutiny' || v === 'under_scrutiny' || v === 1) return 1;
          if (v === 'banned' || v === 2) return 2;
          return 0;
        };

        let payload: any = { ...defaults };

        if (mode === 1) {
          // For link mode we don't have parsed metrics client-side.
          // Send the link plus defaults; backend may implement video->metrics later.
          payload = { ...payload, link: linkValue };
        } else {
          // Manual mode: formValues may contain counts or ratios.
          const fv: any = formValues || {};

          // video_duration_sec
          if (fv.video_duration_sec !== undefined && fv.video_duration_sec !== '') {
            payload.video_duration_sec = Number(fv.video_duration_sec) || 0;
          }

          // verified_status and author_ban_status (map strings to ints)
          if (fv.verified_status !== undefined && fv.verified_status !== '') {
            payload.verified_status = mapVerified(fv.verified_status);
          }
          if (fv.author_ban_status !== undefined && fv.author_ban_status !== '') {
            payload.author_ban_status = mapAuthorBan(fv.author_ban_status);
          }

          // If frontend provided counts (video_view_count, video_like_count...), compute ratios
          const views = Number(fv.video_view_count) || 0;
          const likes = Number(fv.video_like_count) || 0;
          const shares = Number(fv.video_share_count) || 0;
          const comments = Number(fv.video_comment_count) || 0;

          if (views > 0) {
            payload.like_ratio = likes / views;
            payload.share_ratio = shares / views;
            payload.comment_ratio = comments / views;
          } else {
            // Or accept direct ratio inputs if user entered them
            if (fv.like_ratio !== undefined && fv.like_ratio !== '') payload.like_ratio = Number(fv.like_ratio) || 0.0;
            if (fv.share_ratio !== undefined && fv.share_ratio !== '') payload.share_ratio = Number(fv.share_ratio) || 0.0;
            if (fv.comment_ratio !== undefined && fv.comment_ratio !== '') payload.comment_ratio = Number(fv.comment_ratio) || 0.0;
          }

          // Other watch-duration features
          if (fv.title_length !== undefined && fv.title_length !== '') payload.title_length = Number(fv.title_length) || 0;
          if (fv.description_length !== undefined && fv.description_length !== '') payload.description_length = Number(fv.description_length) || 0;
          if (fv.edge_intensity !== undefined && fv.edge_intensity !== '') payload.edge_intensity = Number(fv.edge_intensity) || 0.0;
          if (fv.color_histogram !== undefined && fv.color_histogram !== '') payload.color_histogram = Number(fv.color_histogram) || 0.0;
          if (fv.spectral_entropy !== undefined && fv.spectral_entropy !== '') payload.spectral_entropy = Number(fv.spectral_entropy) || 0.0;
          if (fv.audio_intensity !== undefined && fv.audio_intensity !== '') payload.audio_intensity = Number(fv.audio_intensity) || 0.0;
        }

        const result = await simulateAPICall(payload);
        setSubmitResult(result);
      } catch (error) {
        console.error(error);
        setSubmitResult('Error occurred during API call');
      } finally {
        setIsLoading(false);
      }
    };

    const renderInputField = (input: InputField) => {
      const { feature, dtype } = input;
      const value = formValues[feature] === undefined || formValues[feature] === null ? '' : formValues[feature].toString();

      // For string fields with predefined options, use Select and give them more width
      const selectOptions = getSelectOptions(feature);
      if (dtype === 'string' && selectOptions.length > 0) {
        return (
          <Grid item xs={12} sm={6} md={6} lg={4} key={feature} sx={{ p: 1 }}>
            <FormControl fullWidth variant="outlined" required sx={{ minWidth: 240 }}>
              <InputLabel>{feature.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</InputLabel>
              <Select
                size="medium"
                value={value}
                label={feature.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                onChange={(e: any) => handleInputChange(feature, e.target.value, dtype)}
              >
                {selectOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        );
      }

      // For other field types, use TextField
      return (
        <Grid item xs={12} sm={6} md={4} lg={3} key={feature} sx={{ p: 1 }}>
          <TextField
            fullWidth
            label={feature.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
            variant="outlined"
            value={value}
            onChange={(e) => handleInputChange(feature, e.target.value, dtype)}
            type={dtype === 'int' || dtype === 'float' ? 'number' : 'text'}
            inputProps={{
              min: (dtype === 'int' || dtype === 'float') ? 0 : undefined,
              step: dtype === 'float' ? 'any' : undefined,
            }}
            required
          />
        </Grid>
      );
    };

    return (
      <Box sx={{ width: '100%', px: { xs: 2, sm: 3, md: 6 }, boxSizing: 'border-box' }}>
        <Paper elevation={3} sx={{ width: '100%', maxWidth: 1200, mx: 'auto', p: { xs: 2, md: 3 }, borderRadius: '1.5rem' }}>
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
            <FormControlLabel
              control={
                <Switch
                  checked={mode === 2}
                  onChange={handleModeChange}
                  color="primary"
                />
              }
              label={`Mode ${mode}: ${mode === 1 ? 'Video Link' : 'Manual Input'}`}
            />
          </Box>

          <Divider sx={{ mb: 3 }} />

          {mode === 1 ? (
            <Card variant="outlined" sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Video Link
                </Typography>
                <TextField
                  fullWidth
                  label="Enter Video URL"
                  variant="outlined"
                  value={linkValue}
                  onChange={handleLinkChange}
                  placeholder="https://example.com"
                  type="url"
                  sx={{ mb: 2 }}
                />
              </CardContent>
            </Card>
          ) : (
            <Card variant="outlined" sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Manual Input Mode
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Please fill in all the required fields below
                </Typography>

                <Grid container spacing={3}>
                  {inputs.map(renderInputField)}
                </Grid>
              </CardContent>
            </Card>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <Button
              variant="contained"
              size="large"
              onClick={handleSubmit}
              disabled={isLoading || !validateForm()}
              startIcon={isLoading ? <CircularProgress size={20} /> : <SendIcon />}
              sx={{ minWidth: 200 }}
            >
              {isLoading ? 'Submitting...' : 'Submit'}
            </Button>
          </Box>

          {submitResult && (() => {
            // support both string and structured result objects
            const messageText = typeof submitResult === 'string' ? submitResult : JSON.stringify(submitResult, null, 2);
            const isError = typeof submitResult === 'string' && submitResult.includes('Error');
            return (
              <Alert
                severity={isError ? 'error' : 'success'}
                sx={{ mt: 2 }}
              >
                <Typography variant="body2" component="pre" sx={{ whiteSpace: 'pre-wrap', margin: 0 }}>
                  {messageText}
                </Typography>
              </Alert>
            );
          })()}
        </Paper>
      </Box>
    );
  };

  export default ModelInput;
