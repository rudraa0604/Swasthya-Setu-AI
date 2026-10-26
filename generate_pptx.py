import os
# pyrefly: ignore[missing-import]
from pptx import Presentation
# pyrefly: ignore[missing-import]
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE

def create_presentation():
    prs = Presentation()
    # 16:9 widescreen
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_slide_layout = prs.slide_layouts[6]

    # Theme Colors (White, Red, Green, Orange, Dark Navy Slate)
    COLOR_WHITE = RGBColor(255, 255, 255)
    COLOR_RED = RGBColor(220, 38, 38)        # #dc2626
    COLOR_GREEN = RGBColor(22, 163, 74)      # #16a34a
    COLOR_ORANGE = RGBColor(234, 88, 12)     # #ea580c
    COLOR_BLUE = RGBColor(37, 99, 235)       # #2563eb
    COLOR_PURPLE = RGBColor(147, 51, 234)    # #9333ea
    COLOR_BG_DARK = RGBColor(15, 23, 42)     # #0f172a
    COLOR_CARD_DARK = RGBColor(30, 41, 59)   # #1e293b
    COLOR_MUTED = RGBColor(148, 163, 184)    # #94a3b8

    def add_header(slide, title_text, category_text="SWASTHYASETU AI"):
        # Header category
        cat_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(11.7), Inches(0.4))
        cat_tf = cat_box.text_frame
        cat_tf.word_wrap = True
        p_cat = cat_tf.paragraphs[0]
        p_cat.text = category_text.upper()
        p_cat.font.size = Pt(11)
        p_cat.font.bold = True
        p_cat.font.color.rgb = COLOR_ORANGE

        # Main Slide Title
        title_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.7), Inches(11.7), Inches(0.8))
        title_tf = title_box.text_frame
        title_tf.word_wrap = True
        p_title = title_tf.paragraphs[0]
        p_title.text = title_text
        p_title.font.size = Pt(24)
        p_title.font.bold = True
        p_title.font.color.rgb = COLOR_WHITE

    def add_card(slide, left, top, width, height, bg_color=COLOR_CARD_DARK, border_color=None):
        shape = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
        shape.fill.solid()
        shape.fill.fore_color.rgb = bg_color
        if border_color:
            shape.line.color.rgb = border_color
            shape.line.width = Pt(1.5)
        else:
            shape.line.fill.background()
        return shape

    # ==================== SLIDE 1: TITLE SLIDE ====================
    slide1 = prs.slides.add_slide(blank_slide_layout)
    bg1 = slide1.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
    bg1.fill.solid()
    bg1.fill.fore_color.rgb = COLOR_BG_DARK
    bg1.line.fill.background()

    # Title Banner Accent
    accent = slide1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(1.1), Inches(0.15), Inches(3.4))
    accent.fill.solid()
    accent.fill.fore_color.rgb = COLOR_ORANGE
    accent.line.fill.background()

    t_box = slide1.shapes.add_textbox(Inches(1.2), Inches(1.0), Inches(11.3), Inches(3.6))
    tf1 = t_box.text_frame
    tf1.word_wrap = True

    p1 = tf1.paragraphs[0]
    p1.text = "🏥 SwasthyaSetu AI (स्वास्थ्य सेतु AI)"
    p1.font.size = Pt(36)
    p1.font.bold = True
    p1.font.color.rgb = COLOR_WHITE

    p2 = tf1.add_paragraph()
    p2.text = "Federated AI Platform for National-Scale Health Resource & Supply Chain Resilience across India's PHC Network & Hospital Systems"
    p2.font.size = Pt(18)
    p2.font.bold = True
    p2.font.color.rgb = COLOR_GREEN
    p2.space_before = Pt(10)

    p3 = tf1.add_paragraph()
    p3.text = "Predictive Redistribution • Proximity Disease Outbreak Radar • Hospital Resource Optimization • Mass Casualty Tragedy Early Warning"
    p3.font.size = Pt(13)
    p3.font.color.rgb = COLOR_MUTED
    p3.space_before = Pt(8)

    # Info Badges (4 cards)
    badges = [
        ("🚨 Zero Stock-Outs", "14-Day predictive depletion warnings & dynamic buffer safety nets.", COLOR_RED),
        ("⚡ MILP Redistribution", "Peer-to-peer stock transfer within hours vs. 6-week state indents.", COLOR_GREEN),
        ("🏨 Hospital Optimizer", "AI allocation for beds, ICU, surgical OTs, and staff rosters.", COLOR_BLUE),
        ("🔒 Privacy-First FedAvg", "DISHA / DPDP Act 2023 compliant federated learning across state nodes.", COLOR_ORANGE)
    ]
    for idx, (b_title, b_desc, col) in enumerate(badges):
        l = Inches(0.8 + idx * 2.95)
        add_card(slide1, l, Inches(5.0), Inches(2.8), Inches(1.7), COLOR_CARD_DARK, col)
        tb = slide1.shapes.add_textbox(l + Inches(0.15), Inches(5.15), Inches(2.5), Inches(1.4))
        tf_b = tb.text_frame
        tf_b.word_wrap = True
        p = tf_b.paragraphs[0]
        p.text = b_title
        p.font.size = Pt(14)
        p.font.bold = True
        p.font.color.rgb = col
        p_sub = tf_b.add_paragraph()
        p_sub.text = b_desc
        p_sub.font.size = Pt(10)
        p_sub.font.color.rgb = COLOR_WHITE
        p_sub.space_before = Pt(4)

    # ==================== SLIDE 2: PROBLEM STATEMENT ====================
    slide2 = prs.slides.add_slide(blank_slide_layout)
    bg2 = slide2.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
    bg2.fill.solid()
    bg2.fill.fore_color.rgb = COLOR_BG_DARK
    bg2.line.fill.background()
    add_header(slide2, "The Dual Crisis in India's Healthcare Ecosystem", "Problem Statement")

    # 3 Problem Cards
    card1 = add_card(slide2, Inches(0.8), Inches(1.8), Inches(3.6), Inches(4.8), COLOR_CARD_DARK, COLOR_RED)
    tb = slide2.shapes.add_textbox(Inches(1.0), Inches(2.0), Inches(3.2), Inches(4.4))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "❌ Critical Drug Stock-Outs"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = COLOR_RED
    bullets1 = [
        "Rural PHCs frequently run out of Anti-Rabies, Snake Antivenom, Insulin & IV fluids.",
        "Sudden seasonal footfall spikes catch rural clinics completely unprepared.",
        "Delayed state-level tender cycles take 4 to 8 weeks to replenish supplies.",
        "Loss of critical golden hours for emergency patients in remote villages."
    ]
    for b in bullets1:
        pb = tf.add_paragraph()
        pb.text = "• " + b
        pb.font.size = Pt(12)
        pb.font.color.rgb = COLOR_WHITE
        pb.space_before = Pt(8)

    card2 = add_card(slide2, Inches(4.8), Inches(1.8), Inches(3.6), Inches(4.8), COLOR_CARD_DARK, COLOR_ORANGE)
    tb = slide2.shapes.add_textbox(Inches(5.0), Inches(2.0), Inches(3.2), Inches(4.4))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "❌ Expired Medicine Waste"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = COLOR_ORANGE
    bullets2 = [
        "PHC A holds 400 surplus vials expiring in 60 days.",
        "PHC B (15km away) faces acute stock-out of the exact same medicine.",
        "Zero inter-clinic visibility causes preventable expiration of crores in drugs.",
        "Traditional supply chains lack algorithmic peer-to-peer redistribution."
    ]
    for b in bullets2:
        pb = tf.add_paragraph()
        pb.text = "• " + b
        pb.font.size = Pt(12)
        pb.font.color.rgb = COLOR_WHITE
        pb.space_before = Pt(8)

    card3 = add_card(slide2, Inches(8.8), Inches(1.8), Inches(3.7), Inches(4.8), COLOR_CARD_DARK, COLOR_BLUE)
    tb = slide2.shapes.add_textbox(Inches(9.0), Inches(2.0), Inches(3.3), Inches(4.4))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "❌ Hospital Bottlenecks"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = COLOR_BLUE
    bullets3 = [
        "Ad-hoc bed and ICU planning causes ward congestion alongside idle ICU buffers.",
        "Uncoordinated operating room scheduling results in 30%+ OT idle gaps.",
        "Doctors and nurses face severe burnout due to manual, unoptimized rostering.",
        "Zero advance warning for mass casualty accidents and epidemic spikes."
    ]
    for b in bullets3:
        pb = tf.add_paragraph()
        pb.text = "• " + b
        pb.font.size = Pt(12)
        pb.font.color.rgb = COLOR_WHITE
        pb.space_before = Pt(8)

    # ==================== SLIDE 3: PROPOSED SOLUTION ====================
    slide3 = prs.slides.add_slide(blank_slide_layout)
    bg3 = slide3.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
    bg3.fill.solid()
    bg3.fill.fore_color.rgb = COLOR_BG_DARK
    bg3.line.fill.background()
    add_header(slide3, "SwasthyaSetu AI: Unified Dual-Layer Resilience Architecture", "The Solution")

    sol_items = [
        ("📈 Multi-Horizon Predictive AI", "Forecasts 7, 14, and 30-day medicine demand and outpatient footfall using Poisson distributions, moving averages, and Prophet + XGBoost with 95% confidence intervals.", COLOR_GREEN),
        ("🚚 MILP P2P Redistribution", "Mathematical Linear Programming (PuLP) matches surplus clinics with shortage clinics, optimizing transit routes, distance, and FEFO expiry prioritization while maintaining safety buffers.", COLOR_GREEN),
        ("🏨 Hospital Resource Optimizer", "Optimizes bed allocations, preserves 15% ICU emergency buffers, schedules surgical OTs via Google OR-Tools CP-SAT, and rosters clinical staff to eliminate fatigue.", COLOR_BLUE),
        ("📡 Proximity Early Warning Radar", "Haversine geospatial AI detects disease outbreaks (<28km) and mass-casualty tragedies (<20km), predicting ambulance arrival ETAs & patient influx with 1-click triage activation.", COLOR_ORANGE),
    ]

    for idx, (title, desc, col) in enumerate(sol_items):
        col_pos = idx % 2
        row_pos = idx // 2
        l = Inches(0.8 + col_pos * 5.9)
        t = Inches(1.8 + row_pos * 2.5)
        add_card(slide3, l, t, Inches(5.6), Inches(2.2), COLOR_CARD_DARK, col)
        
        tb = slide3.shapes.add_textbox(l + Inches(0.2), t + Inches(0.2), Inches(5.2), Inches(1.8))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title
        p.font.size = Pt(16)
        p.font.bold = True
        p.font.color.rgb = col
        
        pd = tf.add_paragraph()
        pd.text = desc
        pd.font.size = Pt(12)
        pd.font.color.rgb = COLOR_WHITE
        pd.space_before = Pt(6)

    # ==================== SLIDE 4: PROXIMITY EARLY WARNING RADAR ====================
    slide4 = prs.slides.add_slide(blank_slide_layout)
    bg4 = slide4.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
    bg4.fill.solid()
    bg4.fill.fore_color.rgb = COLOR_BG_DARK
    bg4.line.fill.background()
    add_header(slide4, "AI Proximity Disease Outbreak & Tragedy Radar", "Geospatial Early Warning")

    # Left: Outbreak Diffusion
    add_card(slide4, Inches(0.8), Inches(1.8), Inches(5.6), Inches(4.8), COLOR_CARD_DARK, COLOR_RED)
    tb_l = slide4.shapes.add_textbox(Inches(1.0), Inches(2.0), Inches(5.2), Inches(4.4))
    tf_l = tb_l.text_frame
    tf_l.word_wrap = True
    p = tf_l.paragraphs[0]
    p.text = "🦠 Nearby Spreading Disease Detection"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = COLOR_RED
    outbreak_points = [
        "Monitors active epidemic clusters within 28km radius using Haversine formulas.",
        "Predicts incoming patient influx surge: ΔSurge = (1 - D/30) × 180%.",
        "Calculates expected arrival timeline (e.g. 24h to 48h diffusion).",
        "Automatically recommends preemptive medicine buffer orders (ORS, Antibiotics, IV Fluids) before local stocks deplete.",
        "Visual distance badges (e.g. 2.3 km away) and urgency color coding."
    ]
    for b in outbreak_points:
        pb = tf_l.add_paragraph()
        pb.text = "• " + b
        pb.font.size = Pt(12)
        pb.font.color.rgb = COLOR_WHITE
        pb.space_before = Pt(6)

    # Right: Tragedy & Disaster Inflow
    add_card(slide4, Inches(6.8), Inches(1.8), Inches(5.7), Inches(4.8), COLOR_CARD_DARK, COLOR_ORANGE)
    tb_r = slide4.shapes.add_textbox(Inches(7.0), Inches(2.0), Inches(5.3), Inches(4.4))
    tf_r = tb_r.text_frame
    tf_r.word_wrap = True
    p = tf_r.paragraphs[0]
    p.text = "🚨 Mass Casualty Tragedy & Disaster Radar"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = COLOR_ORANGE
    tragedy_points = [
        "Detects highway collisions, chemical leaks, floods & food contamination within 20km.",
        "Calculates real-time ambulance arrival ETA: T_ETA = (Distance / 40 km/h) × 60 mins.",
        "Forecasts projected trauma patient inflow (e.g. 8-15 casualties).",
        "1-Click Triage Activation: Alerts staff to reserve emergency beds, prepare sterile trauma kits, and stage IV fluids at reception.",
        "Live simulation console for disaster management drills."
    ]
    for b in tragedy_points:
        pb = tf_r.add_paragraph()
        pb.text = "• " + b
        pb.font.size = Pt(12)
        pb.font.color.rgb = COLOR_WHITE
        pb.space_before = Pt(6)

    # ==================== SLIDE 5: HOSPITAL RESOURCE OPTIMIZATION ====================
    slide5 = prs.slides.add_slide(blank_slide_layout)
    bg5 = slide5.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
    bg5.fill.solid()
    bg5.fill.fore_color.rgb = COLOR_BG_DARK
    bg5.line.fill.background()
    add_header(slide5, "AI Hospital Resource Optimization Suite", "In-Hospital Intelligence")

    hosp_modules = [
        ("🛏️ Bed & ICU Optimizer", [
            "Allocates beds across wards and critical ICU units.",
            "Enforces mandatory 15% emergency reserve ICU buffer.",
            "Handles isolation rules and step-down discharge velocity.",
            "Formulated via MILP (PuLP / OR-Tools)."
        ], COLOR_BLUE),
        ("⏱️ Operating Room Scheduler", [
            "Builds surgical OT schedules cutting idle time.",
            "Eliminates surgeon overtime and scheduling conflicts.",
            "Accounts for cleaning gaps and emergency reservations.",
            "Powered by Google OR-Tools CP-SAT job-shop solver."
        ], COLOR_GREEN),
        ("👨‍⚕️ Staff Roster Allocation", [
            "Rosters doctors, nurses & techs by predicted load.",
            "Enforces shift limits, rest hours & skill qualifications.",
            "Reduces clinical burnout during peak rush periods.",
            "Dynamically rebalances from low-acuity day clinics."
        ], COLOR_ORANGE),
        ("🧪 What-If Disaster Simulator", [
            "Tests shock scenarios (e.g. '+40% Outbreak', 'Mass Crash').",
            "SimPy discrete-event simulation + RL policy agent.",
            "Pre-calculates oxygen, ventilator & blood requirements.",
            "Human-in-the-loop: Admin 1-click approve / reject actions."
        ], COLOR_PURPLE)
    ]

    for idx, (title, points, col) in enumerate(hosp_modules):
        col_pos = idx % 2
        row_pos = idx // 2
        l = Inches(0.8 + col_pos * 5.9)
        t = Inches(1.8 + row_pos * 2.5)
        add_card(slide5, l, t, Inches(5.6), Inches(2.2), COLOR_CARD_DARK, col)
        
        tb = slide5.shapes.add_textbox(l + Inches(0.2), t + Inches(0.15), Inches(5.2), Inches(1.9))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title
        p.font.size = Pt(15)
        p.font.bold = True
        p.font.color.rgb = col
        
        for pt in points:
            pb = tf.add_paragraph()
            pb.text = "• " + pt
            pb.font.size = Pt(11)
            pb.font.color.rgb = COLOR_WHITE
            pb.space_before = Pt(2)

    # ==================== SLIDE 6: ROUTE & FLEET TRANSIT OPTIMIZER ====================
    slide6 = prs.slides.add_slide(blank_slide_layout)
    bg6 = slide6.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
    bg6.fill.solid()
    bg6.fill.fore_color.rgb = COLOR_BG_DARK
    bg6.line.fill.background()
    add_header(slide6, "AI Route & Fleet Transit Logistics Optimizer", "Logistics & Drone Corridors")

    route_cards = [
        ("🚚 Capacitated Vehicle Routing (CVRP)", [
            "Calculates multi-stop delivery routes for medicine supply vans.",
            "Minimizes transit distance, toll costs, and road transit times.",
            "Coordinates inter-PHC FEFO medicine dispatches.",
            "Live road metric summary and fuel efficiency indicators."
        ], COLOR_GREEN),
        ("🚁 Autonomous Drone Corridors", [
            "Monitors aerial delivery corridors for high-urgency supplies.",
            "Transports cold-chain antivenom and vaccines to hilly terrains.",
            "Bypasses congested highways during acute emergencies.",
            "Pre-flight battery and waypoint corridor clearance tracking."
        ], COLOR_BLUE),
        ("🔄 Dynamic Incident Reroute Simulator", [
            "Simulates highway roadblocks, flash floods, or landslides.",
            "Recalculates alternative transit detours in real time.",
            "Prevents transit delays for critical life-saving dispatches.",
            "Provides turn-by-turn navigation guidance for drivers."
        ], COLOR_ORANGE),
        ("🚨 Emergency Green Corridors", [
            "Integrates with National Emergency Mode (`#/portal/emergency`).",
            "Grants highest priority to disaster casualty transit.",
            "Automated coordination with police and highway authorities.",
            "Real-time GPS telemetry streaming."
        ], COLOR_RED)
    ]

    for idx, (title, points, col) in enumerate(route_cards):
        col_pos = idx % 2
        row_pos = idx // 2
        l = Inches(0.8 + col_pos * 5.9)
        t = Inches(1.8 + row_pos * 2.5)
        add_card(slide6, l, t, Inches(5.6), Inches(2.2), COLOR_CARD_DARK, col)
        
        tb = slide6.shapes.add_textbox(l + Inches(0.2), t + Inches(0.15), Inches(5.2), Inches(1.9))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title
        p.font.size = Pt(15)
        p.font.bold = True
        p.font.color.rgb = col
        
        for pt in points:
            pb = tf.add_paragraph()
            pb.text = "• " + pt
            pb.font.size = Pt(11)
            pb.font.color.rgb = COLOR_WHITE
            pb.space_before = Pt(2)

    # ==================== SLIDE 7: FEDERATED LEARNING & OFFLINE EDGE ====================
    slide7 = prs.slides.add_slide(blank_slide_layout)
    bg7 = slide7.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
    bg7.fill.solid()
    bg7.fill.fore_color.rgb = COLOR_BG_DARK
    bg7.line.fill.background()
    add_header(slide7, "Architectural Resilience: Edge Offline Mode & Federated Privacy", "Architecture & Privacy")

    # Left: Offline Edge
    add_card(slide7, Inches(0.8), Inches(1.8), Inches(5.6), Inches(4.8), COLOR_CARD_DARK, COLOR_GREEN)
    tb_oe = slide7.shapes.add_textbox(Inches(1.0), Inches(2.0), Inches(5.2), Inches(4.4))
    tf_oe = tb_oe.text_frame
    tf_oe.word_wrap = True
    p = tf_oe.paragraphs[0]
    p.text = "📱 Zero-Bandwidth Offline Rural Edge"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = COLOR_GREEN
    oe_points = [
        "Runs on low-cost Android tablets, smartphones, and legacy desktop PCs.",
        "Uses browser IndexedDB and LocalStorage caching for 100% offline uptime.",
        "Rural doctors log patient visits, medicine dispensing, and local stock with zero internet.",
        "Auto-Sync Engine automatically pushes queued delta payloads upon reconnection.",
        "Conflict-free transactional batch reconciliation at backend."
    ]
    for b in oe_points:
        pb = tf_oe.add_paragraph()
        pb.text = "• " + b
        pb.font.size = Pt(12)
        pb.font.color.rgb = COLOR_WHITE
        pb.space_before = Pt(8)

    # Right: Federated Learning
    add_card(slide7, Inches(6.8), Inches(1.8), Inches(5.7), Inches(4.8), COLOR_CARD_DARK, COLOR_ORANGE)
    tb_fl = slide7.shapes.add_textbox(Inches(7.0), Inches(2.0), Inches(5.3), Inches(4.4))
    tf_fl = tb_fl.text_frame
    tf_fl.word_wrap = True
    p = tf_fl.paragraphs[0]
    p.text = "🔒 Privacy-Preserving Federated Learning"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = COLOR_ORANGE
    fl_points = [
        "100% compliant with India's DPDP Act 2023 and DISHA healthcare privacy rules.",
        "Local state nodes train ML models locally on regional clinical trends.",
        "Only mathematical model weight vectors (ΔW) transmitted to central server.",
        "Central coordinator executes Federated Averaging (FedAvg) aggregation.",
        "Zero raw patient medical records ever leave the local clinic boundary."
    ]
    for b in fl_points:
        pb = tf_fl.add_paragraph()
        pb.text = "• " + b
        pb.font.size = Pt(12)
        pb.font.color.rgb = COLOR_WHITE
        pb.space_before = Pt(8)

    # ==================== SLIDE 8: VISIBILITY & FEASIBILITY ====================
    slide8 = prs.slides.add_slide(blank_slide_layout)
    bg8 = slide8.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
    bg8.fill.solid()
    bg8.fill.fore_color.rgb = COLOR_BG_DARK
    bg8.line.fill.background()
    add_header(slide8, "Visibility, Transparency & Feasibility Analysis", "Feasibility & Governance")

    f_cards = [
        ("👁️ Real-Time Visibility", [
            "National, State, District & PHC multi-level dashboards.",
            "Live Days of Supply Remaining (DoSR) indicators.",
            "Interactive geospatial heatmaps of vulnerable clinics.",
            "Audit trail for every medicine batch & transfer order."
        ], COLOR_GREEN),
        ("⚙️ Technical Feasibility", [
            "Lightweight FastAPI backend with SQLite/PostgreSQL.",
            "Vite + React frontend running efficiently on low-end tablets.",
            "Offline-first IndexedDB delta sync requires zero extra hardware.",
            "Fast MILP convergence (<500ms for 150 PHCs)."
        ], COLOR_GREEN),
        ("💰 Economic Feasibility", [
            "100% Open Source tech stack (zero proprietary license fees).",
            "Saves crores in expired medicine waste annually.",
            "Reduces emergency commercial spot purchasing costs.",
            "Utilizes existing rural PHC computer/smartphone infrastructure."
        ], COLOR_ORANGE),
        ("📜 Regulatory & Compliance", [
            "Complies with DPDP Act 2023 & DISHA privacy standards.",
            "Human-in-the-loop: CMOs retain full authority over approvals.",
            "ABDM Health Facility Registry & M1/M2/M3 consent standards.",
            "eVIN cold-chain & HMIS health data interoperability."
        ], COLOR_ORANGE),
    ]

    for idx, (title, points, col) in enumerate(f_cards):
        col_pos = idx % 2
        row_pos = idx // 2
        l = Inches(0.8 + col_pos * 5.9)
        t = Inches(1.8 + row_pos * 2.5)
        add_card(slide8, l, t, Inches(5.6), Inches(2.2), COLOR_CARD_DARK, col)
        
        tb = slide8.shapes.add_textbox(l + Inches(0.2), t + Inches(0.15), Inches(5.2), Inches(1.9))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title
        p.font.size = Pt(15)
        p.font.bold = True
        p.font.color.rgb = col
        
        for pt in points:
            pb = tf.add_paragraph()
            pb.text = "• " + pt
            pb.font.size = Pt(11)
            pb.font.color.rgb = COLOR_WHITE
            pb.space_before = Pt(3)

    # ==================== SLIDE 9: PROJECT SCOPE & ROADMAP ====================
    slide9 = prs.slides.add_slide(blank_slide_layout)
    bg9 = slide9.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
    bg9.fill.solid()
    bg9.fill.fore_color.rgb = COLOR_BG_DARK
    bg9.line.fill.background()
    add_header(slide9, "Project Scope, Impact Metrics & Scaling Roadmap", "Scope & Impact")

    phases = [
        ("📍 Phase 1: District Pilot (Completed & Verified)", [
            "150 PHCs seeded across 15 districts (Maharashtra, Karnataka, UP).",
            "Full demand forecasting, PuLP redistribution, proximity radar & hospital suite.",
            "Offline edge sync & 11 Indian languages reactive translation engine."
        ], COLOR_GREEN),
        ("🏢 Phase 2: State-Wide Rollout (Next 6 Months)", [
            "Integration with State Medical Services Corporations (e.g. MPMSCL, KMSCL).",
            "Automated GPS drone and courier dispatch integration.",
            "Real-time eVIN cold-chain temperature sensor streaming.",
            "Hospital Resource Optimizer pilot in district civil hospitals."
        ], COLOR_ORANGE),
        ("🌐 Phase 3: National Scale (Next 12-24 Months)", [
            "Pan-India scaling across 25,000+ PHCs & 5,000+ CHCs.",
            "Full ABDM Unified Health Interface (UHI) interoperability.",
            "Cross-state emergency pharmaceutical disaster corridors.",
            "Hospital-level RL agents and cross-hospital federated learning."
        ], COLOR_WHITE),
    ]

    for idx, (title, points, col) in enumerate(phases):
        l = Inches(0.8)
        t = Inches(1.8 + idx * 1.65)
        add_card(slide9, l, t, Inches(11.7), Inches(1.45), COLOR_CARD_DARK, col)
        
        tb = slide9.shapes.add_textbox(l + Inches(0.25), t + Inches(0.12), Inches(11.2), Inches(1.2))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title
        p.font.size = Pt(15)
        p.font.bold = True
        p.font.color.rgb = col
        
        for pt in points:
            pb = tf.add_paragraph()
            pb.text = "• " + pt
            pb.font.size = Pt(11)
            pb.font.color.rgb = COLOR_WHITE
            pb.space_before = Pt(2)

    # ==================== SLIDE 10: TECH STACK & ARCHITECTURE ====================
    slide10 = prs.slides.add_slide(blank_slide_layout)
    bg10 = slide10.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
    bg10.fill.solid()
    bg10.fill.fore_color.rgb = COLOR_BG_DARK
    bg10.line.fill.background()
    add_header(slide10, "Full-Stack Technology Architecture & Verification", "Technology Stack")

    tech_boxes = [
        ("🎨 Frontend Tier", ["React 18 + Vite SPA", "Clean Glassmorphism UI", "Lucide Icons + Leaflet Maps", "11 Regional Languages i18n", "PortalSidebar & Guide Banners"], COLOR_GREEN),
        ("⚙️ Backend Core", ["FastAPI (Python 3.10+)", "SQLAlchemy ORM + SQLite/PG", "Pydantic Request Schemas", "Uvicorn Async Worker", "25+ REST API Endpoints"], COLOR_GREEN),
        ("🧠 AI & Optimization", ["PuLP MILP Linear Optimizer", "Google OR-Tools CP-SAT", "Prophet + XGBoost Demand Models", "Haversine Geospatial Vectors", "Flower-Compatible FedAvg"], COLOR_ORANGE),
        ("📦 Edge & Standards", ["IndexedDB / LocalStorage Sync", "ABDM Facility Registry M1-M3", "eVIN IoT Cold-Chain Ingestion", "HMIS Disease Data Ingestion", "5-Phase System Verification Suite"], COLOR_ORANGE)
    ]

    for idx, (title, items, col) in enumerate(tech_boxes):
        col_pos = idx % 2
        row_pos = idx // 2
        l = Inches(0.8 + col_pos * 5.9)
        t = Inches(1.8 + row_pos * 2.5)
        add_card(slide10, l, t, Inches(5.6), Inches(2.2), COLOR_CARD_DARK, col)
        
        tb = slide10.shapes.add_textbox(l + Inches(0.2), t + Inches(0.15), Inches(5.2), Inches(1.9))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title
        p.font.size = Pt(15)
        p.font.bold = True
        p.font.color.rgb = col
        
        for it in items:
            pb = tf.add_paragraph()
            pb.text = "• " + it
            pb.font.size = Pt(11)
            pb.font.color.rgb = COLOR_WHITE
            pb.space_before = Pt(2)

    # ==================== SLIDE 11: SUMMARY & SOURCE LINKS ====================
    slide11 = prs.slides.add_slide(blank_slide_layout)
    bg11 = slide11.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
    bg11.fill.solid()
    bg11.fill.fore_color.rgb = COLOR_BG_DARK
    bg11.line.fill.background()
    add_header(slide11, "Project Links, Source Code & Development Team", "Conclusion & Demo")

    # Team Box
    add_card(slide11, Inches(0.8), Inches(1.8), Inches(5.6), Inches(4.8), COLOR_CARD_DARK, COLOR_GREEN)
    tb_t = slide11.shapes.add_textbox(Inches(1.0), Inches(2.0), Inches(5.2), Inches(4.4))
    tf_t = tb_t.text_frame
    tf_t.word_wrap = True
    p = tf_t.paragraphs[0]
    p.text = "👥 Core Development Team"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = COLOR_GREEN

    team = [
        ("Rudra Pratap Chaurasiya", "Lead Full Stack AI Architecture & ML Engines", "CSJMU Kanpur")
    ]
    for name, role, college in team:
        pt = tf_t.add_paragraph()
        pt.text = f"• {name} ({college})"
        pt.font.size = Pt(13)
        pt.font.bold = True
        pt.font.color.rgb = COLOR_WHITE
        pt.space_before = Pt(8)
        
        pr = tf_t.add_paragraph()
        pr.text = f"  Role: {role}"
        pr.font.size = Pt(11)
        pr.font.color.rgb = COLOR_MUTED

    # Source Links Box
    add_card(slide11, Inches(6.8), Inches(1.8), Inches(5.7), Inches(4.8), COLOR_CARD_DARK, COLOR_ORANGE)
    tb_s = slide11.shapes.add_textbox(Inches(7.0), Inches(2.0), Inches(5.3), Inches(4.4))
    tf_s = tb_s.text_frame
    tf_s.word_wrap = True
    p = tf_s.paragraphs[0]
    p.text = "🔗 Live Demonstration Portals & Links"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = COLOR_ORANGE

    links = [
        ("GitHub Repository", "https://github.com/rudraa0604/Swasthya-Setu-AI"),
        ("Local Web App", "http://localhost:3000"),
        ("Backend FastAPI Docs", "http://localhost:8000/docs"),
        ("National Overwatch Portal", "http://localhost:3000/#/portal/national"),
        ("Hospital Optimizer Suite", "http://localhost:3000/#/portal/hospital"),
        ("AI Route & Fleet Optimizer", "http://localhost:3000/#/portal/routes"),
        ("District Health Officer Portal", "http://localhost:3000/#/portal/district"),
        ("Rural PHC Edge Terminal", "http://localhost:3000/#/portal/edge"),
        ("Developer / Admin Sandbox", "http://localhost:3000/#/portal/dev")
    ]
    for label, url in links:
        pl = tf_s.add_paragraph()
        pl.text = f"• {label}:"
        pl.font.size = Pt(10)
        pl.font.bold = True
        pl.font.color.rgb = COLOR_WHITE
        pl.space_before = Pt(3)

        pu = tf_s.add_paragraph()
        pu.text = f"  {url}"
        pu.font.size = Pt(9)
        pu.font.color.rgb = COLOR_GREEN

    output_path = os.path.join(os.getcwd(), "SwasthyaSetu_AI_Presentation.pptx")
    prs.save(output_path)
    print(f"Presentation successfully saved to: {output_path}")

if __name__ == "__main__":
    create_presentation()
