import Card from "../../../../components/card/card";
import Button from "../../../../components/button/button";
import { getCarImageSrc } from "../../../../assets/car-images/carImageOptions";

export default function CommunityProfiles({ loading, enabled, profiles, onCompare }) {
  if (loading) return null;

  if (!enabled) {
    return <p className="text-center text-light">Ehhez az autóhoz nincs engedélyezve a közösség.</p>;
  }

  return (
    <div className="row g-4">
      {profiles.length === 0 ? (
        <p className="text-center text-light">Még nincs másik engedélyezett profil.</p>
      ) : (
        profiles.map((profile) => (
          <div key={`${profile.user_id}_${profile.car_id}`} className="col-12 col-md-6 col-xl-4">
            <Card>
              <div className="p-3 text-center text-light">
                <img
                  src={profile.profile_image || getCarImageSrc(profile.car_image || profile.carImage)}
                  alt={profile.car_name || "Autó"}
                  style={{ width: "130px", height: "130px", objectFit: "contain" }}
                />
                <h5 className="text-primary mt-3 mb-1">{profile.full_name}</h5>
                <p className="mb-1">{profile.car_name}</p>
                <p className="mb-3 text-secondary">{profile.license_plate}</p>
                <Button text="Statisztikák összehasonlítása" onClick={() => onCompare(profile)} />
              </div>
            </Card>
          </div>
        ))
      )}
    </div>
  );
}
