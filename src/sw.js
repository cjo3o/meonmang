import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { NetworkFirst } from 'workbox-strategies';

precacheAndRoute(self.__WB_MANIFEST);
cleanupOutdatedCaches();

// SPA 내 라우팅 요청은 네트워크 우선
registerRoute(
    ({ request }) => request.mode === 'navigate',
    new NetworkFirst()
);

// 푸시 알림 수신 시 처리
self.addEventListener('push', (event) => {
    const data = event.data?.json() || {
        title: '미세먼지 알림',
        body: '대기 상태가 나쁩니다. 마스크 착용을 권장합니다.',
        url: '/'
    };

    const options = {
        body: data.body,
        icon: '/icons/icon-192x192.png', // 적절한 PWA 아이콘 경로로 바꾸세요
        badge: '/icons/icon-72x72.png',
        data: {
            url: data.url
        }
    };

    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

// 알림 클릭 시 특정 페이지로 이동
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    const targetUrl = event.notification.data?.url || '/';

    event.waitUntil(
        self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            for (const client of clientList) {
                if (client.url === targetUrl && 'focus' in client) {
                    return client.focus();
                }
            }

            if (self.clients.openWindow) {
                return self.clients.openWindow(targetUrl);
            }
        })
    );
});