'use client';

// JanVaani RBAC Data Access Layer Security
// Enforces that patients have READ-ONLY access to provider directory data and queue controls.

export type UserRole =
  | 'patient'
  | 'doctor'
  | 'hospital_admin'
  | 'department_staff'
  | 'operator'
  | 'clinic_admin'
  | 'pharmacy_admin'
  | 'lab_admin'
  | 'blood_bank_admin'
  | 'ambulance_operator';

export class DataAccessLayer {
  public static canMutateProviderData(role: UserRole, targetEntity: string): boolean {
    if (role === 'patient') return false; // Patient CANNOT edit provider data
    
    switch (targetEntity) {
      case 'doctor_queue':
        return role === 'doctor' || role === 'department_staff' || role === 'operator' || role === 'hospital_admin';
      case 'hospitals':
      case 'departments':
        return role === 'hospital_admin';
      case 'clinics':
        return role === 'clinic_admin' || role === 'hospital_admin';
      case 'medical_shops':
        return role === 'pharmacy_admin';
      case 'pathology_labs':
        return role === 'lab_admin';
      case 'blood_banks':
        return role === 'blood_bank_admin';
      case 'ambulance':
        return role === 'ambulance_operator' || role === 'hospital_admin';
      default:
        return false;
    }
  }

  public static assertWritePermission(role: UserRole, targetEntity: string) {
    if (!this.canMutateProviderData(role, targetEntity)) {
      throw new Error(
        `[Access Denied] User with role '${role}' is not authorized to modify '${targetEntity}'. Patients have read-only access.`
      );
    }
  }
}
