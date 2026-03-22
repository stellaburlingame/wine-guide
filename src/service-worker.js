/* eslint-disable no-restricted-globals */

// This service worker can be customized!
// See https://developers.google.com/web/tools/workbox/modules
// for the list of available Workbox modules, or add any other
// code you'd like.
// You can also remove this file if you'd prefer not to use a
// service worker, and the Workbox build step will be skipped.

import { clientsClaim } from 'workbox-core';
import { ExpirationPlugin } from 'workbox-expiration';
import { precacheAndRoute, createHandlerBoundToURL } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate } from 'workbox-strategies';
import { enable as enableNavigationPreload } from 'workbox-navigation-preload';

clientsClaim();
enableNavigationPreload();
// Precache build assets injected by Workbox
precacheAndRoute(self.__WB_MANIFEST);

// Notify all open clients (tabs/windows) about SW events
async function broadcastMessage(message) {
  const windowClients = await self.clients.matchAll({
    type: 'window',
    includeUncontrolled: true,
  });
  for (const client of windowClients) {
    client.postMessage(message);
  }
}

const fileExtensionRegexp = new RegExp('/[^/?]+\\.[^/]+$');
registerRoute(
  ({ request, url }) => {
    // Only handle navigations
    if (request.mode !== 'navigate') return false;
    // Skip URLs starting with /_
    if (url.pathname.startsWith('/_')) return false;
    // Skip if it looks like a file (has an extension)
    if (url.pathname.match(fileExtensionRegexp)) return false;
    return true;
  },
  // Network-first for HTML with fallback to the precached app shell
  async ({ event }) => {
    try {
      // Use navigation preload if available (faster)
      const preloadResponse = await event.preloadResponse;
      if (preloadResponse) {
        return preloadResponse;
      }
      // Fetch a fresh app shell
      const indexUrl = process.env.PUBLIC_URL + '/index.html';
      const networkResponse = await fetch(indexUrl, { cache: 'reload' });

      // Update a small HTML cache for quick back/forward nav
      const htmlCache = await caches.open('html-app-shell');

      // Compare with the previously cached HTML (if any)
      const cachedResponse = await htmlCache.match(indexUrl);
      let hasChanged = false;

      if (cachedResponse) {
        // Prefer cheap header comparisons when possible
        const cachedEtag = cachedResponse.headers.get('etag');
        const networkEtag = networkResponse.headers.get('etag');
        const cachedLastModified = cachedResponse.headers.get('last-modified');
        const networkLastModified = networkResponse.headers.get('last-modified');

        if (cachedEtag && networkEtag) {
          hasChanged = cachedEtag !== networkEtag;
        } else if (cachedLastModified && networkLastModified) {
          hasChanged = cachedLastModified !== networkLastModified;
        } else {
          // Fallback: compare body text (more expensive)
          const [cachedText, networkText] = await Promise.all([
            cachedResponse.clone().text(),
            networkResponse.clone().text(),
          ]);
          hasChanged = cachedText !== networkText;
        }
      } else {
        // No cached shell yet: treat as first-time cache population
        hasChanged = true;
      }

      // Store the latest shell
      await htmlCache.put(indexUrl, networkResponse.clone());

      // Tell the app a newer shell exists (UI can prompt user)
      if (hasChanged) {
        await broadcastMessage({ type: 'APP_SHELL_UPDATED' });
      }

      return networkResponse;
    } catch (err) {
      // Offline or failed network — serve the precached app shell
      return createHandlerBoundToURL(process.env.PUBLIC_URL + '/index.html')({ event });
    }
  }
);

// An example runtime caching route for requests that aren't handled by the
// precache, in this case same-origin .png requests like those from in public/
registerRoute(
  // Add in any other file extensions or routing criteria as needed.
  ({ url }) =>
    url.origin === self.location.origin &&
    /\.(png|json|svg)$/.test(url.pathname),
  new StaleWhileRevalidate({
    cacheName: 'assets',
    plugins: [
      // Ensure that once this runtime cache reaches a maximum size the
      // least-recently used images are removed.
      new ExpirationPlugin({ maxEntries: 100 }),
    ],
  })
);

// self.addEventListener('install', (event) => {
//   event.waitUntil(
//     caches.open('assets').then((cache) => {
//       return cache.addAll([
//         '/bootstrap.min.css',
//         // add other resources as needed
//       ]);
//     })
//   );
// });


// This allows the web app to trigger skipWaiting via
// registration.waiting.postMessage({type: 'SKIP_WAITING'})
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Any other custom service worker logic can go here.
