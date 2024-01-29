const FAQ = require("../Models/faqModel");
require('dotenv').config();

exports.createFaq = async (req, res) => {
    try {
        const faq = new FAQ(req.body);
        const savedFAQ = await faq.save();
        res.status(201).json(savedFAQ);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    };
  exports.getFaq = async (req, res) => {
    try {
        const faqs = await FAQ.find();
        res.status(200).json(faqs);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    };
  exports.updateFaq = async (req, res) => {
    try {
        const updatedFAQ = await FAQ.findByIdAndUpdate(req.params.id, req.body, {
          new: true,
          runValidators: true,
        });
        if (!updatedFAQ) {
          return res.status(404).json({ message: 'FAQ not found' });
        }
        res.status(200).json(updatedFAQ);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    };
  exports.removeFaq = async (req, res) => {
    try {
        const deletedFAQ = await FAQ.findByIdAndDelete(req.params.id);
        if (!deletedFAQ) {
          return res.status(404).json({ message: 'FAQ not found' });
        }
        res.status(200).json(deletedFAQ);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    };