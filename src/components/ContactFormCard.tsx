"use client";

import { FormEvent, useState } from "react";

type FormStatus = "idle" | "sending" | "success" | "error";

export default function ContactFormCard() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorText, setErrorText] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
      name: String(formData.get("name") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      subject: String(formData.get("subject") ?? "").trim(),
      message: String(formData.get("message") ?? "").trim(),
    };

    if (!payload.name || !payload.email || !payload.message) {
      setStatus("error");
      setErrorText("Please add your name, email, and message.");
      return;
    }

    setStatus("sending");
    setErrorText("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as { message?: string };
      if (!response.ok) {
        throw new Error(data.message ?? "Failed to send message.");
      }

      setStatus("success");
      form.reset();
    } catch (error) {
      setStatus("error");
      setErrorText(error instanceof Error ? error.message : "Failed to send message.");
    }
  };

  return (
    <article className="terrain-stage-card terrain-contact-form-card">
      <h3>Contact Form</h3>
      <p>Send a note directly from this page.</p>
      <form onSubmit={handleSubmit} className="terrain-contact-form">
        <input name="name" type="text" placeholder="Your name" required />
        <input name="email" type="email" placeholder="Your email" required />
        <input name="subject" type="text" placeholder="Subject (optional)" />
        <textarea name="message" placeholder="Your message" rows={5} required />
        <button type="submit" disabled={status === "sending"}>
          {status === "sending" ? "Sending..." : "Send Message"}
        </button>
      </form>
      {status === "success" ? (
        <p className="terrain-form-feedback success">Message sent successfully.</p>
      ) : null}
      {status === "error" ? <p className="terrain-form-feedback error">{errorText}</p> : null}
    </article>
  );
}
