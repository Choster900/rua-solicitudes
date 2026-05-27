// Vendor model was removed from the schema in the refactoring.
// These stubs prevent build errors while vendor endpoints are updated.
import type {
    VendorRecord,
    CreateVendorInput,
    UpdateVendorInput,
} from '../interfaces/repositories/vendor-repository.interface'

export const getAllVendors = async (): Promise<VendorRecord[]> => []
export const findVendorById = async (_id: string): Promise<VendorRecord | null> => null
export const findVendorByCode = async (_code: string): Promise<VendorRecord | null> => null
export const createVendor = async (_payload: CreateVendorInput): Promise<VendorRecord> => {
    throw new Error('Vendors not implemented')
}
export const updateVendor = async (
    _id: string,
    _payload: UpdateVendorInput,
): Promise<VendorRecord> => {
    throw new Error('Vendors not implemented')
}
export const deleteVendorById = async (_id: string): Promise<VendorRecord> => {
    throw new Error('Vendors not implemented')
}
