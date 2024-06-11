/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [   
            {
                protocol: 'https',
                hostname: 'img.clerk.com',
            },
            {             
                protocol: 'https',
                hostname: 'res.cloudinary.com',
            },
            {
              protocol: 'https',
              hostname: 'threadwars.blob.core.windows.net',
          },
        ],
    },
};

export default nextConfig;
