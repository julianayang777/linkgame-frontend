interface Config {
    serverHost: string;
    serverPort: number;
}

const config: Config = {
    serverHost: import.meta.env.VITE_SERVER_HOST,
    serverPort: Number(import.meta.env.VITE_SERVER_PORT),
};

export default config;