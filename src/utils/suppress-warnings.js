/**
 * Suppress known console warnings that are caused by third-party libraries
 * or are not actionable in the current version
 */

if (typeof window !== 'undefined') {
  // Store original console methods
  const originalWarn = console.warn;
  const originalError = console.error;

  // List of warning patterns to suppress
  const warningsToSuppress = [
    // React-slick findDOMNode deprecation warnings
    /findDOMNode/i,
    /findDOMNode is deprecated/i,
    /findDOMNode is deprecated in StrictMode/i,
    
    // MUI defaultProps deprecation warnings
    /defaultProps/i,
    /defaultProps is deprecated/i,
    /The `defaultProps` property is deprecated/i,
    /MUI: The `defaultProps` key/i,
    
    // React strict mode warnings for react-slick
    /componentWillReceiveProps has been renamed/i,
    /componentWillUpdate has been renamed/i,
    /componentWillMount has been renamed/i,
    
    // React 18 warnings
    /ReactDOM.render is no longer supported/i,
    /Warning: Using UNSAFE_componentWillReceiveProps/i,
    /Warning: Using UNSAFE_componentWillMount/i,
    
    // MUI component warnings we're aware of
    /MUI: The value provided to Autocomplete is invalid/i,
    /Material-UI: The `css` function is deprecated/i,
    
    // MUI Grid v2 warnings (deprecated item/container props)
    /Received `true` for a non-boolean attribute `item`/i,
    /Received `true` for a non-boolean attribute `container`/i,
    
    // Unknown event handler properties
    /Unknown event handler property/i,
    /It will be ignored/i,
    
    // Non-boolean attributes passed to DOM elements
    /Received `(true|false)` for a non-boolean attribute/i,
    /pass a string instead:/i,
    /pass.*\{condition \? value : undefined\}/i,
    
    // Slick carousel related warnings
    /react-slick/i,
  ];

  // Override console.warn
  console.warn = (...args) => {
    const message = args[0]?.toString() || '';
    
    // Check if this warning should be suppressed
    const shouldSuppress = warningsToSuppress.some((pattern) => pattern.test(message));
    
    if (!shouldSuppress) {
      originalWarn.apply(console, args);
    }
  };

  // Override console.error for specific errors
  console.error = (...args) => {
    const message = args[0]?.toString() || '';
    
    // Check if this error should be suppressed
    const shouldSuppress = warningsToSuppress.some((pattern) => pattern.test(message));
    
    if (!shouldSuppress) {
      originalError.apply(console, args);
    }
  };
}

export {};

