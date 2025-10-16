import React, { useState } from "react";
import { useAuthStore } from "@/stores/useAuthStore";

const ChangePasswordModal: React.FC = () => {
  const { showChangePasswordModal, setShowChangePasswordModal, user } = useAuthStore();
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!showChangePasswordModal) return null;

  const handleValidate = async () => {
    setError("");

    if (newPassword.trim().length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    if (newPassword !== confirm) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        "http://69.62.105.205:8080/api-utilisateur/v1/changePassword",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
          body: JSON.stringify({
            login: user?.login,
            nouveauMotDePasse: newPassword,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok || data.status !== "200") {
        setError(data.message || "Erreur lors du changement de mot de passe.");
        return;
      }

      setShowChangePasswordModal(false); // Ferme le modal
    } catch (err) {
      console.error(err);
      setError("Erreur réseau, veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999]">
      <div className="bg-white p-6 rounded-2xl shadow-2xl w-[400px]">
        <h2 className="text-xl font-semibold text-center mb-4 text-gray-700">
          🔐 Changement de mot de passe
        </h2>

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-600">Nouveau mot de passe</label>
            <input
              type="password"
              className="w-full border rounded p-2 mt-1 focus:ring-2 focus:ring-blue-400"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">Confirmer le mot de passe</label>
            <input
              type="password"
              className="w-full border rounded p-2 mt-1 focus:ring-2 focus:ring-blue-400"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm border border-red-300 bg-red-50 rounded-md p-2">
              {error}
            </div>
          )}

          <button
            onClick={handleValidate}
            disabled={loading}
            className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition"
          >
            {loading ? "Enregistrement..." : "Valider"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
