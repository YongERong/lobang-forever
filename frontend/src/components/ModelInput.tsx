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
import type { FormValues, InputField } from '../types';
import { modelInputs } from '../data/mockdata';

const inputs = modelInputs;

const ModelInput: React.FC = ({ submitResult, setSubmitResult }) => {
  const [mode, setMode] = useState<1 | 2>(1);sam
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

  const simulateAPICall = async (data: any): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`API call successful! Received data: ${JSON.stringify(data, null, 2)}`);
      }, 2000);
    });
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      setSubmitResult('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    setSubmitResult('');

    try {
      let payload = {};

      if (mode === 1) {
        payload = { link: linkValue };
      } else {
        payload = { variables: formValues };
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

    // For string fields with predefined options, use Select
    const selectOptions = getSelectOptions(feature);
    if (dtype === 'string' && selectOptions.length > 0) {
      return (
        <Grid sx={{ xs: 12, sm: 6 }} key={feature}>
          <FormControl fullWidth variant="outlined" sx={{ width: 250 }} required>
            <InputLabel>{feature.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</InputLabel>
            <Select
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
      <Grid sx={{ xs: 12, sm: 6 }} key={feature}>
        <TextField
          fullWidth
          label={feature.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
          variant="outlined"
          value={value}
          onChange={(e) => handleInputChange(feature, e.target.value, dtype)}
          type={dtype === 'int' || dtype === 'float' ? 'number' : 'text'}
          slotProps={{
            htmlInput: {
              min: (dtype === 'int' || dtype === 'float') ? 0 : undefined,
              step: dtype === 'float' ? 'any' : undefined,
            },
            inputLabel: {
              shrink: true
            }
          }}
          sx={{ width: 250 }}
          required
        />
      </Grid>
    );
  };

  return (
    <Box sx={{ maxWidth: 1000, margin: '0 auto', padding: 3 }}>
      <Paper elevation={3} sx={{ padding: 3, borderRadius: "1.5rem" }}>
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

        {submitResult && (
          <Alert
            severity={submitResult.includes('Error') ? 'error' : 'success'}
            sx={{ mt: 2 }}
          >
            <Typography variant="body2" component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
              {submitResult}
            </Typography>
          </Alert>
        )}
      </Paper>
    </Box>
  );
};

export default ModelInput;
