import React from "react";
import { useState } from "react";
import emailjs from "@emailjs/browser";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await emailjs.send(
        "service_z9nxyuq", // מזהה השירות מ-EmailJS
        "template_d11b3v9", // מזהה הטמפלייט
        formData,
        "gV_5nK7gTSfy2Kc9s" // המפתח הציבורי שלך
      );

      setSuccessMessage("ההודעה נשלחה בהצלחה!");
      setFormData({ name: "", email: "", message: "" }); // איפוס השדות
    } catch (error) {
      console.error("Error sending email:", error);
      setSuccessMessage("אירעה שגיאה בשליחת ההודעה");
    }

    setIsLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-gray-900 mb-4">
          הפוך למתנדב
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">שם</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
            />
          </div>

          <div>
            <label className="block text-gray-700">אימייל</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
            />
          </div>

          <div>
            <label className="block text-gray-700">הודעה</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
            disabled={isLoading}
          >
            {isLoading ? "שולח..." : "שלח הודעה"}
          </button>

          {successMessage && (
            <p className="text-center text-green-600 mt-2">{successMessage}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default ContactForm;
