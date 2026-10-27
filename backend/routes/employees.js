
const express = require("express");
const mongoose = require("mongoose");
const Employee = require("../models/Employee");

const router = express.Router();

const requiredFields = ["employeeId", "fullName", "email"];

function validateEmployee(data) {
  for (const field of requiredFields) {
    if (
      data[field] === undefined ||
      data[field] === null ||
      String(data[field]).trim() === ""
    ) {
      return `Truong ${field} la bat buoc`;
    }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(String(data.email).trim())) {
    return "Email khong hop le";
  }

  return null;
}

function findEmployeeById(id) {
  if (mongoose.isValidObjectId(id)) {
    return Employee.findById(id);
  }

  return Employee.findOne({ employeeId: id });
}

function handleDatabaseError(error, res) {
  if (error.code === 11000) {
    return res.status(409).json({
      message: "Ma nhan vien hoac email da ton tai"
    });
  }

  if (error.name === "ValidationError") {
    return res.status(400).json({
      message: error.message
    });
  }

  console.error(error);

  return res.status(500).json({
    message: "Loi may chu"
  });
}

// GET /api/employees?search=An
router.get("/", async (req, res) => {
  try {
    const search = String(req.query.search || "").trim();
    const filter = {};

    if (search) {
      const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      filter.$or = [
        { employeeId: { $regex: escaped, $options: "i" } },
        { fullName: { $regex: escaped, $options: "i" } }
      ];
    }

    const employees = await Employee.find(filter).sort({ employeeId: 1 });

    return res.status(200).json({
      count: employees.length,
      data: employees
    });
  } catch (error) {
    return handleDatabaseError(error, res);
  }
});

// GET /api/employees/:id
// :id can be MongoDB _id or employeeId, e.g. NV001
router.get("/:id", async (req, res) => {
  try {
    const employee = await findEmployeeById(req.params.id);

    if (!employee) {
      return res.status(404).json({
        message: "Khong tim thay nhan vien"
      });
    }

    return res.status(200).json({ data: employee });
  } catch (error) {
    return handleDatabaseError(error, res);
  }
});

// POST /api/employees
router.post("/", async (req, res) => {
  try {
    const errorMessage = validateEmployee(req.body);

    if (errorMessage) {
      return res.status(400).json({ message: errorMessage });
    }

    const employee = await Employee.create(req.body);

    return res.status(201).json({
      message: "Them nhan vien thanh cong",
      data: employee
    });
  } catch (error) {
    return handleDatabaseError(error, res);
  }
});

// PUT /api/employees/:id
router.put("/:id", async (req, res) => {
  try {
    const employee = await findEmployeeById(req.params.id);

    if (!employee) {
      return res.status(404).json({
        message: "Khong tim thay nhan vien"
      });
    }

    const allowedFields = [
      "employeeId",
      "fullName",
      "gender",
      "dateOfBirth",
      "department",
      "position",
      "email",
      "phone",
      "hireDate",
      "status"
    ];

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        employee[field] = req.body[field];
      }
    }

    const errorMessage = validateEmployee(employee);

    if (errorMessage) {
      return res.status(400).json({ message: errorMessage });
    }

    await employee.save();

    return res.status(200).json({
      message: "Cap nhat nhan vien thanh cong",
      data: employee
    });
  } catch (error) {
    return handleDatabaseError(error, res);
  }
});

// DELETE /api/employees/:id
router.delete("/:id", async (req, res) => {
  try {
    const employee = await findEmployeeById(req.params.id);

    if (!employee) {
      return res.status(404).json({
        message: "Khong tim thay nhan vien"
      });
    }

    await employee.deleteOne();

    return res.status(200).json({
      message: "Xoa nhan vien thanh cong",
      data: employee
    });
  } catch (error) {
    return handleDatabaseError(error, res);
  }
});

module.exports = router;
