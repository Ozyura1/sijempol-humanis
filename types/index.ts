export interface User {
  id: string
  uuid: string
  username: string
  name: string
  role: UserRole
  is_active: boolean
}

export type UserRole = "SUPER_ADMIN" | "ADMIN_KTP" | "ADMIN_IKD" | "ADMIN_PERKAWINAN" | "RT"

export interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
}

export interface KTPSubmission {
  id: string
  uuid: string
  nik: string
  name: string
  address: string
  birth_place: string
  birth_date: string
  gender: "L" | "P"
  religion: string
  marital_status: string
  occupation: string
  nationality: string
  status: "pending" | "verified" | "approved" | "rejected"
  created_at: string
  updated_at: string
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
