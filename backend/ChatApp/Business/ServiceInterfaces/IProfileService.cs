using ChatApp.Context.EntityClasses;
using ChatApp.Models.UsersModel;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace ChatApp.Business.ServiceInterfaces
{
    public interface IProfileService
    {
        Profile CheckPassword(LoginModel loginModel);

        Profile RegisterUser(RegisterModel regModel);

        Profile FetchUser(string username);

        Profile UpdateUser(UpdateModel updateModel, string userName);
    }
}
