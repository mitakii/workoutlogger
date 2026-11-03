# syntax=docker/dockerfile:1

# build
FROM --platform=$BUILDPLATFORM mcr.microsoft.com/dotnet/sdk:8.0-noble AS build
ARG TARGETARCH
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

# Restore first so the layer is cached until a csproj changes
COPY PresentationLayer/PresentationLayer.csproj PresentationLayer/
COPY BusinessLayer/BusinessLayer.csproj         BusinessLayer/
COPY DataAccessLayer/DataAccessLayer.csproj     DataAccessLayer/
RUN --mount=type=cache,id=nuget,target=/root/.nuget/packages \
    dotnet restore PresentationLayer/PresentationLayer.csproj -a $TARGETARCH

COPY . .

FROM build AS publish-api
RUN --mount=type=cache,id=nuget,target=/root/.nuget/packages \
    dotnet publish PresentationLayer/PresentationLayer.csproj -c $BUILD_CONFIGURATION -a $TARGETARCH \
      -o /app/publish /p:UseAppHost=false

# api
FROM mcr.microsoft.com/dotnet/aspnet:8.0-noble-chiseled-extra AS api
WORKDIR /app
ENV ASPNETCORE_HTTP_PORTS=8080
EXPOSE 8080
COPY --from=publish-api --chown=app:app /app/publish .
USER app
ENTRYPOINT ["dotnet", "PresentationLayer.dll"]
