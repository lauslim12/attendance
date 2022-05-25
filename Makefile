# Makefile to run helper scripts.
.PHONY: bootstrap-codespaces clean clean-api clean-web install-all build build-api build-web build-web-production build-production refresh-app-production

# Bootstrap application for GitHub Codespaces.
bootstrap-codespaces:
	cd web && yarn --frozen-lockfile
	cd api && yarn --frozen-lockfile
	cp api/.env.example api/.env

# Clean scripts.
clean: clean-web clean-api

clean-api:
	cd api && rm -rf node_modules && rm -rf dist && rm -rf logs && rm -rf .dccache

clean-web:
	cd web && rm -rf node_modules && rm -rf .next && rm -rf .dccache

# Install scripts.
install-all:
	cd web && yarn --frozen-lockfile
	cd api && yarn --frozen-lockfile

# Build scripts.
build: build-api build-web

build-api: install-all
	cd api && yarn build && cp .env dist && cp -r modules/email/views dist/modules/email

build-web: install-all
	cd web && yarn build

build-web-production: install-all
	cd web && NGINX=true yarn build

# Production use scripts for Droplets/VPSes.
build-production: build-api build-web-production

refresh-app-production:
	sudo systemctl restart attendance-api
	sudo systemctl restart attendance-web
	sudo systemctl restart nginx