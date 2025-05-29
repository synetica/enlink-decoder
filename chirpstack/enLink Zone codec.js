// Synetica enLink Zone / Zone 2 / Zone View Codec for Chirpstack v3 and v4
// 29 May 2025 (FW Ver:7.14)
// 24 Apr 2025 Includes Temperature fix
// https://github.com/synetica/enlink-decoder

/* Uplink Data */
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

// M
var ENLINK_DETECTION_COUNT = 0x13;
var ENLINK_OCC_TIME = 0x14;

// I (PBAQ)
var ENLINK_MIN_TVOC = 0x36;
var ENLINK_AVG_TVOC = 0x37;
var ENLINK_MAX_TVOC = 0x38;
var ENLINK_ETOH = 0x39;
var ENLINK_TVOC_IAQ = 0x3A;

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
var ENLINK_CPU_TEMP = 0x4E;

var ENLINK_STATUS = 0xFE;

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

// Radio packet includes for VOC sensor
var ENLINK_BME680_PKT_INC = 0x3C;

// Radio packet includes for TVOC sensor
var ENLINK_ZMOD4410_PKT_INC = 0x42;

// Options for the Zone View e-paper
var ENLINK_ZV_SCN_REFRESH_INT = 0x43;
var ENLINK_ZV_DISPLAY_TOPLINE = 0x44;
var ENLINK_ZV_DISPLAY_TEMP_UNITS = 0x45;
var ENLINK_ZV_DISPLAY_COMF_ICON_TYPE = 0x46;
var ENLINK_ZV_DISPLAY_COMF_LOCN = 0x47;
var ENLINK_ZV_COMF_LOGIC = 0x48;
var ENLINK_ZV_DISPLAY_COMF_ICON_STATUS = 0x49;
var ENLINK_ZV_INT_LOGIC_LOW_THRESH = 0x4A;
var ENLINK_ZV_INT_LOGIC_HIGH_THRESH = 0x4B;
var ENLINK_ZV_HELP_SCN_ENABLE = 0x4C;
var ENLINK_ZV_SET_TEXT = 0xD0;
var ENLINK_ZV_SET_TEXT_TO_DEFAULT = 0xD1;

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
// Workaround Fix for OAQ/IAQ/ZN2/ZV v7.01~7.09
function t_fix_v7(t) {
    var num = t & 0xFFFF;
    if (0x8000 & num)
        num = 655 + num;
    return num & 0xFFFF;
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
                obj.temp_c_fix_v7 = (t_fix_v7((data[i + 1] << 8) | data[i + 2])) / 10;
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

            // M
            case ENLINK_DETECTION_COUNT:
                obj.det_count = U32((data[i + 1] << 24) | (data[i + 2] << 16) | (data[i + 3] << 8) | (data[i + 4]));
                i += 4;
                break;
            case ENLINK_OCC_TIME: // Occupied time in seconds
                obj.occ_time_s = U32((data[i + 1] << 24) | (data[i + 2] << 16) | (data[i + 3] << 8) | (data[i + 4]));
                i += 4;
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
            // < -------------------------------------------------------------------------------->
            case ENLINK_STATUS:
                obj.status_sensor_id = (data[i + 1]);
                obj.status_id = (data[i + 2]);
                obj.status_val = U16((data[i + 3] << 8) | data[i + 4]);
                i += 4;
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

                } else if (data[i + 2] == ENLINK_BME680_PKT_INC) {
                    obj.command = "Set VOC Sensor packet includes";

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
