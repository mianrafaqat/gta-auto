import { useEffect } from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import { alpha, styled, useTheme } from '@mui/material/styles';

import { bgGradient } from 'src/theme/css';

import Image from 'src/components/image';
import Lightbox, { useLightBox } from 'src/components/lightbox';
import Carousel, { useCarousel, CarouselArrowIndex } from 'src/components/carousel';

// ----------------------------------------------------------------------

const THUMB_SIZE = 84;

const StyledThumbnailsContainer = styled('div')(({ length, theme }) => ({
  position: 'relative',
  margin: theme.spacing(0, 'auto'),
  '& .slick-slide': {
    lineHeight: 0,
  },

  ...(length === 1 && {
    maxWidth: '100%',
  }),

  ...(length === 2 && {
    maxWidth: '100%',
  }),

  ...((length === 3 || length === 4) && {
    maxWidth:'100%',
  }),

  ...(length >= 5 && {
    maxWidth: '100%',
  }),

  ...(length > 3 && {
    '&:before, &:after': {
      // ...bgGradient({
      //   direction: 'to left',
      //   startColor: `${alpha(theme.palette.background.default, 0)} 0%`,
      //   endColor: `${theme.palette.background.default} 100%`,
      // }),
      top: 0,
      zIndex: 9,
      content: "''",
      height: '100%',
      position: 'absolute',
      width: (THUMB_SIZE * 2) / 3,
    },
    '&:after': {
      right: 0,
      transform: 'scaleX(-1)',
    },
  }),
}));

// ----------------------------------------------------------------------

export default function ProductDetailsCarousel({ product }) {
  const theme = useTheme();

  const slides = product?.image
    ? product?.image?.map((img) => ({
        src: img,
      }))
    : [];

  const lightbox = useLightBox(slides);

  const carouselLarge = useCarousel({
    rtl: false,
    draggable: false,
    adaptiveHeight: true,
  });

  const carouselThumb = useCarousel({
    rtl: false,
    centerMode: true,
    swipeToSlide: true,
    focusOnSelect: true,
    variableWidth: true,
    centerPadding: '0px',
    slidesToShow: slides?.length > 3 ? 3 : slides?.length,
  });

  useEffect(() => {
    carouselLarge.onSetNav();
    carouselThumb.onSetNav();
  }, [carouselLarge, carouselThumb]);

  useEffect(() => {
    if (lightbox.open) {
      carouselLarge.onTogo(lightbox.selected);
    }
  }, [carouselLarge, lightbox.open, lightbox.selected]);

  const renderLargeImg = (
    <Box
      sx={{
        mb: 3,
        borderRadius: 2,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <Carousel
        {...carouselLarge.carouselSettings}
        asNavFor={carouselThumb.nav}
        ref={carouselLarge.carouselRef}
        arrows={true}
      >
        {slides &&
          slides.map((slide) => (
            <Image
              key={slide.src}
              alt={slide.src}
              src={slide.src}
              ratio="16/9"
              onClick={() => lightbox.onOpen(slide.src)}
              sx={{ cursor: 'zoom-in' }}
            />
          ))}
      </Carousel>

      {/* <CarouselArrowIndex
        index={carouselLarge.currentIndex}
        total={slides?.length}
        onNext={carouselThumb.onNext}
        onPrev={carouselThumb.onPrev}
      /> */}
    </Box>
  );

  const renderThumbnails = (
    <StyledThumbnailsContainer length={slides?.length}>
      <Carousel
        {...carouselThumb.carouselSettings}
        asNavFor={carouselLarge.nav}
        ref={carouselThumb.carouselRef}
      >
        {slides.map((item, index) => (
          <Box key={item.src} sx={{ px: 0.5 }}>
            <Avatar
              key={item.src}
              alt={item.src}
              src={item.src}
              variant="rounded"
              sx={{
                width: THUMB_SIZE,
                height: THUMB_SIZE,
                opacity: 0.48,
                cursor: 'pointer',
                ...(carouselLarge.currentIndex === index && {
                  opacity: 1,
                  border: `solid 2.5px ${theme.palette.primary.main}`,
                }),
              }}
            />
          </Box>
        ))}
      </Carousel>
    </StyledThumbnailsContainer>
  );

  return (
    <Box
      sx={{
        '& .slick-slide': {
          float: theme.direction === 'rtl' ? 'right' : 'left',
        },
      }}
    >
      {renderLargeImg}

      {renderThumbnails}

      <Lightbox
        index={lightbox.selected}
        slides={slides}
        open={lightbox.open}
        close={lightbox.onClose}
        onGetCurrentIndex={(index) => lightbox.setSelected(index)}
      />
    </Box>
  );
}

ProductDetailsCarousel.propTypes = {
  product: PropTypes.object,
};
