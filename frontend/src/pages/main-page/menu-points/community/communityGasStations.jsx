import GasStationCard from "../../../../components/gas-station-card/gasStationCard";
import ModeratorPage from "../../../roles/moderator/moderatorPage";

export default function CommunityGasStations({
  loading,
  canShowStationsTab,
  isModerator,
  pendingRequests,
  sharedCards,
  onReview,
  onDeleteShared,
}) {
  if (loading) return null;

  return (
    <>
      {!canShowStationsTab ? <p className="text-center text-light">Kapcsold be a közösséget ehhez az autóhoz.</p> : null}

      {isModerator ? <ModeratorPage pendingRequests={pendingRequests} onReview={onReview} /> : null}

      {canShowStationsTab && sharedCards.length === 0 ? (
        <p className="text-center text-light mt-4">Még nincs jóváhagyott megosztott benzinkút.</p>
      ) : null}

      {canShowStationsTab && sharedCards.length > 0 ? (
        <div className="row g-4 justify-content-center mt-1">
          {sharedCards.map((card) => (
            <div key={`${card.gasStationId}_${card.requestId}`} className="col-11 col-md-6 col-lg-4 d-flex justify-content-center">
              <GasStationCard
                station={card}
                showDefaultActions={false}
                extraInfo={card.extraInfo}
                extraButtonText={isModerator ? "Törlés" : ""}
                onExtraButtonClick={() => onDeleteShared(card.requestId)}
              />
            </div>
          ))}
        </div>
      ) : null}
    </>
  );
}
