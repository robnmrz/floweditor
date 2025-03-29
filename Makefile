build:
	@echo "Building..."
	DOCKER_BUILDKIT=1 docker build \
	-t ${IMAGE_NAME}:${IMAGE_TAG} \
	.

run:
	@docker compose up -d

server: stop build run

stop:
	@docker compose down
