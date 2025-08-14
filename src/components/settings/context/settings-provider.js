'use client';

import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import { useMemo, useState, useEffect, useCallback } from 'react';

import { useLocalStorage } from 'src/hooks/use-local-storage';

import { localStorageGetItem } from 'src/utils/storage-available';

import { SettingsContext } from './settings-context';

// ----------------------------------------------------------------------

const STORAGE_KEY = 'settings';

export function SettingsProvider({ children, defaultSettings }) {
  const { state, update, reset } = useLocalStorage(STORAGE_KEY, defaultSettings);

  const [openDrawer, setOpenDrawer] = useState(false);

  const isArabic = typeof window !== 'undefined' ? localStorageGetItem('i18nextLng') === 'ar' : false;

  // Ensure we always have a valid state
  const safeState = state || defaultSettings;

  useEffect(() => {
    if (isArabic) {
      onChangeDirectionByLang('ar');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isArabic]);

  // Direction by lang
  const onChangeDirectionByLang = useCallback(
    (lang) => {
      update('themeDirection', lang === 'ar' ? 'rtl' : 'ltr');
    },
    [update]
  );

  // Drawer
  const onToggleDrawer = useCallback(() => {
    setOpenDrawer((prev) => !prev);
  }, []);

  const onCloseDrawer = useCallback(() => {
    setOpenDrawer(false);
  }, []);

  const canReset = !isEqual(safeState, defaultSettings);

  const memoizedValue = useMemo(
    () => ({
      ...safeState,
      onUpdate: update,
      // Direction
      onChangeDirectionByLang,
      // Reset
      canReset,
      onReset: reset,
      // Drawer
      open: openDrawer,
      onToggle: onToggleDrawer,
      onClose: onCloseDrawer,
    }),
    [
      reset,
      update,
      safeState,
      canReset,
      openDrawer,
      onCloseDrawer,
      onToggleDrawer,
      onChangeDirectionByLang,
    ]
  );

  return <SettingsContext.Provider value={memoizedValue}>{children}</SettingsContext.Provider>;
}

SettingsProvider.propTypes = {
  children: PropTypes.node,
  defaultSettings: PropTypes.object,
};
