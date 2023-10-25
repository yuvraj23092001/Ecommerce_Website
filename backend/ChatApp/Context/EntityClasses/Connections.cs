using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace ChatApp.Context.EntityClasses
{
    public class Connections
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [ForeignKey("Profile")]
        public int ProfileId { get; set; }

        public Profile Profile { get; set; }

        [Required]
        [StringLength(22)]
        public string SignalId { get; set; }

        [Required]
        public DateTime TimeStamp { get; set; } = DateTime.Now;
    }
}
