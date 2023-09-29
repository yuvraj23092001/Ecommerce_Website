using ChatApp.Business.ServiceInterfaces;
using ChatApp.Models.MessageModel;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

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

        public IActionResult Getmsgs(string username, string selusername)
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

        // make it delete by id 
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
