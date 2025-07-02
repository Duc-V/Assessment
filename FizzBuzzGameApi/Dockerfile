# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["FizzBuzzGameApi.csproj", "./"]
RUN dotnet restore "./FizzBuzzGameApi.csproj"
COPY . .
RUN dotnet publish "FizzBuzzGameApi.csproj" -c Release -o /app/publish

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .
COPY fizzbuzz.db ./fizzbuzz.db
EXPOSE 5000
ENV ASPNETCORE_URLS=http://+:5000
ENTRYPOINT ["dotnet", "FizzBuzzGameApi.dll"] 