import { Box, Tooltip } from '@mui/material';
import Image from 'next/image';
import placeholderImage from '../assets/images/decorationBg.png';
import { FileType, ContentCardsTypes } from '@/utils/app.constant';
import router from 'next/router';
import { COURSE_TYPE } from '../../app.config';
import { useTranslation } from 'next-i18next';

interface ContentCardProps {
  name: string;
  mimeType?: string;
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
