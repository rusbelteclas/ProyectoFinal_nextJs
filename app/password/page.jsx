"use client"

import { useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { useRouter } from 'next/navigation';

export default function ChangePasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleChangePassword = async () => {
    setError("");
    setSuccess(false);

    // Validar que la contraseña y la confirmación coincidan
    if (!password || password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    if (password !== confirmPassword) {
      setError("La contraseña y la confirmación no coinciden");
      return;
    }

    try {
      const user = supabase.auth.user();

      if (!user) {
        throw new Error("Usuario no autenticado");
      }

      // Actualizar la contraseña del usuario en Supabase
      const { error } = await supabase.auth.update({
        password,
      });

      if (error) {
        throw error;
      }

      setSuccess(true);
      setPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        router.reload();
      }, 2000); // Recargar la página después de 2 segundos
    } catch (error) {
      setError("Error al cambiar la contraseña: " + error.message);
    }
  };

  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
      <form className="animate-in flex-1 flex flex-col w-full max-w-md mx-auto justify-center items-center gap-6 p-6 rounded-lg shadow-lg text-white">
        <label className="text-lg font-semibold mb-2" htmlFor="password">
          Nueva Contraseña
        </label>
        <input
          className="rounded-full px-4 py-3 w-full bg-gray-800 border border-gray-700 focus:outline-none focus:border-green-700 text-white"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Ingresa tu nueva contraseña"
          required
        />

        <label className="text-lg font-semibold mb-2" htmlFor="confirmPassword">
          Confirmar Contraseña
        </label>
        <input
          className="rounded-full px-4 py-3 w-full bg-gray-800 border border-gray-700 focus:outline-none focus:border-green-700 text-white"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirma tu nueva contraseña"
          required
        />

        <button
          onClick={handleChangePassword}
          className="bg-green-700 rounded-full px-6 py-3 text-white hover:bg-green-600 transition duration-300"
        >
          Cambiar Contraseña
        </button>

        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-500 text-sm">Contraseña cambiada exitosamente.</p>}
      </form>
    </div>
  );
}
