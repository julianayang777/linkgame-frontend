interface Config {
  baseUrl: string;
}

const config: Config = {
  baseUrl: import.meta.env.VITE_API_BASE,
};

export default config;
