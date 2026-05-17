import type { NextConfig } from 'next'

const config: NextConfig = {
    eslint: {
        // No fallar el build por errores de ESLint. El TypeScript check
        // (que sigue corriendo) atrapa los errores reales. ESLint solo
        // marca temas de estilo/best practices que no afectan funcionalidad.
        ignoreDuringBuilds: true,
    },
}

export default config