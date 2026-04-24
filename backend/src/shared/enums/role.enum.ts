// src/shared/enums/role.enum.ts
export enum Role {
    SUPER_ADMIN = 'super_admin',  // platform owner — full access
    ADMIN = 'admin',        // org/team admin — manage users, senders
    MEMBER = 'member',       // can create & send campaigns
    VIEWER = 'viewer',       // read-only — see analytics, no sending
}