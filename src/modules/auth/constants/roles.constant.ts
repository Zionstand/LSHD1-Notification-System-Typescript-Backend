export enum Role {
  ADMIN = 'admin',
  HIM_OFFICER = 'him_officer',
  NURSE = 'nurse',
  DOCTOR = 'doctor',
  MLS = 'mls',
  CHO = 'cho',
}

export const ROLE_LEVELS: Record<Role, number> = {
  [Role.ADMIN]: 100,
  [Role.HIM_OFFICER]: 80,
  [Role.DOCTOR]: 70,
  [Role.CHO]: 65,
  [Role.NURSE]: 60,
  [Role.MLS]: 55,
};

// Role hierarchy - higher level roles can access lower level resources
export const ROLE_HIERARCHY: Record<Role, Role[]> = {
  [Role.ADMIN]: [Role.ADMIN, Role.HIM_OFFICER, Role.DOCTOR, Role.CHO, Role.NURSE, Role.MLS],
  [Role.HIM_OFFICER]: [Role.HIM_OFFICER],
  [Role.DOCTOR]: [Role.DOCTOR],
  [Role.CHO]: [Role.CHO],
  [Role.NURSE]: [Role.NURSE],
  [Role.MLS]: [Role.MLS],
};
