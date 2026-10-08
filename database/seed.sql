-- ==============================================================================
-- Ghazara Sales App - Initial Demo Seed Data
-- ==============================================================================

-- 1. Seed Charities
INSERT INTO charities (id, name, short_name, code, license_number, category, city, contact_person, phone, email, logo_url, total_raised, target_amount, active_marketers_count, status, commission_rate, description)
VALUES 
('cht_1', 'جمعية إحسان لرعاية الأيتام', 'جمعية إحسان', 'EHSAN-01', '1042 / م.ع', 'رعاية الأيتام والأسر المتعففة', 'الرياض', 'أ. عبدالله السليمان', '0501234567', 'info@ehsan-orphan.org.sa', 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=100&auto=format&fit=crop&q=80', 215000.00, 500000.00, 4, 'active', 10.00, 'جمعية خيرية رسمية مرخصة تُعنى بكفالة الأيتام وتوفير الرعاية التعليمية والصحية للأسر الأشد حاجة.'),
('cht_2', 'جمعية البر والخدمات الإنسانية', 'جمعية البر', 'BIRR-02', '892 / م.ع', 'مساعدات إغاثية وعلاجية', 'جدة', 'د. ناصر الغامدي', '0559876543', 'contact@birr-charity.sa', 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=100&auto=format&fit=crop&q=80', 180000.00, 400000.00, 3, 'active', 8.50, 'تسعى لتقديم العون الإغاثي وتأمين العلاج والعمليات الجراحية للمرضى من ذوي الدخل المحدود.'),
('cht_3', 'جمعية تحفيظ القرآن الكريم بالمدينة', 'جمعية التحفيظ', 'TAHFEEZ-03', '304 / م.ع', 'تعليم القرآن والعلوم الشرعية', 'المدينة المنورة', 'الشيخ محمد العمري', '0543322110', 'admin@quran-madina.org', 'https://images.unsplash.com/photo-1590076215667-875d4ef2d7ee?w=100&auto=format&fit=crop&q=80', 145000.00, 300000.00, 2, 'active', 12.00, 'صرح لتعليم كتاب الله وتخريج الحفظة ودعم حلقات ومجمعات القرآن الكريم في منطقة المدينة المنورة.'),
('cht_4', 'جمعية إطعام وحفظ النعمة', 'جمعية إطعام', 'ITAM-04', '650 / م.ع', 'حفظ النعمة وإطعام الجائعين', 'الدمام', 'م. فيصل الخالدي', '0567788990', 'care@itaam-east.sa', 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=100&auto=format&fit=crop&q=80', 95000.00, 250000.00, 2, 'active', 9.00, 'مبادرة رائدة للحد من الهدر الغذائي وإيصال الوجبات الطازجة للأسر المستفيدة بأعلى معايير السلامة.')
ON CONFLICT (id) DO NOTHING;

-- 2. Seed Marketers
INSERT INTO marketers (id, name, national_id, phone, email, avatar_url, assigned_charity_ids, base_salary, commission_rate, current_month_target, current_month_achieved, total_donations_count, status, join_date, notes)
VALUES
('mkt_1', 'أحمد منصور البارقي', '1088234190', '0501112233', 'ahmed.b@ghazara.sa', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', ARRAY['cht_1', 'cht_2', 'cht_3'], 6000.00, 6.00, 150000.00, 65000.00, 18, 'active', '2024-01-15', 'مسوق متميز - المنطقة الوسطى'),
('mkt_2', 'فاطمة خالد الشهري', '1099451230', '0552223344', 'fatimah.s@ghazara.sa', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80', ARRAY['cht_1', 'cht_4'], 5500.00, 6.50, 180000.00, 80000.00, 22, 'active', '2024-03-01', 'مسؤولة التبرعات المؤسسية والشركات'),
('mkt_3', 'سعود عبدالعزيز الراجحي', '1077123984', '0543334455', 'saud.r@ghazara.sa', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', ARRAY['cht_2', 'cht_3'], 5000.00, 5.50, 120000.00, 45000.00, 12, 'active', '2024-05-10', 'مسوق ميداني - المنطقة الغربية'),
('mkt_4', 'نورة إبراهيم السبيعي', '1066892314', '0564445566', 'noura.s@ghazara.sa', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80', ARRAY['cht_1', 'cht_2', 'cht_4'], 5000.00, 5.50, 100000.00, 35000.00, 9, 'active', '2024-06-01', 'مسوقة الحملات الرقمية والميدانية')
ON CONFLICT (id) DO NOTHING;

-- 3. Seed Users
INSERT INTO users (id, name, email, role, avatar, charity_id, marketer_id)
VALUES
('u1', 'عبدالرحمن التميمي', 'admin@ghazara.sa', 'admin', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80', NULL, NULL),
('u2', 'أحمد منصور البارقي', 'ahmed.b@ghazara.sa', 'marketer', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80', NULL, 'mkt_1'),
('u3', 'أ. عبدالله السليمان', 'rep@ehsan.org.sa', 'charity_rep', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&auto=format&fit=crop&q=80', 'cht_1', NULL)
ON CONFLICT (id) DO NOTHING;

-- 4. Seed Donations
INSERT INTO donations (id, receipt_number, charity_id, charity_name, marketer_id, marketer_name, amount, donor_name, donor_phone, donor_type, payment_method, status, date, time, campaign_name, notes)
VALUES
('don_1', 'REC-2026-1001', 'cht_1', 'جمعية إحسان لرعاية الأيتام', 'mkt_1', 'أحمد منصور البارقي', 15000.00, 'الشيخ سليمان بن صالح', '0505112233', 'individual', 'bank_transfer', 'completed', CURRENT_DATE, '10:15:00', 'كفالة 10 أيتام لمدة عام', 'تحويل عبر مصرف الراجحي'),
('don_2', 'REC-2026-1002', 'cht_1', 'جمعية إحسان لرعاية الأيتام', 'mkt_2', 'فاطمة خالد الشهري', 50000.00, 'شركة المدى القابضة', '0112233445', 'corporate', 'bank_transfer', 'completed', CURRENT_DATE, '11:30:00', 'دعم الوقف التعليمي للأيتام', 'شيك مصدق برقم 98214'),
('don_3', 'REC-2026-1003', 'cht_2', 'جمعية البر والخدمات الإنسانية', 'mkt_1', 'أحمد منصور البارقي', 5000.00, 'فاعل خير', '0559988776', 'anonymous', 'apple_pay', 'completed', CURRENT_DATE, '14:20:00', 'علاج الحالات الحرجة', 'دفع فوري عبر Apple Pay'),
('don_4', 'REC-2026-1004', 'cht_3', 'جمعية تحفيظ القرآن الكريم بالمدينة', 'mkt_3', 'سعود عبدالعزيز الراجحي', 25000.00, 'د. عبدالعزيز الفوزان', '0544112233', 'individual', 'visa', 'completed', CURRENT_DATE, '16:45:00', 'كفالة حلقات تحفيظ القرآن', 'بطاقة فيزا الائتمانية'),
('don_5', 'REC-2026-1005', 'cht_4', 'جمعية إطعام وحفظ النعمة', 'mkt_2', 'فاطمة خالد الشهري', 30000.00, 'مؤسسة العطاء الخيرية', '0138877665', 'corporate', 'bank_transfer', 'completed', CURRENT_DATE, '17:10:00', 'مشروع إطعام 1000 أسرة', 'حوالة بنكية سريعة'),
('don_6', 'REC-2026-1006', 'cht_1', 'جمعية إحسان لرعاية الأيتام', 'mkt_4', 'نورة إبراهيم السبيعي', 10000.00, 'أ. مها الدوسري', '0566332211', 'individual', 'mada', 'completed', CURRENT_DATE, '18:05:00', 'كسوة الشتاء للأيتام', 'بطاقة مدى')
ON CONFLICT (id) DO NOTHING;
