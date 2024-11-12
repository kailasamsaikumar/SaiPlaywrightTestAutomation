# syntax=docker/dockerfile:1.4

FROM ubuntu:22.04

ARG DEBIAN_FRONTEND=noninteractive

RUN --mount=type=cache,target=/var/lib/apt,sharing=locked \
    apt-get update -yq && \
    apt-get install -yq curl dumb-init

RUN --mount=type=cache,target=/var/lib/apt,sharing=locked \
    curl -sL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install --no-install-recommends -yq nodejs

WORKDIR /opt/uptime

COPY ./package.json ./

RUN --mount=type=cache,target=/opt/uptime/.cache,sharing=locked \
    npm config set cache /opt/uptime/.cache/npm && \
    npm install && \
    npx playwright install chromium --with-deps

COPY ./tests ./test
COPY ./utils ./utils
COPY ./tsconfig.json ./playwright.config.ts ./

ENTRYPOINT ["/usr/bin/dumb-init"]

CMD ["npx", "playwright", "test", "--reporter=list"]
