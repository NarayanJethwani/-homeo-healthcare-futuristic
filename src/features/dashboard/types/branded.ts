export type PatientId = string & { readonly __brand: unique symbol };
export type InvoiceId = string & { readonly __brand: unique symbol };
export type DoctorId = string & { readonly __brand: unique symbol };
export type AlertId = string & { readonly __brand: unique symbol };
export type AppointmentId = string & { readonly __brand: unique symbol };
export type ConsultationId = string & { readonly __brand: unique symbol };
export type PrescriptionId = string & { readonly __brand: unique symbol };
export type ClinicId = string & { readonly __brand: unique symbol };
export type UserId = string & { readonly __brand: unique symbol };

// Safe casting helper functions
export const toPatientId = (id: string): PatientId => id as PatientId;
export const toInvoiceId = (id: string): InvoiceId => id as InvoiceId;
export const toDoctorId = (id: string): DoctorId => id as DoctorId;
export const toAlertId = (id: string): AlertId => id as AlertId;
export const toAppointmentId = (id: string): AppointmentId => id as AppointmentId;
export const toConsultationId = (id: string): ConsultationId => id as ConsultationId;
export const toPrescriptionId = (id: string): PrescriptionId => id as PrescriptionId;
export const toClinicId = (id: string): ClinicId => id as ClinicId;
export const toUserId = (id: string): UserId => id as UserId;
