using ReactServer.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace ReactServer.Controllers
{
    public class ListUserController : ApiController
    {
        // GET api/<controller>
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET api/<controller>/5
        [HttpGet]
        [Route("api/ListUser")]
        public int Get(string email)
        {
            User myUser = new User();
            return myUser.GetUserId(email);
        }

        // POST api/<controller>
        [HttpPost]
        [Route("api/ListUser")]
        public int Post(int ListId,[FromBody]string email)
        {
            User user = new User();
            string emailLower = email.ToLower();


            int result = user.UserExist(emailLower);
            if (result == 1){

                int userId = user.GetUserId(emailLower);
                int checkResult = user.CheckIfUserAlready(userId, ListId);
                if (checkResult == 0){
                    user.InserAuthUser(ListId, userId);
                    return 1;
                }else{
                    return 0;
                }
            }
            else{
                return 2;
            }    
        }

        // PUT api/<controller>/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/<controller>/5
        [Route("api/ListUser")]
        public int Delete(int UserID, int ListID)
        {
            User myUser = new User();
            int CheckResult = myUser.CheckListOwnerShip(UserID, ListID);
            //1 Means he is the TableOwner
            if (CheckResult == 1)
            {
                return 0;
            }
            else{

                myUser.RemoveUserFromTable(UserID, ListID);
                return 1;
            }   
        }
    }
}