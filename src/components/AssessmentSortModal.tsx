import React, { useState } from 'react';
import SimpleModal from './SimpleModal';
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  useTheme,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { AssessmentStatus } from '@/utils/app.constant';

interface IAssessmentSortModal {
  open: boolean;
  modalTitle: string;
  onClose: () => void;
  btnText: string;
  onFilterApply: (options: any) => void;
}

const assessmentStatusOptions = [
  { label: 'ASSESSMENTS.NOT_STARTED', value: AssessmentStatus.NOT_STARTED },
  { label: 'ASSESSMENTS.IN_PROGRESS', value: AssessmentStatus.IN_PROGRESS },
  { label: 'ASSESSMENTS.COMPLETED', value: AssessmentStatus.COMPLETED },
];

const marksObtainedOptions = [
  { label: 'COMMON.LOW_TO_HIGH', value: 'desc' },
  { label: 'COMMON.HIGH_TO_LOW', value: 'asc' },
];

const namesOptions = [
  { label: 'COMMON.A_TO_Z', value: 'A_To_Z' },
  { label: 'COMMON.Z_TO_A', value: 'Z_To_A' },
];

const filters = [
  {
    label: 'ASSESSMENTS.ASSESSMENT_STATUS',
    options: assessmentStatusOptions,
    sortBy: 'attendanceStatus',
  },
  {
    label: 'ASSESSMENTS.MARKS_OBTAINED',
    options: marksObtainedOptions,
    sortBy: 'marksObtained',
  },
  {
    label: 'COMMON.NAMES',
    options: namesOptions,
    sortBy: 'names',
  },
];

const AssessmentSortModal: React.FC<IAssessmentSortModal> = ({
  open,
  modalTitle,
  onClose,
  btnText,
  onFilterApply,
}) => {
  const theme = useTheme<any>();
  const { t } = useTranslation();
  const [selectedValue, setSelectedValue] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('');

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    sortByKey: string
  ) => {
    setSortBy(sortByKey);
    setSelectedValue(event.target.value);
  };

  const onApply = () => {
    onFilterApply({ sortByKey: sortBy, sortByValue: selectedValue });
  };

  return (
    <SimpleModal
      open={open}
      modalTitle={modalTitle}
      onClose={onClose}
      primaryText={btnText}
      primaryActionHandler={onApply}
      showFooter={true}
    >
      <Grid container sx={{ padding: '10px 0px 0' }} spacing={2}>
        {filters?.map((filter) => (
          <Grid item xs={12} key={filter.label}>
            <FormControl component="fieldset" sx={{ width: '100%' }}>
              <FormLabel
                style={{
                  color: theme.palette.warning['400'],
                }}
                className="fs-12 fw-500"
                component="legend"
              >
                {t(filter.label)}
              </FormLabel>
              <RadioGroup
                aria-label={filter.label}
                name={filter.label}
                value={selectedValue}
                onChange={(event) => handleChange(event, filter.sortBy)}
              >
                {filter.options.map((option) => (
                  <FormControlLabel
                    key={option.value}
                    labelPlacement="start"
                    sx={{ justifyContent: 'space-between' }}
                    value={option.value}
                    control={<Radio sx={{ ml: '80px' }} />}
                    label={t(option.label)}
                    className="modal_label"
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </Grid>
        ))}
      </Grid>
    </SimpleModal>
  );
};

export default AssessmentSortModal;
