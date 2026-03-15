import { useCallback, useEffect, useMemo, useState } from "react";

import Navbar from "../../../../components/navbar/navbar";
import Menu from "../../dashboard/menu/menu";
import CommunityComparisonModal from "../../../../modals/communityComparisonModal/communityComparisonModal";
import CommunityProfiles from "./communityProfiles";
import CommunityGasStations from "./communityGasStations";

import * as CommunityActions from "../../../../actions/community/communityLocalActions";

import "../menuLayout.css";
import "./community.css";

export default function Community() {
  const { role } = CommunityActions.getCurrentUserMeta();
  const selectedCarId = Number(localStorage.getItem("selected_car_id") || 0);
  const isModerator = role === "moderator" || role === "admin";

  const [activeTab, setActiveTab] = useState("profiles");
  const [loading, setLoading] = useState(true);
  const [enabled, setEnabled] = useState(false);
  const [error, setError] = useState("");

  const [profiles, setProfiles] = useState([]);
  const [sharedStations, setSharedStations] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);

  const [myProfile, setMyProfile] = useState(null);
  const [compareTarget, setCompareTarget] = useState(null);
  const [compareState, setCompareState] = useState({ data: null, loading: false, error: "" });

  const refreshCommunityData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [payload, shared] = await Promise.all([
        CommunityActions.getCommunityProfilesPayload(selectedCarId),
        CommunityActions.getApprovedSharedStations(),
      ]);

      setEnabled(!!payload.enabled);
      setMyProfile(payload.my_profile || null);
      setProfiles(payload.profiles || []);
      setSharedStations(shared || []);

      if (isModerator) {
        const pending = await CommunityActions.getPendingShareRequests();
        setPendingRequests(pending);
      } else {
        setPendingRequests([]);
      }
    } catch (err) {
      setError(err.message || "Hiba történt az adatok betöltésekor.");
    } finally {
      setLoading(false);
    }
  }, [isModerator, selectedCarId]);

  useEffect(() => {
    refreshCommunityData();
  }, [refreshCommunityData]);

  const handleReviewRequest = async (requestId, decision) => {
    await CommunityActions.reviewShareRequest(requestId, decision);
    await refreshCommunityData();
  };

  const handleDeleteShared = async (requestId) => {
    if (!isModerator) return;
    try {
      await CommunityActions.moderatorDeleteSharedStation(requestId);
      await refreshCommunityData();
    } catch {
      setError("Nem sikerült a törlés.");
    }
  };

  const handleCompare = async (targetProfile) => {
    if (!myProfile) return;
    setCompareTarget(targetProfile);
    setCompareState({ data: null, loading: true, error: "" });

    try {
      const result = await CommunityActions.getCommunityMonthlyComparison({
        carId: selectedCarId,
        otherUserId: targetProfile.user_id,
        otherCarId: targetProfile.car_id,
      });
      setCompareState((previousState) => ({ ...previousState, data: result, loading: false }));
    } catch {
      setCompareState((previousState) => ({ ...previousState, error: "Hiba a mérésnél.", loading: false }));
    }
  };

  const formattedSharedStations = useMemo(
    () =>
      sharedStations.map((sharedItem) => ({
        ...sharedItem.station,
        datum: sharedItem.approved_at?.slice(0, 10) || "-",
        extraInfo: `${sharedItem.full_name} - ${sharedItem.car_name}`,
        requestId: sharedItem.request_id,
      })),
    [sharedStations]
  );

  return (
    <div className="main-menu-layout">
      <div className="main-menu-content">
        <Menu />
      </div>

      <div className="flex-grow-1">
        <Navbar />

        <div>
          <div className="container-fluid p-0 community-tabs">
            <div className="row g-0">
              {["profiles", "stations"].map((tab) => (
                <div
                  key={tab}
                  className={`col-6 d-flex justify-content-center align-items-center community-tab ${activeTab === tab ? "active" : "inactive"}`}
                  onClick={() => setActiveTab(tab)}
                >
                  <p className="fs-5 m-0 py-3">{tab === "profiles" ? "Profilok" : "Benzinkutak"}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="container py-4">
            <h1 className="text-center text-primary mb-4 fw-bold">Közösség</h1>

            {loading && <p className="text-center text-light">Betöltés...</p>}
            {error && <p className="text-danger text-center">{error}</p>}

            {activeTab === "profiles" && (
              <CommunityProfiles loading={loading} enabled={enabled} profiles={profiles} onCompare={handleCompare} />
            )}

            {activeTab === "stations" && (
              <CommunityGasStations
                loading={loading}
                canShowStationsTab={enabled || isModerator}
                isModerator={isModerator}
                pendingRequests={pendingRequests}
                sharedCards={formattedSharedStations}
                onReview={handleReviewRequest}
                onDeleteShared={handleDeleteShared}
              />
            )}
          </div>
        </div>
      </div>

      {compareTarget && myProfile && (
        <CommunityComparisonModal
          onClose={() => setCompareTarget(null)}
          myProfile={myProfile}
          otherProfile={compareTarget}
          compareData={compareState.data}
          compareLoading={compareState.loading}
          compareError={compareState.error}
        />
      )}
    </div>
  );
}
