const express = require('express');
const router = express.Router();
const DataModel = require('../models/data');
const multer = require('multer');
const path = require('path');
const fetchuser = require('../middleware/fetchuser');
const userData = require('../models/user');
// const RoomModel = require('../models/room');
const room = require('../models/room');
const mongoose = require('mongoose');
const { ObjectId } = require('mongoose').Types;

// Define multer storage for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Save uploaded files to the uploads directory
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Use the original filename
  }
});

const upload = multer({ storage: storage });

// Add new data with file upload
router.post('/', upload.single('poaPdf'), async (req, res) => {
  try {
    const { id, committeeName, eventType, eventName, convenorName, eventDate, duration, status } = req.body;
    const poaPdf = req.file ? req.file.filename : ''; // Save filename instead of path

    const newData = new DataModel({ id, committeeName, eventType, eventName, convenorName, eventDate, duration, poaPdf, HODApproval: false, PrincipleApproval: false, RoomAllocated: false, status });
    await newData.save();
    res.status(201).json(newData);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all data
router.get('/', fetchuser, async (req, res) => {
  try {
    const user = req.user.role;
    if (user == "hod") {
      const data = await DataModel.find();
      res.json(data);
    }
    else if (user == "principle") {
      const data = await DataModel.find({ HODApproval: 1 });
      res.json(data);
    }
    else if (user == "system") {
      const data = await DataModel.find({ HODApproval: 1, PrincipleApproval: 1 });
      res.json(data);
    } else {
      const userId = req.user.id;
      const commitee = await userData.findById(userId);
      const commiteeName = commitee.commiteeName;
      const data = await DataModel.find({ "committeeName": commiteeName });
      res.json(data);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// get events details for pefilling the form
router.get('/:eventId', async (req, res) => {
  const eventId = req.params.eventId;

  try {
    // Find the event by eventId in the database
    const event = await DataModel.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // If event found, return it in the response
    res.json(event);
  } catch (error) {
    // If any error occurs, return an error response
    console.error('Error fetching event details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// route for cancel room booking 
router.put('/cancelRoomBooking/:eventId', fetchuser, async (req, res) => {
  const eventId = req.params.eventId;
  const { cancelType } = req.body;
  try {
    // Find the eventData by eventId
    const eventData = await DataModel.findById(eventId);

    if (!eventData) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (req.user.role == "commitee") {
      // Update the cancelled field to true
      eventData.cancelled = cancelType == 'cancel' ? 1 : 0;
    } else if (req.user.role == "system" && eventData.cancelled == 1) {
      console.log(eventId);

      // Update documents in RoomModel collection to remove eventId
      // const objectId = new mongoose.Types.ObjectId('660e814512c3bd3c42623a45');
      // roomData = await room.find({eventId: objectId});
      // const result = await room.updateMany(
      //   { eventId: eventId },
      //   { $pull: { eventId: eventId } }
      // );

      // console.log('Update result:', await roomData);

    //   if (result.nModified > 0) {
    //     console.log(`eventId ${eventId} removed successfully`);
    //   } else {
    //     console.log(`eventId ${eventId} not found in any document`);
    //   }
      eventData.cancelled = 2;
    }

    // Save the updated eventData
    await eventData.save();
    const eventObjectId = new ObjectId(eventId);
    console.log(eventObjectId);
    const roomData = await room.find({eventId: '660e814512c3bd3c42623a45'});
    // await room.updateMany({ eventId: eventId }, { $pull: { eventId: eventId } });
    console.log("Retrived Data >> "+await roomData);
    if (roomData.length > 0) {
      // Process room data
      // For example, if you want to remove the eventId:
      // await room.updateMany({ eventId: eventObjectId }, { $pull: { eventId: eventObjectId } });
      console.log(`eventId ${eventId} removed successfully`);
    } else {
      console.log(`eventId ${eventId} not found in any document`);
    }
    res.status(200).json({ message: 'Room booking cancelled successfully', data: roomData });
  } catch (error) {
    console.error('Error cancelling room booking:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Serve PDF files
router.use('/uploads', express.static(path.join(__dirname, '../uploads')));

router.put('/status/:id', fetchuser, async (req, res) => {
  try {
    const id = req.params.id;
    const user = req.user.role;
    const { status } = req.body;
    const newData = await DataModel.findById(id);
    newData.status = status;
    if (user == "principle") {
      newData.PrincipleApproval = status.includes("Approved by Principal") ? 1 : status.includes("Rejected by Principal") ? 2 : 0;
    }
    else if (user == "hod") {
      newData.HODApproval = status.includes("Approved by HOD") ? 1 : status.includes("Rejected by HOD") ? 2 : 0;
    }
    await newData.save();
    res.json({ message: 'Status updated successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update data by ID
router.put('/:id', upload.single('poaPdf'), async (req, res) => {
  try {
    const id = req.params.id;
    const { committeeName, eventType, eventName, convenorName, eventDate, duration, status } = req.body;
    const poaPdf = req.file ? req.file.filename : null;

    const updatedData = {
      committeeName,
      eventType,
      eventName,
      convenorName,
      eventDate,
      duration,
      poaPdf,
      status
    };

    await DataModel.findByIdAndUpdate(id, updatedData);
    res.json({ message: 'Data updated successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


// Delete data by ID
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    await DataModel.findByIdAndDelete(id);
    res.json({ message: 'Data deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});






module.exports = router;
