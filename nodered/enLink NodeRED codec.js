// Used for decoding enLink Uplink LoRa Messages
// 29 May 2025 (FW Ver:7.14)
// 24 Apr 2025 Includes Temperature fix
// https://github.com/synetica/enlink-decoder

// --------------------------------------------------------------------------------------
// Telemetry data from all enLink Models
const ENLINK_TEMP = 0x01;                                  // S16  -3276.8 C -> 3276.7 C (-10..80) [Divide word by 10]
const ENLINK_RH = 0x02;                                    // U8   0 -> 255 %RH (Actually 0..100%)
const ENLINK_LUX = 0x03;                                   // U16  0 -> 65535 Lux
const ENLINK_PRESSURE = 0x04;                              // U16  0 -> 65535 mbar or hPa
const ENLINK_VOC_IAQ = 0x05;                               // U16  0 -> 500 IAQ Index
const ENLINK_O2PERC = 0x06;                                // U8   0 -> 25.5% [Divide byte by 10]
const ENLINK_CO = 0x07;                                    // U16  0 -> 655.35 ppm (0..100 ppm) [Divide by 100]
const ENLINK_CO2 = 0x08;                                   // U16  0 -> 65535 ppm (0..2000 ppm)
const ENLINK_OZONE = 0x09;                                 // U16  0 -> 6.5535 ppm or 6553.5 ppb (0..1 ppm) [Divide by 10000]
const ENLINK_POLLUTANTS = 0x0A;                            // U16  0 -> 6553.5 kOhm (Typically 100..1500 kOhm) [Divide by 10]

const ENLINK_H2S = 0x0D;                                   // U16  0 -> 655.35 ppm (0..100 ppm) [Divide by 100]
const ENLINK_COUNTER = 0x0E;                               // U32  0 -> 2^32
const ENLINK_MB_EXCEPTION = 0x0F;                          // Type Byte + MBID + Exception Code so it's Type + 2 bytes
const ENLINK_MB_INTERVAL = 0x10;                           // Type Byte + MBID + F32 Value - so 6 bytes
const ENLINK_MB_CUMULATIVE = 0x11;                         // Type Byte + MBID + F32 Value - so 6 bytes
const ENLINK_BVOC = 0x12;                                  // F32  ppm Breath VOC Estimate equivalent
const ENLINK_DETECTION_COUNT = 0x13;                       // U32  Counter. Num of detections for PIR/RangeFinder
const ENLINK_OCC_TIME = 0x14;                              // U32  Total Occupied Time (seconds)
const ENLINK_COS_STATUS = 0x15;                            // U16  Change-of-State Trigger/State Value
const ENLINK_DETECTION_STATUS = 0x16;                      // U8   Status. 1=Detected, 0=Not Detected (Occupancy, Liquid)
const ENLINK_TEMP_PROBE1 = 0x17;                           // S16  As 0x01
const ENLINK_TEMP_PROBE2 = 0x18;                           // S16  As 0x01
const ENLINK_TEMP_PROBE3 = 0x19;                           // S16  As 0x01
const ENLINK_TEMP_PROBE_IN_BAND_DURATION_S_1 = 0x1A;       // U32  Seconds. Time temperature probe 1 has spent in 'in band' zone
const ENLINK_TEMP_PROBE_IN_BAND_DURATION_S_2 = 0x1B;       // U32  Seconds. Time temperature probe 2 has spent in 'in band' zone
const ENLINK_TEMP_PROBE_IN_BAND_DURATION_S_3 = 0x1C;       // U32  Seconds. Time temperature probe 3 has spent in 'in band' zone
const ENLINK_TEMP_PROBE_IN_BAND_ALARM_COUNT_1 = 0x1D;      // U16  Count. Num times in band alarm has activated for probe 1
const ENLINK_TEMP_PROBE_IN_BAND_ALARM_COUNT_2 = 0x1E;      // U16  Count. Num times in band alarm has activated for probe 2
const ENLINK_TEMP_PROBE_IN_BAND_ALARM_COUNT_3 = 0x1F;      // U16  Count. Num times in band alarm has activated for probe 3
const ENLINK_TEMP_PROBE_LOW_DURATION_S_1 = 0x20;           // U32  Seconds. Time probe 1 has spent below low threshold
const ENLINK_TEMP_PROBE_LOW_DURATION_S_2 = 0x21;           // U32  Seconds. Time probe 2 has spent below low threshold
const ENLINK_TEMP_PROBE_LOW_DURATION_S_3 = 0x22;           // U32  Seconds. Time probe 3 has spent below low threshold
const ENLINK_TEMP_PROBE_LOW_ALARM_COUNT_1 = 0x23;          // U16  Count. Num times low threshold alarm has activated for probe 1
const ENLINK_TEMP_PROBE_LOW_ALARM_COUNT_2 = 0x24;          // U16  Count. Num times low threshold alarm has activated for probe 2
const ENLINK_TEMP_PROBE_LOW_ALARM_COUNT_3 = 0x25;          // U16  Count. Num times low threshold alarm has activated for probe 3
const ENLINK_TEMP_PROBE_HIGH_DURATION_S_1 = 0x26;          // U32  Seconds. Time probe 1 has spent above high threshold
const ENLINK_TEMP_PROBE_HIGH_DURATION_S_2 = 0x27;          // U32  Seconds. Time probe 2 has spent above high threshold
const ENLINK_TEMP_PROBE_HIGH_DURATION_S_3 = 0x28;          // U32  Seconds. Time probe 3 has spent above high threshold
const ENLINK_TEMP_PROBE_HIGH_ALARM_COUNT_1 = 0x29;         // U16  Count. Num times high threshold alarm has activated for probe 1
const ENLINK_TEMP_PROBE_HIGH_ALARM_COUNT_2 = 0x2A;         // U16  Count. Num times high threshold alarm has activated for probe 2
const ENLINK_TEMP_PROBE_HIGH_ALARM_COUNT_3 = 0x2B;         // U16  Count. Num times high threshold alarm has activated for probe 3
const ENLINK_DIFF_PRESSURE = 0X2C;                         // F32  +- 5000 Pa
const ENLINK_AIR_FLOW = 0x2D;                              // F32  0 -> 100 m/s
const ENLINK_VOLTAGE = 0x2E;                               // U16  0 -> 65.535V [Divide by 1000]
const ENLINK_CURRENT = 0x2F;                               // U16  0 -> 65.535mA [Divide by 1000]
const ENLINK_RESISTANCE = 0x30;                            // U16  0 -> 6553.5kOhm [Divide by 10]
const ENLINK_LEAK_DETECT_EVT = 0x31;                       // U8   1 or 0, Leak status on resistance rope
const ENLINK_GP_PRESSURE_PA = 0x32;
const ENLINK_GP_TEMPERATURE = 0x33;
const ENLINK_LL_DEPTH_MM = 0x34;
const ENLINK_LL_TEMPERATURE = 0x35;

const ENLINK_MIN_TVOC = 0x36;
const ENLINK_AVG_TVOC = 0x37;
const ENLINK_MAX_TVOC = 0x38;
const ENLINK_ETOH = 0x39;
const ENLINK_TVOC_IAQ = 0x3A;
const ENLINK_HIRES_RH = 0x3B;
const ENLINK_COMP_TEMP_C = 0x3C;
const ENLINK_COMP_RH = 0x3D;

const ENLINK_CO2E = 0x3F;                                  // F32  ppm CO2e Estimate Equivalent

const ENLINK_SOUND_MIN = 0x50;                             // F32  dB(A)
const ENLINK_SOUND_AVG = 0x51;                             // F32  dB(A)
const ENLINK_SOUND_MAX = 0x52;                             // F32  dB(A)
const ENLINK_NO = 0x53;                                    // U16  0 -> 655.35 ppm (0..100 ppm) [Divide by 100]
const ENLINK_NO2 = 0x54;                                   // U16  0 -> 6.5535 ppm (0..5 ppm) [Divide by 10000]
const ENLINK_NO2_20 = 0x55;                                // U16  0 -> 65.535 ppm (0..20 ppm) [Divide by 1000]
const ENLINK_SO2 = 0x56;                                   // U16  0 -> 65.535 ppm (0..20 ppm) [Divide by 1000]

// Particulate Matter (Advanced Data)
const ENLINK_MC_PM1_0 = 0x57;                              // F32  ug/m3 Mass Concentration
const ENLINK_MC_PM2_5 = 0x58;                              // F32  ug/m3
const ENLINK_MC_PM4_0 = 0x59;                              // F32  ug/m3
const ENLINK_MC_PM10_0 = 0x5A;                             // F32  ug/m3
const ENLINK_NC_PM0_5 = 0x5B;                              // F32  #/cm3 Number Concentration
const ENLINK_NC_PM1_0 = 0x5C;                              // F32  #/cm3
const ENLINK_NC_PM2_5 = 0x5D;                              // F32  #/cm3
const ENLINK_NC_PM4_0 = 0x5E;                              // F32  #/cm3
const ENLINK_NC_PM10_0 = 0x5F;                             // F32  #/cm3
const ENLINK_PM_TPS = 0x60;                                // F32  um    Typical Particle Size

const ENLINK_GAS_PPB = 0x61;                               // Gas-Type byte + F32 Concentration in ppb
const ENLINK_GAS_UGM3 = 0x66;                              // Gas-Type byte + F32 Volumetric mass as ug/m3

const ENLINK_CRN_THK = 0x62;                               // Coupon No. + Metal Type byte + F32 nm. Thickness
const ENLINK_CRN_MIN_THK = 0x63;                           // Coupon No. + Metal Type byte + U16 nm. Min Thickness (when depleted)
const ENLINK_CRN_MAX_THK = 0x64;                           // Coupon No. + Metal Type byte + U16 nm. Max/Original Thickness
const ENLINK_CRN_PERC = 0x65;                              // Coupon No. + Metal Type byte + F32 nm.
//    PERC: Percentage of corrosion between Max(0%) to Min(100%)
const ENLINK_FAST_AQI = 0x67;                              // U16  AQI (1 min calculation)
const ENLINK_EPA_AQI = 0x68;                               // U16  EPA AQI (8hr or 1hr, whichever is worst) See online docs.

// More Particulate Matter
const ENLINK_MC_PM0_1 = 0x69;                              // F32  ug/m3 Mass Concentration
const ENLINK_MC_PM0_3 = 0x6A;                              // F32  ug/m3
const ENLINK_MC_PM0_5 = 0x6B;                              // F32  ug/m3
const ENLINK_MC_PM5_0 = 0x6C;                              // F32  ug/m3

const ENLINK_NC_PM0_1 = 0x6D;                              // F32  #/cm3 Number Concentration
const ENLINK_NC_PM0_3 = 0x6E;                              // F32  #/cm3
const ENLINK_NC_PM5_0 = 0x6F;                              // F32  #/cm3

// IPS7100 Particulate Detection Events - type counts
const ENLINK_DE_EVENT = 0x70;                              // U16 count
const ENLINK_DE_SMOKE = 0x71;                              // U16 count
const ENLINK_DE_VAPE = 0x72;                               // U16 count

// --------------------------------------------------------------------------------------
// Optional KPI values that can be included in the message
const ENLINK_CPU_TEMP_DEP = 0x40;                          // [DEPRECIATED April 2020. Now 0x4E] 2 bytes 0.0 C -> 255.99 C
const ENLINK_BATT_STATUS = 0x41;                           // U8   0=Charging; 1~254 (1.8 - 3.3V); 255=External Power
const ENLINK_BATT_VOLT = 0x42;                             // U16  0 -> 3600mV (3600mV=External Power)
const ENLINK_RX_RSSI = 0x43;                               // S16  +-32767 RSSI
const ENLINK_RX_SNR = 0x44;                                // S8   +-128 Signal to Noise Ratio
const ENLINK_RX_COUNT = 0x45;                              // U16  0 -> 65535 downlink message count
const ENLINK_TX_TIME = 0x46;                               // U16  0 -> 65535 ms
const ENLINK_TX_POWER = 0x47;                              // S8   +-128 dBm
const ENLINK_TX_COUNT = 0x48;                              // U16  0 -> 65535 uplink message count
const ENLINK_POWER_UP_COUNT = 0x49;                        // U16  0 -> 65535 counts
const ENLINK_USB_IN_COUNT = 0x4A;                          // U16  0 -> 65535 counts
const ENLINK_LOGIN_OK_COUNT = 0x4B;                        // U16  0 -> 65535 counts
const ENLINK_LOGIN_FAIL_COUNT = 0x4C;                      // U16  0 -> 65535 counts
const ENLINK_FAN_RUN_TIME = 0x4D;                          // U32  0 -> 2^32 seconds = 136 years
const ENLINK_CPU_TEMP = 0x4E;                              // S16  -3276.8 C -> 3276.7 C (-10..80) [Divide by 10]

const ENLINK_STATUS = 0xFE;

// --------------------------------------------------------------------------------------
// Downlink reply message Header and ACK/NAK
const ENLINK_HEADER = 0xA5;
const ENLINK_ACK = 0x06;
const ENLINK_NACK = 0x15;
// Downlink reply message values
const ENLINK_SET_ANTENNA_GAIN = 0x01;
const ENLINK_SET_PUBLIC = 0x02;
const ENLINK_SET_APPEUI = 0x05;   // 8 bytes
const ENLINK_SET_APPKEY = 0x06;   // 16 bytes
const ENLINK_SET_ADR = 0x07;
const ENLINK_SET_DUTY_CYCLE = 0x08;
const ENLINK_SET_MSG_ACK = 0x09;
const ENLINK_SET_TX_PORT = 0x0A;
const ENLINK_SET_DR_INDEX = 0x0B;   // Data Rate Index 0~6
const ENLINK_SET_TX_INDEX = 0x0C;   // Data Rate Index 0~10
const ENLINK_SET_POW_INDEX = 0x0D;   // Data Rate Index 0~6
const ENLINK_SET_RX_PORT = 0x0E;
const ENLINK_SET_JC_INTERVAL = 0x0F;    // Join Check Interval
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
const ENLINK_SET_GSS_CO2_INIT_INTERVAL = 0x2A;

// Set PM options
const ENLINK_SET_PM_RUN_PERIOD = 0x2B;
const ENLINK_SET_PM_CLEANING_PERIOD = 0x2C;

// Set Gas Sensor options
const ENLINK_SET_GAS_IDLE_STATE = 0x2D;
const ENLINK_SET_GAS_PRE_DELAY = 0x2E;
const ENLINK_SET_GAS_NUM_READS = 0x2F;
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
const ENLINK_LEAK_SAMPLE_TIME_S = 0x3A;
const ENLINK_LEAK_TEST_DURATION = 0x3B;

// Radio packet includes for VOC and Particulate sensors
const ENLINK_BME680_PKT_INC = 0x3C;
const ENLINK_SPS30_PKT_INC = 0x3D;
const ENLINK_PIERA_PKT_INC = 0x3E;

// Diff Press/ Air Flow Settings
const ENLINK_DP_PKT_INC = 0x3F;
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
const ENLINK_ZV_INT_LOGIC_LOW_THRESH = 0x4A;
const ENLINK_ZV_INT_LOGIC_HIGH_THRESH = 0x4B;
const ENLINK_ZV_HELP_SCN_ENABLE = 0x4C;
const ENLINK_ZV_SET_TEXT = 0xD0;
const ENLINK_ZV_SET_TEXT_TO_DEFAULT = 0xD1;

const ENLINK_ENABLE_Z45 = 0x50;
const ENLINK_HUMIDITY_TX_RES = 0x51;
const ENLINK_Z45_TRIG_CLEAN = 0x52;

const ENLINK_REBOOT = 0xFF;

// --------------------------------------------------------------------------------------
// OTA Modbus configuration Only
// V2 Configuration data messages
const ENLINK_MB_SYS = 0xFF;	    // Config reply from a MB unit
const ENLINK_QRY_V2 = 0xFE;		// Query Configuration
const ENLINK_SET_V2 = 0xFD;	    // Set Configuration
const ENLINK_CMD_V2 = 0xFC;		// Commands

const ENLINK_ACK_V2 = 0xAA;
const ENLINK_NACK_V2 = 0xFF;

//var ENLINK_MB_DP_COMMS = 0x40;
const ENLINK_MB_DP_CONFIG = 0x41;
const ENLINK_MB_DP_VALUE = 0x42;
// Commands
const ENLINK_MB_SC_DELETE = 0x7F;
// --------------------------------------------------------------------------------------

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
// Utility function
function bytesToHex(bytes) {
    var result = "";
    for (var i = 0; i < bytes.length; i += 1) {
        result += ('0' + (bytes[i]).toString(16).toUpperCase() + ' ').slice(-3);
    }
    return result.trim();
}
// Convert 4 IEEE754 bytes
function fromF32(byte0, byte1, byte2, byte3) {
    var bits = (byte0 << 24) | (byte1 << 16) | (byte2 << 8) | (byte3);
    var sign = ((bits >>> 31) === 0) ? 1.0 : -1.0;
    var e = ((bits >>> 23) & 0xff);
    var m = (e === 0) ? (bits & 0x7fffff) << 1 : (bits & 0x7fffff) | 0x800000;
    var f = sign * m * Math.pow(2, e - 150);
    return f;
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
// Corrosion: Return metal name from id byte
function GetCrnMetal(id_byte) {
    var id = (id_byte & 0x7F);
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
    var num = t & 0xFFFF;
    if (0x8000 & num)
        num = 655 + num;
    return num & 0xFFFF;
}
// --------------------------------------------------------------------------------------
// Function to decode enLink telemetry (sensor) messages
function decodeTelemetry(data) {
    var cpn;
    var metal;
    var obj = {};
    obj.short_eui = msg.eui.slice(-11);
    var msg_ok = false;
    for (var i = 0; i < data.length; i++) {
        switch (data[i]) {

            // Parse enLink message for telemetry data
            case ENLINK_TEMP: // Temperature
                obj.temperature_c = (S16((data[i + 1] << 8) | (data[i + 2]))) / 10;
                obj.temperature_c_fix_v7 = (t_fix_v7((data[i + 1] << 8) | data[i + 2])) / 10;
                //obj.temperature_f = ((obj.temperature_c * 9/5) + 32).toFixed(2);
                i += 2;
                msg_ok = true;
                break;
            case ENLINK_COMP_TEMP_C: // Compensated Temperature
                obj.comp_temp_c = (S16((data[i + 1] << 8) | (data[i + 2]))) / 10;
                i += 2;
                msg_ok = true;
                break;
            case ENLINK_RH: // Humidity %rH
                obj.humidity = (data[i + 1]);
                i += 1;
                msg_ok = true;
                break;
            case ENLINK_HIRES_RH: // Humidity %rH
                obj.rh = (U16((data[i + 1] << 8) | (data[i + 2]))) / 100;
                i += 2;
                msg_ok = true;
                break;
            case ENLINK_COMP_RH: // Compensated Humidity %rH
                obj.comp_rh = (U16((data[i + 1] << 8) | (data[i + 2]))) / 100;
                i += 2;
                msg_ok = true;
                break;
            case ENLINK_LUX: // Light Level lux
                obj.lux = U16((data[i + 1] << 8) | (data[i + 2]));
                i += 2;
                msg_ok = true;
                break;
            case ENLINK_PRESSURE: // Barometric Pressure
                obj.pressure_mbar = U16((data[i + 1] << 8) | (data[i + 2]));
                i += 2;
                msg_ok = true;
                break;
            case ENLINK_VOC_IAQ: // Indoor Air Quality (0-500)
                obj.iaq = U16((data[i + 1] << 8) | (data[i + 2]));
                i += 2;
                msg_ok = true;
                break;
            case ENLINK_O2PERC: // O2 percentage
                obj.o2perc = (data[i + 1]) / 10;
                i += 1;
                msg_ok = true;
                break;
            case ENLINK_CO: // Carbon Monoxide
                obj.co_ppm = U16((data[i + 1] << 8) | (data[i + 2])) / 100;
                i += 2;
                msg_ok = true;
                break;
            case ENLINK_CO2: // Carbon Dioxide
                obj.co2_ppm = U16((data[i + 1] << 8) | (data[i + 2]));
                i += 2;
                msg_ok = true;
                break;
            case ENLINK_OZONE: // Ozone ppm and ppb
                obj.ozone_ppm = U16((data[i + 1] << 8) | (data[i + 2])) / 10000;
                obj.ozone_ppb = U16((data[i + 1] << 8) | (data[i + 2])) / 10;
                i += 2;
                msg_ok = true;
                break;
            case ENLINK_POLLUTANTS: // Pollutants kOhm
                obj.pollutants_kohm = U16((data[i + 1] << 8) | (data[i + 2])) / 10;
                i += 2;
                msg_ok = true;
                break;
            case ENLINK_H2S: // Hydrogen Sulphide
                obj.h2s_ppm = U16((data[i + 1] << 8) | (data[i + 2])) / 100;
                i += 2;
                msg_ok = true;
                break;

            case ENLINK_COUNTER:
                if (obj.counter) {
                    obj.counter.push(
                        [data[i + 1], U32((data[i + 2] << 24) | (data[i + 3] << 16) | (data[i + 4] << 8) | (data[i + 5]))]);
                } else {
                    obj.counter = [
                        [data[i + 1], U32((data[i + 2] << 24) | (data[i + 3] << 16) | (data[i + 4] << 8) | (data[i + 5]))]
                    ];
                }
                i += 5;
                msg_ok = true;
                break;
            case ENLINK_MB_EXCEPTION: // Modbus Error Code
                if (obj.mb_ex) {
                    obj.mb_ex.push([data[i + 1], data[i + 2]]);
                } else {
                    obj.mb_ex = [[data[i + 1], data[i + 2]]];
                }
                i += 2;
                msg_ok = true;
                break;
            case ENLINK_MB_INTERVAL: // Modbus Interval Read
                if (obj.mb_int_val) {
                    obj.mb_int_val.push([data[i + 1], fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]).toFixed(2)]);
                } else {
                    obj.mb_int_val = [[data[i + 1], fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]).toFixed(2)]];
                }
                i += 5;
                msg_ok = true;
                break;
            case ENLINK_MB_CUMULATIVE: // Modbus Cumulative Read
                if (obj.mb_cum_val) {
                    obj.mb_cum_val.push([data[i + 1], fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]).toFixed(2)]);
                } else {
                    obj.mb_cum_val = [[data[i + 1], fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]).toFixed(2)]];
                }
                i += 5;
                msg_ok = true;
                break;

            case ENLINK_BVOC:     // Breath VOC Estimate equivalent
                obj.bvoc = fromF32(data[i + 1], data[i + 2], data[i + 3], data[i + 4]).toFixed(3);
                i += 4;
                msg_ok = true;
                break;

            case ENLINK_DETECTION_COUNT:
                obj.det_count = U32((data[i + 1] << 24) | (data[i + 2] << 16) | (data[i + 3] << 8) | (data[i + 4]));
                i += 4;
                msg_ok = true;
                break;
            case ENLINK_OCC_TIME: // Occupied duration in seconds
                obj.occ_time_s = U32((data[i + 1] << 24) | (data[i + 2] << 16) | (data[i + 3] << 8) | (data[i + 4]));
                i += 4;
                msg_ok = true;
                break;
            case ENLINK_COS_STATUS: // Change-of-State U16
                // Byte 1 = Triggered, Byte 2 = Input state
                var cos = {};
                cos.trig_byte = '0x' + ('0' + (data[i + 1]).toString(16).toUpperCase()).slice(-2);
                if (data[i + 1] === 0) {
                    // Transmission was triggered with button press or ATI timeout
                    // So it's a 'heartbeat'
                    cos.hb = true;
                } else {
                    // Transmission was triggered with a Change of State
                    // Transition detected for Closed to Open
                    var b = false;
                    b = (data[i + 1] & 0x01) > 0;
                    if (b) cos.ip_1_hl = true;

                    b = (data[i + 1] & 0x02) > 0;
                    if (b) cos.ip_2_hl = true;

                    b = (data[i + 1] & 0x04) > 0;
                    if (b) cos.ip_3_hl = true;

                    // Transition detected for Open to Closed
                    b = (data[i + 1] & 0x10) > 0;
                    if (b) cos.ip_1_lh = true;

                    b = (data[i + 1] & 0x20) > 0;
                    if (b) cos.ip_2_lh = true;

                    b = (data[i + 1] & 0x40) > 0;
                    if (b) cos.ip_3_lh = true;
                }
                // Input State
                var state = {};
                state.byte = '0x' + ('0' + (data[i + 2]).toString(16).toUpperCase()).slice(-2);
                state.ip_1 = (data[i + 2] & 0x01) > 0;
                state.ip_2 = (data[i + 2] & 0x02) > 0;
                state.ip_3 = (data[i + 2] & 0x04) > 0;

                obj.cos = cos;
                obj.state = state;

                i += 2;
                msg_ok = true;
                break;

            case ENLINK_DETECTION_STATUS:
                obj.detection = (data[i + 1]) ? true : false;
                i += 1;
                msg_ok = true;
                break;

            case ENLINK_TEMP_PROBE1:
                obj.temp_probe_1 = S16((data[i + 1] << 8 | data[i + 2])) / 10;
                i += 2;
                msg_ok = true;
                break;
            case ENLINK_TEMP_PROBE2:
                obj.temp_probe_2 = S16((data[i + 1] << 8 | data[i + 2])) / 10;
                i += 2;
                msg_ok = true;
                break;
            case ENLINK_TEMP_PROBE3:
                obj.temp_probe_3 = S16((data[i + 1] << 8 | data[i + 2])) / 10;
                i += 2;
                msg_ok = true;
                break;
            case ENLINK_TEMP_PROBE_IN_BAND_DURATION_S_1:
                /* Cumulative detection time u32 */
                obj.temp_probe_in_band_duration_s_1 =
                    U32((data[i + 1] << 24) | (data[i + 2] << 16) | (data[i + 3] << 8) | (data[i + 4]));
                i += 4;
                msg_ok = true;
                break;
            case ENLINK_TEMP_PROBE_IN_BAND_DURATION_S_2:
                /* Cumulative detection time u32 */
                obj.temp_probe_in_band_duration_s_2 =
                    U32((data[i + 1] << 24) | (data[i + 2] << 16) | (data[i + 3] << 8) | (data[i + 4]));
                i += 4;
                msg_ok = true;
                break;
            case ENLINK_TEMP_PROBE_IN_BAND_DURATION_S_3:
                /* Cumulative detection time u32 */
                obj.temp_probe_in_band_duration_s_3 =
                    U32((data[i + 1] << 24) | (data[i + 2] << 16) | (data[i + 3] << 8) | (data[i + 4]));
                i += 4;
                msg_ok = true;
                break;
            case ENLINK_TEMP_PROBE_IN_BAND_ALARM_COUNT_1:
                /* In band alarm events u16 */
                obj.temp_probe_in_band_alarm_count_1 = U16((data[i + 1] << 8) | (data[i + 2]));
                i += 2;
                msg_ok = true;
                break;
            case ENLINK_TEMP_PROBE_IN_BAND_ALARM_COUNT_2:
                /* In band alarm events u16 */
                obj.temp_probe_in_band_alarm_count_2 = U16((data[i + 1] << 8) | (data[i + 2]));
                i += 2;
                msg_ok = true;
                break;
            case ENLINK_TEMP_PROBE_IN_BAND_ALARM_COUNT_3:
                /* In band alarm events u16 */
                obj.temp_probe_in_band_alarm_count_3 = U16((data[i + 1] << 8) | (data[i + 2]));
                i += 2;
                msg_ok = true;
                break;
            case ENLINK_TEMP_PROBE_LOW_DURATION_S_1:
                /* Cumulative detection time u32 */
                obj.temp_probe_low_duration_s_1 =
                    U32((data[i + 1] << 24) | (data[i + 2] << 16) | (data[i + 3] << 8) | (data[i + 4]));
                i += 4;
                msg_ok = true;
                break;
            case ENLINK_TEMP_PROBE_LOW_DURATION_S_2:
                /* Cumulative detection time u32 */
                obj.temp_probe_low_duration_s_2 =
                    U32((data[i + 1] << 24) | (data[i + 2] << 16) | (data[i + 3] << 8) | (data[i + 4]));
                i += 4;
                msg_ok = true;
                break;
            case ENLINK_TEMP_PROBE_LOW_DURATION_S_3:
                /* Cumulative detection time u32 */
                obj.temp_probe_low_duration_s_3 =
                    U32((data[i + 1] << 24) | (data[i + 2] << 16) | (data[i + 3] << 8) | (data[i + 4]));
                i += 4;
                msg_ok = true;
                break;
            case ENLINK_TEMP_PROBE_LOW_ALARM_COUNT_1:
                /* Low alarm events u16 */
                obj.temp_probe_low_alarm_count_1 = U16((data[i + 1] << 8) | (data[i + 2]));
                i += 2;
                msg_ok = true;
                break;
            case ENLINK_TEMP_PROBE_LOW_ALARM_COUNT_2:
                /* Low alarm events u16 */
                obj.temp_probe_low_alarm_count_2 = U16((data[i + 1] << 8) | (data[i + 2]));
                i += 2;
                msg_ok = true;
                break;
            case ENLINK_TEMP_PROBE_LOW_ALARM_COUNT_3:
                /* Low alarm events u16 */
                obj.temp_probe_low_alarm_count_3 = U16((data[i + 1] << 8) | (data[i + 2]));
                i += 2;
                msg_ok = true;
                break;
            case ENLINK_TEMP_PROBE_HIGH_DURATION_S_1:
                /* Cumulative detection time u32 */
                obj.temp_probe_high_duration_s_1 =
                    U32((data[i + 1] << 24) | (data[i + 2] << 16) | (data[i + 3] << 8) | (data[i + 4]));
                i += 4;
                msg_ok = true;
                break;
            case ENLINK_TEMP_PROBE_HIGH_DURATION_S_2:
                /* Cumulative detection time u32 */
                obj.temp_probe_high_duration_s_2 =
                    U32((data[i + 1] << 24) | (data[i + 2] << 16) | (data[i + 3] << 8) | (data[i + 4]));
                i += 4;
                msg_ok = true;
                break;
            case ENLINK_TEMP_PROBE_HIGH_DURATION_S_3:
                /* Cumulative detection time u32 */
                obj.temp_probe_high_duration_s_3 =
                    U32((data[i + 1] << 24) | (data[i + 2] << 16) | (data[i + 3] << 8) | (data[i + 4]));
                i += 4;
                msg_ok = true;
                break;
            case ENLINK_TEMP_PROBE_HIGH_ALARM_COUNT_1:
                /* High alarm events u16 */
                obj.temp_probe_high_alarm_count_1 = U16((data[i + 1] << 8) | (data[i + 2]));
                i += 2;
                msg_ok = true;
                break;
            case ENLINK_TEMP_PROBE_HIGH_ALARM_COUNT_2:
                /* High alarm events u16 */
                obj.temp_probe_high_alarm_count_2 = U16((data[i + 1] << 8) | (data[i + 2]));
                i += 2;
                msg_ok = true;
                break;
            case ENLINK_TEMP_PROBE_HIGH_ALARM_COUNT_3:
                /* High alarm events u16 */
                obj.temp_probe_high_alarm_count_3 = U16((data[i + 1] << 8) | (data[i + 2]));
                i += 2;
                msg_ok = true;
                break;

            case ENLINK_DIFF_PRESSURE: // 4 bytes F32, +/- 5000 Pa
                obj.dp_pa = fromF32(data[i + 1], data[i + 2], data[i + 3], data[i + 4]).toFixed(3);
                i += 4;
                msg_ok = true;
                break;
            case ENLINK_AIR_FLOW: // 4 bytes F32, 0 -> 100m/s
                obj.af_mps = fromF32(data[i + 1], data[i + 2], data[i + 3], data[i + 4]).toFixed(3);
                i += 4;
                msg_ok = true;
                break;

            case ENLINK_VOLTAGE: // 2 bytes U16, 0 to 10.000 V
                obj.adc_v = U16((data[i + 1] << 8) | (data[i + 2])) / 1000;
                i += 2;
                msg_ok = true;
                break;
            case ENLINK_CURRENT: // 2 bytes U16, 0 to 20.000 mA
                obj.adc_ma = U16((data[i + 1] << 8) | (data[i + 2])) / 1000;
                i += 2;
                msg_ok = true;
                break;
            case ENLINK_RESISTANCE: // 2 bytes U16, 0 to 6553.5 kOhm (Jan 2023)
                obj.adc_kohm = U16((data[i + 1] << 8) | (data[i + 2])) / 10;
                i += 2;
                msg_ok = true;
                break;
            case ENLINK_LEAK_DETECT_EVT: // 1 byte U8, Leak status changed
                obj.leak_detect_event = (data[i + 1]) ? true : false;
                i += 1;
                msg_ok = true;
                break;
            case ENLINK_GP_PRESSURE_PA: // 4 bytes F32, in Pascals. Typically up to 1MPa (10,000 mbar)
                obj.gp_pa = fromF32(data[i + 1], data[i + 2], data[i + 3], data[i + 4]).toFixed(3);
                obj.gp_kpa = (fromF32(data[i + 1], data[i + 2], data[i + 3], data[i + 4]) / 1000).toFixed(3);
                obj.gp_mbar = (fromF32(data[i + 1], data[i + 2], data[i + 3], data[i + 4]) / 100).toFixed(3);
                obj.gp_psi = (fromF32(data[i + 1], data[i + 2], data[i + 3], data[i + 4]) * 0.000145038).toFixed(3);
                i += 4;
                msg_ok = true;
                break;
            case ENLINK_GP_TEMPERATURE:
                obj.gp_t_c = (S16((data[i + 1] << 8) | (data[i + 2]))) / 100;
                i += 2;
                msg_ok = true;
                break;
            case ENLINK_LL_DEPTH_MM: // 4 bytes F32, in mm
                obj.ll_depth_mm = fromF32(data[i + 1], data[i + 2], data[i + 3], data[i + 4]);
                i += 4;
                msg_ok = true;
                break;
            case ENLINK_LL_TEMPERATURE: // Sensor temperature
                obj.ll_t_c = (S16((data[i + 1] << 8) | (data[i + 2]))) / 100;
                i += 2;
                msg_ok = true;
                break;

            case ENLINK_MIN_TVOC:
                obj.tvoc_min_mg_m3 = fromF32(data[i + 1], data[i + 2], data[i + 3], data[i + 4]).toFixed(2);
                i += 4;
                msg_ok = true;
                break;
            case ENLINK_AVG_TVOC:
                obj.tvoc_avg_mg_m3 = fromF32(data[i + 1], data[i + 2], data[i + 3], data[i + 4]).toFixed(2);
                i += 4;
                msg_ok = true;
                break;
            case ENLINK_MAX_TVOC:
                obj.tvoc_max_mg_m3 = fromF32(data[i + 1], data[i + 2], data[i + 3], data[i + 4]).toFixed(2);
                i += 4;
                msg_ok = true;
                break;
            case ENLINK_ETOH: // Ethanol equivalent
                obj.etoh_ppm = fromF32(data[i + 1], data[i + 2], data[i + 3], data[i + 4]).toFixed(2);
                i += 4;
                msg_ok = true;
                break;
            case ENLINK_TVOC_IAQ:
                obj.tvoc_iaq = fromF32(data[i + 1], data[i + 2], data[i + 3], data[i + 4]).toFixed(2);
                i += 4;
                msg_ok = true;
                break;

            case ENLINK_CO2E: // CO2e Estimate Equivalent
                obj.co2e_ppm = fromF32(data[i + 1], data[i + 2], data[i + 3], data[i + 4]).toFixed(2);
                i += 4;
                msg_ok = true;
                break;

            case ENLINK_SOUND_MIN:
                obj.sound_min_dba = fromF32(data[i + 1], data[i + 2], data[i + 3], data[i + 4]).toFixed(2);
                i += 4;
                msg_ok = true;
                break;

            case ENLINK_SOUND_AVG:
                obj.sound_avg_dba = fromF32(data[i + 1], data[i + 2], data[i + 3], data[i + 4]).toFixed(2);
                i += 4;
                msg_ok = true;
                break;

            case ENLINK_SOUND_MAX:
                obj.sound_max_dba = fromF32(data[i + 1], data[i + 2], data[i + 3], data[i + 4]).toFixed(2);
                i += 4;
                msg_ok = true;
                break;

            case ENLINK_NO: // Nitric Oxide
                obj.no_ppm = U16((data[i + 1] << 8) | (data[i + 2])) / 100;
                i += 2;
                msg_ok = true;
                break;
            case ENLINK_NO2: // Nitrogen Dioxide range at 0-5ppm
                obj.no2_ppm = U16((data[i + 1] << 8) | (data[i + 2])) / 10000;
                i += 2;
                msg_ok = true;
                break;
            case ENLINK_NO2_20: // Nitrogen Dioxide range at 0-20ppm
                obj.no2_20_ppm = U16((data[i + 1] << 8) | (data[i + 2])) / 1000;
                i += 2;
                msg_ok = true;
                break;
            case ENLINK_SO2: // Sulphur Dioxide 0-20ppm
                obj.so2_ppm = U16((data[i + 1] << 8) | (data[i + 2])) / 1000;
                i += 2;
                msg_ok = true;
                break;

            case ENLINK_MC_PM0_1:
                obj.mc_pm0_1 = fromF32(data[i + 1], data[i + 2], data[i + 3], data[i + 4]).toFixed(2);
                i += 4;
                msg_ok = true;
                break;
            case ENLINK_MC_PM0_3:
                obj.mc_pm0_3 = fromF32(data[i + 1], data[i + 2], data[i + 3], data[i + 4]).toFixed(2);
                i += 4;
                msg_ok = true;
                break;
            case ENLINK_MC_PM0_5:
                obj.mc_pm1_0 = fromF32(data[i + 1], data[i + 2], data[i + 3], data[i + 4]).toFixed(2);
                i += 4;
                msg_ok = true;
                break;
            case ENLINK_MC_PM1_0:
                obj.mc_pm1_0 = fromF32(data[i + 1], data[i + 2], data[i + 3], data[i + 4]).toFixed(2);
                i += 4;
                msg_ok = true;
                break;
            case ENLINK_MC_PM2_5:
                obj.mc_pm2_5 = fromF32(data[i + 1], data[i + 2], data[i + 3], data[i + 4]).toFixed(2);
                i += 4;
                msg_ok = true;
                break;
            case ENLINK_MC_PM4_0:
                obj.mc_pm4_0 = fromF32(data[i + 1], data[i + 2], data[i + 3], data[i + 4]).toFixed(2);
                i += 4;
                msg_ok = true;
                break;
            case ENLINK_MC_PM5_0:
                obj.mc_pm5_0 = fromF32(data[i + 1], data[i + 2], data[i + 3], data[i + 4]).toFixed(2);
                i += 4;
                msg_ok = true;
                break;
            case ENLINK_MC_PM10_0:
                obj.mc_pm10_0 = fromF32(data[i + 1], data[i + 2], data[i + 3], data[i + 4]).toFixed(2);
                i += 4;
                msg_ok = true;
                break;

            case ENLINK_NC_PM0_1:
                obj.nc_pm0_1 = fromF32(data[i + 1], data[i + 2], data[i + 3], data[i + 4]).toFixed(2);
                i += 4;
                msg_ok = true;
                break;
            case ENLINK_NC_PM0_3:
                obj.nc_pm0_3 = fromF32(data[i + 1], data[i + 2], data[i + 3], data[i + 4]).toFixed(2);
                i += 4;
                msg_ok = true;
                break;
            case ENLINK_NC_PM0_5:
                obj.nc_pm0_5 = fromF32(data[i + 1], data[i + 2], data[i + 3], data[i + 4]).toFixed(2);
                i += 4;
                msg_ok = true;
                break;
            case ENLINK_NC_PM1_0:
                obj.nc_pm1_0 = fromF32(data[i + 1], data[i + 2], data[i + 3], data[i + 4]).toFixed(2);
                i += 4;
                msg_ok = true;
                break;
            case ENLINK_NC_PM2_5:
                obj.nc_pm2_5 = fromF32(data[i + 1], data[i + 2], data[i + 3], data[i + 4]).toFixed(2);
                i += 4;
                msg_ok = true;
                break;
            case ENLINK_NC_PM4_0:
                obj.nc_pm4_0 = fromF32(data[i + 1], data[i + 2], data[i + 3], data[i + 4]).toFixed(2);
                i += 4;
                msg_ok = true;
                break;
            case ENLINK_NC_PM5_0:
                obj.nc_pm5_0 = fromF32(data[i + 1], data[i + 2], data[i + 3], data[i + 4]).toFixed(2);
                i += 4;
                msg_ok = true;
                break;
            case ENLINK_NC_PM10_0:
                obj.nc_pm10_0 = fromF32(data[i + 1], data[i + 2], data[i + 3], data[i + 4]).toFixed(2);
                i += 4;
                msg_ok = true;
                break;

            case ENLINK_PM_TPS:
                obj.pm_tps = fromF32(data[i + 1], data[i + 2], data[i + 3], data[i + 4]).toFixed(2);
                i += 4;
                msg_ok = true;
                break;

            case ENLINK_DE_EVENT:
                /* Particle Detection Event */
                /* Event raised, not yet identified */
                obj.de_event = U16((data[i + 1] << 8) | (data[i + 2]));
                i += 2;
                msg_ok = true;
                break;

            case ENLINK_DE_SMOKE:
                /* Smoke particles identified */
                obj.de_smoke = U16((data[i + 1] << 8) | (data[i + 2]));
                i += 2;
                msg_ok = true;
                break;

            case ENLINK_DE_VAPE:
                /* Vape particles identified */
                obj.de_vape = U16((data[i + 1] << 8) | (data[i + 2]));
                i += 2;
                msg_ok = true;
                break;

            case ENLINK_GAS_PPB:
                // Need to create array as might have multiple sensors
                var gas_ppb_val = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]).toFixed(2);
                // Values as array triplet
                if (obj.gas_ppb) {
                    obj.gas_ppb.push([data[i + 1], GetGasName(data[i + 1]), gas_ppb_val]);
                } else {
                    obj.gas_ppb = [[data[i + 1], GetGasName(data[i + 1]), gas_ppb_val]];
                }
                i += 5;
                msg_ok = true;
                break;

            case ENLINK_GAS_UGM3:
                // Need to create array as might have multiple sensors
                var gas_ugm3_val = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]).toFixed(2);
                // As Array
                if (obj.gas_ugm3) {
                    obj.gas_ugm3.push([data[i + 1], GetGasName(data[i + 1]), gas_ugm3_val]);
                } else {
                    obj.gas_ugm3 = [[data[i + 1], GetGasName(data[i + 1]), gas_ugm3_val]];
                }
                i += 5;
                msg_ok = true;
                break;

            case ENLINK_CRN_THK:
                // Coupon is either 1 or 2. Bit 7 set for Coupon 2
                cpn = (data[i + 1] & 0x80) === 0 ? 1 : 2;
                metal = GetCrnMetal(data[i + 1]);
                // Thickness in nanometres
                var thk_nm = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]).toFixed(2);
                // As Array
                if (obj.crn_thk_nm) {
                    obj.crn_thk_nm.push([cpn, metal, thk_nm]);
                } else {
                    obj.crn_thk_nm = [[cpn, metal, thk_nm]];
                }
                i += 5;
                msg_ok = true;
                break;

            case ENLINK_CRN_MIN_THK:
                cpn = (data[i + 1] & 0x80) === 0 ? 1 : 2;
                metal = GetCrnMetal(data[i + 1]);
                // Minimum thickness of metal
                var min_nm = U16((data[i + 2] << 8) | (data[i + 3]));
                // As Array
                if (obj.crn_min_nm) {
                    obj.crn_min_nm.push([cpn, metal, min_nm]);
                } else {
                    obj.crn_min_nm = [[cpn, metal, min_nm]];
                }
                i += 3;
                msg_ok = true;
                break;

            case ENLINK_CRN_MAX_THK:
                cpn = (data[i + 1] & 0x80) === 0 ? 1 : 2;
                metal = GetCrnMetal(data[i + 1]);
                // Original thickness of metal
                var max_nm = U16((data[i + 2] << 8) | (data[i + 3]));
                // As Array
                if (obj.crn_max_nm) {
                    obj.crn_max_nm.push([cpn, metal, max_nm]);
                } else {
                    obj.crn_max_nm = [[cpn, metal, max_nm]];
                }
                i += 3;
                msg_ok = true;
                break;

            case ENLINK_CRN_PERC:
                cpn = (data[i + 1] & 0x80) === 0 ? 1 : 2;
                metal = GetCrnMetal(data[i + 1]);
                // Corrosion of coupon in percentage from Max(0%) to Min(100%)
                var perc = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]).toFixed(3);
                // As Array
                if (obj.crn_perc) {
                    obj.crn_perc.push([cpn, metal, perc]);
                } else {
                    obj.crn_perc = [[cpn, metal, perc]];
                }
                i += 5;
                msg_ok = true;
                break;

            case ENLINK_FAST_AQI:
                obj.fast_aqi = U16((data[i + 1] << 8) | (data[i + 2]));
                i += 2;
                msg_ok = true;
                break;

            case ENLINK_EPA_AQI:
                obj.epa_aqi = U16((data[i + 1] << 8) | (data[i + 2]));
                i += 2;
                msg_ok = true;
                break;

            // < -------------------------------------------------------------------------------->
            // Optional KPIs
            case ENLINK_CPU_TEMP_DEP:    // Optional from April 2020
                obj.cpu_temp_dep = data[i + 1] + (Math.round(data[i + 2] * 100 / 256) / 100);
                i += 2;
                msg_ok = true;
                break;
            case ENLINK_CPU_TEMP:    // New for April 2020 Ver: 4.9
                obj.cpu_temp = (S16((data[i + 1] << 8) | (data[i + 2]))) / 10;
                i += 2;
                msg_ok = true;
                break;
            case ENLINK_BATT_STATUS:
                obj.batt_status = data[i + 1];
                i += 1;
                msg_ok = true;
                break;
            case ENLINK_BATT_VOLT:
                //obj.batt_volt = U16((data[i + 1] << 8) | (data[i + 2])) / 1000;
                obj.batt_mv = U16((data[i + 1] << 8) | (data[i + 2]));
                i += 2;
                msg_ok = true;
                break;
            case ENLINK_RX_RSSI:
                obj.rx_rssi = S16((data[i + 1] << 8) | (data[i + 2]));
                i += 2;
                msg_ok = true;
                break;
            case ENLINK_RX_SNR:
                obj.rx_snr = S8(data[i + 1]);
                i += 1;
                msg_ok = true;
                break;
            case ENLINK_RX_COUNT:
                obj.rx_count = U16((data[i + 1] << 8) | (data[i + 2]));
                i += 2;
                msg_ok = true;
                break;
            case ENLINK_TX_TIME:
                obj.tx_time_ms = U16((data[i + 1] << 8) | (data[i + 2]));
                i += 2;
                msg_ok = true;
                break;
            case ENLINK_TX_POWER:
                obj.tx_power_dbm = S8(data[i + 1]);
                i += 1;
                msg_ok = true;
                break;
            case ENLINK_TX_COUNT:
                obj.tx_count = U16((data[i + 1] << 8) | (data[i + 2]));
                i += 2;
                msg_ok = true;
                break;
            case ENLINK_POWER_UP_COUNT:
                obj.power_up_count = U16((data[i + 1] << 8) | (data[i + 2]));
                i += 2;
                msg_ok = true;
                break;
            case ENLINK_USB_IN_COUNT:
                obj.usb_in_count = U16((data[i + 1] << 8) | (data[i + 2]));
                i += 2;
                msg_ok = true;
                break;
            case ENLINK_LOGIN_OK_COUNT:
                obj.login_ok_count = U16((data[i + 1] << 8) | (data[i + 2]));
                i += 2;
                msg_ok = true;
                break;
            case ENLINK_LOGIN_FAIL_COUNT:
                obj.login_fail_count = U16((data[i + 1] << 8) | (data[i + 2]));
                i += 2;
                msg_ok = true;
                break;
            case ENLINK_FAN_RUN_TIME:
                obj.fan_run_time_s =
                    U32((data[i + 1] << 24) | (data[i + 2] << 16) | (data[i + 3] << 8) | (data[i + 4]));
                i += 4;
                msg_ok = true;
                break;
            // < -------------------------------------------------------------------------------->
            case ENLINK_STATUS:
                var sensor_id = (data[i + 1]);
                var status_id = (data[i + 2]);
                var status_val = U16((data[i + 3] << 8) | data[i + 4]);
                if (obj.status) {
                obj.status.push([sensor_id, status_id, status_val]);
                } else {
                obj.status = [[sensor_id, status_id, status_val]];
                }
                i += 4;
                break;
                
            case ENLINK_HEADER: // Ignore this message
                //node.warn("Ignore HEADER");
                i = data.length;
                msg_ok = false;
                break;

            default: // something is wrong with data
                node.warn("Data Error at byte index " + i + "   Data: " + bytesToHex(data));
                i = data.length;
                msg_ok = false;
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
// Function to decode enLink response to downlink message
function decodeStdResponse(data) {
    var obj = {};
    obj.short_eui = msg.eui.slice(-11);
    var msg_ok = false;
    for (var i = 0; i < data.length; i++) {
        switch (data[i]) {
            // Parse reply from device following a downlink command
            case ENLINK_HEADER:
                if (data[i + 1] == ENLINK_ACK) {
                    obj.reply = "ACK";
                    msg_ok = true;
                } else if (data[i + 1] == ENLINK_NACK) {
                    obj.reply = "NACK";
                    msg_ok = true;
                } else {
                    obj.reply = "Reply parse failure";
                }

                if (data[i + 2] == ENLINK_SET_ANTENNA_GAIN) {
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

                } else if (data[i + 2] == ENLINK_SET_CASE_FAN_RUN_TIME) {
                    obj.command = "Set Case Fan Run Time";
                } else if (data[i + 2] == ENLINK_SET_HPM_FAN_RUN_TIME) {
                    obj.command = "Set Particle Sensor Fan Run Time";

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

                } else if (data[i + 2] == ENLINK_LEAK_ALARM_MODE) {
                    obj.command = "Set Leak Sensor Alarm Mode";
                } else if (data[i + 2] == ENLINK_LEAK_UPPER_ALARM) {
                    obj.command = "Set Leak Sensor High Alarm Level";
                } else if (data[i + 2] == ENLINK_LEAK_UPPER_HYST) {
                    obj.command = "Set Leak Sensor High Hysteresis";
                } else if (data[i + 2] == ENLINK_LEAK_LOWER_ALARM) {
                    obj.command = "Set Leak Sensor Low Alarm Level";
                } else if (data[i + 2] == ENLINK_LEAK_LOWER_HYST) {
                    obj.command = "Set Leak Sensor Low Hysteresis";
                } else if (data[i + 2] == ENLINK_LEAK_SAMPLE_TIME_S) {
                    obj.command = "Set Leak Sensor Sample Time";
                } else if (data[i + 2] == ENLINK_LEAK_TEST_DURATION) {
                    obj.command = "Set Leak Sensor Test Time";

                } else if (data[i + 2] == ENLINK_BME680_PKT_INC) {
                    obj.command = "Set VOC Sensor packet includes";
                } else if (data[i + 2] == ENLINK_SPS30_PKT_INC) {
                    obj.command = "Set SPS30 packet includes";
                } else if (data[i + 2] == ENLINK_PIERA_PKT_INC) {
                    obj.command = "Set PIERA/IPS7100 packet includes";

                } else if (data[i + 2] == ENLINK_DP_PKT_INC) {
                    obj.command = "Set DP/AF packet includes";
                } else if (data[i + 2] == ENLINK_DP_AUTO_ZERO) {
                    obj.command = "DP/AF trigger Auto-Zero process";
                } else if (data[i + 2] == ENLINK_DP_SET_DELTA) {
                    obj.command = "Set DP/AF delta offset";

                } else if (data[i + 2] == ENLINK_ZMOD4410_PKT_INC) {
                    obj.command = "Set TVOC Sensor packet includes";

                } else if (data[i + 2] == ENLINK_ZV_SCN_REFRESH_INT) {
                    obj.command = "Set Zone View Screen Refresh rate";
                } else if (data[i + 2] == ENLINK_ZV_DISPLAY_TOPLINE) {
                    obj.command = "Set Zone View display top line option";
                } else if (data[i + 2] == ENLINK_ZV_DISPLAY_TEMP_UNITS) {
                    obj.command = "Set Zone View display temperature unit";
                } else if (data[i + 2] == ENLINK_ZV_DISPLAY_COMF_ICON_TYPE) {
                    obj.command = "Set Zone View display comfort icon type";
                } else if (data[i + 2] == ENLINK_ZV_DISPLAY_COMF_LOCN) {
                    obj.command = "Set Zone View display comfort icon location";
                } else if (data[i + 2] == ENLINK_ZV_COMF_LOGIC) {
                    obj.command = "Set Zone View comfort logic";
                } else if (data[i + 2] == ENLINK_ZV_DISPLAY_COMF_ICON_STATUS) {
                    obj.command = "Set Zone View display comfort icon status";
                } else if (data[i + 2] == ENLINK_ZV_INT_LOGIC_LOW_THRESH) {
                    obj.command = "Set Zone View internal logic low threshold";
                } else if (data[i + 2] == ENLINK_ZV_INT_LOGIC_HIGH_THRESH) {
                    obj.command = "Set Zone View internal logic high threshold";
                } else if (data[i + 2] == ENLINK_ZV_HELP_SCN_ENABLE) {
                    obj.command = "Enable/Disable Zone View Help Screen";
                } else if (data[i + 2] == ENLINK_ZV_SET_TEXT) {
                    obj.command = "Set Zone View text string";
                } else if (data[i + 2] == ENLINK_ZV_SET_TEXT_TO_DEFAULT) {
                    obj.command = "Set Zone View text string to factory default";

                } else if (data[i + 2] == ENLINK_ENABLE_Z45) {
                    obj.command = "Enable/Disable EPA/Ozone Sensor";
                } else if (data[i + 2] == ENLINK_HUMIDITY_TX_RES) {
                    obj.command = "Humidity data resolution changed";
                } else if (data[i + 2] == ENLINK_Z45_TRIG_CLEAN) {
                    obj.command = "EPA/Ozone Sensor Cleaning Triggered";
                    
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
    if (msg_ok) {
        return obj;
    } else {
        return null;
    }
}
// --------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------
function getRegType(byteval) {
    if (byteval == 3) return "Hold";
    if (byteval == 4) return "Inpt";
    return "Err";
}
// --------------------------------------------------------------------------------------
function getDataType(byteval) {
    if (byteval === 0) return "U";
    if (byteval == 1) return "S";
    if (byteval == 2) return "F";
    return "Err";
}
// --------------------------------------------------------------------------------------
function getWordOrder(byteval) {
    if (byteval === 0) return "HH";
    if (byteval == 1) return "HL";
    if (byteval == 2) return "LH";
    if (byteval == 3) return "LL";
    return "Err";
}
// --------------------------------------------------------------------------------------
function getReadType(byteval) {
    if (byteval === 0) return "Int";
    if (byteval == 1) return "Cum";
    return "Err";
}
// --------------------------------------------------------------------------------------
// Display MB Config info Append string to obj
function DecodeMBConfig(data) {
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
// --------------------------------------------------------------------------------------
// Display MB Value info Append string to obj
function DecodeMBValue(data) {
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
// Function to decode enLink Messages
function decodeModbusResponse(data) {
    var msg_ok = false;
    var msg_ack = false;
    var obj = {};
    obj.short_eui = msg.eui.slice(-11);
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
                        obj.query = "MB QRY Config Reply: " + DecodeMBConfig(data);
                    } else {
                        obj.query = "MB QRY Config Error for Item:" + data[4];
                    }
                } else if (data[3] == ENLINK_MB_DP_VALUE) {
                    if (msg_ack) {
                        obj.query = "MB QRY Value Reply: " + DecodeMBValue(data);
                    } else {
                        obj.query = "MB QRY Value Error for Item:" + data[4];
                    }
                }
                break;
            case ENLINK_SET_V2:
                if (data[3] == ENLINK_MB_DP_CONFIG) {
                    // SET doesn't have sub command
                    if (msg_ack) {
                        obj.set = "MB SET Config Reply: " + DecodeMBConfig(data);
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
// --------------------------------------------------------------------------------------

// Start of Main Function

if (!msg.eui)
    return null;

// Ignore Port 0 Possible MAC Command
if (msg.port === 0) {
    return null;
}
// Ignore empty payloads
if (msg.payload) {
    if (msg.payload.length === 0) {
        return null;
    }
    // Ignore single byte Join-Check payloads (Nov 2022)
    if (msg.payload.length === 1) {
        return null;
    }
} else {
    return null;
}

var res = {};

//Check message type
if (msg.payload[0] == ENLINK_HEADER) {
    // This is a response to a downlink command
    //node.warn("Decode DL reply");
    res = decodeStdResponse(msg.payload);
} else if (msg.payload[0] == ENLINK_MB_SYS) {
    // This is a Modbus Setting response
    res = decodeModbusResponse(msg.payload);
} else {
    //node.warn("Decode Telemetry");
    res = decodeTelemetry(msg.payload);
}

if (res !== null) {
    //msg.hex = bytesToHex(msg.payload);
    msg.payload = res;  // use for further function processing
    //delete msg.payload.short_eui;
    msg.human_readable = JSON.stringify(res, null, 4);
    return msg;
}
return null;
