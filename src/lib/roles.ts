export enum UserRole {
  SuperAdmin = 0,
  StoreAdmin = 1,
  Employee = 2,
  Customer = 3,
}

export const ROLE_LABELS: Record<UserRole, string> = {
  [UserRole.SuperAdmin]: "Super Admin",
  [UserRole.StoreAdmin]: "Store Admin",
  [UserRole.Employee]: "POS User",
  [UserRole.Customer]: "Customer",
};

export const ADMIN_ROLES = [UserRole.SuperAdmin, UserRole.StoreAdmin];
export const POS_ROLES = [UserRole.StoreAdmin, UserRole.Employee];
export const STAFF_ROLES = [UserRole.SuperAdmin, UserRole.StoreAdmin, UserRole.Employee];

export const roleLabel = (role: number | null | undefined) =>
  ROLE_LABELS[role as UserRole] ?? "Unknown";

/** Store-scoped roles only ever see data for their own store. */
export const isStoreScoped = (role: number | null | undefined) =>
  role === UserRole.StoreAdmin || role === UserRole.Employee;

/** Roles a given actor is allowed to assign when creating or editing users. */
export const assignableRoles = (actor: UserRole): UserRole[] =>
  actor === UserRole.SuperAdmin
    ? [UserRole.SuperAdmin, UserRole.StoreAdmin, UserRole.Employee]
    : actor === UserRole.StoreAdmin
      ? [UserRole.Employee]
      : [];

export const homePathFor = (role: number | null | undefined) => {
  if (role === UserRole.SuperAdmin || role === UserRole.StoreAdmin) return "/admin";
  if (role === UserRole.Employee) return "/pos";
  return "/";
};
