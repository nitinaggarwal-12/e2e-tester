FROM node:22-slim
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8080
COPY package.json ./
COPY server.mjs ./
COPY E2E_MASTER_TEST_PLAN.md README.md e2e_test_cases.csv ./
COPY src ./src
COPY public ./public
COPY data ./data
COPY scripts ./scripts
EXPOSE 8080
CMD ["node", "server.mjs"]
