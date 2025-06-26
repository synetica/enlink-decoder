// Synetica enLink Voltage/Current (Analog) Codec for Actility ThingPark
// 29 May 2025 (FW Ver:7.14)
// https://github.com/synetica/enlink-decoder

// Uplink Data
var ENLINK_TEMP = 0x01;
var ENLINK_RH = 0x02;

var ENLINK_VOLTAGE = 0x2E;
var ENLINK_CURRENT = 0x2F;
var ENLINK_RESISTANCE = 0x30;

// Optional KPI values that can be included in the uplink
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
// Downlink reply (it's an uplink) message Header and ACK/NAK
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

// Diff Press/ Air Flow Settings
var ENLINK_DP_PKT_INC = 0x3F;
var ENLINK_DP_AUTO_ZERO = 0x40;
var ENLINK_DP_SET_DELTA = 0x41;

var ENLINK_REBOOT = 0xFF;

// --------------------------------------------------------------------------------------
// Helper Function
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
// S16 -> U16
function U16(ival) {
    if (isNaN(ival) === false) {
        if (ival < 0) {
            ival = ival + 65536;
        }
    }
    return ival;
}
// S32 -> U32
function U32(ival) {
    if (isNaN(ival) === false) {
        if (ival < 0) {
            ival = ival + 4294967296;
        }
    }
    return ival;
}
// U32 -> S32
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
function decodeTelemetry(input) {
    let result = {
        data: {},
        errors: [],
        warnings: []
    };
    var obj = new Object();
    const data = Buffer.from(input.bytes);

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

            case ENLINK_VOLTAGE: // 2 bytes U16, 0 to 10.000 V
                obj.adc_v = U16((data[i + 1] << 8) | (data[i + 2])) / 1000;
                i += 2;
                break;
            case ENLINK_CURRENT: // 2 bytes U16, 0 to 20.000 mA
                obj.adc_ma = U16((data[i + 1] << 8) | (data[i + 2])) / 1000;
                i += 2;
                break;
            case ENLINK_RESISTANCE: // 2 bytes U16, 0 to 6553.5 kOhm
                obj.adc_kohm = U16((data[i + 1] << 8) | (data[i + 2])) / 10;
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

            default: // something is wrong with data
                result.errors.push("Error at index " + i + "  Byte value " + data[i]);
                delete result.data;
                return result;
        }
    }
    result.data = obj;
    return result;
}
// --------------------------------------------------------------------------------------
// Function to decode enLink response to downlink message
function decodeStdResponse(input) {
    let result = {
        data: {},
        errors: [],
        warnings: []
    };
    var obj = new Object();
    const data = Buffer.from(input.bytes);

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
    result.data = obj;
    return result;
}
// --------------------------------------------------------------------------------------

/**
 * @typedef {Object} DecodedUplink
 * @property {Object} data - The open JavaScript object representing the decoded uplink payload when no errors occurred
 * @property {string[]} errors - A list of error messages while decoding the uplink payload
 * @property {string[]} warnings - A list of warning messages that do not prevent the driver from decoding the uplink payload
 */

/**
 * Decode uplink
 * @param {Object} input - An object provided by the IoT Flow framework
 * @param {number[]} input.bytes - Array of bytes represented as numbers as it has been sent from the device
 * @param {number} input.fPort - The Port Field on which the uplink has been sent
 * @param {Date} input.recvTime - The uplink message time recorded by the LoRaWAN network server
 * @returns {DecodedUplink} The decoded object
 */
function decodeUplink(input) {
    let result = {
        errors: [],
        warnings: []
    };
    if (input.bytes.length === 0) {
        result.errors.push("Payload is zero length");
        return result;
    }
    if (input.bytes.length === 1) {
        result.errors.push("Payload is a single byte (possible Join Check)");
        return result;
    }
    if (input.bytes[0] == ENLINK_HEADER) {
        // This is a reply to a downlink command
        return decodeStdResponse(input);
    }
    return decodeTelemetry(input);
}

// --------------------------------------------------------------------------------------

/**
 * @typedef {Object} EncodedDownlink
 * @property {number[]} bytes - Array of bytes represented as numbers as it will be sent to the device
 * @property {number} fPort - The Port Field on which the downlink must be sent
 * @property {string[]} errors - A list of error messages while encoding the downlink object
 * @property {string[]} warnings - A list of warning messages that do not prevent the driver from encoding the downlink object
 */

/**
 * Downlink encode
 * @param {Object} input - An object provided by the IoT Flow framework
 * @param {Object} input.data - The higher-level object representing your downlink
 * @returns {EncodedDownlink} The encoded object
 */
function encodeDownlink(input) { }


// --------------------------------------------------------------------------------------

/**
 * @typedef {Object} DecodedDownlink
 * @property {Object} data - The open JavaScript object representing the decoded downlink payload when no errors occurred
 * @property {string[]} errors - A list of error messages while decoding the downlink payload
 * @property {string[]} warnings - A list of warning messages that do not prevent the driver from decoding the downlink payload
 */

/**
 * Downlink decode
 * @param {Object} input - An object provided by the IoT Flow framework
 * @param {number[]} input.bytes - Array of bytes represented as numbers as it will be sent to the device
 * @param {number} input.fPort - The Port Field on which the downlink must be sent
 * @param {Date} input.recvTime - The uplink message time computed by the IoT Flow framework
 * @returns {DecodedDownlink} The decoded object
 */
function decodeDownlink(input) { }
