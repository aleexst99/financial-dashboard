FROM node:22-alpine AS build
WORKDIR /workspace

COPY package.json package-lock.json .npmrc ./
RUN npm ci

COPY . .
RUN npx nx build api

FROM node:22-alpine AS runtime
WORKDIR /app

COPY --from=build /workspace/dist/apps/api ./
COPY --from=build /workspace/node_modules ./node_modules

EXPOSE 3000
CMD ["node", "main.js"]