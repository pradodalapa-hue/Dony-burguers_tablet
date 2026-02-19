const assets = [
  './',
  './index.html',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(cacheName).then(cache => cache.addAll(assets)));
});

self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(res => res || fetch(e.request)));
});
       // Importa a biblioteca Workbox do CDN
importScripts('https://storage.googleapis.com/workbox-cdn/releases/7.0.0/workbox-sw.js');

// Verifica se o Workbox foi carregado com sucesso
if (workbox) {
  console.log(`🎉 Sucesso! Workbox carregado para Service Worker.`);

  // --- 1. Roteamento e Estratégias de Caching ---
  
  // 1.1 Cache de Assets Estáticos (CSS, JS, Imagens, Fontes)
  // Estratégia: Cache First (Cachear primeiro)
  // Serve instantaneamente o arquivo do cache, pois esses arquivos raramente mudam.
  workbox.routing.registerRoute(
    // Expressão regular para capturar URLs que terminam em extensões comuns
    /\.(?:js|css|png|gif|jpg|jpeg|svg|woff|woff2|ttf|eot)$/,
    new workbox.strategies.CacheFirst({
      cacheName: 'static-assets-cache',
      plugins: [
        // Mantém apenas 60 entradas no cache e as exclui após 30 dias
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 60,
          maxAgeSeconds: 30 * 24 * 60 * 60, 
        }),
      ],
    })
  );

  // 1.2 Cache para Chamadas de API (Dados JSON)
  // Estratégia: Stale While Revalidate (Obsoleto Enquanto Revalida)
  // Serve os dados do cache imediatamente (para velocidade) e, em segundo plano, busca a versão mais recente na rede.
  workbox.routing.registerRoute(
    // Rota para qualquer URL que contenha 'api/' (assumindo que suas APIs sigam esse padrão)
    /.*\/api\/.*/,
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: 'api-data-cache',
      plugins: [
        // Garante que o cache só armazene respostas com Status 200 (Sucesso)
        new workbox.cacheableResponse.CacheableResponsePlugin({
          statuses: [200],
        }),
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 50,
          maxAgeSeconds: 24 * 60 * 60, // 24 horas
        }),
      ],
    })
  );

  // 1.3 Cache para Páginas HTML
  // Estratégia: Network First (Rede Primeiro)
  // Tenta a rede para garantir o HTML mais atualizado, mas usa o cache como fallback em caso de falha (offline).
  workbox.routing.registerRoute(
    // Rota para a raiz (página principal)
    new RegExp('^' + self.location.origin + '/$'),
    new workbox.strategies.NetworkFirst({
      cacheName: 'html-cache',
      plugins: [
        new workbox.cacheableResponse.CacheableResponsePlugin({
          statuses: [200],
        }),
      ],
    })
  );

  // --- 2. Limpeza de Cache Antigo ---
  
  // Isso garante que versões antigas do Service Worker não deixem lixo de cache.
  workbox.core.clientsClaim();
  workbox.core.skipWaiting();
  workbox.precaching.cleanupOutdatedCaches();
  
} else {
  console.log(`😢 ERRO: Workbox não foi carregado. A funcionalidade offline estará desabilitada.`);
    }
