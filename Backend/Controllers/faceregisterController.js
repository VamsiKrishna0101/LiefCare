import User from "../Models/User.js";
export const registerFace = async (req, res) => {
  try {
    const { descriptor } = req.body;
    if (!descriptor || !Array.isArray(descriptor)) {
      return res.status(400).json({ message: "Descriptor is required" });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.faceDescriptor = descriptor;
    await user.save();

    res.json({ message: "Face registered successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
