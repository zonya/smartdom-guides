# Build stage
FROM node:22-alpine AS build
# OG slike se iscrtavaju na build-u preko sharp-a, koji tekst crta sistemskim
# fontovima. Alpine ih nema nijedan, pa bi bez ovoga naslovi izašli prazni —
# build ne bi pukao, slike bi samo bile prazne. DejaVu pokriva č/ć/ž/š/đ.
RUN apk add --no-cache fontconfig font-dejavu
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Serve stage
FROM caddy:2-alpine
COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=build /app/dist /srv
