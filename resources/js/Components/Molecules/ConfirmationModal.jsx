import Modal from "@/Components/Modal";
import SecondaryButton from "@/Components/SecondaryButton";
import DangerButton from "@/Components/DangerButton";
import PrimaryButton from "@/Components/PrimaryButton";

export default function ConfirmationModal({
    show = false,
    onClose = () => {},
    onConfirm = () => {},
    title = "Konfirmasi",
    message = "Apakah Anda yakin ingin melakukan tindakan ini?",
    type = "danger", // danger, warning, success, info
    confirmLabel = "Ya, Lanjutkan",
    cancelLabel = "Batal",
    loading = false,
}) {
    const getIcon = () => {
        switch (type) {
            case "danger":
                return (
                    <span className="material-symbols-outlined text-red-600 text-4xl">
                        report
                    </span>
                );
            case "warning":
                return (
                    <span className="material-symbols-outlined text-amber-600 text-4xl">
                        warning
                    </span>
                );
            case "success":
                return (
                    <span className="material-symbols-outlined text-green-600 text-4xl">
                        check_circle
                    </span>
                );
            default:
                return (
                    <span className="material-symbols-outlined text-primary-600 text-4xl">
                        help
                    </span>
                );
        }
    };

    const getIconBg = () => {
        switch (type) {
            case "danger":
                return "bg-red-50";
            case "warning":
                return "bg-amber-50";
            case "success":
                return "bg-green-50";
            default:
                return "bg-primary-50";
        }
    };

    return (
        <Modal show={show} onClose={onClose} maxWidth="sm">
            <div className="p-6">
                <div className="flex items-center justify-center mb-6">
                    <div
                        className={`w-20 h-20 ${getIconBg()} rounded-full flex items-center justify-center shadow-inner`}
                    >
                        {getIcon()}
                    </div>
                </div>

                <div className="text-center mb-8">
                    <h3 className="text-xl font-black text-slate-900 mb-2">
                        {title}
                    </h3>
                    <p className="text-sm text-slate-500 font-medium px-4">
                        {message}
                    </p>
                </div>

                <div className="flex gap-3 mt-6">
                    <SecondaryButton
                        onClick={onClose}
                        className="flex-1 justify-center py-3 rounded-xl border-slate-200 text-slate-600 font-bold"
                        disabled={loading}
                    >
                        {cancelLabel}
                    </SecondaryButton>

                    {type === "danger" ? (
                        <DangerButton
                            onClick={onConfirm}
                            className="flex-1 justify-center py-3 rounded-xl bg-red-600 hover:bg-red-700 shadow-lg shadow-red-600/20 font-bold"
                            disabled={loading}
                        >
                            {loading ? "Proses..." : confirmLabel}
                        </DangerButton>
                    ) : (
                        <PrimaryButton
                            onClick={onConfirm}
                            className="flex-1 justify-center py-3 rounded-xl bg-primary-600 hover:bg-primary-700 shadow-lg shadow-primary-600/20 font-bold"
                            disabled={loading}
                        >
                            {loading ? "Proses..." : confirmLabel}
                        </PrimaryButton>
                    )}
                </div>
            </div>
        </Modal>
    );
}
