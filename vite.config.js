import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
	plugins: [react()],
	server: {
		host: '127.0.0.1', // This forces Vite to answer on 127.0.0.1
		port: 5173,
	},
})
