DROP DATABASE IF EXISTS automate;
CREATE DATABASE automate
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE automate;

-- =======================
-- User
-- =======================
CREATE TABLE user (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    last_login DATETIME NULL,
    is_active BOOLEAN DEFAULT TRUE,
    is_staff BOOLEAN DEFAULT FALSE,
    full_name VARCHAR(255),
    role ENUM('admin','user') DEFAULT 'user',
    is_superuser BOOLEAN DEFAULT FALSE
) ENGINE=InnoDB;

-- =======================
-- Brand
-- =======================
CREATE TABLE brand (
    brand_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
) ENGINE=InnoDB;

-- =======================
-- Car Model
-- =======================
CREATE TABLE car_model (
    model_id INT AUTO_INCREMENT PRIMARY KEY,
    brand_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    FOREIGN KEY (brand_id) REFERENCES brand(brand_id)
) ENGINE=InnoDB;

-- =======================
-- Fuel Type
-- =======================
CREATE TABLE fuel_type (
    fuel_type_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
) ENGINE=InnoDB;

-- =======================
-- Car
-- =======================
CREATE TABLE car (
    car_id INT AUTO_INCREMENT PRIMARY KEY,
    license_plate VARCHAR(20) NOT NULL UNIQUE,
    brand_id INT NOT NULL,
    model_id INT NOT NULL,
    fuel_type_id INT NOT NULL,
    tank_capacity DECIMAL(5,2),
    horsepower INT,
    production_year INT,
    odometer_km INT NOT NULL,
    FOREIGN KEY (brand_id) REFERENCES brand(brand_id),
    FOREIGN KEY (model_id) REFERENCES car_model(model_id),
    FOREIGN KEY (fuel_type_id) REFERENCES fuel_type(fuel_type_id)
) ENGINE=InnoDB;

-- =======================
-- Car - User
-- =======================
CREATE TABLE car_user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    car_id INT NOT NULL,
    user_id INT NOT NULL,
    permission ENUM('owner','driver') NOT NULL,
    UNIQUE KEY uq_car_user (car_id, user_id),
    FOREIGN KEY (car_id) REFERENCES car(car_id),
    FOREIGN KEY (user_id) REFERENCES user(user_id)
) ENGINE=InnoDB;

-- =======================
-- Address
-- =======================
CREATE TABLE address (
    address_id INT AUTO_INCREMENT PRIMARY KEY,
    country VARCHAR(100),
    city VARCHAR(100) NOT NULL,
    postal_code VARCHAR(10),
    street VARCHAR(255),
    house_number VARCHAR(10)
) ENGINE=InnoDB;

-- =======================
-- Route
-- =======================
CREATE TABLE route (
    route_id INT AUTO_INCREMENT PRIMARY KEY,
    from_address_id INT NOT NULL,
    to_address_id INT NOT NULL,
    FOREIGN KEY (from_address_id) REFERENCES address(address_id),
    FOREIGN KEY (to_address_id) REFERENCES address(address_id)
) ENGINE=InnoDB;

-- =======================
-- Route Usage
-- =======================
CREATE TABLE route_usage (
    route_usage_id INT AUTO_INCREMENT PRIMARY KEY,
    car_id INT NOT NULL,
    user_id INT NOT NULL,
    route_id INT NOT NULL,
    date DATETIME NOT NULL,
    departure_time INT,
    arrival_time INT,
    distance_km DECIMAL(7,2),
    FOREIGN KEY (car_id) REFERENCES car(car_id),
    FOREIGN KEY (user_id) REFERENCES user(user_id),
    FOREIGN KEY (route_id) REFERENCES route(route_id)
) ENGINE=InnoDB;

-- =======================
-- Gas Station
-- =======================
CREATE TABLE gas_station (
    gas_station_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    city VARCHAR(100),
    postal_code VARCHAR(10),
    street VARCHAR(255),
    house_number VARCHAR(10)
) ENGINE=InnoDB;

-- =======================
-- Fueling
-- =======================
CREATE TABLE fueling (
    fueling_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    car_id INT NOT NULL,
    gas_station_id INT NOT NULL,
    fuel_type_id INT NOT NULL,
    date DATETIME NOT NULL,
    liters DECIMAL(7,2) NOT NULL,
    price_per_liter DECIMAL(7,2) NOT NULL,
    supplier VARCHAR(100),
    odometer_km INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user(user_id),
    FOREIGN KEY (car_id) REFERENCES car(car_id),
    FOREIGN KEY (gas_station_id) REFERENCES gas_station(gas_station_id),
    FOREIGN KEY (fuel_type_id) REFERENCES fuel_type(fuel_type_id)
) ENGINE=InnoDB;

-- =======================
-- Service Center
-- =======================
CREATE TABLE service_center (
    service_center_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    city VARCHAR(100),
    postal_code VARCHAR(10),
    street VARCHAR(255),
    house_number VARCHAR(10)
) ENGINE=InnoDB;

-- =======================
-- Maintenance
-- =======================
CREATE TABLE maintenance (
    maintenance_id INT AUTO_INCREMENT PRIMARY KEY,
    car_id INT NOT NULL,
    service_center_id INT NOT NULL,
    user_id INT NOT NULL,
    date DATETIME NOT NULL,
    description TEXT,
    cost DECIMAL(10,2),
    reminder VARCHAR(255),
    part_name VARCHAR(100),
    FOREIGN KEY (car_id) REFERENCES car(car_id),
    FOREIGN KEY (service_center_id) REFERENCES service_center(service_center_id),
    FOREIGN KEY (user_id) REFERENCES user(user_id)
) ENGINE=InnoDB;

-- =======================
-- Test Adatok
-- =======================
INSERT INTO felhasznalo (
    felhasznalo_id,
    email,
    is_active,
    is_staff,
    password
) VALUES
(1,'u1@test.com',1,0,'dummy'),
(2,'u2@test.com',1,0,'dummy'),
(3,'u3@test.com',1,0,'dummy'),
(4,'u4@test.com',1,0,'dummy'),
(5,'u5@test.com',1,0,'dummy'),
(6,'u6@test.com',1,0,'dummy'),
(7,'u7@test.com',1,0,'dummy'),
(8,'u8@test.com',1,0,'dummy'),
(9,'u9@test.com',1,0,'dummy'),
(10,'u10@test.com',1,0,'dummy');

INSERT INTO marka (marka_id, nev) VALUES
(1,'Toyota'),(2,'BMW'),(3,'Ford'),(4,'Volkswagen'),(5,'Tesla'),
(6,'Opel'),(7,'Audi'),(8,'Mercedes'),(9,'Hyundai'),(10,'Kia'),
(11,'Mazda'),(12,'Peugeot'),(13,'Renault'),(14,'Skoda'),
(15,'Seat'),(16,'Volvo'),(17,'Honda'),(18,'Nissan'),
(19,'Suzuki'),(20,'Citroen');

INSERT INTO modell (modell_id, marka_id, modellnev) VALUES
(1,1,'Corolla'),(2,2,'320d'),(3,3,'Focus'),(4,4,'Golf'),
(5,5,'Model 3'),(6,6,'Astra'),(7,7,'A4'),(8,8,'C-Class'),
(9,9,'i30'),(10,10,'Ceed'),
(11,11,'CX-5'),(12,12,'308'),(13,13,'Clio'),(14,14,'Octavia'),
(15,15,'Leon'),(16,16,'XC60'),(17,17,'Civic'),
(18,18,'Qashqai'),(19,19,'Vitara'),(20,20,'C4');

INSERT INTO uzemanyag_tipus VALUES
(1,'benzin'),(2,'dízel'),(3,'hibrid'),(4,'elektromos'),
(5,'LPG'),(6,'CNG'),(7,'E85'),(8,'plug-in hibrid'),
(9,'bio dízel'),(10,'hidrogén');

INSERT INTO auto VALUES
(1,'AAA-111',1,1,1,50,132,2016,145000),
(2,'BBB-222',2,2,2,60,190,2019,92000),
(3,'CCC-333',3,3,1,52,125,2015,160000),
(4,'DDD-444',4,4,2,55,150,2018,110000),
(5,'EEE-555',5,5,4,NULL,283,2022,32000),
(6,'FFF-666',6,6,1,48,140,2014,180000),
(7,'GGG-777',7,7,2,58,190,2017,125000),
(8,'HHH-888',8,8,1,65,200,2020,85000),
(9,'III-999',9,9,1,50,130,2019,98000),
(10,'JJJ-000',10,10,1,45,120,2018,105000),
(11,'KKK-111',11,11,3,56,165,2021,67000),
(12,'LLL-222',12,12,1,52,130,2019,90000),
(13,'MMM-333',13,13,1,48,110,2016,155000),
(14,'NNN-444',14,14,2,55,150,2020,72000),
(15,'OOO-555',15,15,1,50,140,2018,98000),
(16,'PPP-666',16,16,2,60,190,2021,65000),
(17,'QQQ-777',17,17,1,47,125,2017,140000),
(18,'RRR-888',18,18,2,55,160,2019,102000),
(19,'SSS-999',19,19,1,45,115,2018,110000),
(20,'TTT-000',20,20,1,50,130,2022,40000);

INSERT INTO auto_felhasznalo (id, auto_id, felhasznalo_id, jogosultsag) VALUES
(1, 1, 1, 'tulaj'),
(2, 2, 2, 'tulaj'),
(3, 3, 3, 'tulaj'),
(4, 4, 4, 'tulaj'),
(5, 5, 5, 'tulaj'),
(6, 6, 6, 'tulaj'),
(7, 7, 7, 'tulaj'),
(8, 8, 8, 'tulaj'),
(9, 9, 9, 'tulaj'),
(10, 10, 10, 'tulaj'),
(11, 11, 1, 'hasznalo'),
(12, 12, 2, 'hasznalo'),
(13, 13, 3, 'hasznalo'),
(14, 14, 4, 'hasznalo'),
(15, 15, 5, 'hasznalo'),
(16, 16, 6, 'hasznalo'),
(17, 17, 7, 'hasznalo'),
(18, 18, 8, 'hasznalo'),
(19, 19, 9, 'hasznalo'),
(20, 20, 10, 'hasznalo');

INSERT INTO cim VALUES
(1,'HU','Budapest','1117','Dombóvári út','23'),
(2,'HU','Budapest','1065','Nagykörút','12'),
(3,'HU','Debrecen','4024','Piac utca','4'),
(4,'HU','Szeged','6720','Hajnal utca','9'),
(5,'HU','Miskolc','3525','Kossuth Lajos u.','45'),
(6,'HU','Pécs','7621','Rákóczi út','18'),
(7,'HU','Győr','9022','Baross G. u.','3'),
(8,'HU','Sopron','9400','Fő tér','7'),
(9,'HU','Kecskemét','6000','Fő utca','10'),
(10,'HU','Nyíregyháza','4400','Bessenyei tér','1'),
(11,'HU','Eger','3300','Dobó tér','5'),
(12,'HU','Veszprém','8200','Kossuth u.','8'),
(13,'HU','Zalaegerszeg','8900','Király u.','6'),
(14,'HU','Tatabánya','2800','Fő tér','2'),
(15,'HU','Szolnok','5000','Ady Endre út','11'),
(16,'HU','Békéscsaba','5600','Andrássy út','9'),
(17,'HU','Kaposvár','7400','Fő u.','4'),
(18,'HU','Szekszárd','7100','Béla király tér','3'),
(19,'HU','Esztergom','2500','Széchenyi tér','7'),
(20,'HU','Siófok','8600','Petőfi sétány','15');

INSERT INTO utvonal VALUES
(1,1,2),(2,2,3),(3,3,4),(4,4,5),(5,5,6),
(6,6,7),(7,7,8),(8,8,9),(9,9,10),(10,10,11),
(11,11,12),(12,12,13),(13,13,14),(14,14,15),
(15,15,16),(16,16,17),(17,17,18),(18,18,19),
(19,19,20),(20,20,1);

INSERT INTO utvonal_hasznalat VALUES
(1,1,2,1,'2025-01-01 08:00',800,945,120),
(2,2,3,2,'2025-01-05 09:00',900,1100,200),
(3,3,4,3,'2025-02-01 10:00',1000,1230,180),
(4,4,5,4,'2025-02-10 11:00',1100,1300,250),
(5,5,6,5,'2025-03-01 12:00',1200,1430,300),
(6,6,7,6,'2025-03-15 13:00',1300,1500,350),
(7,7,8,7,'2025-04-01 14:00',1400,1630,400),
(8,8,9,8,'2025-04-20 15:00',1320,1540,450),
(9,9,10,9,'2025-05-01 16:00',1234,1542,500),
(10,10,1,10,'2025-05-10 17:00',1235,1253,600),
(11,11,2,11,'2025-05-15 08:00',800,900,90),
(12,12,3,12,'2025-05-20 09:00',900,1040,160),
(13,13,4,13,'2025-05-25 10:00',1000,1145,170),
(14,14,5,14,'2025-06-01 11:00',1100,1300,210),
(15,15,6,15,'2025-06-05 12:00',1200,1410,260),
(16,16,7,16,'2025-06-10 13:00',1300,1520,300),
(17,17,8,17,'2025-06-15 14:00',1400,1650,350),
(18,18,9,18,'2025-06-20 15:00',1500,1800,420),
(19,19,10,19,'2025-06-25 16:00',1600,1830,380),
(20,20,1,20,'2025-06-30 17:00',1700,1930,450);

INSERT INTO benzinkut VALUES
(1,'Shell','Budapest','1117','Dombóvári út','12'),
(2,'MOL','Miskolc','3525','Kossuth Lajos u.','47'),
(3,'OMV','Pécs','7621','Rákóczi út','20'),
(4,'Lukoil','Győr','9022','Baross G. u.','6'),
(5,'MOL','Szeged','6720','Hajnal utca','11'),
(6,'Shell','Debrecen','4024','Piac utca','15'),
(7,'OMV','Sopron','9400','Fő tér','2'),
(8,'MOL','Kecskemét','6000','Fő utca','8'),
(9,'Shell','Nyíregyháza','4400','Bessenyei tér','4'),
(10,'Lukoil','Budapest','1033','Szentendrei út','55'),
(11,'Shell','Eger','3300','Dobó tér','9'),
(12,'OMV','Veszprém','8200','Kossuth u.','7'),
(13,'MOL','Zalaegerszeg','8900','Király u.','12'),
(14,'Shell','Tatabánya','2800','Fő tér','6'),
(15,'OMV','Szolnok','5000','Ady út','3'),
(16,'MOL','Békéscsaba','5600','Andrássy út','10'),
(17,'Shell','Kaposvár','7400','Fő u.','5'),
(18,'OMV','Szekszárd','7100','Béla tér','8'),
(19,'MOL','Esztergom','2500','Széchenyi tér','2'),
(20,'Shell','Siófok','8600','Petőfi sétány','18');

INSERT INTO tankolas VALUES
(1,2,1,1,1,'2025-01-02',45,590,'Shell',120000),
(2,3,2,2,2,'2025-01-06',50,610,'MOL',90000),
(3,4,3,3,1,'2025-02-02',40,580,'OMV',155000),
(4,5,4,4,2,'2025-02-12',60,620,'Lukoil',110000),
(5,6,5,5,4,'2025-03-02',30,0,'Tesla',32000),
(6,7,6,6,1,'2025-03-16',48,570,'Shell',180000),
(7,8,7,7,2,'2025-04-02',55,600,'OMV',125000),
(8,9,8,8,1,'2025-04-22',52,590,'MOL',98000),
(9,10,9,9,1,'2025-05-02',50,585,'Shell',110000),
(10,1,10,10,1,'2025-05-12',47,575,'Lukoil',105000),
(11,2,11,11,3,'2025-05-20',42,610,'Shell',67000),
(12,3,12,12,1,'2025-05-25',50,595,'OMV',90000),
(13,4,13,13,1,'2025-06-01',45,585,'MOL',155000),
(14,5,14,14,2,'2025-06-05',55,620,'Shell',72000),
(15,6,15,15,1,'2025-06-10',48,590,'OMV',98000),
(16,7,16,16,2,'2025-06-15',60,630,'MOL',65000),
(17,8,17,17,1,'2025-06-20',50,600,'Shell',140000),
(18,9,18,18,2,'2025-06-25',58,610,'OMV',102000),
(19,10,19,19,1,'2025-06-28',45,585,'MOL',110000),
(20,1,20,20,1,'2025-07-01',52,600,'Shell',40000);

INSERT INTO szerviz VALUES
(1,'AutoServ Budapest','Budapest','1117','Gépész utca','2'),
(2,'Miskolc Szerviz','Miskolc','3525','Szerviz út','5'),
(3,'Pécs Autó','Pécs','7621','Szolgáltató u.','1'),
(4,'Győr Garázs','Győr','9022','Szolgáltató tér','9'),
(5,'Debrecen Autó','Debrecen','4024','Fő utca','3'),
(6,'Szeged Szerviz','Szeged','6720','Kossuth u.','7'),
(7,'Audi Szerviz','Budapest','1113','Karosszéria u.','4'),
(8,'BMW Center','Budapest','1138','Váci út','20'),
(9,'Ford Szerviz','Pécs','7630','Ipar utca','6'),
(10,'Tesla Service','Budapest','1097','Elektromos u.','1'),
(11,'Opel Szerviz','Győr','9023','Autó u.','8'),
(12,'Mazda Center','Eger','3300','Dobó tér','6'),
(13,'Renault Szerviz','Szolnok','5000','Ady út','4'),
(14,'Skoda Szerviz','Tatabánya','2800','Fő tér','10'),
(15,'Seat Szerviz','Veszprém','8200','Kossuth u.','14'),
(16,'Volvo Szerviz','Budapest','1149','Mogyoródi út','12'),
(17,'Honda Szerviz','Kaposvár','7400','Fő u.','11'),
(18,'Nissan Szerviz','Szekszárd','7100','Béla tér','9'),
(19,'Suzuki Szerviz','Esztergom','2500','Széchenyi tér','13'),
(20,'Citroen Szerviz','Siófok','8600','Petőfi sétány','22');

INSERT INTO karbantartas (
  karbantartas_id, auto_id, szerviz_id, felhasznalo_id, datum, leiras, koltseg
) VALUES
(1,1,1,2,'2025-01-10 00:00:00','Olajcsere',30000),
(2,2,2,3,'2025-01-20 00:00:00','Fék javítás',45000),
(3,3,3,4,'2025-02-10 00:00:00','Szűrő csere',20000),
(4,4,4,5,'2025-02-25 00:00:00','Motor diagnosztika',50000),
(5,5,10,6,'2025-03-05 00:00:00','Szoftver frissítés',0),
(6,6,5,7,'2025-03-20 00:00:00','Futómű állítás',35000),
(7,7,7,8,'2025-04-05 00:00:00','Kuplung csere',120000),
(8,8,8,9,'2025-04-25 00:00:00','Vezérlés csere',180000),
(9,9,9,10,'2025-05-05 00:00:00','Hűtő javítás',40000),
(10,10,6,1,'2025-05-15 00:00:00','Általános átvizsgálás',15000),
(11,11,11,2,'2025-05-20 00:00:00','Fékbetét csere',38000),
(12,12,12,3,'2025-05-25 00:00:00','Olajcsere',29000),
(13,13,13,4,'2025-06-01 00:00:00','Gyújtógyertya csere',25000),
(14,14,14,5,'2025-06-05 00:00:00','Futómű javítás',60000),
(15,15,15,6,'2025-06-10 00:00:00','Szerviz ellenőrzés',20000),
(16,16,16,7,'2025-06-15 00:00:00','Fékfolyadék csere',18000),
(17,17,17,8,'2025-06-20 00:00:00','Kuplung beállítás',55000),
(18,18,18,9,'2025-06-25 00:00:00','Motor tisztítás',30000),
(19,19,19,10,'2025-06-28 00:00:00','Olajcsere',27000),
(20,20,20,1,'2025-07-01 00:00:00','Első átvizsgálás',15000);