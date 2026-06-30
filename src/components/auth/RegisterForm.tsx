"use client";
import { useRouter } from "next/navigation";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { useState } from "react";

export default function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleRegister = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (response.ok) {
        router.refresh();
        router.push("/");
      } else {
        const data = await response.json();
        setErrorMessage(
          data.error ?? "Something went wrong, please try again.",
        );
      }
    } catch {
      setErrorMessage("Something went wrong, please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form
        className="flex flex-col items-center justify-center h-screen"
        onSubmit={(e) => {
          e.preventDefault();
          handleRegister();
        }}
      >
        <Input
          placeholder="Name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button
          type="submit"
          disabled={isLoading}
          className={isLoading ? "opacity-50 cursor-not-allowed" : undefined}
        >
          {isLoading ? "Registering..." : "Register"}
        </Button>
      </form>

      {errorMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 w-full max-w-sm rounded-lg border border-gray-300 bg-white p-6 shadow-lg">
            <h2 className="mb-2 text-lg font-semibold text-gray-900">
              Register failed
            </h2>
            <p className="mb-4 text-gray-700">{errorMessage}</p>
            <Button onClick={() => setErrorMessage(null)} className="w-full">
              Close
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
