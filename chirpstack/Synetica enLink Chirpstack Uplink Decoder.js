// Synetica Payload Decoder for Chirpstack
// Published 30 Sep 2021
// FW Ver:4.43

var data = {};
var warnings = [];
var errors = [];
var i;

var ENLINK_TEMP = 0x01;
var ENLINK_RH = 0x02;
var ENLINK_LUX = 0x03;
var ENLINK_PRESSURE = 0x04;
var ENLINK_VOC_IAQ = 0x05;
var ENLINK_O2PERC = 0x06;
var ENLINK_CO = 0x07;
var ENLINK_CO2 = 0x08;
var ENLINK_OZONE = 0x09;
var ENLINK_POLLUTANTS = 0x0A;
var ENLINK_PM25 = 0x0B;
var ENLINK_PM10 = 0x0C;
var ENLINK_H2S = 0x0D;
var ENLINK_COUNTER = 0x0E;
var ENLINK_MB_EXCEPTION = 0x0F;
var ENLINK_MB_INTERVAL = 0x10;
var ENLINK_MB_CUMULATIVE = 0x11;
var ENLINK_BVOC = 0x12;
var ENLINK_DETECTION_COUNT = 0x13;
var ENLINK_OCC_TIME = 0x14;
var ENLINK_OCC_STATUS = 0x15;
var ENLINK_LIQUID_LEVEL_STATUS = 0x16;
var ENLINK_TEMP_PROBE1 = 0x17;
var ENLINK_TEMP_PROBE2 = 0x18;
var ENLINK_TEMP_PROBE3 = 0x19;
var ENLINK_TEMP_PROBE_IN_BAND_DURATION_S_1 = 0x1A;
var ENLINK_TEMP_PROBE_IN_BAND_DURATION_S_2 = 0x1B;
var ENLINK_TEMP_PROBE_IN_BAND_DURATION_S_3 = 0x1C;
var ENLINK_TEMP_PROBE_IN_BAND_ALARM_COUNT_1 = 0x1D;
var ENLINK_TEMP_PROBE_IN_BAND_ALARM_COUNT_2 = 0x1E;
var ENLINK_TEMP_PROBE_IN_BAND_ALARM_COUNT_3 = 0x1F;
var ENLINK_TEMP_PROBE_LOW_DURATION_S_1 = 0x20;
var ENLINK_TEMP_PROBE_LOW_DURATION_S_2 = 0x21;
var ENLINK_TEMP_PROBE_LOW_DURATION_S_3 = 0x22;
var ENLINK_TEMP_PROBE_LOW_ALARM_COUNT_1 = 0x23;
var ENLINK_TEMP_PROBE_LOW_ALARM_COUNT_2 = 0x24;
var ENLINK_TEMP_PROBE_LOW_ALARM_COUNT_3 = 0x25;
var ENLINK_TEMP_PROBE_HIGH_DURATION_S_1 = 0x26;
var ENLINK_TEMP_PROBE_HIGH_DURATION_S_2 = 0x27;
var ENLINK_TEMP_PROBE_HIGH_DURATION_S_3 = 0x28;
var ENLINK_TEMP_PROBE_HIGH_ALARM_COUNT_1 = 0x29;
var ENLINK_TEMP_PROBE_HIGH_ALARM_COUNT_2 = 0x2A;
var ENLINK_TEMP_PROBE_HIGH_ALARM_COUNT_3 = 0x2B;

var ENLINK_DIFF_PRESSURE = 0X2C;
var ENLINK_AIR_FLOW = 0x2D;
var ENLINK_VOLTAGE = 0x2E;
var ENLINK_CURRENT = 0x2F;
var ENLINK_RESISTANCE = 0x30;
var ENLINK_LEAK_DETECT_EVT = 0x31;
var ENLINK_CO2E = 0x3F;

var ENLINK_SOUND_MIN = 0x50;
var ENLINK_SOUND_AVG = 0x51;
var ENLINK_SOUND_MAX = 0x52;
var ENLINK_NO = 0x53;
var ENLINK_NO2 = 0x54;
var ENLINK_NO2_20 = 0x55;
var ENLINK_SO2 = 0x56;

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

var ENLINK_GAS_PPB = 0x61;
var ENLINK_GAS_UGM3 = 0x66;

var ENLINK_CRN_THK = 0x62;
var ENLINK_CRN_MIN_THK = 0x63;
var ENLINK_CRN_MAX_THK = 0x64;
var ENLINK_CRN_PERC = 0x65;
var ENLINK_FAST_AQI = 0x67;
var ENLINK_EPA_AQI = 0x68;

var ENLINK_TVOC_IAQ = 0x69;
var ENLINK_TVOC = 0x6A;
var ENLINK_TVOC_ECO2 = 0x6B;

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

// Return gas name from gas type byte
var GAS_HCHO_CH2O = 0x17;   // Formaldehyde 
var GAS_VOCs = 0x18;        // VOCs 
var GAS_CO = 0x19;          // Carbon Monoxide 
var GAS_CL2 = 0x1A;         // Chlorine 
var GAS_H2 = 0x1B;          // Hydrogen 
var GAS_H2S = 0x1C;         // Hydrogen Sulphide
var GAS_HCl = 0x1D;         // Hydrogen Chloride
var GAS_HCN = 0x1E;         // Hydrogen Cyanide
var GAS_HF = 0x1F;          // Hydrogen Fluoride
var GAS_NH3 = 0x20;         // Ammonia
var GAS_NO2 = 0x21;         // Nitrogen Dioxide
var GAS_O2 = 0x22;          // Oxygen
var GAS_O3 = 0x23;          // Ozone
var GAS_SO2 = 0x24;         // Sulfur Dioxide (IUPAC) SO2

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
// --------------------------------------------------------------------------------------
// Function to decode enLink Messages
function DecodePayload(data) {
	var cpn;
	var metal;
var obj = new Object();
	for (i = 0; i < data.length; i++) {
		switch (data[i]) {
			// Parse Sensor Message Parts
			case ENLINK_TEMP: // Temperature
				obj.temp_c = (S16((data[i + 1] << 8) | (data[i + 2]))) / 10;
				obj.temp_f = ((obj.temp_c * 9 / 5) + 32);
				i += 2;
				break;
			case ENLINK_RH: // Humidity %rH
				obj.humidity = (data[i + 1]);
				i += 1;
				break;
			case ENLINK_LUX: // Light Level lux
				obj.lux = U16((data[i + 1] << 8) | (data[i + 2]));
				i += 2;
				break;
			case ENLINK_PRESSURE: // Barometric Pressure
				obj.pressure = U16((data[i + 1] << 8) | (data[i + 2]));
				i += 2;
				break;
			case ENLINK_VOC_IAQ: // Indoor Air Quality (0-500)
				obj.iaq = U16((data[i + 1] << 8) | (data[i + 2]));
				i += 2;
				break;
			case ENLINK_O2PERC: // O2 percentage
				obj.o2perc = (data[i + 1]) / 10;
				i += 1;
				break;
			case ENLINK_CO: // Carbon Monoxide
				obj.co_ppm = U16((data[i + 1] << 8) | (data[i + 2])) / 100;
				i += 2;
				break;
			case ENLINK_CO2: // Carbon Dioxide
				obj.co2_ppm = U16((data[i + 1] << 8) | (data[i + 2]));
				i += 2;
				break;
			case ENLINK_OZONE: // Ozone ppm and ppb
				obj.ozone_ppm = U16((data[i + 1] << 8) | (data[i + 2])) / 10000;
				obj.ozone_ppb = U16((data[i + 1] << 8) | (data[i + 2])) / 10;
				i += 2;
				break;
			case ENLINK_POLLUTANTS: // Pollutants kOhm
				obj.pollutants_kohm = U16((data[i + 1] << 8) | (data[i + 2])) / 10;
				i += 2;
				break;
			case ENLINK_PM25: // Particulates @2.5
				obj.pm25 = U16((data[i + 1] << 8) | (data[i + 2]));
				i += 2;
				break;
			case ENLINK_PM10: // Particulates @10
				obj.pm10 = U16((data[i + 1] << 8) | (data[i + 2]));
				i += 2;
				break;
			case ENLINK_H2S: // Hydrogen Sulphide
				obj.h2s_ppm = U16((data[i + 1] << 8) | (data[i + 2])) / 100;
				i += 2;
				break;

			case ENLINK_COUNTER:
				var inputN = data[i + 1];
				var pulseCount = (data[i + 2] << 24) | (data[i + 3] << 16) | (data[i + 4] << 8) | (data[i + 5]);
				if (inputN === 0x00) { obj.pulseAbs = pulseCount; }
				if (inputN === 0x01) { obj.pulseAbs2 = pulseCount; }
				if (inputN === 0x02) { obj.pulseAbs3 = pulseCount; }
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
				if (obj.mb_int_val) {
					obj.mb_int_val.push([data[i + 1], fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5])]);
				} else {
					obj.mb_int_val = [[data[i + 1], fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5])]];
				}
				i += 5;
				break;
			case ENLINK_MB_CUMULATIVE: // Modbus Cumulative Read
				if (obj.mb_cum_val) {
					obj.mb_cum_val.push([data[i + 1], fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5])]);
				} else {
					obj.mb_cum_val = [[data[i + 1], fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5])]];
				}
				i += 5;
				break;

			case ENLINK_BVOC:     // Breath VOC Estimate equivalent
				obj.bvoc = fromF32(data[i + 1], data[i + 2], data[i + 3], data[i + 4]);
				i += 4;
				break;

			case ENLINK_DETECTION_COUNT:
				obj.det_count = U32((data[i + 1] << 24) | (data[i + 2] << 16) | (data[i + 3] << 8) | (data[i + 4]));
				i += 4;
				break;
			case ENLINK_OCC_TIME: // Occupied time in seconds
				obj.occ_time_s = U32((data[i + 1] << 24) | (data[i + 2] << 16) | (data[i + 3] << 8) | (data[i + 4]));
				i += 4;
				break;
			case ENLINK_OCC_STATUS: // 1 byte U8, 1 or 0, occupancy status
				obj.occupied = (data[i + 1]) ? true : false;
				i += 1;
				break;
			case ENLINK_LIQUID_LEVEL_STATUS: // 1 byte U8, 1 or 0, liquid level status
				obj.liquid_detected = (data[i + 1]) ? true : false;
				i += 1;
				break;

			case ENLINK_TEMP_PROBE1:
				obj.temp_probe_1 = S16((data[i + 1] << 8 | data[i + 2])) / 10;
				i += 2;
				break;
			case ENLINK_TEMP_PROBE2:
				obj.temp_probe_2 = S16((data[i + 1] << 8 | data[i + 2])) / 10;
				i += 2;
				break;
			case ENLINK_TEMP_PROBE3:
				obj.temp_probe_3 = S16((data[i + 1] << 8 | data[i + 2])) / 10;
				i += 2;
				break;
			case ENLINK_TEMP_PROBE_IN_BAND_DURATION_S_1:
				/* Cumulative detection time u32 */
				obj.temp_probe_in_band_duration_s_1 =
					U32((data[i + 1] << 24) | (data[i + 2] << 16) | (data[i + 3] << 8) | (data[i + 4]));
				i += 4;
				break;
			case ENLINK_TEMP_PROBE_IN_BAND_DURATION_S_2:
				/* Cumulative detection time u32 */
				obj.temp_probe_in_band_duration_s_2 =
					U32((data[i + 1] << 24) | (data[i + 2] << 16) | (data[i + 3] << 8) | (data[i + 4]));
				i += 4;
				break;
			case ENLINK_TEMP_PROBE_IN_BAND_DURATION_S_3:
				/* Cumulative detection time u32 */
				obj.temp_probe_in_band_duration_s_3 =
					U32((data[i + 1] << 24) | (data[i + 2] << 16) | (data[i + 3] << 8) | (data[i + 4]));
				i += 4;
				break;
			case ENLINK_TEMP_PROBE_IN_BAND_ALARM_COUNT_1:
				/* In band alarm events u16 */
				obj.temp_probe_in_band_alarm_count_1 = U16((data[i + 1] << 8) | (data[i + 2]));
				i += 2;
				break;
			case ENLINK_TEMP_PROBE_IN_BAND_ALARM_COUNT_2:
				/* In band alarm events u16 */
				obj.temp_probe_in_band_alarm_count_2 = U16((data[i + 1] << 8) | (data[i + 2]));
				i += 2;
				break;
			case ENLINK_TEMP_PROBE_IN_BAND_ALARM_COUNT_3:
				/* In band alarm events u16 */
				obj.temp_probe_in_band_alarm_count_3 = U16((data[i + 1] << 8) | (data[i + 2]));
				i += 2;
				break;
			case ENLINK_TEMP_PROBE_LOW_DURATION_S_1:
				/* Cumulative detection time u32 */
				obj.temp_probe_low_duration_s_1 =
					U32((data[i + 1] << 24) | (data[i + 2] << 16) | (data[i + 3] << 8) | (data[i + 4]));
				i += 4;
				break;
			case ENLINK_TEMP_PROBE_LOW_DURATION_S_2:
				/* Cumulative detection time u32 */
				obj.temp_probe_low_duration_s_2 =
					U32((data[i + 1] << 24) | (data[i + 2] << 16) | (data[i + 3] << 8) | (data[i + 4]));
				i += 4;
				break;
			case ENLINK_TEMP_PROBE_LOW_DURATION_S_3:
				/* Cumulative detection time u32 */
				obj.temp_probe_low_duration_s_3 =
					U32((data[i + 1] << 24) | (data[i + 2] << 16) | (data[i + 3] << 8) | (data[i + 4]));
				i += 4;
				break;
			case ENLINK_TEMP_PROBE_LOW_ALARM_COUNT_1:
				/* Low alarm events u16 */
				obj.temp_probe_low_alarm_count_1 = U16((data[i + 1] << 8) | (data[i + 2]));
				i += 2;
				break;
			case ENLINK_TEMP_PROBE_LOW_ALARM_COUNT_2:
				/* Low alarm events u16 */
				obj.temp_probe_low_alarm_count_2 = U16((data[i + 1] << 8) | (data[i + 2]));
				i += 2;
				break;
			case ENLINK_TEMP_PROBE_LOW_ALARM_COUNT_3:
				/* Low alarm events u16 */
				obj.temp_probe_low_alarm_count_3 = U16((data[i + 1] << 8) | (data[i + 2]));
				i += 2;
				break;
			case ENLINK_TEMP_PROBE_HIGH_DURATION_S_1:
				/* Cumulative detection time u32 */
				obj.temp_probe_high_duration_s_1 =
					U32((data[i + 1] << 24) | (data[i + 2] << 16) | (data[i + 3] << 8) | (data[i + 4]));
				i += 4;
				break;
			case ENLINK_TEMP_PROBE_HIGH_DURATION_S_2:
				/* Cumulative detection time u32 */
				obj.temp_probe_high_duration_s_2 =
					U32((data[i + 1] << 24) | (data[i + 2] << 16) | (data[i + 3] << 8) | (data[i + 4]));
				i += 4;
				break;
			case ENLINK_TEMP_PROBE_HIGH_DURATION_S_3:
				/* Cumulative detection time u32 */
				obj.temp_probe_high_duration_s_3 =
					U32((data[i + 1] << 24) | (data[i + 2] << 16) | (data[i + 3] << 8) | (data[i + 4]));
				i += 4;
				break;
			case ENLINK_TEMP_PROBE_HIGH_ALARM_COUNT_1:
				/* High alarm events u16 */
				obj.temp_probe_high_alarm_count_1 = U16((data[i + 1] << 8) | (data[i + 2]));
				i += 2;
				break;
			case ENLINK_TEMP_PROBE_HIGH_ALARM_COUNT_2:
				/* High alarm events u16 */
				obj.temp_probe_high_alarm_count_2 = U16((data[i + 1] << 8) | (data[i + 2]));
				i += 2;
				break;
			case ENLINK_TEMP_PROBE_HIGH_ALARM_COUNT_3:
				/* High alarm events u16 */
				obj.temp_probe_high_alarm_count_3 = U16((data[i + 1] << 8) | (data[i + 2]));
				i += 2;
				break;

			case ENLINK_DIFF_PRESSURE: // 4 bytes F32, +/- 5000 Pa
				obj.dp_pa = fromF32(data[i + 1], data[i + 2], data[i + 3], data[i + 4]);
				i += 4;
				break;
			case ENLINK_AIR_FLOW: // 4 bytes F32, 0 -> 100m/s
				obj.af_mps = fromF32(data[i + 1], data[i + 2], data[i + 3], data[i + 4]);
				i += 4;
				break;
			case ENLINK_VOLTAGE: // 2 bytes U16, 0 to 10.000 V
				obj.adc_v = U16((data[i + 1] << 8) | (data[i + 2])) / 1000;
				i += 2;
				break;
			case ENLINK_CURRENT: // 2 bytes U16, 0 to 20.000 mA
				obj.adc_ma = U16((data[i + 1] << 8) | (data[i + 2])) / 1000;
				i += 2;
				break;
			case ENLINK_RESISTANCE: // 2 bytes U16, 0 to 10.000 kOhm
				obj.adc_kohm = U16((data[i + 1] << 8) | (data[i + 2])) / 1000;
				i += 2;
				break;
			case ENLINK_LEAK_DETECT_EVT: // 1 byte U8, Leak status changed
				obj.leak_detect_event = (data[i + 1]) ? true : false;
				i += 1;
				break;
			case ENLINK_CO2E: // CO2e Estimate Equivalent
				obj.co2e_ppm = fromF32(data[i + 1], data[i + 2], data[i + 3], data[i + 4]);
				i += 4;
				break;

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

			case ENLINK_NO: // Nitric Oxide
				obj.no_ppm = U16((data[i + 1] << 8) | (data[i + 2])) / 100;
				i += 2;
				break;
			case ENLINK_NO2: // Nitrogen Dioxide scaled at 0-5ppm
				obj.no2_ppm = U16((data[i + 1] << 8) | (data[i + 2])) / 10000;
				i += 2;
				break;
			case ENLINK_NO2_20: // Nitrogen Dioxide scaled at 0-20ppm
				obj.no2_20_ppm = U16((data[i + 1] << 8) | (data[i + 2])) / 1000;
				i += 2;
				break;
			case ENLINK_SO2: // Sulphur Dioxide 0-20ppm
				obj.so2_ppm = U16((data[i + 1] << 8) | (data[i + 2])) / 1000;
				i += 2;
				break;

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

			case ENLINK_PM_TPS:
				obj.pm_tps = fromF32(data[i + 1], data[i + 2], data[i + 3], data[i + 4]);
				i += 4;
				break;

			case ENLINK_GAS_PPB:
				switch (data[i + 1]) {
					case GAS_HCHO_CH2O:
						obj.HCHO_CH2O_ppb = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
						break;
					case GAS_VOCs:
						obj.VOCs_ppb = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
						break;
					case GAS_CO:
						obj.CO_ppb = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
						break;
					case GAS_CL2:
						obj.CL2_ppb = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
						break;
					case GAS_H2:
						obj.H2_ppb = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
						break;
					case GAS_H2S:
						obj.H2S_ppb = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
						break;
					case GAS_HCl:
						obj.HCl_ppb = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
						break;
					case GAS_HCN:
						obj.HCN_ppb = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
						break;
					case GAS_HF:
						obj.HF_ppb = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
						break;
					case GAS_NH3:
						obj.NH3_ppb = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
						break;
					case GAS_NO2:
						obj.NO2_ppb = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
						break;
					case GAS_O2:
						obj.O2_ppb = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
						break;
					case GAS_O3:
						obj.O3_ppb = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
						break;
					case GAS_SO2:
						obj.SO2_ppb = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
						break;
				}
				i += 5;
				break;

			case ENLINK_GAS_UGM3:
				switch (data[i + 1]) {
					case GAS_HCHO_CH2O:
						obj.HCHO_CH2O_ugm3 = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
						break;
					case GAS_VOCs:
						obj.VOCs_ugm3 = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
						break;
					case GAS_CO:
						obj.CO_ugm3 = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
						break;
					case GAS_CL2:
						obj.CL2_ugm3 = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
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
				}
				i += 5;
				break;

			case ENLINK_CRN_THK:
				// Coupon is either 1 or 2. Bit 7 set for Coupon 2
				cpn = (data[i + 1] & 0x80) === 0 ? 1 : 2;
				metal = GetCrnMetal(data[i + 1]);
				// Thickness in nanometres
				var thk_nm = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
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
				var min_nm = U16((data[i + 2] << 8) | (data[i + 3]));
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
				var max_nm = U16((data[i + 2] << 8) | (data[i + 3]));
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
				var perc = fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5]);
				// As Array
				if (obj.crn_perc) {
					obj.crn_perc.push([cpn, metal, perc]);
				} else {
					obj.crn_perc = [[cpn, metal, perc]];
				}
				i += 5;
				break;
				
			case ENLINK_FAST_AQI:
				obj.fast_aqi = U16((data[i + 1] << 8) | (data[i + 2]));
				i += 2;
				break;
				
			case ENLINK_EPA_AQI:
				obj.epa_aqi = U16((data[i + 1] << 8) | (data[i + 2]));
				i += 2;
				break;

			case ENLINK_TVOC_IAQ:
				obj.tvoc_iaq = fromF32(data[i + 1], data[i + 2], data[i + 3], data[i + 4]);
				i += 4;
				break;
				
			case ENLINK_TVOC:
				obj.tvoc = fromF32(data[i + 1], data[i + 2], data[i + 3], data[i + 4]);
				i += 4;
				break;
				
			case ENLINK_TVOC_ECO2:
				obj.tvoc_eco2 = fromF32(data[i + 1], data[i + 2], data[i + 3], data[i + 4]);
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
				obj.batt_v = U16((data[i + 1] << 8) | (data[i + 2])) / 1000;
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
			case ENLINK_FAN_RUN_TIME:
				obj.fan_run_time_s =
					U32((data[i + 1] << 24) | (data[i + 2] << 16) | (data[i + 3] << 8) | (data[i + 4]));
				i += 4;
				break;
			default: // something is wrong with data
				i = data.length;
				obj.error = "Error at " + i + " byte value " + data[i];
				break;
		}
	}
	return obj;
}

function Decode(fPort, bytes) {
		var fPort = fPort;
		var bytes = bytes;

	return {
		data: DecodePayload(bytes),
		warnings: warnings,
		errors: errors
	};
}
