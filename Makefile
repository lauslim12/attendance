.PHONY: clean-api
clean-api:
	cd api && rm -rf node_modules && rm -rf dist && rm -rf logs

.PHONY: clean-web
clean-web:
	cd web && rm -rf node_modules && rm -rf .next

.PHONY: clean
clean:
	cd api && rm -rf node_modules && rm -rf dist && rm -rf logs
	cd web && rm -rf node_modules && rm -rf .next

.PHONY: build
build:
	cd api && yarn --frozen-lockfile && yarn build && cp .env dist && cp -r modules/email/views dist/modules/email
	cd web && yarn --frozen-lockfile && yarn build