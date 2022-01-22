using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using ReactServer.Models;

namespace ReactServer.Controllers
{
    public class UserController : ApiController
    {
        // GET api/<controller>
        public IEnumerable<User> Get()
        {
            User myUser = new User();
            return myUser.GetUsers();
        }

        // GET api/<controller>/5
        [HttpGet]
        [Route("api/User")]
        public int Get(string email)
        {
            User myUser = new User();
            return myUser.UserExist(email);

        }     

        // POST api/<controller>
        [HttpPost]
        [Route("api/User")]
        public int Post([FromBody]User user)
        {
            User myUser = new User();
            string emailLower = user.UserEmail.ToLower();
            user.UserEmail = emailLower;
            myUser.InsertUser(user);
            return myUser.UserExist(user.UserEmail);
        }

        // PUT api/<controller>/5
        public int Put([FromBody]User user)
        {
            User myUser = new User();
            myUser.EditUser(user);
            return myUser.UserExist(user.UserEmail);
        }

        // DELETE api/<controller>/5
        public void Delete(int id)
        {

        }
    }
}