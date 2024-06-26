import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const UsuarioSchema = new mongoose.Schema({
  nombre: String,
  apellidos: String,
  correo: String,
  usuario: String,
  password: String,
  rol: {
    type: String,
    enum: ["Cliente", "Dependiente", "Administrador"],
  },
});

UsuarioSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (error) {
    return next(error);
  }
});

UsuarioSchema.methods.changePassword = async function (newPassword) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    this.password = hashedPassword;
    await this.save();
    return true;
  } catch (error) {
    throw error;
  }
};
UsuarioSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

export default mongoose.model("Usuario", UsuarioSchema);
