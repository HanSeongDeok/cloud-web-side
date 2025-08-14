# ───── build 단계 ─────
FROM node:22-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ───── production 단계 ─────
FROM node:22-alpine
WORKDIR /app
# serve 설치
RUN npm install -g serve
# 빌드 산출물 복사
COPY --from=builder /app/dist ./dist
# (Optional) CORS 헤더 등 미들웨어 추가 가능
EXPOSE 3000
# 3000번 포트로 정적 파일 서빙
CMD ["serve", "-s", "dist", "-l", "3000"]
