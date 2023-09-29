using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ChatApp.Context.EntityClasses
{
    public class MessageText
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        public string Content { get; set; }

        [Required]
        public int SenderId { get; set; }

        [Required]
        public int ReceiverId { get; set; }
        [Required]
        public DateTime DateTime { get; set; }

        public bool IsSeen { get; set; } = false;

        public bool IsReply { get; set; } = false;

        public int ReplyedToId { get; set; } = 0;
    }
}
