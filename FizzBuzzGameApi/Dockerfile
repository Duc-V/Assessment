FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["FizzBuzzGameApi.csproj", "./"]
RUN dotnet restore "FizzBuzzGameApi.csproj"
COPY . .
WORKDIR "/src"
RUN dotnet build "FizzBuzzGameApi.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "FizzBuzzGameApi.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
# Create database directory and ensure it's writable
RUN mkdir -p /app/Data && touch /app/Data/fizzbuzz.db && chmod 666 /app/Data/fizzbuzz.db
ENTRYPOINT ["dotnet", "FizzBuzzGameApi.dll"] 