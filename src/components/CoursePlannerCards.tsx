import React from 'react';
import { Box, Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { CoursePlannerCardsProps } from '@/utils/Interfaces';
import { ResourcesType } from '@/utils/app.constant';
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


type FileType = {
  [key: string]: { name: string; imgPath: StaticImageData };
};

const myContentTypes: FileType = {
  'application/pdf': { name: "PDF", imgPath: pdf },
  'application/epub': { name: "EPUB", imgPath: epub },
  'application/html': { name: "HTML", imgPath: html },
  'video/mp4': { name: "Video", imgPath: mp4 },
  'application/vnd.sunbird.questionset': { name: "Question Set", imgPath: qml },
  'application/vnd.ekstep.h5p-archive': { name: 'H5P', imgPath: html },
  'video/x-youtube': { name: 'YouTube', imgPath: youtube },
  'video/youtube': { name: 'YouTube', imgPath: youtube },
};


const CoursePlannerCards: React.FC<CoursePlannerCardsProps> = ({
  resources, 
  type,
}) => {
  const theme = useTheme<any>();

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
              link: string;
              name?: string;
              appIcon?: string;
              identifier?: string;
              id?: string;
              mimeType: string; // Add this property
            },
            index: number

          ) => (
            <Grid item xs={6} md={4} lg={2} sx={{ mt: 2 }} key={index}>

              <Box className="facilitator-card">
                <Box sx={{ height: '204px', width: '100%', position: 'relative', borderRadius: '16px 16px 0 0', overflow: 'hidden' }}>
                  <Box
                    sx={{
                      backgroundImage: `url(${resource?.appIcon || '/decorationBg.png'})`,
                      backgroundPosition: 'center',
                      backgroundSize: 'cover',
                      height: '100%',
                      width: '100%',
                      cursor: 'pointer',
                    }}
                    onClick={() => router.push(`/play/content/${resource?.identifier || resource?.id}`)}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(0, 0, 0, 0.5) 100%)',
                      backgroundBlendMode: 'multiply',
                    }}

                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: '16px',
                      left: '16px',
                      right: '16px',
                      zIndex: 2,
                      color: 'white',
                    }}
                  >
                    <Box className="two-line-text" sx={{ fontSize: '16px', fontWeight: '500', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', color: "#FFFFFF" }}>
                      {resource?.name || 'Untitled Resource'}
                    </Box>



                  </Box>
                </Box>

                <Box sx={{ height: '40px', background: '#ECE6F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', borderRadius: '0px 0px 16px 16px' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Image
                      src={myContentTypes[resource.mimeType as keyof FileType]?.imgPath || placeholderImage}
                      alt="Content Thumbnail"
                      style={{ width: '20px', height: '20px', marginRight: '8px' }}
                    />
                    <span style={{ fontSize: '12px', color: '#1F1B13', fontWeight: "400  " }}>{myContentTypes[resource.mimeType as keyof FileType]?.name}</span>
                  </Box>
                  <Box>
                    <MoreVertIcon sx={{ color: '#1F1B13' }} />
                  </Box>
                </Box>
              </Box>


            </Grid>
          )
        )}
      </Grid>
    </Box>
  );
};

export default CoursePlannerCards;
