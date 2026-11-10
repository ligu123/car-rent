"use client";

import { useCallback, useEffect, useState } from "react";
import Table from "../components/table";
import CarForm, { type CarFormValues } from "../components/car-form";
import type { Car } from "@/packages/types/car";
import Link from "next/link";
import Button from "../components/button";
import { Plus, Trash, X } from "lucide-react";

const API = "http://localhost:4000";

async function readErrorMessage(res: Response, fallback: string) {
  try {
    const data: { message?: unknown } = await res.json();
    if (typeof data.message === "string" && data.message.trim()) {
      return data.message;
    }
  } catch {
    // body was empty or not JSON
  }
  return fallback;
}

export default function ManagementPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [carToDelete, setCarToDelete] = useState<Car | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const loadCars = useCallback(() => {
    fetch(`${API}/cars`)
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`Could not load cars (${res.status})`);
        }
        const data: { cars?: Car[] } = await res.json();
        setCars(data.cars ?? []);
      })
      .catch((error: unknown) => {
        const message =
          error instanceof Error ? error.message : "Could not load cars";
        console.error(message);
      });
  }, []);

  useEffect(() => {
    loadCars();
  }, [loadCars]);

  function openCreate() {
    setEditingCar(null);
    setSaveError("");
    setShowForm(true);
  }

  function openEdit(car: Car) {
    setEditingCar(car);
    setSaveError("");
    setShowForm(true);
  }

  function closeForm() {
    if (saving) return;
    setShowForm(false);
    setEditingCar(null);
    setSaveError("");
  }

  async function saveCar(values: CarFormValues) {
    if (saving) return;

    const url = editingCar ? `${API}/cars/${editingCar.id}` : `${API}/cars`;
    const method = editingCar ? "PATCH" : "POST";

    setSaving(true);
    setSaveError("");

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        throw new Error(
          await readErrorMessage(res, `Save failed (${res.status})`)
        );
      }

      setShowForm(false);
      setEditingCar(null);
      setSaveError("");
      loadCars();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Could not save car";
      setSaveError(message);
    } finally {
      setSaving(false);
    }
  }

  function requestDelete(car: Car) {
    setCarToDelete(car);
    setDeleteError("");
  }

  function cancelDelete() {
    if (deleting) return;
    setCarToDelete(null);
    setDeleteError("");
  }

  async function confirmDelete() {
    if (!carToDelete || deleting) return;

    setDeleting(true);
    setDeleteError("");

    try {
      const res = await fetch(`${API}/cars/${carToDelete.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error(
          await readErrorMessage(res, `Delete failed (${res.status})`)
        );
      }
      setCarToDelete(null);
      loadCars();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Could not delete car";
      setDeleteError(message);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="flex flex-col items-center bg-background font-sans text-foreground">
      <main className="flex flex-col w-full max-w-7xl items-start gap-8 py-16 px-16">
        <Link href="/">Home</Link>
        <div className="flex flex-row gap-2 justify-between w-full">
          <h1 className="text-2xl font-medium">Management Page</h1>
          <Button onClick={openCreate} icon={<Plus className="w-4 h-4" />}>
            Add Car
          </Button>
        </div>

        {showForm && (
          <CarForm
            key={editingCar?.id ?? "new"}
            car={editingCar}
            saving={saving}
            submitError={saveError}
            onSubmit={(values) => void saveCar(values)}
            onCancel={closeForm}
          />
        )}

        {carToDelete && (
          <div className="flex w-full flex-col gap-3">
            <div className="flex w-full items-center justify-between gap-3">
              <p>
                Delete {carToDelete.brand} {carToDelete.model}?
              </p>
              <div className="flex gap-4">
                <Button
                  onClick={() => void confirmDelete()}
                  icon={<Trash className="w-4 h-4" />}
                >
                  {deleting ? "Deleting…" : "Confirm"}
                </Button>
                <Button onClick={cancelDelete} icon={<X className="w-4 h-4" />}>
                  Cancel
                </Button>
              </div>
            </div>
            {deleteError && (
              <p className="text-red-500 text-sm">{deleteError}</p>
            )}
          </div>
        )}

        <Table carData={cars} onEdit={openEdit} onDelete={requestDelete} />
      </main>
    </div>
  );
}
