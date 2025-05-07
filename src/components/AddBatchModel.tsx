import DynamicForm from '@/components/DynamicForm';
import {
  GenerateSchemaAndUiSchema,
  customFields,
} from '@/components/GeneratedSchemas';
import SimpleModal from '@/components/SimpleModal';
import { createCohort } from '@/services/CreateUserService';
import {
  CohortTypes,
  FormContextType,
  TelemetryEventType,
  apiCatchingDuration,
} from '@/utils/app.constant';
import { telemetryFactory } from '@/utils/telemetry';
import { useLocationState } from '@/utils/UseLocation';
import useSubmittedButtonStore from '@/store/useSubmittedButtonStore';
import { Box, Button, Typography, MenuItem, Select } from '@mui/material';
import { IChangeEvent } from '@rjsf/core';
import { RJSFSchema } from '@rjsf/utils';
import { useQuery } from '@tanstack/react-query';
import { i18n, useTranslation } from 'next-i18next';
import React, { useEffect, useState } from 'react';
import { transformArray } from '../utils/Helper';
import AreaSelection from './AreaSelection';
import { showToastMessage } from './Toastify';
import { SelectChangeEvent } from '@mui/material';
import { getCohortList } from '@/services/CohortServices';
import FormButtons from './FormButtons';

interface CustomField {
  fieldId: string;
  value: string[] | any;
}

interface CohortDetails {
  name?: string;
  type?: string;
  parentId?: string | null;
  customFields?: CustomField[];
}
interface AddLearnerModalProps {
  open: boolean;
  onClose: () => void;
  formData?: object;
  isEditModal?: boolean;
  userId?: string;
}
interface FieldProp {
  value: string;
  label: string;
}
const AddNewBatch: React.FC<AddLearnerModalProps> = ({
  open,
  onClose,
  formData,
  isEditModal = false,
  userId,
}) => {
  const [schema, setSchema] = React.useState<any>();
  const [uiSchema, setUiSchema] = React.useState<any>();
  const [openAddNewCohort, setOpenAddNewCohort] =
    React.useState<boolean>(false);
  const [showForm, setShowForm] = useState(false);
  const [customFormData, setCustomFormData] = useState<any>();
  const [startMonth, setStartMonth] = useState<string>('');
  const [endMonth, setEndMonth] = useState<string>('');
  const [startYear, setStartYear] = useState<string>('');
  const [endYear, setEndYear] = useState<string>('');
  const [additionalText, setAdditionalText] = useState<string>(''); // New state for user input
  const [isCenterAdmin, setIsCenterAdmin] = useState(true);
  const [myCohort, setMyCohorts] = useState<any>([]);

  // const [customFormData, setCustomFormData] = useState<any>({});
  const [batchName, setBatchName] = useState<string>('');
  const months = [
    { label: 'January', value: 'Jan' },
    { label: 'February', value: 'Feb' },
    { label: 'March', value: 'Mar' },
    { label: 'April', value: 'Apr' },
    { label: 'May', value: 'May' },
    { label: 'June', value: 'Jun' },
    { label: 'July', value: 'Jul' },
    { label: 'August', value: 'Aug' },
    { label: 'September', value: 'Sep' },
    { label: 'October', value: 'Oct' },
    { label: 'November', value: 'Nov' },
    { label: 'December', value: 'Dec' },
  ];

  const { t } = useTranslation();
  const roleType = FormContextType.ADMIN_CENTER;
  const {
    country,
    states,
    districts,
    blocks,
    allCenters,
    isMobile,
    isMediumScreen,
    selectedState,
    selectedStateCode,
    selectedDistrict,
    selectedDistrictCode,
    selectedCenter,
    dynamicForm,
    selectedBlock,
    selectedBlockCode,
    selectedCenterId,
    handleCountryChangeWrapper,
    handleStateChangeWrapper,
    handleBlockChangeWrapper,
    handleCenterChangeWrapper,
    selectedCenterCode,
    selectedBlockCohortId,
    blockFieldId,
    districtFieldId,
    stateFieldId,
    centerFieldId,
    dynamicFormForBlock,
    stateDefaultValue,
    assignedTeamLeader,
    assignedTeamLeaderNames,
    selectedStateCohortId,
  } = useLocationState(open, onClose, roleType);
  const setSubmittedButtonStatus = useSubmittedButtonStore(
    (state: any) => state.setSubmittedButtonStatus
  );

  const {
    data: batchFormData,
    isLoading: batchFormDataLoading,
    error: batchFormDataError,
  } = useQuery<any[]>({
    queryKey: ['batchFormData'],
    queryFn: () => Promise.resolve([]),
    staleTime: apiCatchingDuration.GETREADFORM,
    enabled: false,
  });
  const [stateDefaultValueForCenter, setStateDefaultValueForCenter] =
    useState<string>('');
  const createCenterStatus = useSubmittedButtonStore(
    (state: any) => state.createCenterStatus
  );
  const setCreateCenterStatus = useSubmittedButtonStore(
    (state: any) => state.setCreateCenterStatus
  );
  function removeHiddenFields(formResponse: any) {
    return {
      ...formResponse,
      fields: formResponse.fields.filter((field: any) => !field.isHidden),
    };
  }

  useEffect(() => {
    if (!open) {
      setShowForm(false);
    } else {
      setShowForm(true);
    }
  }, [onClose, open]);
  useEffect(() => {
    const getAddLearnerFormData = async () => {
      const admin = localStorage.getItem('adminInfo');
      if (admin) {
        const stateField = JSON.parse(admin).customFields?.find(
          (field: any) => field.label === 'STATES'
        );
        if (!stateField?.value.includes(',')) {
          setStateDefaultValueForCenter(stateField?.value);
        } else {
          setStateDefaultValueForCenter(t('COMMON.ALL_STATES'));
        }
      }
      try {
        if (batchFormData) {
          const updatedFormResponse = removeHiddenFields(batchFormData);
          if (updatedFormResponse) {
            const { schema, uiSchema } = GenerateSchemaAndUiSchema(
              updatedFormResponse,
              t
            );
            uiSchema.name = {
              'ui:readonly': true,
            };
            setSchema(schema);
            setUiSchema(uiSchema);
            setCustomFormData(batchFormData);
          }
        }
      } catch (error) {
        console.error('Error fetching form data:', error);
      }
    };
    getAddLearnerFormData();
  }, [batchFormData, i18n?.language]);

  const handleDependentFieldsChange = () => {
    setShowForm(true);
  };

  const handleSubmit = async (
    data: IChangeEvent<any, RJSFSchema, any>,
    event: React.FormEvent<any>
  ) => {
    console.log('Form data submitted:', data);

    const formData = data?.formData;
    const name = formData.name.toLowerCase();
    const fieldId = '94befdc4-3173-4af3-998f-aa366d91ade7';

    const newEntity = {
      isCreate: true,
      options: [
        {
          controllingfieldfk: selectedBlockCode,
          name,
          // value,
        },
      ],
    };
    const centerCohortId = (() => {
      const storedValue = localStorage?.getItem('centerCohortId');
      if (storedValue) {
        return storedValue;
      } else {
        console.warn('centerCohortId not found in localStorage');
        return null;
      }
    })();

    const parentId = centerCohortId || '';
    const cohortDetails: CohortDetails = {
      name: formData.name.toLowerCase(),
      type: CohortTypes.BATCH,
      parentId: parentId,
      customFields: [
        {
          fieldId: stateFieldId,
          value: [selectedStateCode],
        },
        {
          fieldId: districtFieldId,
          value: [selectedDistrictCode],
        },
        {
          fieldId: blockFieldId,
          value: [selectedBlockCode],
        },
      ],
    };

    Object.entries(formData).forEach(([fieldKey, fieldValue]) => {
      const fieldSchema = schema?.properties[fieldKey];
      const fieldId = fieldSchema?.fieldId;

      if (fieldId && fieldValue !== undefined && fieldValue !== null) {
        cohortDetails?.customFields?.push({
          fieldId: fieldId,
          value: Array.isArray(fieldValue) ? fieldValue : [fieldValue], // Ensure value is an array
        });
      }
    });

    if (
      cohortDetails?.customFields &&
      cohortDetails?.customFields?.length > 0 &&
      cohortDetails?.name
    ) {
      cohortDetails.customFields = Array.from(
        new Map(
          cohortDetails.customFields.map((item) => [item.fieldId, item])
        ).values()
      );

      const cohortData = await createCohort(cohortDetails);
      if (cohortData) {
        showToastMessage(t('BATCHES.BATCH_CREATED'), 'success');
        setStartMonth('');
        setStartYear('');
        setStartMonth('');
        setEndYear('');
        setBatchName('');
        setAdditionalText('');
        setCustomFormData('');
        const windowUrl = window.location.pathname;
        const cleanedUrl = windowUrl.replace(/^\//, '');
        const env = cleanedUrl.split('/')[0];

        const telemetryInteract = {
          context: {
            env: env,
            cdata: [],
          },
          edata: {
            id: 'center-created-successfully',
            type: TelemetryEventType.CLICK,
            subtype: '',
            pageid: cleanedUrl,
          },
        };
        telemetryFactory.interact(telemetryInteract);

        // createCenterStatus
        //   ? setCreateCenterStatus(false)
        //   : setCreateCenterStatus(true);
        setOpenAddNewCohort(false);
        onClose();
        localStorage.removeItem('BMGSData');
      }
    } else {
      showToastMessage('Please Input Data', 'warning');
    }

    onClose();
  };

  // const handleChangeForm = (event: IChangeEvent<any>) => {
  //   console.log("Form data changed:", event.formData);
  // };

  const handleError = () => {
    console.log('error');
  };

  //   useEffect(() => {
  //     if (typeof window !== 'undefined' && window.localStorage) {
  //       const adminInfo = JSON.parse(localStorage?.getItem('adminInfo') || '{}');
  //       setIsCenterAdmin(adminInfo?.role === 'Center Admin');
  //     }
  //   }, []);

  useEffect(() => {
    if (isCenterAdmin) {
      if (typeof window !== 'undefined' && window.localStorage) {
        const userId = localStorage.getItem('userId');
        if (userId) {
          const getMyCohortList = async () => {
            const response = await getCohortList(userId);

            const extractCohorts = (data: any[]): any[] => {
              let cohorts: any[] = [];
              data.forEach((item) => {
                if (item.type === 'CENTER') {
                  cohorts.push(item);
                }
                if (item.childData && item.childData.length > 0) {
                  cohorts = cohorts.concat(extractCohorts(item.childData));
                }
              });
              return cohorts;
            };

            const cohortList = extractCohorts(response);
            const cohortNames = cohortList.map((cohort) => cohort.cohortName);
            localStorage.setItem('adminCohort', cohortList[0].cohortId);
            setMyCohorts(cohortNames);
          };
          getMyCohortList();
        }
      }
    }
  }, [isCenterAdmin]);

  const years = Array.from(
    { length: 5 },
    (_, i) => new Date().getFullYear() + i
  ).map((year) => ({ label: year.toString(), value: year.toString() }));

  const handleStartMonthChange = (event: SelectChangeEvent<string>) => {
    const selectedMonth = event.target.value;
    setStartMonth(selectedMonth);

    // Revalidate the batch name
    if (endMonth && startYear && endYear) {
      const startIndex = months.findIndex((m) => m.value === selectedMonth);
      const endIndex = months.findIndex((m) => m.value === endMonth);

      if (startYear === endYear && endIndex <= startIndex) {
        alert('End month must be after the start month.');
        return;
      }
      validateAndSetBatchName(selectedMonth, endMonth, startYear, endYear);
    }
  };

  const handleStartYearChange = (event: SelectChangeEvent<string>) => {
    const selectedYear = event.target.value;
    setStartYear(selectedYear);

    // Revalidate the batch name
    if (startMonth && endMonth && endYear) {
      const startIndex = months.findIndex((m) => m.value === startMonth);
      const endIndex = months.findIndex((m) => m.value === endMonth);

      if (
        selectedYear > endYear ||
        (selectedYear === endYear && endIndex <= startIndex) // If same year, end month must be after start month
      ) {
        alert('End date must be after the start date.');
        return;
      }
      validateAndSetBatchName(startMonth, endMonth, selectedYear, endYear);
    }
  };

  const handleEndMonthChange = (event: SelectChangeEvent<string>) => {
    const selectedMonth = event.target.value;

    // Validate end month
    if (startMonth && startYear && endYear) {
      const startIndex = months.findIndex((m) => m.value === startMonth);
      const endIndex = months.findIndex((m) => m.value === selectedMonth);

      if (startYear === endYear && endIndex <= startIndex) {
        alert('End month must be after the start month.');
        return;
      }
    }

    setEndMonth(selectedMonth);

    if (startMonth && startYear && endYear) {
      validateAndSetBatchName(startMonth, selectedMonth, startYear, endYear);
    }
  };

  const handleEndYearChange = (event: SelectChangeEvent<string>) => {
    const selectedYear = event.target.value;

    // Validate end year
    if (startYear && startMonth && endMonth) {
      const startIndex = months.findIndex((m) => m.value === startMonth);
      const endIndex = months.findIndex((m) => m.value === endMonth);

      if (
        selectedYear < startYear ||
        (selectedYear === startYear && endIndex <= startIndex)
      ) {
        alert('End date must be after the start date.');
        return;
      }
    }

    setEndYear(selectedYear);

    if (startMonth && endMonth && startYear) {
      validateAndSetBatchName(startMonth, endMonth, startYear, selectedYear);
    }
  };

  const validateAndSetBatchName = (
    startMonth: string,
    endMonth: string,
    startYear: string,
    endYear: string
  ) => {
    const centerPrefix = isCenterAdmin
      ? myCohort[0]
      : selectedCenter?.[0] || '';
    const batchName =
      `${centerPrefix} ${startMonth} ${startYear} - ${endMonth} ${endYear} ${additionalText}`.trim();

    setBatchName(batchName);
    setCustomFormData((prevData: any) => ({
      ...prevData,
      name: batchName,
    }));
  };

  const handleAdditionalTextChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const text = event.target.value;
    setAdditionalText(text);
    const centerPrefix = selectedCenter?.[0] || '';

    setBatchName(
      `${centerPrefix} ${startMonth} ${startYear} - ${endMonth} ${endYear} ${text}`
    );
    setCustomFormData((prevData: any) => ({
      ...prevData,
      name: `${centerPrefix} ${startMonth} ${startYear} - ${endMonth} ${endYear} ${text}`,
    }));
  };

  const handleChangeForm = (event: IChangeEvent<any>) => {
    // Update the form data when the user interacts with the form
    setCustomFormData(event.formData);
  };

  const handleSubmitData = async () => {};

  return (
    <SimpleModal
      open={open}
      onClose={onClose}
      showFooter={false}
      modalTitle={t('BATCHES.NEW_BATCHES')}
    >
      <>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            marginTop: '10px',
          }}
        >
          <AreaSelection
            country={transformArray(country)}
            states={transformArray(states)}
            districts={transformArray(districts)}
            blocks={transformArray(blocks)}
            selectedState={selectedState}
            selectedDistrict={selectedDistrict}
            selectedBlock={selectedBlock}
            handleCountryChangeWrapper={handleCountryChangeWrapper}
            handleStateChangeWrapper={handleStateChangeWrapper}
            handleBlockChangeWrapper={handleBlockChangeWrapper}
            isMobile={isMobile}
            isMediumScreen={isMediumScreen}
            iscenterCreate={false}
            allCenters={allCenters}
            selectedCenter={selectedCenter}
            handleCenterChangeWrapper={handleCenterChangeWrapper}
            inModal={true}
            stateDefaultValue={stateDefaultValue}
          />
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            marginTop: '10px',
          }}
        >
          <Typography variant="h6">Select Months and Years</Typography>
          <Box sx={{ display: 'flex', gap: '16px' }}>
            <Select
              value={startMonth}
              onChange={handleStartMonthChange}
              displayEmpty
              fullWidth
            >
              <MenuItem value="" disabled>
                Select Start Month
              </MenuItem>
              {months.map((month) => (
                <MenuItem key={month.value} value={month.value}>
                  {month.label}
                </MenuItem>
              ))}
            </Select>
            <Select
              value={startYear}
              onChange={handleStartYearChange}
              displayEmpty
              fullWidth
            >
              <MenuItem value="" disabled>
                Select Start Year
              </MenuItem>
              {years.map((year) => (
                <MenuItem key={year.value} value={year.value}>
                  {year.label}
                </MenuItem>
              ))}
            </Select>
          </Box>
          <Box sx={{ display: 'flex', gap: '16px' }}>
            <Select
              value={endMonth}
              onChange={handleEndMonthChange}
              displayEmpty
              fullWidth
            >
              <MenuItem value="" disabled>
                Select End Month
              </MenuItem>
              {months.map((month) => (
                <MenuItem key={month.value} value={month.value}>
                  {month.label}
                </MenuItem>
              ))}
            </Select>
            <Select
              value={endYear}
              onChange={handleEndYearChange}
              displayEmpty
              fullWidth
            >
              <MenuItem value="" disabled>
                Select End Year
              </MenuItem>
              {years.map((year) => (
                <MenuItem key={year.value} value={year.value}>
                  {year.label}
                </MenuItem>
              ))}
            </Select>
          </Box>
          <Box sx={{ marginTop: '16px' }}>
            <Typography variant="body2">
              Add Additional Text to Batch Name:
            </Typography>
            <input
              type="text"
              value={additionalText}
              onChange={handleAdditionalTextChange}
              placeholder="Enter additional text"
              style={{
                width: '100%',
                padding: '17px',
                marginTop: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px',
              }}
            />
          </Box>
          {/* <Typography variant="body1">
            Batch Name: <strong>{batchName || "N/A"}</strong>
          </Typography> */}
        </Box>
        {/* <FrameworkCategories
          customFormData={customFormData}
          onFieldsChange={handleDependentFieldsChange}
          setShowForm={setShowForm}
        /> */}
      </>
      {dynamicFormForBlock && schema && uiSchema && (
        <>
          {showForm ? (
            <DynamicForm
              schema={schema}
              uiSchema={uiSchema}
              onSubmit={handleSubmit}
              onChange={handleChangeForm}
              formData={customFormData}
              onError={handleError}
              widgets={{}}
              showErrorList={true}
              customFields={customFields}
              //   id="new-center-form"
            >
              <FormButtons
                formData={formData}
                onClick={handleSubmitData}
                isSingleButton={!!formData}
                actions={formData}
                isCreatedLearner={!formData}
              />
            </DynamicForm>
          ) : null}
        </>
      )}
      {!selectedBlockCohortId && selectedBlockCohortId !== '' && (
        <Box mt={3} textAlign={'center'}>
          <Typography color={'error'}>
            {t('COMMON.SOMETHING_WENT_WRONG')}
          </Typography>
        </Box>
      )}
    </SimpleModal>
  );
};

export default AddNewBatch;
