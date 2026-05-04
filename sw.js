// sw.js — Service Worker com suporte a notificações nativas + Web Push
const CACHE_NAME = 'rei-coxinha-v1';

self.addEventListener('install', e => {
    self.skipWaiting();
});

self.addEventListener('activate', e => {
    e.waitUntil(clients.claim());
});

// ── Mensagem do app (aba aberta) ───────────────────────
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

// ── Web Push do servidor (funciona com aba fechada!) ───
self.addEventListener('push', e => {
    let data = { nome: 'Cliente', total: '0,00', titulo: '🔔 Novo Pedido!' };
    if (e.data) {
        try { data = { ...data, ...e.data.json() }; } catch (_) {}
    }
    const options = {
        body: `${data.nome} · R$ ${data.total}`,
        icon: './icone.png',
        badge: './icone.png',
        tag: 'push-pedido',
        renotify: true,
        vibrate: [200, 100, 200, 100, 200],
        requireInteraction: true,
        silent: false,
        data: data
    };
    e.waitUntil(
        self.registration.showNotification(data.titulo, options)
    );
});

// ── Clique na notificação ──────────────────────────────
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
