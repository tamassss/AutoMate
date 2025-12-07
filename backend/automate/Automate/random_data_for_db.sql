USE automate;

-- =======================
-- Felhasználók
-- =======================
INSERT INTO felhasznalo (felhasznalo_id, email, jelszo_hash, nev, szerep) VALUES
(1, 'admin@example.com', '$2y$10$adminhashplaceholder0123456789', 'Admin Felhasználó', 'admin'),
(2, 'balazs.kovacs@example.com', '$2y$10$userhash1abcdefghijkl', 'Kovács Balázs', 'user'),
(3, 'eva.nagy@example.com', '$2y$10$userhash2mnopqrstuvwx', 'Nagy Éva', 'user'),
(4, 'istvan.szm@example.com', '$2y$10$userhash3yzabcdefghi', 'Szabó István', 'user'),
(5, 'anna.kis@example.com', '$2y$10$userhash4jklmnopqrs', 'Kis Anna', 'user'),
(6, 'gabor.toth@example.com', '$2y$10$userhash5stuvwxyzab', 'Tóth Gábor', 'user'),
(7, 'zsolt.horvath@example.com', '$2y$10$userhash6cdefghijkl', 'Horváth Zsolt', 'user'),
(8, 'demo.user@example.com', '$2y$10$userhash7mnopqrst', 'Demo User', 'user');

-- =======================
-- Márkák
-- =======================
INSERT INTO marka (marka_id, nev) VALUES
(1, 'Toyota'),
(2, 'BMW'),
(3, 'Ford'),
(4, 'Volkswagen'),
(5, 'Tesla'),
(6, 'Opel');

-- =======================
-- Modellek
-- =======================
INSERT INTO modell (modell_id, marka_id, modellnev) VALUES
(1, 1, 'Corolla'),
(2, 1, 'Prius'),
(3, 2, '3 Series'),
(4, 2, 'X5'),
(5, 3, 'Focus'),
(6, 3, 'Fiesta'),
(7, 4, 'Golf'),
(8, 4, 'Passat'),
(9, 5, 'Model S'),
(10, 5, 'Model 3'),
(11, 6, 'Astra'),
(12, 6, 'Corsa');

-- =======================
-- Üzemanyag típusok
-- =======================
INSERT INTO uzemanyag_tipus (uzemanyag_tipus_id, megnevezes) VALUES
(1, 'benzin'),
(2, 'dízel'),
(3, 'hibrid'),
(4, 'elektromos');

-- =======================
-- Címek (cim)
-- =======================
INSERT INTO cim (cim_id, orszag, varos, iranyitoszam, utca, hazszam) VALUES
(1, 'Magyarország', 'Budapest', '1117', 'Dombóvári út', '23'),
(2, 'Magyarország', 'Budapest', '1065', 'Nagykörút', '12'),
(3, 'Magyarország', 'Debrecen', '4024', 'Piac utca', '4'),
(4, 'Magyarország', 'Szeged', '6720', 'Hajnal utca', '9'),
(5, 'Magyarország', 'Miskolc', '3525', 'Kossuth Lajos u.', '45'),
(6, 'Magyarország', 'Pécs', '7621', 'Rákóczi út', '18'),
(7, 'Magyarország', 'Győr', '9022', 'Baross G. u.', '3'),
(8, 'Magyarország', 'Sopron', '9400', 'Fő tér', '7'),
(9, 'Magyarország', 'Székesfehérvár', '8000', 'Várkörút', '2'),
(10, 'Magyarország', 'Kecskemét', '6000', 'Fő utca', '10'),
(11, 'Magyarország', 'Nyíregyháza', '4400', 'Bessenyei tér', '1'),
(12, 'Magyarország', 'Budapest', '1033', 'Szentendrei út', '50');

-- =======================
-- Benzinkutak
-- =======================
INSERT INTO benzinkut (benzinkut_id, nev, varos, iranyitoszam, utca, hazszam) VALUES
(1, 'Shell Bem', 'Budapest', '1117', 'Dombóvári út', '12'),
(2, 'MOL Kossuth', 'Miskolc', '3525', 'Kossuth Lajos u.', '47'),
(3, 'OMV Centrum', 'Pécs', '7621', 'Rákóczi út', '20'),
(4, 'Lukoil Győr', 'Győr', '9022', 'Baross G. u.', '6'),
(5, 'MOL Szeged', 'Szeged', '6720', 'Hajnal utca', '11');

-- =======================
-- Szervizek
-- =======================
INSERT INTO szerviz (szerviz_id, nev, varos, iranyitoszam, utca, hazszam) VALUES
(1, 'AutoServ Budapest', 'Budapest', '1117', 'Gépész utca', '2'),
(2, 'Miskolc Szerviz Kft.', 'Miskolc', '3525', 'Szerviz út', '5'),
(3, 'Pécs Autószerviz', 'Pécs', '7621', 'Szolgáltató u.', '1'),
(4, 'Győr Garázs', 'Győr', '9022', 'Szolgáltató tér', '9');

-- =======================
-- Autók
-- =======================
INSERT INTO auto (auto_id, rendszam, marka_id, modell_id, uzemanyag_tipus_id, tank_kapacitas, teljesitmeny, gyartasi_ev) VALUES
(1, 'ABC-123', 1, 1, 1, 50.00, 132, 2016),  -- Toyota Corolla, benzin
(2, 'BXA-456', 1, 2, 3, 45.00, 98, 2018),   -- Toyota Prius, hibrid
(3, 'MNB-789', 2, 3, 2, 60.00, 180, 2020),  -- BMW 3 Series, dízel
(4, 'XYZ-321', 2, 4, 1, 85.00, 300, 2019),  -- BMW X5, benzin
(5, 'FDO-555', 3, 5, 1, 52.00, 125, 2015),  -- Ford Focus, benzin
(6, 'FFT-110', 4, 7, 2, 55.00, 150, 2017),  -- VW Golf, dízel
(7, 'TES-001', 5, 9, 4, NULL, 670, 2021),   -- Tesla Model S, elektromos (tank NULL)
(8, 'TES-333', 5, 10, 4, NULL, 283, 2022),  -- Tesla Model 3
(9, 'OPL-202', 6, 11, 1, 48.00, 140, 2014), -- Opel Astra
(10,'COR-909', 6, 12, 1, 45.00, 90, 2013);  -- Opel Corsa

-- =======================
-- Autó-Felhasználó (tulaj / felhasználó)
-- =======================
INSERT INTO auto_felhasznalo (auto_id, felhasznalo_id, jogosultsag) VALUES
(1, 2, 'tulaj'), -- Balazs owns ABC-123
(1, 3, 'hasznalo'), -- Eva uses it
(2, 3, 'tulaj'), -- Eva owns Prius
(2, 4, 'hasznalo'),
(3, 5, 'tulaj'),
(4, 6, 'tulaj'),
(4, 2, 'hasznalo'),
(5, 7, 'tulaj'),
(6, 2, 'tulaj'),
(7, 8, 'tulaj'),
(8, 2, 'tulaj'),
(9, 5, 'tulaj'),
(10, 1, 'tulaj'); -- admin owns Corsa (demo)

-- =======================
-- Útvonalak
-- =======================
INSERT INTO utvonal (utvonal_id, honnan_cim_id, hova_cim_id) VALUES
(1, 1, 2),  -- Budapest Dombóvár út -> Nagykörút
(2, 2, 3),  -- Budapest Nagykörút -> Debrecen Piac utca
(3, 3, 4),  -- Debrecen -> Szeged
(4, 5, 6),  -- Miskolc -> Pécs
(5, 7, 1),  -- Győr -> Budapest
(6, 8, 9),  -- Sopron -> Székesfehérvár
(7, 10, 11),-- Kecskemét -> Nyíregyháza
(8, 12, 2); -- Budapest Szentendrei út -> Budapest Nagykörút

-- =======================
-- Útvonal használatok (példák)
-- =======================
INSERT INTO utvonal_hasznalat (utvonal_hasznalat_id, auto_id, felhasznalo_id, utvonal_id, datum) VALUES
(1, 1, 2, 1, '2025-11-15 08:30:00'),
(2, 1, 3, 1, '2025-10-05 09:00:00'),
(3, 2, 3, 2, '2025-09-25 07:45:00'),
(4, 3, 5, 3, '2025-08-12 12:00:00'),
(5, 4, 6, 5, '2025-06-20 14:10:00'),
(6, 5, 7, 4, '2024-12-01 10:00:00'),
(7, 6, 2, 6, '2025-01-10 16:30:00'),
(8, 7, 8, 7, '2025-05-05 11:20:00'),
(9, 8, 2, 8, '2025-04-18 18:45:00'),
(10, 9, 5, 4, '2024-11-11 09:15:00'),
(11, 10, 1, 1, '2025-03-03 07:00:00'),
(12, 3, 5, 3, '2024-06-21 19:00:00'),
(13, 4, 6, 5, '2023-08-01 13:30:00'),
(14, 2, 4, 2, '2024-02-14 08:00:00'),
(15, 1, 2, 1, '2023-09-09 09:09:00'),
(16, 6, 2, 6, '2025-02-15 10:10:00'),
(17, 5, 7, 4, '2025-07-21 17:00:00'),
(18, 8, 2, 8, '2025-10-01 20:20:00'),
(19, 7, 8, 7, '2025-11-01 08:00:00'),
(20, 9, 5, 4, '2025-11-03 15:35:00');

-- =======================
-- Tankolások
-- =======================
INSERT INTO tankolas (tankolas_id, felhasznalo_id, auto_id, benzinkut_id, datum, liter, ar_per_liter) VALUES
(1, 2, 1, 1, '2025-11-01 09:30:00', 45.50, 589.90),
(2, 3, 2, 3, '2025-10-22 12:00:00', 35.20, 549.90),
(3, 5, 3, 2, '2025-09-03 15:45:00', 60.00, 499.00),
(4, 6, 4, 4, '2025-08-12 11:10:00', 70.00, 629.00),
(5, 7, 5, 5, '2025-07-30 18:25:00', 40.00, 579.50),
(6, 2, 1, 1, '2025-06-15 07:50:00', 20.00, 599.90),
(7, 2, 6, 4, '2025-05-09 10:10:00', 50.00, 519.00),
(8, 8, 7, 1, '2025-04-01 14:00:00', 0.00, 0.00), -- elektromos töltés: liter=0, ár=0 (példa)
(9, 2, 8, 1, '2025-03-20 09:00:00', 0.00, 0.00), -- elektromos
(10,5, 9, 2, '2025-02-28 13:45:00', 47.00, 539.00),
(11,1, 10,1, '2025-01-05 08:20:00', 40.00, 569.00),
(12,3, 2, 3, '2024-12-15 12:00:00', 42.50, 549.90),
(13,5, 3, 2, '2024-11-20 16:00:00', 55.00, 499.00),
(14,6, 4, 4, '2024-10-30 09:40:00', 65.00, 629.00),
(15,7, 5, 5, '2024-09-18 18:00:00', 38.70, 579.50),
(16,2, 1, 1, '2024-08-01 07:30:00', 48.00, 599.90),
(17,2, 6, 4, '2024-07-12 11:55:00', 30.00, 519.00),
(18,8, 7, 1, '2024-06-03 13:20:00', 0.00, 0.00), -- elektromos töltés
(19,2, 8, 1, '2024-05-22 15:10:00', 0.00, 0.00), -- elektromos
(20,5, 9, 2, '2024-04-11 10:05:00', 46.00, 539.00),
(21,1, 10,1, '2024-03-02 08:00:00', 36.00, 569.00),
(22,3, 2, 3, '2023-12-15 12:00:00', 39.00, 529.90),
(23,5, 3, 2, '2023-11-25 17:30:00', 58.00, 489.00),
(24,6, 4, 4, '2023-10-10 09:15:00', 63.00, 609.00),
(25,7, 5, 5, '2023-09-09 18:45:00', 41.20, 569.50);

-- =======================
-- Karbantartások
-- =======================
INSERT INTO karbantartas (karbantartas_id, auto_id, szerviz_id, felhasznalo_id, datum, leiras, koltseg) VALUES
(1, 1, 1, 2, '2025-10-01 09:00:00', 'Olajcsere és szűrők cseréje', 32000.00),
(2, 2, 3, 3, '2025-08-20 10:30:00', 'Hibrid rendszer ellenőrzése', 45000.00),
(3, 3, 2, 5, '2025-06-05 14:00:00', 'Fékbetétek cseréje', 48000.00),
(4, 4, 1, 6, '2025-04-12 11:15:00', 'Vezérlés ellenőrzés, hűtő tisztítás', 65000.00),
(5, 5, 4, 7, '2024-12-01 08:00:00', 'Lengéscsillapító csere', 82000.00),
(6, 6, 2, 2, '2024-09-15 16:00:00', 'Kipufogó javítás', 27000.00),
(7, 7, 3, 8, '2025-02-02 09:30:00', 'Akkumulátor ellenőrzés és szoftverfrissítés', 0.00),
(8, 9, 4, 5, '2025-07-18 13:45:00', 'Kuplung csere', 120000.00);

-- =======================
-- VÉGE - Tesztadatok betöltve
-- =======================
