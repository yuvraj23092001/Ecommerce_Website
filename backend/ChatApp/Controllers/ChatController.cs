using ChatApp.Business.ServiceInterfaces;
using ChatApp.Context;
using ChatApp.Context.EntityClasses;
using ChatApp.Models.MessageModel;
using ChatApp.Models.UsersModel;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.VisualBasic.FileIO;
using System;
using System.Data;

namespace ChatApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatController : ControllerBase
    {
        private readonly IChatService chatService;
        private readonly ChatAppContext context;

        public ChatController(IChatService chatService, ChatAppContext context)
        {
            this.chatService = chatService;
            this.context = context;
        }

        [HttpPost("Addmsg")]
        public IActionResult Addmsg([FromForm] TextMessageModel message)
        {
            if (ModelState.IsValid)
            {
                if (message == null)
                {
                    return BadRequest(new { Message = "Cannot send a empty message." });
                }
                chatService.SendMessage(message);
                return Ok(new { Message = "message added succesfully." });
            }
            return BadRequest(new { Message = "Model State is not valid." });
        }

        [HttpPost("Addreplymsg")]
        public IActionResult AddReplymsg([FromForm] TextMessageModel message, [FromQuery] int messageId)
        {
            if (ModelState.IsValid)
            {
                if (message == null)
                {
                    return BadRequest(new { Message = "Cannot send a empty message." });
                }
                chatService.ReplyMessage(message, messageId);
                return Ok(new { Message = "message added succesfully." });
            }
            return BadRequest(new { Message = "Model State is not valid." });
        }


        [HttpGet("GetMessages")]

        public async Task<IActionResult> Getmsgs([FromQuery] string username, [FromQuery] string selusername)
        {
            /*try
            {
                string connectionString = "conn";
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("sp_UpdateUsersFromAPI", connection))
                    {
                        // Open connection when applicable
                        if (connection.State != ConnectionState.Open)
                            await connection.OpenAsync();

                        // Configure command
                        cmd.CommandType = CommandType.StoredProcedure;
                        
                        // parameter set kar diye
                        cmd.Parameters.Add(new SqlParameter("@PrimaryEmail", 2));

                        // Execute command
                        var res = cmd.ExecuteScalar();

                        // res.HasRows;
                        // res.Read()


                    }
                }
            }
            catch (SqlException ex)
            {
                log.LogInformation(ex.ToString());
                LogExceptionInDb(ex, "Save External Experts", log);
                AddExceptionIfNotExists(ex.Message, "SaveExternalExpert");
            }
*/


            if (ModelState.IsValid)
            {
                var MessageList = chatService.GetMessages(username, selusername);
                if (MessageList == null)
                {
                    return Ok(new { Message = "No Messages" });
                }
                return Ok(MessageList);
            }
            return BadRequest(new { Message = "Model State is not valid." });
        }

        // Method to search other users across the chatapp using their username 

        [HttpGet("SearchOthers")]

        public IActionResult GetOtherUsers([FromQuery] string searchname, [FromQuery] string username)
        {
            //if (ModelState.IsValid)
            //{
            //    var searchModels = chatService.SearchOthers(searchname, username);

            //    if (searchModels.IsNullOrEmpty())
            //    {
            //        return Ok(new { Message = "No User With Given Name.", searchModels });
            //    }

            //    return Ok(searchModels);
            //}
            //return BadRequest(new { Message = "Model State is not valid." });

            var searchModels = chatService.SearchOthers(searchname, username);

            if (searchModels.IsNullOrEmpty())
            {
                return Ok(new { Message = "No User With Given Name.", searchModels });
            }

            return Ok(searchModels);
        }

        [HttpGet("RecentMessages")]
        
        public IActionResult GetConversations([FromQuery]string userName)
        {
            var usrId = chatService.FetchUserIdByUsername(userName);
            var conversations = context.ConversationResults.FromSqlRaw("EXEC dbo.GetAllConversationByUserId @p0", usrId).ToList();
            return Ok(conversations);


        }

        [HttpGet("RecentMessagesssss")]

        public IActionResult GetConversati([FromQuery] int usrId , [FromQuery] int otherId)
        {

            var conversations = context.ConversationResults.FromSqlRaw("EXEC dbo.GetAllConversationByUserIdsBoth @UserID, @OtherID", new SqlParameter("UserID", usrId), new SqlParameter("OtherID", otherId));
            return Ok(conversations);


        }


        [HttpDelete("DeleteMessage")]

        public IActionResult Delete(int MessageId)
        {
            if (ModelState.IsValid)
            {
                chatService.DeleteMessage(MessageId);
                return Ok();
            }
            return BadRequest(new { Message = "Model State is not valid." });

        }


    }
}
