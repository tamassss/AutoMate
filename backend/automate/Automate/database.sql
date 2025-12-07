CREATE DATABASE automate;
USE automate;

-- =======================
--        Felhasználó
-- =======================
CREATE TABLE felhasznalo (
    felhasznalo_id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    jelszo_hash VARCHAR(255) NOT NULL,
    nev VARCHAR(255),
    szerep ENUM('admin', 'user') DEFAULT 'user'
);

-- =======================
--        Márka
-- =======================
CREATE TABLE marka (
    marka_id INT AUTO_INCREMENT PRIMARY KEY,
    nev VARCHAR(255) NOT NULL UNIQUE
);

-- =======================
--        Modell
-- =======================
CREATE TABLE modell (
    modell_id INT AUTO_INCREMENT PRIMARY KEY,
    marka_id INT NOT NULL,
    modellnev VARCHAR(255) NOT NULL,
    FOREIGN KEY (marka_id) REFERENCES marka(marka_id)
);

-- =======================
--   Üzemanyag típus
-- =======================
CREATE TABLE uzemanyag_tipus (
    uzemanyag_tipus_id INT AUTO_INCREMENT PRIMARY KEY,
    megnevezes VARCHAR(100) NOT NULL UNIQUE
);

-- =======================
--         Autó
-- =======================
CREATE TABLE auto (
    auto_id INT AUTO_INCREMENT PRIMARY KEY,
    rendszam VARCHAR(20) NOT NULL UNIQUE,
    marka_id INT NOT NULL,
    modell_id INT NOT NULL,
    uzemanyag_tipus_id INT NOT NULL,
    tank_kapacitas DECIMAL(5,2),
    teljesitmeny INT,
    gyartasi_ev INT,
    FOREIGN KEY (marka_id) REFERENCES marka(marka_id),
    FOREIGN KEY (modell_id) REFERENCES modell(modell_id),
    FOREIGN KEY (uzemanyag_tipus_id) REFERENCES uzemanyag_tipus(uzemanyag_tipus_id)
);

-- =======================
-- Autó-Felhasználó (M:N)
-- =======================
CREATE TABLE auto_felhasznalo (
    auto_id INT NOT NULL,
    felhasznalo_id INT NOT NULL,
    jogosultsag ENUM('tulaj', 'hasznalo') NOT NULL,
    PRIMARY KEY (auto_id, felhasznalo_id),
    FOREIGN KEY (auto_id) REFERENCES auto(auto_id),
    FOREIGN KEY (felhasznalo_id) REFERENCES felhasznalo(felhasznalo_id)
);

-- =======================
--        Cím
-- =======================
CREATE TABLE cim (
    cim_id INT AUTO_INCREMENT PRIMARY KEY,
    orszag VARCHAR(100),
    varos VARCHAR(100) NOT NULL,
    iranyitoszam VARCHAR(10),
    utca VARCHAR(255),
    hazszam VARCHAR(10)
);

-- =======================
--        Útvonal
-- =======================
CREATE TABLE utvonal (
    utvonal_id INT AUTO_INCREMENT PRIMARY KEY,
    honnan_cim_id INT NOT NULL,
    hova_cim_id INT NOT NULL,
    FOREIGN KEY (honnan_cim_id) REFERENCES cim(cim_id),
    FOREIGN KEY (hova_cim_id) REFERENCES cim(cim_id)
);

-- =======================
--    Útvonal Használat
-- =======================
CREATE TABLE utvonal_hasznalat (
    utvonal_hasznalat_id INT AUTO_INCREMENT PRIMARY KEY,
    auto_id INT NOT NULL,
    felhasznalo_id INT NOT NULL,
    utvonal_id INT NOT NULL,
    datum DATETIME NOT NULL,
    FOREIGN KEY (auto_id) REFERENCES auto(auto_id),
    FOREIGN KEY (felhasznalo_id) REFERENCES felhasznalo(felhasznalo_id),
    FOREIGN KEY (utvonal_id) REFERENCES utvonal(utvonal_id)
);

-- =======================
--      Benzinkút
-- =======================
CREATE TABLE benzinkut (
    benzinkut_id INT AUTO_INCREMENT PRIMARY KEY,
    nev VARCHAR(255),
    varos VARCHAR(100),
    iranyitoszam VARCHAR(10),
    utca VARCHAR(255),
    hazszam VARCHAR(10)
);

-- =======================
--        Tankolás
-- =======================
CREATE TABLE tankolas (
    tankolas_id INT AUTO_INCREMENT PRIMARY KEY,
    felhasznalo_id INT NOT NULL,
    auto_id INT NOT NULL,
    benzinkut_id INT NOT NULL,
    datum DATETIME NOT NULL,
    liter DECIMAL(7,2) NOT NULL,
    ar_per_liter DECIMAL(7,2) NOT NULL,
    FOREIGN KEY (felhasznalo_id) REFERENCES felhasznalo(felhasznalo_id),
    FOREIGN KEY (auto_id) REFERENCES auto(auto_id),
    FOREIGN KEY (benzinkut_id) REFERENCES benzinkut(benzinkut_id)
);

-- =======================
--        Szerviz
-- =======================
CREATE TABLE szerviz (
    szerviz_id INT AUTO_INCREMENT PRIMARY KEY,
    nev VARCHAR(255) NOT NULL,
    varos VARCHAR(100),
    iranyitoszam VARCHAR(10),
    utca VARCHAR(255),
    hazszam VARCHAR(10)
);

-- =======================
--     Karbantartás
-- =======================
CREATE TABLE karbantartas (
    karbantartas_id INT AUTO_INCREMENT PRIMARY KEY,
    auto_id INT NOT NULL,
    szerviz_id INT NOT NULL,
    felhasznalo_id INT NOT NULL,
    datum DATETIME NOT NULL,
    leiras TEXT,
    koltseg DECIMAL(10,2),
    FOREIGN KEY (auto_id) REFERENCES auto(auto_id),
    FOREIGN KEY (szerviz_id) REFERENCES szerviz(szerviz_id),
    FOREIGN KEY (felhasznalo_id) REFERENCES felhasznalo(felhasznalo_id)
);
