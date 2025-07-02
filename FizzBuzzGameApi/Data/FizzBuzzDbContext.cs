namespace FizzBuzzGameApi.Data
{
    using FizzBuzzGameApi.Models;
    using Microsoft.EntityFrameworkCore;

    public class FizzBuzzDbContext : DbContext
    {
        public FizzBuzzDbContext(DbContextOptions<FizzBuzzDbContext> options) : base(options) { }

        public DbSet<GameDefinition> GameDefinitions { get; set; }
        public DbSet<GameRule> GameRules { get; set; }
        public DbSet<GameSession> GameSessions { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<GameDefinition>()
                .HasMany(g => g.Rules)
                .WithOne(r => r.GameDefinition)
                .HasForeignKey(r => r.GameDefinitionId);

            modelBuilder.Entity<GameSession>()
                .HasOne(s => s.GameDefinition)
                .WithMany()
                .HasForeignKey(s => s.GameDefinitionId);
        }
    }
} 