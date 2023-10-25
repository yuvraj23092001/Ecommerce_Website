using ChatApp.Business.ServiceInterfaces;
using ChatApp.Context;
using ChatApp.Context.EntityClasses;
using ChatApp.Models.MessageModel;
using Microsoft.AspNetCore.SignalR;

namespace ChatApp
{
    public class ChatHub : Hub
    {
        private readonly ChatAppContext context;
        private readonly IChatService chatService;

        public ChatHub(ChatAppContext context, IChatService chatservice)
        {
            this.context = context;
            this.chatService = chatservice;
        }

        // build in method for starting the connection when we start connection
        public override Task OnConnectedAsync()
        {
            return base.OnConnectedAsync();
        }

        public override Task OnDisconnectedAsync(Exception exception)
        {
            if (exception != null)
            {
                Console.WriteLine(exception.Message);
            }
            return base.OnDisconnectedAsync(exception);
        }

        public async Task ConnectDone(string userName)
        {
            string curSignalId = Context.ConnectionId;
            Profile user = context.Profiles.FirstOrDefault(p => p.UserName == userName);

            if (user != null)
            {

                if (this.context.Connections.Any(u => u.ProfileId == user.Id))
                {
                    IEnumerable<Connections> users = this.context.Connections.Where(u => u.ProfileId == user.Id);
                    this.context.Connections.RemoveRange(users);
                    context.SaveChanges();
                }

                Connections connUser = new Connections()
                {
                    ProfileId = user.Id,
                    SignalId = curSignalId,
                    TimeStamp = DateTime.Now,
                };
                await context.Connections.AddAsync(connUser);
                context.SaveChanges();

                await Clients.Caller.SendAsync("ResponseSuccess", user);
            }
            else
            {
                await Clients.Client(curSignalId).SendAsync("ResponseFail");
            }

        }

        public void ConnectRemove(string userName)
        {
            if (userName != null)
            {
                int userId = context.Profiles.FirstOrDefault(u => u.UserName == userName).Id;
                var connect = context.Connections.FirstOrDefault(u => u.ProfileId == userId);
                context.Connections.Remove(connect);
                context.SaveChanges();
            }
            else
            {
                return;
            }
        }

        public async Task sendMsg(TextMessageModel message)
        {
            MessageText newMessage = null;
            TextMessageModel response = null;
            string replyMessage;
            /*int messageFromId = chatService.FetchUserIdByUsername();
            int messageToId = chatService.FetchUserIdByUsername(message.MessageTo);*/
            newMessage = new MessageText
            {
                Content = message.Content,
                DateTime = DateTime.Now,
                SenderId = message.SenderId,
                ReceiverId = message.ReceiverId,
                ReplyedToId = message.ReplyedToId,
                IsReply = (bool)message.IsReply,
                IsSeen = false,
                Type = "Null",
            };
            context.Messages.Add(newMessage);
            context.SaveChanges();
            if (message.ReplyedToId == 0)
            {
                replyMessage = null;
            }
            else
            {
                var msg = context.Messages.FirstOrDefault(msg => msg.Id == message.ReplyedToId);
                replyMessage = msg.Content;
            }
            response = new TextMessageModel
            {
                Id = newMessage.Id,
                Content = newMessage.Content,
                DateTime = DateTime.Now,
                SenderId = message.SenderId,
                ReceiverId = message.ReceiverId,
                ReplyedToId = message.ReplyedToId,
                IsReply = (bool)message.IsReply,
                IsSeen = false,
                Type = "Null",
            };
            this.chatService.ResponsesToUsersMessage(message.SenderId, message.ReceiverId, response);
        }




    }
}
