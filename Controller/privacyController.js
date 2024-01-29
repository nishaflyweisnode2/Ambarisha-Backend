const privacy = require('../Models/privacyModel')


exports.addprivacy = async (req,res) =>{
    try{
   const privacyData =    await privacy.create({privacy: req.body.privacy});
      res.status(200).json({
        data : privacyData,
       message: "  privacy Added ", 
       details : privacyData
     })
    }
    catch(err)
    {
        console.log(err);
        res.status(400).send({message: err.message})
    }
}



exports.getprivacy = async(req,res) => {
    try {
        const data = await privacy.find();
        console.log(data);
        res.status(200).json({
            privacy : data
        })
        
    }catch(err)
    {
        res.status(400).send({mesage : err.mesage});
    }
}



exports.updateprivacy = async (req, res ) => {
    try {
       
        const Updatedprivacy = await privacy.findOneAndUpdate({_id: req.params.id}, {
            privacy: req.body.privacy
        }).exec();
        console.log(Updatedprivacy);
        res.status(200).json({
            message: "privacy Update" 
        })
        
        
    }catch(err)
    {
       console.log(err)
       res.status(401).json({
        mesage: err.mesage
       })
    }
}


exports.Deleteprivacy = async(req,res) => {
    try {
    const id = req.params.id; 
    await privacy.deleteOne({_id: id});
    res.status(200).send({message: "privacy deleted "})
    }catch(err){
      console.log(err); 
      res.status(400).send({message: err.message})
    }
}