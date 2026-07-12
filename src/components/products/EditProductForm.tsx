"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { ProductDetailItem } from "@/types/product";
import type { Tag } from "@/types/tag";

const fieldStyles =
  "m-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3.5 text-base text-gray-900 placeholder:text-gray-500 focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-100";

const MAX_TAGS = 5;

type EditProductFormProps = {
  product: ProductDetailItem;
};

export function EditProductForm({ product }: EditProductFormProps) {
  const [name, setName] = useState(product.name);
  const [tagline, setTagline] = useState(product.tagline);
  const [description, setDescription] = useState(product.description ?? "");
  const [url, setUrl] = useState(product.url);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>(
    product.tags.map((tag) => tag.name),
  );
  const [customTag, setCustomTag] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadTags = async () => {
      try {
        const response = await fetch("/api/tags", {
          method: "GET",
          credentials: "same-origin",
        });
        if (!response.ok) return;

        const data = (await response.json()) as { tags: Tag[] };
        setAvailableTags(data.tags);
      } catch {
        // Keep the form usable even if tags fail to load.
      }
    };

    loadTags();
  }, []);

  const addTag = (tagName: string) => {
    const trimmed = tagName.trim();
    if (!trimmed) return;

    const alreadySelected = selectedTags.some(
      (tag) => tag.toLowerCase() === trimmed.toLowerCase(),
    );
    if (alreadySelected || selectedTags.length >= MAX_TAGS) return;

    setSelectedTags((current) => [...current, trimmed]);
  };

  const removeTag = (tagName: string) => {
    setSelectedTags((current) =>
      current.filter((tag) => tag.toLowerCase() !== tagName.toLowerCase()),
    );
  };

  const handleAddCustomTag = () => {
    addTag(customTag);
    setCustomTag("");
  };

  const handleSubmit = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const response = await fetch(`/api/products/${product.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "same-origin",
        body: JSON.stringify({
          name,
          tagline,
          description: description || null,
          url,
          tags: selectedTags,
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
          Edit product
        </h1>
        <Input
          placeholder="Name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input
          placeholder="Tagline"
          type="text"
          value={tagline}
          onChange={(e) => setTagline(e.target.value)}
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
          required
        />

        <section className="m-2 mt-4">
          <h2 className="text-base font-semibold text-gray-900">Tags</h2>
          <p className="mt-1 text-sm text-gray-500">
            Choose up to {MAX_TAGS} tags so people can find your product.
          </p>

          {selectedTags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {selectedTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="rounded-full border border-orange-500 bg-orange-50 px-3 py-1 text-sm text-orange-700 hover:bg-orange-100"
                  aria-label={`Remove ${tag}`}
                >
                  {tag} ×
                </button>
              ))}
            </div>
          )}

          {availableTags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {availableTags.map((tag) => {
                const isSelected = selectedTags.some(
                  (selected) =>
                    selected.toLowerCase() === tag.name.toLowerCase(),
                );
                const isDisabled =
                  !isSelected && selectedTags.length >= MAX_TAGS;

                return (
                  <button
                    key={tag.id}
                    type="button"
                    disabled={isDisabled}
                    onClick={() => {
                      if (isSelected) {
                        removeTag(tag.name);
                        return;
                      }
                      addTag(tag.name);
                    }}
                    className={`rounded-full border px-3 py-1 text-sm ${
                      isSelected
                        ? "border-orange-500 bg-orange-500 text-white"
                        : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                    } ${isDisabled ? "cursor-not-allowed opacity-50" : ""}`}
                  >
                    {tag.name}
                  </button>
                );
              })}
            </div>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            <input
              type="text"
              value={customTag}
              onChange={(e) => setCustomTag(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddCustomTag();
                }
              }}
              placeholder="Add a custom tag"
              maxLength={50}
              disabled={selectedTags.length >= MAX_TAGS}
              className="min-w-0 flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
            />
            <button
              type="button"
              onClick={handleAddCustomTag}
              disabled={
                !customTag.trim() || selectedTags.length >= MAX_TAGS
              }
              className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Add tag
            </button>
          </div>
        </section>

        <Button
          type="submit"
          disabled={isLoading}
          className={`mt-4 w-full !border-orange-500 !bg-orange-500 !text-white hover:!bg-orange-600 ${isLoading ? "cursor-not-allowed opacity-50" : ""}`}
        >
          {isLoading ? "Saving..." : "Save changes"}
        </Button>
      </form>

      {errorMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 w-full max-w-sm rounded-lg border border-gray-300 bg-white p-6 shadow-lg">
            <h2 className="mb-2 text-lg font-semibold text-gray-900">
              Update failed
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
