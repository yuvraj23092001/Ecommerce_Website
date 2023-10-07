using System.ComponentModel.DataAnnotations;

namespace ChatApp.Models.UsersModel
{
    public class SearchModel
    {
        public string UserName { get; set; }

        public int  UserId { get; set; }

        public string FirstName { get; set; }
        
        public string LastName { get; set; }
    }
}
