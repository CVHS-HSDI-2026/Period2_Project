#!/bin/bash


# First time
# docker run --name postgres-container \
#   -e POSTGRES_PASSWORD=password \
#   -p 5432:5432 \
#   -v postgres_data:/var/lib/postgresql/data \
#   -d postgres

# After first time
docker container start postgres-container