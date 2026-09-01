import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { PageLayout } from "../components/layouts";
import { ProfileForm } from "../components/profile";
import * as ApiService from "../services/api-services";

function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [saved, setSaved] = useState(false);
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

  return (
    <PageLayout title="Perfil">
      <section className="profile-layout panel">
        <div className="avatar-circle">{profile?.name?.[0]?.toUpperCase() || "I"}</div>
        <div>
          <h2>Tu perfil</h2>
          {profile ? <ProfileForm key={`${profile.name}-${profile.objective}`} profile={profile} onSubmit={handleSubmit} /> : <p className="empty-state">Cargando...</p>}
          {saved && <p className="success">Perfil actualizado</p>}
        </div>
      </section>
    </PageLayout>
  );
}

export default ProfilePage;
