const AboutApps = require('../Models/aboutUsModel');



exports.createAboutApps = async (req, res) => {
    try {
        const { content } = req.body;

        const termAndCondition = new AboutApps({ content });
        await termAndCondition.save();

        return res.status(201).json({ status: 201, message: 'About Apps created successfully', data: termAndCondition });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error', details: error.message });
    }
};

exports.getAllAboutApps = async (req, res) => {
    try {
        const termAndCondition = await AboutApps.find();

        if (!termAndCondition) {
            return res.status(404).json({ status: 404, message: 'About Apps not found' });
        }

        return res.status(200).json({ status: 200, message: "Sucessfully", data: termAndCondition });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error', details: error.message });
    }
};

exports.getAboutAppsById = async (req, res) => {
    try {
        const termAndConditionId = req.params.id;
        const termAndCondition = await AboutApps.findById(termAndConditionId);

        if (!termAndCondition) {
            return res.status(404).json({ status: 404, message: 'About Apps not found' });
        }

        return res.status(200).json({ status: 200, message: 'Sucessfully', data: termAndCondition });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error', details: error.message });
    }
};

exports.updateAboutAppsById = async (req, res) => {
    try {
        const termAndConditionId = req.params.id;
        const { content } = req.body;

        const updatedTermAndCondition = await AboutApps.findByIdAndUpdate(
            termAndConditionId,
            { content },
            { new: true }
        );

        if (!updatedTermAndCondition) {
            return res.status(404).json({ status: 404, message: 'About Apps not found' });
        }

        return res.status(200).json({ status: 200, message: 'About Apps updated successfully', data: updatedTermAndCondition });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error', details: error.message });
    }
};

exports.deleteAboutAppsById = async (req, res) => {
    try {
        const termAndConditionId = req.params.id;
        const deletedTermAndCondition = await AboutApps.findByIdAndDelete(termAndConditionId);

        if (!deletedTermAndCondition) {
            return res.status(404).json({ status: 404, message: 'About Apps not found' });
        }

        return res.status(200).json({ status: 200, message: 'About Apps deleted successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error', details: error.message });
    }
};