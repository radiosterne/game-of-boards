FROM mcr.microsoft.com/dotnet/aspnet:5.0

ENV CORECLR_ENABLE_PROFILING=1 \
CORECLR_PROFILER={36032161-FFC0-4B61-B559-F6C5D41BAE5A} \
CORECLR_NEWRELIC_HOME=/usr/local/newrelic-netcore20-agent \
CORECLR_PROFILER_PATH=/usr/local/newrelic-netcore20-agent/libNewRelicProfiler.so \
NEW_RELIC_LICENSE_KEY=eu01xxc7439312345c7b7a25388c01b58d15NRAL \
NEW_RELIC_APP_NAME=KB

WORKDIR /app

ARG NRPackageName=newrelic-netcore20-agent_8.29.0.0_amd64.deb

COPY ./$NRPackageName ./newrelic/

RUN dpkg -i ./newrelic/$NRPackageName

COPY ./out .
ENV ASPNETCORE_URLS=http://+:5080
ENTRYPOINT ["dotnet", "GameOfBoards.Web.dll"]
