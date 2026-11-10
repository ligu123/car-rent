"use client";

import { useState } from "react";
import type { Car } from "@/packages/types/car";
import Button from "./button";
import { Plus, X } from "lucide-react";

export type CarFormValues = {
  brand: string;
  model: string;
  year: number;
  price: number;
  image: string;
  image_alt: string;
  description: string;
};

type CarRow = Car & { image_alt?: string };

function toFormValues(car: Car | null) {
  const row = car as CarRow | null;
  return {
    brand: row?.brand ?? "",
    model: row?.model ?? "",
    year: row ? String(row.year) : "",
    price: row ? String(row.price) : "",
    image: row?.image ?? "",
    image_alt: row?.imageAlt ?? row?.image_alt ?? "",
    description: row?.description ?? "",
  };
}

type FieldErrors = {
  brand?: string;
  model?: string;
  year?: string;
  price?: string;
  image?: string;
  image_alt?: string;
  description?: string;
};

function validate(form: ReturnType<typeof toFormValues>): FieldErrors {
  const errors: FieldErrors = {};
  if (!form.brand.trim()) errors.brand = "Brand is required.";
  if (!form.model.trim()) errors.model = "Model is required.";
  if (!form.image.trim()) errors.image = "Image URL is required.";
  if (!form.image_alt.trim()) errors.image_alt = "Image alt is required.";
  if (!form.description.trim()) errors.description = "Description is required.";

  const year = Number(form.year);
  if (form.year.trim() === "") {
    errors.year = "Year is required.";
  } else if (!Number.isInteger(year)) {
    errors.year = "Year must be a whole number.";
  } else if (year < 1900 || year > 2026) {
    errors.year = "Year must be between 1900 and 2026.";
  }
  const price = Number(form.price);
  if (form.price.trim() === "") {
    errors.price = "Price is required.";
  } else if (!Number.isFinite(price)) {
    errors.price = "Price must be a number.";
  } else if (price < 0) {
    errors.price = "Price must be 0 or greater.";
  }
  return errors;
}


const fieldClass =
  "border border-gray-300 rounded-xl p-1.5 outline-none w-full";

export default function CarForm({
  car,
  saving,
  submitError,
  onSubmit,
  onCancel,
}: {
  car: Car | null;
  saving: boolean;
  submitError: string;
  onSubmit: (values: CarFormValues) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState(() => toFormValues(car));
  const isEdit = car !== null;
  const [errors, setErrors] = useState<FieldErrors>(() => validate(form));


  return (
    <form
      className="flex w-full flex-col gap-3"
      onSubmit={(event) => {
        event.preventDefault();
        if (saving) return;
        const nextErrors = validate(form);
        setErrors(nextErrors);
        if (Object.keys(nextErrors).length > 0) return;
        onSubmit({
          brand: form.brand,
          model: form.model,
          year: Number(form.year),
          price: Number(form.price),
          image: form.image,
          image_alt: form.image_alt,
          description: form.description,
        });
      }}
    >

      <div className="flex flex-col gap-2">
      <label htmlFor="brand">Brand</label>
      <input
        className={fieldClass}
        value={form.brand}
        placeholder="Brand"
        onChange={(event) => setForm({ ...form, brand: event.target.value })}
      />
      {errors.brand && <p className="text-red-500 text-sm">{errors.brand}</p>}
      </div>

      <div className="flex flex-col gap-2">
      <label htmlFor="model">Model</label>
      <input
        className={fieldClass}
        value={form.model}
        placeholder="Model"
        onChange={(event) => setForm({ ...form, model: event.target.value })}
      />
      {errors.model && <p className="text-red-500 text-sm">{errors.model}</p>}
      </div>

      <div className="flex flex-col gap-2">
      <label htmlFor="year">Year</label>
      <input
        className={fieldClass}
        value={form.year}
        placeholder="Year"
        min={1900}
        max={2026}
        type="number"
        onChange={(event) => setForm({ ...form, year: event.target.value })}
      />
      {errors.year && <p className="text-red-500 text-sm">{errors.year}</p>}
      </div>

      <div className="flex flex-col gap-2">
      <label htmlFor="price">Price</label>
      <input
        className={fieldClass}
        value={form.price}
        placeholder="Price"
        min={0}
        type="number"
        onChange={(event) => setForm({ ...form, price: event.target.value })}
      />
      {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
      </div>

      <div className="flex flex-col gap-2">
      <label htmlFor="image">Image URL</label>
      <input
        className={fieldClass}
        value={form.image}
        placeholder="Image URL"
        onChange={(event) => setForm({ ...form, image: event.target.value })}
      />
      {errors.image && <p className="text-red-500 text-sm">{errors.image}</p>}
      </div>

      <div className="flex flex-col gap-2">
      <label htmlFor="image_alt">Image alt</label>
      <input
        className={fieldClass}
        value={form.image_alt}
        placeholder="Image alt"
        onChange={(event) => setForm({ ...form, image_alt: event.target.value })}
      />
      {errors.image_alt && <p className="text-red-500 text-sm">{errors.image_alt}</p>}
      </div>

      <div className="flex flex-col gap-2">
      <label htmlFor="description">Description</label>
      <textarea
        className={fieldClass}
        value={form.description}
        placeholder="Description"
        onChange={(event) => setForm({ ...form, description: event.target.value })}
      />
      {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
      </div>

      {submitError && <p className="text-red-500 text-sm">{submitError}</p>}

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={saving}
          className="w-fit flex items-center gap-2 text-[#666666] text-sm hover:text-[#666666]/80 rounded-xl disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
          {saving ? "Saving…" : isEdit ? "Save changes" : "Create car"}
        </button>
        <Button onClick={onCancel} icon={<X className="w-4 h-4" />}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
