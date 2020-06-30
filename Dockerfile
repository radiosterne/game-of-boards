FROM mcr.microsoft.com/dotnet/core/aspnet:3.1

WORKDIR /app

COPY ./out .
ENV ASPNETCORE_URLS=http://+:5080
ENTRYPOINT ["dotnet", "GameOfBoards.Web.dll"]