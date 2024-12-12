// Synetica Indoor and Outdoor Air Quality (IAQ/OAQ) Codec for Chirpstack v3 and v4
// 12 Dec 2024 (FW Ver:7.04)
// https://github.com/synetica/enlink-decoder

// Uplink Data
// Standard
var ENLINK_TEMP = 0x01;
var ENLINK_RH = 0x02;
var ENLINK_HIRES_RH = 0x3B;

// L
var ENLINK_LUX = 0x03;

// V
var ENLINK_PRESSURE = 0x04;
var ENLINK_VOC_IAQ = 0x05;
var ENLINK_BVOC = 0x12;
var ENLINK_CO2E = 0x3F;

// C
var ENLINK_CO2 = 0x08;

// I (PBAQ)
var ENLINK_MIN_TVOC = 0x36;
var ENLINK_AVG_TVOC = 0x37;
var ENLINK_MAX_TVOC = 0x38;
var ENLINK_ETOH = 0x39;
var ENLINK_TVOC_IAQ = 0x3A;

// D (OAQ Only)
var ENLINK_FAST_AQI = 0x67;
var ENLINK_EPA_AQI = 0x68;

// O and G
var ENLINK_GAS_PPB = 0x61;		// O and G
var ENLINK_GAS_UGM3 = 0x66;		// G only

// Gas Type Byte
var GAS_HCHO = 0x17;
var GAS_TVOC = 0x18;
var GAS_CO = 0x19;
var GAS_Cl2 = 0x1A;
var GAS_H2 = 0x1B;
var GAS_H2S = 0x1C;
var GAS_HCl = 0x1D;
var GAS_HCN = 0x1E;
var GAS_HF = 0x1F;
var GAS_NH3 = 0x20;
var GAS_NO2 = 0x21;
var GAS_O2 = 0x22;
var GAS_O3 = 0x23;
var GAS_SO2 = 0x24;
var GAS_HBr = 0x25;
var GAS_Br2 = 0x26;
var GAS_F2 = 0x27;
var GAS_PH3 = 0x28;
var GAS_AsH3 = 0x29;
var GAS_SiH4 = 0x2A;
var GAS_GeH4 = 0x2B;
var GAS_B2H6 = 0x2C;
var GAS_BF3 = 0x2D;
var GAS_WF6 = 0x2E;
var GAS_SiF4 = 0x2F;
var GAS_XeF2 = 0x30;
var GAS_TiF4 = 0x31;
var GAS_Odour = 0x32;
var GAS_IAQ = 0x33;
var GAS_AQI = 0x34;
var GAS_NMHC = 0x35;
var GAS_SOx = 0x36;
var GAS_NOx = 0x37;
var GAS_NO = 0x38;
var GAS_C4H8 = 0x39;
var GAS_C3H8O2 = 0x3A;
var GAS_CH4S = 0x3B;
var GAS_C8H8 = 0x3C;
var GAS_C4H10 = 0x3D;
var GAS_C4H6 = 0x3E;
var GAS_C6H14 = 0x3F;
var GAS_C2H4O = 0x40;
var GAS_C3H9N = 0x41;
var GAS_C2H7N = 0x42;
var GAS_C2H6O = 0x43;
var GAS_CS2 = 0x44;
var GAS_C2H6S = 0x45;
var GAS_C2H6S2 = 0x46;
var GAS_C2H4 = 0x47;
var GAS_CH3OH = 0x48;
var GAS_C6H6 = 0x49;
var GAS_C8H10 = 0x4A;
var GAS_C7H8 = 0x4B;
var GAS_CH3COOH = 0x4C;
var GAS_ClO2 = 0x4D;
var GAS_H2O2 = 0x4E;
var GAS_N2H4 = 0x4F;
var GAS_C2H8N2 = 0x50;
var GAS_C2HCl3 = 0x51;
var GAS_CHCl3 = 0x52;
var GAS_C2H3Cl3 = 0x53;
var GAS_H2Se = 0x54;


// S
var ENLINK_SOUND_MIN = 0x50;
var ENLINK_SOUND_AVG = 0x51;
var ENLINK_SOUND_MAX = 0x52;

// P+
var ENLINK_MC_PM1_0 = 0x57;
var ENLINK_MC_PM2_5 = 0x58;
var ENLINK_MC_PM4_0 = 0x59;
var ENLINK_MC_PM10_0 = 0x5A;
var ENLINK_NC_PM0_5 = 0x5B;
var ENLINK_NC_PM1_0 = 0x5C;
var ENLINK_NC_PM2_5 = 0x5D;
var ENLINK_NC_PM4_0 = 0x5E;
var ENLINK_NC_PM10_0 = 0x5F;
var ENLINK_PM_TPS = 0x60;

// PP
var ENLINK_MC_PM0_1 = 0x69;
var ENLINK_MC_PM0_3 = 0x6A;
var ENLINK_MC_PM0_5 = 0x6B;
var ENLINK_MC_PM5_0 = 0x6C;
var ENLINK_NC_PM0_1 = 0x6D;
var ENLINK_NC_PM0_3 = 0x6E;
var ENLINK_NC_PM5_0 = 0x6F;

// PV (Vape)
// IPS7100 Particulate Detection Events - type counts
var ENLINK_DE_EVENT = 0x70;
var ENLINK_DE_SMOKE = 0x71;
var ENLINK_DE_VAPE = 0x72;

// Optional KPI values that can be included in the message
var ENLINK_CPU_TEMP_DEP = 0x40;
var ENLINK_BATT_STATUS = 0x41;
var ENLINK_BATT_VOLT = 0x42;
var ENLINK_RX_RSSI = 0x43;
var ENLINK_RX_SNR = 0x44;
var ENLINK_RX_COUNT = 0x45;
var ENLINK_TX_TIME = 0x46;
var ENLINK_TX_POWER = 0x47;
var ENLINK_TX_COUNT = 0x48;
var ENLINK_POWER_UP_COUNT = 0x49;
var ENLINK_USB_IN_COUNT = 0x4A;
var ENLINK_LOGIN_OK_COUNT = 0x4B;
var ENLINK_LOGIN_FAIL_COUNT = 0x4C;
var ENLINK_FAN_RUN_TIME = 0x4D;
var ENLINK_CPU_TEMP = 0x4E;

// --------------------------------------------------------------------------------------
// Downlink reply message Header and ACK/NAK
var ENLINK_HEADER = 0xA5;
var ENLINK_ACK = 0x06;
var ENLINK_NACK = 0x15;

// Downlink reply message values
var ENLINK_SET_ANT_GAIN = 0x01;
var ENLINK_SET_PUBLIC = 0x02;
var ENLINK_SET_APPEUI = 0x05;   // 8 bytes
var ENLINK_SET_APPKEY = 0x06;   // 16 bytes
var ENLINK_SET_ADR = 0x07;
var ENLINK_SET_DUTY_CYCLE = 0x08;
var ENLINK_SET_MSG_ACK = 0x09;
var ENLINK_SET_TX_PORT = 0x0A;
var ENLINK_SET_DR_INDEX = 0x0B;   // Data Rate Index 0~6
var ENLINK_SET_TX_INDEX = 0x0C;   // Data Rate Index 0~10
var ENLINK_SET_POW_INDEX = 0x0D;   // Data Rate Index 0~6
var ENLINK_SET_RX_PORT = 0x0E;
var ENLINK_SET_JC_INTERVAL = 0x0F;    // Join Check Interval
var ENLINK_SET_JC_PKT_TYPE = 0x10;    // Join Check Packet Type
var ENLINK_SET_ATI_MIN = 0x11;
var ENLINK_SET_ATI_MAX = 0x12;
var ENLINK_SET_FULL_PKT_MUL = 0x13;
var ENLINK_SET_WELL_DEFAULT = 0x14;
var ENLINK_SET_KPI_INCLUDES_DIRECT = 0x15;
var ENLINK_SET_KPI_INCLUDES_INDEX = 0x16;
// Lux Sensor
var ENLINK_SET_LUX_SCALE = 0x20;
var ENLINK_SET_LUX_OFFSET = 0x21;
// CO2 Sensors
var ENLINK_SET_CO2_CALIB_ENABLE = 0x24;
var ENLINK_SET_CO2_TARGET_PPM = 0x25;
var ENLINK_SET_CO2_KNOWN_PPM = 0x26;
// 0x27 Sunrise CO2 Only
var ENLINK_SET_SR_CO2_FACTORY_CALIB = 0x27;
var ENLINK_SET_CO2_REGULAR_INTERVAL = 0x28;
// 0x29,0x30 GSS CO2 Only
var ENLINK_SET_GSS_CO2_OOB_LIMITS = 0x29;
var ENLINK_SET_GSS_CO2_INIT_INTERVAL = 0x2A;
// Set PM options
var ENLINK_SET_PM_RUN_PERIOD = 0x2B;
var ENLINK_SET_PM_CLEANING_PERIOD = 0x2C;
// Set Gas Sensor options
var ENLINK_SET_GAS_IDLE_STATE = 0x2D;
var ENLINK_SET_GAS_PRE_DELAY = 0x2E;
var ENLINK_SET_GAS_NUM_READS = 0x2F;
var ENLINK_SET_GAS_READ_INT = 0x30;
var ENLINK_SET_GAS_AGG_METHOD = 0x31;
var ENLINK_SET_GAS_EMA_FACTOR = 0x32;
var ENLINK_SET_GAS_TRIM_PPB = 0x33;
var ENLINK_SET_GAS_TRIM_UGM3 = 0x34;
// Radio packet includes for VOC and Particulate sensors
var ENLINK_BME680_PKT_INC = 0x3C;
var ENLINK_SPS30_PKT_INC = 0x3D;
var ENLINK_PIERA_PKT_INC = 0x3E;
// Enable/Disable the EPA sensor
const ENLINK_ENABLE_EPA = 0x50;

var ENLINK_REBOOT = 0xFF;

// --------------------------------------------------------------------------------------
// Convert binary value bit to Signed 8 bit
function S8(bin) {
    var num = bin & 0xFF;
    if (0x80 & num)
        num = -(0x0100 - num);
    return num;
}
// Convert binary value bit to Signed 16 bit
function S16(bin) {
    var num = bin & 0xFFFF;
    if (0x8000 & num)
        num = -(0x010000 - num);
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
// Convert 4 IEEE754 bytes
function fromF32(byte0, byte1, byte2, byte3) {
    var bits = (byte0 << 24) | (byte1 << 16) | (byte2 << 8) | (byte3);
    var sign = ((bits >>> 31) === 0) ? 1.0 : -1.0;
    var e = ((bits >>> 23) & 0xff);
    var m = (e === 0) ? (bits & 0x7fffff) << 1 : (bits & 0x7fffff) | 0x800000;
    var f = sign * m * Math.pow(2, e - 150);
    return parseFloat(f.toFixed(3));
}
// --------------------------------------------------------------------------------------
// Function to decode enLink Messages
function decodeTelemetry(data) {
    var obj = new Object();

    for (var i = 0; i < data.length; i++) {
        switch (data[i]) {
            // Parse Sensor Message Parts
            case ENLINK_TEMP: // Temperature
                obj.temp_c = (S16((data[i + 1] << 8) | (data[i + 2]))) / 10;
                //obj.temp_f = ((obj.temp_c * 9 / 5) + 32);
                i += 2;
                break;
            case ENLINK_RH: // Humidity %rH
                obj.humidity = (data[i + 1]);
                i += 1;
                break;
            case ENLINK_HIRES_RH: // Humidity %rH
                obj.rh = (U16((data[i + 1] << 8) | (data[i + 2]))) / 100;
                i += 2;
                break;

            // L
            case ENLINK_LUX: // Light Level lux
                obj.lux = U16((data[i + 1] << 8) | (data[i + 2]));
                i += 2;
                break;

            // V
            case ENLINK_PRESSURE: // Barometric Pressure
                obj.pressure = U16((data[i + 1] << 8) | (data[i + 2]));
                i += 2;
                break;
            case ENLINK_VOC_IAQ: // Indoor Air Quality (0-500)
                obj.iaq = U16((data[i + 1] << 8) | (data[i + 2]));
                i += 2;
                break;
            case ENLINK_BVOC:     // Breath VOC Estimate equivalent
                obj.bvoc = fromF32(data[i + 1], data[i + 2], data[i + 3], data[i + 4]);
                i += 4;
                break;
            case ENLINK_CO2E: // CO2e Estimate Equivalent
                obj.co2e_ppm = fromF32(data[i + 1], data[i + 2], data[i + 3], data[i + 4]);
                i += 4;
                break;

            // C
            case ENLINK_CO2: // Carbon Dioxide
                obj.co2_ppm = U16((data[i + 1] << 8) | (data[i + 2]));
                i += 2;
                break;

            // I
            case ENLINK_MIN_TVOC:
                obj.tvoc_min_mg_m3 = fromF32(data[i + 1], data[i + 2], data[i + 3], data[i + 4]);
                i += 4;
                break;
            case ENLINK_AVG_TVOC:
                obj.tvoc_avg_mg_m3 = fromF32(data[i + 1], data[i + 2], data[i + 3], data[i + 4]);
                i += 4;
                break;
            case ENLINK_MAX_TVOC:
                obj.tvoc_max_mg_m3 = fromF32(data[i + 1], data[i + 2], data[i + 3], data[i + 4]);
                i += 4;
                break;
            case ENLINK_ETOH: // Ethanol equivalent
                obj.etoh_ppm = fromF32(data[i + 1], data[i + 2], data[i + 3], data[i + 4]);
                i += 4;
                break;
            case ENLINK_TVOC_IAQ:
                obj.tvoc_iaq = fromF32(data[i + 1], data[i + 2], data[i + 3], data[i + 4]);
                i += 4;
                break;

            // D
            case ENLINK_FAST_AQI:
                obj.fast_aqi = U16((data[i + 1] << 8) | (data[i + 2]));
                i += 2;
                break;

            case ENLINK_EPA_AQI:
                obj.epa_aqi = U16((data[i + 1] << 8) | (data[i + 2]));
                i += 2;
                break;

            // O and G	
            case ENLINK_GAS_PPB:
                switch (data[i + 1]) {
                    case GAS_HCHO:
                        obj.HCHO_ppm = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
                        break;
                    case GAS_TVOC:
                        obj.TVOC_ppm = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
                        break;
                    case GAS_CO:
                        obj.CO_ppm = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
                        break;
                    case GAS_Cl2:
                        obj.Cl2_ppm = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
                        break;
                    case GAS_H2:
                        obj.H2_ppm = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
                        break;
                    case GAS_H2S:
                        obj.H2S_ppm = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
                        break;
                    case GAS_HCl:
                        obj.HCl_ppm = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
                        break;
                    case GAS_HCN:
                        obj.HCN_ppm = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
                        break;
                    case GAS_HF:
                        obj.HF_ppm = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
                        break;
                    case GAS_NH3:
                        obj.NH3_ppm = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
                        break;
                    case GAS_NO2:
                        obj.NO2_ppm = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
                        break;
                    case GAS_O2:
                        obj.O2_ppm = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
                        break;
                    case GAS_O3:
                        obj.O3_ppm = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
                        break;
                    case GAS_SO2:
                        obj.SO2_ppm = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
                        break;
                    case GAS_HBr:
                        obj.HBr_ppm = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
                        break;
                    case GAS_Br2:
                        obj.Br2_ppm = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
                        break;
                    case GAS_F2:
                        obj.F2_ppm = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
                        break;
                    case GAS_PH3:
                        obj.PH3_ppm = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
                        break;
                    case GAS_AsH3:
                        obj.AsH3_ppm = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
                        break;
                    case GAS_SiH4:
                        obj.SiH4_ppm = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
                        break;
                    case GAS_GeH4:
                        obj.GeH4_ppm = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
                        break;
                    case GAS_B2H6:
                        obj.B2H6_ppm = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
                        break;
                    case GAS_BF3:
                        obj.BF3_ppm = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
                        break;
                    case GAS_WF6:
                        obj.WF6_ppm = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
                        break;
                    case GAS_SiF4:
                        obj.SiF4_ppm = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
                        break;
                    case GAS_XeF2:
                        obj.XeF2_ppm = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
                        break;
                    case GAS_TiF4:
                        obj.TiF4_ppm = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
                        break;
                    case GAS_Odour:
                        obj.Odour_ppm = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
                        break;
                    case GAS_IAQ:
                        obj.IAQ_ppm = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
                        break;
                    case GAS_AQI:
                        obj.AQI_ppm = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
                        break;
                    case GAS_NMHC:
                        obj.NMHC_ppm = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
                        break;
                    case GAS_SOx:
                        obj.SOx_ppm = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
                        break;
                    case GAS_NOx:
                        obj.NOx_ppm = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
                        break;
                    case GAS_NO:
                        obj.NO_ppm = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
                        break;
                    case GAS_C4H8:
                        obj.C4H8_ppm = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
                        break;
                    case GAS_C3H8O2:
                        obj.C3H8O2_ppm = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
                        break;
                    case GAS_CH4S:
                        obj.CH4S_ppm = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
                        break;
                    case GAS_C8H8:
                        obj.C8H8_ppm = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
                        break;
                    case GAS_C4H10:
                        obj.C4H10_ppm = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
                        break;
                    case GAS_C4H6:
                        obj.C4H6_ppm = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
                        break;
                    case GAS_C6H14:
                        obj.C6H14_ppm = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
                        break;
                    case GAS_C2H4O:
                        obj.C2H4O_ppm = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
                        break;
                    case GAS_C3H9N:
                        obj.C3H9N_ppm = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
                        break;
                    case GAS_C2H7N:
                        obj.C2H7N_ppm = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
                        break;
                    case GAS_C2H6O:
                        obj.C2H6O_ppm = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
                        break;
                    case GAS_CS2:
                        obj.CS2_ppm = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
                        break;
                    case GAS_C2H6S:
                        obj.C2H6S_ppm = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
                        break;
                    case GAS_C2H6S2:
                        obj.C2H6S2_ppm = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
                        break;
                    case GAS_C2H4:
                        obj.C2H4_ppm = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
                        break;
                    case GAS_CH3OH:
                        obj.CH3OH_ppm = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
                        break;
                    case GAS_C6H6:
                        obj.C6H6_ppm = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
                        break;
                    case GAS_C8H10:
                        obj.C8H10_ppm = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
                        break;
                    case GAS_C7H8:
                        obj.C7H8_ppm = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
                        break;
                    case GAS_CH3COOH:
                        obj.CH3COOH_ppm = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
                        break;
                    case GAS_ClO2:
                        obj.ClO2_ppm = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
                        break;
                    case GAS_H2O2:
                        obj.H2O2_ppm = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
                        break;
                    case GAS_N2H4:
                        obj.N2H4_ppm = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
                        break;
                    case GAS_C2H8N2:
                        obj.C2H8N2_ppm = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
                        break;
                    case GAS_C2HCl3:
                        obj.C2HCl3_ppm = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
                        break;
                    case GAS_CHCl3:
                        obj.CHCl3_ppm = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
                        break;
                    case GAS_C2H3Cl3:
                        obj.C2H3Cl3_ppm = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
                        break;
                    case GAS_H2Se:
                        obj.H2Se_ppm = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
                        break;

                }
                i += 5;
                break;

            case ENLINK_GAS_UGM3:
                switch (data[i + 1]) {
                    case GAS_HCHO:
                        obj.HCHO_ugm3 = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
                        break;
                    case GAS_TVOC:
                        obj.TVOC_ugm3 = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
                        break;
                    case GAS_CO:
                        obj.CO_ugm3 = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
                        break;
                    case GAS_Cl2:
                        obj.Cl2_ugm3 = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
                        break;
                    case GAS_H2:
                        obj.H2_ugm3 = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
                        break;
                    case GAS_H2S:
                        obj.H2S_ugm3 = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
                        break;
                    case GAS_HCl:
                        obj.HCl_ugm3 = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
                        break;
                    case GAS_HCN:
                        obj.HCN_ugm3 = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
                        break;
                    case GAS_HF:
                        obj.HF_ugm3 = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
                        break;
                    case GAS_NH3:
                        obj.NH3_ugm3 = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
                        break;
                    case GAS_NO2:
                        obj.NO2_ugm3 = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
                        break;
                    case GAS_O2:
                        obj.O2_ugm3 = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
                        break;
                    case GAS_O3:
                        obj.O3_ugm3 = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
                        break;
                    case GAS_SO2:
                        obj.SO2_ugm3 = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
                        break;
                    case GAS_HBr:
                        obj.HBr_ugm3 = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
                        break;
                    case GAS_Br2:
                        obj.Br2_ugm3 = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
                        break;
                    case GAS_F2:
                        obj.F2_ugm3 = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
                        break;
                    case GAS_PH3:
                        obj.PH3_ugm3 = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
                        break;
                    case GAS_AsH3:
                        obj.AsH3_ugm3 = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
                        break;
                    case GAS_SiH4:
                        obj.SiH4_ugm3 = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
                        break;
                    case GAS_GeH4:
                        obj.GeH4_ugm3 = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
                        break;
                    case GAS_B2H6:
                        obj.B2H6_ugm3 = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
                        break;
                    case GAS_BF3:
                        obj.BF3_ugm3 = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
                        break;
                    case GAS_WF6:
                        obj.WF6_ugm3 = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
                        break;
                    case GAS_SiF4:
                        obj.SiF4_ugm3 = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
                        break;
                    case GAS_XeF2:
                        obj.XeF2_ugm3 = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
                        break;
                    case GAS_TiF4:
                        obj.TiF4_ugm3 = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
                        break;
                    case GAS_Odour:
                        obj.Odour_ugm3 = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
                        break;
                    case GAS_IAQ:
                        obj.IAQ_ugm3 = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
                        break;
                    case GAS_AQI:
                        obj.AQI_ugm3 = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
                        break;
                    case GAS_NMHC:
                        obj.NMHC_ugm3 = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
                        break;
                    case GAS_SOx:
                        obj.SOx_ugm3 = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
                        break;
                    case GAS_NOx:
                        obj.NOx_ugm3 = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
                        break;
                    case GAS_NO:
                        obj.NO_ugm3 = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
                        break;
                    case GAS_C4H8:
                        obj.C4H8_ugm3 = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
                        break;
                    case GAS_C3H8O2:
                        obj.C3H8O2_ugm3 = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
                        break;
                    case GAS_CH4S:
                        obj.CH4S_ugm3 = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
                        break;
                    case GAS_C8H8:
                        obj.C8H8_ugm3 = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
                        break;
                    case GAS_C4H10:
                        obj.C4H10_ugm3 = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
                        break;
                    case GAS_C4H6:
                        obj.C4H6_ugm3 = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
                        break;
                    case GAS_C6H14:
                        obj.C6H14_ugm3 = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
                        break;
                    case GAS_C2H4O:
                        obj.C2H4O_ugm3 = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
                        break;
                    case GAS_C3H9N:
                        obj.C3H9N_ugm3 = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
                        break;
                    case GAS_C2H7N:
                        obj.C2H7N_ugm3 = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
                        break;
                    case GAS_C2H6O:
                        obj.C2H6O_ugm3 = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
                        break;
                    case GAS_CS2:
                        obj.CS2_ugm3 = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
                        break;
                    case GAS_C2H6S:
                        obj.C2H6S_ugm3 = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
                        break;
                    case GAS_C2H6S2:
                        obj.C2H6S2_ugm3 = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
                        break;
                    case GAS_C2H4:
                        obj.C2H4_ugm3 = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
                        break;
                    case GAS_CH3OH:
                        obj.CH3OH_ugm3 = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
                        break;
                    case GAS_C6H6:
                        obj.C6H6_ugm3 = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
                        break;
                    case GAS_C8H10:
                        obj.C8H10_ugm3 = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
                        break;
                    case GAS_C7H8:
                        obj.C7H8_ugm3 = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
                        break;
                    case GAS_CH3COOH:
                        obj.CH3COOH_ugm3 = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
                        break;
                    case GAS_ClO2:
                        obj.ClO2_ugm3 = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
                        break;
                    case GAS_H2O2:
                        obj.H2O2_ugm3 = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
                        break;
                    case GAS_N2H4:
                        obj.N2H4_ugm3 = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
                        break;
                    case GAS_C2H8N2:
                        obj.C2H8N2_ugm3 = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
                        break;
                    case GAS_C2HCl3:
                        obj.C2HCl3_ugm3 = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
                        break;
                    case GAS_CHCl3:
                        obj.CHCl3_ugm3 = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
                        break;
                    case GAS_C2H3Cl3:
                        obj.C2H3Cl3_ugm3 = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
                        break;
                    case GAS_H2Se:
                        obj.H2Se_ugm3 = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
                        break;
                }
                i += 5;
                break;

            // S
            case ENLINK_SOUND_MIN:
                obj.sound_min_dba = fromF32(data[i + 1], data[i + 2], data[i + 3], data[i + 4]);
                i += 4;
                break;
            case ENLINK_SOUND_AVG:
                obj.sound_avg_dba = fromF32(data[i + 1], data[i + 2], data[i + 3], data[i + 4]);
                i += 4;
                break;
            case ENLINK_SOUND_MAX:
                obj.sound_max_dba = fromF32(data[i + 1], data[i + 2], data[i + 3], data[i + 4]);
                i += 4;
                break;

            // P+ Mass Concentration
            case ENLINK_MC_PM1_0:
                obj.mc_pm1_0 = fromF32(data[i + 1], data[i + 2], data[i + 3], data[i + 4]);
                i += 4;
                break;
            case ENLINK_MC_PM2_5:
                obj.mc_pm2_5 = fromF32(data[i + 1], data[i + 2], data[i + 3], data[i + 4]);
                i += 4;
                break;
            case ENLINK_MC_PM4_0:
                obj.mc_pm4_0 = fromF32(data[i + 1], data[i + 2], data[i + 3], data[i + 4]);
                i += 4;
                break;
            case ENLINK_MC_PM10_0:
                obj.mc_pm10_0 = fromF32(data[i + 1], data[i + 2], data[i + 3], data[i + 4]);
                i += 4;
                break;
            // P+ Number Concentration (Count)
            case ENLINK_NC_PM0_5:
                obj.nc_pm0_5 = fromF32(data[i + 1], data[i + 2], data[i + 3], data[i + 4]);
                i += 4;
                break;
            case ENLINK_NC_PM1_0:
                obj.nc_pm1_0 = fromF32(data[i + 1], data[i + 2], data[i + 3], data[i + 4]);
                i += 4;
                break;
            case ENLINK_NC_PM2_5:
                obj.nc_pm2_5 = fromF32(data[i + 1], data[i + 2], data[i + 3], data[i + 4]);
                i += 4;
                break;
            case ENLINK_NC_PM4_0:
                obj.nc_pm4_0 = fromF32(data[i + 1], data[i + 2], data[i + 3], data[i + 4]);
                i += 4;
                break;
            case ENLINK_NC_PM10_0:
                obj.nc_pm10_0 = fromF32(data[i + 1], data[i + 2], data[i + 3], data[i + 4]);
                i += 4;
                break;
            // P+ Typical Particle Size
            case ENLINK_PM_TPS:
                obj.pm_tps = fromF32(data[i + 1], data[i + 2], data[i + 3], data[i + 4]);
                i += 4;
                break;

            // PP
            case ENLINK_MC_PM0_1:
                obj.mc_pm0_1 = fromF32(data[i + 1], data[i + 2], data[i + 3], data[i + 4]);
                i += 4;
                break;
            case ENLINK_MC_PM0_3:
                obj.mc_pm0_3 = fromF32(data[i + 1], data[i + 2], data[i + 3], data[i + 4]);
                i += 4;
                break;
            case ENLINK_MC_PM0_5:
                obj.mc_pm0_5 = fromF32(data[i + 1], data[i + 2], data[i + 3], data[i + 4]);
                i += 4;
                break;
            case ENLINK_MC_PM5_0:
                obj.mc_pm5_0 = fromF32(data[i + 1], data[i + 2], data[i + 3], data[i + 4]);
                i += 4;
                break;
            case ENLINK_NC_PM0_1:
                obj.nc_pm0_1 = fromF32(data[i + 1], data[i + 2], data[i + 3], data[i + 4]);
                i += 4;
                break;
            case ENLINK_NC_PM0_3:
                obj.nc_pm0_3 = fromF32(data[i + 1], data[i + 2], data[i + 3], data[i + 4]);
                i += 4;
                break;
            case ENLINK_NC_PM5_0:
                obj.nc_pm5_0 = fromF32(data[i + 1], data[i + 2], data[i + 3], data[i + 4]);
                i += 4;
                break;

            // PV
            case ENLINK_DE_EVENT:
                /* Particle Detection Event */
                /* Event raised, not yet identified */
                obj.de_event = U16((data[i + 1] << 8) | (data[i + 2]));
                i += 2;
                break;
            case ENLINK_DE_SMOKE:
                /* Smoke particles identified */
                obj.de_smoke = U16((data[i + 1] << 8) | (data[i + 2]));
                i += 2;
                break;
            case ENLINK_DE_VAPE:
                /* Vape particles identified */
                obj.de_vape = U16((data[i + 1] << 8) | (data[i + 2]));
                i += 2;
                break;

            // < -------------------------------------------------------------------------------->
            // Optional KPIs
            case ENLINK_CPU_TEMP_DEP:    // Optional from April 2020
                obj.cpu_temp_dep = data[i + 1] + (Math.round(data[i + 2] * 100 / 256) / 100);
                i += 2;
                break;
            case ENLINK_CPU_TEMP:    // New for April 2020 Ver: 4.9
                obj.cpu_temp = (S16((data[i + 1] << 8) | (data[i + 2]))) / 10;
                i += 2;
                break;
            case ENLINK_BATT_STATUS:
                obj.batt_status = data[i + 1];
                i += 1;
                break;
            case ENLINK_BATT_VOLT:
                //obj.batt_v = U16((data[i + 1] << 8) | (data[i + 2])) / 1000;
                obj.batt_mv = U16((data[i + 1] << 8) | (data[i + 2]));
                i += 2;
                break;
            case ENLINK_RX_RSSI:
                obj.rx_rssi = S16((data[i + 1] << 8) | (data[i + 2]));
                i += 2;
                break;
            case ENLINK_RX_SNR:
                obj.rx_snr = S8(data[i + 1]);
                i += 1;
                break;
            case ENLINK_RX_COUNT:
                obj.rx_count = U16((data[i + 1] << 8) | (data[i + 2]));
                i += 2;
                break;
            case ENLINK_TX_TIME:
                obj.tx_time_ms = U16((data[i + 1] << 8) | (data[i + 2]));
                i += 2;
                break;
            case ENLINK_TX_POWER:
                obj.tx_power_dbm = S8(data[i + 1]);
                i += 1;
                break;
            case ENLINK_TX_COUNT:
                obj.tx_count = U16((data[i + 1] << 8) | (data[i + 2]));
                i += 2;
                break;
            case ENLINK_POWER_UP_COUNT:
                obj.power_up_count = U16((data[i + 1] << 8) | (data[i + 2]));
                i += 2;
                break;
            case ENLINK_USB_IN_COUNT:
                obj.usb_in_count = U16((data[i + 1] << 8) | (data[i + 2]));
                i += 2;
                break;
            case ENLINK_LOGIN_OK_COUNT:
                obj.login_ok_count = U16((data[i + 1] << 8) | (data[i + 2]));
                i += 2;
                break;
            case ENLINK_LOGIN_FAIL_COUNT:
                obj.login_fail_count = U16((data[i + 1] << 8) | (data[i + 2]));
                i += 2;
                break;

            default: // something is wrong with data
                obj.error = "Error at index " + i + "  Byte value " + data[i];
                i = data.length;
                break;
        }
    }
    return obj;
}

// --------------------------------------------------------------------------------------
// Function to decode enLink response to downlink message
function decodeStdResponse(data) {
    var obj = {};
    for (var i = 0; i < data.length; i++) {
        switch (data[i]) {
            // Parse reply from device following a downlink command
            case ENLINK_HEADER:
                if (data[i + 1] == ENLINK_ACK) {
                    obj.reply = "ACK";
                } else if (data[i + 1] == ENLINK_NACK) {
                    obj.reply = "NACK";
                } else {
                    obj.reply = "Reply parse failure";
                }

                if (data[i + 2] == ENLINK_SET_ANT_GAIN) {
                    obj.command = "Set Antenna Gain";
                } else if (data[i + 2] == ENLINK_SET_PUBLIC) {
                    obj.command = "Set Public";
                } else if (data[i + 2] == ENLINK_SET_APPEUI) {
                    obj.command = "Set AppEUI";
                } else if (data[i + 2] == ENLINK_SET_APPKEY) {
                    obj.command = "Set AppKEY";
                } else if (data[i + 2] == ENLINK_SET_ADR) {
                    obj.command = "Set ADR";
                } else if (data[i + 2] == ENLINK_SET_DUTY_CYCLE) {
                    obj.command = "Set Duty Cycle";
                } else if (data[i + 2] == ENLINK_SET_MSG_ACK) {
                    obj.command = "Set Message Confirmation";
                } else if (data[i + 2] == ENLINK_SET_TX_PORT) {
                    obj.command = "Set TX Port";
                } else if (data[i + 2] == ENLINK_SET_DR_INDEX) {
                    obj.command = "Set Data Rate";
                } else if (data[i + 2] == ENLINK_SET_TX_INDEX) {
                    obj.command = "Set TX Interval";
                } else if (data[i + 2] == ENLINK_SET_POW_INDEX) {
                    obj.command = "Set TX Power";
                } else if (data[i + 2] == ENLINK_SET_RX_PORT) {
                    obj.command = "Set RX Port";
                } else if (data[i + 2] == ENLINK_SET_JC_INTERVAL) {
                    obj.command = "Set Join Check Interval";
                } else if (data[i + 2] == ENLINK_SET_JC_PKT_TYPE) {
                    obj.command = "Set Join Check Packet Type";
                } else if (data[i + 2] == ENLINK_SET_ATI_MIN) {
                    obj.command = "Set ATI Min";
                } else if (data[i + 2] == ENLINK_SET_ATI_MAX) {
                    obj.command = "Set ATI Max";
                } else if (data[i + 2] == ENLINK_SET_FULL_PKT_MUL) {
                    obj.command = "Set Full Packet Multiplier";
                } else if (data[i + 2] == ENLINK_SET_WELL_DEFAULT) {
                    obj.command = "Set WELL defaults";
                } else if (data[i + 2] == ENLINK_SET_KPI_INCLUDES_DIRECT) {
                    obj.command = "Set KPI Includes";
                } else if (data[i + 2] == ENLINK_SET_KPI_INCLUDES_INDEX) {
                    obj.command = "Set KPI Includes";
                    
                } else if (data[i + 2] == ENLINK_SET_LUX_SCALE) {
                    obj.command = "Set LUX Scale";
                } else if (data[i + 2] == ENLINK_SET_LUX_OFFSET) {
                    obj.command = "Set LUX Offset";

                } else if (data[i + 2] == ENLINK_SET_CO2_CALIB_ENABLE) {
                    obj.command = "Set CO2 Sensor Auto-Calib Enable/Disable Flag";
                } else if (data[i + 2] == ENLINK_SET_CO2_TARGET_PPM) {
                    obj.command = "Set CO2 Sensor Auto-Calib Target";
                } else if (data[i + 2] == ENLINK_SET_CO2_KNOWN_PPM) {
                    obj.command = "Set CO2 Sensor to Known ppm";
                    // Sunrise Sensor Only
                } else if (data[i + 2] == ENLINK_SET_SR_CO2_FACTORY_CALIB) {
                    obj.command = "Set SR CO2 Sensor to Factory Calib";
                } else if (data[i + 2] == ENLINK_SET_CO2_REGULAR_INTERVAL) {
                    obj.command = "Set CO2 Sensor Regular Auto-Calib Interval";
                    // GSS CO2 Only
                } else if (data[i + 2] == ENLINK_SET_GSS_CO2_OOB_LIMITS) {
                    obj.command = "Set GSS CO2 Sensor OOB Limits";
                } else if (data[i + 2] == ENLINK_SET_GSS_CO2_INIT_INTERVAL) {
                    obj.command = "Set GSS CO2 Sensor Initial Auto-Calib Interval";
                    // PM Sensors
                } else if (data[i + 2] == ENLINK_SET_PM_RUN_PERIOD) {
                    obj.command = "Set PM Sensor Run Period";
                } else if (data[i + 2] == ENLINK_SET_PM_CLEANING_PERIOD) {
                    obj.command = "Set PM Sensor Cleaning Interval";
                    // Gas Sensors
                } else if (data[i + 2] == ENLINK_SET_GAS_IDLE_STATE) {
                    obj.command = "Set Gas Idle State";
                } else if (data[i + 2] == ENLINK_SET_GAS_PRE_DELAY) {
                    obj.command = "Set Gas Preamble Delay";
                } else if (data[i + 2] == ENLINK_SET_GAS_NUM_READS) {
                    obj.command = "Set Gas Number of Reads";
                } else if (data[i + 2] == ENLINK_SET_GAS_READ_INT) {
                    obj.command = "Set Gas Read Interval";
                } else if (data[i + 2] == ENLINK_SET_GAS_AGG_METHOD) {
                    obj.command = "Set Gas Aggregation Method";
                } else if (data[i + 2] == ENLINK_SET_GAS_EMA_FACTOR) {
                    obj.command = "Set Gas EMA Factor";
                } else if (data[i + 2] == ENLINK_SET_GAS_TRIM_PPB) {
                    obj.command = "Set Gas PPB trim value";
                } else if (data[i + 2] == ENLINK_SET_GAS_TRIM_UGM3) {
                    obj.command = "Set Gas UGM3 trim value";

                } else if (data[i + 2] == ENLINK_BME680_PKT_INC) {
                    obj.command = "Set VOC Sensor packet includes";
                } else if (data[i + 2] == ENLINK_SPS30_PKT_INC) {
                    obj.command = "Set SPS30 packet includes";
                } else if (data[i + 2] == ENLINK_PIERA_PKT_INC) {
                    obj.command = "Set PIERA/IPS7100 packet includes";

                } else if (data[i + 2] == ENLINK_ENABLE_EPA) {
                    obj.command = "Enable/Disable EPA Sensor";

                } else if (data[i + 2] == ENLINK_REBOOT) {
                    obj.command = "Reboot";
                } else {
                    obj.command = "Command parse failure: " + data[i + 2];
                }

                i = data.length;
                break;

            default: // Ignore this message
                i = data.length;
                break;
        }
    }
    return obj;
}

// --------------------------------------------------------------------------------------
// Function to switch between Telemetry or downlink reply
function enlinkDecode(bytes) {
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
    return decodeTelemetry(bytes);
}

// --------------------------------------------------------------------------------------
// Chirpstack Version 3
// Decode decodes an array of bytes into an object.
//  - fPort contains the LoRaWAN fPort number
//  - bytes is an array of bytes, e.g. [225, 230, 255, 0]
//  - variables contains the device variables e.g. {"calibration": "3.5"} (both the key / value are of type string)
// The function must return an object, e.g. {"temperature": 22.5}
function Decode(fPort, bytes, variables) {
    return {
        data: enlinkDecode(bytes)
    };
}

// --------------------------------------------------------------------------------------
// Chirpstack Version 4
// Decode uplink function.
//
// Input is an object with the following fields:
// - bytes = Byte array containing the uplink payload, e.g. [255, 230, 255, 0]
// - fPort = Uplink fPort.
// - variables = Object containing the configured device variables.
//
// Output must be an object with the following fields:
// - data = Object representing the decoded payload.
function decodeUplink(input) {
    return {
        data: enlinkDecode(input.bytes)
    };
}
