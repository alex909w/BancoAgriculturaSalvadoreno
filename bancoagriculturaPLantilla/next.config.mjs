/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Configuración para manejar las rutas de React Router
  async rewrites() {
    return [
      {
        source: '/login',
        destination: '/src',
      },
      {
        source: '/register',
        destination: '/src',
      },
      {
        source: '/cliente',
        destination: '/src',
      },
      {
        source: '/cajero',
        destination: '/src',
      },
      {
        source: '/gerente',
        destination: '/src',
      },
      {
        source: '/dashboard-:path*',
        destination: '/src',
      },
      {
        source: '/perfil-:path*',
        destination: '/src',
      },
      {
        source: '/configuracion-:path*',
        destination: '/src',
      },
      {
        source: '/crear-cuenta',
        destination: '/src',
      },
      {
        source: '/historial-transacciones',
        destination: '/src',
      },
      {
        source: '/registro-cliente',
        destination: '/src',
      },
      {
        source: '/transaccion',
        destination: '/src',
      },
      {
        source: '/prestamos',
        destination: '/src',
      },
    ]
  },
  // Configuración para servir assets estáticos
  async headers() {
    return [
      {
        source: '/assets/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
}

export default nextConfig
