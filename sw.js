
const CACHE_NAME = 'dony-burgers-v16';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json,
  '/clientes.json',
  '/icons/logo-gold.png'
];

// Instalação: Guarda a "casca" do sistema
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting(); // Força a atualização imediata
});

// O Pulo do Gato: O evento de Sincronização
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-pedidos') {
    event.waitUntil(enviarPedidosPendentes());
  }
});

async function enviarPedidosPendentes() {
  // 1. Abre o seu "Cofre" (IndexedDB)
  // 2. Pega todos os pedidos que estão com status "pendente"
  // 3. Faz o fetch (envio) para o Firebase
  // 4. Se o Firebase responder OK, deleta do IndexedDB ou marca como "enviado"
}
