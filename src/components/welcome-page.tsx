"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "react-toastify";
import PhotoGrid from "./photo-grid";
import SubscribeModal from "./subscribe-modal";
import Header from "./header";
import logoImg from "@/public/logo2.png";

const WelcomePage = () => {
  const router = useRouter();
  const [subscribeModal, setSubscribeModal] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/newsletter/subscribe`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY!,
          },
          body: JSON.stringify({ email }),
        }
      );
      const response = await res.json();
      if (!res.ok) {
        toast.error(response.message);
        return;
      }
      setSubscribeModal(true);
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {subscribeModal && <SubscribeModal />}
      <Header type="home" />

      <main className="mt-10">
        {/* Hero — diagonal line pattern */}
        <section
          className="px-4 py-24 flex flex-col lg:flex-row items-center gap-12 max-sm:gap-20 max-w-5xl mx-auto"
          style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              transparent,
              transparent 10px,
              rgba(0,0,0,0.03) 10px,
              rgba(0,0,0,0.03) 11px
            )`,
          }}
        >
          <div className="flex-1">
            <p className="font-exo text-xs text-accent tracking-widest uppercase mb-4">
              The home for storytellers
            </p>
            <h1 className="font-inter text-4xl md:text-5xl leading-tight">
              Where{" "}
              <span className="italic text-orange-300">Simple Stories</span>
              <br /> Find Their Voices.
            </h1>
            <p className="font-jsl text-accent mt-6 text-lg sm:w-[70%] lg:w-full">
              Discover articles, insights, and stories from writers around the
              world. Join Clivo and share yours.
            </p>
            <div className="mt-10 flex-start gap-4">
              <button
                onClick={() => router.push("/signin")}
                className="btn-primary py-3 px-6"
              >
                Start Reading
              </button>
              <button
                onClick={() => router.push("/signin")}
                className="font-inter text-sm text-accent underline underline-offset-4"
              >
                Start Writing
              </button>
            </div>
          </div>
          <div className="flex-1 w-full">
            <PhotoGrid />
          </div>
        </section>

        {/* Newsletter */}
        <section className="bg-primary text-white py-20 px-4">
          <div
            className="max-w-lg mx-auto rounded-2xl px-8 py-12 text-center"
            style={{
              backgroundColor: "rgb(38, 37, 37)",
              backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)`,
              backgroundSize: "20px 20px",
            }}
          >
            <p className="font-exo text-xs tracking-widest uppercase text-gray-400 mb-3">
              Newsletter
            </p>
            <h2 className="font-inter text-3xl md:text-4xl">
              Stay in the loop
            </h2>
            <p className="font-jsl text-gray-400 mt-4 text-sm leading-relaxed">
              Subscribe and get the best stories, writing tips, and Clivo
              updates delivered straight to your inbox.
            </p>

            <form
              onSubmit={subscribe}
              className="mt-8 flex flex-col sm:flex-row gap-3"
            >
              <input
                type="email"
                className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-sm placeholder:text-gray-500 text-white focus:outline-none focus:border-white/50"
                value={email}
                placeholder="Enter your email address"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="btn-primary py-3 px-6 rounded-lg text-sm font-outfit whitespace-nowrap disabled:opacity-50"
              >
                {loading ? "Subscribing..." : "Subscribe"}
              </button>
            </form>

            <p className="text-[11px] text-gray-600 mt-4 font-jsl">
              No spam, ever. Unsubscribe at any time.
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-10 px-4 border-t border-muted">
          <div className="max-w-5xl mx-auto flex-between flex-wrap gap-4">
            <Image src={logoImg} alt="Clivo" className="h-6 w-auto" />
            <p className="font-inter text-xs text-accentLight">
              © {new Date().getFullYear()} Clivo. All rights reserved.
            </p>
          </div>
        </footer>
      </main>
    </>
  );
};

export default WelcomePage;