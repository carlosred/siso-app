/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as activities from "../activities.js";
import type * as adminAuth from "../adminAuth.js";
import type * as advisors from "../advisors.js";
import type * as auth from "../auth.js";
import type * as check from "../check.js";
import type * as companies from "../companies.js";
import type * as debug from "../debug.js";
import type * as dump from "../dump.js";
import type * as http from "../http.js";
import type * as reset from "../reset.js";
import type * as scratch from "../scratch.js";
import type * as seed from "../seed.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  activities: typeof activities;
  adminAuth: typeof adminAuth;
  advisors: typeof advisors;
  auth: typeof auth;
  check: typeof check;
  companies: typeof companies;
  debug: typeof debug;
  dump: typeof dump;
  http: typeof http;
  reset: typeof reset;
  scratch: typeof scratch;
  seed: typeof seed;
  users: typeof users;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
