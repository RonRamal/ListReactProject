using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.SqlClient;
using System.Web.Configuration;
using System.Data;
using System.Text;
using ReactServer.Models;

/// <summary>
/// DBServices is a class created by me to provides some DataBase Services
/// </summary>
public class DBservices
{
    public SqlDataAdapter da;
    public DataTable dt;

    public DBservices()
    {
        //
        // TODO: Add constructor logic here
        //
    }
    //--------------------------------------------------------------------------------------------------
    // This method creates a connection to the database according to the connectionString name in the web.config 
    //--------------------------------------------------------------------------------------------------
    public SqlConnection connect(String conString)
    {

        // read the connection string from the configuration file
        string cStr = WebConfigurationManager.ConnectionStrings[conString].ConnectionString;
        SqlConnection con = new SqlConnection(cStr);
        con.Open();
        return con;
    }

    // Create the SqlCommand
    //---------------------------------------------------------------------------------
    private SqlCommand CreateCommand(String CommandSTR, SqlConnection con)
    {

        SqlCommand cmd = new SqlCommand(); // create the command object

        cmd.Connection = con;              // assign the connection to the command object

        cmd.CommandText = CommandSTR;      // can be Select, Insert, Update, Delete 

        cmd.CommandTimeout = 10;           // Time to wait for the execution' The default is 30 seconds

        cmd.CommandType = System.Data.CommandType.Text; // the type of the command, can also be stored procedure

        return cmd;
    }

    //Get ALL USER DETAILS
    public List<User> getUsers()
    {
        List<User> userList = new List<User>();
        SqlConnection con = null;
        try
        {
            con = connect("DBConnectionString"); // create a connection to the database using the connection String defined in the web config file

            String selectSTR = "SELECT * FROM User_CS";
            SqlCommand cmd = new SqlCommand(selectSTR, con);
            SqlDataReader dr = cmd.ExecuteReader(CommandBehavior.CloseConnection); // CommandBehavior.CloseConnection: the connection will be closed after reading has reached the end

            while (dr.Read())
            {   
                User user = new User();
                user.UserID = Convert.ToInt32(dr["UserID"]);
                user.UserEmail = (string)dr["UserEmail"];
                user.UserName = (string)dr["UserName"];
                userList.Add(user);
            }
            return userList;
        }
        catch (Exception ex)
        {
            throw (ex);
        }
        finally
        {
            if (con != null)
            {
                con.Close();
            }
        }
    }


    //CHECK IF USER IS ALREADY IN THE JUNCTION TABLE USER_LISTS_CS
    public int CheckIfUserAlreadyInList(int UserID,int ListID)
    {
        SqlConnection con = null;
        int queryResult = 0;
        try
        {
            con = connect("DBConnectionString"); // create a connection to the database using the connection String defined in the web config file
            String selectSTR=  "SELECT Count(UserID) FROM User_Lists_CS WHERE UserID = "+UserID+" AND"+" ListID ="+ListID;
            SqlCommand cmd = new SqlCommand(selectSTR, con);
            queryResult = (int)cmd.ExecuteScalar();         
            return queryResult;
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }
        finally
        {
            if (con != null)
            {
                con.Close();
            }
        }
    }


    //CHECK IF USERID IS THE OWNER OF THE TABLE
    //RETURN 1 IF YES RETURN 0 IF NO
    public int CheckListOwnerShip(int UserID,int ListID)
    {
        SqlConnection con = null;
        int queryResult = 0;
        try
        {
            con = connect("DBConnectionString"); // create a connection to the database using the connection String defined in the web config file

            String selectSTR = " SELECT (OwnerUserID) FROM HubList_CS WHERE ListID="+ListID;
            SqlCommand cmd = new SqlCommand(selectSTR, con);
            SqlDataReader dr = cmd.ExecuteReader(CommandBehavior.CloseConnection); // CommandBehavior.CloseConnection: the connection will be closed after reading has reached the end
            // Read till the end of the data into a row
            while (dr.Read())
            {
                queryResult = Convert.ToInt32(dr["OwnerUserID"]);
            }
            if (queryResult == UserID){
                return 1;
            }else{
                return 0;
            }
        }
        catch (Exception ex)
        {
            throw (ex);
        }
        finally
        {
            if (con != null)
            {
                con.Close();
            }
        }
    }


    //check if user is already in the system
    public int userExist(string email)
    {
        //int returnUserId = 0;
        int queryResult = 0;
        SqlConnection con = null;
        try
        {
            con = connect("DBConnectionString"); // create a connection to the database using the connection String defined in the web config file
            String selectSTR = "SELECT count(UserID) FROM User_CS Where UserEmail='"+email+"'";
            SqlCommand cmd = new SqlCommand(selectSTR, con);
            queryResult = (int)cmd.ExecuteScalar();

            return queryResult;
            //SqlDataReader dr = cmd.ExecuteReader(CommandBehavior.CloseConnection); // CommandBehavior.CloseConnection: the connection will be closed after reading has reached the end
            //while (dr.Read())
            //{   // Read till the end of the data into a row         
            //    returnUserId = Convert.ToInt32(dr["UserId"]);
            //}
            //return returnUserId;

        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }
        finally
        {
            if (con != null)
            {
                con.Close();
            }
        }
    }

    //Get USERID FROM DATABASE IF USER EXISTS
    public int GetUserIdByEmail(string email)
    {
        int returnUserId = 0;
        SqlConnection con = null;
        try
        {
            con = connect("DBConnectionString"); // create a connection to the database using the connection String defined in the web config file
            String selectSTR = "SELECT (UserID) FROM User_CS Where UserEmail='" + email + "'";
            SqlCommand cmd = new SqlCommand(selectSTR, con);
            SqlDataReader dr = cmd.ExecuteReader(CommandBehavior.CloseConnection); // CommandBehavior.CloseConnection: the connection will be closed after reading has reached the end
            while (dr.Read())
            {    
                returnUserId = Convert.ToInt32(dr["UserId"]);
            }
            return returnUserId;

        }
        catch (Exception ex)
        {
            throw (ex);
        }
        finally
        {
            if (con != null)
            {
                con.Close();
            }
        }
    }

    //Insert Ingredient to DB
    public int insertUser(User user)
    {
        SqlConnection con=null;
        SqlCommand cmd;
        try
        {
            con = connect("DBConnectionString"); // create the connection 
            String cStr = BuildInsertCommand(user);      // helper method to build the insert string
            cmd = CreateCommand(cStr, con);             // create the command    
            int numEffected = cmd.ExecuteNonQuery(); // execute the command
            return numEffected;
        }
        catch (Exception ex)
        {
            Console.WriteLine("Inside catch block. Exception: {0}", ex.Message);
            throw (ex);
        }
        finally
        {
            if (con != null)
            {
                con.Close();
            }
        }
    }
    //--------------------------------------------------------------------
    // Build the Insert command String
    //--------------------------------------------------------------------
    private String BuildInsertCommand(User user)
    {
        String command;

        StringBuilder sb = new StringBuilder();
        // use a string builder to create the dynamic string

        sb.AppendFormat("Values('{0}','{1}')", user.UserEmail, user.UserName);
        String prefix = "INSERT INTO User_CS " + "(UserEmail,UserName)";
        command = prefix + sb.ToString();

        return command;
    }
    

    //EDIT USER DETAILS
    public int editUser(User user)
    {
        SqlConnection con = null;
        SqlCommand cmd;
        try
        {
            con = connect("DBConnectionString"); // create the connection
            String cStr = "UPDATE User_CS set UserName = '" + user.UserName + "' where UserID = " + user.UserID; // helper method to build the insert string
            cmd = CreateCommand(cStr, con);             // create the command
            int numEffected = cmd.ExecuteNonQuery(); // execute the command
            return numEffected;
        }
        catch (Exception ex)
        {
            throw (ex);
        }
        finally
        {
            if (con != null)
            {
                con.Close();
            }
        }
    }


    //DELETE LIST FROM DATABASE
    public void deleteHubList(int ListID, int UserID)
    {
        SqlConnection con = null;
        SqlCommand cmd1;
        SqlCommand cmd2;
        try
        {
            con = connect("DBConnectionString"); // create the connection
            String Cstr1 = "DELETE FROM User_Lists_CS WHERE ListID=" + ListID;
            String cStr2 = "DELETE FROM HubList_CS where ListID = " + ListID;

            //DELETE ROW FROM USERS_LISTS_CS
            cmd1 = CreateCommand(Cstr1, con); // create the command
            cmd1.ExecuteScalar(); // execute the command

            //DELETE ROW FROM HUBLIST_CS
            cmd2 = CreateCommand(cStr2, con); // create the command
            cmd2.ExecuteScalar(); // execute the command
        }
        catch (Exception ex)
        {
            throw (ex);
        }
        finally
        {
            if (con != null)
            {
                con.Close();
            }
        }
    }


    //DELETE LIST FROM DATABASE
    public void RemoveUserFromUsersLists(int UserId, int ListId)
    {
        SqlConnection con = null;
        SqlCommand cmd;
        try
        {
            con = connect("DBConnectionString"); // create the connection
            String Cstr = "DELETE FROM User_Lists_CS WHERE ListID=" +ListId+" AND " + "UserID="+ UserId;

            //DELETE ROW FROM USERS_LISTS_CS
            cmd = CreateCommand(Cstr, con); // create the command
            cmd.ExecuteScalar(); // execute the command
        }
        catch (Exception ex)
        {
            throw (ex);
        }
        finally
        {
            if (con != null)
            {
                con.Close();
            }
        }
    }

    //Get All Lists from DB
    public List<HubList> getHubList()
    {
        SqlConnection con = null;
        //  SqlConnection con2 = null;
        try
        {
            con = connect("DBConnectionString"); // create a connection to the database using the connection String defined in the web config file

            String selectSTR = "SELECT * FROM HubList_CS";
            SqlCommand cmd = new SqlCommand(selectSTR, con);
            //  SqlCommand cmd2;

            // get a reader
            SqlDataReader dr = cmd.ExecuteReader(CommandBehavior.CloseConnection); // CommandBehavior.CloseConnection: the connection will be closed after reading has reached the end
                                                                                   // SqlDataReader dr2;

            List<HubList> HubLists = new List<HubList>();

            while (dr.Read())
            {   // Read till the end of the data into a row
                HubList hubList = new HubList();

                hubList.ListID = Convert.ToInt32(dr["ListID"]);
                hubList.OwnerUserID = Convert.ToInt32(dr["OwnerUserID"]);
                hubList.ListName = (string)dr["ListName"];
                hubList.ImageURL = (string)dr["ImageURL"];
                hubList.ListDescription = (string)dr["ListDescription"];

                HubLists.Add(hubList);
            }

            con.Close();
            cmd.Connection.Close();

            return HubLists;
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }
        finally
        {
            if (con != null)
            {
                con.Close();
            }
        }
    }

    //Get All Lists from DB by USERID
    public List<HubList> getUserLists(int userID)
    {
        SqlConnection con = null;
        //  SqlConnection con2 = null;
        try
        {
            con = connect("DBConnectionString"); // create a connection to the database using the connection String defined in the web config file

            String selectSTR = "SELECT HL.ListID,ListName,ListDescription,OwnerUserID,ImageURL FROM HubList_CS AS HL";
            selectSTR += " INNER JOIN User_Lists_CS AS UL ON HL.ListID = UL.ListID";
            selectSTR += " INNER JOIN User_CS AS U ON U.UserID = UL.UserID";
            selectSTR += " WHERE U.UserID=" + userID;
            SqlCommand cmd = new SqlCommand(selectSTR, con);

            SqlDataReader dr = cmd.ExecuteReader(CommandBehavior.CloseConnection); // CommandBehavior.CloseConnection: the connection will be closed after reading has reached the end
                                                          
            List<HubList> HubLists = new List<HubList>();

            while (dr.Read())
            {   
                HubList hubList = new HubList();
                hubList.ListID = Convert.ToInt32(dr["ListID"]);
                hubList.OwnerUserID = Convert.ToInt32(dr["OwnerUserID"]);
                hubList.ListName = (string)dr["ListName"];
                hubList.ImageURL = (string)dr["ImageURL"];
                hubList.ListDescription = (string)dr["ListDescription"];
                HubLists.Add(hubList);
            }

            con.Close();
            cmd.Connection.Close();

            return HubLists;
        }
        catch (Exception ex)
        {
            throw (ex);
        }
        finally
        {
            if (con != null)
            {
                con.Close();
            }
        }
    }

    //Insert HubList to database
    public void insertHubList(HubList hList)
    {
        SqlConnection con = null;   
        SqlCommand cmd1;
        SqlCommand cmd2;

        try
        {
            con = connect("DBConnectionString");  // create the connection

            String cStr1 = BuildInsertCommand(hList);    // helper method to build the insert string

            cmd1 = CreateCommand(cStr1, con);                   // create the command
            Int32 CreatedListID = Convert.ToInt32(cmd1.ExecuteScalar()); // execute the command

            String cStr2 = BuildInsertCommandUser_Lists(hList,CreatedListID);    // helper method to build the insert string

            cmd2 = CreateCommand(cStr2, con);             // create the command
            cmd2.ExecuteScalar();

        }
        catch (Exception ex)
        {
            Console.WriteLine("Inside catch block. Exception: {0}", ex.Message);
            throw (ex);
        }
        finally
        {
            if (con != null)
            {
                con.Close();
            }
        }
    }
    //--------------------------------------------------------------------
    // Build the Insert command String
    //--------------------------------------------------------------------
    private String BuildInsertCommand(HubList hlist)
    {
        String command;
        StringBuilder sb = new StringBuilder();
        // use a string builder to create the dynamic string
        sb.AppendFormat("Values({0},'{1}','{2}','{3}')", hlist.OwnerUserID,hlist.ListName, hlist.ImageURL, hlist.ListDescription);
        String prefix = "INSERT INTO HubList_CS " + "(OwnerUserID,ListName,ImageURL,ListDescription) ";
        command = prefix + sb.ToString();
        command += "SELECT SCOPE_IDENTITY()";

        return command;
    }
    private String BuildInsertCommandUser_Lists(HubList hlist, int CreatedListID)
    {
        String command;
        StringBuilder sb = new StringBuilder();
        // use a string builder to create the dynamic string
        sb.AppendFormat("Values({0},{1})", hlist.OwnerUserID, CreatedListID);
        String prefix = "INSERT INTO User_Lists_CS " + "(UserID,ListID)";
        command = prefix + sb.ToString();
        return command;
    }


    //Get All items From DataBase
    public List<Item> GetItemstoList(int id)
    {
        List<Item> itemList = new List<Item>();
        SqlConnection con = null;

        try
        {
            con = connect("DBConnectionString"); // create a connection to the database using the connection String defined in the web config file

            //fix here
            String selectSTR = "SELECT * FROM Item_CS WHERE ListID="+id;
            SqlCommand cmd = new SqlCommand(selectSTR, con);

            // get a reader
            SqlDataReader dr = cmd.ExecuteReader(CommandBehavior.CloseConnection); // CommandBehavior.CloseConnection: the connection will be closed after reading has reached the end

            while (dr.Read())
            {   // Read till the end of the data into a row
                Item item = new Item();
                item.ItemID = Convert.ToInt32(dr["ItemID"]);
                item.Name = (string)dr["ItemName"];
                item.Quantity = Convert.ToInt32(dr["Quantity"]);
                itemList.Add(item);
            }

            return itemList;
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }
        finally
        {
            if (con != null)
            {
                con.Close();
            }
        }
    }


    //Get All items From DataBase
    public List<Item> getItems()
    {
        List<Item> itemList = new List<Item>();
        SqlConnection con = null;

        try
        {
            con = connect("DBConnectionString"); // create a connection to the database using the connection String defined in the web config file
            String selectSTR = "SELECT * FROM Item_CS";
            SqlCommand cmd = new SqlCommand(selectSTR, con);
            SqlDataReader dr = cmd.ExecuteReader(CommandBehavior.CloseConnection); // CommandBehavior.CloseConnection: the connection will be closed after reading has reached the end

            while (dr.Read())
            {   // Read till the end of the data into a row
                Item item = new Item();
                item.ItemID = Convert.ToInt32(dr["ItemID"]);
                item.Name = (string)dr["ItemName"];
                item.Quantity = Convert.ToInt32(dr["Quantity"]);
                itemList.Add(item);
            }
            return itemList;
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }
        finally
        {
            if (con != null)
            {
                con.Close();
            }
        }
    }

    //Insert Item into list using ListID
    public int insertListItem(Item itemToInsert)
    {

        SqlConnection con;
        SqlCommand cmd;
        try
        {
            con = connect("DBConnectionString"); // create the connection
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }
        String cStr = BuildInsertCommand(itemToInsert);      // helper method to build the insert string
        cmd = CreateCommand(cStr, con);             // create the command
        try
        {
            int numEffected = cmd.ExecuteNonQuery(); // execute the command
            return numEffected;
        }
        catch (Exception ex)
        {
            Console.WriteLine("Inside catch block. Exception: {0}", ex.Message);
            throw (ex);
        }
        finally
        {
            if (con != null)
            {
                con.Close();
            }
        }

    }
    //--------------------------------------------------------------------
    // Build the Insert command String
    //--------------------------------------------------------------------
    private String BuildInsertCommand(Item itemToInsert)
    {
        String command;

        StringBuilder sb = new StringBuilder();
        // use a string builder to create the dynamic string
        sb.AppendFormat("Values('{0}', {1} , {2})",itemToInsert.Name,itemToInsert.Quantity,itemToInsert.ListID);
        String prefix = "INSERT INTO Item_CS " + "(ItemName,Quantity,ListID)";
        command = prefix + sb.ToString();

        return command;
    }


    //DELETE ITEM FROM LIST USING ITEMID
    public void DeleteItemFromList(int ItemID)
    {
        SqlConnection con = null;
        SqlCommand cmd;
        try
        {
            con = connect("DBConnectionString"); // create the connection
            String cStr = "DELETE FROM Item_CS where ItemID = " + ItemID;      // helper method to build the insert string
            cmd = CreateCommand(cStr, con);             // create the command
            cmd.ExecuteScalar(); // execute the command
        }
        catch (Exception ex)
        {
            throw (ex);
        }
        finally
        {
            if (con != null)
            {
                con.Close();
            }
        }
    }

    //DELETE ITEM FROM LIST USING ITEMID
    public int EditItemInList(Item NewValue, int ItemID)
    {
        SqlConnection con = null;
        SqlCommand cmd;
        try
        {
            con = connect("DBConnectionString"); // create the connection
            String cStr = "UPDATE Item_CS set ItemName = '" + NewValue.Name + "', Quantity = '" + NewValue.Quantity + "', ListID = '" + NewValue.ListID + "' where ItemID = " + ItemID;      // helper method to build the insert string
            cmd = CreateCommand(cStr, con);             // create the command
            int numEffected = cmd.ExecuteNonQuery(); // execute the command
            return numEffected;   
        }
        catch (Exception ex)
        {
            throw (ex);
        }
        finally
        {
            if (con != null)
            {
                con.Close();
            }
        }
    }


    //INSERT USERID TO JUNCTION TABLE USERS_LISTS_CS
    public void InserAuthUserToList(int ListId, int UserId)
    {
        SqlConnection con;
        SqlCommand cmd;
        try
        {
            con = connect("DBConnectionString"); // create the connection
        }
        catch (Exception ex)
        {
            throw (ex);
        }
        String cStr = BuildInsertCommandToList(ListId,UserId);      // helper method to build the insert string
        cmd = CreateCommand(cStr, con);             // create the command
        try
        {
            cmd.ExecuteScalar(); // execute the command
        }
        catch (Exception ex)
        {
            Console.WriteLine("Inside catch block. Exception: {0}", ex.Message);
            throw (ex);
        }
        finally
        {
            if (con != null)
            {
                // close the db connection
                con.Close();
            }
        }
    }
    //--------------------------------------------------------------------
    // Build the Insert command String
    //--------------------------------------------------------------------
    private String BuildInsertCommandToList(int ListId, int UserId)
    {
        String command;
        StringBuilder sb = new StringBuilder();
        // use a string builder to create the dynamic string
        sb.AppendFormat("Values({0}, {1})", UserId,ListId);
        String prefix = "INSERT INTO User_Lists_CS " + "(UserID,ListID)";
        command = prefix + sb.ToString();
        return command;
    }
}




