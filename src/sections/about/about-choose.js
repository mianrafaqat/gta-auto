import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';
import LinearProgress from '@mui/material/LinearProgress';

import { useResponsive } from 'src/hooks/use-responsive';

import { fPercent } from 'src/utils/format-number';

import Image from 'src/components/image';
import Iconify from 'src/components/iconify';
import { varFade, MotionViewport } from 'src/components/animate';
import GppGoodRoundedIcon from '@mui/icons-material/GppGoodRounded';

// ----------------------------------------------------------------------

export const SKILLS = [...Array(3)].map((_, index) => ({
  label: ['Development', 'Design', 'Marketing'][index],
  value: [20, 40, 60][index],
}));

// ----------------------------------------------------------------------


export default function ChooseUs() {
  const theme = useTheme();

  const mdUp = useResponsive('up', 'md');

  const lightMode = theme.palette.mode === 'light';

  const shadow = `-40px 40px 80px ${alpha(
    lightMode ? theme.palette.grey[500] : theme.palette.common.black,
    0.24
  )}`;

  return (
    <Container
      component={MotionViewport}
      sx={{
        py: { xs: 2, md: 5 },
        textAlign: { xs: 'center', md: 'unset' },
      }}
    >
      <Grid container columnSpacing={{ md: 3 }} alignItems="center">
      <Grid xs={12} md={6} lg={6}>

      <section
          className="my-30"
          style={{
            backgroundImage: "url(assets/imgs/slider/car1.png)",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="container">
            <div className="row pt-70 pb-90 justify-content-end">
              <div className="col-md-6 ">
              <m.div variants={varFade().inRight}>
            <Typography variant="h2" sx={{ mb: 3 }}>
            Why Choose Us 
                        </Typography>
          </m.div>
                <p className="mb-30"></p>
                <m.div variants={varFade().inRight}>
                <div className="row mt-80">
                <Grid container columnSpacing={{ md: 3 }} alignItems="flex-start">
                <Grid xs={6} md={6} lg={6}  sx={{display: 'inline-flex',alignItems:'center',gap:3}}>
              
                    <GppGoodRoundedIcon   style={{boxShadow:'3px 5px 10px 0px #0000002b', color:"#AD0003",background:"#EFF5FC",fontSize:'40px',borderRadius:'25%',padding:'10px'}} fontSize="80px" />
                    <div className="banner-text mt-10 ml-20  ">
                       
                      <h6 className="">We Are Completely 100% Free (No hidden charges) </h6>
                       
                    </div>
                
                </Grid>
            <Grid xs={6} md={6} lg={6} sx={{display: 'inline-flex',alignItems:'center',gap:3}}> 
                    <GppGoodRoundedIcon   style={{boxShadow:'3px 5px 10px 0px #0000002b', color:"#AD0003",background:"#EFF5FC",fontSize:'40px',borderRadius:'25%',padding:'10px'}} fontSize="80px" />
                    <div className="banner-text mt-10 ml-20 ">
                        <h6>
                        
                        Your One-Stop Solution for Vehicle Sale Purchase. 
                        </h6>
                      
                    </div>
                </Grid>
           
             <Grid xs={6} md={6} lg={6} sx={{display: 'inline-flex',alignItems:'center',gap:3}}> 
                
                    <GppGoodRoundedIcon   style={{boxShadow:'3px 5px 10px 0px #0000002b', color:"#AD0003",background:"#EFF5FC",fontSize:'40px',borderRadius:'25%',padding:'10px'}} fontSize="80px" />
                    <div className="banner-text mt-10 ml-20 ">
                        <h6>
                        Vehicle Advertisement Made Easy for Everyone.
                        
                           
                        </h6>
                     
                    </div>
                
                </Grid>
                <Grid xs={6} md={6} lg={6} sx={{display: 'inline-flex',alignItems:'center',gap:3}}>               
                    <GppGoodRoundedIcon   style={{boxShadow:'3px 5px 10px 0px #0000002b', color:"#AD0003",background:"#EFF5FC",fontSize:'40px',borderRadius:'25%',padding:'10px'}} fontSize="80px" />
                   
                    <div className="banner-text mt-10 ml-20  ">
                        <h6>
                        Efficient and Stress-Free Platform.                     
                        </h6>
                       
                    </div>
              
</Grid>                 <Grid xs={6} md={6} lg={6} sx={{display: 'inline-flex',alignItems:'center',gap:3}}> 
              
                    <GppGoodRoundedIcon   style={{boxShadow:'3px 5px 10px 0px #0000002b', color:"#AD0003",background:"#EFF5FC",fontSize:'40px',borderRadius:'25%',padding:'10px'}} fontSize="80px" />
                   
                    <div className="banner-text mt-10 ml-20  ">
                        <h6>
                        IOS and Android Compatible Applications Are Available.            
                        </h6>
                       
                    </div>
                
</Grid>                </Grid>
                </div>
                </m.div>
              </div>
            </div>
          </div>
        </section>
         
        </Grid>
       
        {mdUp && (
          <Grid container xs={12} md={6} lg={6} justifyContent="right"  alignItems="center" sx={{ pr: { md: 7 } }}>
            

            <Grid xs={8}>
              <m.div variants={varFade().inUp}>
                <Image
                  alt="our office 1"
                  src="/assets/images/about/autr.jpg"
                  // ratio="3/4"
                  sx={{ borderRadius: 3, boxShadow: shadow }}
                />
              </m.div>
            </Grid>
          </Grid>
        )}

      
      </Grid>
    </Container>
    // </Box>
  );
}

