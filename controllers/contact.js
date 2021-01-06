const { body, validationResult } = require("express-validator");
const Contact = require("../models/contact");

exports.addContacts = [
  body("name").trim(),
  body("mobile")
    .trim()
    .isLength({ min: 10 })
    .withMessage("Mobile must be at least 10 characters long"),
  body("email").trim(),
  //.isLength({ min: 1 })
  //.isEmail()
  //.withMessage("Email must be a valid email address."),
  body("city").trim(),
  body("state").trim(),
  body("token")
    .isLength({ min: 1 })
    .trim()
    .withMessage("User not authenticated"),
  (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(200).json({
          status: 0,
          message: "Validation Error",
          data: errors.array(),
        });
      } else {
        const contact = new Contact({
          name: req.body.name,
          mobile: req.body.mobile,
          email: req.body.email,
          city: req.body.city,
          state: req.body.state,
          tags: req.body.tags,
          fields: req.body.fields,
          userId: req.userData.userId,
        });
        contact
          .save()
          .then((createdContact) => {
            res.status(201).json({
              message: "Contact added successfully",
              post: {
                //...createdContact,
                id: createdContact._id,
              },
            });
          })
          .catch((error) => {
            res.status(500).json(error);
          });
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },
];

exports.getContacts = (req, res, next) => {
  const pageSize = +req.query.limit;
  const currentPage = +req.query.page;
  const contactQry = Contact.find({ userId: req.userData.userId });
  let contactlist;
  if (pageSize && currentPage) {
    contactQry.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  contactQry
    .then((contacts) => {
      contactlist = contacts;
      return Contact.count({ userId: req.userData.userId });
    })
    .then((count) => {
      res.status(200).json({
        status: 1,
        message: "Contacts fetched",
        data: contactlist,
        count: count,
      });
    })
    .catch((error) => {
      return res.status(500).json(error);
    });
};

exports.getContact = (req, res, next) => {
  Contact.findById(req.params.id)
    .then((contact) => {
      console.log(contact);
      if (contact) {
        res.status(200).json(contact);
      } else {
        res.status(404).json({ message: "Contact not found!" });
      }
    })
    .catch((error) => {
      return res.status(500).json(error);
    });
};

exports.deleteContact = (req, res, next) => {
  Contact.deleteOne({ _id: req.params.id, userId: req.userData.userId })
    .then((result) => {
      if (result.n > 0) {
        res.status(200).json({ message: "Deletion successful!" });
      } else {
        res.status(401).json({ message: "Not authorized!" });
      }
    })
    .catch((error) => {
      return res.status(500).json(error);
    });
};

exports.updateContact = (req, res, next) => {
    
}
