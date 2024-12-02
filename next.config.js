module.exports = {
    eslint:{
        ignoreDuringBuilds: true,
    },
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: `${process.env.FM_CLIENT_ADMIN_API_URL}/:path*`,
            },
        ];
    },
};