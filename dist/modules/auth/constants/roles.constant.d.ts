export declare enum Role {
    ADMIN = "admin",
    HIM_OFFICER = "him_officer",
    NURSE = "nurse",
    DOCTOR = "doctor",
    MLS = "mls",
    CHO = "cho"
}
export declare const ROLE_LEVELS: Record<Role, number>;
export declare const ROLE_HIERARCHY: Record<Role, Role[]>;
