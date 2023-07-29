const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    userType: {
      type: String,
      required: true,
      enum: ["donor", "organisation", "hospital", "admin"],
    },

    // is required if userType is donor or admin
    name: {
      type: String,
      required: function () {
        if (this.userType == "admin" || this.userType == "donor") {
          return true;
        }
        return false;
      },
    },

    // is required if userType is hospital
    hospitalName: {
      type: String,
      required: function () {
        if (this.userType == "hospital") {
          return true;
        }
        return false;
      },
    },
    // if required userType is organisation
    organisationName: {
      type: String,
      required: function () {
        if (this.userType == "organisation") {
          return true;
        }
        return false;
      },
    },
    website: {
      type: String,
      required: function () {
        if (this.userType == "hospital" || this.userType == "organisation") {
          return true;
        }
        return false;
      },
    },
    address: {
      type: String,
      required: function () {
        if (this.userType == "hospital" || this.userType == "organisation") {
          return true;
        }
        return false;
      },
    },
    email: {
      type: String,
      required: true,
      unqiue: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("users", userSchema);
