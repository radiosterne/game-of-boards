#!/bin/sh

if [ $# -eq 0 ]
  then
    echo "No app version supplied"
    exit 1
fi

dotnet publish ./GameOfBoards.Web/GameOfBoards.Web.csproj --configuration Release --output ./out -p:OnlyLinuxReferences=true
cd ./GameOfBoards.Web/Client
yarn install && yarn build-prod && cp -r ./bundles ../../out/Client
cd ../../
docker build -t docker.blumenkraft.me/nand/gob-app:test$1 .
docker push docker.blumenkraft.me/nand/gob-app:test$1
