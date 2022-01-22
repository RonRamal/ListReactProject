using ReactServer.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ReactServer.Models
{
    public class HubList
    {
        private int listID;
        private string listName;
        private string imageURL;
        private string listDescription;
        private int ownerUserID;
        private List<Item> items;




        public HubList() {


        }

        public HubList(string listName, string imageURL, string listDescription, int listID, int ownerUserID, List<Item> items)
        {
            ListName = listName;
            ImageURL = imageURL;
            ListDescription = listDescription;
            ListID = listID;
            OwnerUserID = ownerUserID;
            Items = items;
        }

        public string ListName { get => listName; set => listName = value; }
        public string ImageURL { get => imageURL; set => imageURL = value; }
        public string ListDescription { get => listDescription; set => listDescription = value; }
        public int ListID { get => listID; set => listID = value; }
        public int OwnerUserID { get => ownerUserID; set => ownerUserID = value; }
        public List<Item> Items { get => items; set => items = value; }

        public void InsertHubList(HubList hubList)
        {
            DBservices dbs = new DBservices();

            dbs.insertHubList(hubList);
        }

       

        public List<HubList> getHubLists()
        {
            DBservices dbs = new DBservices();
            return dbs.getHubList();
        }

        //public HubList getSelectedList()
        //{
        //    DBservices dbs = new DBservices();
        //    return dbs.getSelectedListwithID();

        //}
        public void DeleteHubList(int ListID,int UserID)
        {
            DBservices dbs = new DBservices();

            dbs.deleteHubList(ListID, UserID);
        }
    }
}