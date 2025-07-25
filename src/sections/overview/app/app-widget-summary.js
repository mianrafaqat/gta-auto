import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { fNumber, fPercent } from 'src/utils/format-number';

import Chart from 'src/components/chart';
import Iconify from 'src/components/iconify';
import Image from 'src/components/image';

// ----------------------------------------------------------------------

export default function AppWidgetSummary({ title, subTitle, imgSrc, chart, sx, ...other }) {
  const theme = useTheme();


  

  return (
    <Card sx={{ display: 'flex',justifyContent:"center", textAlign:'center', alignItems: 'center', p: 3, ...sx }} {...other}>
      <Box sx={{ flexGrow: 1 }}>
        {/* <Typography variant="subtitle2">{title}</Typography> */}
        <Image sx={{width:'60px'}} src={imgSrc}/>
        <Typography mt={2} variant="h4">{subTitle}</Typography>
      </Box>

     
    </Card>
  );
}

AppWidgetSummary.propTypes = {
  
  imgSrc: PropTypes.string,
  sx: PropTypes.object,
  title: PropTypes.string,
  subTitle: PropTypes.string,
};
