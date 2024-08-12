import React from 'react';
import { Box, Button, Divider, TextField, Typography, Radio } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "next-i18next";
import CustomModal from './CustomModal';

interface SelfAttendanceModalProps {
  open: boolean;
  onClose: () => void;
  selectedReason: string;
  setSelectedReason: (value: string) => void;
  otherReason: string;
  setOtherReason: (value: string) => void;
  handleSubmit: () => void;
  confirmButtonDisabled: boolean;
  setConfirmButtonDisabled: (value: boolean) => void;
}

const SelfAttendanceModal: React.FC<SelfAttendanceModalProps> = ({
  open,
  onClose,
  selectedReason,
  setSelectedReason,
  otherReason,
  setOtherReason,
  handleSubmit,
  confirmButtonDisabled,
  setConfirmButtonDisabled,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();

  // Define reasons directly within the component
  const reasons = [
    { value: "Present", label: t("COMMON.PRESENT") },
    { value: "Absent", label: t("COMMON.ABSENT") },
  ];

  const handleRadioChange = (value: string) => {
    setSelectedReason(value);
    setConfirmButtonDisabled(false);
  };

  const handleOtherReasonChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOtherReason(event.target.value);
  };

  return (
    <CustomModal
      open={open}
      handleClose={onClose}
      title={t("COMMON.ATTENDANCE")}
      subtitle={t("COMMON.SELECT_REASON")}
      primaryBtnText={t("COMMON.SUBMIT_ATTENDANCE")}
      primaryBtnClick={handleSubmit}
      primaryBtnDisabled={confirmButtonDisabled}
    >
      <Box padding={"0 1rem"}>
        {reasons.map((option) => (
          <React.Fragment key={option.value}>
            <Box
              display={"flex"}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <Typography
                variant="h2"
                sx={{
                //   color: theme.palette.warning["A200"],
                  fontSize: "14px",
                }}
                component="h2"
              >
                {option.label}
              </Typography>

              <Radio
                sx={{ pb: "20px" }}
                onChange={() => handleRadioChange(option.value)}
                value={option.value}
                checked={selectedReason === option.value}
              />
            </Box>
            <Divider />
          </React.Fragment>
        ))}
        <Box marginTop={"1rem"}>
          <TextField
            fullWidth
            label={t("COMMON.OTHER_REASON")}
            variant="outlined"
            value={otherReason}
            onChange={handleOtherReasonChange}
            disabled={selectedReason !== "Other"}
          />
        </Box>
      </Box>
    </CustomModal>
  );
};

export default SelfAttendanceModal;
