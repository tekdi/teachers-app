import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Modal,
  CircularProgress,
} from '@mui/material';
import { showToastMessage } from './Toastify';
import { useFormRead } from '@/hooks/useFormRead';
import { FormContext, FormContextType } from '@/utils/app.constant';
import { updateCohortMemberStatus } from '@/services/MyClassDetailsService';

interface DropOutModalProps {
  open: boolean;
  onClose: () => void;
  cohortMembershipId: any;
  cohortId: string;
  userId: string;
  reloadState: boolean;
  setReloadState: (state: boolean) => void;
}

function FeedBackModel({
  open,
  onClose,
  cohortMembershipId,
  userId,
  reloadState,
  cohortId,
  setReloadState,
}: DropOutModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<{ [key: string]: string }>({});
  const { data: formResponse, isPending } = useFormRead(
    FormContext.COHORT_MEMBER,
    FormContextType.COHORT_MEMBER
  );

  useEffect(() => {
    if (formResponse?.fields) {
      const initialData: { [key: string]: string } = {};
      formResponse.fields.forEach((field: any) => {
        initialData[field.fieldId] = '';
      });
      setFormData(initialData);
    }
  }, [formResponse]);

  const handleInputChange = (fieldId: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const customFields = Object.keys(formData).map((fieldId) => ({
        fieldId,
        value: formData[fieldId],
      }));

      const dynamicBody = {
        cohortId,
        userId,
        customFields,
      };

      console.log('Submitting payload:', dynamicBody);

      const response = await updateCohortMemberStatus({
        memberStatus: 'active',
        statusReason: 'Feedback submitted',
        membershipId: cohortMembershipId,
        dynamicBody,
      });

      console.log('API Response:', response);

      showToastMessage('Feedback submitted successfully', 'success');
      onClose();
      setReloadState(true);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      showToastMessage('Failed to submit feedback', 'error');
    } finally {
      setLoading(false);
    }
  };
  const isFormValid = Object.values(formData).every(
    (value) => value.trim() !== ''
  );

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          width: '500px',
          margin: '100px auto',
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: 24,
        }}
      >
        <Typography variant="h6" mb={2}>
          Feedback Form
        </Typography>
        {isPending || loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box component="form" noValidate autoComplete="off">
            {formResponse?.fields.map((field: any) => (
              <Box key={field.fieldId} mb={3}>
                <Typography variant="subtitle1" mb={1}>
                  {field.label}
                </Typography>
                <TextField
                  fullWidth
                  placeholder={field.placeholder || ''}
                  value={formData[field.fieldId] || ''}
                  onChange={(e) =>
                    handleInputChange(field.fieldId, e.target.value)
                  }
                  multiline={field.type === 'textarea'}
                  rows={field.type === 'textarea' ? 4 : 1}
                  required
                />
              </Box>
            ))}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                disabled={loading || !isFormValid}
              >
                {loading ? 'Submitting...' : 'Submit'}
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </Modal>
  );
}

export default FeedBackModel;
