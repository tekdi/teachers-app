import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';

import { updateSubmission } from '@/services/ObservationServices';
import KeyboardBackspaceOutlinedIcon from '@mui/icons-material/KeyboardBackspaceOutlined';
import { Box, Typography, useTheme } from '@mui/material';
import { useRouter } from 'next/router';
import 'questionnaire-webcomponent/questionnaire-player-webcomponent.js';
import 'questionnaire-webcomponent/styles.css';
import { useTranslation } from 'react-i18next';
import ConfirmationModal from '../ConfirmationModal';
import { showToastMessage } from '../Toastify';



interface FileUploadEvent {
  data: {
    submissionId: string;
    name: string;
    file: File;
    question_id: string;
  };
}
interface QuestionnaireAppProps {
  observationQuestions: any; // Define the correct type here based on your data structure
  observationName: any
}
interface PresignedUrlResponse {
  url: string;
  getDownloadableUrl: string[];
  payload: Record<string, string>;
}

interface FileUploadResponse {
  status?: number;
  data?: FileUploadData | null;
  question_id?: string;
}

interface FileUploadData {
  name: string;
  url: string;
  previewUrl: string;
  [key: string]: any;
}

const ObservationComponent: React.FC<QuestionnaireAppProps> = ({ observationQuestions,observationName }) => {
  const questionairePlayerMainRef = useRef<HTMLElement | null>(null);

  const [fileUploadResponse, setFileUploadResponse] =
    useState<FileUploadResponse | null>(null);
  const { t } = useTranslation();
  const router = useRouter();
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

  const [currentEvent, setCurrentEvent] = useState<CustomEvent | null>(null); 
  const theme = useTheme<any>();

  const uploadFileToPresignedUrl = async (event: FileUploadEvent) => {
    const payload: any = {
      ref: 'survey',
      request: {},
    };

    const submissionId = event.data.submissionId;
    payload.request[submissionId] = {
      files: [event.data.name],
    };

    try {
      const response = await axios.post('your-presigned-url-endpoint', payload); // Update with your correct endpoint

      const presignedUrlData: PresignedUrlResponse =
        response.data.result[submissionId].files[0];

      // Use FormData for file uploads
      const formData = new FormData();
      formData.append('file', event.data.file);

      await axios.put(presignedUrlData.url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const obj: FileUploadData = {
        name: event.data.name,
        url: presignedUrlData.url.split('?')[0],
        previewUrl: presignedUrlData.getDownloadableUrl[0],
      };

      for (const key of Object.keys(presignedUrlData.payload)) {
        obj[key] = presignedUrlData.payload[key];
      }
      setFileUploadResponse({
        status: 200,
        data: obj,
        question_id: event.data.question_id,
      });
    } catch (err) {
      console.error('Unable to upload the file. Please try again', err);
      setFileUploadResponse({
        status: 400,
        data: null,
        question_id: event.data.question_id,
      });
    }
  };

  const receiveUploadData = (event: any) => {
 

    if (event.data && event.data.file) {
     
      uploadFileToPresignedUrl(event as FileUploadEvent);
    }
  };


  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('message', receiveUploadData, false);

      return () => {
        window.removeEventListener('message', receiveUploadData, false);
      };
    }

  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const playerElement = questionairePlayerMainRef.current;

      if (playerElement) {
               const handlePlayerSubmitOrSaveEvent = async (event: Event) => {
          if ((event as CustomEvent).detail.status === "submit") {
            setCurrentEvent(event as CustomEvent);
            setIsConfirmationOpen(true);
          } else {
            await handleSaveSubmit(event);
          }
        };

        const handleSaveSubmit = async (event: Event) => {
          const submissionData = { evidence: { status: (event as CustomEvent).detail.status, ...(event as CustomEvent).detail.data } };
          const submissionId = observationQuestions?.assessment?.submissionId;
          const response = await updateSubmission({ submissionId, submissionData });
          showToastMessage(t('OBSERVATION.FORM_SAVED_SUCCESSFULLY'), 'success');
        };
      
     
      

        playerElement.addEventListener(
          'submitOrSaveEvent',
          handlePlayerSubmitOrSaveEvent
        );

        return () => {
          playerElement.removeEventListener(
            'submitOrSaveEvent',
            handlePlayerSubmitOrSaveEvent
          );
        };
      }
    }
  }, [observationQuestions]);
  const handleConfirmSubmit = async () => {
    if (currentEvent) {
      const submissionData = { evidence: { status: currentEvent.detail.status, ...(currentEvent.detail.data) } };
      const submissionId = observationQuestions?.assessment?.submissionId;
      const response = await updateSubmission({ submissionId, submissionData });
      if (currentEvent.detail.status === "draft") {
        showToastMessage(t('OBSERVATION.FORM_SAVED_SUCCESSFULLY'), 'success');
      } else if (currentEvent.detail.status === "submit") {
        showToastMessage(t('OBSERVATION.FORM_SUBMIT_SUCCESSFULLY'), 'success');
        router.push(`${localStorage.getItem('observationPath')}`);
      }
    }
    setIsConfirmationOpen(false);
  };
  useEffect(() => {
    if (questionairePlayerMainRef.current) {
      console.log('Web component ref set correctly');
    } else {
      console.log('Web component ref not set');
    }
  }, [questionairePlayerMainRef]);
  const handleBackEvent = () => {
   // setIsBackConfirmationOpen(true);
  //  router.back();
  //  const shouldGoBack = window.confirm("Do you want to go back?");

  // // If "OK" is clicked, go back
  // if (shouldGoBack) {
  //   window.history.back();
  // } else {
  //   // Do nothing if "Cancel" is clicked
  //   console.log("User chose not to go back");
  // }
  router.push(
    `${localStorage.getItem('observationPath')}`
  );
  };
  
  // const handleCancelBack = () => {
  //   setIsBackConfirmationOpen(false);
  // };
 
  // const handleConfirmBack = () => {
  //   setIsBackConfirmationOpen(false);
  //   router.back();
  // };
   
  return (
    <>
      <Box
        sx={{
          display: 'flex',
          direction: 'row',
          gap: '24px',
          mt: '15px',
          marginLeft: '10px',
        }}
        width={'100%'}
        onClick={handleBackEvent}
      >
        <KeyboardBackspaceOutlinedIcon
          cursor={'pointer'}
          sx={{
            color: theme.palette.warning['A200'],
          }}
        />
        {localStorage.getItem('observationName') && (
        <Typography variant="h3"                   fontSize={'22px'}
         color={'black'}>
          {localStorage.getItem('observationName')}
          
        </Typography>
      )}
      </Box>

     
       <Typography variant="h3"    ml="60px" color={'black'}>
          {observationName}
        </Typography>

      {observationQuestions && (
        <questionnaire-player-main
          assessment={JSON.stringify(observationQuestions)}
          fileuploadresponse={JSON.stringify(fileUploadResponse)}
          ref={questionairePlayerMainRef}
        ></questionnaire-player-main>
      )}

<ConfirmationModal
        message={"Are you sure to submit the form?"}
        handleAction={handleConfirmSubmit}
        buttonNames={{
          primary: t('submit'),
          secondary: t('COMMON.CANCEL'),
        }}
        handleCloseModal={() => setIsConfirmationOpen(false)}
        modalOpen={isConfirmationOpen}
      />

{/* <ConfirmationModal
  message={"Are you sure you want to go back?"}
  handleAction={handleConfirmBack}
  buttonNames={{
    primary: t('COMMON.YES'),
    secondary: t('NO'),
  }}
  handleCloseModal={handleCancelBack}
  modalOpen={isBackConfirmationOpen}
/> */}
    </>
  );
};

export default ObservationComponent;
