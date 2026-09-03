import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { PageLayout } from "../components/layouts";
import { ProfileForm } from "../components/profile";
import * as ApiService from "../services/api-services";

function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [saved, setSaved] = useState(false);
  const [avatarError, setAvatarError] = useState(null);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    ApiService.getProfile()
      .then(setProfile)
      .catch((error) => {
        if (error?.response?.status === 401) navigate("/login");
      });
  }, [navigate]);

  const handleSubmit = async (payload) => {
    const updated = await ApiService.updateProfile(payload);
    setProfile(updated);
    setSaved(true);
  };

  const handleAvatarChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setAvatarError(null);
    setAvatarLoading(true);

    try {
      const updated = await ApiService.uploadProfileAvatar(file);
      setProfile(updated);
      setSaved(true);
    } catch (error) {
      if (error?.response?.status === 401) navigate("/login");
      setAvatarError(
        error?.response?.data?.message || "No se pudo subir la foto",
      );
    } finally {
      setAvatarLoading(false);
      event.target.value = "";
    }
  };

  return (
    <PageLayout title="Perfil">
      <section className="profile-layout panel">
        <div className="avatar-column">
          <label className="avatar-circle" htmlFor="avatar-upload">
            {profile?.avatarUrl ? (
              <img src={profile.avatarUrl} alt="Foto de perfil" />
            ) : (
              <span>{profile?.name?.[0]?.toUpperCase() || "I"}</span>
            )}
            <span className="avatar-hover" aria-hidden="true">
              ✎
            </span>
          </label>
          <input
            id="avatar-upload"
            className="file-input"
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            disabled={!profile || avatarLoading}
          />
          {avatarError && <p className="error">{avatarError}</p>}
        </div>
        <div>
          <h2>Editar perfil</h2>
          {profile ? (
            <ProfileForm
              key={`${profile.name}-${profile.objective}-${profile.avatarUrl || ""}`}
              profile={profile}
              onSubmit={handleSubmit}
            />
          ) : (
            <p className="empty-state">Cargando...</p>
          )}
          {saved && <p className="success">Perfil actualizado</p>}
        </div>
      </section>
    </PageLayout>
  );
}

export default ProfilePage;
