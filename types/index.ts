export interface User {
  id: number
  username: string
  name: string | null
  email: string | null
  role: UserRole
  created_at: string
}

export type UserRole = "user" | "admin"

export interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
}

export interface ServiceSubmission {
  id: number
  user_id: number
  applicant_name: string
  status: "pending" | "verifying" | "approved" | "rejected" | "completed" | "deleted"
  data: Record<string, any>
  documents: Record<string, string> // Base64 encoded files
  reviewed_by: number | null // User ID of admin who reviewed
  rejection_reason: string | null
  created_at: string
  updated_at: string
}

export interface KTPSubmission extends ServiceSubmission {
  data: {
    nik?: string
    nama_lengkap?: string
    tempat_lahir?: string
    tanggal_lahir?: string
    jenis_kelamin?: string
    alamat?: string
    rt_rw?: string
    kelurahan?: string
    kecamatan?: string
    kabupaten?: string
    provinsi?: string
    kode_pos?: string
    agama?: string
    status_perkawinan?: string
    pekerjaan?: string
    kewarganegaraan?: string
    golongan_darah?: string
    jenis_pengajuan?: "baru" | "perpanjangan" | "penggantian"
  }
}

export interface PerkawinanSubmission extends ServiceSubmission {
  data: {
    groom_nik?: string
    groom_name?: string
    groom_birth_date?: string
    bride_nik?: string
    bride_name?: string
    bride_birth_date?: string
    marriage_date?: string
    marriage_location?: string
    groom_parents_names?: string
    bride_parents_names?: string
  }
}

export interface KelahiranSubmission extends ServiceSubmission {
  data: {
    child_name?: string
    birth_date?: string
    birth_place?: string
    gender?: "L" | "P"
    father_name?: string
    mother_name?: string
    weight?: number
    length?: number
  }
}

export interface KematianSubmission extends ServiceSubmission {
  data: {
    deceased_name?: string
    deceased_nik?: string
    birth_date?: string
    death_date?: string
    death_place?: string
    cause_of_death?: string
    family_contact_name?: string
    family_contact_phone?: string
  }
}

export interface KKSubmission extends ServiceSubmission {
  data: {
    family_head_name?: string
    family_head_nik?: string
    address?: string
    family_members?: Array<{
      name: string
      nik: string
      relation: string
    }>
  }
}

export interface PindahSubmission extends ServiceSubmission {
  data: {
    applicant_nik?: string
    applicant_name?: string
    current_address?: string
    new_address?: string
    new_kelurahan?: string
    new_kecamatan?: string
    new_kabupaten?: string
    new_provinsi?: string
    reason?: string
  }
}

export interface PerkawinanRecord {
  id: string
  uuid: string
  groom_nik: string
  groom_name: string
  bride_nik: string
  bride_name: string
  marriage_date: string
  marriage_location: string
  witness_1_name: string
  witness_2_name: string
  status: "pending" | "verified" | "approved" | "rejected"
  created_at: string
  updated_at: string
}

export interface IKDStatistics {
  total_population: number
  total_ktp_issued: number
  total_ktp_pending: number
  total_marriages: number
  total_births: number
  total_deaths: number
  monthly_ktp_issued: number
  monthly_marriages: number
}

export interface DashboardStats {
  ktp: {
    total: number
    pending: number
    approved: number
    rejected: number
  }
  perkawinan: {
    total: number
    pending: number
    approved: number
    rejected: number
  }
  ikd: IKDStatistics
}

export interface ApiResponse<T> {
  success: boolean
  message?: string
  data?: T
  errors?: Record<string, string[]>
}
