// ----------------------------------------------------------------------

export function cssBaseline(theme) {
  return {
    MuiCssBaseline: {
      styleOverrides: {
        '*': {
          boxSizing: 'border-box',
        },
        html: {
          margin: 0,
          padding: 0,
          width: '100%',
          height: '100%',
          WebkitOverflowScrolling: 'touch',
          // Enable native scroll-to-top on mobile
          overflowY: 'auto',
          scrollBehavior: 'smooth',
        },
        body: {
          margin: 0,
          padding: 0,
          width: '100%',
          height: '100%',
          // Allow body to scroll naturally on mobile
          minHeight: '100%',
          overflowY: 'auto',
          // Enable touch scrolling and scroll-to-top gesture
          WebkitOverflowScrolling: 'touch',
          touchAction: 'pan-y',
        },
        '#root, #__next': {
          width: '100%',
          minHeight: '100%',
          position: 'relative',
        },
        input: {
          '&[type=number]': {
            MozAppearance: 'textfield',
            '&::-webkit-outer-spin-button': {
              margin: 0,
              WebkitAppearance: 'none',
            },
            '&::-webkit-inner-spin-button': {
              margin: 0,
              WebkitAppearance: 'none',
            },
          },
        },
        img: {
          maxWidth: '100%',
          display: 'inline-block',
          verticalAlign: 'bottom',
        },
      },
    },
  };
}
