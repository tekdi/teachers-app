import { createCohort, getFormRead } from '@/services/CreateUserService';
import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Divider,
  Fade,
  IconButton,
  Modal,
  Radio,
  Typography
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { IChangeEvent } from '@rjsf/core';
import { RJSFSchema } from '@rjsf/utils';
import { useTranslation } from 'next-i18next';
import React, { useEffect, useState } from 'react';
import DynamicForm from '../DynamicForm';
import { GenerateSchemaAndUiSchema } from '../GeneratedSchemas';
import { showToastMessage } from '../Toastify';

interface CreateBlockModalProps {
  open: boolean;
  handleClose: () => void;
  onCenterAdded: () => void;
}

interface CustomField {
  fieldId: any;
  value: any;
}

interface CohortDetails {
  name: string;
  type: string;
  parentId: string | null;
  customFields: CustomField[];
}
const CustomRadio = styled(Radio)(({ theme }) => ({
  color: theme.palette.text.primary,
  '&.Mui-checked': {
    color: theme.palette.text.primary,
  },
}));

const CreateCenterModal: React.FC<CreateBlockModalProps> = ({
  open,
  handleClose,
  onCenterAdded,
}) => {
  const { t } = useTranslation();
  const theme = useTheme<any>();

  const [centerName, setCenterName] = useState<string>('');
  const [centerType, setCenterType] = useState<string>('Regular');
  const [schema, setSchema] = React.useState<any>();
  const [uiSchema, setUiSchema] = React.useState<any>();

  const handleTextFieldChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCenterName(event.target.value);
  };

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCenterType(event.target.value);
  };

  const handleCreateButtonClick = () => {
    console.log('Entered Center Name:', centerName);
    console.log('Selected Center Type:', centerType);
    showToastMessage(t('CENTERS.CENTER_CREATED'), 'success');
    handleClose();
  };

  useEffect(() => {
    const getForm = async () => {
      try {
        const res = await getFormRead('cohorts', 'cohort');
        console.log(res);
        const { schema, uiSchema } = GenerateSchemaAndUiSchema(res, t);
        console.log(schema, uiSchema);
        setSchema(schema);
        setUiSchema(uiSchema);
      } catch (error) {
        console.log(error);
      }
    };
    getForm();
  }, []);

  const handleSubmit = async (
    data: IChangeEvent<any, RJSFSchema, any>,
    event: React.FormEvent<any>
  ) => {
    const formData = data.formData;
    console.log('Form data submitted:', formData);

    const parentId = localStorage.getItem('blockParentId');
    const cohortDetails: CohortDetails = {
      name: formData.name,
      type: 'COHORT',
      parentId: parentId,
      customFields: [],
    };

    Object.entries(formData).forEach(([fieldKey, fieldValue]) => {
      const fieldSchema = schema.properties[fieldKey];
      const fieldId = fieldSchema?.fieldId;
      if (fieldId !== null) {
        cohortDetails.customFields.push({
          fieldId: fieldId,
          value: formData.cohort_type,
        });
      }
    });
    const cohortData = await createCohort(cohortDetails);
    if (cohortData) {
      showToastMessage(t('CENTERS.CENTER_CREATED'), 'success');
      onCenterAdded();
      handleClose();
    }
  };

  const handleChange = (event: IChangeEvent<any>) => {
    console.log('Form data changed:', event.formData);
  };

  const handleError = (errors: any) => {
    console.log('Form errors:', errors);
  };

  return (
    <Modal open={open} onClose={handleClose} closeAfterTransition>
      <Fade in={open}>
        <Box
          sx={{
            backgroundColor: 'white',
            boxShadow: 24,
            maxWidth: 400,
            width: '90%',
            margin: 'auto',
            borderRadius: 3,
            outline: 'none',
            p: 2,
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 1,
            }}
          >
            <Typography
              variant="h2"
              gutterBottom
              color={theme?.palette?.text?.primary}
            >
              {t('CENTERS.NEW_CENTER')}
            </Typography>
            <IconButton
              onClick={handleClose}
              sx={{ color: theme?.palette?.text?.primary }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider sx={{ mb: -2, mx: -2 }} />
          {/* <FormControl component="fieldset" sx={{ mb: 2 }}>
            <FormLabel sx={{ fontSize: '12px' }} component="legend">
              {t('CENTERS.CENTER_TYPE')}
            </FormLabel>
            <RadioGroup row value={centerType} onChange={handleRadioChange}>
              <FormControlLabel
                value="Regular"
                control={<CustomRadio />}
                label={t('CENTERS.REGULAR')}
              />
              <FormControlLabel
                value="Remote"
                control={<CustomRadio />}
                label={t('CENTERS.REMOTE')}
              />
            </RadioGroup>
          </FormControl> */}
          {/* <TextField
            fullWidth
            label={t('CENTERS.UNIT_NAME')}
            id="outlined-size-normal"
            sx={{ mb: 1, mt: 2 }}
            value={centerName}
            onChange={handleTextFieldChange}
          /> */}
          {schema && uiSchema && (
            <DynamicForm
              schema={schema}
              uiSchema={uiSchema}
              onSubmit={handleSubmit}
              onChange={handleChange}
              onError={handleError}
              widgets={{}}
              showErrorList={true}
            />
          )}
          {/* <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            {t('CENTERS.NOTE')}
          </Typography>
          <Divider sx={{ mb: 2, mx: -2 }} />
          <Button
            variant="outlined"
            onClick={handleCreateButtonClick}
            sx={{
              width: '100%',
              border: 'none',
              backgroundColor: theme?.palette?.primary?.main,
              mb: 2,
            }}
          >
            {t('BLOCKS.CREATE')}
          </Button> */}
        </Box>
      </Fade>
    </Modal>
  );
};

export default CreateCenterModal;
