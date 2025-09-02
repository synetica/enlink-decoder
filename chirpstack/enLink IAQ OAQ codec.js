// Synetica Indoor and Outdoor Air Quality (IAQ/OAQ) Codec for Chirpstack v3 and v4
// 20 Aug 2025 (FW Ver:7.16)
// 24 Apr 2025 Includes Temperature fix
// https://github.com/synetica/enlink-decoder


// Show complex data as either an array, a simple data value, or both.
var show_array = 1;		// zero or 1
var show_simple = 1;

// Uplink Data
// Standard
var ENLINK_TEMP = 0x01;
var ENLINK_RH = 0x02;
var ENLINK_HIRES_RH = 0x3B;
// Additions for IAQ+/IAQ-Vape
var ENLINK_COMP_TEMP_C = 0x3C;
var ENLINK_COMP_RH = 0x3D;

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

// N
var ENLINK_MPS_CYCLECOUNT = 0x73;
var ENLINK_MPS_FLAM_GAS = 0x74;

// Flam Gas Type Byte
var FLAM_NONE = 0x00;
var FLAM_HYDROGEN = 0x01;
var FLAM_HYD_MIX = 0x02;
var FLAM_METHANE = 0x03;
var FLAM_LIGHT = 0x04;
var FLAM_MEDIUM = 0x05;
var FLAM_HEAVY = 0x06;
var FLAM_UNKNOWN = 0xFD;
var FLAM_UNDER_RNG = 0xFE;
var FLAM_OVER_RNG = 0xFF;

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

var ENLINK_FAULT = 0xFE;

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

var ENLINK_ZMOD4410_PKT_INC = 0x42;
var ENLINK_ENABLE_Z45 = 0x50;
var ENLINK_HUMIDITY_TX_RES = 0x51;
var ENLINK_Z45_TRIG_CLEAN = 0x52;
var ENLINK_Z44_TRIG_CLEAN = 0x53;

// MPS Sensor
var ENLINK_MPS_RESET_COUNTERS = 0x59;

var ENLINK_REBOOT = 0xFF;

// Utility function
function bytesToHex(bytes) {
    var result = "";
    for (var i = 0; i < bytes.length; i += 1) {
        result += ('0' + (bytes[i]).toString(16).toUpperCase() + ' ').slice(-3);
    }
    return result.trim();
}

// --------------------------------------------------------------------------------------
// Function to decode enLink Messages
function decodeTelemetry(data) {

    // Workaround Fix for OAQ/IAQ/ZN2/ZV v7.01~7.09
    function t_fix_v7(t) {
        var num = t & 0xFFFF;
        if (0x8000 & num)
            num = 655 + num;
        return num & 0xFFFF;
    }

    // Convert binary value bit to Signed 16 bit
    function S16(bin) {
        var num = bin & 0xFFFF;
        if (0x8000 & num)
            num = -(0x010000 - num);
        return num;
    }
    // Convert binary value bit to Signed 8 bit
    function S8(bin) {
        var num = bin & 0xFF;
        if (0x80 & num)
            num = -(0x0100 - num);
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
                return "Trimethylamine";     //C3H9N
            case 0x42:
                return "Dimethylamine";     //C2H7N
            case 0x43:
                return "Ethyl Alcohol(Ethanol)";     //C2H6O
            case 0x44:
                return "Carbon Disulphide";     //CS2
            case 0x45:
                return "Dimethyl Sulphide";     //C2H6S
            case 0x46:
                return "Dimethyl Disulphide";     //C2H6S2
            case 0x47:
                return "Ethylene";     //C2H4
            case 0x48:
                return "Methanol";     //CH3OH
            case 0x49:
                return "Benzene";     //C6H6
            case 0x4A:
                return "Paraxylene";     //C8H10
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
    // Return flammable gas name from gas type byte
    function GetFlamGasName(gas_type) {
        switch (gas_type) {
            case 0x00:
                return "No Gas";
            case 0x01:
                return "Hydrogen";
            case 0x02:
                return "Hydrogen Mixture";
            case 0x03:
                return "Methane";
            case 0x04:
                return "Light Gas";
            case 0x05:
                return "Medium Gas";
            case 0x06:
                return "Heavy Gas";
            case 0xFD:
                return "Err: Unknown Gas";
            case 0xFE:
                return "Err: Under Range";
            case 0xFF:
                return "Err: Over Range";
        }
        return "Unknown";
    }

    var obj = new Object();

    for (var i = 0; i < data.length; i++) {
        switch (data[i]) {
            // Parse Sensor Message Parts
            case ENLINK_TEMP: // Temperature
                obj.temp_c = (S16((data[i + 1] << 8) | (data[i + 2]))) / 10;
                obj.temp_c_fix_v7 = (t_fix_v7((data[i + 1] << 8) | data[i + 2])) / 10;
                //obj.temp_f = ((obj.temp_c * 9 / 5) + 32);
                i += 2;
                break;
            case ENLINK_COMP_TEMP_C: // Compensated Temperature
                obj.comp_temp_c = (S16((data[i + 1] << 8) | (data[i + 2]))) / 10;
                i += 2;
                break;
            case ENLINK_RH: // Humidity %rH
                obj.humidity = (data[i + 1]);
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

            // L
            case ENLINK_LUX: // Light Level lux
                obj.lux = u16_1(data, i);
                i += 2;
                break;

            // V
            case ENLINK_PRESSURE: // Barometric Pressure
                obj.pressure = u16_1(data, i);
                i += 2;
                break;
            case ENLINK_VOC_IAQ: // Indoor Air Quality (0-500)
                obj.iaq = u16_1(data, i);
                i += 2;
                break;
            case ENLINK_BVOC:     // Breath VOC Estimate equivalent
                obj.bvoc = f32_1(data, i);
                i += 4;
                break;
            case ENLINK_CO2E: // CO2e Estimate Equivalent
                obj.co2e_ppm = f32_1(data, i);
                i += 4;
                break;

            // C
            case ENLINK_CO2: // Carbon Dioxide
                obj.co2_ppm = u16_1(data, i);
                i += 2;
                break;

            // I
            case ENLINK_MIN_TVOC:
                obj.tvoc_min_mg_m3 = f32_1(data, i);
                i += 4;
                break;
            case ENLINK_AVG_TVOC:
                obj.tvoc_avg_mg_m3 = f32_1(data, i);
                i += 4;
                break;
            case ENLINK_MAX_TVOC:
                obj.tvoc_max_mg_m3 = f32_1(data, i);
                i += 4;
                break;
            case ENLINK_ETOH: // Ethanol equivalent
                obj.etoh_ppm = f32_1(data, i);
                i += 4;
                break;
            case ENLINK_TVOC_IAQ:
                obj.tvoc_iaq = f32_1(data, i);
                i += 4;
                break;

            // D
            case ENLINK_FAST_AQI:
                obj.fast_aqi = u16_1(data, i);
                i += 2;
                break;

            case ENLINK_EPA_AQI:
                obj.epa_aqi = u16_1(data, i);
                i += 2;
                break;

            // O and G	
            case ENLINK_GAS_PPB:
                var gas_ppb_val = f32_2(data, i);
                if (show_array == 1) {
                    // Need to create array as device might have multiple sensors
                    // Values as array triplet
                    if (obj.gas_ppb) {
                        obj.gas_ppb.push([data[i + 1], GetGasName(data[i + 1]), gas_ppb_val]);
                    } else {
                        obj.gas_ppb = [[data[i + 1], GetGasName(data[i + 1]), gas_ppb_val]];
                    }
                }
                if (show_simple == 1) {
                    switch (data[i + 1]) {
                        case GAS_HCHO:
                            obj.HCHO_ppb = gas_ppb_val
                            break;
                        case GAS_TVOC:
                            obj.TVOC_ppb = gas_ppb_val
                            break;
                        case GAS_CO:
                            obj.CO_ppb = gas_ppb_val
                            break;
                        case GAS_Cl2:
                            obj.Cl2_ppb = gas_ppb_val
                            break;
                        case GAS_H2:
                            obj.H2_ppb = gas_ppb_val
                            break;
                        case GAS_H2S:
                            obj.H2S_ppb = gas_ppb_val
                            break;
                        case GAS_HCl:
                            obj.HCl_ppb = gas_ppb_val
                            break;
                        case GAS_HCN:
                            obj.HCN_ppb = gas_ppb_val
                            break;
                        case GAS_HF:
                            obj.HF_ppb = gas_ppb_val
                            break;
                        case GAS_NH3:
                            obj.NH3_ppb = gas_ppb_val
                            break;
                        case GAS_NO2:
                            obj.NO2_ppb = gas_ppb_val
                            break;
                        case GAS_O2:
                            obj.O2_ppb = gas_ppb_val
                            break;
                        case GAS_O3:
                            obj.O3_ppb = gas_ppb_val
                            break;
                        case GAS_SO2:
                            obj.SO2_ppb = gas_ppb_val
                            break;
                        case GAS_HBr:
                            obj.HBr_ppb = gas_ppb_val
                            break;
                        case GAS_Br2:
                            obj.Br2_ppb = gas_ppb_val
                            break;
                        case GAS_F2:
                            obj.F2_ppb = gas_ppb_val
                            break;
                        case GAS_PH3:
                            obj.PH3_ppb = gas_ppb_val
                            break;
                        case GAS_AsH3:
                            obj.AsH3_ppb = gas_ppb_val
                            break;
                        case GAS_SiH4:
                            obj.SiH4_ppb = gas_ppb_val
                            break;
                        case GAS_GeH4:
                            obj.GeH4_ppb = gas_ppb_val
                            break;
                        case GAS_B2H6:
                            obj.B2H6_ppb = gas_ppb_val
                            break;
                        case GAS_BF3:
                            obj.BF3_ppb = gas_ppb_val
                            break;
                        case GAS_WF6:
                            obj.WF6_ppb = gas_ppb_val
                            break;
                        case GAS_SiF4:
                            obj.SiF4_ppb = gas_ppb_val
                            break;
                        case GAS_XeF2:
                            obj.XeF2_ppb = gas_ppb_val
                            break;
                        case GAS_TiF4:
                            obj.TiF4_ppb = gas_ppb_val
                            break;
                        case GAS_Odour:
                            obj.Odour_ppb = gas_ppb_val
                            break;
                        case GAS_IAQ:
                            obj.IAQ_ppb = gas_ppb_val
                            break;
                        case GAS_AQI:
                            obj.AQI_ppb = gas_ppb_val
                            break;
                        case GAS_NMHC:
                            obj.NMHC_ppb = gas_ppb_val
                            break;
                        case GAS_SOx:
                            obj.SOx_ppb = gas_ppb_val
                            break;
                        case GAS_NOx:
                            obj.NOx_ppb = gas_ppb_val
                            break;
                        case GAS_NO:
                            obj.NO_ppb = gas_ppb_val
                            break;
                        case GAS_C4H8:
                            obj.C4H8_ppb = gas_ppb_val
                            break;
                        case GAS_C3H8O2:
                            obj.C3H8O2_ppb = gas_ppb_val
                            break;
                        case GAS_CH4S:
                            obj.CH4S_ppb = gas_ppb_val
                            break;
                        case GAS_C8H8:
                            obj.C8H8_ppb = gas_ppb_val
                            break;
                        case GAS_C4H10:
                            obj.C4H10_ppb = gas_ppb_val
                            break;
                        case GAS_C4H6:
                            obj.C4H6_ppb = gas_ppb_val
                            break;
                        case GAS_C6H14:
                            obj.C6H14_ppb = gas_ppb_val
                            break;
                        case GAS_C2H4O:
                            obj.C2H4O_ppb = gas_ppb_val
                            break;
                        case GAS_C3H9N:
                            obj.C2H9N_ppb = gas_ppb_val
                            break;
                        case GAS_C2H7N:
                            obj.C2H7N_ppb = gas_ppb_val
                            break;
                        case GAS_C2H6O:
                            obj.C2H6O_ppb = gas_ppb_val
                            break;
                        case GAS_CS2:
                            obj.CS2_ppb = gas_ppb_val
                            break;
                        case GAS_C2H6S:
                            obj.C2H6S_ppb = gas_ppb_val
                            break;
                        case GAS_C2H6S2:
                            obj.C2H6S2_ppb = gas_ppb_val
                            break;
                        case GAS_C2H4:
                            obj.C2H4_ppb = gas_ppb_val
                            break;
                        case GAS_CH3OH:
                            obj.CH3OH_ppb = gas_ppb_val
                            break;
                        case GAS_C6H6:
                            obj.C6H6_ppb = gas_ppb_val
                            break;
                        case GAS_C8H10:
                            obj.C8H10_ppb = gas_ppb_val
                            break;
                        case GAS_C7H8:
                            obj.C7H8_ppb = gas_ppb_val
                            break;
                        case GAS_CH3COOH:
                            obj.CH3COOH_ppb = gas_ppb_val
                            break;
                        case GAS_ClO2:
                            obj.ClO2_ppb = gas_ppb_val
                            break;
                        case GAS_H2O2:
                            obj.H2O2_ppb = gas_ppb_val
                            break;
                        case GAS_N2H4:
                            obj.N2H4_ppb = gas_ppb_val
                            break;
                        case GAS_C2H8N2:
                            obj.C2H8N2_ppb = gas_ppb_val
                            break;
                        case GAS_C2HCl3:
                            obj.C2HCl3_ppb = gas_ppb_val
                            break;
                        case GAS_CHCl3:
                            obj.CHCl3_ppb = gas_ppb_val
                            break;
                        case GAS_C2H3Cl3:
                            obj.C2H3Cl3_ppb = gas_ppb_val
                            break;
                        case GAS_H2Se:
                            obj.H2Se_ppb = gas_ppb_val
                            break;
                        default:
                            obj.unknown_gas_ppm = gas_ppb_val
                            break;
                    }
                }
                i += 5;
                break;

            case ENLINK_GAS_UGM3:
                var gas_ugm3_val = f32_2(data, i);
                if (show_array == 1) {
                    // Need to create array as device might have multiple sensors
                    // As Array
                    if (obj.gas_ugm3) {
                        obj.gas_ugm3.push([data[i + 1], GetGasName(data[i + 1]), gas_ugm3_val]);
                    } else {
                        obj.gas_ugm3 = [[data[i + 1], GetGasName(data[i + 1]), gas_ugm3_val]];
                    }
                }
                if (show_simple == 1) {
                    switch (data[i + 1]) {
                        case GAS_HCHO:
                            obj.HCHO_ugm3 = gas_ugm3_val
                            break;
                        case GAS_TVOC:
                            obj.TVOC_ugm3 = gas_ugm3_val
                            break;
                        case GAS_CO:
                            obj.CO_ugm3 = gas_ugm3_val
                            break;
                        case GAS_Cl2:
                            obj.Cl2_ugm3 = gas_ugm3_val
                            break;
                        case GAS_H2:
                            obj.H2_ugm3 = gas_ugm3_val
                            break;
                        case GAS_H2S:
                            obj.H2S_ugm3 = gas_ugm3_val
                            break;
                        case GAS_HCl:
                            obj.HCl_ugm3 = gas_ugm3_val
                            break;
                        case GAS_HCN:
                            obj.HCN_ugm3 = gas_ugm3_val
                            break;
                        case GAS_HF:
                            obj.HF_ugm3 = gas_ugm3_val
                            break;
                        case GAS_NH3:
                            obj.NH3_ugm3 = gas_ugm3_val
                            break;
                        case GAS_NO2:
                            obj.NO2_ugm3 = gas_ugm3_val
                            break;
                        case GAS_O2:
                            obj.O2_ugm3 = gas_ugm3_val
                            break;
                        case GAS_O3:
                            obj.O3_ugm3 = gas_ugm3_val
                            break;
                        case GAS_SO2:
                            obj.SO2_ugm3 = gas_ugm3_val
                            break;
                        case GAS_HBr:
                            obj.HBr_ugm3 = gas_ugm3_val
                            break;
                        case GAS_Br2:
                            obj.Br2_ugm3 = gas_ugm3_val
                            break;
                        case GAS_F2:
                            obj.F2_ugm3 = gas_ugm3_val
                            break;
                        case GAS_PH3:
                            obj.PH3_ugm3 = gas_ugm3_val
                            break;
                        case GAS_AsH3:
                            obj.AsH3_ugm3 = gas_ugm3_val
                            break;
                        case GAS_SiH4:
                            obj.SiH4_ugm3 = gas_ugm3_val
                            break;
                        case GAS_GeH4:
                            obj.GeH4_ugm3 = gas_ugm3_val
                            break;
                        case GAS_B2H6:
                            obj.B2H6_ugm3 = gas_ugm3_val
                            break;
                        case GAS_BF3:
                            obj.BF3_ugm3 = gas_ugm3_val
                            break;
                        case GAS_WF6:
                            obj.WF6_ugm3 = gas_ugm3_val
                            break;
                        case GAS_SiF4:
                            obj.SiF4_ugm3 = gas_ugm3_val
                            break;
                        case GAS_XeF2:
                            obj.XeF2_ugm3 = gas_ugm3_val
                            break;
                        case GAS_TiF4:
                            obj.TiF4_ugm3 = gas_ugm3_val
                            break;
                        case GAS_Odour:
                            obj.Odour_ugm3 = gas_ugm3_val
                            break;
                        case GAS_IAQ:
                            obj.IAQ_ugm3 = gas_ugm3_val
                            break;
                        case GAS_AQI:
                            obj.AQI_ugm3 = gas_ugm3_val
                            break;
                        case GAS_NMHC:
                            obj.NMHC_ugm3 = gas_ugm3_val
                            break;
                        case GAS_SOx:
                            obj.SOx_ugm3 = gas_ugm3_val
                            break;
                        case GAS_NOx:
                            obj.NOx_ugm3 = gas_ugm3_val
                            break;
                        case GAS_NO:
                            obj.NO_ugm3 = gas_ugm3_val
                            break;
                        case GAS_C4H8:
                            obj.C4H8_ugm3 = gas_ugm3_val
                            break;
                        case GAS_C3H8O2:
                            obj.C3H8O2_ugm3 = gas_ugm3_val
                            break;
                        case GAS_CH4S:
                            obj.CH4S_ugm3 = gas_ugm3_val
                            break;
                        case GAS_C8H8:
                            obj.C8H8_ugm3 = gas_ugm3_val
                            break;
                        case GAS_C4H10:
                            obj.C4H10_ugm3 = gas_ugm3_val
                            break;
                        case GAS_C4H6:
                            obj.C4H6_ugm3 = gas_ugm3_val
                            break;
                        case GAS_C6H14:
                            obj.C6H14_ugm3 = gas_ugm3_val
                            break;
                        case GAS_C2H4O:
                            obj.C2H4O_ugm3 = gas_ugm3_val
                            break;
                        case GAS_C3H9N:
                            obj.C3H9N_ugm3 = gas_ugm3_val
                            break;
                        case GAS_C2H7N:
                            obj.C2H7N_ugm3 = gas_ugm3_val
                            break;
                        case GAS_C2H6O:
                            obj.C2H6O_ugm3 = gas_ugm3_val
                            break;
                        case GAS_CS2:
                            obj.CS2_ugm3 = gas_ugm3_val
                            break;
                        case GAS_C2H6S:
                            obj.C2H6S_ugm3 = gas_ugm3_val
                            break;
                        case GAS_C2H6S2:
                            obj.C2H6S2_ugm3 = gas_ugm3_val
                            break;
                        case GAS_C2H4:
                            obj.C2H4_ugm3 = gas_ugm3_val
                            break;
                        case GAS_CH3OH:
                            obj.CH3OH_ugm3 = gas_ugm3_val
                            break;
                        case GAS_C6H6:
                            obj.C6H6_ugm3 = gas_ugm3_val
                            break;
                        case GAS_C8H10:
                            obj.C8H10_ugm3 = gas_ugm3_val
                            break;
                        case GAS_C7H8:
                            obj.C7H8_ugm3 = gas_ugm3_val
                            break;
                        case GAS_CH3COOH:
                            obj.CH3COOH_ugm3 = gas_ugm3_val
                            break;
                        case GAS_ClO2:
                            obj.ClO2_ugm3 = gas_ugm3_val
                            break;
                        case GAS_H2O2:
                            obj.H2O2_ugm3 = gas_ugm3_val
                            break;
                        case GAS_N2H4:
                            obj.N2H4_ugm3 = gas_ugm3_val
                            break;
                        case GAS_C2H8N2:
                            obj.C2H8N2_ugm3 = gas_ugm3_val
                            break;
                        case GAS_C2HCl3:
                            obj.C2HCl3_ugm3 = gas_ugm3_val
                            break;
                        case GAS_CHCl3:
                            obj.CHCl3_ugm3 = gas_ugm3_val
                            break;
                        case GAS_C2H3Cl3:
                            obj.C2H3Cl3_ugm3 = gas_ugm3_val
                            break;
                        case GAS_H2Se:
                            obj.H2Se_ugm3 = gas_ugm3_val
                            break;
                        default:
                            obj.unknown_gas_ugm3 = gas_ugm3_val
                            break;
                    }
                }
                i += 5;
                break;

            // S
            case ENLINK_SOUND_MIN:
                obj.sound_min_dba = f32_1(data, i);
                i += 4;
                break;
            case ENLINK_SOUND_AVG:
                obj.sound_avg_dba = f32_1(data, i);
                i += 4;
                break;
            case ENLINK_SOUND_MAX:
                obj.sound_max_dba = f32_1(data, i);
                i += 4;
                break;

            // N
            case ENLINK_MPS_CYCLECOUNT:
                obj.flam_count = s32_1(data, i);
                i += 4;
                break;

            case ENLINK_MPS_FLAM_GAS:
                // %LEL(ISO) Flammable Gas
                var gas_lel_iso_val = f32_2(data, i);
                // Use this to give just a %LEL(ISO) reading independant of gas class
                obj.flam_conc_lel_iso = gas_lel_iso_val;

                if (show_array == 1) {
                    if (obj.flam_gas) {
                        obj.flam_gas.push([data[i + 1], GetFlamGasName(data[i + 1]), gas_lel_iso_val]);
                    } else {
                        obj.flam_gas = [[data[i + 1], GetFlamGasName(data[i + 1]), gas_lel_iso_val]];
                    }
                }
                if (show_simple == 1) {
                    // Use this to separate each gas concentration by class
                    switch (data[i + 1]) {
                        case FLAM_NONE:
                            obj.flam_none = gas_lel_iso_val;
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
                        case FLAM_UNKNOWN:
                            obj.flam_err_unknown = gas_lel_iso_val;
                            break;
                        case FLAM_UNDER_RNG:
                            obj.flam_err_under_range = gas_lel_iso_val;
                            break;
                        case FLAM_OVER_RNG:
                            obj.flam_err_over_range = gas_lel_iso_val;
                            break;

                        default:
                            obj.flam_unknown = gas_lel_iso_val;
                            break;
                    }
                }
                i += 5;
                break;

            // P+ Mass Concentration
            case ENLINK_MC_PM1_0:
                obj.mc_pm1_0 = f32_1(data, i);
                i += 4;
                break;
            case ENLINK_MC_PM2_5:
                obj.mc_pm2_5 = f32_1(data, i);
                i += 4;
                break;
            case ENLINK_MC_PM4_0:
                obj.mc_pm4_0 = f32_1(data, i);
                i += 4;
                break;
            case ENLINK_MC_PM10_0:
                obj.mc_pm10_0 = f32_1(data, i);
                i += 4;
                break;
            // P+ Number Concentration (Count)
            case ENLINK_NC_PM0_5:
                obj.nc_pm0_5 = f32_1(data, i);
                i += 4;
                break;
            case ENLINK_NC_PM1_0:
                obj.nc_pm1_0 = f32_1(data, i);
                i += 4;
                break;
            case ENLINK_NC_PM2_5:
                obj.nc_pm2_5 = f32_1(data, i);
                i += 4;
                break;
            case ENLINK_NC_PM4_0:
                obj.nc_pm4_0 = f32_1(data, i);
                i += 4;
                break;
            case ENLINK_NC_PM10_0:
                obj.nc_pm10_0 = f32_1(data, i);
                i += 4;
                break;
            // P+ Typical Particle Size
            case ENLINK_PM_TPS:
                obj.pm_tps = f32_1(data, i);
                i += 4;
                break;

            // PP
            case ENLINK_MC_PM0_1:
                obj.mc_pm0_1 = f32_1(data, i);
                i += 4;
                break;
            case ENLINK_MC_PM0_3:
                obj.mc_pm0_3 = f32_1(data, i);
                i += 4;
                break;
            case ENLINK_MC_PM0_5:
                obj.mc_pm0_5 = f32_1(data, i);
                i += 4;
                break;
            case ENLINK_MC_PM5_0:
                obj.mc_pm5_0 = f32_1(data, i);
                i += 4;
                break;
            case ENLINK_NC_PM0_1:
                obj.nc_pm0_1 = f32_1(data, i);
                i += 4;
                break;
            case ENLINK_NC_PM0_3:
                obj.nc_pm0_3 = f32_1(data, i);
                i += 4;
                break;
            case ENLINK_NC_PM5_0:
                obj.nc_pm5_0 = f32_1(data, i);
                i += 4;
                break;

            // PV
            case ENLINK_DE_EVENT:
                /* Particle Detection Event */
                /* Event raised, not yet identified */
                obj.de_event = u16_1(data, i);
                i += 2;
                break;
            case ENLINK_DE_SMOKE:
                /* Smoke particles identified */
                obj.de_smoke = u16_1(data, i);
                i += 2;
                break;
            case ENLINK_DE_VAPE:
                /* Vape particles identified */
                obj.de_vape = u16_1(data, i);
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
                obj.batt_mv = u16_1(data, i);
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
            // < -------------------------------------------------------------------------------->
            case ENLINK_FAULT:
                var sensor_id = (data[i + 1]);
                var fault_code = (data[i + 2]);
                var count_val = U16((data[i + 3] << 8) | data[i + 4]);
                if (obj.fault) {
                    obj.fault.push([sensor_id, fault_code, count_val]);
                } else {
                    obj.fault = [[sensor_id, fault_code, count_val]];
                }
                i += 4;
                break;

            default: // something is wrong with data
                obj.error = "Data Error at byte index " + i + "  Data: " + bytesToHex(data);
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
