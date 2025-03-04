import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  plugins: [react()],
  define: {
    global: "window", // פתרון לבעיה של "global is not defined"
  },
  resolve: {
    alias: {
      "sockjs-client": path.resolve(
        __dirname,
        "node_modules/sockjs-client/dist/sockjs.js"
      ),
    },
  },
});
