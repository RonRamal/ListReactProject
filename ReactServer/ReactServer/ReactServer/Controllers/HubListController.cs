using ReactServer.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace ReactServer.Controllers
{
    public class HubListController : ApiController
    {
        // GET api/<controller>
        public IEnumerable<HubList> Get()
        {
            HubList hl = new HubList();
            return hl.getHubLists();
        }

        // GET api/<controller>/5
        [Route("api/HubList")]
        public List<HubList> Get([FromUri]int UserID)
        {
            User myUser = new User();
            return myUser.GetUserLists(UserID);
        }

        // POST api/<controller>
        [HttpPost]
        [Route("api/HubList")]
        public HubList Post([FromBody]HubList hubList)
        {
            HubList hubList1 = new HubList();
            hubList1.InsertHubList(hubList);
            return hubList;
        }

        // PUT api/<controller>/5
        public void Put(int id, [FromBody]string value)
        {

        }

        // DELETE api/<controller>/5
        [Route("api/HubList")]
        public int Delete(int UserID, int ListID)
        {
            HubList myList = new HubList();
            User myUser = new User();
            int CheckResult = myUser.CheckListOwnerShip(UserID, ListID);
            //1 Means he is the TableOwner
            if (CheckResult == 1)
            {
                myList.DeleteHubList(ListID,UserID);
            }
            return CheckResult;
        }
    }
}