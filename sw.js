/**
 * SISTEMA DE ENGENHARIA JDP - SERVICE WORKER PROFISSIONAL
 * Desenvolvido para: José Divino Prado da Lapa
 * Tecnologia: Workbox 7.0.0 (Google)
 */

// 1. Importação da Biblioteca Central do Workbox
importScripts('https://storage.googleapis.com/workbox-cdn/releases/7.0.0/workbox-sw.js');

if (workbox) {
  console.log("🎉 Sucesso! O porteiro (Service Worker) do Engenheiro José Divino está ativo.");

  // --- 2. PRECACHING (Blindagem de Arquivos Críticos) ---
  // Estes arquivos são baixados imediatamente na instalação para garantir o modo Offline.
  workbox.precaching.precacheAndRoute([
    { url: './index.html', revision: '1.0.5' },
    { url: './', revision: '1.0.5' },
    { url: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css', revision: '1.0.0' },
    { url: 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js', revision: '1.0.0' }
  ]);

  // --- 3. ESTRATÉGIAS DE ROTEAMENTO (Inteligência de Tráfego) ---

  // 3.1 Assets Estáticos (CSS, JS, Imagens, Fontes) - ESTRATÉGIA: CACHE FIRST
  // Se já estiver no celular, abre instantaneamente.
  workbox.routing.registerRoute(
    /\.(?:js|css|png|gif|jpg|jpeg|svg|woff|woff2|ttf|eot)$/,
    new workbox.strategies.CacheFirst({
      cacheName: 'jdp-assets-estaticos',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 60,                // Limita a 60 arquivos no cofre
          maxAgeSeconds: 30 * 24 * 60 * 60, // Expira após 30 dias (Engenharia de Memória)
        }),
        new workbox.cacheableResponse.CacheableResponsePlugin({
          statuses: [0, 200],            // Aceita arquivos de CDN externa (como FontAwesome)
        }),
      ],
    })
  );

  // 3.2 Páginas de Navegação (HTML principal) - ESTRATÉGIA: NETWORK FIRST
  // Tenta buscar a versão mais nova na rede. Se falhar (offline), entrega a do cache.
  workbox.routing.registerRoute(
    ({ request }) => request.mode === 'navigate',
    new workbox.strategies.NetworkFirst({
      cacheName: 'jdp-paginas-html',
      plugins: [
        new workbox.cacheableResponse.CacheableResponsePlugin({
          statuses: [200],
        }),
      ],
    })
  );

  // 3.3 Dados de API e JSON - ESTRATÉGIA: STALE WHILE REVALIDATE
  // Entrega o dado antigo rápido e atualiza o banco de dados em segundo plano.
  workbox.routing.registerRoute(
    /.*\/api\/.*/,
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: 'jdp-dados-dinamicos',
    })
  );

  // --- 4. CONTROLE DE CICLO DE VIDA ---
  // Garante que o sistema se atualize assim que você subir uma versão nova.
  workbox.core.skipWaiting();
  workbox.core.clientsClaim();
  workbox.precaching.cleanupOutdatedCaches();

} else {
  console.error("😢 Erro Crítico: Workbox não pôde ser carregado. Verifique a conexão.");
}
