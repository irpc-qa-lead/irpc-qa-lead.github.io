/**
 * Global Scripts for EN_SmartApp Portal
 * Handles navigation, user session context, and basic API setup.
 */

// Configuration
const APP_CONFIG = {
    appName: "EN_SmartApp",
    version: "1.0.0",
    // Replace with your actual Google Apps Script Web App URL
    // apiEndpoint: "https://script.google.com/macros/s/AKfycbx6mfTwzs5Fx2EHUAyvomFnq_F3pRjkKro5b0EB2tGLbpYJt6ncIypnVwnmNkX7Cn-m/exec",
    apiEndpoint: "https://script.google.com/macros/s/AKfycbwYcvrIKyjmN50bZ9g8lDy0dLuozA5J9pzuv-bIX4ReUCcAzJeYKgHvfhdaFK6N1IkQ/exec"
};

// I18N Translations
const TRANSLATIONS = {
    en: {
        hero_title: "Engineering Workspace",
        hero_desc: "Select a module below to begin your calculation workflow.",
        app_land_title: "Land Area Calculator",
        app_land_desc: "Calculate total land area from survey boundary points. Supports GeoJSON export.",
        app_launch: "Launch Module",
        app_piperack_title: "Pipe Rack Loads",
        app_piperack_desc: "Mechanical structural analysis for standard pipe racks. Load distribution calculator.",
        app_coming_soon: "Coming Soon",
        app_utils_title: "Quick Utils",
        app_utils_desc: "Standard engineering unit conversions (Pressure, Temperature, Length) and constants.",
        app_open_tools: "Open Tools",
        // Calculator
        calc_survey_coords: "Survey Coordinates (X, Y)",
        calc_x_coord: "X Coordinate (m)",
        calc_y_coord: "Y Coordinate (m)",
        calc_add_point: "Add Point",
        calc_current_points: "Current Points",
        calc_clear_all: "Clear All",
        calc_no_points: "No points added yet.",
        calc_results: "Results",
        calc_area_desc: "Area calculated using Shoelace Formula.",
        calc_total_area: "Total Area",
        calc_perimeter: "Perimeter",
        calc_save: "Save Calculation",
        calc_guidance: "Enter points in consecutive order (clockwise or counter-clockwise) to ensure accurate area calculation.",
        // Land App v2.0
        calc_module_subtitle: "Civil Module 01",
        calc_job_list: "Job List",
        calc_select_year: "Select Year...",
        calc_new_job: "+ New Job",
        calc_project_info: "Project Info",
        calc_job_id: "Job ID",
        calc_job_name: "Job Name",
        calc_auto_gen: "Auto-generated",
        calc_enter_job_name: "Enter Job Name",
        calc_save_new: "Save New",
        calc_update: "Update",
        calc_cancel: "Cancel",
        calc_data_format: "Data Format (Auto-Detect)",
        calc_import_csv: "Import CSV",
        calc_mode_ne: "1. Standard Coords (Northing, Easting)",
        calc_mode_gps: "2. Google Maps Coords (Lat, Lon)",
        calc_mode_dmd: "3. DMD Diffs (Latitude, Departure)",
        calc_survey_data: "Survey Data Table",
        calc_reset: "Reset",
        calc_add_row: "+ Add Row",
        calc_set_elevation: "Set Elevation",
        calc_design_level: "Design Level (m)",
        calc_calculate: "Calculate",
        calc_plot_2d: "2D Plot Plan",
        calc_print_report: "Print Report",
        calc_waiting_calc: "Waiting for calculation...",
        calc_dmd_analysis: "DMD Analysis Table",
        calc_toggle_visibility: "Show/Hide",
        calc_dmd_pt: "Point",
        calc_dmd_lat: "Lat (Diff N)",
        calc_dmd_dep: "Dep (Diff E)",
        calc_dmd_val: "DMD",
        calc_dmd_da: "Double Area",
        calc_dmd_total_2a: "Total 2A:",
        calc_area_title: "Area",
        calc_sqm: "sq.m.",
        calc_volume_title: "Volume",
        calc_cbm: "cu.m.",
        calc_hint_ne: "* Enter N (North) and E (East) coordinates in meters",
        calc_hint_gps: "* Enter Google Maps coordinates (Decimal) e.g. 12.6843, 101.2345",
        calc_hint_dmd: "* Enter differences from previous point (Lat = Diff N, Dep = Diff E)",
        calc_fill: "FILL",
        calc_cut: "CUT",
        calc_on_grade: "On Grade",
        calc_imported_success: "✅ Import Success",
    },
    th: {
        hero_title: "พื้นที่การทำงานวิศวกรรม",
        hero_desc: "เลือกโมดูลด้านล่างเพื่อเริ่มกระบวนการคำนวณของคุณ",
        app_land_title: "คำนวณพื้นที่ที่ดิน",
        app_land_desc: "คำนวณพื้นที่รวมจากจุดสำรวจขอบเขต รองรับการส่งออกไฟล์ GeoJSON",
        app_launch: "เปิดใช้งานโมดูล",
        app_piperack_title: "โหลด Pipe Rack",
        app_piperack_desc: "การวิเคราะห์โครงสร้างทางกลสำหรับ Pipe Rack มาตรฐาน เครื่องคำนวณการกระจายโหลด",
        app_coming_soon: "เร็วๆ นี้",
        app_utils_title: "เครื่องมือด่วน",
        app_utils_desc: "การแปลงหน่วยวิศวกรรมมาตรฐาน (ความดัน, อุณหภูมิ, ความยาว) และค่าคงที่",
        app_open_tools: "เปิดเครื่องมือ",
        // Calculator
        calc_survey_coords: "พิกัดสำรวจ (X, Y)",
        calc_x_coord: "พิกัด X (ม.)",
        calc_y_coord: "พิกัด Y (ม.)",
        calc_add_point: "เพิ่มจุด",
        calc_current_points: "จุดปัจจุบัน",
        calc_clear_all: "ล้างทั้งหมด",
        calc_no_points: "ยังไม่มีจุดที่เพิ่ม",
        calc_results: "ผลลัพธ์",
        calc_area_desc: "คำนวณพื้นที่โดยใช้สูตร Shoelace",
        calc_total_area: "พื้นที่รวม",
        calc_perimeter: "เส้นรอบรูป",
        calc_save: "บันทึกการคำนวณ",
        calc_guidance: "ป้อนจุดตามลำดับต่อเนื่อง (ตามเข็มหรือทวนเข็มนาฬิกา) เพื่อให้แน่ใจว่าการคำนวณพื้นที่ถูกต้อง",
        // Land App v2.0
        calc_module_subtitle: "โมดูลโยธา 01",
        calc_job_list: "รายการงาน (Job List)",
        calc_select_year: "เลือกปีข้อมูล...",
        calc_new_job: "+ งานใหม่",
        calc_project_info: "ข้อมูลโครงการ (Project Info)",
        calc_job_id: "รหัสงาน (Job ID)",
        calc_job_name: "ชื่อโครงการ (Job Name)",
        calc_auto_gen: "สร้างอัตโนมัติ",
        calc_enter_job_name: "ระบุชื่อโครงการ",
        calc_save_new: "บันทึกใหม่",
        calc_update: "อัปเดต",
        calc_cancel: "ยกเลิก",
        calc_data_format: "รูปแบบข้อมูล (Auto-Detect)",
        calc_import_csv: "นำเข้า CSV",
        calc_mode_ne: "1. พิกัดมาตรฐาน (Northing, Easting)",
        calc_mode_gps: "2. พิกัด Google Maps (Lat, Lon)",
        calc_mode_dmd: "3. ค่าผลต่าง DMD (Latitude, Departure)",
        calc_survey_data: "ตารางข้อมูล (Survey Data)",
        calc_reset: "รีเซ็ต",
        calc_add_row: "+ เพิ่มแถว",
        calc_set_elevation: "กำหนดระดับ (Elevation)",
        calc_design_level: "ระดับออกแบบ (Design Level)",
        calc_calculate: "คำนวณ (Calculate)",
        calc_plot_2d: "แผนผังรูปแปลง (2D Plot)",
        calc_print_report: "พิมพ์รายงาน",
        calc_waiting_calc: "รอการคำนวณ...",
        calc_dmd_analysis: "ตาราง DMD Analysis",
        calc_toggle_visibility: "ซ่อน/แสดง",
        calc_dmd_pt: "จุด (Point)",
        calc_dmd_lat: "Lat (Diff N)",
        calc_dmd_dep: "Dep (Diff E)",
        calc_dmd_val: "DMD",
        calc_dmd_da: "Double Area",
        calc_dmd_total_2a: "รวม 2A:",
        calc_area_title: "พื้นที่ (Area)",
        calc_sqm: "ตร.ม.",
        calc_volume_title: "ปริมาตรดิน (Volume)",
        calc_cbm: "ลบ.ม.",
        calc_hint_ne: "* ใส่ค่าพิกัด N (North) และ E (East) เป็นหน่วยเมตร",
        calc_hint_gps: "* ใส่ค่าพิกัดจาก Google Maps (ทศนิยม) เช่น 12.6843, 101.2345",
        calc_hint_dmd: "* ใส่ค่าผลต่างจากจุดก่อนหน้า (Latitude = Diff N, Departure = Diff E)",
        calc_fill: "ต้องถม (FILL)",
        calc_cut: "ต้องขุด (CUT)",
        calc_on_grade: "ระดับเท่ากัน (On Grade)",
        calc_imported_success: "✅ นำเข้าข้อมูลสำเร็จ",
    }
};

// State Management
const STATE = {
    user: null,
    activeProject: null,
    lang: localStorage.getItem('EN_SmartApp_Lang') || 'en' // Default Language
};

// DOM Ready
document.addEventListener('DOMContentLoaded', () => {
    initLanguage(); // Initialize Language
    initIdentity();
    // initUserInterface(); // Removed: functionality merged into initIdentity/updateUserUI
});

/**
 * -------------------------------------------------------------
 *  0. I18N SYSTEM
 * -------------------------------------------------------------
 */
function initLanguage() {
    console.log(`[I18N] Initializing Language: ${STATE.lang}`);
    updateLanguageUI();
}

function switchLanguage(lang) {
    if (STATE.lang === lang) return;

    STATE.lang = lang;
    localStorage.setItem('EN_SmartApp_Lang', lang);
    console.log(`[I18N] Switched to: ${lang}`);

    updateLanguageUI();

    // Dispatch event for local apps to handle dynamic content
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang: lang } }));
}

function updateLanguageUI() {
    const lang = STATE['lang'];
    const texts = TRANSLATIONS[lang];

    // 1. Update Texts
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (texts[key]) {
            el.textContent = texts[key];
        }
    });

    // 2. Update Buttons Active State
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('onclick').includes(`'${lang}'`)) {
            btn.classList.add('active');
        }
    });
}

/**
 * -------------------------------------------------------------
 *  1. USER IDENTITY SYSTEM (Hybrid: Local Windows + Google Sheets)
 * -------------------------------------------------------------
 */

async function initIdentity() {
    // Optimization: Check Cache First
    const CACHE_KEY = 'EN_SmartApp_UserProfile_v5';
    const CACHE_EXPIRY = 60 * 60 * 1000; // 1 Hour

    try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
            const { timestamp, data } = JSON.parse(cached);
            if (Date.now() - timestamp < CACHE_EXPIRY) {
                console.log("[Identity] Loaded from Cache (Skipping API)");
                STATE.user = data;
                updateUserUI();
                return;
            }
        }
    } catch (e) {
        console.warn("[Identity] Cache Error:", e);
    }

    let userId = null;
    let localUserData = null;

    // STEP A: Try to get Windows User from Local Node Server (If running via 'node server.js')
    try {
        // We must fetch from absolute URL because we might be on port 5173 (Vite) attempting to reach port 3000
        const localRes = await fetch('http://localhost:3000/api/user');
        if (localRes.ok) {
            localUserData = await localRes.json();
            userId = localUserData.username; // Use Windows Login ID
            console.log(`[Identity] Detected Windows User: ${userId} (${localUserData.fullName})`);

            // If local avatar is provided, use it
            if (localUserData.avatar) {
                console.log(`[Identity] Using Local Avatar: ${localUserData.avatar}`);
            }
        }
    } catch (e) {
        // Not running on local server, continue...
        console.log("[Identity] Local server API not found (Static Mode).");
    }

    // STEP B: Fallback to URL Param or LocalStorage
    if (!userId) {
        const urlParams = new URLSearchParams(window.location.search);
        userId = urlParams.get('u') || localStorage.getItem('EN_SmartApp_UserId');
    }

    // Default Fallback
    if (!userId) {
        userId = "GUEST";
    }

    // Save for next time
    localStorage.setItem('EN_SmartApp_UserId', userId);

    console.log(`[Identity] Authenticating User ID: ${userId}...`);

    try {
        // STEP C: Call GAS API to get User Details (Role, Avatar)
        const response = await fetch(`${APP_CONFIG.apiEndpoint}?action=GET_USER&id=${userId}&t=${Date.now()}`);

        if (!response.ok) throw new Error("API call failed");

        const result = await response.json();

        if (result.status === 'success') {
            // Found User in Google Sheets
            STATE.user = result.data;

            // Optional: Override Name with Windows Full Name if available and preferred
            if (localUserData && localUserData.fullName) {
                STATE.user.name = localUserData.fullName;
            }
            // Force Local Avatar if available (Override GAS)
            if (localUserData && localUserData.avatar) {
                STATE.user.avatar = localUserData.avatar;
            }

            console.log(`[Identity] Welcome, ${STATE.user.name}`);
        } else {
            // Not Found in Sheets -> Construct a profile from Local Windows Data
            console.warn(`[Identity] User ID '${userId}' not found in DB.`);

            STATE.user = {
                id: userId,
                name: localUserData ? localUserData.fullName : `User ${userId}`,
                role: "Engineer (Unregistered)",
                avatar: (localUserData && localUserData.avatar) ? localUserData.avatar : `https://ui-avatars.com/api/?name=${userId}&background=2D3748&color=fff`
            };
        }

    } catch (error) {
        console.error("[Identity] DB Lookup Failed:", error);

        // Scenario: Local Server gave us a Name, but DB is unreachable/not set up.
        // We should Trust the Local Server's authentication.
        if (localUserData) {
            STATE.user = {
                id: userId,
                name: localUserData.fullName,
                role: "Engineer (Local)",
                avatar: localUserData.avatar || `https://ui-avatars.com/api/?name=${localUserData.fullName}&background=2D3748&color=fff`
            };
            console.log(`[Identity] Using Local Profile: ${STATE.user.name}`);
        } else {
            // Authentic Offline / Error Fallback
            STATE.user = {
                name: "Offline User",
                role: "No Connection",
                avatar: "https://ui-avatars.com/api/?name=Offline&background=red&color=fff"
            };
        }
    }

    // Cache the resolved user profile
    if (STATE.user && STATE.user.name !== "Offline User") {
        localStorage.setItem(CACHE_KEY, JSON.stringify({
            timestamp: Date.now(),
            data: STATE.user
        }));
    }

    // D. Update UI
    updateUserUI();
}

/**
 * Update the Header UI with User Info
 */
function updateUserUI() {
    // Selectors match the new structure
    const userNameEl = document.querySelector('.user-name');
    const userRoleEl = document.querySelector('.user-role');
    const userAvatarEl = document.querySelector('.user-avatar-large'); // Specific class for new large avatar

    if (STATE.user) {
        if (userNameEl) userNameEl.textContent = STATE.user.name;

        // Show Position (Role) - e.g. "Manager (Admin)"
        if (userRoleEl) {
            const pos = STATE.user.position || "";
            const role = STATE.user.role || "";

            if (pos && role) {
                userRoleEl.textContent = `${pos} (${role})`;
            } else {
                userRoleEl.textContent = pos || role || "Engineer";
            }
        }

        if (userAvatarEl) {
            userAvatarEl.src = STATE.user.avatar;
            // Handle error (broken image link) by showing default
            userAvatarEl.onerror = function () {
                this.src = `https://ui-avatars.com/api/?name=${STATE.user.name}&background=random`
            };
        }
    }
}

/**
 * -------------------------------------------------------------
 *  2. API UTILITIES (Shared)
 * -------------------------------------------------------------
 */

/**
 * Generic Fetch Wrapper for GAS
 */
async function callGAS(action, payload) {
    console.log(`[API] calling ${action}...`);

    // GAS Web App only accepts POST for complex JSON, or GET for simple queries.
    // Enhanced Logic: Use GET for 'GET_USER' to be safe with CORS
    try {
        let response;
        if (action === 'GET_USER') {
            const userId = payload.id;
            response = await fetch(`${APP_CONFIG.apiEndpoint}?action=GET_USER&id=${userId}&t=${Date.now()}`);
        } else {
            response = await fetch(APP_CONFIG.apiEndpoint, {
                method: "POST",
                mode: "no-cors",
                headers: { "Content-Type": "text/plain;charset=utf-8" },
                body: JSON.stringify({ action: action, ...payload })
            });
        }

        const data = await response.json();
        return data;

    } catch (e) {
        console.error(e);
        return { status: 'error', message: e.toString() };
    }
}

/**
 * Utility: Format number
 */
function formatEngineering(num, units = '') {
    if (typeof num !== 'number') return num;
    return `${num.toLocaleString('en-US', { maximumFractionDigits: 2 })} ${units}`;
}
