import InputError from "@/Components/InputError";
import { Head, Link, useForm } from "@inertiajs/react";
import { useState } from "react";
import { toast } from "sonner";

export default function Login({ status, canResetPassword }) {
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route("login"), {
            onStart: () =>
                toast.loading("Memproses masuk...", { id: "login-toast" }),
            onSuccess: () => {
                toast.dismiss("login-toast");
                toast.success("Selamat datang kembali!");
            },
            onError: () => {
                toast.dismiss("login-toast");
                toast.error(
                    "Gagal masuk, periksa kembali email dan password Anda.",
                );
            },
            onFinish: () => reset("password"),
        });
    };

    return (
        <div className="bg-slate-50 text-slate-900 font-body min-h-screen">
            <Head title="Login | LARIS POS" />

            <div className="flex min-h-screen w-full">
                {/* Left Side: Visual & Brand Messaging */}
                <section className="hidden lg:flex flex-col justify-between w-1/2 p-12 relative bg-gradient-to-br from-orange-400 to-orange-600 overflow-hidden">
                    <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-white/20 rounded-full blur-[100px] -mr-48 -mb-48"></div>

                    <div className="relative z-10">
                        <span className="font-headline font-black text-3xl tracking-tighter text-orange-900">
                            LARIS
                        </span>
                    </div>

                    <div className="relative z-10 flex flex-col items-center justify-center space-y-12">
                        <div className="w-full max-w-lg aspect-square rounded-[32px] overflow-hidden shadow-2xl transform -rotate-2 hover:rotate-0 transition-all duration-700 bg-white/10 backdrop-blur-md p-8 border border-white/20">
                            <img
                                alt="LARIS Logo"
                                className="w-full h-full object-contain filter drop-shadow-2xl"
                                src="/images/laris-logo-tranparent.png"
                            />
                        </div>
                        <div className="text-center max-w-md">
                            <h1 className="text-4xl lg:text-5xl font-extrabold text-orange-950 leading-tight mb-4 tracking-tight">
                                Tumbuh Lebih Cepat Bersama LARIS
                            </h1>
                            <p className="text-lg text-orange-900/70 font-medium">
                                Kelola bisnis UMKM Anda dengan lebih pintar dan
                                efisien.
                            </p>
                        </div>
                    </div>

                    <div className="relative z-10 flex gap-4 text-orange-900/40 text-sm font-semibold tracking-wider uppercase">
                        <span>Efisiensi</span>
                        <span className="w-1 h-1 rounded-full bg-orange-500/30 mt-2"></span>
                        <span>Keamanan</span>
                        <span className="w-1 h-1 rounded-full bg-orange-500/30 mt-2"></span>
                        <span>Pertumbuhan</span>
                    </div>
                </section>

                {/* Right Side: Login Form */}
                <main className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 md:p-24 bg-white">
                    <div className="w-full max-w-md space-y-8">
                        <div className="lg:hidden flex justify-center mb-10">
                            <img 
                                src="/images/laris-logo-tranparent.png" 
                                alt="LARIS Logo" 
                                className="h-16 w-auto object-contain"
                            />
                        </div>
                        <header className="space-y-2">
                            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                                Selamat Datang Kembali
                            </h2>
                            <p className="text-slate-500 font-medium">
                                Silakan masuk ke akun Anda untuk melanjutkan.
                            </p>
                        </header>

                        {status && (
                            <div className="mb-4 text-sm font-medium text-green-600 font-bold">
                                {status}
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-6">
                            <div className="space-y-2">
                                <label
                                    className="text-sm font-bold text-slate-500 uppercase tracking-widest"
                                    htmlFor="email"
                                >
                                    Email
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                        <span className="material-symbols-outlined text-[20px]">
                                            mail
                                        </span>
                                    </div>
                                    <input
                                        className="block w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all duration-200 placeholder:text-slate-400"
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        autoComplete="username"
                                        placeholder="Contoh: budi@email.com"
                                        onChange={(e) =>
                                            setData("email", e.target.value)
                                        }
                                    />
                                </div>
                                <InputError
                                    message={errors.email}
                                    className="mt-2"
                                />
                            </div>

                            <div className="space-y-2">
                                <label
                                    className="text-sm font-bold text-slate-500 uppercase tracking-widest"
                                    htmlFor="password"
                                >
                                    Kata Sandi
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                        <span className="material-symbols-outlined text-[20px]">
                                            lock
                                        </span>
                                    </div>
                                    <input
                                        className="block w-full pl-12 pr-12 py-4 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all duration-200 placeholder:text-slate-400"
                                        id="password"
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        name="password"
                                        value={data.password}
                                        autoComplete="current-password"
                                        placeholder="Masukkan kata sandi Anda"
                                        onChange={(e) =>
                                            setData("password", e.target.value)
                                        }
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-orange-600 transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-[20px]">
                                            {showPassword
                                                ? "visibility_off"
                                                : "visibility"}
                                        </span>
                                    </button>
                                </div>
                                <InputError
                                    message={errors.password}
                                    className="mt-2"
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className="relative flex items-center justify-center">
                                        <input
                                            type="checkbox"
                                            name="remember"
                                            checked={data.remember}
                                            onChange={(e) =>
                                                setData(
                                                    "remember",
                                                    e.target.checked,
                                                )
                                            }
                                            className="peer appearance-none w-5 h-5 border-2 border-slate-200 rounded-md checked:bg-orange-600 checked:border-orange-600 transition-all duration-200"
                                        />
                                        <span
                                            className="material-symbols-outlined absolute text-white text-[14px] opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"
                                            style={{
                                                fontVariationSettings:
                                                    "'FILL' 1",
                                            }}
                                        >
                                            check
                                        </span>
                                    </div>
                                    <span className="text-sm font-semibold text-slate-500 group-hover:text-slate-900 transition-colors">
                                        Ingat Saya
                                    </span>
                                </label>
                                {canResetPassword && (
                                    <Link
                                        href={route("password.request")}
                                        className="text-sm font-bold text-orange-600 hover:text-orange-800 transition-colors"
                                    >
                                        Lupa Kata Sandi?
                                    </Link>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-4 bg-gradient-to-r from-orange-600 to-orange-500 text-white font-extrabold text-lg rounded-xl shadow-lg shadow-orange-600/20 active:scale-95 transition-all duration-150 disabled:opacity-50"
                            >
                                Masuk Sekarang
                            </button>
                        </form>

                        <div className="relative flex items-center py-4">
                            <div className="flex-grow border-t border-slate-100"></div>
                            <span className="flex-shrink mx-4 text-xs font-bold text-slate-400 uppercase tracking-widest bg-white px-2">
                                Atau masuk dengan
                            </span>
                            <div className="flex-grow border-t border-slate-100"></div>
                        </div>

                        <button className="w-full py-4 px-6 bg-white border border-slate-100 rounded-xl flex items-center justify-center gap-3 hover:bg-slate-50 active:scale-95 transition-all duration-150 group">
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4"
                                ></path>
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                ></path>
                                <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                                    fill="#FBBC05"
                                ></path>
                                <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12.16-4.53z"
                                    fill="#EA4335"
                                ></path>
                            </svg>
                            <span className="text-slate-900 font-bold">
                                Google
                            </span>
                        </button>

                        <footer className="text-center pt-8">
                            <p className="text-slate-500 font-medium">
                                Belum punya akun?
                                <Link
                                    href={route("register")}
                                    className="text-orange-600 font-bold hover:underline ml-1"
                                >
                                    Daftar Sekarang
                                </Link>
                            </p>
                        </footer>
                    </div>
                </main>
            </div>
        </div>
    );
}
