-- PostgreSQL schema + seed data for the writeback Tableau extension demo.
-- Run against an empty database (e.g. via DBeaver or `psql -f demo_schema_postgres.sql`).

DROP TABLE IF EXISTS requests;
DROP TABLE IF EXISTS units;
DROP TABLE IF EXISTS properties;
DROP TABLE IF EXISTS technicians;

CREATE TABLE properties (
    property_id   SERIAL PRIMARY KEY,
    property_name VARCHAR(50),
    address       VARCHAR(50),
    city          VARCHAR(50),
    state         VARCHAR(50),
    zip           INT
);

CREATE TABLE units (
    unit_id      SERIAL PRIMARY KEY,
    property_id  INT REFERENCES properties(property_id),
    unit         VARCHAR(10),
    tenant_name  VARCHAR(50),
    tenant_email VARCHAR(50),
    tenant_phone VARCHAR(50)
);

CREATE TABLE technicians (
    technician_id    SERIAL PRIMARY KEY,
    technician_name  VARCHAR(50),
    technician_email VARCHAR(50),
    technician_phone VARCHAR(50)
);

CREATE TABLE requests (
    request_id           SERIAL PRIMARY KEY,
    unit_id              INT REFERENCES units(unit_id),
    request_time         TIMESTAMP,
    close_time           TIMESTAMP,
    status               VARCHAR(50),
    urgency              VARCHAR(50),
    area                 VARCHAR(50),
    description          TEXT,
    technician_id        INT,
    technician_comments  TEXT
);

INSERT INTO properties (property_id, property_name, address, city, state, zip) VALUES
(1, 'Alpha Apartments', '1210 Graystone Lakes', 'Seattle', 'WA', 98103),
(2, 'Palmore Lofts',    '3121 Cerullo Road',    'Seattle', 'WA', 98117),
(3, 'Terra Building',   '64 Mandan Road',       'Seattle', 'WA', 98111);

INSERT INTO technicians (technician_id, technician_name, technician_email, technician_phone) VALUES
(1, 'Eric Fitzgibbons', 'EricBFitzgibbons@teleworm.us', '954-655-8691'),
(2, 'Roger Alves',      'RogerKAlves@jourrapide.com',   '561-636-6658'),
(3, 'Sophia Fairbanks', 'SophiaPFairbanks@gustr.com',   '864-497-6576'),
(4, 'Nadia Rossiter',   'NadiaRRossiter@superrito.com', '270-995-2267');

INSERT INTO units (unit_id, property_id, unit, tenant_name, tenant_email, tenant_phone) VALUES
(1,  1, '201', 'Abel Medina',         'AbelSMedina@einrot.com',           '260-837-9486'),
(2,  1, '202', 'Kimberley Rodriguez', 'KimberleyMRodriguez@jourrapide.com','217-570-3553'),
(3,  1, '203', 'Paul Ransom',         'PaulCRansom@teleworm.us',          '516-420-5000'),
(4,  1, '204', 'Terrence Bruce',      'TerrenceCBruce@armyspy.com',       '860-817-6714'),
(5,  1, '205', 'Rich Giorgi',         'RichKGiorgi@fleckens.hu',          '936-598-5480'),
(6,  1, '301', 'Tina Leavitt',        'TinaDLeavitt@gustr.com',           '317-206-8619'),
(7,  1, '302', 'Madeline Hua',        'MadelineJHua@superrito.com',       '317-590-2203'),
(8,  1, '303', 'Jessica Barrera',     'JessicaABarrera@gustr.com',        '443-910-4535'),
(9,  1, '304', 'Richard Muncie',      'RichardMMuncie@fleckens.hu',       '518-474-0284'),
(10, 1, '305', 'Mary Bucher',         'MaryJBucher@rhyta.com',            '360-286-4962'),
(11, 1, '401', 'Mitchell Toohey',     'MitchellMToohey@einrot.com',       '309-296-5519'),
(12, 1, '402', 'Barbara Robertson',   'BarbaraTRobertson@gustr.com',      '208-696-2531'),
(13, 1, '403', 'Ester Stoner',        'EsterPStoner@armyspy.com',         '773-923-6843'),
(14, 1, '404', 'Lewis Warkentin',     'LewisLWarkentin@jourrapide.com',   '617-684-4745'),
(15, 1, '405', 'Mark Pilkington',     'MarkLPilkington@superrito.com',    '320-229-1000'),
(16, 1, '501', 'Ricky Colby',         'RickyEColby@gustr.com',            '903-980-5373'),
(17, 1, '502', 'Roy Hutchinson',      'RoyJHutchinson@armyspy.com',       '814-239-0609'),
(18, 1, '503', 'Phillip Skinner',     'PhillipKSkinner@fleckens.hu',      '205-558-4320'),
(19, 1, '504', 'Carroll Mendosa',     'CarrollKMendosa@superrito.com',    '479-495-4458'),
(20, 1, '505', 'Rosanne Moody',       'RosanneJMoody@superrito.com',      '315-227-0843'),
(21, 1, '601', 'Liza Beets',          'LizaLBeets@armyspy.com',           '774-847-4970'),
(22, 1, '602', 'Arthur Chase',        'ArthurJChase@dayrep.com',          '541-427-0886'),
(23, 1, '603', 'Crystal Kelly',       'CrystalJKelly@armyspy.com',        '850-656-8583'),
(24, 1, '604', 'Jason Wright',        'JasonPWright@fleckens.hu',         '870-657-7493'),
(25, 1, '605', 'Scott Cobb',          'ScottACobb@cuvox.de',              '610-984-9445'),
(26, 2, '1A',  'Sandra Tribble',      'SandraJTribble@jourrapide.com',    '304-638-7957'),
(27, 2, '1B',  'Xavier Burkey',       'XavierMBurkey@gustr.com',          '904-976-2032'),
(28, 2, '2A',  'Cari Sandberg',       'CariRSandberg@superrito.com',      '858-684-5482'),
(29, 2, '2B',  'Scott Smith',         'ScottKSmith@gustr.com',            '847-680-7305'),
(30, 3, '101', 'Daryl Hughes',        'DarylTHughes@cuvox.de',            '423-698-7645'),
(31, 3, '102', 'Victoria Townsend',   'VictoriaJTownsend@dayrep.com',     '254-918-7747'),
(32, 3, '103', 'Tu Whitlow',          'TuFWhitlow@dayrep.com',            '620-897-8511'),
(33, 3, '104', 'Loretta Morey',       'LorettaSMorey@jourrapide.com',     '201-278-4054'),
(34, 3, '105', 'Jame Jameson',        'JameCJameson@einrot.com',          '573-368-8021'),
(35, 3, '106', 'Gladys Dickson',      'GladysRDickson@fleckens.hu',       '267-989-3949'),
(36, 3, '107', 'Daniel Ginyard',      'DanielCGinyard@dayrep.com',        '415-886-4473'),
(37, 3, '108', 'David Avalos',        'DavidCAvalos@dayrep.com',          '865-403-4480'),
(38, 3, '109', 'Jeffrey Rathjen',     'JeffreyVRathjen@gustr.com',        '773-714-3527'),
(39, 3, '110', 'James Maes',          'JamesLMaes@armyspy.com',           '214-858-7764'),
(40, 3, '201', 'Amy Brand',           'AmyJBrand@einrot.com',             '270-695-7759'),
(41, 3, '202', 'Barry Smith',         'BarryASmith@einrot.com',           '941-257-5063'),
(42, 3, '203', 'Porsha Clardy',       'PorshaNClardy@teleworm.us',        '630-831-9517'),
(43, 3, '204', 'Jody Tillmon',        'JodyRTillmon@dayrep.com',          '631-777-4131'),
(44, 3, '205', 'Josh Riggs',          'JoshBRiggs@rhyta.com',             '954-612-1904'),
(45, 3, '206', 'Matt Ballard',        'MattHBallard@jourrapide.com',      '978-789-5905'),
(46, 3, '207', 'Mary Vaughn',         'MaryLVaughn@teleworm.us',          '305-417-2254'),
(47, 3, '208', 'Conrad Outen',        'ConradLOuten@fleckens.hu',         '863-902-3633'),
(48, 3, '209', 'Andy Jacobs',         'AndyCJacobs@fleckens.hu',          '906-753-3756'),
(49, 3, '210', 'Michael Davis',       'MichaelCDavis@jourrapide.com',     '910-410-4088'),
(50, 3, '301', 'April Gregory',       'AprilAGregory@teleworm.us',        '248-440-2429'),
(51, 3, '302', 'Mark Holmes',         'MarkLHolmes@rhyta.com',            '810-386-4872'),
(52, 3, '303', 'Daphne Spiegel',      'DaphneVSpiegel@rhyta.com',         '309-795-0277'),
(53, 3, '304', 'John Amin',           'JohnDAmin@einrot.com',             '716-237-8655'),
(54, 3, '305', 'Ida Lucero',          'IdaHLucero@fleckens.hu',           '660-736-0951'),
(55, 3, '306', 'Jeanne Worley',       'JeanneAWorley@jourrapide.com',     '708-318-4077'),
(56, 3, '307', 'Mark Willis',         'MarkTWillis@armyspy.com',          '812-350-6355'),
(57, 3, '308', 'Jill Landers',        'JillJLanders@superrito.com',       '419-851-1047'),
(58, 3, '309', 'Sherrie Reynolds',    'SherrieNReynolds@armyspy.com',     '760-902-1917'),
(59, 3, '310', 'Shelby Johnson',      'ShelbyJJohnson@teleworm.us',       '715-292-7569'),
(60, 3, '401', 'Dianna Mendez',       'DiannaRMendez@gustr.com',          '240-221-7778'),
(61, 3, '402', 'Betty Wimberly',      'BettyJWimberly@rhyta.com',         '281-443-4589'),
(62, 3, '403', 'Jason Abbott',        'JasonBAbbott@einrot.com',          '989-617-2696'),
(63, 3, '404', 'Linda Gaylor',        'LindaJGaylor@gustr.com',           '831-908-4053'),
(64, 3, '405', 'Luella Torres',       'LuellaRTorres@cuvox.de',           '585-204-7516'),
(65, 3, '406', 'Pamela Alex',         'PamelaRAlex@fleckens.hu',          '240-228-6867'),
(66, 3, '407', 'Lori Peiffer',        'LoriMPeiffer@cuvox.de',            '559-329-5624'),
(67, 3, '408', 'Juan Ballard',        'JuanOBallard@dayrep.com',          '530-689-9912'),
(68, 3, '409', 'Ana Ponds',           'AnaRPonds@teleworm.us',            '607-645-3119'),
(69, 3, '410', 'Janeth Wofford',      'JanethNWofford@dayrep.com',        '440-385-6547'),
(70, 3, '501', 'Heather Sims',        'HeatherJSims@teleworm.us',         '940-716-0237'),
(71, 3, '502', 'Curt Jones',          'CurtCJones@fleckens.hu',           '574-518-7575'),
(72, 3, '503', 'Krystal Regan',       'KrystalERegan@einrot.com',         '817-565-8627'),
(73, 3, '504', 'Arnold Haskell',      'ArnoldGHaskell@superrito.com',     '925-439-4118'),
(74, 3, '505', 'Donald Keith',        'DonaldCKeith@fleckens.hu',         '208-493-4078'),
(75, 3, '506', 'Michael Tillman',     'MichaelATillman@dayrep.com',       '510-902-7325'),
(76, 3, '507', 'Mary Hindman',        'MaryCHindman@einrot.com',          '763-521-3505'),
(77, 3, '508', 'Jamie Jones',         'JamieRJones@superrito.com',        '702-756-4241'),
(78, 3, '509', 'Damon Ballard',       'DamonABallard@superrito.com',      '508-974-0869'),
(79, 3, '510', 'Brooke Freeman',      'BrookeDFreeman@dayrep.com',        '801-356-5372');

INSERT INTO requests (request_id, unit_id, request_time, close_time, status, urgency, area, description, technician_id, technician_comments) VALUES
(1,  38, '2020-01-03 09:55:00', '2020-01-04 08:29:00', 'Closed',      'Moderate', 'Bathroom',    'Dryer not working.',                              1, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'),
(2,  54, '2020-01-02 16:06:00', '2020-01-04 15:23:00', 'Closed',      'Low',      'Bathroom',    'Low water pressure.',                             2, 'Donec vitae velit vestibulum, aliquam est quis, scelerisque eros.'),
(3,  69, '2020-01-04 20:32:00', '2020-01-06 15:56:00', 'Closed',      'Low',      'Kitchen',     'Outlet next to dishwasher not working.',          2, 'Etiam eu turpis et turpis pharetra placerat nec vel tellus.'),
(4,  21, '2020-01-07 06:41:00', '2020-01-07 13:19:00', 'Closed',      'High',     'Bathroom',    'Pipe leaking under sink.',                        4, 'Nulla sit amet diam tincidunt justo mollis malesuada.'),
(5,  14, '2020-01-21 20:09:00', '2020-01-22 14:11:00', 'In Progress', 'Moderate', 'Living Room', 'Cable is out.',                                   2, 'Sed varius felis ac nulla pellentesque, a gravida purus facilisis.'),
(6,  66, '2020-01-22 18:30:00', '2020-01-23 10:59:00', 'Closed',      'Moderate', 'Bathroom',    'Water coming out of sink looks weird.',           3, 'Sed tristique quam eget urna egestas dictum.'),
(7,  77, '2020-01-25 20:53:00', '2020-01-26 11:44:00', 'Closed',      'Low',      'Kitchen',     'Freezer won''t make any ice.',                    4, 'Cras sed enim pretium, pharetra elit vitae, aliquet nibh.'),
(8,  62, '2020-01-28 16:02:00', '2020-01-29 10:45:00', 'Closed',      'Low',      'Kitchen',     'Dishwasher won''t start.',                        1, 'Suspendisse imperdiet est sit amet libero malesuada aliquet.'),
(9,  76, '2020-01-25 07:23:00', '2020-01-29 12:11:00', 'Closed',      'Low',      'Kitchen',     'Lights over kitchen sink are out.',               2, 'Ut pulvinar ipsum ac tincidunt auctor.'),
(10, 29, '2020-01-31 11:50:00', '2020-02-04 13:16:00', 'Closed',      'Moderate', 'Balcony',     'Wasps nest near the barbecue.',                   3, 'Phasellus vitae metus non tellus sodales interdum.'),
(11, 60, '2020-02-07 08:49:00', '2020-02-09 14:35:00', 'Closed',      'Low',      'Bedroom',     'Closet door came of the track.',                  1, 'Maecenas in elit ut mi porttitor consectetur at at elit.'),
(12, 43, '2020-02-08 10:23:00', '2020-02-10 14:57:00', 'Closed',      'High',     'Living Room', 'Window cracked.',                                 2, 'Donec malesuada lacus blandit molestie rutrum.'),
(13, 1,  '2020-02-21 06:27:00', '2020-02-21 12:56:00', 'Closed',      'Moderate', 'Bathroom',    'Toilet clogged up.',                              4, 'Curabitur vel ante bibendum, ultrices nibh sed, aliquam turpis.'),
(14, 34, '2020-02-20 12:12:00', '2020-02-23 14:36:00', 'Closed',      'Low',      'Bathroom',    'Faucet dripping non-stop.',                       3, 'Aenean congue ante at risus suscipit condimentum.'),
(15, 16, '2020-02-20 17:46:00', '2020-02-23 16:49:00', 'Closed',      'Low',      'Kitchen',     'Disposal doesn''t work.',                         4, 'In non massa id ante cursus finibus in eu ante.'),
(16, 61, '2020-02-22 07:50:00', '2020-02-24 14:33:00', 'Closed',      'Low',      'Kitchen',     'Light in oven blew out.',                         1, 'Phasellus in tortor auctor, tincidunt eros in, tempor sapien.'),
(17, 28, '2020-02-24 10:05:00', '2020-02-25 16:48:00', 'Closed',      'Moderate', 'Bathroom',    'Bathtub drain is very slow.',                     3, 'Integer in enim eget mauris laoreet feugiat.'),
(18, 42, '2020-02-25 21:07:00', NULL,                  'In Progress', 'Low',      'Kitchen',     'Disposal makes a weird noise.',                   2, 'Aenean tincidunt tellus nec nisi aliquet molestie.'),
(19, 79, '2020-02-25 20:10:00', NULL,                  'In Progress', 'Moderate', 'Bathroom',    'Washer isn''t working.',                          4, 'Ordered parts to fix washer'),
(20, 27, '2020-02-26 17:17:00', NULL,                  'Requested',   'Low',      'Bathroom',    'Low water pressure in the shower.',               0, ''),
(21, 6,  '2020-02-26 04:48:00', NULL,                  'In Progress', 'Low',      'Kitchen',     'Outlet next to dishwasher not working.',          1, 'sfasd fasds fda fsd');

-- Reset sequences so future inserts continue past the seeded IDs.
SELECT setval('properties_property_id_seq',   (SELECT MAX(property_id)   FROM properties));
SELECT setval('units_unit_id_seq',             (SELECT MAX(unit_id)       FROM units));
SELECT setval('technicians_technician_id_seq', (SELECT MAX(technician_id) FROM technicians));
SELECT setval('requests_request_id_seq',       (SELECT MAX(request_id)    FROM requests));
