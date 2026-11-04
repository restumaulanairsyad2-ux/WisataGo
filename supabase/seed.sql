insert into public.categories(name,slug) values
('Wisata Alam','wisata-alam'),('Pantai','pantai'),('Pegunungan','pegunungan'),('Wisata Budaya','wisata-budaya'),
('Wisata Sejarah','wisata-sejarah'),('Taman Hiburan','taman-hiburan'),('Wisata Edukasi','wisata-edukasi'),('Wisata Keluarga','wisata-keluarga')
on conflict(slug) do nothing;

with sample(slug,name,location,category,price,child_price,description,image_url,hours) as (values
('candi-borobudur','Candi Borobudur','Magelang, Jawa Tengah','Wisata Budaya',50000,25000,'Mahakarya arsitektur Buddha dengan relief dan stupa bersejarah.','https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1000&q=82','06.30–16.30 WIB'),
('candi-prambanan','Candi Prambanan','Sleman, DI Yogyakarta','Wisata Sejarah',50000,25000,'Kompleks candi Hindu dengan kisah Ramayana yang melegenda.','https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=1000&q=82','06.30–17.00 WIB'),
('taman-nasional-komodo','Taman Nasional Komodo','Manggarai Barat, Nusa Tenggara Timur','Wisata Alam',150000,75000,'Kawasan konservasi komodo dengan pulau dan perairan yang menakjubkan.','https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?auto=format&fit=crop&w=1000&q=82','07.00–17.00 WITA'),
('pulau-padar','Pulau Padar','Manggarai Barat, Nusa Tenggara Timur','Pegunungan',100000,50000,'Panorama bukit dan teluk berwarna ikonik di Labuan Bajo.','https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=1000&q=82','06.00–17.00 WITA'),
('pantai-kuta','Pantai Kuta','Badung, Bali','Pantai',15000,10000,'Pantai berpasir putih dengan ombak dan matahari terbenam.','https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=82','Buka setiap hari'),
('pantai-pandawa','Pantai Pandawa','Badung, Bali','Pantai',20000,10000,'Pantai dengan tebing kapur dan air laut yang jernih.','https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=82','07.00–18.00 WITA'),
('tanah-lot','Tanah Lot','Tabanan, Bali','Wisata Budaya',30000,15000,'Pura di atas batu karang dengan pemandangan laut lepas.','https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=1000&q=82','06.00–19.00 WITA'),
('kawah-ijen','Kawah Ijen','Banyuwangi, Jawa Timur','Pegunungan',5000,3000,'Danau kawah toska dan bentang alam vulkanik.','https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=82','02.00–12.00 WIB'),
('gunung-bromo','Gunung Bromo','Probolinggo, Jawa Timur','Pegunungan',35000,20000,'Lautan pasir dan matahari terbit di kawasan Bromo.','https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=82','Buka setiap hari'),
('dieng-plateau','Dieng Plateau','Banjarnegara, Jawa Tengah','Pegunungan',15000,10000,'Dataran tinggi dengan telaga, kawah, dan kompleks candi.','https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=82','07.00–17.00 WIB'),
('telaga-warna-dieng','Telaga Warna Dieng','Wonosobo, Jawa Tengah','Wisata Alam',15000,10000,'Telaga dengan warna air yang berubah di dataran tinggi.','https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1000&q=82','07.00–17.00 WIB'),
('tmii','Taman Mini Indonesia Indah','Jakarta Timur, DKI Jakarta','Wisata Edukasi',35000,25000,'Kenali keragaman budaya nusantara di satu kawasan.','https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1000&q=82','06.00–17.00 WIB'),
('kebun-raya-bogor','Kebun Raya Bogor','Kota Bogor, Jawa Barat','Wisata Alam',25000,15000,'Kebun botani bersejarah dengan pepohonan rindang.','https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1000&q=82','08.00–16.00 WIB'),
('museum-angkut','Museum Angkut','Kota Batu, Jawa Timur','Wisata Edukasi',100000,80000,'Koleksi kendaraan dan ruang pamer interaktif.','https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=1000&q=82','12.00–20.00 WIB'),
('jatim-park','Jatim Park 2','Kota Batu, Jawa Timur','Taman Hiburan',120000,100000,'Pengalaman edukasi satwa dan rekreasi keluarga.','https://images.unsplash.com/photo-1513883049090-d0b7439799bf?auto=format&fit=crop&w=1000&q=82','08.30–16.30 WIB'),
('taman-safari','Taman Safari Indonesia','Cisarua, Jawa Barat','Wisata Keluarga',200000,180000,'Kawasan satwa dan pertunjukan edukatif keluarga.','https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=1000&q=82','09.00–17.00 WIB'),
('parangtritis','Pantai Parangtritis','Bantul, DI Yogyakarta','Pantai',15000,10000,'Garis pantai selatan yang luas dan suasana senja.','https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=82','Buka setiap hari'),
('goa-pindul','Goa Pindul','Gunungkidul, DI Yogyakarta','Wisata Alam',40000,30000,'Susuri sungai bawah tanah dengan pemandu lokal.','https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1000&q=82','07.00–16.00 WIB'),
('curug-cipendok','Curug Cipendok','Banyumas, Jawa Tengah','Wisata Alam',10000,5000,'Air terjun tinggi di tengah hutan tropis yang sejuk.','https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&w=1000&q=82','08.00–16.00 WIB'),
('owabong','Owabong Waterpark','Purbalingga, Jawa Tengah','Taman Hiburan',30000,25000,'Taman air dengan kolam dan permainan keluarga.','https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=1000&q=82','08.00–17.00 WIB')
)
insert into public.destinations(category_id,name,slug,description,location,opening_hours,image_url,facilities)
select c.id,s.name,s.slug,s.description,s.location,s.hours,s.image_url,array['Area parkir','Toilet','Pusat informasi']::text[]
from sample s join public.categories c on c.name=s.category
on conflict(slug) do nothing;

with sample(slug,adult,child) as (values
('candi-borobudur',50000,25000),('candi-prambanan',50000,25000),('taman-nasional-komodo',150000,75000),('pulau-padar',100000,50000),('pantai-kuta',15000,10000),('pantai-pandawa',20000,10000),('tanah-lot',30000,15000),('kawah-ijen',5000,3000),('gunung-bromo',35000,20000),('dieng-plateau',15000,10000),('telaga-warna-dieng',15000,10000),('tmii',35000,25000),('kebun-raya-bogor',25000,15000),('museum-angkut',100000,80000),('jatim-park',120000,100000),('taman-safari',200000,180000),('parangtritis',15000,10000),('goa-pindul',40000,30000),('curug-cipendok',10000,5000),('owabong',30000,25000)
)
insert into public.ticket_types(destination_id,name,price)
select d.id,v.kind,v.price from sample s join public.destinations d on d.slug=s.slug cross join lateral (values('Dewasa',s.adult),('Anak-anak',s.child)) as v(kind,price)
on conflict(destination_id,name) do nothing;

insert into public.ticket_availability(ticket_type_id,visit_date,capacity)
select t.id,day::date,200 from public.ticket_types t cross join generate_series(current_date,current_date+180,interval '1 day') day
on conflict(ticket_type_id,visit_date) do nothing;
