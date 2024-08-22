import { CenterType } from "@/utils/app.constant";
import { Box, Grid } from "@mui/material";
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import SmartDisplayOutlinedIcon from '@mui/icons-material/SmartDisplayOutlined';
import building from '../../assets/images/apartment.png';
import Image from "next/image";

interface Center {
    cohortId: string;
    cohortName: string;
    centerType?: string | null;
  }
  
  interface CenterListProps {
    title: string;
    centers: Center[];
    router: any;
    theme: any;
    t: (key: string) => string;
  }

  
  const CenterList: React.FC<CenterListProps> = ({ title, centers, router, theme, t }) => {

    
    console.log(centers); 
  
    return (
    <>
      <Box
        sx={{
          fontSize: '14px',
          fontWeight: '500',
          color: theme.palette.warning['300'],
          marginBottom: '8px',
          m: 2,
        }}
      >
        {t(title)}
      </Box>
  
      <Box
        sx={{
          borderRadius: '16px',
          p: 2,
          background: theme.palette.action.selected,
          m: 2,
        }}
      >
        <Grid container spacing={2}>
          {centers.map((center) => (
            <Grid item xs={12} sm={6} md={4} key={center?.cohortId}>
              <Box
                onClick={() => {
                  router.push(`/centers/${center?.cohortId}`);
                  localStorage.setItem('classId', center?.cohortId);
                }}
                sx={{
                  cursor: 'pointer',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    gap: '10px',
                    background: '#fff',
                    height: '56px',
                    borderRadius: '8px',
                  }}
                  mt={1}
                >
                  <Box
                    sx={{
                      width: '56px',
                      display: 'flex',
                      background: theme.palette.primary.light,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderTopLeftRadius: '8px',
                      borderBottomLeftRadius: '8px',
                    }}
                  >
                    {center.centerType?.toUpperCase() === CenterType.REGULAR ||
                    center.centerType === '' ? (
                      <Image src={building} alt="center" />
                    ) : (
                      <SmartDisplayOutlinedIcon sx={{ color: '#4D4639' }} />
                    )}
                  </Box>
  
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      width: '100%',
                      padding: '0 10px',
                    }}
                  >
                    <Box
                      sx={{
                        fontSize: '16px',
                        fontWeight: '400',
                        color: theme.palette.warning['300'],
                      }}
                    >
                      {center.cohortName.charAt(0).toUpperCase() +
                        center.cohortName.slice(1)}
                    </Box>
                    <ChevronRightIcon />
                  </Box>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
};

export default CenterList;
  