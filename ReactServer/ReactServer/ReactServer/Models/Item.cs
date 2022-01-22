using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ReactServer.Models
{
    public class Item
    {
        private int itemID;
        private string name;
        private int quantity;
        private int listID;

        public int ItemID { get => itemID; set => itemID = value; }
        public string Name { get => name; set => name = value; }
        public int Quantity { get => quantity; set => quantity = value; }
        public int ListID { get => listID; set => listID = value; }



        //Empty Constructor
        public Item()
        {
   
        }

        //Full Constructor
        public Item(int itemID, string name, int quantity, int listID)
        {
            ItemID = itemID;
            Name = name;
            Quantity = quantity;
            ListID = listID;
        }

        public int InsertItem(Item item)
        {
            DBservices dbs = new DBservices();

            int numAffected = dbs.insertListItem(item);
            return numAffected;
        }
        
        public void DeleteItem(int id)
        {
            DBservices dbs = new DBservices();

            dbs.DeleteItemFromList(id);
        }

        public int EditItem(int ItemID,Item newItem)
        {
            DBservices dbs = new DBservices();

            int numAffected = dbs.EditItemInList(newItem, ItemID);
            return numAffected;
        }

        public List<Item> GetItems()
        {
            DBservices dbs = new DBservices();
            return dbs.getItems();
        }

        public List<Item> GetListItems(int id)
        {
            DBservices dbs = new DBservices();
            return dbs.GetItemstoList(id);
        }
    }
}