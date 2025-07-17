# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## TODO

1. Update Readme file.
2. Update the **docker-compose.yaml** file to deploy all the frontend,backend and database properly.
3. Create a deployment manifests for k8s.

## Databas Architecture

![DB Architecture](backend/go/MoviesBookingSystem.svg)

## Application Architecture

## Building container Images

### Frontend

```bash
cd frontend
make create-container-image
```

### Backend

```bash
cd backend
make create-container-image
```

## Deployment

### Docker

```bash
docker-compose up -d
```
