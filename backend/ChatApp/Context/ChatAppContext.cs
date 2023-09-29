using ChatApp.Context.EntityClasses;
using Microsoft.EntityFrameworkCore;

namespace ChatApp.Context
{
    public class ChatAppContext : DbContext
    {
        public ChatAppContext(DbContextOptions<ChatAppContext> options): base(options) 
        {
        }

        public virtual DbSet<Profile> Profiles { get; set; }

        public virtual DbSet<MessageText> Messages { get; set; }
    }
}
