import emailjs from "@emailjs/browser";
import { AlertCircle, Clock, Mail, Phone, Send } from "lucide-react";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useTheme } from "@/hooks/useTheme";
import SocialLinksComponent from "../components/SocialLinksComponent";
import { EMAILJS_CONFIG, PERSONAL_INFO, SOCIAL_LINKS } from "../utils/constants";

const Contact = () => {
  const colors = useTheme();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    projectType: "",
  });

  const [formStatus, setFormStatus] = useState({
    submitted: false,
    success: false,
    message: "",
  });

  const [formErrors, setFormErrors] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const projectTypes = [
    { value: "", label: "Select project type..." },
    { value: "woodworking", label: "Custom Woodworking" },
    { value: "web-development", label: "Web Development" },
    { value: "consultation", label: "Consultation" },
    { value: "collaboration", label: "Collaboration" },
    { value: "other", label: "Other" },
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      name: "",
      email: "",
      message: "",
    };

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      valid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      valid = false;
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
      valid = false;
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
      valid = false;
    }

    setFormErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setFormStatus({
      submitted: true,
      success: false,
      message: "Sending your message...",
    });

    try {
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        subject: formData.subject || `New ${formData.projectType || "contact"} inquiry`,
        message: formData.message,
        project_type: formData.projectType,
        to_email: PERSONAL_INFO.email,
      };

      await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID,
        templateParams,
        EMAILJS_CONFIG.USER_ID
      );

      setFormStatus({
        submitted: true,
        success: true,
        message: "Thank you for your message! I'll get back to you within 24 hours.",
      });

      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
        projectType: "",
      });
    } catch (error) {
      console.error("EmailJS Error:", error);
      setFormStatus({
        submitted: true,
        success: false,
        message:
          "Sorry, there was an error sending your message. Please try again or contact me directly.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 style={{ color: colors.primary }} className="text-2xl font-bold mb-6">
                Let's Start a Conversation
              </h2>
              <p style={{ color: colors.textSecondary }} className="text-lg leading-relaxed mb-8">
                Whether you're looking for custom woodworking, web development services, or just
                want to discuss an idea, I'm here to help. Every great project starts with a
                conversation.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div
                  style={{ backgroundColor: colors.surfaceSecondary }}
                  className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center"
                >
                  <Mail style={{ color: colors.accent }} className="w-6 h-6" />
                </div>
                <div>
                  <h3 style={{ color: colors.primary }} className="text-lg font-semibold mb-1">
                    Email
                  </h3>
                  <a
                    href={`mailto:${PERSONAL_INFO.email}`}
                    style={{ color: colors.accent }}
                    className="font-medium"
                  >
                    {PERSONAL_INFO.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div
                  style={{ backgroundColor: colors.surfaceSecondary }}
                  className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center"
                >
                  <Phone style={{ color: colors.success }} className="w-6 h-6" />
                </div>
                <div>
                  <h3 style={{ color: colors.primary }} className="text-lg font-semibold mb-1">
                    Phone
                  </h3>
                  <a
                    href={`tel:${PERSONAL_INFO.phone}`}
                    style={{ color: colors.success }}
                    className="font-medium"
                  >
                    {PERSONAL_INFO.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div
                  style={{ backgroundColor: colors.surfaceSecondary }}
                  className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center"
                >
                  <Clock style={{ color: colors.warning }} className="w-6 h-6" />
                </div>
                <div>
                  <h3 style={{ color: colors.primary }} className="text-lg font-semibold mb-1">
                    Response Time
                  </h3>
                  <p style={{ color: colors.textSecondary }}>Typically 1 to 4 hours</p>
                </div>
              </div>
            </div>

            <SocialLinksComponent
              socialLinks={SOCIAL_LINKS}
              variant="filled"
              size="lg"
              className="flex items-center md:justify-normal justify-center"
            />
          </div>

          <div style={{ backgroundColor: colors.surface }} className="rounded-2xl p-8">
            <h2 style={{ color: colors.primary }} className="text-2xl font-bold mb-6">
              Send a Message
            </h2>

            {formStatus.submitted && (
              <div
                className={`mb-6 p-4 rounded-lg ${
                  formStatus.success
                    ? "bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300"
                    : "bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300"
                }`}
              >
                <p className="flex items-center">
                  {formStatus.success ? (
                    <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <AlertCircle className="h-5 w-5 mr-2" />
                  )}
                  {formStatus.message}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    style={{ color: colors.textSecondary }}
                    className="block text-sm font-medium mb-2"
                  >
                    Name *
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    style={{
                      backgroundColor: colors.surfaceSecondary,
                      color: colors.primary,
                      borderColor: formErrors.name ? colors.error : colors.border,
                    }}
                    placeholder="Your full name"
                  />
                  {formErrors.name && (
                    <p style={{ color: colors.error }} className="mt-1 text-sm">
                      {formErrors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="email"
                    style={{ color: colors.textSecondary }}
                    className="block text-sm font-medium mb-2"
                  >
                    Email *
                  </label>
                  <Input
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    style={{
                      backgroundColor: colors.surfaceSecondary,
                      color: colors.primary,
                      borderColor: formErrors.email ? colors.error : colors.border,
                    }}
                    placeholder="your.email@example.com"
                  />
                  {formErrors.email && (
                    <p style={{ color: colors.error }} className="mt-1 text-sm">
                      {formErrors.email}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="projectType"
                    style={{ color: colors.textSecondary }}
                    className="block text-sm font-medium mb-2"
                  >
                    Project Type
                  </label>
                  <select
                    id="projectType"
                    name="projectType"
                    value={formData.projectType}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    style={{
                      backgroundColor: colors.surfaceSecondary,
                      color: colors.primary,
                      borderColor: colors.border,
                    }}
                    className="block w-full rounded-lg border shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 pl-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {projectTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    style={{ color: colors.textSecondary }}
                    className="block text-sm font-medium mb-2"
                  >
                    Subject
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    style={{
                      backgroundColor: colors.surfaceSecondary,
                      color: colors.primary,
                      borderColor: colors.border,
                    }}
                    placeholder="Brief project description"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="message"
                  style={{ color: colors.textSecondary }}
                  className="block text-sm font-medium mb-2"
                >
                  Message *
                </label>
                <Textarea
                  id="message"
                  name="message"
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  style={{
                    backgroundColor: colors.surfaceSecondary,
                    color: colors.primary,
                    borderColor: formErrors.message ? colors.error : colors.border,
                  }}
                  placeholder="Tell me about your project, timeline, budget, and any specific requirements..."
                />
                {formErrors.message && (
                  <p style={{ color: colors.error }} className="mt-1 text-sm">
                    {formErrors.message}
                  </p>
                )}
              </div>

              <div>
                <Button type="submit" disabled={isSubmitting} className="w-full">
                  <Send className="h-5 w-5 mr-2" />
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
                <p style={{ color: colors.textTertiary }} className="mt-2 text-sm text-center">
                  * Required fields
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
