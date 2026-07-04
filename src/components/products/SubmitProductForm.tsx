"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useUserAuth } from "@/hooks/user-auth";

const fieldStyles =
  "m-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3.5 text-base text-gray-900 placeholder:text-gray-500 focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-100";

const longInputClassName = "!m-2 !w-full";

export default function SubmitProductForm() {
  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();
  const { user, loading } = useUserAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, router, user]);

  if (loading || !user) {
    return null;
  }

  const handleSubmit = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "same-origin",
        body: JSON.stringify({
          name,
          tagline,
          description: description || null,
          url,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        router.push(`/products/${data.product.slug}`);
        router.refresh();
        return;
      }

      const data = await response.json();
      setErrorMessage(data.error ?? "Something went wrong, please try again.");
    } catch {
      setErrorMessage("Something went wrong, please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form
        className="mx-auto flex w-full max-w-2xl flex-col py-12"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <h1 className="mb-6 text-2xl font-semibold text-gray-900">
          Submit a product
        </h1>
        <Input
          placeholder="Name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={longInputClassName}
          required
        />
        <Input
          placeholder="Tagline"
          type="text"
          value={tagline}
          onChange={(e) => setTagline(e.target.value)}
          className={longInputClassName}
          required
        />
        <textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={`${fieldStyles} min-h-32 resize-y`}
        />
        <Input
          placeholder="Website URL"
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className={longInputClassName}
          required
        />
        <Button
          type="submit"
          disabled={isLoading}
          className={`mt-4 w-full !border-orange-500 !bg-orange-500 !text-white hover:!bg-orange-600 ${isLoading ? "cursor-not-allowed opacity-50" : ""}`}
        >
          {isLoading ? "Submitting..." : "Submit product"}
        </Button>
      </form>

      {errorMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 w-full max-w-sm rounded-lg border border-gray-300 bg-white p-6 shadow-lg">
            <h2 className="mb-2 text-lg font-semibold text-gray-900">
              Submit failed
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
