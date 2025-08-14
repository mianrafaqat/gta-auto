import { API_URLS } from 'src/utils/apiUrls';
import gtaAutosInstance from 'src/utils/requestInterceptor';

/**
 * AddressBookService handles API calls for address book management.
 *
 * Endpoints:
 * - GET /api/address-book (Get All User Addresses)
 * - GET /api/address-book/primary (Get Primary Address)
 * - GET /api/address-book/:id (Get Address by ID)
 * - POST /api/address-book (Add New Address)
 * - PUT /api/address-book/:id (Update Address)
 * - DELETE /api/address-book/:id (Delete Address)
 * - PATCH /api/address-book/:id/primary (Set Address as Primary)
 */
class AddressBookService {
  /**
   * Get all addresses for the authenticated user.
   * @returns {Promise<Object>}
   */
  getAll = async () => {
    try {
      const res = await gtaAutosInstance.get(API_URLS.addressBook.getAll);
      return res.data;
    } catch (ex) {
      throw ex;
    }
  };

  /**
   * Get the user's primary address.
   * @returns {Promise<Object>}
   */
  getPrimary = async () => {
    try {
      const res = await gtaAutosInstance.get(API_URLS.addressBook.getPrimary);
      return res.data;
    } catch (ex) {
      throw ex;
    }
  };

  /**
   * Get a specific address by ID.
   * @param {string} id - Address ID
   * @returns {Promise<Object>}
   */
  getById = async (id) => {
    try {
      const res = await gtaAutosInstance.get(API_URLS.addressBook.getById(id));
      return res.data;
    } catch (ex) {
      throw ex;
    }
  };

  /**
   * Add a new address to the user's address book.
   * @param {Object} data - Address data
   * @returns {Promise<Object>}
   */
  create = async (data) => {
    try {
      const res = await gtaAutosInstance.post(API_URLS.addressBook.create, data);
      return res.data;
    } catch (ex) {
      throw ex;
    }
  };

  /**
   * Update an existing address.
   * @param {string} id - Address ID
   * @param {Object} data - Updated address data
   * @returns {Promise<Object>}
   */
  update = async (id, data) => {
    try {
      const res = await gtaAutosInstance.put(API_URLS.addressBook.update(id), data);
      return res.data;
    } catch (ex) {
      throw ex;
    }
  };

  /**
   * Delete an address from the user's address book.
   * @param {string} id - Address ID
   * @returns {Promise<Object>}
   */
  delete = async (id) => {
    try {
      const res = await gtaAutosInstance.delete(API_URLS.addressBook.delete(id));
      return res.data;
    } catch (ex) {
      throw ex;
    }
  };

  /**
   * Set an address as the primary address.
   * @param {string} id - Address ID
   * @returns {Promise<Object>}
   */
  setPrimary = async (id) => {
    try {
      const res = await gtaAutosInstance.patch(API_URLS.addressBook.setPrimary(id));
      return res.data;
    } catch (ex) {
      throw ex;
    }
  };
}

const instance = new AddressBookService();
export default instance;
