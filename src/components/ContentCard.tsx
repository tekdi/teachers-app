import { Box, LinearProgress, Tooltip, Typography } from '@mui/material';
import Image from 'next/image';
import placeholderImage from '../assets/images/decorationBg.png';
import { FileType, ContentCardsTypes, ContentType } from '@/utils/app.constant';
import router from 'next/router';
import { COURSE_TYPE } from '../../app.config';
import { useTranslation } from 'next-i18next';
import {
  ContentCreate,
  ContentStatus,
  createContent,
  getStatus,
} from '@/services/TrackingService';
import React, { useEffect, useState } from 'react';
interface ContentCardProps {
  name: string;
  mimeType: string;
  appIcon?: string;
  identifier?: any;
  resourceType?: string;
  subTopic?: string[];
}

const ContentCard: React.FC<ContentCardProps> = ({
  name,
  mimeType,
  appIcon,
  identifier,
  resourceType,
  subTopic,
}) => {
  const isInvalidContent = !mimeType;
  const { t } = useTranslation();
  const [CallStatus, setCallStatus] = useState(false);
  const [status, setStatus] = useState<string>();
  const [progress, setProgress] = useState<number>(0);
  const lastAccessOn = new Date().toISOString();

  const getBackgroundImage = () => {
    if (appIcon) {
      return appIcon;
    } else if (ContentCardsTypes[mimeType as keyof FileType]?.BgImgPath?.src) {
      return ContentCardsTypes[mimeType as keyof FileType]?.BgImgPath?.src;
    } else {
      return placeholderImage.src;
    }
  };

  const handleClick = () => {
    if (!isInvalidContent) {
      if (resourceType === COURSE_TYPE.COURSE) {
        router.push(`/course-hierarchy/${identifier}`);
      } else {
        router.push(`/play/content/${identifier?.toLowerCase()}`);
      }
    }
  };

  let userId = '';
  if (typeof window !== 'undefined' && window.localStorage) {
    userId = localStorage.getItem('userId') || '';
  }
  useEffect(() => {
    try {
      const getTrackingStatus = async () => {
        if (userId !== undefined || userId !== '') {
          const reqBody: ContentStatus = {
            userId: [userId],
            contentId: [identifier],
            courseId: [identifier],
            unitId: [identifier],
          };
          const response = await getStatus(reqBody);

          console.log('response', response);
          let status = '';
          response.data?.some((item: any) =>
            item.contents?.some((content: any) => {
              if (content.contentId === identifier) {
                status = content.status || '';
                // status = parseInt(content.percentage, 10);
                return true;
              }
            })
          );
          if (
            status === t('CENTER_SESSION.COMPLETED') ||
            status === t('CENTER_SESSION.IN_PROGRESS')
          ) {
            setProgress(100);
          } else if (status === t('CENTER_SESSION.NOT_STARTED')) {
            setProgress(0);
          }
          console.log('response tracking status', status);
          setStatus(status);
        }
      };
      getTrackingStatus();
    } catch (error) {
      console.log(error);
    }
  }, [CallStatus]);

  useEffect(() => {
    let detailsObject: any[] = [];

    if (typeof window !== 'undefined' && window.localStorage) {
      const keys = Object.keys(localStorage);

      // Filter keys for relevant telemetry events based on identifier
      const relevantKeys = keys.filter((key) => key.includes(identifier));

      relevantKeys.forEach((key) => {
        const telemetryEvent = localStorage.getItem(key);
        if (telemetryEvent) {
          detailsObject.push(JSON.parse(telemetryEvent));
        }
      });
    }

    console.log('Details Object:', detailsObject);

    try {
      const contentWithTelemetryData = async () => {
        if (userId !== undefined || userId !== '') {
          const ContentTypeReverseMap = Object.fromEntries(
            Object.entries(ContentType).map(([key, value]) => [value, key])
          );
          console.log(ContentTypeReverseMap);

          const reqBody: ContentCreate = {
            userId: userId,
            contentId: identifier,
            courseId: identifier,
            unitId: identifier,
            contentType: ContentTypeReverseMap[mimeType] || '',
            contentMime: mimeType,
            lastAccessOn: lastAccessOn,
            detailsObject: detailsObject,
          };
          if (detailsObject.length > 0) {
            const response = await createContent(reqBody);
            if (response) {
              setCallStatus(true);
            }
            console.log(response);
          }
        }
      };
      contentWithTelemetryData();
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <Tooltip title={isInvalidContent ? name || subTopic?.join(', ') : ''} arrow>
      <Box
        onClick={handleClick}
        sx={{
          backgroundImage: `url(${getBackgroundImage()})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          borderRadius: '16px',
          overflow: 'hidden',
          cursor: isInvalidContent ? 'not-allowed' : 'pointer',
          backgroundRepeat: 'no-repeat',
          opacity: isInvalidContent ? 0.6 : 1,
          position: 'relative',
        }}
      >
        <Box
          sx={{
            height: '204px',
            position: 'relative',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                'linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(0, 0, 0, 0.5) 100%)',
              zIndex: 1,
              borderTopLeftRadius: '16px',
              borderTopRightRadius: '16px',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: '16px',
              left: '16px',
              right: '16px',
              zIndex: 2,
              color: isInvalidContent ? '#ECE6F0' : '#FFFFFF',
              fontSize: '14px',
              fontWeight: 500,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {isInvalidContent
              ? t('COURSE_PLANNER.INVALID_RESOURCE')
              : name || subTopic?.join(', ')}
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          <Box sx={{ flexGrow: 1 }}>
            <LinearProgress variant="determinate" value={progress} />
          </Box>
          {status !== t('CENTER_SESSION.COMPLETED') && (
            <Typography sx={{ marginLeft: 2 }}>{status}</Typography>
          )}
        </Box>
        {!isInvalidContent && (
          <Box
            sx={{
              height: '40px',
              background: '#ECE6F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 16px',
              borderRadius: '0px 0px 16px 16px',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Image
                src={ContentCardsTypes[mimeType as keyof FileType]?.imgPath}
                alt="Content Thumbnail"
                style={{ marginRight: '8px', height: '25px', width: '23px' }}
              />
              <span
                style={{ fontSize: '12px', color: '#1F1B13', fontWeight: 400 }}
              >
                {ContentCardsTypes[mimeType as keyof FileType]?.name}
              </span>
            </Box>
          </Box>
        )}
      </Box>
    </Tooltip>
  );
};

export default ContentCard;
