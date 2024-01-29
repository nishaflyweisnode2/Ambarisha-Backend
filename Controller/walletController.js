const userSchema = require("../Models/userModel");

const WalletTransaction = require("../Models/walletModel");

exports.addandremoveMoney = async (req, res) => {
  try {
    const wallet = await userSchema.findOne({ _id: req.user.id });

    if (wallet == null) {
      return res.status(400).json({
        message: "User is Not Created",
      });
    }

    if (req.body.type === "add") {
      const balance = parseInt(req.body.balance);
      wallet.wallet += balance;

      // Save the transaction as 'add' type
      const transaction = new WalletTransaction({
        user: req.user.id,
        transactionType: "add",
        amount: balance,
      });

      await transaction.save();
    } else if (req.body.type === "remove") {
      if (parseInt(wallet.wallet) < parseInt(req.body.balance)) {
        return res.status(400).json({ msg: "Insufficient balance" });
      }

      const balance = parseInt(req.body.balance);
      wallet.wallet -= balance;

      // Save the transaction as 'remove' type
      const transaction = new WalletTransaction({
        user: req.user.id,
        transactionType: "remove",
        amount: balance,
      });

      await transaction.save();
    }

    const user1 = await userSchema.findByIdAndUpdate(
      { _id: wallet._id },
      { wallet: wallet.wallet },
      { new: true }
    );

    return res.status(200).json({
      status: "success",
      data: user1,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "An error occurred" });
  }
};

exports.myWallet = async (req, res) => {
  try {
    const userId = req.user.id;

    const transactions = await WalletTransaction.find({ user: userId }).sort({
      timestamp: -1,
    }); // Sort by timestamp in descending order

    res.status(200).json({ success: true, transactions });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        success: false,
        message: "An error occurred while fetching transaction history",
      });
  }
};
