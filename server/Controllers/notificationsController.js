/* const Notification = require('../models/notificationSchema');

// create notification

const createNotification = async (req, res) => {
    const {chatId,receiverId,message,isRead,date} = req.body;
 
    const notification = new Notification({chatId,receiverId,message,isRead,date})

   try {
    const response =await notification.save()
    res.status(200).json(response)
   } 
   catch (error) {
     console.log(error);
     res.status(500).json(error)
   }
}

// get Notifications

const getNotifications = async (req,res) => {
    const {chatId} = req.params;
    try {
        const notifications = await Notification.find({chatId})
           res.status(200).json(notifications)
       } 
       catch (error) {
         console.log(error);
         res.status(500).json(error)
       }
}

module.exports = {createNotification , getNotifications} ; */
