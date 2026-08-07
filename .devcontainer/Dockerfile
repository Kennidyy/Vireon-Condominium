FROM mcr.microsoft.com/devcontainers/base:debian

RUN apt-get update \
    && apt-get install --yes --no-install-recommends \
        ca-certificates \
        curl \
        xz-utils \
    && rm -rf /var/lib/apt/lists/* \
    && mkdir --mode=0755 /nix \
    && chown vscode:vscode /nix

USER vscode

RUN curl --proto '=https' --tlsv1.2 --fail --location \
        https://nixos.org/nix/install \
        --output /tmp/install-nix.sh \
    && sh /tmp/install-nix.sh --no-daemon \
    && rm /tmp/install-nix.sh

ENV PATH="/home/vscode/.nix-profile/bin:${PATH}"
ENV NIX_CONFIG="experimental-features = nix-command flakes"

WORKDIR /workspaces/Vireon-Condominium
