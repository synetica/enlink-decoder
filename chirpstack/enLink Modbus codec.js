// Synetica enLink Modbus Codec for Chirpstack v3 and v4
// 18 August 2023 (FW Ver:3.6)
// https://github.com/synetica/enlink-decoder

// Uplink Data
var ENLINK_MB_EXCEPTION = 0x0F;
var ENLINK_MB_INTERVAL = 0x10;
var ENLINK_MB_CUMULATIVE = 0x11;

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

var ENLINK_REBOOT = 0xFF;

// --------------------------------------------------------------------------------------
// OTA Modbus configuration Only
// V2 Configuration data messages
var ENLINK_MB_SYS = 0xFF;		// System Commands/Messages. e.g. Reboot
var ENLINK_QRY_V2 = 0xFE;		// Query Configuration
var ENLINK_SET_V2 = 0xFD;	    // Set Configuration
var ENLINK_CMD_V2 = 0xFC;		// Commands

var ENLINK_ACK_V2 = 0xAA;
var ENLINK_NACK_V2 = 0xFF;

//var ENLINK_MB_DP_COMMS = 0x40;
var ENLINK_MB_DP_CONFIG = 0x41;
var ENLINK_MB_DP_VALUE = 0x42;
// Commands
var ENLINK_MB_SC_DELETE = 0x7F;

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

            case ENLINK_MB_EXCEPTION: // Modbus Error Code
                // Show data as individual items for CS
                var ex_item_no = data[i + 1];
                var ex_value = data[i + 2];
                if (ex_item_no === 0) { obj.mb_01_ex = ex_value; }
                if (ex_item_no === 1) { obj.mb_02_ex = ex_value; }
                if (ex_item_no === 2) { obj.mb_03_ex = ex_value; }
                if (ex_item_no === 3) { obj.mb_04_ex = ex_value; }
                if (ex_item_no === 4) { obj.mb_05_ex = ex_value; }
                if (ex_item_no === 5) { obj.mb_06_ex = ex_value; }
                if (ex_item_no === 6) { obj.mb_07_ex = ex_value; }
                if (ex_item_no === 7) { obj.mb_08_ex = ex_value; }

                if (ex_item_no === 8) { obj.mb_09_ex = ex_value; }
                if (ex_item_no === 9) { obj.mb_10_ex = ex_value; }
                if (ex_item_no === 10) { obj.mb_11_ex = ex_value; }
                if (ex_item_no === 11) { obj.mb_12_ex = ex_value; }
                if (ex_item_no === 12) { obj.mb_13_ex = ex_value; }
                if (ex_item_no === 13) { obj.mb_14_ex = ex_value; }
                if (ex_item_no === 14) { obj.mb_15_ex = ex_value; }
                if (ex_item_no === 15) { obj.mb_16_ex = ex_value; }

                if (ex_item_no === 16) { obj.mb_17_ex = ex_value; }
                if (ex_item_no === 17) { obj.mb_18_ex = ex_value; }
                if (ex_item_no === 18) { obj.mb_19_ex = ex_value; }
                if (ex_item_no === 19) { obj.mb_20_ex = ex_value; }
                if (ex_item_no === 20) { obj.mb_21_ex = ex_value; }
                if (ex_item_no === 21) { obj.mb_22_ex = ex_value; }
                if (ex_item_no === 22) { obj.mb_23_ex = ex_value; }
                if (ex_item_no === 23) { obj.mb_24_ex = ex_value; }

                if (ex_item_no === 24) { obj.mb_25_ex = ex_value; }
                if (ex_item_no === 25) { obj.mb_26_ex = ex_value; }
                if (ex_item_no === 26) { obj.mb_27_ex = ex_value; }
                if (ex_item_no === 27) { obj.mb_28_ex = ex_value; }
                if (ex_item_no === 28) { obj.mb_29_ex = ex_value; }
                if (ex_item_no === 29) { obj.mb_30_ex = ex_value; }
                if (ex_item_no === 30) { obj.mb_31_ex = ex_value; }
                if (ex_item_no === 31) { obj.mb_32_ex = ex_value; }

                /* Show data as array
                if (obj.mb_ex) {
                    obj.mb_ex.push([data[i + 1], data[i + 2]]);
                } else {
                    obj.mb_ex = [[data[i + 1], data[i + 2]]];
                }
                */
                i += 2;
                break;
            case ENLINK_MB_INTERVAL: // Modbus Interval Read
                // Show data as individual items for CS
                var int_item_no = data[i + 1];
                var int_value = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
                if (int_item_no === 0) { obj.mb_01_int = int_value; }
                if (int_item_no === 1) { obj.mb_02_int = int_value; }
                if (int_item_no === 2) { obj.mb_03_int = int_value; }
                if (int_item_no === 3) { obj.mb_04_int = int_value; }
                if (int_item_no === 4) { obj.mb_05_int = int_value; }
                if (int_item_no === 5) { obj.mb_06_int = int_value; }
                if (int_item_no === 6) { obj.mb_07_int = int_value; }
                if (int_item_no === 7) { obj.mb_08_int = int_value; }

                if (int_item_no === 8) { obj.mb_09_int = int_value; }
                if (int_item_no === 9) { obj.mb_10_int = int_value; }
                if (int_item_no === 10) { obj.mb_11_int = int_value; }
                if (int_item_no === 11) { obj.mb_12_int = int_value; }
                if (int_item_no === 12) { obj.mb_13_int = int_value; }
                if (int_item_no === 13) { obj.mb_14_int = int_value; }
                if (int_item_no === 14) { obj.mb_15_int = int_value; }
                if (int_item_no === 15) { obj.mb_16_int = int_value; }

                if (int_item_no === 16) { obj.mb_17_int = int_value; }
                if (int_item_no === 17) { obj.mb_18_int = int_value; }
                if (int_item_no === 18) { obj.mb_19_int = int_value; }
                if (int_item_no === 19) { obj.mb_20_int = int_value; }
                if (int_item_no === 20) { obj.mb_21_int = int_value; }
                if (int_item_no === 21) { obj.mb_22_int = int_value; }
                if (int_item_no === 22) { obj.mb_23_int = int_value; }
                if (int_item_no === 23) { obj.mb_24_int = int_value; }

                if (int_item_no === 24) { obj.mb_25_int = int_value; }
                if (int_item_no === 25) { obj.mb_26_int = int_value; }
                if (int_item_no === 26) { obj.mb_27_int = int_value; }
                if (int_item_no === 27) { obj.mb_28_int = int_value; }
                if (int_item_no === 28) { obj.mb_29_int = int_value; }
                if (int_item_no === 29) { obj.mb_30_int = int_value; }
                if (int_item_no === 30) { obj.mb_31_int = int_value; }
                if (int_item_no === 31) { obj.mb_32_int = int_value; }

                /* Show data as array
                if (obj.mb_int_val) {
                    obj.mb_int_val.push([data[i + 1], fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5])]);
                } else {
                    obj.mb_int_val = [[data[i + 1], fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5])]];
                }
                */
                i += 5;
                break;
            case ENLINK_MB_CUMULATIVE: // Modbus Cumulative Read
                // Show data as individual items for CS
                var cum_item_no = data[i + 1];
                var cum_value = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
                if (cum_item_no === 0) { obj.mb_01_cum = cum_value; }
                if (cum_item_no === 1) { obj.mb_02_cum = cum_value; }
                if (cum_item_no === 2) { obj.mb_03_cum = cum_value; }
                if (cum_item_no === 3) { obj.mb_04_cum = cum_value; }
                if (cum_item_no === 4) { obj.mb_05_cum = cum_value; }
                if (cum_item_no === 5) { obj.mb_06_cum = cum_value; }
                if (cum_item_no === 6) { obj.mb_07_cum = cum_value; }
                if (cum_item_no === 7) { obj.mb_08_cum = cum_value; }

                if (cum_item_no === 8) { obj.mb_09_cum = cum_value; }
                if (cum_item_no === 9) { obj.mb_10_cum = cum_value; }
                if (cum_item_no === 10) { obj.mb_11_cum = cum_value; }
                if (cum_item_no === 11) { obj.mb_12_cum = cum_value; }
                if (cum_item_no === 12) { obj.mb_13_cum = cum_value; }
                if (cum_item_no === 13) { obj.mb_14_cum = cum_value; }
                if (cum_item_no === 14) { obj.mb_15_cum = cum_value; }
                if (cum_item_no === 15) { obj.mb_16_cum = cum_value; }

                if (cum_item_no === 16) { obj.mb_17_cum = cum_value; }
                if (cum_item_no === 17) { obj.mb_18_cum = cum_value; }
                if (cum_item_no === 18) { obj.mb_19_cum = cum_value; }
                if (cum_item_no === 19) { obj.mb_20_cum = cum_value; }
                if (cum_item_no === 20) { obj.mb_21_cum = cum_value; }
                if (cum_item_no === 21) { obj.mb_22_cum = cum_value; }
                if (cum_item_no === 22) { obj.mb_23_cum = cum_value; }
                if (cum_item_no === 23) { obj.mb_24_cum = cum_value; }

                if (cum_item_no === 24) { obj.mb_25_cum = cum_value; }
                if (cum_item_no === 25) { obj.mb_26_cum = cum_value; }
                if (cum_item_no === 26) { obj.mb_27_cum = cum_value; }
                if (cum_item_no === 27) { obj.mb_28_cum = cum_value; }
                if (cum_item_no === 28) { obj.mb_29_cum = cum_value; }
                if (cum_item_no === 29) { obj.mb_30_cum = cum_value; }
                if (cum_item_no === 30) { obj.mb_31_cum = cum_value; }
                if (cum_item_no === 31) { obj.mb_32_cum = cum_value; }

                /* Show data as array
                if (obj.mb_cum_val) {
                    obj.mb_cum_val.push([data[i + 1], fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5])]);
                } else {
                    obj.mb_cum_val = [[data[i + 1], fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5])]];
                }
                */
                i += 5;
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
    if (bytes[0] == ENLINK_MB_SYS) {
        // This is a Modbus Setting response
        return decodeModbusResponse(bytes);
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
