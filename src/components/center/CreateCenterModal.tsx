import { createCohort, getFormRead } from '@/services/CreateUserService';
import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Divider,
  Fade,
  IconButton,
  Modal,
  Radio,
  Typography,
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { IChangeEvent } from '@rjsf/core';
import { RJSFSchema } from '@rjsf/utils';
import { useTranslation } from 'next-i18next';
import React, { useEffect, useState } from 'react';
import DynamicForm from '../DynamicForm';
import { GenerateSchemaAndUiSchema } from '../GeneratedSchemas';
import { showToastMessage } from '../Toastify';
import FormButtons from '../FormButtons';

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
  const [formData, setFormData] = useState<any>();

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
    setTimeout(() => {
      setFormData(data.formData);
    });
  };

  useEffect(() => {
    if (formData) {
      handleButtonClick();
    }
  }, [formData]);

  const handleButtonClick = async () => {
    console.log('Form data:', formData);
    if (formData) {
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
          cohortDetails.customFields.push({
            fieldId: '6469c3ac-8c46-49d7-852a-00f9589737c5',
            value: ['MH'],
          });
          cohortDetails.customFields.push({
            fieldId: 'b61edfc6-3787-4079-86d3-37262bf23a9e',
            value: ['MUM'],
          });
          cohortDetails.customFields.push({
            fieldId: '4aab68ae-8382-43aa-a45a-e9b239319857',
            value: ['BOR'],
          });
        }
      });
      const cohortData = await createCohort(cohortDetails);
      if (cohortData) {
        showToastMessage(t('CENTERS.CENTER_CREATED'), 'success');
        onCenterAdded();
        handleClose();
      }
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

          {schema && uiSchema && (
            <DynamicForm
              schema={schema}
              uiSchema={uiSchema}
              onSubmit={handleSubmit}
              onChange={handleChange}
              onError={handleError}
              widgets={{}}
              showErrorList={true}
            >
              <FormButtons
                formData={formData}
                onClick={handleButtonClick}
                isCreateCentered={true}
                isCreatedFacilitator={false}
              />
            </DynamicForm>
          )}
        </Box>
      </Fade>
    </Modal>
  );
};

export default CreateCenterModal;
