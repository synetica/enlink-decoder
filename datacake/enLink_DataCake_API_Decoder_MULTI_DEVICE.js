// Used for decoding enLink Uplink LoRa Messages
// Created 11 Aug 2026 (FW Ver:7.23)
// Updated 05 Oct 2026 (FW Ver:7.25)
//
// Written using more compact lookup tables and functions to reduce code size for DataCake table decoder
// --------------------------------------------------------------------------------------
// DN: 2026-08-26
// Datacake API/MQTT MULTI-DEVICE version - strict DevEUI routing
// https://github.com/synetica/enlink-decoder


// --------------------------------------------------------------------------------------
// Protocol constants
// --------------------------------------------------------------------------------------

// System information
var ENLINK_SYS_INFO = 0x00;
var SYSID_FW_VER = 0x00;
var SENSID_PLUGIN_GAS = 0x1E;

// Complex telemetry records not represented by telemetryFields
var ENLINK_TEMP = 0x01;                                  // S16  -3276.8 C -> 3276.7 C (-10..80) [Divide word by 10]
var ENLINK_OZONE = 0x09;                                 // U16  0 -> 6.5535 ppm or 6553.5 ppb (0..1 ppm) [Divide by 10000]

var ENLINK_COUNTER = 0x0E;                               // U32  0 -> 2^32
var ENLINK_MB_EXCEPTION = 0x0F;                          // Type Byte + MBID + Exception Code so it's Type + 2 bytes
var ENLINK_MB_INTERVAL = 0x10;                           // Type Byte + MBID + F32 Value - so 6 bytes
var ENLINK_MB_CUMULATIVE = 0x11;                         // Type Byte + MBID + F32 Value - so 6 bytes
var ENLINK_COS_STATUS = 0x15;                            // U16  Change-of-State Trigger/State Value
var ENLINK_GP_PRESSURE_PA = 0x32;

var ENLINK_GAS_PPB = 0x61;                               // Gas-Type byte + F32 Concentration in ppb
var ENLINK_GAS_UGM3 = 0x66;                              // Gas-Type byte + F32 Volumetric mass as ug/m3
var ENLINK_CRN_THK = 0x62;                               // Coupon No. + Metal Type byte + F32 nm. Thickness
var ENLINK_CRN_MIN_THK = 0x63;                           // Coupon No. + Metal Type byte + U16 nm. Min Thickness (when depleted)
var ENLINK_CRN_MAX_THK = 0x64;                           // Coupon No. + Metal Type byte + U16 nm. Max/Original Thickness
var ENLINK_CRN_PERC = 0x65;                              // Coupon No. + Metal Type byte + F32 nm.

var ENLINK_FGS_FLAM_GAS = 0x74;                           // 1 + 4 | Gas ID + Conc %LEL(ISO) F32
var ENLINK_ZV_ALERT_STATUS = 0x7D;                       // U8 Alert mode (0=None, 1=Quiet, 2=Warning, 3=Locked) + U8 Read count
var ENLINK_FAULT = 0xFE;

// --------------------------------------------------------------------------------------
// Downlink reply message Header and ACK/NAK
var ENLINK_HEADER = 0xA5;
var ENLINK_ACK = 0x06;
var ENLINK_NACK = 0x15;
var ENLINK_SEND_SYS_INFO = 0x00;

// --------------------------------------------------------------------------------------
// OTA Modbus configuration Only
// V2 Configuration data messages
var ENLINK_MB_SYS = 0xFF;                                // Config reply from a MB unit
var ENLINK_QRY_V2 = 0xFE;                                // Query Configuration
var ENLINK_SET_V2 = 0xFD;                                // Set Configuration
var ENLINK_CMD_V2 = 0xFC;                                // Commands

var ENLINK_ACK_V2 = 0xAA;
var ENLINK_NACK_V2 = 0xFF;

var ENLINK_MB_DP_CONFIG = 0x41;
var ENLINK_MB_DP_VALUE = 0x42;
// Commands
var ENLINK_MB_SC_DELETE = 0x7F;

// --------------------------------------------------------------------------------------
// Binary conversion and formatting helpers
// --------------------------------------------------------------------------------------

function fromF32(byte0, byte1, byte2, byte3) {
    var bits = (byte0 << 24) | (byte1 << 16) | (byte2 << 8) | (byte3);
    var sign = ((bits >>> 31) === 0) ? 1.0 : -1.0;
    var e = ((bits >>> 23) & 0xff);
    var m = (e === 0) ? (bits & 0x7fffff) << 1 : (bits & 0x7fffff) | 0x800000;
    var f = sign * m * Math.pow(2, e - 150);
    return f;
}

function bytesToHex(bytes) {
    var result = "";
    for (var i = 0; i < bytes.length; i += 1) {
        result += ('0' + (bytes[i]).toString(16).toUpperCase() + ' ').slice(-3);
    }
    return result.trim();
}

function bytesToHexError(bytes, err) {
    var result = "";
    for (var i = 0; i < bytes.length; i += 1) {
        if (i == err) {
            result += '[' + ('0' + (bytes[i]).toString(16).toUpperCase()).slice(-2) + '] ';
        } else {
            result += ('0' + (bytes[i]).toString(16).toUpperCase() + ' ').slice(-3);
        }
    }
    return result.trim();
}

function hex(data) {
    return ('0' + data.toString(16).toUpperCase()).slice(-2);
}

function t_fix_v7(t) {
    var num = t & 0xFFFF;
    if (0x8000 & num)
        num = 655 + num;
    return num & 0xFFFF;
}

function S16(bin) {
    var num = bin & 0xFFFF;
    if (0x8000 & num)
        num = -(0x010000 - num);
    return num;
}

function S8(bin) {
    var num = bin & 0xFF;
    if (0x80 & num)
        num = -(0x0100 - num);
    return num;
}

function U16(ival) {
    if (isNaN(ival) === false) {
        if (ival < 0)
            ival = ival + 65536;
    }
    return ival;
}

function U32(ival) {
    if (isNaN(ival) === false) {
        if (ival < 0)
            ival = ival + 4294967296;
    }
    return ival;
}

function S32(ival) {
    if (isNaN(ival) === false) {
        if (ival > 2147483647)
            ival = ival - 4294967296;
    }
    return ival;
}

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

function readU8(data, i) { return data[i + 1]; }

function readS8(data, i) { return S8(data[i + 1]); }

function readU16(data, i) { return u16_1(data, i); }

function readS16(data, i) { return S16((data[i + 1] << 8) | data[i + 2]); }

function readU32(data, i) { return u32_1(data, i); }

function readS32(data, i) { return s32_1(data, i); }

function readF32(data, i) { return f32_1(data, i); }

function readBoolean(data, i) { return data[i + 1] ? true : false; }

function readLegacyCpuTemp(data, i) {
    return data[i + 1] + (Math.round(data[i + 2] * 100 / 256) / 100);
}

// --------------------------------------------------------------------------------------
// Lookup tables
// --------------------------------------------------------------------------------------

// [type byte, output name, reader function, data bytes, divisor].
var telemetryFields = [
    [0x02, "humidity", readU8, 1, 1],
    [0x03, "lux", readU16, 2, 1],
    [0x04, "pressure_mbar", readU16, 2, 1],
    [0x05, "iaq", readU16, 2, 1],
    [0x06, "o2perc", readU8, 1, 10],
    [0x07, "co_ppm", readU16, 2, 100],
    [0x08, "co2_ppm", readU16, 2, 1],
    [0x0A, "pollutants_kohm", readU16, 2, 10],
    [0x0D, "h2s_ppm", readU16, 2, 100],
    [0x12, "bvoc", readF32, 4, 1],
    [0x13, "det_count", readU32, 4, 1],
    [0x14, "occ_time_s", readU32, 4, 1],
    [0x16, "detection", readBoolean, 1, 1],
    [0x17, "temp_probe_1", readS16, 2, 10],
    [0x18, "temp_probe_2", readS16, 2, 10],
    [0x19, "temp_probe_3", readS16, 2, 10],
    [0x1A, "temp_probe_in_band_duration_s_1", readU32, 4, 1],
    [0x1B, "temp_probe_in_band_duration_s_2", readU32, 4, 1],
    [0x1C, "temp_probe_in_band_duration_s_3", readU32, 4, 1],
    [0x1D, "temp_probe_in_band_alarm_count_1", readU16, 2, 1],
    [0x1E, "temp_probe_in_band_alarm_count_2", readU16, 2, 1],
    [0x1F, "temp_probe_in_band_alarm_count_3", readU16, 2, 1],
    [0x20, "temp_probe_low_duration_s_1", readU32, 4, 1],
    [0x21, "temp_probe_low_duration_s_2", readU32, 4, 1],
    [0x22, "temp_probe_low_duration_s_3", readU32, 4, 1],
    [0x23, "temp_probe_low_alarm_count_1", readU16, 2, 1],
    [0x24, "temp_probe_low_alarm_count_2", readU16, 2, 1],
    [0x25, "temp_probe_low_alarm_count_3", readU16, 2, 1],
    [0x26, "temp_probe_high_duration_s_1", readU32, 4, 1],
    [0x27, "temp_probe_high_duration_s_2", readU32, 4, 1],
    [0x28, "temp_probe_high_duration_s_3", readU32, 4, 1],
    [0x29, "temp_probe_high_alarm_count_1", readU16, 2, 1],
    [0x2A, "temp_probe_high_alarm_count_2", readU16, 2, 1],
    [0x2B, "temp_probe_high_alarm_count_3", readU16, 2, 1],
    [0x2C, "dp_pa", readF32, 4, 1],
    [0x2D, "af_mps", readF32, 4, 1],
    [0x2E, "adc_v", readU16, 2, 1000],
    [0x2F, "adc_ma", readU16, 2, 1000],
    [0x30, "adc_kohm", readU16, 2, 10],
    [0x31, "leak_detect_event", readBoolean, 1, 1],
    [0x33, "gp_t_c", readS16, 2, 100],
    [0x34, "ll_depth_mm", readF32, 4, 1],
    [0x35, "ll_t_c", readS16, 2, 100],
    [0x36, "tvoc_min_mg_m3", readF32, 4, 1],
    [0x37, "tvoc_avg_mg_m3", readF32, 4, 1],
    [0x38, "tvoc_max_mg_m3", readF32, 4, 1],
    [0x39, "etoh_ppm", readF32, 4, 1],
    [0x3A, "tvoc_iaq", readF32, 4, 1],
    [0x3B, "rh", readU16, 2, 100],
    [0x3C, "comp_temp_c", readS16, 2, 10],
    [0x3D, "comp_rh", readU16, 2, 100],
    [0x3F, "co2e_ppm", readF32, 4, 1],
    [0x40, "cpu_temp_dep", readLegacyCpuTemp, 2, 1],
    [0x41, "batt_status", readU8, 1, 1],
    [0x42, "batt_mv", readU16, 2, 1],
    [0x43, "rx_rssi", readS16, 2, 1],
    [0x44, "rx_snr", readS8, 1, 1],
    [0x45, "rx_count", readU16, 2, 1],
    [0x46, "tx_time_ms", readU16, 2, 1],
    [0x47, "tx_power_dbm", readS8, 1, 1],
    [0x48, "tx_count", readU16, 2, 1],
    [0x49, "power_up_count", readU16, 2, 1],
    [0x4A, "usb_in_count", readU16, 2, 1],
    [0x4B, "login_ok_count", readU16, 2, 1],
    [0x4C, "login_fail_count", readU16, 2, 1],
    [0x4D, "fan_run_time_s", readU32, 4, 1],
    [0x4E, "cpu_temp", readS16, 2, 10],
    [0x50, "sound_min_dba", readF32, 4, 1],
    [0x51, "sound_avg_dba", readF32, 4, 1],
    [0x52, "sound_max_dba", readF32, 4, 1],
    [0x53, "no_ppm", readU16, 2, 100],
    [0x54, "no2_ppm", readU16, 2, 10000],
    [0x55, "no2_20_ppm", readU16, 2, 1000],
    [0x56, "so2_ppm", readU16, 2, 1000],
    [0x57, "mc_pm1_0", readF32, 4, 1],
    [0x58, "mc_pm2_5", readF32, 4, 1],
    [0x59, "mc_pm4_0", readF32, 4, 1],
    [0x5A, "mc_pm10_0", readF32, 4, 1],
    [0x5B, "nc_pm0_5", readF32, 4, 1],
    [0x5C, "nc_pm1_0", readF32, 4, 1],
    [0x5D, "nc_pm2_5", readF32, 4, 1],
    [0x5E, "nc_pm4_0", readF32, 4, 1],
    [0x5F, "nc_pm10_0", readF32, 4, 1],
    [0x60, "pm_tps", readF32, 4, 1],
    [0x67, "fast_aqi", readU16, 2, 1],
    [0x68, "epa_aqi", readU16, 2, 1],
    [0x69, "mc_pm0_1", readF32, 4, 1],
    [0x6A, "mc_pm0_3", readF32, 4, 1],
    [0x6B, "mc_pm0_5", readF32, 4, 1],
    [0x6C, "mc_pm5_0", readF32, 4, 1],
    [0x6D, "nc_pm0_1", readF32, 4, 1],
    [0x6E, "nc_pm0_3", readF32, 4, 1],
    [0x6F, "nc_pm5_0", readF32, 4, 1],
    [0x70, "de_event", readU16, 2, 1],
    [0x71, "de_smoke", readU16, 2, 1],
    [0x72, "de_vape", readU16, 2, 1],
    [0x73, "flam_count", readS32, 4, 1],
    [0x75, "rad_uptime_s", readU32, 4, 1],
    [0x76, "rad_ut_avg", readU16, 2, 1],
    [0x77, "rad_6h_avg", readU16, 2, 1],
    [0x78, "rad_12h_avg", readU16, 2, 1],
    [0x79, "rad_24h_avg", readU16, 2, 1],
    [0x7A, "rad_48h_avg", readU16, 2, 1],
    [0x7B, "rad_72h_avg", readU16, 2, 1],
    [0x7C, "rad_96h_avg", readU16, 2, 1]
];
var telemetryFieldByType = {};
for (var fieldIndex = 0; fieldIndex < telemetryFields.length; fieldIndex++) {
    telemetryFieldByType[telemetryFields[fieldIndex][0]] = telemetryFields[fieldIndex];
}

// Gas type table: [gas type, base output name].
var gasFields = [
    [0x17, "HCHO"], [0x18, "TVOC"], [0x19, "CO"], [0x1A, "Cl2"], [0x1B, "H2"], [0x1C, "H2S"], [0x1D, "HCl"], [0x1E, "HCN"],
    [0x1F, "HF"], [0x20, "NH3"], [0x21, "NO2"], [0x22, "O2"], [0x23, "O3"], [0x24, "SO2"], [0x25, "HBr"], [0x26, "Br2"],
    [0x27, "F2"], [0x28, "PH3"], [0x29, "AsH3"], [0x2A, "SiH4"], [0x2B, "GeH4"], [0x2C, "B2H6"], [0x2D, "BF3"], [0x2E, "WF6"],
    [0x2F, "SiF4"], [0x30, "XeF2"], [0x31, "TiF4"], [0x32, "Odour"], [0x33, "IAQ"], [0x34, "AQI"], [0x35, "NMHC"], [0x36, "SOx"],
    [0x37, "NOx"], [0x38, "NO"], [0x39, "C4H8"], [0x3A, "C3H8O2"], [0x3B, "CH4S"], [0x3C, "C8H8"], [0x3D, "C4H10"], [0x3E, "C4H6"],
    [0x3F, "C6H14"], [0x40, "C2H4O"], [0x41, "C3H9N"], [0x42, "C2H7N"], [0x43, "C2H6O"], [0x44, "CS2"], [0x45, "C2H6S"], [0x46, "C2H6S2"],
    [0x47, "C2H4"], [0x48, "CH3OH"], [0x49, "C6H6"], [0x4A, "C8H10"], [0x4B, "C7H8"], [0x4C, "CH3COOH"], [0x4D, "ClO2"], [0x4E, "H2O2"],
    [0x4F, "N2H4"], [0x50, "C2H8N2"], [0x51, "C2HCl3"], [0x52, "CHCl3"], [0x53, "C2H3Cl3"], [0x54, "H2Se"]
];
var gasFieldByType = {};
for (var gasIndex = 0; gasIndex < gasFields.length; gasIndex++) {
    gasFieldByType[gasFields[gasIndex][0]] = gasFields[gasIndex];
}

// Flammable gas class fields. Types 0x00 through 0x06 index this table.
var flammableFields = [
    "flam_no_gas", "flam_hydrogen", "flam_hydrogen_mix", "flam_methane",
    "flam_light", "flam_medium", "flam_heavy"
];

// [sensor ID, fault code, output field, message].
var faultFields = [
    [0x1C, 0x01, "fault_0x1C_01", "SPS30 Fan Speed Error"],
    [0x1C, 0x02, "fault_0x1C_02", "SPS30 Laser Failure"],
    [0x1C, 0x03, "fault_0x1C_03", "SPS30 Fan Failure"],
    [0x24, 0x01, "fault_0x24_01", "FGS CRC Error"],
    [0x24, 0x02, "fault_0x24_02", "FGS Bad Parameter"],
    [0x24, 0x05, "fault_0x24_05", "FGS Unknown Cmd"],
    [0x24, 0x07, "fault_0x24_07", "FGS Incomplete Cmd"],
    [0x24, 0x21, "fault_0x24_21", "FGS VDD Out of Range"],
    [0x24, 0x22, "fault_0x24_22", "FGS VREF Out of Range"],
    [0x24, 0x23, "fault_0x24_23", "FGS Env. Sensor Out of Range"],
    [0x24, 0x24, "fault_0x24_24", "FGS Env. Sensor Failed"],
    [0x24, 0x25, "fault_0x24_25", "FGS Microcontroller Error"],
    [0x24, 0x30, "fault_0x24_30", "FGS Sensor Read Negative"],
    [0x24, 0x31, "fault_0x24_31", "FGS Condensation Detected"],
    [0x24, 0x32, "fault_0x24_32", "FGS Sensor Error"],
    [0x24, 0x33, "fault_0x24_33", "FGS Gas detected during startup"],
    [0x24, 0x34, "fault_0x24_34", "FGS Slow Gas accumulation detected"],
    [0x24, 0x35, "fault_0x24_35", "FGS Breath/Humidity Surge"],
    [0x24, 0xF9, "fault_0x24_F9", "FGS Reply Timeout"],
    [0x24, 0xFA, "fault_0x24_FA", "FGS Incomplete reply"],
    [0x24, 0xFB, "fault_0x24_FB", "FGS CRC Error on reply"],
    [0x24, 0xFC, "fault_0x24_FC", "FGS Sensor restart"],
    [0x24, 0xFF, "fault_0x24_FF", "FGS Unknown Status"],
    [0x2D, 0x01, "fault_0x2D_01", "Radon Restarts"]
];
var faultFieldByType = {};
for (var faultIndex = 0; faultIndex < faultFields.length; faultIndex++) {
    var fault = faultFields[faultIndex];
    faultFieldByType[fault[0] + "_" + fault[1]] = fault;
}

// Standard downlink responses: [command byte, description].
var stdResponseCommands = [
    [0x01, "Set Antenna Gain"],
    [0x02, "Set Public"],
    [0x05, "Set AppEUI"],
    [0x06, "Set AppKEY"],
    [0x07, "Set ADR"],
    [0x08, "Set Duty Cycle"],
    [0x09, "Set Message Confirmation"],
    [0x0A, "Set TX Port"],
    [0x0B, "Set Data Rate"],
    [0x0C, "Set TX Interval"],
    [0x0D, "Set TX Power"],
    [0x0E, "Set RX Port"],
    [0x0F, "Set Join Check Interval"],
    [0x10, "Set Join Check Packet Type"],
    [0x11, "Set ATI Min"],
    [0x12, "Set ATI Max"],
    [0x13, "Set Full Packet Multiplier"],
    [0x14, "Set WELL defaults"],
    [0x15, "Set KPI Includes"],
    [0x16, "Set KPI Includes"],
    [0x20, "Set LUX Scale"],
    [0x21, "Set LUX Offset"],
    [0x22, "Set Case Fan Run Time"],
    [0x23, "Set Particle Sensor Fan Run Time"],
    [0x24, "Set CO2 Sensor Auto-Calib Enable/Disable Flag"],
    [0x25, "Set CO2 Sensor Auto-Calib Target"],
    [0x26, "Set CO2 Sensor to Known ppm"],
    [0x27, "Set SR CO2 Sensor to Factory Calib"],
    [0x28, "Set CO2 Sensor Regular Auto-Calib Interval"],
    [0x29, "Set GSS CO2 Sensor OOB Limits"],
    [0x2A, "Set GSS CO2 Sensor Initial Auto-Calib Interval"],
    [0x2B, "Set PM Sensor Run Period"],
    [0x2C, "Set PM Sensor Cleaning Interval"],
    [0x2D, "Set Gas Idle State"],
    [0x2E, "Set Gas Preamble Delay"],
    [0x2F, "Set Gas Number of Reads"],
    [0x30, "Set Gas Read Interval"],
    [0x31, "Set Gas Aggregation Method"],
    [0x32, "Set Gas EMA Factor"],
    [0x33, "Set Gas PPB trim value"],
    [0x34, "Set Gas UGM3 trim value"],
    [0x35, "Set Leak Sensor Alarm Mode"],
    [0x36, "Set Leak Sensor High Alarm Level"],
    [0x37, "Set Leak Sensor High Hysteresis"],
    [0x38, "Set Leak Sensor Low Alarm Level"],
    [0x39, "Set Leak Sensor Low Hysteresis"],
    [0x3A, "Set Leak Sensor Sample Time"],
    [0x3B, "Set Leak Sensor Test Time"],
    [0x3C, "Set VOC Sensor packet includes"],
    [0x3D, "Set SPS30 packet includes"],
    [0x3E, "Set PIERA/IPS7100 packet includes"],
    [0x3F, "Set DP/AF packet includes"],
    [0x40, "DP/AF trigger Auto-Zero process"],
    [0x41, "Set DP/AF delta offset"],
    [0x42, "Set TVOC Sensor packet includes"],
    [0x43, "Set Zone View Screen Refresh rate"],
    [0x44, "Set Zone View display top line option"],
    [0x45, "Set Zone View display temperature unit"],
    [0x46, "Set Zone View display comfort icon type"],
    [0x47, "Set Zone View display comfort icon location"],
    [0x48, "Set Zone View comfort logic"],
    [0x49, "Set Zone View display comfort icon status"],
    [0x4A, "Set Zone View internal logic low threshold"],
    [0x4B, "Set Zone View internal logic high threshold"],
    [0x4C, "Enable/Disable Zone View Help Screen"],
    [0x4D, "Enable/Disable Zone View Alert Screen"],
    [0x4E, "Show Zone View Alert Screen"],
    [0x4F, "Enable/Disable Zone View Buttons"],
    [0xD0, "Set Zone View text string"],
    [0xD1, "Set Zone View text string to factory default"],
    [0x50, "Enable/Disable EPA/Ozone Sensor"],
    [0x51, "Humidity data resolution changed"],
    [0x52, "EPA/Ozone Sensor Cleaning Triggered"],
    [0x53, "Cleaning triggered on TVOC Sensor"],
    [0x54, "Set threshold on human presence sensor"],
    [0x55, "Set hysteresis on human presence sensor"],
    [0x56, "Set inactivity on human presence sensor"],
    [0x57, "Counters and detection time set to zero on human presence sensor"],
    [0x58, "Human presence sensor reset"],
    [0x59, "FGS fault counters reset to zero"],
    [0x5A, "Radon sensor reset"],
    [0xFF, "Reboot"]
];
var stdResponseCommandByType = {};
for (var responseIndex = 0; responseIndex < stdResponseCommands.length; responseIndex++) {
    stdResponseCommandByType[stdResponseCommands[responseIndex][0]] = stdResponseCommands[responseIndex][1];
}

// --------------------------------------------------------------------------------------
// Packet-specific decode helpers
// --------------------------------------------------------------------------------------

function GetCrnMetal(id_byte) {
    var id = (id_byte & 0x7F);
    var metalNames = ["Unknown", "Copper", "Silver", "Chromium"];
    return metalNames[id] || "Error";
}

function decodeGas(bytes, index, output, unit) {
    var gasType = bytes[index + 1];
    var value = f32_2(bytes, index);
    var fields = gasFieldByType[gasType];
    var fieldName = fields ? fields[1] + "_" + unit : "";

    if (fieldName) {
        output[fieldName] = value;
    } else {
        output[unit == "ppb" ? "unknown_gas_ppb" : "unknown_gas_ugm3"] = value;
    }
}

function setNumberedField(output, prefix, item, suffix, value) {
    if (item >= 0 && item < 32) {
        var number = ("0" + (item + 1)).slice(-2);
        output[prefix + number + suffix] = value;
    }
}

function setAllFlammableValues(output, value) {
    for (var index = 0; index < flammableFields.length; index++) {
        output[flammableFields[index]] = value;
    }
}

function decodeFlammableGas(bytes, index, output) {
    var gasType = bytes[index + 1];
    var value = f32_2(bytes, index);
    output.flam_conc_lel_iso = value;
    setAllFlammableValues(output, 0);

    if (gasType >= 0x00 && gasType <= 0x06) {
        output[flammableFields[gasType]] = value;
    } else if (gasType == 0xFD) {
        output.flam_err_unknown_gas = value;
    } else if (gasType == 0xFE) {
        output.flam_err_under_range = value;
        setAllFlammableValues(output, -1);
    } else if (gasType == 0xFF) {
        output.flam_err_over_range = value;
        setAllFlammableValues(output, 110);
    } else {
        output.flam_unknown_type = gasType;
        output.flam_unknown_value = value;
    }
}

function decodeFault(bytes, index, output) {
    var sensorId = bytes[index + 1];
    var faultCode = bytes[index + 2];
    var count = U16((bytes[index + 3] << 8) | bytes[index + 4]);
    var fault = faultFieldByType[sensorId + "_" + faultCode];

    if (fault) {
        output[fault[2]] = fault[3] + ": " + count;
    } else if (sensorId == 0x1C) {
        output.fault_0x1C_x = "SPS30 General Error. Fault Code: " + faultCode + " Count: " + count;
    } else if (sensorId == 0x24) {
        output.fault_0x24_x = "FGS General Error. Fault Code: " + faultCode + " Count: " + count;
    } else if (sensorId == 0x2D) {
        output.fault_0x2D_x = "Radon General Error. Fault Code: " + faultCode + " Count: " + count;
    } else {
        output.fault_x = "Unknown Sensor ID: " + sensorId + " Fault Code: " + faultCode + " Count: " + count;
    }
}

function getRegType(byteval) {
    if (byteval == 3) return "Hold";
    if (byteval == 4) return "Inpt";
    return "Err";
}

function getDataType(byteval) {
    if (byteval === 0) return "U";
    if (byteval == 1) return "S";
    if (byteval == 2) return "F";
    return "Err";
}

function getWordOrder(byteval) {
    if (byteval === 0) return "HH";
    if (byteval == 1) return "HL";
    if (byteval == 2) return "LH";
    if (byteval == 3) return "LL";
    return "Err";
}

function getReadType(byteval) {
    if (byteval === 0) return "Int";
    if (byteval == 1) return "Cum";
    return "Err";
}

function decodeMBConfig(data) {
    var ret = "";
    if (data[5] === 0) {
        ret = "Item:" + data[4] + " Slot is Free";
    } else {
        ret = "Item:" + data[4] +
            " Slave:" + data[5] +
            " Reg:" + getRegType(data[6]) +
            " Addr:" + ((data[7] << 8) | data[8]) +
            " Data:" + getDataType(data[9]) + (16 * data[10]) +
            " Order:" + getWordOrder(data[11]) +
            " Mult:" + fromF32(data[12], data[13], data[14], data[15]) +
            " Read:" + getReadType(data[16]);
    }
    return ret;
}

function decodeMBValue(data) {
    var ret = "";
    if (data[5] == 0xFF) {
        ret = "Item:" + data[4] + " Slot is Free";
    } else if (data[5] === 0) {
        ret = "Item:" + data[4] +
            " Value:" + fromF32(data[6], data[7], data[8], data[9]);
    } else {
        ret = "Item:" + data[4] + "Exception:" + data[5];
        // Ignore last four chars, all zeros
    }
    return ret;
}

// --------------------------------------------------------------------------------------
// Protocol decoders
// --------------------------------------------------------------------------------------

function decodeTelemetry(data) {
    var cpn;
    var metal;
    var obj = {};
    for (var i = 0; i < data.length; i++) {
        // Scan data for known telemetry field types. If found, decode and add to output object.
        var fieldDecoder = telemetryFieldByType[data[i]];
        if (fieldDecoder) {
            var fieldValue = fieldDecoder[2](data, i);
            obj[fieldDecoder[1]] = fieldDecoder[4] == 1 ? fieldValue : fieldValue / fieldDecoder[4];
            i += fieldDecoder[3];
            continue;
        }
        // Scan data for more complex types.
        switch (data[i]) {
            // Parse enLink message for telemetry data
            case ENLINK_SYS_INFO:
                if (data[i + 1] === SYSID_FW_VER) {
                    //obj.ver_major = data[i + 2];
                    //obj.ver_minor = data[i + 3];
                    obj.fw_version = data[i + 2] + "." + ('0' + data[i + 3]).slice(-2);
                    i += 3;
                }
                if (data[i] === ENLINK_SYS_INFO) {
                    if (data[i + 1] === SENSID_PLUGIN_GAS) {
                        // Serial is in hex
                        obj.gas_serial = hex(data[i + 2]) + hex(data[i + 3]) + hex(data[i + 4]) + hex(data[i + 5]) + hex(data[i + 6]);
                        i += 6;
                    }
                }
                break;
            case ENLINK_TEMP: // Temperature
                obj.temperature_c = (S16((data[i + 1] << 8) | (data[i + 2]))) / 10;
                obj.temperature_c_fix_v7 = (t_fix_v7((data[i + 1] << 8) | data[i + 2])) / 10;
                //obj.temperature_f = ((obj.temperature_c * 9/5) + 32).toFixed(2);
                i += 2;
                break;
            case ENLINK_OZONE: // Ozone ppm and ppb
                obj.ozone_ppm = u16_1(data, i) / 10000;
                obj.ozone_ppb = u16_1(data, i) / 10;
                i += 2;
                break;
            case ENLINK_COUNTER:
                var input_no = data[i + 1];
                if (input_no >= 0 && input_no < 3) {
                    obj["pulse_ip" + (input_no + 1)] = u32_2(data, i);
                }
                i += 5;
                break;
            case ENLINK_MB_EXCEPTION:
                setNumberedField(obj, "mb_", data[i + 1], "_ex", data[i + 2]);
                i += 2;
                break;
            case ENLINK_MB_INTERVAL:
                setNumberedField(obj, "mb_", data[i + 1], "_int", f32_2(data, i));
                i += 5;
                break;
            case ENLINK_MB_CUMULATIVE:
                setNumberedField(obj, "mb_", data[i + 1], "_cum", f32_2(data, i));
                i += 5;
                break;
            case ENLINK_COS_STATUS: // Change-of-State U16
                // Byte 1 = Triggered, Byte 2 = Input state
                obj.cos_trig_byte = ('0' + (data[i + 1]).toString(16).toUpperCase()).slice(-2);
                if (data[i + 1] === 0) {
                    // Transmission was triggered with button press or ATI timeout
                    // So it's a 'heartbeat'
                    obj.cos_hb = true;
                } else {
                    // Transmission was triggered with a Change of State
                    // Transition detected for Closed to Open
                    if ((data[i + 1] & 0x01) > 0) obj.cos_ip_1_hl = true;
                    if ((data[i + 1] & 0x02) > 0) obj.cos_ip_2_hl = true;
                    if ((data[i + 1] & 0x04) > 0) obj.cos_ip_3_hl = true;

                    // Transition detected for Open to Closed
                    if ((data[i + 1] & 0x10) > 0) obj.cos_ip_1_lh = true;
                    if ((data[i + 1] & 0x20) > 0) obj.cos_ip_2_lh = true;
                    if ((data[i + 1] & 0x40) > 0) obj.cos_ip_3_lh = true;
                }
                // Input State
                obj.state_byte = ('0' + (data[i + 2]).toString(16).toUpperCase()).slice(-2);
                obj.state_ip_1 = (data[i + 2] & 0x01) > 0;
                obj.state_ip_2 = (data[i + 2] & 0x02) > 0;
                obj.state_ip_3 = (data[i + 2] & 0x04) > 0;

                i += 2;
                break;

            case ENLINK_GP_PRESSURE_PA: // 4 bytes F32, in Pascals. Typically up to 1MPa (10,000 mbar)
                obj.gp_pa = f32_1(data, i);
                obj.gp_kpa = f32_1(data, i) / 1000;
                obj.gp_mbar = f32_1(data, i) / 100;
                obj.gp_psi = f32_1(data, i) * 0.000145038;
                i += 4;
                break;
            case ENLINK_GAS_PPB:
                decodeGas(data, i, obj, "ppb");
                i += 5;
                break;

            case ENLINK_GAS_UGM3:
                decodeGas(data, i, obj, "ugm3");
                i += 5;
                break;

            case ENLINK_CRN_THK:
                // Coupon is either 1 or 2. Bit 7 set for Coupon 2
                cpn = (data[i + 1] & 0x80) === 0 ? 1 : 2;
                metal = GetCrnMetal(data[i + 1]);
                // Thickness in nanometres
                var thk_nm = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]).toFixed(2);
                obj["crn_" + cpn + "_metal"] = metal;
                obj["crn_" + cpn + "_thk_nm"] = thk_nm;
                i += 5;
                break;

            case ENLINK_CRN_MIN_THK:
                cpn = (data[i + 1] & 0x80) === 0 ? 1 : 2;
                metal = GetCrnMetal(data[i + 1]);
                // Minimum thickness of metal
                var min_nm = U16((data[i + 2] << 8) | (data[i + 3]));
                obj["crn_" + cpn + "_metal"] = metal;
                obj["crn_" + cpn + "_min_nm"] = min_nm;
                i += 3;
                break;

            case ENLINK_CRN_MAX_THK:
                cpn = (data[i + 1] & 0x80) === 0 ? 1 : 2;
                metal = GetCrnMetal(data[i + 1]);
                // Original thickness of metal
                var max_nm = U16((data[i + 2] << 8) | (data[i + 3]));
                obj["crn_" + cpn + "_metal"] = metal;
                obj["crn_" + cpn + "_max_nm"] = max_nm;
                i += 3;
                break;

            case ENLINK_CRN_PERC:
                cpn = (data[i + 1] & 0x80) === 0 ? 1 : 2;
                metal = GetCrnMetal(data[i + 1]);
                // Corrosion of coupon in percentage from Max(0%) to Min(100%)
                var perc = f32_2(data, i);
                obj["crn_" + cpn + "_metal"] = metal;
                obj["crn_" + cpn + "_perc"] = perc;
                i += 5;
                break;

            case ENLINK_FGS_FLAM_GAS:
                decodeFlammableGas(data, i, obj);
                i += 5;
                break;

            case ENLINK_ZV_ALERT_STATUS: // Zone View Alert Status
                // Byte 1 = Alert mode, Byte 2 = Read count
                obj.alert_mode = data[i + 1];
                obj.alert_mode_text = ["None", "Quiet", "Warning", "Locked"][data[i + 1]] || "Unknown";
                obj.alert_read_count = data[i + 2];
                i += 2;
                break;

            // Sensor fault report
            case ENLINK_FAULT:
                decodeFault(data, i, obj);
                i += 4;
                break;

            case ENLINK_HEADER: // Ignore this message
                obj.error = "Header byte received";
                i = data.length;
                break;

            default: // something is wrong with data
                obj.error = "Data Error at byte index " + i + "  Data: " + bytesToHexError(data, i);
                i = data.length;
                break;
        }
    }
    return obj;
}
// --------------------------------------------------------------------------------------
function decodeStdResponse(data) {
    var obj = {};
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

    if (data[2] == ENLINK_SEND_SYS_INFO) {
        // Only the ACK carries the version. A NACK with 0x00 is the reply to an unknown command
        if (data[1] == ENLINK_ACK && data.length >= 5) {
            obj.command = "Device Firmware Version: " + data[3] + "." + data[4];
        } else {
            obj.command = "Unknown command";
        }
    } else {
        var commandDescription = stdResponseCommandByType[data[2]];
        if (commandDescription) {
            obj.command = commandDescription;
        } else {
            obj.reply = "Unexpected Command byte. Data: " + bytesToHex(data);
        }
    }
    return obj;
}
// --------------------------------------------------------------------------------------
function decodeModbusResponse(data) {
    var msg_ok = false;
    var msg_ack = false;
    var obj = {};

    if (data[1] == ENLINK_ACK_V2) {
        obj.reply = "ACK";
        msg_ok = true;
        msg_ack = true;
    } else if (data[1] == ENLINK_NACK_V2) {
        obj.reply = "NACK";
        msg_ok = true;
    } else {
        obj.reply = "Reply parse failure";
    }
    if (msg_ok === true) {
        switch (data[2]) {
            case ENLINK_QRY_V2:
                if (data[3] == ENLINK_MB_DP_CONFIG) {
                    // QRY doesn't have sub command
                    if (msg_ack) {
                        obj.query = "MB QRY Config Reply: " + decodeMBConfig(data);
                    } else {
                        obj.query = "MB QRY Config Error for Item:" + data[4];
                    }
                } else if (data[3] == ENLINK_MB_DP_VALUE) {
                    if (msg_ack) {
                        obj.query = "MB QRY Value Reply: " + decodeMBValue(data);
                    } else {
                        obj.query = "MB QRY Value Error for Item:" + data[4];
                    }
                }
                break;
            case ENLINK_SET_V2:
                if (data[3] == ENLINK_MB_DP_CONFIG) {
                    // SET doesn't have sub command
                    if (msg_ack) {
                        obj.set = "MB SET Config Reply: " + decodeMBConfig(data);
                    } else {
                        obj.set = "MB SET Config Error for Item:" + data[4];
                    }
                }
                break;
            case ENLINK_CMD_V2:
                if (data[3] == ENLINK_MB_DP_CONFIG) {
                    // CMD does have Sub command
                    // Sub Command is Delete?
                    if (data[4] == ENLINK_MB_SC_DELETE) {
                        if (msg_ack) {
                            // R: = Return Val. 0=Already free else previous slave id
                            obj.command = "MB SubCmd Delete Item: " + data[5] + " R: " + data[6];
                        } else {
                            obj.command = "MB SubCmd Delete Error for Item:" + data[4];
                        }
                    }
                }
                break;

            default:
                break;
        }
    }

    if (msg_ok) {
        return obj;
    } else {
        return null;
    }
}

// --------------------------------------------------------------------------------------
// Top-level decoder dispatch
// --------------------------------------------------------------------------------------

function enlinkDecode(bytes) {
    // Validate input
    if (!bytes || !Array.isArray(bytes)) {
        return { error: "Invalid input: bytes must be an array" };
    }
    // Ignore empty payloads
    if (bytes) {
        if (bytes.length === 0) {
            return { message: "Is zero length" };
        }
        // Ignore single byte Join-Check payloads (Nov 2022)
        if (bytes.length === 1) {
            return { message: "Is single byte (Join Check possibly)" };
        }
    } else {
        return { message: "Is Empty" };
    }

    if (bytes[0] == ENLINK_HEADER) {
        // This is a reply to a downlink command
        return decodeStdResponse(bytes);
    }
    if (bytes[0] == ENLINK_MB_SYS) {
        // This is a Modbus Setting response
        return decodeModbusResponse(bytes);
    }
    return decodeTelemetry(bytes);
}
// -----------------------------------------------------------------------------
// Base64 -> byte array
// -----------------------------------------------------------------------------

function base64ToBytes(base64) {

    var chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

    var input = String(base64 || "")
        .replace(/\r/g, "")
        .replace(/\n/g, "")
        .replace(/\s/g, "");

    var bytes = [];

    for (var i = 0; i < input.length; i += 4) {

        var ch1 = input.charAt(i);
        var ch2 = input.charAt(i + 1);
        var ch3 = input.charAt(i + 2);
        var ch4 = input.charAt(i + 3);

        var e1 = chars.indexOf(ch1);
        var e2 = chars.indexOf(ch2);

        var e3 =
            (!ch3 || ch3 === "=")
            ? 64
            : chars.indexOf(ch3);

        var e4 =
            (!ch4 || ch4 === "=")
            ? 64
            : chars.indexOf(ch4);

        if (e1 < 0 || e2 < 0) {
            break;
        }

        bytes.push(
            ((e1 << 2) | (e2 >> 4)) & 0xFF
        );

        if (e3 !== 64 && e3 >= 0) {
            bytes.push(
                (((e2 & 15) << 4) | (e3 >> 2)) & 0xFF
            );
        }

        if (e4 !== 64 && e4 >= 0) {
            bytes.push(
                (((e3 & 3) << 6) | e4) & 0xFF
            );
        }
    }

    return bytes;
}


// -----------------------------------------------------------------------------
// Add a Datacake measurement
// -----------------------------------------------------------------------------

function addDatacakeReading(readings, device, field, value) {

    if (value === null || typeof value === "undefined") {
        return;
    }

    var valueType = typeof value;

    if (
        valueType !== "number" &&
        valueType !== "string" &&
        valueType !== "boolean"
    ) {
        return;
    }

    readings.push({
        device: device,
        field: String(field).toUpperCase(),
        value: value
    });
}


// -----------------------------------------------------------------------------
// Datacake multi-device resolver
// -----------------------------------------------------------------------------

function normaliseSerial(value) {
    return String(value || "")
        .replace(/[^0-9a-zA-Z]/g, "")
        .toLowerCase();
}

function resolveDatacakeDevice(serial) {

    var wanted = normaliseSerial(serial);
    var matchId = null;

    // deviceSerialToId is supplied by Datacake to API/MQTT decoders.
    if (typeof deviceSerialToId !== "undefined" && deviceSerialToId) {

        // First try the exact serial in the common forms.
        if (deviceSerialToId[serial]) {
            return deviceSerialToId[serial];
        }

        if (deviceSerialToId[String(serial).toLowerCase()]) {
            return deviceSerialToId[String(serial).toLowerCase()];
        }

        if (deviceSerialToId[String(serial).toUpperCase()]) {
            return deviceSerialToId[String(serial).toUpperCase()];
        }

        // Then compare every Product serial after normalisation. This copes
        // with upper/lower case and separators such as ':' or '-'.
        for (var configuredSerial in deviceSerialToId) {
            if (!deviceSerialToId.hasOwnProperty(configuredSerial)) {
                continue;
            }

            if (normaliseSerial(configuredSerial) === wanted) {
                matchId = deviceSerialToId[configuredSerial];
            }
        }

        if (matchId) {
            return matchId;
        }

        // MULTI-DEVICE SAFETY:
        // Do not fall back to the only device in the Product. Every physical
        // enLink must have its own Datacake API device whose Custom Serial
        // matches the ChirpStack DevEUI (case/separators are ignored).
    }

    // No matching Datacake device was found. Return null so this uplink is
    // ignored rather than being written to the wrong physical device.
    return null;
}


// -----------------------------------------------------------------------------
// DATACAKE MQTT ENTRY POINT
// -----------------------------------------------------------------------------

function Decoder(topic, payload) {

    var message;

    try {
        message = JSON.parse(payload);
    }
    catch (e) {
        return [];
    }

    if (
        !message.deviceInfo ||
        !message.deviceInfo.devEui ||
        !message.data
    ) {
        return [];
    }

    // ---------------------------------------------------------
    // Extract the ChirpStack DevEUI.
    // Prefer the MQTT topic and fall back to deviceInfo.devEui.
    // ---------------------------------------------------------

    var devEui = null;

    var topicMatch = String(topic).match(
        /\/device\/([0-9a-fA-F]{16})\/event\/up$/
    );

    if (topicMatch && topicMatch[1]) {
        devEui = topicMatch[1].toLowerCase();
    }
    else if (message.deviceInfo.devEui) {
        devEui = String(message.deviceInfo.devEui).toLowerCase();
    }

    if (!devEui) {
        return [];
    }

    // Resolve the DevEUI / custom serial to Datacake's internal Device UUID.
    var device = resolveDatacakeDevice(devEui);

    if (!device) {
        return [];
    }

    // ---------------------------------------------------------
    // Decode ChirpStack Base64 LoRaWAN payload
    // ---------------------------------------------------------

    var bytes = base64ToBytes(message.data);
    var decoded = enlinkDecode(bytes);

    if (!decoded) {
        return [];
    }

    // ---------------------------------------------------------
    // Convert decoded enLink data into Datacake readings
    // ---------------------------------------------------------

    var readings = [];

    for (var field in decoded) {

        if (!decoded.hasOwnProperty(field)) {
            continue;
        }

        if (
            field === "error" ||
            field === "message" ||
            field === "reply" ||
            field === "command" ||
            field === "query" ||
            field === "set"
        ) {
            continue;
        }

        addDatacakeReading(
            readings,
            device,
            field,
            decoded[field]
        );
    }

    // LoRaWAN frame information
    if (typeof message.fCnt === "number") {
        addDatacakeReading(readings, device, "FCNT", message.fCnt);
    }

    if (typeof message.fPort === "number") {
        addDatacakeReading(readings, device, "FPORT", message.fPort);
    }

    if (typeof message.dr === "number") {
        addDatacakeReading(readings, device, "DATA_RATE", message.dr);
    }

    // Best gateway RSSI / SNR
    if (message.rxInfo && message.rxInfo.length > 0) {

        var bestRssi = null;
        var bestSnr = null;

        for (var r = 0; r < message.rxInfo.length; r++) {

            if (typeof message.rxInfo[r].rssi === "number") {
                if (bestRssi === null || message.rxInfo[r].rssi > bestRssi) {
                    bestRssi = message.rxInfo[r].rssi;
                }
            }

            if (typeof message.rxInfo[r].snr === "number") {
                if (bestSnr === null || message.rxInfo[r].snr > bestSnr) {
                    bestSnr = message.rxInfo[r].snr;
                }
            }
        }

        if (bestRssi !== null) {
            addDatacakeReading(readings, device, "LORAWAN_RSSI", bestRssi);
        }

        if (bestSnr !== null) {
            addDatacakeReading(readings, device, "LORAWAN_SNR", bestSnr);
        }
    }

    return readings;
}
