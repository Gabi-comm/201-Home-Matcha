import next from "eslint-config-next";

const config = [{ ignores: [".next/**", "node_modules/**", "blender/**"] }, ...next];

export default config;
