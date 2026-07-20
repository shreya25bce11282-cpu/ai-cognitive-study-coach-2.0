# Backend Dockerfile — builds just the Express API.
# The frontend is a static site and is best deployed separately (Vercel/Netlify)
# rather than served from this container; see README for the split deploy setup.
FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY server ./server

EXPOSE 5000

CMD ["node", "server/src/app.js"]
