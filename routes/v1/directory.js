const express = require("express");

const DirectoryController = require("../../controllers/directory");
const ContactController = require("../../controllers/contact")
const checkAuth = require("../../middlewares/check-auth");

const router = express.Router();

router.post("/contacts", checkAuth, ContactController.addContacts);

router.get("/contacts", checkAuth, ContactController.getContacts);

router.get("/contacts/:id", checkAuth, ContactController.getContact);

router.delete("/contacts/:id", checkAuth, ContactController.deleteContact);

router.put("/contacts/:id", checkAuth, ContactController.updateContact);

module.exports = router;