using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ReactServer.Models
{
    public class User
    {
        private int userID;
        private string userEmail;
        private string userName;

        public int UserID { get { return userID; } set { userID = value; } }
        public string UserName { get { return userName; } set { userName = value; } }
        public string UserEmail { get => userEmail; set => userEmail = value; }

        public User() { }

        public User(int userID, string userName, string userEmail)
        {
            UserID = userID;
            UserName = userName;
            UserEmail = userEmail;
        }

        public int InsertUser(User user)
        {
            DBservices dbs = new DBservices();

            int numAffected = dbs.insertUser(user);
            return numAffected;
        }

        public int CheckListOwnerShip(int UserID,int ListID)
        {
            DBservices dbs = new DBservices();
            return dbs.CheckListOwnerShip(UserID,ListID);
        }

        public List<User> GetUsers()
        {
            DBservices dbs = new DBservices();
            return dbs.getUsers();
        }

        public List<HubList> GetUserLists(int userId)
        {
            DBservices dbs = new DBservices();
            return dbs.getUserLists(userId);
        }

        public int UserExist(string email)
        {
            DBservices dbs = new DBservices();
            return dbs.userExist(email);
        }
        
        public int GetUserId(string email)
        {
            DBservices dbs = new DBservices();
            return dbs.GetUserIdByEmail(email);
        }
        public int CheckIfUserAlready(int UserID,int ListID)
        {
            DBservices dbs = new DBservices();
            return dbs.CheckIfUserAlreadyInList(UserID,ListID);
        }

        public int EditUser(User user)
        {
            DBservices dbs = new DBservices();

            int numAffected = dbs.editUser(user);
            return numAffected;
        }

        public void InserAuthUser(int ListId,int UserId)
        {
            DBservices dbs = new DBservices();
            dbs.InserAuthUserToList(ListId,UserId);
            
        }

        public void RemoveUserFromTable(int UserId, int ListId)
        {
            DBservices dbs = new DBservices();
            dbs.RemoveUserFromUsersLists(UserId, ListId);
        }
    }
}