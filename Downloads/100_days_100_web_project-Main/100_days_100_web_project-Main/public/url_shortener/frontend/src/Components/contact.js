import  { useState } from "react";
import emailjs from "@emailjs/browser";
import { Helmet } from "react-helmet";


export default function Contact() {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      return setError("Please fill all required fields");
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await emailjs.send(
        "YOUR_SERVICE_ID",
        "YOUR_TEMPLATE_ID",
        formData,
        "YOUR_PUBLIC_KEY"
      );

      setSuccess("Message sent successfully!");
      setFormData({ name: "", email: "", phone: "", message: "" });

    } catch (err) {
      setError("Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact Us </title>

        <meta
          name="description"
          content="Contact App Nests for support, feedback, or any issues related to your links, QR codes, or account."
        />

        <meta
          name="keywords"
          content="contact App Nests, support, help, URL shortener support"
        />

        <meta property="og:title" content="Contact Us - App Nests" />
        <meta
          property="og:description"
          content="Reach out to App Nests support for help and assistance."
        />
      </Helmet>

      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center px-4">

        <div className="w-full max-w-xl bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-xl">

          <h1 className="text-2xl sm:text-3xl font-semibold mb-6 text-center">
            Contact Us
          </h1>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          {success && <p className="text-green-500 text-sm mb-4">{success}</p>}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-sm outline-none focus:border-blue-500"
            />

            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-sm outline-none focus:border-blue-500"
            />

            <input
              type="text"
              name="phone"
              placeholder="Phone (optional)"
              value={formData.phone}
              onChange={handleChange}
              className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-sm outline-none focus:border-blue-500"
            />

            <textarea
              name="message"
              placeholder="Describe your problem..."
              value={formData.message}
              onChange={handleChange}
              rows="4"
              className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-sm outline-none focus:border-blue-500"
            />

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-500 py-3 rounded-lg font-semibold text-sm"
            >
              {loading ? "Sending..." : "Send Message"}
            </button>

          </form>
        </div>
      </div>
    </>
  );
}