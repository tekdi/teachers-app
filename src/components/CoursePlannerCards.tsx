import React from 'react';
import { Box, Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { CoursePlannerCardsProps } from '@/utils/Interfaces';
import { ContentType, FileType, myContentTypes, ResourcesType } from '@/utils/app.constant';
import router from 'next/router';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Image, { StaticImageData } from 'next/image';
import placeholderImage from '../assets/images/decorationBg.png';
import pdf from '../assets/images/PDF.png';
import epub from '../assets/images/Epub.png';
import html from '../assets/images/HTML.png';
import qml from '../assets/images/Qml.png';
import mp4 from '../assets/images/MP4.png';
import youtube from '../assets/images/youtube.png';
import ContentCard from './ContentCard';


// type FileType = {
//   [key: string]: { name: string; imgPath: StaticImageData };
// };

// const myContentTypes: FileType = {
//   'application/pdf': { name: "PDF", imgPath: pdf },
//   'application/epub': { name: "EPUB", imgPath: epub },
//   'application/html': { name: "HTML", imgPath: html },
//   'video/mp4': { name: "Video", imgPath: mp4 },
//   'application/vnd.sunbird.questionset': { name: "Question Set", imgPath: qml },
//   'application/vnd.ekstep.h5p-archive': { name: 'H5P', imgPath: html },
//   'video/x-youtube': { name: 'YouTube', imgPath: youtube },
//   'video/youtube': { name: 'YouTube', imgPath: youtube },
// };


const CoursePlannerCards: React.FC<CoursePlannerCardsProps> = ({
  resources,
  type,
}) => {
  const theme = useTheme<any>();
  // const fileType = ContentType.PDF; // Select a content type
  // const fileDetails = myContentTypes[fileType]; // Retrieve details for the type


  // Filter the resources based on the type
  const filteredResources = resources?.filter(
    (resource: { type?: string }) =>
      (type === ResourcesType.NONE && !resource.type) || resource.type === type
  );


  return (
    <Box>
      <Grid
        container
        spacing={2}
        sx={{ px: '16px !important', cursor: 'pointer' }}
      >
        {filteredResources?.map(
          (
            resource: {
              resourceType: string;
              link: string;
              name: string;
              appIcon: string;
              identifier: string;
              id: string;
              mimeType: string; // Add this property
            },
            index: number

          ) => (
            <Grid item xs={6} md={4} lg={2} sx={{ mt: 2 }} key={index}>
              

              <ContentCard name={resource?.name} identifier={resource?.identifier || resource?.id} mimeType={resource?.mimeType} appIcon={resource?.appIcon} resourceType={resource?.resourceType} />


            </Grid>
          )
        )}
      </Grid>
    </Box>
  );
};

export default CoursePlannerCards;
