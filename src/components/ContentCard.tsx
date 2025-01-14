import { fetchBulkContents } from '@/services/PlayerService';
import {
  ContentCreate,
  ContentStatus,
  createContentTracking,
  getContentTrackingStatus,
} from '@/services/TrackingService';
import {
  ContentCardsTypes,
  ContentType,
  FileType,
  contentStatus,
} from '@/utils/app.constant';
import { Box, LinearProgress, Tooltip, Typography } from '@mui/material';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import router from 'next/router';
import React, { useEffect, useState } from 'react';
import { COURSE_TYPE } from '../../app.config';
import placeholderImage from '../assets/images/decorationBg.png';
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
  const [statusMsg, setStatusMsg] = useState<string>();
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
          const response = await getContentTrackingStatus(reqBody);
          let status = '';
          response.data?.some((item: any) =>
            item.contents?.some((content: any) => {
              if (
                content.contentId === identifier &&
                (content.contentMime === ContentType.HTML ||
                  content.contentMime === ContentType.H5P) &&
                content.status === contentStatus.IN_PROGRESS
              ) {
                status = contentStatus.COMPLETED;
              } else {
                if (content.contentId === identifier) {
                  status = content.status || '';
                  // status = parseInt(content.percentage, 10);
                  return true;
                }
              }
            })
          );
          switch (status) {
            case contentStatus.COMPLETED:
              setProgress(100);
              setStatusMsg(t('CENTER_SESSION.COMPLETED'));
              break;
            case contentStatus.IN_PROGRESS:
              setProgress(100);
              setStatusMsg(t('CENTER_SESSION.INPROGRESS'));
              break;
            case contentStatus.NOT_STARTED:
              setProgress(0);
              setStatusMsg(t('CENTER_SESSION.NOTSTARTED'));
              break;
            case '':
              setProgress(0);
              setStatusMsg(t('CENTER_SESSION.NOTSTARTED'));
              break;
            default:
              setProgress(0);
              setStatusMsg('');
              break;
          }
          setStatus(status);
        }
      };
      getTrackingStatus();
    } catch (error) {
      console.log(error);
    }
  }, [CallStatus]);

  useEffect(() => {
    const detailsObject: any[] = [];

    if (typeof window !== 'undefined' && window.localStorage) {
      const keys = Object.keys(localStorage);

      // Filter keys for relevant telemetry events based on identifier
      const relevantKeys = keys.filter((key) => key.includes(identifier));

      relevantKeys.forEach((key) => {
        const telemetryEvent = localStorage.getItem(key);
        if (telemetryEvent) {
          const parsedTelemetryEvent = JSON.parse(telemetryEvent);
          let progressFromSummary = null;
          let progressFromExtra = null;

          // Check `summary` for progress
          if (parsedTelemetryEvent?.edata?.summary?.length > 0) {
            progressFromSummary =
              parsedTelemetryEvent.edata.summary[0]?.progress;
          }

          // Check `extra` for progress
          if (parsedTelemetryEvent?.edata?.extra?.length > 0) {
            const progressEntry = parsedTelemetryEvent.edata.extra.find(
              (entry: any) => entry.id === 'progress'
            );
            if (progressEntry) {
              progressFromExtra = parseInt(progressEntry.value, 10);
            }
          }

          // Skip event if `eid === 'END'` and progress is not 100 in either `summary` or `extra`
          if (
            parsedTelemetryEvent?.eid === 'END' &&
            ((progressFromSummary !== 100 && progressFromSummary !== null) ||
              (progressFromExtra !== 100 && progressFromExtra !== null))
          ) {
            return;
          }

          // Push parsed telemetry event
          detailsObject.push(parsedTelemetryEvent);
        }
      });

      // After processing all keys, check if an END event exists in detailsObject for html or h5p
      let hasEndEvent = true;

      if (mimeType === ContentType.H5P || mimeType === ContentType.HTML) {
        detailsObject.forEach((event) => {
          if (event.eid === 'END') {
            hasEndEvent = false;
          }
        });
        if (!hasEndEvent) {
          detailsObject.push({
            eid: 'END',
            edata: {
              duration: 0,
              mode: 'play',
              pageid: 'sunbird-player-Endpage',
              summary: [
                {
                  progress: 100,
                },
                {
                  totallength: '',
                },
                {
                  visitedlength: '',
                },
                {
                  visitedcontentend: '',
                },
                {
                  totalseekedlength: '',
                },
                {
                  endpageseen: false,
                },
              ],
              type: 'content',
            },
          });
        }
        // });
      }
    }

    try {
      const contentWithTelemetryData = async () => {
        try {
          let resolvedMimeType = mimeType;

          if (!resolvedMimeType) {
            const response = await fetchBulkContents([identifier]);
            resolvedMimeType = response[0]?.mimeType || '';
            if (!resolvedMimeType) {
              console.error('Failed to fetch mimeType.');
              return;
            }
          }

          if (userId !== undefined || userId !== '') {
            const ContentTypeReverseMap = Object.fromEntries(
              Object.entries(ContentType).map(([key, value]) => [value, key])
            );

            const reqBody: ContentCreate = {
              userId: userId,
              contentId: identifier,
              courseId: identifier,
              unitId: identifier,
              contentType: ContentTypeReverseMap[resolvedMimeType] || '',
              contentMime: resolvedMimeType,
              lastAccessOn: lastAccessOn,
              detailsObject: detailsObject,
            };
            // if (detailsObject.length > 0) {
            const response = await createContentTracking(reqBody);
            if (response) {
              setCallStatus(true);
            }
          }
        } catch (error) {
          console.error('Error in contentWithTelemetryData:', error);
        }
        // }
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
              bottom: '5px',
              left: '0px',
              right: '16px',
              zIndex: 2,
            }}
          >
            <Box
              sx={{
                color: isInvalidContent ? '#ECE6F0' : '#FFFFFF',
                fontSize: '14px',
                fontWeight: 500,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',

                marginLeft: '16px',
              }}
            >
              {isInvalidContent
                ? t('COURSE_PLANNER.INVALID_RESOURCE')
                : name || subTopic?.join(', ')}
            </Box>

            {status !== 'Completed' && (
              <Box
                sx={{ display: 'flex', alignItems: 'center', width: '100%' }}
              >
                <Box sx={{ flexGrow: 1 }}>
                  <LinearProgress variant="determinate" value={progress} />
                </Box>
                <Typography
                  sx={{
                    marginLeft: 1,
                    color: '#FFFFFF',
                    fontSize: '12px',
                    fontWeight: 600,
                  }}
                >
                  {statusMsg}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            background: 'transperant',
          }}
        >
          {status === 'Completed' && (
            <>
              <Box sx={{ flexGrow: 1 }}>
                <LinearProgress variant="determinate" value={progress} />
              </Box>
              {/* <Typography sx={{ marginLeft: 2 }}>{statusMsg}</Typography> */}
            </>
          )}
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            background: 'transperant',
          }}
        ></Box>
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
