
const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    employeeId: {
      type: String,
      required: [true, "Ma nhan vien la bat buoc"],
      unique: true,
      trim: true
    },
    fullName: {
      type: String,
      required: [true, "Ho ten la bat buoc"],
      trim: true
    },
    gender: {
      type: String,
      trim: true,
      default: ""
    },
    dateOfBirth: {
      type: String,
      default: ""
    },
    department: {
      type: String,
      trim: true,
      default: ""
    },
    position: {
      type: String,
      trim: true,
      default: ""
    },
    email: {
      type: String,
      required: [true, "Email la bat buoc"],
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      trim: true,
      default: ""
    },
    hireDate: {
      type: String,
      default: ""
    },
    status: {
      type: String,
      trim: true,
      default: "Dang lam viec"
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

employeeSchema.index({ employeeId: 1 }, { unique: true });

module.exports = mongoose.model("Employee", employeeSchema);
