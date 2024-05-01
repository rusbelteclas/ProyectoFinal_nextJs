import { headers } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { SubmitButton } from "./submit-button";

export default function Login({
  searchParams,
}: {
  searchParams: { message: string };
}) {
  const signIn = async (formData: FormData) => {
    "use server";

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return redirect("/login?message=Could not authenticate user");
    }

    return redirect("/notas");
  };

  const signUp = async (formData: FormData) => {
    "use server";

    const origin = headers().get("origin");
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const supabase = createClient();

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
      },
    });

    if (error) {
      return redirect("/login?message=Could not authenticate user");
    }

    return redirect("/login?message=Check email to continue sign in process");
  };

  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
      <form className="animate-in flex-1 flex flex-col w-full max-w-md mx-auto justify-center items-center gap-6 p-6 rounded-lg shadow-lg bg-black text-white">
        <label className="text-lg font-semibold mb-2" htmlFor="email">
          Tu Correo Electrónico
        </label>
        <input
          className="rounded-full px-4 py-3 w-full bg-gray-800 border border-gray-700 focus:outline-none focus:border-green-700 text-white"
          name="email"
          placeholder="Ingresa tu correo electrónico"
          required
        />

        <label className="text-lg font-semibold mb-2" htmlFor="password">
          Contraseña Secreta
        </label>
        <input
          className="rounded-full px-4 py-3 w-full bg-gray-800 border border-gray-700 focus:outline-none focus:border-green-700 text-white"
          type="password"
          name="password"
          placeholder="Escribe tu contraseña secreta"
          required
        />

        <div className="flex flex-col md:flex-row gap-4">
          <SubmitButton
            formAction={signIn}
            className="bg-green-700 rounded-full px-6 py-3 text-white hover:bg-green-600 transition duration-300"
            pendingText="Iniciando Sesión..."
          >
            Iniciar Sesión
          </SubmitButton>

          <SubmitButton
            formAction={signUp}
            className="border border-green-700 rounded-full px-6 py-3 text-green-700 hover:border-green-600 hover:text-white transition duration-300"
            pendingText="Creando Cuenta..."
          >
            Crear Cuenta Nueva
          </SubmitButton>
        </div>

        <a href="/password" className="text-sm text-green-500 mb-4 block text-center cursor-pointer">
          ¿Olvidaste tu contraseña?
        </a>

        {searchParams?.message && (
          <p className="text-base p-4 bg-gray-800 text-white text-center rounded">
            {searchParams.message}
          </p>
        )}
      </form>
    </div>
  );
}
