import { useFormRead } from '@/hooks/useFormRead';
import { createCohort } from '@/services/CreateUserService';
import useSubmittedButtonStore from '@/store/useSubmittedButtonStore';
import { FormContext, FormContextType, QueryKeys, Telemetry } from '@/utils/app.constant';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { IChangeEvent } from '@rjsf/core';
import { RJSFSchema } from '@rjsf/utils';
import { useTranslation } from 'next-i18next';
import React, { useEffect, useState } from 'react';
import DynamicForm from '../DynamicForm';
import FormButtons from '../FormButtons';
import { GenerateSchemaAndUiSchema } from '../GeneratedSchemas';
import Loader from '../Loader';
import SimpleModal from '../SimpleModal';
import { showToastMessage } from '../Toastify';
import FrameworkCategories from './FrameworkCategories';
import { telemetryFactory } from '@/utils/telemetry';
import { useQueryClient } from '@tanstack/react-query';
import { getCohortList } from '@/services/CohortServices';
import useStore from '@/store/store';
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
interface ChildData {
  cohortId: string;
  name: string;
  parentId: string;
  type: string;
  customField: any[];
  childData: ChildData[];
  status?: string;
}
interface NameTypePair {
  cohortId: string;
  name: string;
  cohortType: string;
  status?: string;
}
const CreateCenterModal: React.FC<CreateBlockModalProps> = ({
  open,
  handleClose,
  onCenterAdded,
}) => {
  const { t } = useTranslation();
  const [schema, setSchema] = React.useState<any>();
  const [uiSchema, setUiSchema] = React.useState<any>();
  const [formData, setFormData] = useState<any>();
  const [showForm, setShowForm] = useState(false);
  const [isHiddenFieldPresent, setIsHiddenFieldPresent] = useState(false);
  const queryClient = useQueryClient();
  const setCohorts = useStore((state) => state.setCohorts);

  const { data: formResponse, isPending } = useFormRead(
    FormContext.COHORTS,
    FormContextType.COHORT
  );
  const [customFormData, setCustomFormData] = useState<any>();
  const setSubmittedButtonStatus = useSubmittedButtonStore(
    (state: any) => state.setSubmittedButtonStatus
  );
  function removeHiddenFields(formResponse: any) {
    return {
      ...formResponse,
      fields: formResponse.fields.filter((field: any) => !field.isHidden),
    };
  }
  useEffect(() => {
    if (formResponse) {
      const updatedFormResponse = removeHiddenFields(formResponse);
      if (updatedFormResponse) {
        const { schema, uiSchema } = GenerateSchemaAndUiSchema(
          updatedFormResponse,
          t
        );
        setSchema(schema);
        setUiSchema(uiSchema);
        setCustomFormData(formResponse);
        const isAnyFieldHidden = formResponse.fields.some(
          (field: { isHidden: boolean }) => field.isHidden === true
        );
        setIsHiddenFieldPresent(isAnyFieldHidden);
      }
    }
  }, [formResponse]);
  const handleDependentFieldsChange = () => {
    setShowForm(true);
  };
  const handleSubmit = async (
    data: IChangeEvent<any, RJSFSchema, any>,
    event: React.FormEvent<any>
  ) => {
    setTimeout(() => {
      setFormData(data.formData);
    });
  };
  const extractNamesAndCohortTypes = (
    data: ChildData[]
  ): NameTypePair[] => {
    const nameTypePairs: NameTypePair[] = [];
    const recursiveExtract = (items: ChildData[]) => {
      items.forEach((item) => {
        const cohortType =
          item?.customField?.find(
            (field) => field?.label === 'TYPE_OF_COHORT'
          )?.value || 'Unknown';
        if (item?.cohortId && item?.name) {
          nameTypePairs.push({
            cohortId: item?.cohortId,
            name: item?.name,
            status: item?.status,
            cohortType,
          });
        }
        if (item?.childData && item?.childData?.length > 0) {
          recursiveExtract(item?.childData);
        }
      });
    };
    recursiveExtract(data);
    return nameTypePairs;
  };

  useEffect(() => {
    if (formData) {
      handleButtonClick();
    }
  }, [formData]);
  const handleButtonClick = async () => {
    setSubmittedButtonStatus(true);
    if (formData) {
      const parentId = localStorage.getItem('blockParentId');
      const cohortDetails: CohortDetails = {
        name: (formData.name).toLowerCase(),
        type: 'COHORT',
        parentId: parentId,
        customFields: [],
      };
      if (typeof window !== 'undefined' && window.localStorage) {
        const fieldData = JSON.parse(localStorage.getItem('fieldData') ?? '');
        const bmgsData = JSON.parse(localStorage.getItem('BMGSData') ?? '');
        Object.entries(formData).forEach(([fieldKey]) => {
          const fieldSchema = schema.properties[fieldKey];
          const fieldId = fieldSchema?.fieldId;
          if (fieldId !== null) {
            cohortDetails.customFields.push({
              fieldId: fieldId,
              value: formData.cohort_type,
            });
            cohortDetails.customFields.push({
              fieldId: fieldData?.state?.stateId,
              value: [fieldData?.state?.stateCode],
            });
            cohortDetails.customFields.push({
              fieldId: fieldData?.state?.districtId,
              value: [fieldData?.state?.districtCode],
            });
            cohortDetails.customFields.push({
              fieldId: fieldData?.state?.blockId,
              value: [fieldData?.state?.blockCode],
            });
          }
          if (bmgsData) {
            cohortDetails.customFields.push({
              fieldId: bmgsData.board.fieldId,
              value: bmgsData.board.boardName,
            });
            cohortDetails.customFields.push({
              fieldId: bmgsData.medium.fieldId,
              value: bmgsData.medium.mediumName,
            });
            cohortDetails.customFields.push({
              fieldId: bmgsData.grade.fieldId,
              value: bmgsData.grade.gradeName,
            });
          }
        });
      }
      cohortDetails.customFields = Array.from(
        new Map(
          cohortDetails.customFields.map((item) => [item.fieldId, item])
        ).values()
      );
      const cohortData = await createCohort(cohortDetails);
      if (cohortData?.hasOwnProperty('cohortId')) {
        showToastMessage(t('CENTERS.CENTER_CREATED'), 'success');
        const storedUserId = localStorage.getItem('userId');
        const userId = storedUserId ? storedUserId : '';

        queryClient.invalidateQueries({
          queryKey: [QueryKeys.MY_COHORTS, userId],
        });
        const myCohortList = await queryClient.fetchQuery({
          queryKey: [QueryKeys.MY_COHORTS, userId],
          queryFn: () => getCohortList(userId as string, { customField: 'true' }),
        });
        if (myCohortList?.length > 0) {
          const nameTypePairs = extractNamesAndCohortTypes(myCohortList);
          setCohorts(nameTypePairs);
        }
        const telemetryInteract = {
          context: {
            env: 'teaching-center',
            cdata: [],
          },
          edata: {
            id: 'create-center-successfully',
            type: Telemetry.CLICK,
            subtype: '',
            pageid: 'centers',
          },
        };
        telemetryFactory.interact(telemetryInteract);

        onCenterAdded();
        handleClose();
        localStorage.removeItem('BMGSData');
      } else {
        showToastMessage(t('CENTERS.DUPLICATE_CENTER'), 'error');
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

  const renderDynamicForm = () => (
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
  );

  return (
    <SimpleModal
      open={open}
      onClose={handleClose}
      showFooter={false}
      modalTitle={t('CENTERS.NEW_CENTER')}
    >
      {isPending && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: '20px',
          }}
        >
          <Loader showBackdrop={false} loadingText={t('COMMON.LOADING')} />
        </Box>
      )}
      {!isPending && schema && uiSchema && (
        <>
          {isHiddenFieldPresent ? (
            <>
              <FrameworkCategories
                customFormData={customFormData}
                onFieldsChange={handleDependentFieldsChange}
                setShowForm={setShowForm}
              />
              {showForm && renderDynamicForm()}
            </>
          ) : (
            renderDynamicForm()
          )}
        </>
      )}
    </SimpleModal>
  );
};
export default CreateCenterModal;
