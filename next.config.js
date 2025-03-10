/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        // Настройка кэширования и потоковой передачи для видеофайлов
        source: '/videos/:path*',
        headers: [
          {
            key: 'Cache-Control',
            // Кэшировать на 1 год (31536000 секунд)
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'Accept-Ranges',
            value: 'bytes',
          },
          {
            key: 'Content-Type',
            value: 'video/mp4',
          }
        ],
      },
      {
        // Настройка кэширования для изображений
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            // Кэшировать на 1 год
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  // Если у вас уже есть другие настройки, добавьте их сюда
};

module.exports = nextConfig; 