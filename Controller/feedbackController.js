const Feedback  = require('../Models/feedbackModel')

exports.createFeedback = async (req, res) => {
    try {
      const {  feedbackText, rating } = req.body;
  const user =req.user.id;
      const feedback = await Feedback.create({ user, feedbackText, rating });
  
      res.status(201).json({ message: 'Feedback created successfully', data: feedback });
    } catch (error) {
      console.error('Error creating feedback:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  // controllers/feedbackController.js
exports.getFeedback = async (req, res) => {
    try {
      const feedbacks = await Feedback.find().populate('user');
  
      res.status(200).json({ data: feedbacks });
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
// controllers/feedbackController.js
exports.updateFeedback = async (req, res) => {
    try {
        const feedbackId = req.params.id;
      const {  feedbackText, rating } = req.body;
  
      const feedback = await Feedback.findByIdAndUpdate(
        feedbackId,
        { feedbackText, rating },
        { new: true }
      );
  
      if (!feedback) {
        return res.status(404).json({ message: 'Feedback not found', data: {} });
      }
  
      res.status(200).json({ message: 'Feedback updated successfully', data: feedback });
    } catch (error) {
      console.error('Error updating feedback:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
// controllers/feedbackController.js
exports.deleteFeedback = async (req, res) => {
    try {
      const feedbackId = req.params.feedbackId;
  
      const deletedFeedback = await Feedback.findByIdAndDelete(feedbackId);
  
      if (!deletedFeedback) {
        return res.status(404).json({ message: 'Feedback not found', data: {} });
      }
  
      res.status(200).json({ message: 'Feedback deleted successfully', data: deletedFeedback });
    } catch (error) {
      console.error('Error deleting feedback:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
      