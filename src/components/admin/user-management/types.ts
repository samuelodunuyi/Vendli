
export interface UserRole {
  role: string;
  store_id: string | null;
  store_name: string | null;
}

export interface User {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  created_at: string;
  status: 'active' | 'inactive';
  roles: UserRole[];
}

export interface Store {
  id: string;
  name: string;
}

export interface NewUserForm {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: string;
  storeId: string;
}

export interface EditUserForm {
  firstName: string;
  lastName: string;
  phone: string;
  role: string;
  storeId: string;
}

// Supabase query result types
export interface ProfileData {
  id: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  created_at: string | null;
  email: string | null;
}

export interface UserRoleData {
  user_id: string;
  role: string;
  store_id: string | null;
  stores: {
    name: string;
  } | null;
}
