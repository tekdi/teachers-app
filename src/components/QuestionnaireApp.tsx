import React, { useRef, useEffect, useState } from 'react';
import axios from 'axios';

import 'questionnaire-webcomponent/questionnaire-player-webcomponent.js';
import 'questionnaire-webcomponent/styles.css';
import mockData from "@/pages/data.json";



interface FileUploadEvent {
  data: {
    submissionId: string;
    name: string;
    file: File;
    question_id: string;
  };
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

const QuestionnaireApp: React.FC = () => {
  const questionairePlayerMainRef = useRef<HTMLElement | null>(null);
  console.log('questionairePlayerMainRef', questionairePlayerMainRef);
  const [fileUploadResponse, setFileUploadResponse] =
    useState<FileUploadResponse | null>(null);
  const assessment = mockData;
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
      console.log('obj', obj);
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
    console.log('event', event);

    if (event.data && event.data.file) {
      console.log('hello');
      uploadFileToPresignedUrl(event as FileUploadEvent);
    }
  };


  useEffect(() => {
    console.log('questionairePlayerMainRef', assessment);
  });

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
        console.log('playerElement', playerElement);
        const handlePlayerSubmitOrSaveEvent = (event: Event) => {
          console.log(
            'Event Data Logged from the react app',
            (event as CustomEvent).detail
          );
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
  }, []);
  useEffect(() => {
    if (questionairePlayerMainRef.current) {
      console.log('Web component ref set correctly');
    } else {
      console.log('Web component ref not set');
    }
  }, [questionairePlayerMainRef]);

  return (
    <>
      <questionnaire-player-main
        assessment={JSON.stringify(assessment)}
        fileuploadresponse={JSON.stringify(fileUploadResponse)}
        ref={questionairePlayerMainRef}
      ></questionnaire-player-main>
    </>
  );
};

export default QuestionnaireApp;
