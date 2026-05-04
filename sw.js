// sw.js — Service Worker com suporte a notificações nativas
const CACHE_NAME = 'rei-coxinha-v1';

// Instala o SW
self.addEventListener('install', e => {
    self.skipWaiting();
});

self.addEventListener('activate', e => {
    e.waitUntil(clients.claim());
});

// Recebe mensagem do app principal e dispara notificação nativa
self.addEventListener('message', e => {
    if (e.data && e.data.tipo === 'novo_pedido') {
        const { nome, total } = e.data;
        self.registration.showNotification('🔔 Novo Pedido!', {
            body: `${nome} · R$ ${total}`,
            icon: './icone.png',
            badge: './icone.png',
            tag: 'novo-pedido-' + Date.now(),
            renotify: true,
            vibrate: [200, 100, 200, 100, 200],
            requireInteraction: false,
            silent: false
        });
    }
});

// Clique na notificação: abre ou foca o app
self.addEventListener('notificationclick', e => {
    e.notification.close();
    e.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
            for (const c of list) {
                if (c.url && c.focus) return c.focus();
            }
            return clients.openWindow('./');
        })
    );
});
