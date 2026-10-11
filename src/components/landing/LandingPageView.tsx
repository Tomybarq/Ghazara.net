import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  HeartHandshake, 
  Sparkles, 
  ShieldCheck, 
  Users, 
  Building2, 
  Wallet, 
  CheckCircle2, 
  ArrowLeft, 
  ChevronDown, 
  ChevronUp, 
  Globe, 
  Check, 
  BarChart3, 
  HandHeart,
  LogIn
} from 'lucide-react';
import { demoUsers } from '../../data/mockData';

const CURRENT_YEAR = 2026;

export const LandingPageView: React.FC = () => {
  const { setViewMode, loginAs } = useApp();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [activePreviewRole, setActivePreviewRole] = useState<'admin' | 'marketer' | 'charity_rep'>('admin');

  // FAQ Items
  const faqItems = [
    {
      q: 'ما هي منصة غزارة للتسويق وإدارة التبرعات؟',
      a: 'غزارة هي منظومة سحابية سعودية متكاملة مصممة خصيصاً للربط الاحترافي بين الجمعيات الخيرية والأوقاف المعتمدة ونخبة المسوقين الميدانيين، تتيح توثيق التبرعات لحظياً بسندات رسمية، وأتمتة مسيرات الرواتب والعمولات بأعلى درجات الدقة والشفافية.'
    },
    {
      q: 'كيف تضمن المنصة حقوق وشفافية الجمعيات الخيرية؟',
      a: 'تحصل كل جمعية شريكة على بوابة خاصة ومستقلة تتيح لممثليها الاطلاع الفوري على كافة سندات التبرع المحصلة لحسابها، مع بيانات المبالغ، وسيلة الدفع، وهوية المسوق، والتقارير المالية الموثقة دون أي تدخل بشري أو تأخير.'
    },
    {
      q: 'كيف يعمل محرك احتساب العمولات ومسيرات الرواتب للمسوقين؟',
      a: 'يعتمد النظام محركاً برمجياً دقيقاً يقوم باحتساب الإنجاز الشهري ومقارنته بالتارغت المستهدف تلقائياً؛ وبناءً على سلم العمولات المعتمد يتم توليد مسير الرواتب الشهري مع دورة تدقيق واعتماد كاملة (مسودة، مراجعة، اعتماد، صرف).'
    },
    {
      q: 'ما هي وسائل الدفع المدعومة في جمع التبرعات الميدانية؟',
      a: 'تدعم المنصة كافة قنوات الدفع الرسمية بالمملكة: بطاقات مدى، فيزا وماستركارد، Apple Pay، stc pay، والتحويلات البنكية المباشرة، مع تسجيل وتوليد رقم إيصال فريد لكل عملية.'
    },
    {
      q: 'هل المنصة متوافقة مع متطلبات الحوكمة والأنظمة السعودية؟',
      a: 'نعم، تم تصميم المنصة مع الالتزام التام بنظام حماية البيانات الشخصية، ولوائح الحوكمة المالية للمركز الوطني لتنمية القطاع غير الربحي، وتوفير سجلات تدقيق غير قابلة للتعديل لكافة العمليات.'
    }
  ];

  // FAQ Schema for SEO
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map(item => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a
      }
    }))
  };

  return (
    <div className="min-h-screen bg-[#070714] text-[#F8FAFC] antialiased selection:bg-purple-600 selection:text-white font-sans">
      
      {/* Structured SEO Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* =========================================================================
          Top Navigation Bar
      ========================================================================== */}
      <header className="sticky top-0 z-50 bg-[#0A0A1F]/85 backdrop-blur-xl border-b border-[#23234A]/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#6B21C8] via-[#8B5CF6] to-[#FF6B2B] p-0.5 shadow-lg shadow-purple-600/30">
              <div className="w-full h-full bg-[#0E0E26] rounded-[14px] flex items-center justify-center">
                <HeartHandshake className="w-6 h-6 text-[#FF6B2B]" />
              </div>
            </div>
            <div>
              <div className="font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-l from-white via-slate-100 to-purple-200">
                منصة غزارة
              </div>
              <div className="text-[11px] text-purple-300/80 font-medium tracking-wide">
                Ghazara Trading & Marketing
              </div>
            </div>
          </div>

          {/* Center Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-300">
            <a href="#features" className="hover:text-purple-300 transition-colors">المميزات والحلول</a>
            <a href="#how-it-works" className="hover:text-purple-300 transition-colors">كيف نعمل</a>
            <a href="#partners" className="hover:text-purple-300 transition-colors">الجمعيات الشريكة</a>
            <a href="#preview" className="hover:text-purple-300 transition-colors">معاينة المنصة</a>
            <a href="#faq" className="hover:text-purple-300 transition-colors">الأسئلة الشائعة</a>
          </nav>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setViewMode('login')}
              className="flex items-center gap-2 text-sm font-bold text-slate-200 hover:text-white px-4 py-2.5 rounded-xl border border-[#2A2A54] hover:border-[#6B21C8]/60 bg-[#12122E]/80 transition-all hover:bg-[#1A1A40]"
            >
              <LogIn className="w-4 h-4 text-[#FF6B2B]" />
              <span>تسجيل الدخول</span>
            </button>

            <button
              onClick={() => setViewMode('platform')}
              className="flex items-center gap-2 text-sm font-bold text-white px-4 sm:px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF6B2B] to-[#EA580C] hover:from-[#EA580C] hover:to-[#C2410C] shadow-lg shadow-orange-500/25 hover:shadow-orange-500/35 active:scale-95 transition-all"
            >
              <span>دخول المنصة مباشرة</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>

        </div>
      </header>

      {/* =========================================================================
          Hero Section (Centered Impactful Dark SaaS Style)
      ========================================================================== */}
      <section className="relative pt-20 pb-28 overflow-hidden">
        {/* Glow & Atmosphere Background Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-purple-700/20 via-orange-600/15 to-transparent blur-[130px] pointer-events-none rounded-full" />
        <div className="absolute -top-32 right-10 w-96 h-96 bg-purple-600/10 blur-[100px] pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          
          {/* Trust Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-purple-500/30 bg-purple-950/40 text-purple-200 text-xs sm:text-sm font-semibold mb-8 shadow-inner shadow-purple-500/20 animate-fade-in">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>المنظومة السحابية الموثوقة لحشد وإدارة التبرعات والأوقاف بالمملكة 🇸🇦</span>
          </div>

          {/* High-Converting H1 Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.18] sm:leading-[1.15] mb-8 text-white">
            حوّل جهود التسويق الخيري إلى{' '}
            <br className="hidden sm:inline" />
            <span className="bg-gradient-to-l from-[#FF6B2B] via-[#F43F5E] to-[#A855F7] bg-clip-text text-transparent">
              أثر مستدام وأداء استثنائي
            </span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-3xl mx-auto text-lg sm:text-xl text-slate-300 leading-relaxed font-normal mb-10">
            منظومة رقمية تضمن للجمعيات الخيرية والمؤسسات الوقفية شفافية كاملة وتوثيقاً فورياً للتبرعات، 
            مع تمكين المسوقين الميدانيين وأتمتة مسيرات الرواتب واحتساب العمولات بدقة 100%.
          </p>

          {/* CTA Buttons Group */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button
              onClick={() => setViewMode('platform')}
              className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#FF6B2B] via-[#F97316] to-[#EA580C] text-white font-extrabold text-base shadow-xl shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-[1.02] active:scale-98 transition-all"
            >
              <span>دخول المنصة وتجربة النظام</span>
              <ArrowLeft className="w-5 h-5" />
            </button>

            <button
              onClick={() => setViewMode('login')}
              className="w-full sm:w-auto flex items-center justify-center gap-3 px-7 py-4 rounded-2xl border border-[#333366] bg-[#12122E]/90 hover:bg-[#1A1A44] hover:border-purple-500/60 text-slate-200 hover:text-white font-bold text-base transition-all"
            >
              <Users className="w-5 h-5 text-purple-400" />
              <span>تجربة فورية كـ مدير أو مسوق أو جمعية</span>
            </button>
          </div>

          {/* Key Metric Highlights Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-3xl bg-[#0F0F2D]/90 border border-[#23234F] shadow-2xl backdrop-blur-md">
            <div className="p-3 text-center border-b md:border-b-0 md:border-l border-[#23234F]/70">
              <div className="text-2xl sm:text-3xl font-black text-white">3,845,000+ <span className="text-sm font-bold text-[#FF6B2B]">ر.س</span></div>
              <div className="text-xs sm:text-sm text-slate-400 mt-1">تبرعات ميدانية موثقة</div>
            </div>
            <div className="p-3 text-center border-b md:border-b-0 md:border-l border-[#23234F]/70">
              <div className="text-2xl sm:text-3xl font-black text-emerald-400">100%</div>
              <div className="text-xs sm:text-sm text-slate-400 mt-1">دقة احتساب العمولات</div>
            </div>
            <div className="p-3 text-center border-l md:border-l border-[#23234F]/70">
              <div className="text-2xl sm:text-3xl font-black text-purple-300">18+</div>
              <div className="text-xs sm:text-sm text-slate-400 mt-1">جمعية ومؤسسة شريكة</div>
            </div>
            <div className="p-3 text-center">
              <div className="text-2xl sm:text-3xl font-black text-cyan-300">0 ثانية</div>
              <div className="text-xs sm:text-sm text-slate-400 mt-1">تأخير في إصدار السندات</div>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          Trust & Partners Strip
      ========================================================================== */}
      <section id="partners" className="py-12 border-y border-[#1E1E42] bg-[#0A0A21]/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-bold uppercase tracking-widest text-slate-400 mb-8">
            شراكات وثيقة واعتماد نظامي مع كبرى الجمعيات الخيرية والأوقاف
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 items-center justify-center opacity-85">
            {[
              { name: 'جمعية إحسان لرعاية الأيتام', code: 'EHSAN-01' },
              { name: 'جمعية البر الخيرية', code: 'BIR-02' },
              { name: 'جمعية تحفيظ القرآن الكريم', code: 'QURAN-03' },
              { name: 'جمعية إطعام للأمن الغذائي', code: 'ITAAM-04' },
              { name: 'جمعية رعاية الأسر المتعففة', code: 'USRA-05' },
              { name: 'مؤسسة غزارة الوقفية', code: 'GHAZARA' },
            ].map((partner, i) => (
              <div 
                key={i} 
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#121230]/70 border border-[#232350] hover:border-purple-500/40 transition-all text-center"
              >
                <Building2 className="w-6 h-6 text-purple-400 mb-1.5" />
                <span className="text-xs font-bold text-slate-200">{partner.name}</span>
                <span className="text-[10px] text-slate-500 font-mono mt-0.5">{partner.code}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          Problem vs. Solution Section (PAS Framework)
      ========================================================================== */}
      <section className="py-24 bg-gradient-to-b from-[#070714] to-[#0C0C24]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="text-xs font-extrabold uppercase tracking-widest text-[#FF6B2B] mb-3">
              لماذا غزارة للتسويق؟
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white">
              وداعاً لفوضى الجداول اليدوية وتأخير مسيرات الرواتب
            </h2>
            <p className="mt-4 text-slate-400 text-base sm:text-lg">
              الأساليب التقليدية في جمع التبرعات تفقد الجمعيات الشفافية وتثقل كاهل المسوقين بالخلافات المالية. غزارة بنيت لإنهاء هذه المعاناة تماماً.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-stretch">
            {/* The Old Painful Way */}
            <div className="p-8 rounded-3xl bg-[#140E1E] border border-rose-900/30 flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 text-xs font-bold mb-6">
                  ✕ الطريقة التقليدية السابقة
                </div>
                <h3 className="text-2xl font-black text-rose-200 mb-4">
                  تحديات ومخاطر التسويق الميداني التقليدي
                </h3>
                <ul className="space-y-4 text-sm text-slate-300">
                  <li className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-rose-900/50 text-rose-400 flex items-center justify-center shrink-0 mt-0.5 font-bold">✕</span>
                    <span>سجلات تبرع ورقية وجداول إكسل قابلة للضياع والخطأ البشري.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-rose-900/50 text-rose-400 flex items-center justify-center shrink-0 mt-0.5 font-bold">✕</span>
                    <span>تأخر الجمعيات الخيرية في معرفة حصيلة التبرعات حتى نهاية الشهر.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-rose-900/50 text-rose-400 flex items-center justify-center shrink-0 mt-0.5 font-bold">✕</span>
                    <span>نزاعات وخلافات مستمرة مع المسوقين حول احتساب نسب التارغت والعمولات.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-rose-900/50 text-rose-400 flex items-center justify-center shrink-0 mt-0.5 font-bold">✕</span>
                    <span>صعوبة استخراج سندات القبض اللحظية للمتبرعين، مما يضعف الثقة الميدانية.</span>
                  </li>
                </ul>
              </div>
              <div className="mt-8 pt-4 border-t border-rose-950 text-xs text-rose-400/80 font-semibold">
                النتيجة: إحباط المسوقين، ضعف ثقة المانحين، وبطء نمو الموارد المالية للجمعية.
              </div>
            </div>

            {/* The Smart Ghazara Way */}
            <div className="p-8 rounded-3xl bg-gradient-to-br from-[#121A33] to-[#0F1429] border border-purple-500/40 shadow-xl shadow-purple-900/20 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold mb-6">
                  ✓ منظومة غزارة المؤتمتة
                </div>
                <h3 className="text-2xl font-black text-white mb-4">
                  إدارة ذكية شفافة تحفز الأداء وتعظم الأثر
                </h3>
                <ul className="space-y-4 text-sm text-slate-200">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>توثيق رقمي فوري لكل ريال مع إصدار سند قبض رسمي للمتبرع خلال ثوانٍ.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>بوابة خاصة ومستقلة لكل جمعية تتيح تتبع حصيلتها وتقاريرها المالية لحظة بلحظة.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>محرك حسابات دقيق يربط التارغت بالعمولة والراتب تلقائياً دون أي تدخل يدوي.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>مساعد ذكاء اصطناعي يقدم تحليلات أداء وتنبؤات تسويقية وتوصيات ميدانية ذكية.</span>
                  </li>
                </ul>
              </div>
              <div className="mt-8 pt-4 border-t border-purple-900/40 text-xs text-emerald-300 font-semibold flex items-center justify-between">
                <span>النتيجة: زيادة متوسط التحصيل بنسبة +43% وراحة بال مالية وإدارية تامة.</span>
                <span className="text-emerald-400 font-bold">100% شفافية</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          Core Features Grid
      ========================================================================== */}
      <section id="features" className="py-24 bg-[#08081B] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="text-xs font-extrabold uppercase tracking-widest text-[#FF6B2B] mb-3">
              حلول مصممة للتميز
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white">
              كل ما تحتاجه لإدارة منظومة تسويق خيري متكاملة
            </h2>
            <p className="mt-4 text-slate-400 text-base sm:text-lg">
              صممنا غزارة لتلبي احتياجات الإدارة التنفيذية، المسوقين في الميدان، وممثلي الجمعيات على منصة موحدة.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            
            {/* Feature 1 */}
            <div className="p-8 rounded-3xl bg-[#11112D] border border-[#23234F] hover:border-purple-500/50 transition-all group hover:-translate-y-1">
              <div className="w-14 h-14 rounded-2xl bg-purple-600/20 text-purple-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <HandHeart className="w-7 h-7 text-[#FF6B2B]" />
              </div>
              <h3 className="text-xl font-black text-white mb-3">
                تسجيل التبرعات الميدانية الفورية
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-6">
                نموذج إدخال ميداني سريع ومصمم للهواتف الذكية؛ مع دعم كامل لمدى وفيزا وApple Pay والتحويل البنكي، وتوليد إيصالات رقمية مرقمة تلقائياً.
              </p>
              <div className="text-xs text-purple-300 font-bold flex items-center gap-1.5">
                <span>يدعم التبرعات الفردية والشركات</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-3xl bg-[#11112D] border border-[#23234F] hover:border-purple-500/50 transition-all group hover:-translate-y-1">
              <div className="w-14 h-14 rounded-2xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Wallet className="w-7 h-7 text-emerald-400" />
              </div>
              <h3 className="text-xl font-black text-white mb-3">
                محرك مسيرات الرواتب والعمولات
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-6">
                حساب آلي فوري لنسبة إنجاز كل مسوق، وتطبيق معادلات الشرائح والعمولات تلقائياً، مع دورة اعتماد وتدقيق واضحة تمنع أي التباس مالي.
              </p>
              <div className="text-xs text-emerald-300 font-bold flex items-center gap-1.5">
                <span>تصدير فوري لكشوفات الصرف والتحويل</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-3xl bg-[#11112D] border border-[#23234F] hover:border-purple-500/50 transition-all group hover:-translate-y-1">
              <div className="w-14 h-14 rounded-2xl bg-cyan-600/20 text-cyan-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Building2 className="w-7 h-7 text-cyan-400" />
              </div>
              <h3 className="text-xl font-black text-white mb-3">
                بوابة الشفافية للجمعيات الشريكة
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-6">
                لوحة تحكم مخصصة لممثل الجمعية للاطلاع الحصري على التبرعات المحصلة لصالحها فقط، مع ميزة تحميل كشوفات Excel وتدقيق بيانات المتبرعين.
              </p>
              <div className="text-xs text-cyan-300 font-bold flex items-center gap-1.5">
                <span>عزل صارم للبيانات بين الجمعيات</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Feature 4 */}
            <div className="p-8 rounded-3xl bg-[#11112D] border border-[#23234F] hover:border-purple-500/50 transition-all group hover:-translate-y-1">
              <div className="w-14 h-14 rounded-2xl bg-amber-600/20 text-amber-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Sparkles className="w-7 h-7 text-amber-400" />
              </div>
              <h3 className="text-xl font-black text-white mb-3">
                مساعد غزارة الذكي (AI Copilot)
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-6">
                مساعد ذكاء اصطناعي مدمج يجيب فورياً عن استفسارات التحصيل، يقارن أداء المسوقين والحملات، ويقترح حلولاً عملية لرفع معدلات التبرع.
              </p>
              <div className="text-xs text-amber-300 font-bold flex items-center gap-1.5">
                <span>متحدث باللغة العربية بطلاقة</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Feature 5 */}
            <div className="p-8 rounded-3xl bg-[#11112D] border border-[#23234F] hover:border-purple-500/50 transition-all group hover:-translate-y-1">
              <div className="w-14 h-14 rounded-2xl bg-rose-600/20 text-rose-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-7 h-7 text-rose-400" />
              </div>
              <h3 className="text-xl font-black text-white mb-3">
                تحديد ومتابعة التارغت الشهري
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-6">
                توزيع الأهداف المالية على المسوقين والجمعيات شهرياً، مع مؤشرات بيانية واضحة تبين المسافة المتبقية لتحقيق الهدف ونيل المكافآت.
              </p>
              <div className="text-xs text-rose-300 font-bold flex items-center gap-1.5">
                <span>رسم بياني للإنجاز الميداني المباشر</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Feature 6 */}
            <div className="p-8 rounded-3xl bg-[#11112D] border border-[#23234F] hover:border-purple-500/50 transition-all group hover:-translate-y-1">
              <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-7 h-7 text-indigo-400" />
              </div>
              <h3 className="text-xl font-black text-white mb-3">
                الأمان وحوكمة الصلاحيات (RBAC)
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-6">
                فصل صارم بين صلاحيات المدير، المسوق، وممثل الجمعية؛ لا يمكن لأي مستخدم الاطلاع على بيانات خارج نطاق مسؤوليته المحددة.
              </p>
              <div className="text-xs text-indigo-300 font-bold flex items-center gap-1.5">
                <span>تشفير عالي وامتثال كامل للأنظمة</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          Interactive Live Platform Preview Section
      ========================================================================== */}
      <section id="preview" className="py-24 bg-gradient-to-b from-[#08081B] via-[#0E0E2C] to-[#070714]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="text-xs font-extrabold uppercase tracking-widest text-[#FF6B2B] mb-3">
              استكشف المنصة على الهواء مباشرة
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white">
              شاهد كيف تعمل المنصة لكل شريك
            </h2>
            <p className="mt-4 text-slate-400 text-base sm:text-lg">
              اختر دورك الوظيفي لمشاهدة محاكاة تفاعلية للواجهة وما تقدمه من رؤى وميزات.
            </p>

            {/* Role Switcher Pill Tabs */}
            <div className="inline-flex items-center gap-2 p-1.5 rounded-2xl bg-[#141433] border border-[#232352] mt-8">
              <button
                onClick={() => setActivePreviewRole('admin')}
                className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  activePreviewRole === 'admin' 
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                مدير النظام (Admin)
              </button>
              <button
                onClick={() => setActivePreviewRole('marketer')}
                className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  activePreviewRole === 'marketer' 
                    ? 'bg-[#FF6B2B] text-white shadow-lg shadow-orange-600/30' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                مسوق ميداني (Marketer)
              </button>
              <button
                onClick={() => setActivePreviewRole('charity_rep')}
                className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  activePreviewRole === 'charity_rep' 
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                ممثل جمعية (Charity Rep)
              </button>
            </div>
          </div>

          {/* Platform Mockup Card */}
          <div className="rounded-3xl bg-[#0D0D26] border border-[#232352] shadow-2xl p-6 sm:p-8 overflow-hidden relative">
            <div className="flex flex-col lg:flex-row gap-8 items-center justify-between">
              
              <div className="flex-1 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold">
                  {activePreviewRole === 'admin' && 'لوحة القيادة التنفيذية - مراقبة كافة فروع التسويق'}
                  {activePreviewRole === 'marketer' && 'بوابة المسوق الميداني - تحقيق الهدف وصرف العمولات'}
                  {activePreviewRole === 'charity_rep' && 'بوابة الجمعية الخيرية - شفافية التبرعات والتقارير'}
                </div>

                <h3 className="text-2xl sm:text-3xl font-black text-white">
                  {activePreviewRole === 'admin' && 'إشراف كامل على 3.8M+ ريال مع اعتماد مسيرات الرواتب بضغطة واحدة'}
                  {activePreviewRole === 'marketer' && 'تسجيل التبرع في 30 ثانية مع رؤية رصيد عمولتك لحظياً'}
                  {activePreviewRole === 'charity_rep' && 'اطلع على كل إيصال صادر لجمعيتك مع تفاصيل المانح والمبلغ'}
                </h3>

                <p className="text-slate-400 text-sm leading-relaxed">
                  {activePreviewRole === 'admin' && 'متابعة شاملة لإيرادات جميع الجمعيات، ترتيب أداء المسوقين، التحقق من العمولات، وتصدير التقارير الرسمية للإدارة المالية.'}
                  {activePreviewRole === 'marketer' && 'واجهة بسيطة وفعالة تتيح لك إدخال بيانات التبرع وإصدار السند فورياً وإرساله للمتبرع عبر واتساب أو رسالة، مع تتبع شريط الإنجاز الشهري.'}
                  {activePreviewRole === 'charity_rep' && 'خصوصية مطلقة تضمن لك عدم رؤية أي بيانات تخص جمعيات أخرى، مع إمكانية تصدير كشوفات الإيرادات لملف Excel لتقديمها للمدققين والمحاسبين.'}
                </p>

                <div className="flex flex-wrap gap-4 pt-2">
                  <button
                    onClick={() => {
                      const user = demoUsers.find(u => u.role === activePreviewRole) || demoUsers[0];
                      loginAs(user);
                    }}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-purple-600/30 transition-all"
                  >
                    <span>الدخول المباشر بهذا الدور</span>
                    <ArrowLeft className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setViewMode('platform')}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl border border-[#2E2E5A] hover:bg-white/5 text-slate-300 hover:text-white font-semibold text-sm transition-all"
                  >
                    <span>استكشاف كافة الأقسام</span>
                  </button>
                </div>
              </div>

              {/* Visual Simulated Mockup Box */}
              <div className="w-full lg:w-[480px] p-6 rounded-2xl bg-[#141438] border border-[#2B2B5C] shadow-inner space-y-4">
                <div className="flex items-center justify-between border-b border-[#2B2B5C] pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                    <span className="text-xs font-mono text-slate-400 mr-2">ghazara.sa/app</span>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">متصل بالخادم</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-[#1A1A46] border border-[#2B2B5C]">
                    <div className="text-[11px] text-slate-400">إجمالي الحصيلة</div>
                    <div className="text-lg font-black text-white mt-1">384,500 ر.س</div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#1A1A46] border border-[#2B2B5C]">
                    <div className="text-[11px] text-slate-400">نسبة تحقيق الهدف</div>
                    <div className="text-lg font-black text-emerald-400 mt-1">96.2%</div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#1A1A46] border border-[#2B2B5C]">
                  <div className="flex justify-between text-xs text-slate-300 font-semibold mb-2">
                    <span>آخر تبرع مسجل الآن</span>
                    <span className="text-[#FF6B2B] font-bold">2,500 ر.س</span>
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center justify-between">
                    <span>المتبرع: فاعل خير (Apple Pay)</span>
                    <span>سند: RCP-2026-0891</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#1A1A46]/70 border border-[#2B2B5C] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span className="text-slate-300 font-semibold">توصية الذكاء الاصطناعي:</span>
                  </div>
                  <span className="text-purple-300 font-bold">حملة الأيتام تقترب من 100%</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          Testimonials Section
      ========================================================================== */}
      <section className="py-24 bg-[#070714]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="text-xs font-extrabold uppercase tracking-widest text-[#FF6B2B] mb-3">
              شهادات النجاح
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white">
              يثق بنا قادة القطاع غير الربحي والمسوقون الميدانيون
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            
            <div className="p-8 rounded-3xl bg-[#0F0F29] border border-[#232350] flex flex-col justify-between">
              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                "بصفتي ممثلاً لجمعية إحسان، منحنا نظام غزارة راحة بال لا تقدر بثمن؛ أستطيع في أي لحظة الاطلاع على سندات التبرع المحصلة لحسابنا مع دقة محاسبية تامة وسهولة في تدقيق إيراداتنا."
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-[#232350]">
                <img 
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80" 
                  alt="د. فيصل العتيبي"
                  className="w-10 h-10 rounded-full object-cover border border-purple-500/40"
                />
                <div>
                  <div className="text-sm font-bold text-white">د. فيصل العتيبي</div>
                  <div className="text-xs text-purple-300">ممثل جمعية إحسان لرعاية الأيتام</div>
                </div>
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-[#0F0F29] border border-[#232350] flex flex-col justify-between">
              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                "كمسوق ميداني، كانت أكبر مشكلة أواجهها هي تأخر معرفة عمولتي ومسير راتبي. مع غزارة أسجل التبرع وأرى شريط إنجازي يرتفع في نفس الثانية، ورواتبي تصرف بدون أي خلاف."
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-[#232350]">
                <img 
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80" 
                  alt="أحمد الزهراني"
                  className="w-10 h-10 rounded-full object-cover border border-orange-500/40"
                />
                <div>
                  <div className="text-sm font-bold text-white">أحمد الزهراني</div>
                  <div className="text-xs text-orange-300">مسوق ميداني معتمد</div>
                </div>
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-[#0F0F29] border border-[#232350] flex flex-col justify-between">
              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                "ساعدتنا غزارة في إدارة 15 مسوقاً ميدانياً وتوزيعهم على جمعيات متعددة بمرونة عالية، مع مراقبة مؤشرات الأداء الحية والمساعد الذكي الذي يحلل الحملات بسرعة غير مسبوقة."
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-[#232350]">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" 
                  alt="عبدالرحمن المنصور"
                  className="w-10 h-10 rounded-full object-cover border border-purple-500/40"
                />
                <div>
                  <div className="text-sm font-bold text-white">عبدالرحمن المنصور</div>
                  <div className="text-xs text-purple-300">المدير التنفيذي لعمليات التسويق</div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          FAQ Accordion Section (with Schema)
      ========================================================================== */}
      <section id="faq" className="py-24 bg-[#0A0A21] border-t border-[#1C1C42]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-16">
            <div className="text-xs font-extrabold uppercase tracking-widest text-[#FF6B2B] mb-3">
              إجابات واضحة
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white">
              الأسئلة الشائعة حول المنصة
            </h2>
          </div>

          <div className="space-y-4">
            {faqItems.map((item, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div 
                  key={index} 
                  className="rounded-2xl bg-[#111132] border border-[#242456] overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full flex items-center justify-between p-6 text-right font-bold text-base sm:text-lg text-white hover:text-purple-300 transition-colors"
                  >
                    <span>{item.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-[#FF6B2B] shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6 text-sm sm:text-base text-slate-300 leading-relaxed border-t border-[#242456]/60 pt-4 animate-fade-in">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* =========================================================================
          High-Converting Bottom CTA Section
      ========================================================================== */}
      <section className="py-20 relative overflow-hidden bg-gradient-to-r from-[#170E33] via-[#2A1138] to-[#170E33] border-y border-[#3E1A63]/60">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-600/20 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight mb-6">
            جاهز للارتقاء بحصيلة التبرعات وكفاءة فريقك التسويقي؟
          </h2>
          <p className="text-base sm:text-lg text-purple-200/80 max-w-2xl mx-auto mb-10 leading-relaxed">
            انضم الآن إلى منظومة غزارة السحابية؛ وابدأ بتجربة المنصة فوراً وتعرف على دقة النظام وسرعته.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => setViewMode('platform')}
              className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#FF6B2B] to-[#EA580C] hover:from-[#EA580C] hover:to-[#C2410C] text-white font-black text-base shadow-2xl shadow-orange-500/30 active:scale-95 transition-all"
            >
              <span>دخول المنصة وتجربة النظام الآن</span>
              <ArrowLeft className="w-5 h-5" />
            </button>

            <button
              onClick={() => setViewMode('login')}
              className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-2xl border border-purple-500/40 bg-purple-950/40 hover:bg-purple-900/50 text-white font-bold text-base transition-all"
            >
              <LogIn className="w-5 h-5 text-purple-300" />
              <span>تسجيل الدخول كشريك</span>
            </button>
          </div>

          <div className="mt-8 text-xs text-slate-400 flex items-center justify-center gap-6">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              تشفير بنكي 256-bit
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-purple-400" />
              دعم فني واستجابة فورية
            </span>
            <span className="flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-[#FF6B2B]" />
              خوادم سحابية بالشرق الأوسط (الدمام)
            </span>
          </div>

        </div>
      </section>

      {/* =========================================================================
          Footer
      ========================================================================== */}
      <footer className="py-14 bg-[#050510] text-slate-400 text-sm border-t border-[#181838]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            
            {/* Col 1: Brand Info */}
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#6B21C8] to-[#FF6B2B] flex items-center justify-center">
                  <HeartHandshake className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-black text-white">منصة غزارة للتسويق</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed max-w-md">
                شركة غزارة للتجارة والتسويق - منظومة سحابية متقدمة لتمكين الجمعيات الأهلية والأوقاف في المملكة العربية السعودية عبر حلول التسويق الميداني الرقمي وحشد التبرعات وأتمتة مسيرات الرواتب.
              </p>
              <div className="text-xs text-slate-500">
                المقر الرئيسي: الرياض، المملكة العربية السعودية 🇸🇦
              </div>
            </div>

            {/* Col 2: Quick Links */}
            <div>
              <div className="text-xs font-bold text-white uppercase tracking-wider mb-4">روابط سريعة</div>
              <ul className="space-y-2.5 text-xs">
                <li><button onClick={() => setViewMode('platform')} className="hover:text-purple-300">لوحة التحكم</button></li>
                <li><button onClick={() => setViewMode('login')} className="hover:text-purple-300">تسجيل الدخول</button></li>
                <li><a href="#features" className="hover:text-purple-300">المميزات والحلول</a></li>
                <li><a href="#partners" className="hover:text-purple-300">الجمعيات الشريكة</a></li>
                <li><a href="#faq" className="hover:text-purple-300">الأسئلة الشائعة</a></li>
              </ul>
            </div>

            {/* Col 3: Legal & Compliance */}
            <div>
              <div className="text-xs font-bold text-white uppercase tracking-wider mb-4">الامتثال والأمان</div>
              <ul className="space-y-2.5 text-xs text-slate-400">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>متوافق مع نظام حماية البيانات الشخصية</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>ضوابط الحوكمة للمركز الوطني غير الربحي</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>تشفير اتصالات SSL/TLS معتمد</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>استضافة سحابية Google Cloud Run</span>
                </li>
              </ul>
            </div>

          </div>

          <div className="pt-8 border-t border-[#181838] flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
            <div>
              جميع الحقوق محفوظة © {CURRENT_YEAR} شركة غزارة للتجارة والتسويق.
            </div>
            <div className="flex items-center gap-6">
              <span className="text-slate-400">الرياض · المملكة العربية السعودية</span>
              <span className="text-emerald-400 font-semibold">حالة النظام: نشط 100%</span>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
};
