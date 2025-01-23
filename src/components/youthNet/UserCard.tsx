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

type UserCardProps = {
  name: string;
  showAvtar?: boolean;
  age?: string | number;
  village?: string;
  image?: string;
  joinOn?: string;
  isNew?: boolean;
  showMore?: bolean;
  totalCount?: number;
  newRegistrations?: number;
};

type UserListProps = {
  users: UserCardProps[];
  layout?: 'list' | 'grid'; // Added layout prop
};

const UserCard: React.FC<UserCardProps> = ({
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
    >
      <ListItem>
        {showAvtar && (
          <Avatar
            src={image}
            alt={name}
            sx={{
              width: 48,
              height: 48,
              backgroundColor: image ? 'transparent' : '#f5f5f5',
              fontSize: 18,
              fontWeight: '400',
              color: 'black',
              border: '2px solid #CDC5BD',
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
              color: '#0D599E',
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
                <Typography variant="body2" color="#1A8825" fontWeight={600}>
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

export const UserList: React.FC<UserListProps> = ({
  users,
  layout = 'grid',
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
              <UserCard {...user} />
            </Grid>
            {index < users.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </Grid>
    </List>
  ) : (
    <List>
      {users.map((user, index) => (
        <React.Fragment key={index}>
          <UserCard {...user} />
          {index < users.length - 1 && <Divider />}
        </React.Fragment>
      ))}
    </List>
  );
};
