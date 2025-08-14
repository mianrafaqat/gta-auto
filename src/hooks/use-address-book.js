import { useState, useEffect, useCallback } from 'react';
import { useAuthContext } from 'src/auth/hooks/use-auth-context';
import AddressBookService from 'src/services/address-book/address-book.service';
import { 
  getLocalStorageItem, 
  setLocalStorageItem, 
  removeLocalStorageItem 
} from 'src/utils/cookie-utils';

// Cookie storage keys
const ADDRESS_BOOK_COOKIE_KEY = 'gta_auto_address_book';
const TEMP_ADDRESS_COOKIE_KEY = 'gta_auto_temp_address';

/**
 * Hook for managing address book data with authentication handling.
 * For authenticated users: fetches from API
 * For non-authenticated users: stores in cookies
 */
export const useAddressBook = () => {
  const { authenticated, user } = useAuthContext();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get addresses from cookies (for non-authenticated users)
  const getAddressesFromCookies = useCallback(() => {
    return getLocalStorageItem(ADDRESS_BOOK_COOKIE_KEY, []);
  }, []);

  // Save addresses to cookies (for non-authenticated users)
  const saveAddressesToCookies = useCallback((addressList) => {
    setLocalStorageItem(ADDRESS_BOOK_COOKIE_KEY, addressList);
  }, []);

  // Get temporary address from cookies (for non-authenticated users)
  const getTempAddressFromCookies = useCallback(() => {
    return getLocalStorageItem(TEMP_ADDRESS_COOKIE_KEY, null);
  }, []);

  // Save temporary address to cookies (for non-authenticated users)
  const saveTempAddressToCookies = useCallback((address) => {
    setLocalStorageItem(TEMP_ADDRESS_COOKIE_KEY, address);
  }, []);

  // Fetch addresses from API (for authenticated users)
  const fetchAddresses = useCallback(async () => {
    if (!authenticated) return;

    try {
      setLoading(true);
      setError(null);
      
      const response = await AddressBookService.getAll();
      
      if (response.success) {
        setAddresses(response.data || []);
      } else {
        setError(response.message || 'Failed to fetch addresses');
        setAddresses([]);
      }
    } catch (err) {
      console.error('Error fetching addresses:', err);
      setError(err.message || 'Failed to fetch addresses');
      setAddresses([]);
    } finally {
      setLoading(false);
    }
  }, [authenticated]);

  // Load addresses based on authentication status
  useEffect(() => {
    if (authenticated) {
      fetchAddresses();
    } else {
      // For non-authenticated users, load from cookies
      const cookieAddresses = getAddressesFromCookies();
      setAddresses(cookieAddresses);
    }
  }, [authenticated, fetchAddresses, getAddressesFromCookies]);

  // Add new address
  const addAddress = useCallback(async (addressData) => {
    try {
      setError(null);

      if (authenticated) {
        // For authenticated users, save to API
        const response = await AddressBookService.create(addressData);
        
        if (response.success) {
          const newAddress = response.data;
          setAddresses(prev => [...prev, newAddress]);
          return newAddress;
        } else {
          throw new Error(response.message || 'Failed to add address');
        }
      } else {
        // For non-authenticated users, save to cookies
        const newAddress = {
          id: `temp_${Date.now()}`,
          ...addressData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        const updatedAddresses = [...addresses, newAddress];
        setAddresses(updatedAddresses);
        saveAddressesToCookies(updatedAddresses);
        
        return newAddress;
      }
    } catch (err) {
      console.error('Error adding address:', err);
      setError(err.message || 'Failed to add address');
      throw err;
    }
  }, [authenticated, addresses, saveAddressesToCookies]);

  // Update address
  const updateAddress = useCallback(async (id, addressData) => {
    try {
      setError(null);

      if (authenticated) {
        // For authenticated users, update via API
        const response = await AddressBookService.update(id, addressData);
        
        if (response.success) {
          const updatedAddress = response.data;
          setAddresses(prev => 
            prev.map(addr => addr._id === id ? updatedAddress : addr)
          );
          return updatedAddress;
        } else {
          throw new Error(response.message || 'Failed to update address');
        }
      } else {
        // For non-authenticated users, update in cookies
        const updatedAddresses = addresses.map(addr => 
          addr.id === id 
            ? { ...addr, ...addressData, updatedAt: new Date().toISOString() }
            : addr
        );
        
        setAddresses(updatedAddresses);
        saveAddressesToCookies(updatedAddresses);
        
        return updatedAddresses.find(addr => addr.id === id);
      }
    } catch (err) {
      console.error('Error updating address:', err);
      setError(err.message || 'Failed to update address');
      throw err;
    }
  }, [authenticated, addresses, saveAddressesToCookies]);

  // Delete address
  const deleteAddress = useCallback(async (id) => {
    try {
      setError(null);

      if (authenticated) {
        // For authenticated users, delete via API
        const response = await AddressBookService.delete(id);
        
        if (response.success) {
          setAddresses(prev => prev.filter(addr => addr._id !== id));
          return true;
        } else {
          throw new Error(response.message || 'Failed to delete address');
        }
      } else {
        // For non-authenticated users, delete from cookies
        const updatedAddresses = addresses.filter(addr => addr.id !== id);
        setAddresses(updatedAddresses);
        saveAddressesToCookies(updatedAddresses);
        return true;
      }
    } catch (err) {
      console.error('Error deleting address:', err);
      setError(err.message || 'Failed to delete address');
      throw err;
    }
  }, [authenticated, addresses, saveAddressesToCookies]);

  // Set address as primary
  const setPrimaryAddress = useCallback(async (id) => {
    try {
      setError(null);

      if (authenticated) {
        // For authenticated users, set primary via API
        const response = await AddressBookService.setPrimary(id);
        
        if (response.success) {
          const updatedAddress = response.data;
          setAddresses(prev => 
            prev.map(addr => ({
              ...addr,
              primary: addr._id === id
            }))
          );
          return updatedAddress;
        } else {
          throw new Error(response.message || 'Failed to set primary address');
        }
      } else {
        // For non-authenticated users, set primary in cookies
        const updatedAddresses = addresses.map(addr => ({
          ...addr,
          primary: addr.id === id
        }));
        
        setAddresses(updatedAddresses);
        saveAddressesToCookies(updatedAddresses);
        
        return updatedAddresses.find(addr => addr.id === id);
      }
    } catch (err) {
      console.error('Error setting primary address:', err);
      setError(err.message || 'Failed to set primary address');
      throw err;
    }
  }, [authenticated, addresses, saveAddressesToCookies]);

  // Get primary address
  const getPrimaryAddress = useCallback(() => {
    return addresses.find(addr => addr.primary) || null;
  }, [addresses]);

  // Save temporary address for checkout (non-authenticated users)
  const saveTempAddress = useCallback((address) => {
    if (!authenticated) {
      saveTempAddressToCookies(address);
    }
  }, [authenticated, saveTempAddressToCookies]);

  // Get temporary address for checkout (non-authenticated users)
  const getTempAddress = useCallback(() => {
    if (!authenticated) {
      return getTempAddressFromCookies();
    }
    return null;
  }, [authenticated, getTempAddressFromCookies]);

  // Clear all temporary addresses (for non-authenticated users)
  const clearTempAddresses = useCallback(() => {
    if (!authenticated) {
      removeLocalStorageItem(ADDRESS_BOOK_COOKIE_KEY);
      removeLocalStorageItem(TEMP_ADDRESS_COOKIE_KEY);
      setAddresses([]);
    }
  }, [authenticated]);

  return {
    addresses,
    loading,
    error,
    authenticated,
    addAddress,
    updateAddress,
    deleteAddress,
    setPrimaryAddress,
    getPrimaryAddress,
    saveTempAddress,
    getTempAddress,
    clearTempAddresses,
    refreshAddresses: fetchAddresses,
  };
};
