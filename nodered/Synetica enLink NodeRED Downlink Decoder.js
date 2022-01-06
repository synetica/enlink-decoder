// Used for decoding enLink Uplink replies from Downlink messages
// --------------------------------------------------------------------------------------
// 05 Jan 2022 - FW Ver:4.48
// --------------------------------------------------------------------------------------

if (!msg.eui) return null;

// --------------------------------------------------------------------------------------
// Ignore Port 0 Possible MAC Command
if (msg.port === 0) {
    return null;
}
// Ignore zero payloads
if (msg.payload) {
    if (msg.payload.length === 0) {
        return null;
    }
} else {
    return null;
}
// --------------------------------------------------------------------------------------

// V1 - Downlink reply message Header and ACK/NAK
const ENLINK_HEADER = 0xA5;
const ENLINK_ACK = 0x06;
const ENLINK_NACK = 0x15;
// Downlink reply message values
const ENLINK_SET_PUBLIC = 0x02;
const ENLINK_SET_USE_USER_DEVEUI = 0x03;
const ENLINK_SET_USER_DEVEUI = 0x04;   // 8 bytes
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

const ENLINK_REBOOT = 0xFF;

// Function to decode enLink Messages
function DecodePayload(data) {
    var obj = {};
    obj.v1_msg_eui = msg.eui.slice(-8);
    var msg_ok = false;
    for (i = 0; i < data.length; i++) {
        console.log(data[i]);
        switch (data[i]) {
            // Parse Reply Message
            case ENLINK_HEADER: // Response from enLink Device
                if (data[i + 1] == ENLINK_ACK) {
                    obj.reply = "ACK";
                    msg_ok = true;
                } else if (data[i + 1] == ENLINK_NACK) {
                    obj.reply = "NACK";
                    msg_ok = true;
                } else {
                    obj.reply = "Reply parse failure";
                }

                if (data[i + 2] == ENLINK_SET_PUBLIC) {
                    obj.command = "Set Public";
                } else if (data[i + 2] == ENLINK_SET_USE_USER_DEVEUI) {
                    obj.command = "Set Use User DevEUI";
                } else if (data[i + 2] == ENLINK_SET_USER_DEVEUI) {
                    obj.command = "Set User DevEUI";
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

                } else if (data[i + 2] == ENLINK_REBOOT) {
                    obj.command = "Reboot";
                } else {
                    obj.command = "Command parse failure: " + data[i + 2];
                }

                i = data.length;
                break;

            default: // something is wrong with data
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

var res = DecodePayload(msg.payload);
if (res !== null) {
    var json = JSON.stringify(res, null, 4);
    msg.payload = json;
    return msg;
} else {
    return null;
}
