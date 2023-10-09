using ChatApp.Business.ServiceInterfaces;
using ChatApp.Models.MessageModel;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace ChatApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatController : ControllerBase
    {
        private readonly IChatService chatService;

        public ChatController(IChatService chatService) { 
          this.chatService = chatService;
        }

        [HttpPost("Addmsg")]
        public IActionResult Addmsg([FromForm] TextMessageModel message)
        {
            if(ModelState.IsValid)
            {
                if(message == null)
                {
                    return BadRequest(new { Message = "Cannot send a empty message." });
                }
                chatService.SendMessage(message);
                return Ok(new { Message = "message added succesfully." });
            }
            return BadRequest(new { Message = "Model State is not valid."});
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
                chatService.ReplyMessage(message,messageId);
                return Ok(new { Message = "message added succesfully." });
            }
            return BadRequest(new { Message = "Model State is not valid." });
        }


        [HttpGet("GetMessages")]

        public IActionResult Getmsgs([FromQuery]string username, [FromQuery] string selusername)
        {
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

        public IActionResult GetOtherUsers([FromQuery]string searchname, [FromQuery]string username)
        {
            if (ModelState.IsValid)
            {
                var searchModels = chatService.SearchOthers(searchname, username);

                if (searchModels.IsNullOrEmpty())
                {
                    return BadRequest(new { Message = "No User With Given Name." });
                }

                return Ok(searchModels);
            }
            return BadRequest(new { Message = "Model State is not valid." });
        }

        [HttpDelete("DeleteMessage")]

        public IActionResult Delete(int MessageId) {
            if (ModelState.IsValid)
            {
                chatService.DeleteMessage(MessageId);
                return Ok();
            }
            return BadRequest(new { Message = "Model State is not valid." });

        }


    }
}
