{
  description = "Vireon Condominium development environment";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-26.05";
  };

  outputs =
    { nixpkgs, ... }:
    let
      supportedSystems = [
        "x86_64-linux"
        "aarch64-linux"
      ];
      forAllSystems = nixpkgs.lib.genAttrs supportedSystems;
    in
    {
      devShells = forAllSystems (
        system:
        let
          pkgs = import nixpkgs { inherit system; };
          bunVersion = "1.3.14";
          bunHashes = {
            aarch64-linux = "sha256-on/7Y6gxA3WDbg1vZorhf6jY0YuIw3yCHGUzGXOhmjs=";
            x86_64-linux = "sha256-lR7iruhV8IWVruxiJSJqKY0/6oOj3NZGXAnLzN9+hI8=";
          };
          projectBun = pkgs.bun.overrideAttrs (_: {
            version = bunVersion;
            src = pkgs.fetchurl {
              url = "https://github.com/oven-sh/bun/releases/download/bun-v${bunVersion}/bun-linux-${
                if system == "x86_64-linux" then "x64" else "aarch64"
              }.zip";
              hash = bunHashes.${system};
            };
          });
        in
        {
          default = pkgs.mkShell {
            packages = [
              projectBun
              pkgs.nodejs

              pkgs.git
              pkgs.just
              pkgs.jq
              pkgs.direnv
              pkgs.nix-direnv
              pkgs.fish

              pkgs.openssl

              pkgs.docker-client
              pkgs.docker-compose
              pkgs.postgresql_17

              pkgs.nixfmt
            ];

            shellHook = ''
              echo ""
              echo "Vireon Development Environment"
              echo "--------------------------------"
              echo "Bun:    $(bun --version)"
              echo "Node:   $(node --version)"
              echo "Git:    $(git --version)"
              echo ""
              echo "Available commands:"
              just --list --unsorted
              echo ""
            '';
          };
        }
      );

      formatter = forAllSystems (
        system:
        let
          pkgs = import nixpkgs { inherit system; };
        in
        pkgs.nixfmt
      );
    };
}
