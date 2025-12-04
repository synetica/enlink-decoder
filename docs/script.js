"use strict";
function decode_base64() {
    const tb = document.getElementById("encoded-base64");
    let base64_string = tb.value;
    let hex_string = base64ToHex(base64_string);
    if (hex_string !== null) {
        console.log(hex_string);
        let obj = decode_hex_string(hex_string);
        const out = document.getElementById("output-base64");
        if (obj !== null) {
            out.value = obj;
        } else {
            out.value = "Error!";
        }
    }
}
function base64ToHex(str) {
    try {
        const raw = atob(str);
        let result = "";
        for (let i = 0; i < raw.length; i++) {
            const hex = raw.charCodeAt(i).toString(16);
            result += hex.length === 2 ? hex : "0" + hex;
        }
        return result.toUpperCase();
    } catch (err) {
        document.getElementById("output-base64").value = err.message;
        return null;
    }
}

function decode_bytes() {
    const tb = document.getElementById("encoded-bytes");
    let hex_string = tb.value;
    let obj = decode_hex_string(hex_string);
    const out = document.getElementById("output-bytes");
    if (obj !== null) {
        out.value = obj;
    } else {
        out.value = "Error!";
    }
}
function decode_hex_string(hex_string) {
    function hexStringToByte(hexString) {
        let result = [];
        for (let i = 0; i < hexString.length; i += 2) {
            result.push(parseInt(hexString.substr(i, 2), 16));
        }
        return result;
    }
    let no_gaps = hex_string.replace(/\s+/g, "");
    let p = hexStringToByte(no_gaps);
    let msg = {};
    msg.payload = p;
    let reply = js_decoder(msg);
    if (!reply.human_readable) {
        return reply;
    } else {
        return reply.human_readable;
    }
}

function js_decoder(msg) {
    // Used for decoding enLink Uplink LoRa Messages
    // --------------------------------------------------------------------------------------
    // 04 Dec 2025 (FW Ver:7.19)
    // 24 Apr 2025 Includes Temperature fix
    // --------------------------------------------------------------------------------------
    // https://github.com/synetica/enlink-decoder

    if (msg.payload) {
        if (msg.payload.length === 0) {
            return "Error: there is no data to decode";
        }
    } else {
        return "Error: no data to decode";
    }
    // --------------------------------------------------------------------------------------
    // Telemetry data from all enLink Models
    const ENLINK_TEMP = 0x01;
    const ENLINK_RH = 0x02;
    const ENLINK_LUX = 0x03;
    const ENLINK_PRESSURE = 0x04;
    const ENLINK_VOC_IAQ = 0x05;
    const ENLINK_O2PERC = 0x06;
    const ENLINK_CO = 0x07;
    const ENLINK_CO2 = 0x08;
    const ENLINK_OZONE = 0x09;
    const ENLINK_POLLUTANTS = 0x0a;
    const ENLINK_PM25 = 0x0b;
    const ENLINK_PM10 = 0x0c;
    const ENLINK_H2S = 0x0d;
    const ENLINK_COUNTER = 0x0e;
    const ENLINK_MB_EXCEPTION = 0x0f;
    const ENLINK_MB_INTERVAL = 0x10;
    const ENLINK_MB_CUMULATIVE = 0x11;
    const ENLINK_BVOC = 0x12;
    const ENLINK_DETECTION_COUNT = 0x13;
    const ENLINK_OCC_TIME = 0x14;
    const ENLINK_COS_STATUS = 0x15;
    const ENLINK_DETECTION_STATUS = 0x16;
    const ENLINK_TEMP_PROBE1 = 0x17;
    const ENLINK_TEMP_PROBE2 = 0x18;
    const ENLINK_TEMP_PROBE3 = 0x19;
    const ENLINK_TEMP_PROBE_IN_BAND_DURATION_S_1 = 0x1a;
    const ENLINK_TEMP_PROBE_IN_BAND_DURATION_S_2 = 0x1b;
    const ENLINK_TEMP_PROBE_IN_BAND_DURATION_S_3 = 0x1c;
    const ENLINK_TEMP_PROBE_IN_BAND_ALARM_COUNT_1 = 0x1d;
    const ENLINK_TEMP_PROBE_IN_BAND_ALARM_COUNT_2 = 0x1e;
    const ENLINK_TEMP_PROBE_IN_BAND_ALARM_COUNT_3 = 0x1f;
    const ENLINK_TEMP_PROBE_LOW_DURATION_S_1 = 0x20;
    const ENLINK_TEMP_PROBE_LOW_DURATION_S_2 = 0x21;
    const ENLINK_TEMP_PROBE_LOW_DURATION_S_3 = 0x22;
    const ENLINK_TEMP_PROBE_LOW_ALARM_COUNT_1 = 0x23;
    const ENLINK_TEMP_PROBE_LOW_ALARM_COUNT_2 = 0x24;
    const ENLINK_TEMP_PROBE_LOW_ALARM_COUNT_3 = 0x25;
    const ENLINK_TEMP_PROBE_HIGH_DURATION_S_1 = 0x26;
    const ENLINK_TEMP_PROBE_HIGH_DURATION_S_2 = 0x27;
    const ENLINK_TEMP_PROBE_HIGH_DURATION_S_3 = 0x28;
    const ENLINK_TEMP_PROBE_HIGH_ALARM_COUNT_1 = 0x29;
    const ENLINK_TEMP_PROBE_HIGH_ALARM_COUNT_2 = 0x2a;
    const ENLINK_TEMP_PROBE_HIGH_ALARM_COUNT_3 = 0x2b;
    const ENLINK_DIFF_PRESSURE = 0x2c;
    const ENLINK_AIR_FLOW = 0x2d;
    const ENLINK_VOLTAGE = 0x2e;
    const ENLINK_CURRENT = 0x2f;
    const ENLINK_RESISTANCE = 0x30;
    const ENLINK_LEAK_DETECT_EVT = 0x31;
    const ENLINK_GP_PRESSURE_PA = 0x32;
    const ENLINK_GP_TEMPERATURE = 0x33;
    const ENLINK_LL_DEPTH_MM = 0x34;
    const ENLINK_LL_TEMPERATURE = 0x35;

    const ENLINK_MIN_TVOC = 0x36;
    const ENLINK_AVG_TVOC = 0x37;
    const ENLINK_MAX_TVOC = 0x38;
    const ENLINK_ETOH = 0x39;
    const ENLINK_TVOC_IAQ = 0x3a;
    const ENLINK_HIRES_RH = 0x3b;
    const ENLINK_COMP_TEMP_C = 0x3c;
    const ENLINK_COMP_RH = 0x3d;

    const ENLINK_CO2E = 0x3f;

    const ENLINK_SOUND_MIN = 0x50;
    const ENLINK_SOUND_AVG = 0x51;
    const ENLINK_SOUND_MAX = 0x52;
    const ENLINK_NO = 0x53;
    const ENLINK_NO2 = 0x54;
    const ENLINK_NO2_20 = 0x55;
    const ENLINK_SO2 = 0x56;

    // Particulate Matter (Advanced Data)
    const ENLINK_MC_PM1_0 = 0x57;
    const ENLINK_MC_PM2_5 = 0x58;
    const ENLINK_MC_PM4_0 = 0x59;
    const ENLINK_MC_PM10_0 = 0x5a;
    const ENLINK_NC_PM0_5 = 0x5b;
    const ENLINK_NC_PM1_0 = 0x5c;
    const ENLINK_NC_PM2_5 = 0x5d;
    const ENLINK_NC_PM4_0 = 0x5e;
    const ENLINK_NC_PM10_0 = 0x5f;
    const ENLINK_PM_TPS = 0x60;

    const ENLINK_GAS_PPB = 0x61;
    const ENLINK_GAS_UGM3 = 0x66;

    const ENLINK_CRN_THK = 0x62;
    const ENLINK_CRN_MIN_THK = 0x63;
    const ENLINK_CRN_MAX_THK = 0x64;
    const ENLINK_CRN_PERC = 0x65;

    const ENLINK_FAST_AQI = 0x67;
    const ENLINK_EPA_AQI = 0x68;

    // More Particulate Matter
    const ENLINK_MC_PM0_1 = 0x69;
    const ENLINK_MC_PM0_3 = 0x6A;
    const ENLINK_MC_PM0_5 = 0x6B;
    const ENLINK_MC_PM5_0 = 0x6C;

    const ENLINK_NC_PM0_1 = 0x6D;
    const ENLINK_NC_PM0_3 = 0x6E;
    const ENLINK_NC_PM5_0 = 0x6F;

    const ENLINK_DE_EVENT = 0x70;
    const ENLINK_DE_SMOKE = 0x71;
    const ENLINK_DE_VAPE = 0x72;

    const ENLINK_FGS_CYCLECOUNT = 0x73;
    const ENLINK_FGS_FLAM_GAS = 0x74;

    // Flam Gas Type Byte
    const FLAM_NO_GAS = 0x00;
    const FLAM_HYDROGEN = 0x01;
    const FLAM_HYD_MIX = 0x02;
    const FLAM_METHANE = 0x03;
    const FLAM_LIGHT = 0x04;
    const FLAM_MEDIUM = 0x05;
    const FLAM_HEAVY = 0x06;
    const FLAM_UNKNOWN_GAS = 0xFD;
    const FLAM_UNDER_RNG = 0xFE;
    const FLAM_OVER_RNG = 0xFF;

    // --------------------------------------------------------------------------------------
    // Optional KPI values that can be included in the message
    const ENLINK_CPU_TEMP_DEP = 0x40;
    const ENLINK_BATT_STATUS = 0x41;
    const ENLINK_BATT_VOLT = 0x42;
    const ENLINK_RX_RSSI = 0x43;
    const ENLINK_RX_SNR = 0x44;
    const ENLINK_RX_COUNT = 0x45;
    const ENLINK_TX_TIME = 0x46;
    const ENLINK_TX_POWER = 0x47;
    const ENLINK_TX_COUNT = 0x48;
    const ENLINK_POWER_UP_COUNT = 0x49;
    const ENLINK_USB_IN_COUNT = 0x4a;
    const ENLINK_LOGIN_OK_COUNT = 0x4b;
    const ENLINK_LOGIN_FAIL_COUNT = 0x4c;
    const ENLINK_FAN_RUN_TIME = 0x4d;
    const ENLINK_CPU_TEMP = 0x4e;
    // --------------------------------------------------------------------------------------
    // Status Message
    const ENLINK_FAULT = 0xFE;

    // --------------------------------------------------------------------------------------
    // V1 - Downlink reply message Header and ACK/NAK
    const ENLINK_HEADER = 0xa5;
    const ENLINK_ACK = 0x06;
    const ENLINK_NACK = 0x15;
    // Downlink reply message values
    const ENLINK_SET_ANTENNA_GAIN = 0x01;
    const ENLINK_SET_PUBLIC = 0x02;
    const ENLINK_SET_APPEUI = 0x05; // 8 bytes
    const ENLINK_SET_APPKEY = 0x06; // 16 bytes
    const ENLINK_SET_ADR = 0x07;
    const ENLINK_SET_DUTY_CYCLE = 0x08;
    const ENLINK_SET_MSG_ACK = 0x09;
    const ENLINK_SET_TX_PORT = 0x0a;
    const ENLINK_SET_DR_INDEX = 0x0b; // Data Rate Index 0~6
    const ENLINK_SET_TX_INDEX = 0x0c; // Data Rate Index 0~10
    const ENLINK_SET_POW_INDEX = 0x0d; // Data Rate Index 0~6
    const ENLINK_SET_RX_PORT = 0x0e;
    const ENLINK_SET_JC_INTERVAL = 0x0f;    // Join Check Interval
    const ENLINK_SET_JC_PKT_TYPE = 0x10;    // Join Check Packet Type
    const ENLINK_SET_ATI_MIN = 0x11;
    const ENLINK_SET_ATI_MAX = 0x12;
    const ENLINK_SET_FULL_PKT_MUL = 0x13;
    const ENLINK_SET_WELL_DEFAULT = 0x14;

    const ENLINK_SET_KPI_INCLUDES_DIRECT = 0x15;
    const ENLINK_SET_KPI_INCLUDES_INDEX = 0x16;

    const ENLINK_SET_LUX_SCALE = 0x20;
    const ENLINK_SET_LUX_OFFSET = 0x21;

    const ENLINK_SET_CASE_FAN_RUN_TIME = 0x22;
    const ENLINK_SET_HPM_FAN_RUN_TIME = 0x23;

    // CO2 Sensors
    const ENLINK_SET_CO2_CALIB_ENABLE = 0x24;
    const ENLINK_SET_CO2_TARGET_PPM = 0x25;
    const ENLINK_SET_CO2_KNOWN_PPM = 0x26;
    // 0x27 Sunrise CO2 Only
    const ENLINK_SET_SR_CO2_FACTORY_CALIB = 0x27;
    const ENLINK_SET_CO2_REGULAR_INTERVAL = 0x28;
    // 0x29,0x30 GSS CO2 Only
    const ENLINK_SET_GSS_CO2_OOB_LIMITS = 0x29;
    const ENLINK_SET_GSS_CO2_INIT_INTERVAL = 0x2a;

    // Set PM options
    const ENLINK_SET_PM_RUN_PERIOD = 0x2b;
    const ENLINK_SET_PM_CLEANING_PERIOD = 0x2c;

    // Set Gas Sensor options
    const ENLINK_SET_GAS_IDLE_STATE = 0x2d;
    const ENLINK_SET_GAS_PRE_DELAY = 0x2e;
    const ENLINK_SET_GAS_NUM_READS = 0x2f;
    const ENLINK_SET_GAS_READ_INT = 0x30;
    const ENLINK_SET_GAS_AGG_METHOD = 0x31;
    const ENLINK_SET_GAS_EMA_FACTOR = 0x32;
    const ENLINK_SET_GAS_TRIM_PPB = 0x33;
    const ENLINK_SET_GAS_TRIM_UGM3 = 0x34;

    // Leak Sensor options
    const ENLINK_LEAK_ALARM_MODE = 0x35;
    const ENLINK_LEAK_UPPER_ALARM = 0x36;
    const ENLINK_LEAK_UPPER_HYST = 0x37;
    const ENLINK_LEAK_LOWER_ALARM = 0x38;
    const ENLINK_LEAK_LOWER_HYST = 0x39;
    const ENLINK_LEAK_SAMPLE_TIME_S = 0x3a;
    const ENLINK_LEAK_TEST_DURATION = 0x3b;

    // Radio packet includes for VOC and Particulate sensors
    const ENLINK_BME680_PKT_INC = 0x3c;
    const ENLINK_SPS30_PKT_INC = 0x3d;
    const ENLINK_PIERA_PKT_INC = 0x3e;

    // Diff Press/ Air Flow Settings
    const ENLINK_DP_PKT_INC = 0x3f;
    const ENLINK_DP_AUTO_ZERO = 0x40;
    const ENLINK_DP_SET_DELTA = 0x41;

    // Radio packet includes for TVOC sensor
    const ENLINK_ZMOD4410_PKT_INC = 0x42;

    // Options for the Zone View e-paper
    const ENLINK_ZV_SCN_REFRESH_INT = 0x43;
    const ENLINK_ZV_DISPLAY_TOPLINE = 0x44;
    const ENLINK_ZV_DISPLAY_TEMP_UNITS = 0x45;
    const ENLINK_ZV_DISPLAY_COMF_ICON_TYPE = 0x46;
    const ENLINK_ZV_DISPLAY_COMF_LOCN = 0x47;
    const ENLINK_ZV_COMF_LOGIC = 0x48;
    const ENLINK_ZV_DISPLAY_COMF_ICON_STATUS = 0x49;
    const ENLINK_ZV_INT_LOGIC_LOW_THRESH = 0x4a;
    const ENLINK_ZV_INT_LOGIC_HIGH_THRESH = 0x4b;
    const ENLINK_ZV_HELP_SCN_ENABLE = 0x4c;

    const ENLINK_ZV_SET_TEXT = 0xd0;
    const ENLINK_ZV_SET_TEXT_TO_DEFAULT = 0xd1;

    const ENLINK_ENABLE_Z45 = 0x50;
    const ENLINK_HUMIDITY_TX_RES = 0x51;
    const ENLINK_Z45_TRIG_CLEAN = 0x52;
    const ENLINK_Z44_TRIG_CLEAN = 0x53;

    const ENLINK_HS_SET_THRESH_P = 0x54;
    const ENLINK_HS_SET_HYST_P = 0x55;
    const ENLINK_HS_SET_INACTIVITY = 0x56;
    const ENLINK_HS_ZERO_C_AND_D = 0x57;
    const ENLINK_HS_RESET = 0x58;

    const ENLINK_FGS_RESET_COUNTERS = 0x59;

    const ENLINK_REBOOT = 0xff;

    // --------------------------------------------------------------------------------------

    // Convert binary value bit to Signed 16 bit
    function S16(bin) {
        let num = bin & 0xffff;
        if (0x8000 & num) num = -(0x010000 - num);
        return num;
    }
    // Convert binary value bit to Signed 8 bit
    function S8(bin) {
        let num = bin & 0xff;
        if (0x80 & num) num = -(0x0100 - num);
        return num;
    }
    // Useful conversion functions
    // S16 -> U16
    function U16(ival) {
        if (isNaN(ival) === false) {
            if (ival < 0) {
                ival = ival + 65536;
            }
        }
        return ival;
    }
    // S32 -> U32 convertIntToDWord
    function U32(ival) {
        if (isNaN(ival) === false) {
            if (ival < 0) {
                ival = ival + 4294967296;
            }
        }
        return ival;
    }
    // U32 -> S32 convertDWordToInt
    function S32(ival) {
        if (isNaN(ival) === false) {
            if (ival > 2147483647) {
                ival = ival - 4294967296;
            }
        }
        return ival;
    }
    // Convert byte array to HEX string
    function bytesToHex(bytes) {
        let result = "";
        for (let i = 0; i < bytes.length; i += 1) {
            result += ("0" + bytes[i].toString(16).toUpperCase() + " ").slice(-3);
        }
        return result.trim();
    }
    // Convert byte array to HEX string highlighting the byte in error
    function bytesToHexError(bytes, err) {
        let result = "";
        for (let i = 0; i < bytes.length; i += 1) {
            if (i == err) {
                result += '[' + ('0' + (bytes[i]).toString(16).toUpperCase()).slice(-2) + '] ';
            } else {
                result += ('0' + (bytes[i]).toString(16).toUpperCase() + ' ').slice(-3);
            }
        }
        return result.trim();
    }
    // Convert 4 IEEE754 bytes
    function fromF32(byte0, byte1, byte2, byte3) {
        let bits = (byte0 << 24) | (byte1 << 16) | (byte2 << 8) | byte3;
        let sign = bits >>> 31 === 0 ? 1.0 : -1.0;
        let e = (bits >>> 23) & 0xff;
        let m = e === 0 ? (bits & 0x7fffff) << 1 : (bits & 0x7fffff) | 0x800000;
        let f = sign * m * Math.pow(2, e - 150);
        return f;
    }
    // Simplify use of data conversions
    function f32_1(bytes, index) {
        return fromF32(bytes[index + 1], bytes[index + 2], bytes[index + 3], bytes[index + 4]);
    }
    function f32_2(bytes, index) {
        return fromF32(bytes[index + 2], bytes[index + 3], bytes[index + 4], bytes[index + 5]);
    }
    function u16_1(bytes, index) {
        return U16((bytes[index + 1] << 8) | (bytes[index + 2]));
    }
    function u32_1(bytes, index) {
        return U32((bytes[index + 1] << 24) | (bytes[index + 2] << 16) | (bytes[index + 3] << 8) | (bytes[index + 4]));
    }
    function u32_2(bytes, index) {
        return U32((bytes[index + 2] << 24) | (bytes[index + 3] << 16) | (bytes[index + 4] << 8) | (bytes[index + 5]));
    }
    function s32_1(bytes, index) {
        return S32((bytes[index + 1] << 24) | (bytes[index + 2] << 16) | (bytes[index + 3] << 8) | (bytes[index + 4]));
    }
    // Format float numbers with decimal places
    function ff32_1(data, i, dp) {
        return Number(f32_1(data, i).toFixed(dp));
    }
    function ff32_2(data, i, dp) {
        return Number(f32_2(data, i).toFixed(dp));
    }
    // Return gas name from gas type byte
    function GetGasName(gas_type) {
        switch (gas_type) {
            case 0x17:
                return "Formaldehyde"; //HCHO/CH2O
            case 0x18:
                return "Volatile Organic Compounds";
            case 0x19:
                return "Carbon Monoxide"; //CO
            case 0x1a:
                return "Chlorine"; //Cl2
            case 0x1b:
                return "Hydrogen"; //H2
            case 0x1c:
                return "Hydrogen Sulphide"; //H2S
            case 0x1d:
                return "Hydrogen Chloride"; //HCl
            case 0x1e:
                return "Hydrogen Cyanide"; //HCN
            case 0x1f:
                return "Hydrogen Fluoride"; //HF
            case 0x20:
                return "Ammonia"; //NH3
            case 0x21:
                return "Nitrogen Dioxide"; //NO2
            case 0x22:
                return "Oxygen"; //O2
            case 0x23:
                return "Ozone"; //O3
            case 0x24:
                return "Sulphur Dioxide"; // Sulfur Dioxide (IUPAC) SO2
            case 0x25:
                return "Hydrogen Bromide";     //HBr
            case 0x26:
                return "Bromine";     //Br2
            case 0x27:
                return "Elemental Fluorine";     //F2
            case 0x28:
                return "Hydrogen Phosphide (Phosphine)";     //PH3 
            case 0x29:
                return "Arsine";     //AsH3
            case 0x2A:
                return "Silane";     //SiH4
            case 0x2B:
                return "Germane (Germanium Tetrahydride)";     //GeH4
            case 0x2C:
                return "Diborane";     //B2H6
            case 0x2D:
                return "Boron Trifluoride";     //BF3
            case 0x2E:
                return "Tungsten Hexafluoride";     //WF6
            case 0x2F:
                return "Silicon Tetrafluoride";     //SiF4
            case 0x30:
                return "Xenon Difluoride";     //XeF2
            case 0x31:
                return "Titanium(IV) Fluoride";     //TiF4
            case 0x32:
                return "Odour"; // Odour/Smell    
            case 0x33:
                return "IAQ - Indoor VOCs";     //IAQ
            case 0x34:
                return "AQI - Outdoor VOCs";     //AQI
            case 0x35:
                return "Nonmethane Hydrocarbons";     //NMHC
            case 0x36:
                return "Sulphur Oxides";     //SOx
            case 0x37:
                return "Nitrogen Oxides";     //NOx
            case 0x38:
                return "Nitric Oxide";     //NO
            case 0x39:
                return "Isobutylene";     //C4H8
            case 0x3A:
                return "Propylene Glycol";     //C3H8O2
            case 0x3B:
                return "Methanethiol";     //CH4S
            case 0x3C:
                return "Styrene";     //C8H8
            case 0x3D:
                return "Butane";     //C4H10
            case 0x3E:
                return "Butadiene";     //C4H6
            case 0x3F:
                return "Hexane";     //C6H14
            case 0x40:
                return "Ethylene Oxide";     //C2H4O
            case 0x41:
                return "Propylamine";     //C3H9N
            case 0x42:
                return "Acetone imine";     //C3H7N
            case 0x43:
                return "Ethyl Alcohol(Ethanol)";     //C2H6O
            case 0x44:
                return "Carbon Disulfide";     //CS2
            case 0x45:
                return "Dimethyl Sulfide";     //C2H6S
            case 0x46:
                return "Dimethyl Disulfide";     //C2H6S2
            case 0x47:
                return "Ethylene";     //C2H4
            case 0x48:
                return "Methanol";     //CH3OH
            case 0x49:
                return "Benzene";     //C6H6
            case 0x4A:
                return "Xylene";     //C8H10
            case 0x4B:
                return "Toluene";     //C7H8
            case 0x4C:
                return "Acetic Acid";     //CH3COOH
            case 0x4D:
                return "Chlorine Dioxide";     //C1O2
            case 0x4E:
                return "Hydrogen Peroxide";     //H2O2
            case 0x4F:
                return "Nitrogen Hydride (Hydrazine)";     //N2H4
            case 0x50:
                return "Ethylenediamine";     //C2H8N2
            case 0x51:
                return "Trichloroethylene";     //C2HC13
            case 0x52:
                return "Trichloromethane (Chloroform)";     //CHC13
            case 0x53:
                return "1,1,1-Trichloroethane";     //C2H3C13
            case 0x54:
                return "Hydrogen Selenide";     //H2Se
        }
        return "Unknown";
    }
    // Corrosion: Return metal name from id byte
    function GetCrnMetal(id_byte) {
        let id = id_byte & 0x7f;
        switch (id) {
            case 0x00:
                return "Unknown";
            case 0x01:
                return "Copper";
            case 0x02:
                return "Silver";
            case 0x03:
                return "Chromium";
        }
        return "Error";
    }
    // Workaround Fix for OAQ/IAQ/ZN2/ZV v7.01~7.09
    function t_fix_v7(t) {
        let num = t & 0xFFFF;
        if (0x8000 & num)
            num = 655 + num;
        return num & 0xFFFF;
    }
    // --------------------------------------------------------------------------------------
    // Function to decode enLink telemetry (sensor) messages
    function decodeTelemetry(data) {
        let cpn;
        let metal;
        let obj = {};

        for (let i = 0; i < data.length; i++) {
            switch (data[i]) {
                // Parse enLink message for telemetry data
                case ENLINK_TEMP: // Temperature
                    obj.temperature_c = S16((data[i + 1] << 8) | data[i + 2]) / 10;
                    obj.temperature_c_fix_v7 = (t_fix_v7((data[i + 1] << 8) | data[i + 2])) / 10;
                    //obj.temperature_f = ((obj.temperature_c * 9) / 5 + 32);
                    i += 2;
                    break;
                case ENLINK_COMP_TEMP_C: // Compensated Temperature
                    obj.comp_temp_c = S16((data[i + 1] << 8) | data[i + 2]) / 10;
                    i += 2;
                    break;
                case ENLINK_RH: // Humidity %rH
                    obj.humidity = data[i + 1];
                    i += 1;
                    break;
                case ENLINK_HIRES_RH: // Humidity %rH
                    obj.rh = u16_1(data, i) / 100;
                    i += 2;
                    break;
                case ENLINK_COMP_RH: // Compensated Humidity %rH
                    obj.comp_rh = u16_1(data, i) / 100;
                    i += 2;
                    break;
                case ENLINK_LUX: // Light Level lux
                    obj.lux = u16_1(data, i);
                    i += 2;
                    break;
                case ENLINK_PRESSURE: // Barometric Pressure
                    obj.pressure_mbar = u16_1(data, i);
                    i += 2;
                    break;
                case ENLINK_VOC_IAQ: // Indoor Air Quality (0-500)
                    obj.iaq = u16_1(data, i);
                    i += 2;
                    break;
                case ENLINK_O2PERC: // O2 percentage
                    obj.o2perc = data[i + 1] / 10;
                    i += 1;
                    break;
                case ENLINK_CO: // Carbon Monoxide
                    obj.co_ppm = u16_1(data, i) / 100;
                    i += 2;
                    break;
                case ENLINK_CO2: // Carbon Dioxide
                    obj.co2_ppm = u16_1(data, i);
                    i += 2;
                    break;
                case ENLINK_OZONE: // Ozone ppm and ppb
                    obj.ozone_ppm = u16_1(data, i) / 10000;
                    obj.ozone_ppb = u16_1(data, i) / 10;
                    i += 2;
                    break;
                case ENLINK_POLLUTANTS: // Pollutants kOhm
                    obj.pollutants_kohm = u16_1(data, i) / 10;
                    i += 2;
                    break;
                case ENLINK_PM25: // Particulates @2.5
                    obj.pm25 = u16_1(data, i);
                    i += 2;
                    break;
                case ENLINK_PM10: // Particulates @10
                    obj.pm10 = u16_1(data, i);
                    i += 2;
                    break;
                case ENLINK_H2S: // Hydrogen Sulphide
                    obj.h2s_ppm = u16_1(data, i) / 100;
                    i += 2;
                    break;

                case ENLINK_COUNTER:
                    let pulseCount = u32_2(data, i);
                    // Add array of counters
                    if (obj.counter) {
                        obj.counter.push([data[i + 1], pulseCount]);
                    } else {
                        obj.counter = [[data[i + 1], pulseCount]];
                    }
                    // Add direct values for inputs 1, 2 and 3
                    let input_no = data[i + 1];
                    if (input_no === 0x00) { obj.pulse_ip1 = pulseCount; }
                    if (input_no === 0x01) { obj.pulse_ip2 = pulseCount; }
                    if (input_no === 0x02) { obj.pulse_ip3 = pulseCount; }
                    i += 5;
                    break;
                case ENLINK_MB_EXCEPTION: // Modbus Error Code
                    if (obj.mb_ex) {
                        obj.mb_ex.push([data[i + 1], data[i + 2]]);
                    } else {
                        obj.mb_ex = [[data[i + 1], data[i + 2]]];
                    }
                    i += 2;
                    break;
                case ENLINK_MB_INTERVAL: // Modbus Interval Read
                    let int_value = ff32_2(data, i, 2);
                    if (obj.mb_int_val) {
                        obj.mb_int_val.push([data[i + 1], int_value]);
                    } else {
                        obj.mb_int_val = [[data[i + 1], int_value]];
                    }
                    i += 5;
                    break;
                case ENLINK_MB_CUMULATIVE: // Modbus Cumulative Read
                    let cum_value = ff32_2(data, i, 2);
                    if (obj.mb_cum_val) {
                        obj.mb_cum_val.push([data[i + 1], cum_value]);
                    } else {
                        obj.mb_cum_val = [[data[i + 1], cum_value]];
                    }
                    i += 5;
                    break;

                case ENLINK_BVOC: // Breath VOC Estimate equivalent
                    obj.bvoc = ff32_1(data, i, 3);
                    i += 4;
                    break;

                case ENLINK_DETECTION_COUNT:
                    obj.det_count = u32_1(data, i);
                    i += 4;
                    break;
                case ENLINK_OCC_TIME: // Occupied duration in seconds
                    obj.occ_time_s = u32_1(data, i);
                    i += 4;
                    break;

                case ENLINK_COS_STATUS: // Change-of-State U16
                    // Byte 1 = Triggered, Byte 2 = Input state
                    obj.cos_trig_byte = '0x' + ('0' + (data[i + 1]).toString(16).toUpperCase()).slice(-2);
                    if (data[i + 1] === 0) {
                        // Transmission was triggered with button press or ATI timeout
                        // So it's a 'heartbeat'
                        obj.cos_hb = 1;
                    } else {
                        // If (data[i + 1] > 0) transmission was triggered with a Change of State
                        // Transition detected for Closed to Open
                        let b = false;
                        b = (data[i + 1] & 0x01) > 0;
                        obj.cos_ip_1_hl = b ? 1 : 0;

                        b = (data[i + 1] & 0x02) > 0;
                        obj.cos_ip_2_hl = b ? 1 : 0;

                        b = (data[i + 1] & 0x04) > 0;
                        obj.cos_ip_3_hl = b ? 1 : 0;

                        // Transition detected for Open to Closed
                        b = (data[i + 1] & 0x10) > 0;
                        obj.cos_ip_1_lh = b ? 1 : 0;

                        b = (data[i + 1] & 0x20) > 0;
                        obj.cos_ip_2_lh = b ? 1 : 0;

                        b = (data[i + 1] & 0x40) > 0;
                        obj.cos_ip_3_lh = b ? 1 : 0;
                    }
                    // Input State
                    //obj.state_byte = '0x' + ('0' + (data[i + 2]).toString(16).toUpperCase()).slice(-2);
                    obj.state_ip_1 = (data[i + 2] & 0x01) > 0 ? 1 : 0;
                    obj.state_ip_2 = (data[i + 2] & 0x02) > 0 ? 1 : 0;
                    obj.state_ip_3 = (data[i + 2] & 0x04) > 0 ? 1 : 0;
                    i += 2;
                    break;

                case ENLINK_DETECTION_STATUS:
                    obj.detection = data[i + 1] ? true : false;
                    i += 1;
                    break;

                case ENLINK_TEMP_PROBE1:
                    obj.temp_probe_1 = S16((data[i + 1] << 8) | data[i + 2]) / 10;
                    i += 2;
                    break;
                case ENLINK_TEMP_PROBE2:
                    obj.temp_probe_2 = S16((data[i + 1] << 8) | data[i + 2]) / 10;
                    i += 2;
                    break;
                case ENLINK_TEMP_PROBE3:
                    obj.temp_probe_3 = S16((data[i + 1] << 8) | data[i + 2]) / 10;
                    i += 2;
                    break;
                case ENLINK_TEMP_PROBE_IN_BAND_DURATION_S_1:
                    /* Cumulative detection time u32 */
                    obj.temp_probe_in_band_duration_s_1 = u32_1(data, i);
                    i += 4;
                    break;
                case ENLINK_TEMP_PROBE_IN_BAND_DURATION_S_2:
                    /* Cumulative detection time u32 */
                    obj.temp_probe_in_band_duration_s_2 = u32_1(data, i);
                    i += 4;
                    break;
                case ENLINK_TEMP_PROBE_IN_BAND_DURATION_S_3:
                    /* Cumulative detection time u32 */
                    obj.temp_probe_in_band_duration_s_3 = u32_1(data, i);
                    i += 4;
                    break;
                case ENLINK_TEMP_PROBE_IN_BAND_ALARM_COUNT_1:
                    /* In band alarm events u16 */
                    obj.temp_probe_in_band_alarm_count_1 = u32_1(data, i);
                    i += 2;
                    break;
                case ENLINK_TEMP_PROBE_IN_BAND_ALARM_COUNT_2:
                    /* In band alarm events u16 */
                    obj.temp_probe_in_band_alarm_count_2 = u16_1(data, i);
                    i += 2;
                    break;
                case ENLINK_TEMP_PROBE_IN_BAND_ALARM_COUNT_3:
                    /* In band alarm events u16 */
                    obj.temp_probe_in_band_alarm_count_3 = u16_1(data, i);
                    i += 2;
                    break;
                case ENLINK_TEMP_PROBE_LOW_DURATION_S_1:
                    /* Cumulative detection time u32 */
                    obj.temp_probe_low_duration_s_1 = u32_1(data, i);
                    i += 4;
                    break;
                case ENLINK_TEMP_PROBE_LOW_DURATION_S_2:
                    /* Cumulative detection time u32 */
                    obj.temp_probe_low_duration_s_2 = u32_1(data, i);
                    i += 4;
                    break;
                case ENLINK_TEMP_PROBE_LOW_DURATION_S_3:
                    /* Cumulative detection time u32 */
                    obj.temp_probe_low_duration_s_3 = u32_1(data, i);
                    i += 4;
                    break;
                case ENLINK_TEMP_PROBE_LOW_ALARM_COUNT_1:
                    /* Low alarm events u16 */
                    obj.temp_probe_low_alarm_count_1 = u16_1(data, i);
                    i += 2;
                    break;
                case ENLINK_TEMP_PROBE_LOW_ALARM_COUNT_2:
                    /* Low alarm events u16 */
                    obj.temp_probe_low_alarm_count_2 = u16_1(data, i);
                    i += 2;
                    break;
                case ENLINK_TEMP_PROBE_LOW_ALARM_COUNT_3:
                    /* Low alarm events u16 */
                    obj.temp_probe_low_alarm_count_3 = u16_1(data, i);
                    i += 2;
                    break;
                case ENLINK_TEMP_PROBE_HIGH_DURATION_S_1:
                    /* Cumulative detection time u32 */
                    obj.temp_probe_high_duration_s_1 = u32_1(data, i);
                    i += 4;
                    break;
                case ENLINK_TEMP_PROBE_HIGH_DURATION_S_2:
                    /* Cumulative detection time u32 */
                    obj.temp_probe_high_duration_s_2 = u32_1(data, i);
                    i += 4;
                    break;
                case ENLINK_TEMP_PROBE_HIGH_DURATION_S_3:
                    /* Cumulative detection time u32 */
                    obj.temp_probe_high_duration_s_3 = u32_1(data, i);
                    i += 4;
                    break;
                case ENLINK_TEMP_PROBE_HIGH_ALARM_COUNT_1:
                    /* High alarm events u16 */
                    obj.temp_probe_high_alarm_count_1 = u16_1(data, i);
                    i += 2;
                    break;
                case ENLINK_TEMP_PROBE_HIGH_ALARM_COUNT_2:
                    /* High alarm events u16 */
                    obj.temp_probe_high_alarm_count_2 = u16_1(data, i);
                    i += 2;
                    break;
                case ENLINK_TEMP_PROBE_HIGH_ALARM_COUNT_3:
                    /* High alarm events u16 */
                    obj.temp_probe_high_alarm_count_3 = u16_1(data, i);
                    i += 2;
                    break;

                case ENLINK_DIFF_PRESSURE: // 4 bytes F32, +/- 5000 Pa
                    obj.dp_pa = ff32_1(data, i, 3);
                    i += 4;
                    break;
                case ENLINK_AIR_FLOW: // 4 bytes F32, 0 -> 100m/s
                    obj.af_mps = ff32_1(data, i, 3);
                    i += 4;
                    break;
                case ENLINK_VOLTAGE: // 2 bytes U16, 0 to 10.000 V
                    obj.adc_v = u16_1(data, i) / 1000;
                    i += 2;
                    break;
                case ENLINK_CURRENT: // 2 bytes U16, 0 to 20.000 mA
                    obj.adc_ma = u16_1(data, i) / 1000;
                    i += 2;
                    break;
                case ENLINK_RESISTANCE: // 2 bytes U16, 0 to 6553.5 kOhm
                    //obj.pre_5_09_adc_kohm = U16((data[i + 1] << 8) | data[i + 2]) / 1000;
                    //obj.post_5_09_adc_kohm = U16((data[i + 1] << 8) | data[i + 2]) / 10;
                    obj.adc_kohm = u16_1(data, i) / 10;
                    i += 2;
                    break;
                case ENLINK_LEAK_DETECT_EVT: // 1 byte U8, Leak status changed
                    obj.leak_detect_event = data[i + 1] ? true : false;
                    i += 1;
                    break;
                case ENLINK_GP_PRESSURE_PA: // 4 bytes F32, in Pascals. Typically up to 1MPa (10,000 mbar)
                    obj.gp_pa = ff32_1(data, i, 2);
                    i += 4;
                    break;
                case ENLINK_GP_TEMPERATURE:
                    obj.gp_t_c = (S16((data[i + 1] << 8) | (data[i + 2]))) / 100;
                    i += 2;
                    break;

                case ENLINK_LL_DEPTH_MM: // 4 bytes F32, in mm
                    obj.ll_depth_mm = f32_1(data, i);
                    i += 4;
                    break;
                case ENLINK_LL_TEMPERATURE: // Sensor temperature
                    obj.ll_t_c = (S16((data[i + 1] << 8) | (data[i + 2]))) / 100;
                    i += 2;
                    break;
                case ENLINK_MIN_TVOC:
                    obj.tvoc_min_mg_m3 = ff32_1(data, i, 2);
                    i += 4;
                    break;
                case ENLINK_AVG_TVOC:
                    obj.tvoc_avg_mg_m3 = ff32_1(data, i, 2);
                    i += 4;
                    break;
                case ENLINK_MAX_TVOC:
                    obj.tvoc_max_mg_m3 = ff32_1(data, i, 2);
                    i += 4;
                    break;
                case ENLINK_ETOH: // Ethanol equivalent
                    obj.etoh_ppm = ff32_1(data, i, 2);
                    i += 4;
                    break;
                case ENLINK_TVOC_IAQ:
                    obj.tvoc_iaq = ff32_1(data, i, 2);
                    i += 4;
                    break;

                case ENLINK_CO2E: // CO2e Estimate Equivalent
                    obj.co2e_ppm = ff32_1(data, i, 2);
                    i += 4;
                    break;

                case ENLINK_SOUND_MIN:
                    obj.sound_min_dba = ff32_1(data, i, 2);
                    i += 4;
                    break;

                case ENLINK_SOUND_AVG:
                    obj.sound_avg_dba = ff32_1(data, i, 2);
                    i += 4;
                    break;

                case ENLINK_SOUND_MAX:
                    obj.sound_max_dba = ff32_1(data, i, 2);
                    i += 4;
                    break;

                case ENLINK_NO: // Nitric Oxide
                    obj.no_ppm = u16_1(data, i) / 100;
                    i += 2;
                    break;
                case ENLINK_NO2: // Nitrogen Dioxide scaled at 0-5ppm
                    obj.no2_ppm = u16_1(data, i) / 10000;
                    i += 2;
                    break;
                case ENLINK_NO2_20: // Nitrogen Dioxide scaled at 0-20ppm
                    obj.no2_20_ppm = u16_1(data, i) / 1000;
                    i += 2;
                    break;
                case ENLINK_SO2: // Sulphur Dioxide 0-20ppm
                    obj.so2_ppm = u16_1(data, i) / 1000;
                    i += 2;
                    break;

                case ENLINK_MC_PM0_1:
                    obj.mc_pm0_1 = ff32_1(data, i, 2);
                    i += 4;
                    break;
                case ENLINK_MC_PM0_3:
                    obj.mc_pm0_3 = ff32_1(data, i, 2);
                    i += 4;
                    break;
                case ENLINK_MC_PM0_5:
                    obj.mc_pm0_5 = ff32_1(data, i, 2);
                    i += 4;
                    break;
                case ENLINK_MC_PM1_0:
                    obj.mc_pm1_0 = ff32_1(data, i, 2);
                    i += 4;
                    break;
                case ENLINK_MC_PM2_5:
                    obj.mc_pm2_5 = ff32_1(data, i, 2);
                    i += 4;
                    break;
                case ENLINK_MC_PM4_0:
                    obj.mc_pm4_0 = ff32_1(data, i, 2);
                    i += 4;
                    break;
                case ENLINK_MC_PM5_0:
                    obj.mc_pm5_0 = ff32_1(data, i, 2);
                    i += 4;
                    break;
                case ENLINK_MC_PM10_0:
                    obj.mc_pm10_0 = ff32_1(data, i, 2);
                    i += 4;
                    break;

                case ENLINK_NC_PM0_1:
                    obj.nc_pm0_1 = ff32_1(data, i, 2);
                    i += 4;
                    break;
                case ENLINK_NC_PM0_3:
                    obj.nc_pm0_3 = ff32_1(data, i, 2);
                    i += 4;
                    break;
                case ENLINK_NC_PM0_5:
                    obj.nc_pm0_5 = ff32_1(data, i, 2);
                    i += 4;
                    break;
                case ENLINK_NC_PM1_0:
                    obj.nc_pm1_0 = ff32_1(data, i, 2);
                    i += 4;
                    break;
                case ENLINK_NC_PM2_5:
                    obj.nc_pm2_5 = ff32_1(data, i, 2);
                    i += 4;
                    break;
                case ENLINK_NC_PM4_0:
                    obj.nc_pm4_0 = ff32_1(data, i, 2);
                    i += 4;
                    break;
                case ENLINK_NC_PM5_0:
                    obj.nc_pm5_0 = ff32_1(data, i, 2);
                    i += 4;
                    break;
                case ENLINK_NC_PM10_0:
                    obj.nc_pm10_0 = ff32_1(data, i, 2);
                    i += 4;
                    break;

                case ENLINK_PM_TPS:
                    obj.pm_tps = ff32_1(data, i, 2);
                    i += 4;
                    break;

                case ENLINK_DE_EVENT:
                    obj.de_event = u16_1(data, i);
                    i += 2;
                    break;

                case ENLINK_DE_SMOKE:
                    obj.de_smoke = u16_1(data, i);
                    i += 2;
                    break;

                case ENLINK_DE_VAPE:
                    obj.de_vape = u16_1(data, i);
                    i += 2;
                    break;

                case ENLINK_GAS_PPB:
                    let gas_ppb_val = ff32_2(data, i, 2);
                    // Values as array triplet
                    if (obj.gas_ppb) {
                        obj.gas_ppb.push([data[i + 1], GetGasName(data[i + 1]), gas_ppb_val]);
                    } else {
                        obj.gas_ppb = [[data[i + 1], GetGasName(data[i + 1]), gas_ppb_val]];
                    }
                    i += 5;
                    break;

                case ENLINK_GAS_UGM3:
                    // Need to create array as might have multiple sensors
                    let gas_ugm3_val = ff32_2(data, i, 2);
                    // As Array
                    if (obj.gas_ugm3) {
                        obj.gas_ugm3.push([data[i + 1], GetGasName(data[i + 1]), gas_ugm3_val]);
                    } else {
                        obj.gas_ugm3 = [[data[i + 1], GetGasName(data[i + 1]), gas_ugm3_val]];
                    }
                    i += 5;
                    break;

                case ENLINK_CRN_THK:
                    // Coupon is either 1 or 2. Bit 7 set for Coupon 2
                    cpn = (data[i + 1] & 0x80) === 0 ? 1 : 2;
                    metal = GetCrnMetal(data[i + 1]);
                    // Thickness in nanometres
                    let thk_nm = ff32_2(data, i, 3);
                    // As Array
                    if (obj.crn_thk_nm) {
                        obj.crn_thk_nm.push([cpn, metal, thk_nm]);
                    } else {
                        obj.crn_thk_nm = [[cpn, metal, thk_nm]];
                    }
                    i += 5;
                    break;

                case ENLINK_CRN_MIN_THK:
                    cpn = (data[i + 1] & 0x80) === 0 ? 1 : 2;
                    metal = GetCrnMetal(data[i + 1]);
                    // Minimum thickness of metal
                    let min_nm = U16((data[i + 2] << 8) | data[i + 3]);
                    // As Array
                    if (obj.crn_min_nm) {
                        obj.crn_min_nm.push([cpn, metal, min_nm]);
                    } else {
                        obj.crn_min_nm = [[cpn, metal, min_nm]];
                    }
                    i += 3;
                    break;

                case ENLINK_CRN_MAX_THK:
                    cpn = (data[i + 1] & 0x80) === 0 ? 1 : 2;
                    metal = GetCrnMetal(data[i + 1]);
                    // Original thickness of metal
                    let max_nm = U16((data[i + 2] << 8) | data[i + 3]);
                    // As Array
                    if (obj.crn_max_nm) {
                        obj.crn_max_nm.push([cpn, metal, max_nm]);
                    } else {
                        obj.crn_max_nm = [[cpn, metal, max_nm]];
                    }
                    i += 3;
                    break;

                case ENLINK_CRN_PERC:
                    cpn = (data[i + 1] & 0x80) === 0 ? 1 : 2;
                    metal = GetCrnMetal(data[i + 1]);
                    // Corrosion of coupon in percentage from Max(0%) to Min(100%)
                    let perc = ff32_2(data, i, 3);
                    // As Array
                    if (obj.crn_perc) {
                        obj.crn_perc.push([cpn, metal, perc]);
                    } else {
                        obj.crn_perc = [[cpn, metal, perc]];
                    }
                    i += 5;
                    break;

                case ENLINK_FAST_AQI:
                    obj.fast_aqi = u16_1(data, i);
                    i += 2;
                    break;

                case ENLINK_EPA_AQI:
                    obj.epa_aqi = u16_1(data, i);
                    i += 2;
                    break;

                case ENLINK_FGS_CYCLECOUNT:
                    obj.flam_count = s32_1(data, i);
                    i += 4;
                    break;

                case ENLINK_FGS_FLAM_GAS:
                    let gas_lel_iso_val = ff32_2(data, i, 2);
                    // Use this to give just a %LEL(ISO) reading independant of gas class
                    // 'General' flammable gas concentration; if you want it
                    //obj.flam_gen_conc_lel_iso = gas_lel_iso_val;

                    // Create 'zero' values for history logging, then update the relevant gas class value
                    obj.flam_no_gas = 0;
                    obj.flam_hydrogen = 0;
                    obj.flam_hydrogen_mix = 0;
                    obj.flam_methane = 0;
                    obj.flam_light = 0;
                    obj.flam_medium = 0;
                    obj.flam_heavy = 0;

                    // Add actual reading to gas class
                    switch (data[i + 1]) {
                        case FLAM_NO_GAS:
                            obj.flam_no_gas = gas_lel_iso_val;
                            break;
                        case FLAM_HYDROGEN:
                            obj.flam_hydrogen = gas_lel_iso_val;
                            break;
                        case FLAM_HYD_MIX:
                            obj.flam_hydrogen_mix = gas_lel_iso_val;
                            break;
                        case FLAM_METHANE:
                            obj.flam_methane = gas_lel_iso_val;
                            break;
                        case FLAM_LIGHT:
                            obj.flam_light = gas_lel_iso_val;
                            break;
                        case FLAM_MEDIUM:
                            obj.flam_medium = gas_lel_iso_val;
                            break;
                        case FLAM_HEAVY:
                            obj.flam_heavy = gas_lel_iso_val;
                            break;

                        // Errors
                        case FLAM_UNKNOWN_GAS:
                            obj.flam_err_unknown_gas = gas_lel_iso_val;
                            break;
                        case FLAM_UNDER_RNG:
                            obj.flam_err_under_range = gas_lel_iso_val;
                            // Create 'error' values for history logging
                            obj.flam_no_gas = -1;
                            obj.flam_hydrogen = -1;
                            obj.flam_hydrogen_mix = -1;
                            obj.flam_methane = -1;
                            obj.flam_light = -1;
                            obj.flam_medium = -1;
                            obj.flam_heavy = -1;

                            break;
                        case FLAM_OVER_RNG:
                            obj.flam_err_over_range = gas_lel_iso_val;
                            // Create 'error' values for history logging
                            obj.flam_no_gas = 110;
                            obj.flam_hydrogen = 110;
                            obj.flam_hydrogen_mix = 110;
                            obj.flam_methane = 110;
                            obj.flam_light = 110;
                            obj.flam_medium = 110;
                            obj.flam_heavy = 110;
                            break;

                        default:
                            obj.flam_unknown_type = data[i + 1];
	                        obj.flam_unknown_value = gas_lel_iso_val;
                            break;
                    }
                    i += 5;
                    break;

                // < -------------------------------------------------------------------------------->
                // Optional KPIs
                case ENLINK_CPU_TEMP_DEP: // Optional from April 2020
                    obj.cpu_temp_dep = data[i + 1] + Math.round((data[i + 2] * 100) / 256) / 100;
                    i += 2;
                    break;
                case ENLINK_CPU_TEMP: // New for April 2020 Ver: 4.9
                    obj.cpu_temp = S16((data[i + 1] << 8) | data[i + 2]) / 10;
                    i += 2;
                    break;
                case ENLINK_BATT_STATUS:
                    obj.batt_status = data[i + 1];
                    i += 1;
                    break;
                case ENLINK_BATT_VOLT:
                    //obj.batt_volt = U16((data[i + 1] << 8) | data[i + 2]) / 1000;
                    obj.batt_mv = u16_1(data, i);
                    i += 2;
                    break;
                case ENLINK_RX_RSSI:
                    obj.rx_rssi = S16((data[i + 1] << 8) | data[i + 2]);
                    i += 2;
                    break;
                case ENLINK_RX_SNR:
                    obj.rx_snr = S8(data[i + 1]);
                    i += 1;
                    break;
                case ENLINK_RX_COUNT:
                    obj.rx_count = u16_1(data, i);
                    i += 2;
                    break;
                case ENLINK_TX_TIME:
                    obj.tx_time_ms = u16_1(data, i);
                    i += 2;
                    break;
                case ENLINK_TX_POWER:
                    obj.tx_power_dbm = S8(data[i + 1]);
                    i += 1;
                    break;
                case ENLINK_TX_COUNT:
                    obj.tx_count = u16_1(data, i);
                    i += 2;
                    break;
                case ENLINK_POWER_UP_COUNT:
                    obj.power_up_count = u16_1(data, i);
                    i += 2;
                    break;
                case ENLINK_USB_IN_COUNT:
                    obj.usb_in_count = u16_1(data, i);
                    i += 2;
                    break;
                case ENLINK_LOGIN_OK_COUNT:
                    obj.login_ok_count = u16_1(data, i);
                    i += 2;
                    break;
                case ENLINK_LOGIN_FAIL_COUNT:
                    obj.login_fail_count = u16_1(data, i);
                    i += 2;
                    break;
                case ENLINK_FAN_RUN_TIME:
                    obj.fan_run_time_s = u32_1(data, i);
                    i += 4;
                    break;

                // < -------------------------------------------------------------------------------->
                case ENLINK_FAULT:
                    let sensor_id = (data[i + 1]);
                    let fault_code = (data[i + 2]);
                    let count_val = U16((data[i + 3] << 8) | data[i + 4]);
                    /*
                    if (obj.fault) {
                        obj.fault.push([sensor_id, item_id, item_val]);
                    } else {
                        obj.fault = [[sensor_id, item_id, item_val]];
                    }
                    */
                    // Check for known values
                    if (sensor_id == 28) {
                        // SPS30 0x1C/28
                        if (fault_code == 1) {
                            obj.fault_0x1C_01 = "SPS30 Fan Speed Error: " + count_val;
                        } else if (fault_code == 2) {
                            obj.fault_0x1C_02 = "SPS30 Laser Failure: " + count_val;
                        } else if (item_id_id == 3) {
                            obj.fault_0x1C_03 = "SPS30 Fan Failure: " + count_val;
                        } else {
                            obj.fault_0x1C_x = "SPS30 General Error. Fault Code: " + fault_code + " Count: " + count_val;
                        }
                    } else if (sensor_id == 36) {
                        // Flammable Gas - MPS 0x24/36
                        if (fault_code == 0x01) {
                            obj.fault_0x24_01 = "MPS CRC Error: " + count_val;
                        } else if (fault_code == 0x02) {
                            obj.fault_0x24_02 = "MPS Bad Parameter: " + count_val;
                        } else if (fault_code == 0x05) {
                            obj.fault_0x24_05 = "MPS Unknown Cmd: " + count_val;
                        } else if (fault_code == 0x07) {
                            obj.fault_0x24_07 = "MPS Incomplete Cmd: " + count_val;
                        } else if (fault_code == 0x21) {
                            obj.fault_0x24_21 = "MPS VDD Out of Range: " + count_val;
                        } else if (fault_code == 0x22) {
                            obj.fault_0x24_22 = "MPS VREF Out of Range: " + count_val;
                        } else if (fault_code == 0x23) {
                            obj.fault_0x24_23 = "MPS Env. Sensor Out of Range: " + count_val;
                        } else if (fault_code == 0x24) {
                            obj.fault_0x24_24 = "MPS Env. Sensor Failed: " + count_val;
                        } else if (fault_code == 0x25) {
                            obj.fault_0x24_25 = "MPS Microcontroller Error: " + count_val;
                        } else if (fault_code == 0x30) {
                            obj.fault_0x24_30 = "MPS Sensor Read Negative: " + count_val;
                        } else if (fault_code == 0x31) {
                            obj.fault_0x24_31 = "MPS Condensation Detected: " + count_val;
                        } else if (fault_code == 0x32) {
                            obj.fault_0x24_32 = "MPS Sensor Error: " + count_val;
                        } else if (fault_code == 0x33) {
                            obj.fault_0x24_33 = "MPS Gas detected during startup: " + count_val;
                        } else if (fault_code == 0x34) {
                            obj.fault_0x24_34 = "MPS Slow Gas accumulation detected: " + count_val;
                        } else if (fault_code == 0x35) {
                            obj.fault_0x24_35 = "MPS Breath/Humidity Surge: " + count_val;
                        } else if (fault_code == 0xF9) {
                            obj.fault_0x24_F9 = "MPS Reply Timeout: " + count_val;
                        } else if (fault_code == 0xFA) {
                            obj.fault_0x24_FA = "MPS Incomplete reply: " + count_val;
                        } else if (fault_code == 0xFB) {
                            obj.fault_0x24_FB = "MPS CRC Error on reply: " + count_val;
                        } else if (fault_code == 0xFC) {
                            obj.fault_0x24_FC = "MPS Sensor restart: " + count_val;
                        } else if (fault_code == 0xFF) {
                            obj.fault_0x24_FF = "MPS Unknown Status: " + count_val;
                        } else {
                            obj.fault_0x24_x = "MPS General Error. Fault Code: " + fault_code + " Count: " + count_val;
                        }
                    } else {
                        obj.fault_x = "Unknown Sensor ID: " + sensor_id + " Fault Code: " + fault_code + " Count: " + count_val;
                    }
                    i += 4;
                    break;

                // < -------------------------------------------------------------------------------->
                default:
                    // something is wrong with data
                    obj.error = "Telemetry: Error at byte index " + i + "  Data: " + bytesToHexError(data, i);
                    i = data.length;
                    return obj;
            }
        }
        return obj;
    }
    // --------------------------------------------------------------------------------------
    // Function to decode enLink response to downlink message
    function decodeStdResponse(data) {
        let obj = {};
        if (data.length != 3) {
            obj.reply = "Error: Reply is not 3 bytes long. Data: " + bytesToHex(data);
            return obj;
        }
        if (data[0] != ENLINK_HEADER) {
            obj.reply = "Error: First byte is not 0xA5. Data: " + bytesToHex(data);
            return obj;
        }
        // Parse reply from device following a downlink command
        if (data[1] == ENLINK_ACK) {
            obj.reply = "ACK";
        } else if (data[1] == ENLINK_NACK) {
            obj.reply = "NACK";
        } else {
            obj.reply = "Error: Reply ACK/NACK failure. Data: " + bytesToHex(data);
            return obj;
        }

        if (data[2] == ENLINK_SET_ANTENNA_GAIN) {
            obj.command = "Set Antenna Gain";
        } else if (data[2] == ENLINK_SET_PUBLIC) {
            obj.command = "Set Public";
        } else if (data[2] == ENLINK_SET_APPEUI) {
            obj.command = "Set AppEUI";
        } else if (data[2] == ENLINK_SET_APPKEY) {
            obj.command = "Set AppKEY";
        } else if (data[2] == ENLINK_SET_ADR) {
            obj.command = "Set ADR";
        } else if (data[2] == ENLINK_SET_DUTY_CYCLE) {
            obj.command = "Set Duty Cycle";
        } else if (data[2] == ENLINK_SET_MSG_ACK) {
            obj.command = "Set Message Confirmation";
        } else if (data[2] == ENLINK_SET_TX_PORT) {
            obj.command = "Set TX Port";
        } else if (data[2] == ENLINK_SET_DR_INDEX) {
            obj.command = "Set Data Rate";
        } else if (data[2] == ENLINK_SET_TX_INDEX) {
            obj.command = "Set TX Interval";
        } else if (data[2] == ENLINK_SET_POW_INDEX) {
            obj.command = "Set TX Power";
        } else if (data[2] == ENLINK_SET_RX_PORT) {
            obj.command = "Set RX Port";
        } else if (data[2] == ENLINK_SET_JC_INTERVAL) {
            obj.command = "Set Join Check Interval";
        } else if (data[2] == ENLINK_SET_JC_PKT_TYPE) {
            obj.command = "Set Join Check Packet Type";
        } else if (data[2] == ENLINK_SET_ATI_MIN) {
            obj.command = "Set ATI Min";
        } else if (data[2] == ENLINK_SET_ATI_MAX) {
            obj.command = "Set ATI Max";
        } else if (data[2] == ENLINK_SET_FULL_PKT_MUL) {
            obj.command = "Set Full Packet Multiplier";
        } else if (data[2] == ENLINK_SET_WELL_DEFAULT) {
            obj.command = "Set WELL defaults";
        } else if (data[2] == ENLINK_SET_KPI_INCLUDES_DIRECT) {
            obj.command = "Set KPI Includes";
        } else if (data[2] == ENLINK_SET_KPI_INCLUDES_INDEX) {
            obj.command = "Set KPI Includes";

        } else if (data[2] == ENLINK_SET_LUX_SCALE) {
            obj.command = "Set LUX Scale";
        } else if (data[2] == ENLINK_SET_LUX_OFFSET) {
            obj.command = "Set LUX Offset";

        } else if (data[2] == ENLINK_SET_CASE_FAN_RUN_TIME) {
            obj.command = "Set Case Fan Run Time";
        } else if (data[2] == ENLINK_SET_HPM_FAN_RUN_TIME) {
            obj.command = "Set Particle Sensor Fan Run Time";

        } else if (data[2] == ENLINK_SET_CO2_CALIB_ENABLE) {
            obj.command = "Set CO2 Sensor Auto-Calib Enable/Disable Flag";
        } else if (data[2] == ENLINK_SET_CO2_TARGET_PPM) {
            obj.command = "Set CO2 Sensor Auto-Calib Target";
        } else if (data[2] == ENLINK_SET_CO2_KNOWN_PPM) {
            obj.command = "Set CO2 Sensor to Known ppm";
            // Sunrise Sensor Only
        } else if (data[2] == ENLINK_SET_SR_CO2_FACTORY_CALIB) {
            obj.command = "Set SR CO2 Sensor to Factory Calib";
        } else if (data[2] == ENLINK_SET_CO2_REGULAR_INTERVAL) {
            obj.command = "Set CO2 Sensor Regular Auto-Calib Interval";
            // GSS CO2 Only
        } else if (data[2] == ENLINK_SET_GSS_CO2_OOB_LIMITS) {
            obj.command = "Set GSS CO2 Sensor OOB Limits";
        } else if (data[2] == ENLINK_SET_GSS_CO2_INIT_INTERVAL) {
            obj.command = "Set GSS CO2 Sensor Initial Auto-Calib Interval";
            // PM Sensors
        } else if (data[2] == ENLINK_SET_PM_RUN_PERIOD) {
            obj.command = "Set PM Sensor Run Period";
        } else if (data[2] == ENLINK_SET_PM_CLEANING_PERIOD) {
            obj.command = "Set PM Sensor Cleaning Interval";
            // Gas Sensors
        } else if (data[2] == ENLINK_SET_GAS_IDLE_STATE) {
            obj.command = "Set Gas Idle State";
        } else if (data[2] == ENLINK_SET_GAS_PRE_DELAY) {
            obj.command = "Set Gas Preamble Delay";
        } else if (data[2] == ENLINK_SET_GAS_NUM_READS) {
            obj.command = "Set Gas Number of Reads";
        } else if (data[2] == ENLINK_SET_GAS_READ_INT) {
            obj.command = "Set Gas Read Interval";
        } else if (data[2] == ENLINK_SET_GAS_AGG_METHOD) {
            obj.command = "Set Gas Aggregation Method";
        } else if (data[2] == ENLINK_SET_GAS_EMA_FACTOR) {
            obj.command = "Set Gas EMA Factor";
        } else if (data[2] == ENLINK_SET_GAS_TRIM_PPB) {
            obj.command = "Set Gas PPB trim value";
        } else if (data[2] == ENLINK_SET_GAS_TRIM_UGM3) {
            obj.command = "Set Gas UGM3 trim value";

        } else if (data[2] == ENLINK_LEAK_ALARM_MODE) {
            obj.command = "Set Leak Sensor Alarm Mode";
        } else if (data[2] == ENLINK_LEAK_UPPER_ALARM) {
            obj.command = "Set Leak Sensor High Alarm Level";
        } else if (data[2] == ENLINK_LEAK_UPPER_HYST) {
            obj.command = "Set Leak Sensor High Hysteresis";
        } else if (data[2] == ENLINK_LEAK_LOWER_ALARM) {
            obj.command = "Set Leak Sensor Low Alarm Level";
        } else if (data[2] == ENLINK_LEAK_LOWER_HYST) {
            obj.command = "Set Leak Sensor Low Hysteresis";
        } else if (data[2] == ENLINK_LEAK_SAMPLE_TIME_S) {
            obj.command = "Set Leak Sensor Sample Time";
        } else if (data[2] == ENLINK_LEAK_TEST_DURATION) {
            obj.command = "Set Leak Sensor Test Time";

        } else if (data[2] == ENLINK_BME680_PKT_INC) {
            obj.command = "Set VOC Sensor packet includes";
        } else if (data[2] == ENLINK_SPS30_PKT_INC) {
            obj.command = "Set SPS30 packet includes";
        } else if (data[2] == ENLINK_PIERA_PKT_INC) {
            obj.command = "Set PIERA/IPS7100 packet includes";

        } else if (data[2] == ENLINK_DP_PKT_INC) {
            obj.command = "Set DP/AF packet includes";
        } else if (data[2] == ENLINK_DP_AUTO_ZERO) {
            obj.command = "DP/AF trigger Auto-Zero process";
        } else if (data[2] == ENLINK_DP_SET_DELTA) {
            obj.command = "Set DP/AF delta offset";

        } else if (data[2] == ENLINK_ZMOD4410_PKT_INC) {
            obj.command = "Set TVOC Sensor packet includes";

        } else if (data[2] == ENLINK_ZV_SCN_REFRESH_INT) {
            obj.command = "Set Zone View Screen Refresh rate";
        } else if (data[2] == ENLINK_ZV_DISPLAY_TOPLINE) {
            obj.command = "Set Zone View display top line option";
        } else if (data[2] == ENLINK_ZV_DISPLAY_TEMP_UNITS) {
            obj.command = "Set Zone View display temperature unit";
        } else if (data[2] == ENLINK_ZV_DISPLAY_COMF_ICON_TYPE) {
            obj.command = "Set Zone View display comfort icon type";
        } else if (data[2] == ENLINK_ZV_DISPLAY_COMF_LOCN) {
            obj.command = "Set Zone View display comfort icon location";
        } else if (data[2] == ENLINK_ZV_COMF_LOGIC) {
            obj.command = "Set Zone View comfort logic";
        } else if (data[2] == ENLINK_ZV_DISPLAY_COMF_ICON_STATUS) {
            obj.command = "Set Zone View display comfort icon status";
        } else if (data[2] == ENLINK_ZV_INT_LOGIC_LOW_THRESH) {
            obj.command = "Set Zone View internal logic low threshold";
        } else if (data[2] == ENLINK_ZV_INT_LOGIC_HIGH_THRESH) {
            obj.command = "Set Zone View internal logic high threshold";
        } else if (data[2] == ENLINK_ZV_HELP_SCN_ENABLE) {
            obj.command = "Enable/Disable Zone View Help Screen";
        } else if (data[2] == ENLINK_ZV_SET_TEXT) {
            obj.command = "Set Zone View text string";
        } else if (data[2] == ENLINK_ZV_SET_TEXT_TO_DEFAULT) {
            obj.command = "Set Zone View text string to factory default";

        } else if (data[2] == ENLINK_ENABLE_Z45) {
            obj.command = "Enable/Disable EPA/Ozone Sensor";
        } else if (data[2] == ENLINK_HUMIDITY_TX_RES) {
            obj.command = "Humidity data resolution changed";
        } else if (data[2] == ENLINK_Z45_TRIG_CLEAN) {
            obj.command = "EPA/Ozone Sensor Cleaning Triggered";
        } else if (data[2] == ENLINK_Z44_TRIG_CLEAN) {
            obj.command = "Cleaning triggered on TVOC Sensor";
        } else if (data[2] == ENLINK_HS_SET_THRESH_P) {
            obj.command = "Set threshold on human presence sensor";
        } else if (data[2] == ENLINK_HS_SET_HYST_P) {
            obj.command = "Set hysteresis on human presence sensor";
        } else if (data[2] == ENLINK_HS_SET_INACTIVITY) {
            obj.command = "Set inactivity on human presence sensor";
        } else if (data[2] == ENLINK_HS_ZERO_C_AND_D) {
            obj.command = "Counters and detection time set to zero on human presence sensor";
        } else if (data[2] == ENLINK_HS_RESET) {
            obj.command = "Human presence sensor reset";
        } else if (data[2] == ENLINK_MPS_RESET_COUNTERS) {
            obj.command = "MPS Sensor fault counters reset to zero";

        } else if (data[2] == ENLINK_REBOOT) {
            obj.command = "Reboot";
        } else {
            obj.reply = "Unexpected Command byte. Data: " + bytesToHex(data);
        }
        return obj;
    }
    // --------------------------------------------------------------------------------------

    let res = {};
    //Check message type
    if (msg.payload[0] == ENLINK_HEADER) {
        // This is a response to a downlink command
        //node.warn("Decode DL reply");
        res = decodeStdResponse(msg.payload);
    } else {
        //node.warn("Decode Telemetry");
        res = decodeTelemetry(msg.payload);
    }

    if (res !== null) {
        //msg.hex = bytesToHex(msg.payload);
        msg.payload = res; // use for further function processing
        msg.human_readable = JSON.stringify(res, null, 4);
        return msg;
    }
    return null;
}
