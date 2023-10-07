﻿using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using ChatApp.Business.Helpers;
using ChatApp.Business.ServiceInterfaces;
using ChatApp.Context.EntityClasses;
using ChatApp.Models.UsersModel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace ChatApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [AllowAnonymous]
    public class AccountController : ControllerBase
    {
        private IConfiguration _config;
        private readonly IProfileService _profileService;
        public AccountController(IConfiguration config, IProfileService profileService)
        {
            _config = config;
            _profileService = profileService;
        }

        [HttpPost("Login")]
        public IActionResult Login([FromBody] LoginModel loginModel)
        {
            if (ModelState.IsValid)
            {
                IActionResult response = Unauthorized(new { Message = "Invalid Credentials." });
                var user = _profileService.CheckPassword(loginModel);

                if (user != null)
                {
                    var tokenString = GenerateJSONWebToken(user);
                    response = Ok(new { token = tokenString });
                }

                return response;
            }
            return BadRequest(ModelState);
        }

        [HttpPost("Register")]
        public IActionResult Register([FromBody] RegisterModel registerModel)
        {
            // we can create a custom validation for checking if the email is already registered or not . 
            // we will also check if the state is valid or not. 
            if (ModelState.IsValid)
            {
                var user = _profileService.RegisterUser(registerModel);
                if (user != null)
                {
                    var tokenString = GenerateJSONWebToken(user);
                    return Ok(new { token = tokenString, user = user });
                }
                return BadRequest(new { Message = "User Already Exists. Please use different email and UserName." });
            }
            return BadRequest(ModelState);
        }

        // Creating a post method to update user information 

        [HttpPost("update-user")]
        public IActionResult UpdateUserProfile([FromForm] UpdateModel updateModel, [FromHeader] string UserName)
        {
            if (ModelState.IsValid)
            {   
                if (updateModel.UserName == UserName)
                {
                    Profile user = _profileService.UpdateUser(updateModel, UserName);
                    return Ok(new { Message = " Updated the user", token = user });
                }
                return BadRequest( new {Message = "Unable to Update the user . Try again with correct information", ModelState});
            }
            return BadRequest(ModelState);

        }

        [HttpGet("get-user")]

        public IActionResult GetUserProfile([FromQuery]string UserName)
        {
            if (ModelState.IsValid)
            {
                var user = _profileService.GetUser
                    (UserName);
                return Ok(user);
            }
            return BadRequest(ModelState);
        }

        private string GenerateJSONWebToken(Profile profileInfo)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[] {
                    new Claim(JwtRegisteredClaimNames.Sub, profileInfo.UserName),
                    new Claim(JwtRegisteredClaimNames.Email, profileInfo.Email),
                    new Claim(ClaimsConstant.FirstNameClaim, profileInfo.FirstName),
                    new Claim(ClaimsConstant.LastNameClaim, profileInfo.LastName),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
                    };

            var token = new JwtSecurityToken(_config["Jwt:Issuer"],
            _config["Jwt:Issuer"],
            claims,
            expires: DateTime.Now.AddMinutes(120),
            signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }


    }
}