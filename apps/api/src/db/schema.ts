import {
  pgTable, serial, varchar, text, timestamp, integer, boolean, uniqueIndex
} from "drizzle-orm/pg-core";

// Користувачі з ролями
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull(),
  passwordHash: text("password_hash").notNull(),
  role: varchar("role", { length: 20 }).notNull().default("manager"), // 'admin' | 'manager' | 'viewer'
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
}, (t) => ({
  emailIdx: uniqueIndex("users_email_unique").on(t.email),
}));

export const affiliates = pgTable("affiliates", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  status: varchar("status", { length: 24 }).notNull().default("active"), // active | paused | banned | pending
  geos: text("geos").default(""),        // простий CSV для MVP (UA,PL,DE)
  sources: text("sources").default(""),  // CSV (FB,TT,GG)
  managerId: integer("manager_id"),      // users.id того, хто веде
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
}, (t) => ({
  emailIdx: uniqueIndex("affiliates_email_unique").on(t.email),
}));

export const offers = pgTable("offers", {
  id: serial("id").primaryKey(),
  programId: integer("program_id"),
  name: text("name").notNull(),
  payoutType: text("payout_type").notNull().default("cpa"), // cpa / revshare
  payoutValue: integer("payout_value").notNull().default(0), // в центах або мін. одиниці
  status: text("status").notNull().default("active"),
  landingUrls: text("landing_urls").notNull().default(""), // CSV або JSON у майбутньому
  createdAt: timestamp("created_at").defaultNow(),
});

export const links = pgTable("links", {
  id: serial("id").primaryKey(),
  affiliateId: integer("affiliate_id").notNull(),
  offerId: integer("offer_id").notNull(),
  linkUid: text("link_uid").notNull().unique(), // короткий код
  split: text("split").default("100"),          // '100' або '70|30' під порядок landingUrls
  utmTemplate: text("utm_template").default(""),
  createdAt: timestamp("created_at").defaultNow(),
});

// (Опціонально) мультиоренда на майбутнє
export const workspaces = pgTable("workspaces", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  ownerUserId: integer("owner_user_id").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const workspaceMembers = pgTable("workspace_members", {
  id: serial("id").primaryKey(),
  workspaceId: integer("workspace_id").notNull(),
  userId: integer("user_id").notNull(),
  role: varchar("role", { length: 20 }).notNull().default("member"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
}, (t) => ({
  uniquePerWs: uniqueIndex("ws_member_unique").on(t.workspaceId, t.userId),
}));

// Refresh-токени для відкликання (revocation)
export const refreshTokens = pgTable("refresh_tokens", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  token: text("token").notNull(), // зберігаємо jti/або сам токен (краще jti)
  isRevoked: boolean("is_revoked").notNull().default(false),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
}, (t) => ({
  tokIdx: uniqueIndex("refresh_token_unique").on(t.token),
}));
