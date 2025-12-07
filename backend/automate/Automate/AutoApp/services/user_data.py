from AutoApp.services.db_conn import fetch_all

def get_user_by_id(uid):
    rows = fetch_all("""
        SELECT felhasznalo_id, email, nev, szerep
        FROM felhasznalo
        WHERE felhasznalo_id = %s
        LIMIT 1
    """, [uid])
    return rows[0] if rows else None


def write_all_userdata(uid):
    info = fetch_all("""
    SELECT 
    f.felhasznalo_id,
    f.nev AS felhasznalo_nev,
    f.email,
    f.szerep,

    -- ==== Car information ====
    a.auto_id,
    a.rendszam,
    ma.nev AS marka,
    mo.modellnev AS modell,
    u.megnevezes AS uzemanyag,
    a.tank_kapacitas,
    a.teljesitmeny,
    a.gyartasi_ev,
    af.jogosultsag,

    -- ==== Route usage ====
    uh.utvonal_hasznalat_id,
    uh.datum AS utvonal_datum,

    honnan.varos AS honnan_varos,
    honnan.utca AS honnan_utca,
    honnan.hazszam AS honnan_hazszam,

    hova.varos AS hova_varos,
    hova.utca AS hova_utca,
    hova.hazszam AS hova_hazszam,

    -- ==== Fuelings ====
    t.tankolas_id,
    t.datum AS tankolas_datum,
    t.liter,
    t.ar_per_liter,
    b.nev AS benzinkut_nev,
    b.varos AS benzinkut_varos,

    -- ==== Maintenance ====
    k.karbantartas_id,
    k.datum AS karbantartas_datum,
    k.leiras,
    k.koltseg,
    sz.nev AS szerviz_nev

    FROM felhasznalo f
    LEFT JOIN auto_felhasznalo af ON f.felhasznalo_id = af.felhasznalo_id
    LEFT JOIN auto a ON af.auto_id = a.auto_id
    LEFT JOIN marka ma ON a.marka_id = ma.marka_id
    LEFT JOIN modell mo ON a.modell_id = mo.modell_id
    LEFT JOIN uzemanyag_tipus u ON a.uzemanyag_tipus_id = u.uzemanyag_tipus_id

    LEFT JOIN utvonal_hasznalat uh ON uh.felhasznalo_id = f.felhasznalo_id AND uh.auto_id = a.auto_id
    LEFT JOIN utvonal ut ON uh.utvonal_id = ut.utvonal_id
    LEFT JOIN cim honnan ON ut.honnan_cim_id = honnan.cim_id
    LEFT JOIN cim hova ON ut.hova_cim_id = hova.cim_id

    LEFT JOIN tankolas t ON t.felhasznalo_id = f.felhasznalo_id AND t.auto_id = a.auto_id
    LEFT JOIN benzinkut b ON t.benzinkut_id = b.benzinkut_id

    LEFT JOIN karbantartas k ON k.felhasznalo_id = f.felhasznalo_id AND k.auto_id = a.auto_id
    LEFT JOIN szerviz sz ON k.szerviz_id = sz.szerviz_id

    WHERE f.felhasznalo_id = %s;
    LIMIT 1;
    """,[uid])
    return info[0] if info else None