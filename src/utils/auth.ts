import { store } from "@store/index";
import { logout } from "@store/slices/authSlice";
import { clearTokens } from "@services/tokenStorage";
import { queryClient } from "@utils/queryClient";

/**
 * The one way to log out.
 *
 * Logging out has three jobs, and the codebase previously did them in different
 * combinations across six call sites:
 *
 *   1. clear credentials   (clearTokens)
 *   2. reset app state     (dispatch logout)
 *   3. purge cached data   (queryClient.clear)
 *
 * No site did the third, so the previous user's cached profile, orders and
 * addresses survived logout and were served to whoever signed in next on that
 * device. Shared devices are common for this app's audience (CA-08).
 *
 * `clearTokens` is awaited here. It used to be fired and forgotten inside the
 * logout reducer, so a failed wipe was silently swallowed and left credentials
 * on the device while the UI showed the user as logged out (CA-06).
 *
 * See review/phase-3-consumer-app/BUG-REPORT.md CA-06, CA-08.
 */
export async function performLogout(): Promise<void> {
  store.dispatch(logout());
  await clearTokens();
  queryClient.clear();
}
