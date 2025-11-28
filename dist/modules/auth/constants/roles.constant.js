"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ROLE_HIERARCHY = exports.ROLE_LEVELS = exports.Role = void 0;
var Role;
(function (Role) {
    Role["ADMIN"] = "admin";
    Role["HIM_OFFICER"] = "him_officer";
    Role["NURSE"] = "nurse";
    Role["DOCTOR"] = "doctor";
    Role["MLS"] = "mls";
    Role["CHO"] = "cho";
})(Role || (exports.Role = Role = {}));
exports.ROLE_LEVELS = {
    [Role.ADMIN]: 100,
    [Role.HIM_OFFICER]: 80,
    [Role.DOCTOR]: 70,
    [Role.CHO]: 65,
    [Role.NURSE]: 60,
    [Role.MLS]: 55,
};
exports.ROLE_HIERARCHY = {
    [Role.ADMIN]: [Role.ADMIN, Role.HIM_OFFICER, Role.DOCTOR, Role.CHO, Role.NURSE, Role.MLS],
    [Role.HIM_OFFICER]: [Role.HIM_OFFICER],
    [Role.DOCTOR]: [Role.DOCTOR],
    [Role.CHO]: [Role.CHO],
    [Role.NURSE]: [Role.NURSE],
    [Role.MLS]: [Role.MLS],
};
//# sourceMappingURL=roles.constant.js.map