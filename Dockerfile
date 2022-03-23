FROM node:14.17.6 as builder


ENV NODE_ENV build


WORKDIR /home/node


COPY . /home/node


RUN npm ci \
    && npm run build \
    && npm prune --production


# ---


FROM node:14.17.6-alpine3.13


ENV NODE_ENV production


USER node
WORKDIR /home/node


COPY --from=builder /home/node/package*.json /home/node/
COPY --from=builder /home/node/node_modules/ /home/node/node_modules/
COPY --from=builder /home/node/dist/ /home/node/dist/


CMD ["node", "dist/main.js"]