# Makefile
deploy-app:
	docker-compose up -d
	sleep 10
	docker-compose up -d

destroy-app:
	docker-compose down

remove-frontend-image:
	docker rmi vidly-frontend

remove-backend-image:
	docker rmi vidly-backend

build-frontend-image:
	cd frontend;rm -rf build/;npm run build;docker build --no-cache -t vidly-frontend .

build-backend-image:
	cd backend/go;docker build --no-cache -t vidly-backend .

build-images:
	$(MAKE) build-frontend-image
	$(MAKE) build-backend-image

remove-images:
	$(MAKE) remove-frontend-image
	$(MAKE) remove-backend-image

rebuild-images:
	$(MAKE) remove-images
	$(MAKE) build-images

refresh-app:
	$(MAKE) destroy-app
	$(MAKE) rebuild-images
	$(MAKE) deploy-app



.PHONY: deploy-app destroy-app remove-frontend-image remove-backend-image build-frontend-image build-backend-image refresh-app rebuild-images build-images remove-images