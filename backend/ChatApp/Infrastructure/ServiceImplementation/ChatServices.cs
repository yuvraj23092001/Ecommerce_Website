using ChatApp.Business.ServiceInterfaces;
using ChatApp.Context;
using ChatApp.Context.EntityClasses;
using ChatApp.Models.MessageModel;
using ChatApp.Models.UsersModel;
using System.Reflection.Metadata;

namespace ChatApp.Infrastructure.ServiceImplementation
{
    public class ChatServices : IChatService
    {
        private readonly ChatAppContext context;

        public ChatServices(ChatAppContext context)
        {
            this.context = context;
        }
        // we will just uploading the data files to database 
        public void SendMessage(TextMessageModel message)
        {
            // first check if the reciever is valid or not 
            var profile = context.Profiles.FirstOrDefault(profile => profile.Id == message.ReceiverId);
            if (profile != null && message.Content != null) // checking if the profile is valid and message is not null 
            {

                MessageText msg = new MessageText();
                msg.SenderId = message.SenderId;
                msg.ReceiverId = message.ReceiverId;
                msg.IsReply = false;
                msg.ReplyedToId = (int)message.ReplyedToId;
                msg.Content = message.Content;
                msg.IsSeen = (bool)message.IsSeen;
                msg.DateTime = DateTime.Now;
                context.Messages.Add(msg);
                context.SaveChanges();
            }
        }

        // for implementing this we need to get id from username
        public IEnumerable<TextMessageModel> GetMessages(string username, string selusername)
        {
            int userId = FetchUserIdByUsername(username);
            int seluserId = FetchUserIdByUsername(selusername);

            // Get all messages between both users 
            var list = context.Messages.Where(masg => (masg.SenderId == userId && masg.ReceiverId == seluserId)||(masg.SenderId == seluserId && masg.ReceiverId == userId) );
            // Create a empty list of messages to return back 
            var returnList = new List<TextMessageModel>();
            var response = new List<TextMessageModel>();
            // for each message in list we will add that message to l
            foreach(var content in list)
            {
                
                var obj = new TextMessageModel();
                // will update if needed 
                obj.SenderId = userId == content.SenderId ? content.SenderId : content.ReceiverId;
                obj.ReceiverId = userId == content.ReceiverId ? content.ReceiverId : content.SenderId ;
                obj.Content = content.Content;
                obj.DateTime = content.DateTime;
                // Now implement the IsSeen for both senerios 
                if(content.SenderId == userId)
                {
                    obj.IsSeen = content.IsSeen;
                }
                else
                {
                    obj.IsSeen = true;
                    content.IsSeen = true;
                }

                returnList.Add(obj);
            }
            context.SaveChanges();

            response = returnList.OrderBy(t => t.DateTime).ToList();

            return response;
        }

        

        public int FetchUserIdByUsername(string username)
        {
            Profile user = context.Profiles.FirstOrDefault(profile => profile.UserName == username);
            return user.Id;
        }

        public void DeleteMessage(int MsgId)
        {
            var msg = context.Messages.FirstOrDefault(m => m.Id == MsgId);
            if(msg.Content != null || msg != null) // message not already deleted.
            {
                msg.Content = "";
                
                context.SaveChanges();
            }
        }

        public bool CheckDeletedById(int Id)
        {
            var msg = context.Messages.FirstOrDefault(m => m.Id == Id);
            return msg.Content == "";
        }
        public void ReplyMessage(TextMessageModel message, int MessageId)
        {   
            // If we are trying to reply to a deleted message
            if(CheckDeletedById(MessageId))
            {
                return;
            }
            var profile = context.Profiles.FirstOrDefault(profile => profile.Id == message.ReceiverId);
            if (profile != null && message.Content != null) // checking if the profile is valid and message is not null 
            {
                MessageText msg = new MessageText();
                msg.SenderId = message.SenderId;
                msg.ReceiverId = message.ReceiverId;
                msg.IsReply = true;
                msg.ReplyedToId = MessageId;
                msg.Content = message.Content;
                msg.IsSeen = (bool)message.IsSeen;
                msg.DateTime = DateTime.Now;
                context.Messages.Add(msg);
                context.SaveChanges();
            }
        }

        public IEnumerable<SearchModel> SearchOthers(string searchname, string username)
        {
            var profiles = context.Profiles.Where(u => (u.FirstName.StartsWith(searchname) || u.LastName.StartsWith(searchname)) && u.UserName != username);
            profiles = profiles.OrderBy(u => u.FirstName);
            var list = new List<SearchModel>();
            foreach(var profile in profiles)
            {
                SearchModel Temp = new SearchModel()
                {
                    UserName = profile.UserName,
                    UserId = profile.Id,
                    FirstName = profile.FirstName,
                    LastName = profile.LastName,
                };
                list.Add(Temp);
            }
            return list;
        }
    }
}
