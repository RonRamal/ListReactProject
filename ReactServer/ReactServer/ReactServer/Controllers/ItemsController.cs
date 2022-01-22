using ReactServer.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace ReactServer.Controllers
{
    public class ItemsController : ApiController
    {
        // GET api/<controller>
        public IEnumerable<Item> Get()
        {
            Item myItem = new Item();
            return myItem.GetItems();
        }

        // GET api/<controller>/5
        public List<Item> Get([FromUri] int id)
        {
            Item myItem = new Item();
            //return myItem.GetItems();
            return myItem.GetListItems(id);

        }

        // POST api/<controller>
        public List<Item> Post([FromBody]Item ItemsPost)
        {
            Item myItem = new Item();
            myItem.InsertItem(ItemsPost);
            return myItem.GetListItems(ItemsPost.ListID);

        }

        // PUT api/<controller>/5
        public List<Item> Put([FromUri]int id, [FromBody]Item NewItem)
        {     
            Item myItem = new Item();
            myItem.EditItem(id, NewItem);

            return myItem.GetListItems(NewItem.ListID);
        }

        // DELETE api/<controller>/5
        public int Delete(int id)
        {
            Item myItem = new Item();
            myItem.DeleteItem(id);

            return id;
        }
    }
}