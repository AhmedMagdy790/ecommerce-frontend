import { useState } from "react";
import { useTranslation } from "react-i18next";

// Flat Props: No 'data' wrapper
interface NewsletterProps {
  title: string;
  description: string;
  placeholder: string;
  button: string;
}

export default function Newsletter({ 
  title, 
  description, 
  placeholder, 
  button 
}: NewsletterProps) {
  const { t } = useTranslation("home");
  const [email, setEmail] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Implementation for Laravel API integration will go here
    console.log("Subscribing email:", email);
    setEmail("");
  }

  return (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-4xl rounded-3xl bg-primary px-6 py-12 text-center text-white md:px-16">
        <h2 className="text-3xl font-bold md:text-4xl">
          {t(title)}
        </h2>

        <p className="mx-auto mt-4 max-w-xl text-white/80">
          {t(description)}
        </p>

        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-8 flex max-w-xl flex-col gap-3 sm:flex-row"
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t(placeholder)}
            className="flex-1 rounded-full px-6 py-3 text-gray-900 outline-none"
          />

          <button
            type="submit"
            className="rounded-full bg-white px-8 py-3 font-semibold text-gray-900 transition hover:bg-white/90 active:scale-95"
          >
            {t(button)}
          </button>
        </form>
      </div>
    </section>
  );
}