import React from 'react';
import {
  Avatar,
  Box,
  Typography,
  List,
  ListItem,
  Divider,
  Grid,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useTheme } from '@mui/material/styles';

type ProfileCardProps = {
  name: string;
  showAvtar?: boolean;
  age?: string | number;
  village?: string;
  image?: string;
  joinOn?: string;
  isNew?: boolean;
  showMore?: boolean;
  totalCount?: number;
  newRegistrations?: number;
  onClick?: (name: string) => void; // Add onClick prop
};

const ProfileCard: React.FC<ProfileCardProps> = ({
  name,
  age,
  village,
  image,
  joinOn,
  isNew,
  showMore,
  showAvtar,
  totalCount,
  newRegistrations,
  onClick,
}) => {
  const theme = useTheme<any>();

  return (
    <Box
      display={'flex'}
      borderBottom={`1px solid ${theme.palette.warning['A100']}`}
      width={'100%'}
      justifyContent={'space-between'}
      sx={{
        cursor: 'pointer',
        ...(!totalCount && {
          '@media (min-width: 600px)': {
            background: theme.palette.warning.A400,
          },
        }),
      }}
      onClick={() => onClick && onClick(name)}
    >
      <ListItem>
        {showAvtar && (
          <Avatar
            src={image}
            alt={name}
            sx={{
              width: 48,
              height: 48,
              backgroundColor: image
                ? 'transparent'
                : theme.palette.warning['800'],
              fontSize: 18,
              fontWeight: '400',
              color: 'black',
              border: `2px solid ${theme.palette.warning['800']}`,
              boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
            }}
          >
            {!image && name[0]}
          </Avatar>
        )}
        <Box
          ml={2}
          width={'100%'}
          sx={{
            display: totalCount ? 'flex' : 'unset',
            alignItems: totalCount ? 'center' : 'unset',
          }}
        >
          <Typography
            sx={{
              fontSize: '16px',
              color: theme.palette.secondary.main,
              textDecoration: 'underline',
              cursor: 'pointer',
              padding: '5px 5px',
            }}
          >
            {name}
          </Typography>
          <Box display={'flex'} justifyContent={'space-between'} width={'100%'}>
            <Box sx={{ display: 'flex', gap: '8px' }}>
              {age && (
                <Typography variant="body2" color="textSecondary">
                  {age} y/o • {village || joinOn}
                </Typography>
              )}
              {isNew && (
                <Typography
                  variant="body2"
                  color={theme.palette.success.main}
                  fontWeight={600}
                >
                  NEW
                </Typography>
              )}
            </Box>
            {totalCount && (
              <Typography
                variant="body2"
                color="black"
                mt={'1rem'}
                fontWeight={600}
              >
                {totalCount}
                {newRegistrations && (
                  <span
                    style={{
                      color:
                        newRegistrations < 5
                          ? theme.palette.error.main
                          : theme.palette.success.main,
                    }}
                  >
                    (+{newRegistrations})
                  </span>
                )}
              </Typography>
            )}
            {showMore && (
              <MoreVertIcon
                sx={{
                  fontSize: '24px',
                  color: theme.palette.warning['300'],
                  cursor: 'pointer',
                }}
              />
            )}
          </Box>
        </Box>
      </ListItem>
    </Box>
  );
};

type ProfileListProps = {
  users: ProfileCardProps[];
  layout?: 'list' | 'grid'; // Added layout prop
  onUserClick?: (name: string) => void; // Add onUserClick prop
};

export const ProfileList: React.FC<ProfileListProps> = ({
  users,
  layout = 'grid',
  onUserClick, // Receive onUserClick prop
}) => {
  return layout === 'grid' ? (
    <List>
      <Grid container spacing={2}>
        {users.map((user, index) => (
          <React.Fragment key={index}>
            <Grid
              item
              xs={12}
              sm={12}
              md={user.totalCount ? 12 : 6}
              lg={user.totalCount ? 12 : 4}
            >
              <ProfileCard {...user} onClick={onUserClick} />{' '}
              {/* Pass onUserClick */}
            </Grid>
            {index < users.length - 1}
          </React.Fragment>
        ))}
      </Grid>
    </List>
  ) : (
    <List>
      {users.map((user, index) => (
        <React.Fragment key={index}>
          <ProfileCard {...user} onClick={onUserClick} />
          {index < users.length - 1}
        </React.Fragment>
      ))}
    </List>
  );
};
