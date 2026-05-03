// sw.js — O Rei da Coxinha
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

// ── Recebe push do servidor e mostra notificação ──
self.addEventListener('push', event => {
    const data = event.data ? event.data.json() : {};
    event.waitUntil(
        self.registration.showNotification(data.title || '🔔 Novo Pedido!', {
            body: data.body || 'Um novo pedido chegou!',
            icon: '/icone.png',
            badge: '/icone.png',
            vibrate: [300, 100, 300, 100, 400],
            requireInteraction: true,
            tag: data.tag || 'pedido-' + Date.now(),
            data: { url: '/adm.html' }
        })
    );
});

// ── Clicou na notificação → abre o app ──
self.addEventListener('notificationclick', event => {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
            for (const c of list) {
                if (c.url.includes('adm') && 'focus' in c) return c.focus();
            }
            return clients.openWindow('/adm.html');
        })
    );
});
