import Link from "next/link";
import { headers } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { SubmitButton } from "../submit-button";

export default function Magiclink({
  searchParams,
}: {
  searchParams: { message: string };
}) {
  const sendEmail = async (formData: FormData) => {
    "use server"; // Marcamos la función para que se ejecute en el servidor

    const origin = headers().get("origin");
    const email = formData.get("email") as string;
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false,
        emailRedirectTo: `${origin}/auth/callback`,
      },
    });

    if (error) {
      return redirect("/login?message=No se pudo validar el correo!");
    }

    return redirect("/login?message=Te hemos enviado tu acceso al email");
  };

  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
      <form className="animate-in flex-1 flex flex-col w-full max-w-md mx-auto justify-center items-center gap-4 p-6 rounded-lg shadow-lg text-white">
        <label className="text-lg font-semibold mb-2" htmlFor="email">
          Inicia sesion con un link que te enviaremos a tu email
        </label>
        <input
          className="rounded-full px-4 py-3 w-full bg-gray-800 border border-gray-700 focus:outline-none focus:border-green-700 text-white"
          type="email"
          name="email"
          placeholder="Ingresa tu correo electrónico"
          required
        />

        <SubmitButton
          formAction={sendEmail}
          className="bg-green-700 rounded-full px-6 py-3 text-white hover:bg-green-600 transition duration-300 w-full"
          pendingText="Iniciando Sesión..."
        >
          ENVIARME ACCESO RAPIDO
        </SubmitButton>

        {searchParams?.message && (
          <p className="text-base p-4 bg-gray-800 text-white text-center rounded">
            {searchParams.message}
          </p>
        )}
      </form>
    </div>
  );
}
