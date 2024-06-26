// Synetica Payload Decoder for The Things Stack V3
// 26 Jun 2024 (FW Ver:6.14)
// https://github.com/synetica/enlink-decoder

function decodeUplink(input) {
 var bytes = input.bytes;
 var fPort = input.fPort;
 var data = {};
 var warnings = [];
 var errors = [];
 var i;

 const ENL_TEMP = 0x01;
 const ENL_RH = 0x02;
 const ENL_LUX = 0x03;
 const ENL_PRESSURE = 0x04;
 const ENL_VOC_IAQ = 0x05;
 const ENL_O2PERC = 0x06;
 const ENL_CO = 0x07;
 const ENL_CO2 = 0x08;
 const ENL_OZONE = 0x09;
 const ENL_POLLUTANTS = 0x0A;
 const ENL_H2S = 0x0D;
 const ENL_COUNTER = 0x0E;
 const ENL_MB_EXCEPTION = 0x0F;
 const ENL_MB_INTERVAL = 0x10;
 const ENL_MB_CUMULATIVE = 0x11;
 const ENL_BVOC = 0x12;
 const ENL_DETECTION_COUNT = 0x13;
 const ENL_OCC_TIME = 0x14;
 const ENL_COS_STATUS = 0x15;
 const ENL_LIQUID_LEVEL_STATUS = 0x16;
 const ENL_TEMP_PROBE1 = 0x17;
 const ENL_TEMP_PROBE2 = 0x18;
 const ENL_TEMP_PROBE3 = 0x19;
 const ENL_TEMP_PROBE_IN_BAND_DURATION_S_1 = 0x1A;
 const ENL_TEMP_PROBE_IN_BAND_DURATION_S_2 = 0x1B;
 const ENL_TEMP_PROBE_IN_BAND_DURATION_S_3 = 0x1C;
 const ENL_TEMP_PROBE_IN_BAND_ALARM_COUNT_1 = 0x1D;
 const ENL_TEMP_PROBE_IN_BAND_ALARM_COUNT_2 = 0x1E;
 const ENL_TEMP_PROBE_IN_BAND_ALARM_COUNT_3 = 0x1F;
 const ENL_TEMP_PROBE_LOW_DURATION_S_1 = 0x20;
 const ENL_TEMP_PROBE_LOW_DURATION_S_2 = 0x21;
 const ENL_TEMP_PROBE_LOW_DURATION_S_3 = 0x22;
 const ENL_TEMP_PROBE_LOW_ALARM_COUNT_1 = 0x23;
 const ENL_TEMP_PROBE_LOW_ALARM_COUNT_2 = 0x24;
 const ENL_TEMP_PROBE_LOW_ALARM_COUNT_3 = 0x25;
 const ENL_TEMP_PROBE_HIGH_DURATION_S_1 = 0x26;
 const ENL_TEMP_PROBE_HIGH_DURATION_S_2 = 0x27;
 const ENL_TEMP_PROBE_HIGH_DURATION_S_3 = 0x28;
 const ENL_TEMP_PROBE_HIGH_ALARM_COUNT_1 = 0x29;
 const ENL_TEMP_PROBE_HIGH_ALARM_COUNT_2 = 0x2A;
 const ENL_TEMP_PROBE_HIGH_ALARM_COUNT_3 = 0x2B;
 const ENL_DIFF_PRESSURE = 0X2C;
 const ENL_AIR_FLOW = 0x2D;
 const ENL_VOLTAGE = 0x2E;
 const ENL_CURRENT = 0x2F;
 const ENL_RESISTANCE = 0x30;
 const ENL_LEAK_DETECT_EVT = 0x31;
 const ENL_GP_PRESSURE_PA = 0x32;
 const ENL_GP_TEMPERATURE = 0x33;
 const ENL_LL_DEPTH_MM = 0x34;
 const ENL_LL_TEMPERATURE = 0x35;
 const ENL_MIN_TVOC = 0x36;
 const ENL_AVG_TVOC = 0x37;
 const ENL_MAX_TVOC = 0x38;
 const ENL_ETOH = 0x39;
 const ENL_TVOC_IAQ = 0x3A;
 const ENL_HIRES_RH = 0x3B;
 const ENL_CO2E = 0x3F;
 const ENL_SOUND_MIN = 0x50;
 const ENL_SOUND_AVG = 0x51;
 const ENL_SOUND_MAX = 0x52;
 const ENL_NO = 0x53;
 const ENL_NO2 = 0x54;
 const ENL_NO2_20 = 0x55;
 const ENL_SO2 = 0x56;
 const ENL_MC_PM1_0 = 0x57;
 const ENL_MC_PM2_5 = 0x58;
 const ENL_MC_PM4_0 = 0x59;
 const ENL_MC_PM10_0 = 0x5A;
 const ENL_NC_PM0_5 = 0x5B;
 const ENL_NC_PM1_0 = 0x5C;
 const ENL_NC_PM2_5 = 0x5D;
 const ENL_NC_PM4_0 = 0x5E;
 const ENL_NC_PM10_0 = 0x5F;
 const ENL_PM_TPS = 0x60;
 const ENL_GAS_PPB = 0x61;
 const ENL_GAS_UGM3 = 0x66;
 const ENL_CRN_THK = 0x62;
 const ENL_CRN_MIN_THK = 0x63;
 const ENL_CRN_MAX_THK = 0x64;
 const ENL_CRN_PERC = 0x65;
 const ENL_FAST_AQI = 0x67;
 const ENL_EPA_AQI = 0x68;
 const ENL_MC_PM0_1 = 0x69;
 const ENL_MC_PM0_3 = 0x6A;
 const ENL_MC_PM0_5 = 0x6B;
 const ENL_MC_PM5_0 = 0x6C;
 const ENL_NC_PM0_1 = 0x6D;
 const ENL_NC_PM0_3 = 0x6E;
 const ENL_NC_PM5_0 = 0x6F;
 const ENL_DE_EVENT = 0x70;
 const ENL_DE_SMOKE = 0x71;
 const ENL_DE_VAPE = 0x72;

 const ENL_CPU_TEMP_DEP = 0x40;
 const ENL_BATT_STATUS = 0x41;
 const ENL_BATT_VOLT = 0x42;
 const ENL_RX_RSSI = 0x43;
 const ENL_RX_SNR = 0x44;
 const ENL_RX_COUNT = 0x45;
 const ENL_TX_TIME = 0x46;
 const ENL_TX_POWER = 0x47;
 const ENL_TX_COUNT = 0x48;
 const ENL_POWER_UP_COUNT = 0x49;
 const ENL_USB_IN_COUNT = 0x4A;
 const ENL_LOGIN_OK_COUNT = 0x4B;
 const ENL_LOGIN_FAIL_COUNT = 0x4C;
 const ENL_FAN_RUN_TIME = 0x4D;
 const ENL_CPU_TEMP = 0x4E;

 function S8(bin) {
  var num = bin & 0xFF;
  if (0x80 & num)
   num = -(0x0100 - num);
  return num;
 }
 function S16(bin) {
  var num = bin & 0xFFFF;
  if (0x8000 & num)
   num = -(0x010000 - num);
  return num;
 }
 function U16(ival) {
  if (isNaN(ival) === false) {
   if (ival < 0) {
    ival = ival + 65536;
   }
  }
  return ival;
 }
 function U32(ival) {
  if (isNaN(ival) === false) {
   if (ival < 0) {
    ival = ival + 4294967296;
   }
  }
  return ival;
 }
 function fromF32(byte0, byte1, byte2, byte3) {
  var bits = (byte0 << 24) | (byte1 << 16) | (byte2 << 8) | (byte3);
  var sign = ((bits >>> 31) === 0) ? 1.0 : -1.0;
  var e = ((bits >>> 23) & 0xff);
  var m = (e === 0) ? (bits & 0x7fffff) << 1 : (bits & 0x7fffff) | 0x800000;
  var f = sign * m * Math.pow(2, e - 150);
  return parseFloat(f.toFixed(3));
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
 var GAS_C3H7N = 0x42;
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

 function GetCrnMetal(id_byte) {
  var id = (id_byte & 0x7F);
  switch (id) {
   case 0x00:
    return Unknown;
   case 0x01:
    return Copper;
   case 0x02:
    return Silver;
   case 0x03:
    return Chromium;
  }
  return Error;
 }
 // Function to decode enLink Messages
 function DecodePayload(data) {
  var cpn;
  var metal;
  var obj = {};
  for (i = 0; i < data.length; i++) {
   switch (data[i]) {
    case ENL_TEMP:
     obj.temp_c = (S16((data[i + 1] << 8) | (data[i + 2]))) / 10;
     i += 2;
     break;
    case ENL_RH:
     obj.humidity = (data[i + 1]);
     i += 1;
     break;
    case ENL_HIRES_RH:
     obj.rh = (u16_1(data, i)) / 100;
     i += 2;
     break;
    case ENL_LUX:
     obj.lux = u16_1(data, i);
     i += 2;
     break;
    case ENL_PRESSURE:
     obj.pressure = u16_1(data, i);
     i += 2;
     break;
    case ENL_VOC_IAQ:
     obj.iaq = u16_1(data, i);
     i += 2;
     break;
    case ENL_O2PERC:
     obj.o2perc = (data[i + 1]) / 10;
     i += 1;
     break;
    case ENL_CO:
     obj.co_ppm = u16_1(data, i) / 100;
     i += 2;
     break;
    case ENL_CO2:
     obj.co2_ppm = u16_1(data, i);
     i += 2;
     break;
    case ENL_OZONE:
     obj.ozone_ppm = u16_1(data, i) / 10000;
     obj.ozone_ppb = u16_1(data, i) / 10;
     i += 2;
     break;
    case ENL_POLLUTANTS:
     obj.pollutants_kohm = u16_1(data, i) / 10;
     i += 2;
     break;
    case ENL_H2S:
     obj.h2s_ppm = u16_1(data, i) / 100;
     i += 2;
     break;

    case ENL_COUNTER:
     var inputN = data[i + 1];
     var pulseCount = (data[i + 2] << 24) | (data[i + 3] << 16) | (data[i + 4] << 8) | (data[i + 5]);
     if (inputN === 0x00) { obj.pulse_ip1 = pulseCount; }
     if (inputN === 0x01) { obj.pulse_ip2 = pulseCount; }
     if (inputN === 0x02) { obj.pulse_ip3 = pulseCount; }
     i += 5;
     break;
    case ENL_MB_EXCEPTION:
     if (obj.mb_ex) {
      obj.mb_ex.push([data[i + 1], data[i + 2]]);
     } else {
      obj.mb_ex = [[data[i + 1], data[i + 2]]];
     }
     i += 2;
     break;
    case ENL_MB_INTERVAL:
     if (obj.mb_int_val) {
      obj.mb_int_val.push([data[i + 1], f32_2(data, i)]);
     } else {
      obj.mb_int_val = [[data[i + 1], f32_2(data, i)]];
     }
     i += 5;
     break;
    case ENL_MB_CUMULATIVE:
     if (obj.mb_cum_val) {
      obj.mb_cum_val.push([data[i + 1], f32_2(data, i)]);
     } else {
      obj.mb_cum_val = [[data[i + 1], f32_2(data, i)]];
     }
     i += 5;
     break;

    case ENL_BVOC:
     obj.bvoc = f32_1(data, i);
     i += 4;
     break;

    case ENL_DETECTION_COUNT:
     obj.det_count = u32_1(data, i);
     i += 4;
     break;
    case ENL_OCC_TIME:
     obj.occ_time_s = u32_1(data, i);
     i += 4;
     break;
    case ENL_COS_STATUS:
     var b = false;
     b = (data[i + 1] & 0x01) > 0;
     obj.cos_ip_1_hl = b ? 1 : 0;

     b = (data[i + 1] & 0x02) > 0;
     obj.cos_ip_2_hl = b ? 1 : 0;

     b = (data[i + 1] & 0x04) > 0;
     obj.cos_ip_3_hl = b ? 1 : 0;

     b = (data[i + 1] & 0x10) > 0;
     obj.cos_ip_1_lh = b ? 1 : 0;

     b = (data[i + 1] & 0x20) > 0;
     obj.cos_ip_2_lh = b ? 1 : 0;

     b = (data[i + 1] & 0x40) > 0;
     obj.cos_ip_3_lh = b ? 1 : 0;

     obj.state_ip_1 = (data[i + 2] & 0x01) > 0 ? 1 : 0;
     obj.state_ip_2 = (data[i + 2] & 0x02) > 0 ? 1 : 0;
     obj.state_ip_3 = (data[i + 2] & 0x04) > 0 ? 1 : 0;
     i += 2;
     break;

    case ENL_LIQUID_LEVEL_STATUS:
     obj.liquid_detected = (data[i + 1]) ? true : false;
     i += 1;
     break;
    case ENL_TEMP_PROBE1:
     obj.temp_probe_1 = S16((data[i + 1] << 8 | data[i + 2])) / 10;
     i += 2;
     break;
    case ENL_TEMP_PROBE2:
     obj.temp_probe_2 = S16((data[i + 1] << 8 | data[i + 2])) / 10;
     i += 2;
     break;
    case ENL_TEMP_PROBE3:
     obj.temp_probe_3 = S16((data[i + 1] << 8 | data[i + 2])) / 10;
     i += 2;
     break;
    case ENL_TEMP_PROBE_IN_BAND_DURATION_S_1:
     obj.temp_probe_in_band_duration_s_1 =
      u32_1(data, i);
     i += 4;
     break;
    case ENL_TEMP_PROBE_IN_BAND_DURATION_S_2:
     obj.temp_probe_in_band_duration_s_2 =
      u32_1(data, i);
     i += 4;
     break;
    case ENL_TEMP_PROBE_IN_BAND_DURATION_S_3:
     obj.temp_probe_in_band_duration_s_3 =
      u32_1(data, i);
     i += 4;
     break;
    case ENL_TEMP_PROBE_IN_BAND_ALARM_COUNT_1:
     obj.temp_probe_in_band_alarm_count_1 = u16_1(data, i);
     i += 2;
     break;
    case ENL_TEMP_PROBE_IN_BAND_ALARM_COUNT_2:
     obj.temp_probe_in_band_alarm_count_2 = u16_1(data, i);
     i += 2;
     break;
    case ENL_TEMP_PROBE_IN_BAND_ALARM_COUNT_3:
     obj.temp_probe_in_band_alarm_count_3 = u16_1(data, i);
     i += 2;
     break;
    case ENL_TEMP_PROBE_LOW_DURATION_S_1:
     obj.temp_probe_low_duration_s_1 =
      u32_1(data, i);
     i += 4;
     break;
    case ENL_TEMP_PROBE_LOW_DURATION_S_2:
     obj.temp_probe_low_duration_s_2 =
      u32_1(data, i);
     i += 4;
     break;
    case ENL_TEMP_PROBE_LOW_DURATION_S_3:
     obj.temp_probe_low_duration_s_3 =
      u32_1(data, i);
     i += 4;
     break;
    case ENL_TEMP_PROBE_LOW_ALARM_COUNT_1:
     obj.temp_probe_low_alarm_count_1 = u16_1(data, i);
     i += 2;
     break;
    case ENL_TEMP_PROBE_LOW_ALARM_COUNT_2:
     obj.temp_probe_low_alarm_count_2 = u16_1(data, i);
     i += 2;
     break;
    case ENL_TEMP_PROBE_LOW_ALARM_COUNT_3:
     obj.temp_probe_low_alarm_count_3 = u16_1(data, i);
     i += 2;
     break;
    case ENL_TEMP_PROBE_HIGH_DURATION_S_1:
     obj.temp_probe_high_duration_s_1 =
      u32_1(data, i);
     i += 4;
     break;
    case ENL_TEMP_PROBE_HIGH_DURATION_S_2:
     obj.temp_probe_high_duration_s_2 =
      u32_1(data, i);
     i += 4;
     break;
    case ENL_TEMP_PROBE_HIGH_DURATION_S_3:
     obj.temp_probe_high_duration_s_3 =
      u32_1(data, i);
     i += 4;
     break;
    case ENL_TEMP_PROBE_HIGH_ALARM_COUNT_1:
     obj.temp_probe_high_alarm_count_1 = u16_1(data, i);
     i += 2;
     break;
    case ENL_TEMP_PROBE_HIGH_ALARM_COUNT_2:
     obj.temp_probe_high_alarm_count_2 = u16_1(data, i);
     i += 2;
     break;
    case ENL_TEMP_PROBE_HIGH_ALARM_COUNT_3:
     obj.temp_probe_high_alarm_count_3 = u16_1(data, i);
     i += 2;
     break;

    case ENL_DIFF_PRESSURE:
     obj.dp_pa = f32_1(data, i);
     i += 4;
     break;
    case ENL_AIR_FLOW:
     obj.af_mps = f32_1(data, i);
     i += 4;
     break;
    case ENL_VOLTAGE:
     obj.adc_v = u16_1(data, i) / 1000;
     i += 2;
     break;
    case ENL_CURRENT:
     obj.adc_ma = u16_1(data, i) / 1000;
     i += 2;
     break;
    case ENL_RESISTANCE:
     obj.adc_kohm = u16_1(data, i) / 10;
     i += 2;
     break;
    case ENL_LEAK_DETECT_EVT:
     obj.leak_detect_event = (data[i + 1]) ? true : false;
     i += 1;
     break;
    case ENL_GP_PRESSURE_PA:
     obj.gp_pa = f32_1(data, i);
     i += 4;
     break;
    case ENL_GP_TEMPERATURE:
     obj.gp_t_c = (S16((data[i + 1] << 8) | (data[i + 2]))) / 100;
     i += 2;
     break;
    case ENL_LL_DEPTH_MM:
     obj.ll_depth_mm = f32_1(data, i);
     i += 4;
     break;
    case ENL_LL_TEMPERATURE:
     obj.ll_t_c = (S16((data[i + 1] << 8) | (data[i + 2]))) / 100;
     i += 2;
     break;

    case ENL_MIN_TVOC:
     obj.tvoc_min_mg_m3 = f32_1(data, i);
     i += 4;
     break;
    case ENL_AVG_TVOC:
     obj.tvoc_avg_mg_m3 = f32_1(data, i);
     i += 4;
     break;
    case ENL_MAX_TVOC:
     obj.tvoc_max_mg_m3 = f32_1(data, i);
     i += 4;
     break;
    case ENL_ETOH:
     obj.etoh_ppm = f32_1(data, i);
     i += 4;
     break;
    case ENL_TVOC_IAQ:
     obj.tvoc_iaq = f32_1(data, i);
     i += 4;
     break;

    case ENL_CO2E:
     obj.co2e_ppm = f32_1(data, i);
     i += 4;
     break;

    case ENL_SOUND_MIN:
     obj.sound_min_dba = f32_1(data, i);
     i += 4;
     break;

    case ENL_SOUND_AVG:
     obj.sound_avg_dba = f32_1(data, i);
     i += 4;
     break;

    case ENL_SOUND_MAX:
     obj.sound_max_dba = f32_1(data, i);
     i += 4;
     break;

    case ENL_NO:
     obj.no_ppm = u16_1(data, i) / 100;
     i += 2;
     break;
    case ENL_NO2:
     obj.no2_ppm = u16_1(data, i) / 10000;
     i += 2;
     break;
    case ENL_NO2_20:
     obj.no2_20_ppm = u16_1(data, i) / 1000;
     i += 2;
     break;
    case ENL_SO2:
     obj.so2_ppm = u16_1(data, i) / 1000;
     i += 2;
     break;

    case ENL_MC_PM0_1:
     obj.mc_pm0_1 = f32_1(data, i);
     i += 4;
     break;
    case ENL_MC_PM0_3:
     obj.mc_pm0_3 = f32_1(data, i);
     i += 4;
     break;
    case ENL_MC_PM0_5:
     obj.mc_pm0_5 = f32_1(data, i);
     i += 4;
     break;
    case ENL_MC_PM1_0:
     obj.mc_pm1_0 = f32_1(data, i);
     i += 4;
     break;
    case ENL_MC_PM2_5:
     obj.mc_pm2_5 = f32_1(data, i);
     i += 4;
     break;
    case ENL_MC_PM4_0:
     obj.mc_pm4_0 = f32_1(data, i);
     i += 4;
     break;
    case ENL_MC_PM5_0:
     obj.mc_pm5_0 = f32_1(data, i);
     i += 4;
     break;
    case ENL_MC_PM10_0:
     obj.mc_pm10_0 = f32_1(data, i);
     i += 4;
     break;

    case ENL_NC_PM0_1:
     obj.nc_pm0_1 = f32_1(data, i);
     i += 4;
     break;
    case ENL_NC_PM0_3:
     obj.nc_pm0_3 = f32_1(data, i);
     i += 4;
     break;
    case ENL_NC_PM0_5:
     obj.nc_pm0_5 = f32_1(data, i);
     i += 4;
     break;
    case ENL_NC_PM1_0:
     obj.nc_pm1_0 = f32_1(data, i);
     i += 4;
     break;
    case ENL_NC_PM2_5:
     obj.nc_pm2_5 = f32_1(data, i);
     i += 4;
     break;
    case ENL_NC_PM4_0:
     obj.nc_pm4_0 = f32_1(data, i);
     i += 4;
     break;
    case ENL_NC_PM5_0:
     obj.nc_pm5_0 = f32_1(data, i);
     i += 4;
     break;
    case ENL_NC_PM10_0:
     obj.nc_pm10_0 = f32_1(data, i);
     i += 4;
     break;

    case ENL_PM_TPS:
     obj.pm_tps = f32_1(data, i);
     i += 4;
     break;

    case ENL_DE_EVENT:
     obj.de_event = u16_1(data, i);
     i += 2;
     break;
    case ENL_DE_SMOKE:
     obj.de_smoke = u16_1(data, i);
     i += 2;
     break;
    case ENL_DE_VAPE:
     obj.de_vape = u16_1(data, i);
     i += 2;
     break;

    case ENL_GAS_PPB:
     switch (data[i + 1]) {
      case GAS_HCHO:
       obj.HCHO_pbb = f32_2(data, i);
       break;
      case GAS_TVOC:
       obj.TVOC_pbb = f32_2(data, i);
       break;
      case GAS_CO:
       obj.CO_pbb = f32_2(data, i);
       break;
      case GAS_Cl2:
       obj.Cl2_pbb = f32_2(data, i);
       break;
      case GAS_H2:
       obj.H2_pbb = f32_2(data, i);
       break;
      case GAS_H2S:
       obj.H2S_pbb = f32_2(data, i);
       break;
      case GAS_HCl:
       obj.HCl_pbb = f32_2(data, i);
       break;
      case GAS_HCN:
       obj.HCN_pbb = f32_2(data, i);
       break;
      case GAS_HF:
       obj.HF_pbb = f32_2(data, i);
       break;
      case GAS_NH3:
       obj.NH3_pbb = f32_2(data, i);
       break;
      case GAS_NO2:
       obj.NO2_pbb = f32_2(data, i);
       break;
      case GAS_O2:
       obj.O2_pbb = f32_2(data, i);
       break;
      case GAS_O3:
       obj.O3_pbb = f32_2(data, i);
       break;
      case GAS_SO2:
       obj.SO2_pbb = f32_2(data, i);
       break;
      case GAS_HBr:
       obj.HBr_pbb = f32_2(data, i);
       break;
      case GAS_Br2:
       obj.Br2_pbb = f32_2(data, i);
       break;
      case GAS_F2:
       obj.F2_pbb = f32_2(data, i);
       break;
      case GAS_PH3:
       obj.PH3_pbb = f32_2(data, i);
       break;
      case GAS_AsH3:
       obj.AsH3_pbb = f32_2(data, i);
       break;
      case GAS_SiH4:
       obj.SiH4_pbb = f32_2(data, i);
       break;
      case GAS_GeH4:
       obj.GeH4_pbb = f32_2(data, i);
       break;
      case GAS_B2H6:
       obj.B2H6_pbb = f32_2(data, i);
       break;
      case GAS_BF3:
       obj.BF3_pbb = f32_2(data, i);
       break;
      case GAS_WF6:
       obj.WF6_pbb = f32_2(data, i);
       break;
      case GAS_SiF4:
       obj.SiF4_pbb = f32_2(data, i);
       break;
      case GAS_XeF2:
       obj.XeF2_pbb = f32_2(data, i);
       break;
      case GAS_TiF4:
       obj.TiF4_pbb = f32_2(data, i);
       break;
      case GAS_Odour:
       obj.Odour_pbb = f32_2(data, i);
       break;
      case GAS_IAQ:
       obj.IAQ_pbb = f32_2(data, i);
       break;
      case GAS_AQI:
       obj.AQI_pbb = f32_2(data, i);
       break;
      case GAS_NMHC:
       obj.NMHC_pbb = f32_2(data, i);
       break;
      case GAS_SOx:
       obj.SOx_pbb = f32_2(data, i);
       break;
      case GAS_NOx:
       obj.NOx_pbb = f32_2(data, i);
       break;
      case GAS_NO:
       obj.NO_pbb = f32_2(data, i);
       break;
      case GAS_C4H8:
       obj.C4H8_pbb = f32_2(data, i);
       break;
      case GAS_C3H8O2:
       obj.C3H8O2_pbb = f32_2(data, i);
       break;
      case GAS_CH4S:
       obj.CH4S_pbb = f32_2(data, i);
       break;
      case GAS_C8H8:
       obj.C8H8_pbb = f32_2(data, i);
       break;
      case GAS_C4H10:
       obj.C4H10_pbb = f32_2(data, i);
       break;
      case GAS_C4H6:
       obj.C4H6_pbb = f32_2(data, i);
       break;
      case GAS_C6H14:
       obj.C6H14_pbb = f32_2(data, i);
       break;
      case GAS_C2H4O:
       obj.C2H4O_pbb = f32_2(data, i);
       break;
      case GAS_C3H9N:
       obj.C3H9N_pbb = f32_2(data, i);
       break;
      case GAS_C3H7N:
       obj.C3H7N_pbb = f32_2(data, i);
       break;
      case GAS_C2H6O:
       obj.C2H6O_pbb = f32_2(data, i);
       break;
      case GAS_CS2:
       obj.CS2_pbb = f32_2(data, i);
       break;
      case GAS_C2H6S:
       obj.C2H6S_pbb = f32_2(data, i);
       break;
      case GAS_C2H6S2:
       obj.C2H6S2_pbb = f32_2(data, i);
       break;
      case GAS_C2H4:
       obj.C2H4_pbb = f32_2(data, i);
       break;
      case GAS_CH3OH:
       obj.CH3OH_pbb = f32_2(data, i);
       break;
      case GAS_C6H6:
       obj.C6H6_pbb = f32_2(data, i);
       break;
      case GAS_C8H10:
       obj.C8H10_pbb = f32_2(data, i);
       break;
      case GAS_C7H8:
       obj.C7H8_pbb = f32_2(data, i);
       break;
      case GAS_CH3COOH:
       obj.CH3COOH_pbb = f32_2(data, i);
       break;
      case GAS_ClO2:
       obj.ClO2_pbb = f32_2(data, i);
       break;
      case GAS_H2O2:
       obj.H2O2_pbb = f32_2(data, i);
       break;
      case GAS_N2H4:
       obj.N2H4_pbb = f32_2(data, i);
       break;
      case GAS_C2H8N2:
       obj.C2H8N2_pbb = f32_2(data, i);
       break;
      case GAS_C2HCl3:
       obj.C2HCl3_pbb = f32_2(data, i);
       break;
      case GAS_CHCl3:
       obj.CHCl3_pbb = f32_2(data, i);
       break;
      case GAS_C2H3Cl3:
       obj.C2H3Cl3_pbb = f32_2(data, i);
       break;
      case GAS_H2Se:
       obj.H2Se_pbb = f32_2(data, i);
       break;
     }
     i += 5;
     break;

    case ENL_GAS_UGM3:
     switch (data[i + 1]) {
      case GAS_HCHO:
       obj.HCHO_ugm3 = f32_2(data, i);
       break;
      case GAS_TVOC:
       obj.TVOC_ugm3 = f32_2(data, i);
       break;
      case GAS_CO:
       obj.CO_ugm3 = f32_2(data, i);
       break;
      case GAS_Cl2:
       obj.Cl2_ugm3 = f32_2(data, i);
       break;
      case GAS_H2:
       obj.H2_ugm3 = f32_2(data, i);
       break;
      case GAS_H2S:
       obj.H2S_ugm3 = f32_2(data, i);
       break;
      case GAS_HCl:
       obj.HCl_ugm3 = f32_2(data, i);
       break;
      case GAS_HCN:
       obj.HCN_ugm3 = f32_2(data, i);
       break;
      case GAS_HCHO:
       obj.HCHO_ugm3 = f32_2(data, i);
       break;
      case GAS_NH3:
       obj.NH3_ugm3 = f32_2(data, i);
       break;
      case GAS_NO2:
       obj.NO2_ugm3 = f32_2(data, i);
       break;
      case GAS_O2:
       obj.O2_ugm3 = f32_2(data, i);
       break;
      case GAS_O3:
       obj.O3_ugm3 = f32_2(data, i);
       break;
      case GAS_SO2:
       obj.SO2_ugm3 = f32_2(data, i);
       break;
      case GAS_HBr:
       obj.HBr_ugm3 = f32_2(data, i);
       break;
      case GAS_Br2:
       obj.Br2_ugm3 = f32_2(data, i);
       break;
      case GAS_F2:
       obj.F2_ugm3 = f32_2(data, i);
       break;
      case GAS_PH3:
       obj.PH3_ugm3 = f32_2(data, i);
       break;
      case GAS_AsH3:
       obj.AsH3_ugm3 = f32_2(data, i);
       break;
      case GAS_SiH4:
       obj.SiH4_ugm3 = f32_2(data, i);
       break;
      case GAS_GeH4:
       obj.GeH4_ugm3 = f32_2(data, i);
       break;
      case GAS_B2H6:
       obj.B2H6_ugm3 = f32_2(data, i);
       break;
      case GAS_BF3:
       obj.BF3_ugm3 = f32_2(data, i);
       break;
      case GAS_WF6:
       obj.WF6_ugm3 = f32_2(data, i);
       break;
      case GAS_SiF4:
       obj.SiF4_ugm3 = f32_2(data, i);
       break;
      case GAS_XeF2:
       obj.XeF2_ugm3 = f32_2(data, i);
       break;
      case GAS_TiF4:
       obj.TiF4_ugm3 = f32_2(data, i);
       break;
      case GAS_Odour:
       obj.Odour_ugm3 = f32_2(data, i);
       break;
      case GAS_IAQ:
       obj.IAQ_ugm3 = f32_2(data, i);
       break;
      case GAS_AQI:
       obj.AQI_ugm3 = f32_2(data, i);
       break;
      case GAS_NMHC:
       obj.NMHC_ugm3 = f32_2(data, i);
       break;
      case GAS_SOx:
       obj.SOx_ugm3 = f32_2(data, i);
       break;
      case GAS_NOx:
       obj.NOx_ugm3 = f32_2(data, i);
       break;
      case GAS_NO:
       obj.NO_ugm3 = f32_2(data, i);
       break;
      case GAS_C4H8:
       obj.C4H8_ugm3 = f32_2(data, i);
       break;
      case GAS_C3H8O2:
       obj.C3H8O2_ugm3 = f32_2(data, i);
       break;
      case GAS_CH4S:
       obj.CH4S_ugm3 = f32_2(data, i);
       break;
      case GAS_C8H8:
       obj.C8H8_ugm3 = f32_2(data, i);
       break;
      case GAS_C4H10:
       obj.C4H10_ugm3 = f32_2(data, i);
       break;
      case GAS_C4H6:
       obj.C4H6_ugm3 = f32_2(data, i);
       break;
      case GAS_C6H14:
       obj.C6H14_ugm3 = f32_2(data, i);
       break;
      case GAS_C2H4O:
       obj.C2H4O_ugm3 = f32_2(data, i);
       break;
      case GAS_C3H9N:
       obj.C3H9N_ugm3 = f32_2(data, i);
       break;
      case GAS_C3H7N:
       obj.C3H7N_ugm3 = f32_2(data, i);
       break;
      case GAS_C2H6O:
       obj.C2H6O_ugm3 = f32_2(data, i);
       break;
      case GAS_CS2:
       obj.CS2_ugm3 = f32_2(data, i);
       break;
      case GAS_C2H6S:
       obj.C2H6S_ugm3 = f32_2(data, i);
       break;
      case GAS_C2H6S2:
       obj.C2H6S2_ugm3 = f32_2(data, i);
       break;
      case GAS_C2H4:
       obj.C2H4_ugm3 = f32_2(data, i);
       break;
      case GAS_CH3OH:
       obj.CH3OH_ugm3 = f32_2(data, i);
       break;
      case GAS_C6H6:
       obj.C6H6_ugm3 = f32_2(data, i);
       break;
      case GAS_C8H10:
       obj.C8H10_ugm3 = f32_2(data, i);
       break;
      case GAS_C7H8:
       obj.C7H8_ugm3 = f32_2(data, i);
       break;
      case GAS_CH3COOH:
       obj.CH3COOH_ugm3 = f32_2(data, i);
       break;
      case GAS_ClO2:
       obj.ClO2_ugm3 = f32_2(data, i);
       break;
      case GAS_H2O2:
       obj.H2O2_ugm3 = f32_2(data, i);
       break;
      case GAS_N2H4:
       obj.N2H4_ugm3 = f32_2(data, i);
       break;
      case GAS_C2H8N2:
       obj.C2H8N2_ugm3 = f32_2(data, i);
       break;
      case GAS_C2HCl3:
       obj.C2HCl3_ugm3 = f32_2(data, i);
       break;
      case GAS_CHCl3:
       obj.CHCl3_ugm3 = f32_2(data, i);
       break;
      case GAS_C2H3Cl3:
       obj.C2H3Cl3_ugm3 = f32_2(data, i);
       break;
      case GAS_H2Se:
       obj.H2Se_ugm3 = f32_2(data, i);
       break;

     }
     i += 5;
     break;

    case ENL_CRN_THK:
     cpn = (data[i + 1] & 0x80) === 0 ? 1 : 2;
     metal = GetCrnMetal(data[i + 1]);
     var thk_nm = f32_2(data, i);
     if (obj.crn_thk_nm) {
      obj.crn_thk_nm.push([cpn, metal, thk_nm]);
     } else {
      obj.crn_thk_nm = [[cpn, metal, thk_nm]];
     }
     i += 5;
     break;

    case ENL_CRN_MIN_THK:
     cpn = (data[i + 1] & 0x80) === 0 ? 1 : 2;
     metal = GetCrnMetal(data[i + 1]);
     var min_nm = U16((data[i + 2] << 8) | (data[i + 3]));
     if (obj.crn_min_nm) {
      obj.crn_min_nm.push([cpn, metal, min_nm]);
     } else {
      obj.crn_min_nm = [[cpn, metal, min_nm]];
     }
     i += 3;
     break;

    case ENL_CRN_MAX_THK:
     cpn = (data[i + 1] & 0x80) === 0 ? 1 : 2;
     metal = GetCrnMetal(data[i + 1]);
     var max_nm = U16((data[i + 2] << 8) | (data[i + 3]));
     if (obj.crn_max_nm) {
      obj.crn_max_nm.push([cpn, metal, max_nm]);
     } else {
      obj.crn_max_nm = [[cpn, metal, max_nm]];
     }
     i += 3;
     break;

    case ENL_CRN_PERC:
     cpn = (data[i + 1] & 0x80) === 0 ? 1 : 2;
     metal = GetCrnMetal(data[i + 1]);
     var perc = f32_2(data, i);
     if (obj.crn_perc) {
      obj.crn_perc.push([cpn, metal, perc]);
     } else {
      obj.crn_perc = [[cpn, metal, perc]];
     }
     i += 5;
     break;

    case ENL_FAST_AQI:
     obj.fast_aqi = u16_1(data, i);
     i += 2;
     break;
    case ENL_EPA_AQI:
     obj.epa_aqi = u16_1(data, i);
     i += 2;
     break;

    // Optional KPIs
    case ENL_CPU_TEMP_DEP:
     obj.cpu_temp_dep = data[i + 1] + (Math.round(data[i + 2] * 100 / 256) / 100);
     i += 2;
     break;
    case ENL_CPU_TEMP:
     obj.cpu_temp = (S16((data[i + 1] << 8) | (data[i + 2]))) / 10;
     i += 2;
     break;
    case ENL_BATT_STATUS:
     obj.batt_status = data[i + 1];
     i += 1;
     break;
    case ENL_BATT_VOLT:
     obj.batt_v = u16_1(data, i) / 1000;
     obj.batt_mv = u16_1(data, i);
     i += 2;
     break;
    case ENL_RX_RSSI:
     obj.rx_rssi = S16((data[i + 1] << 8) | (data[i + 2]));
     i += 2;
     break;
    case ENL_RX_SNR:
     obj.rx_snr = S8(data[i + 1]);
     i += 1;
     break;
    case ENL_RX_COUNT:
     obj.rx_count = u16_1(data, i);
     i += 2;
     break;
    case ENL_TX_TIME:
     obj.tx_time_ms = u16_1(data, i);
     i += 2;
     break;
    case ENL_TX_POWER:
     obj.tx_power_dbm = S8(data[i + 1]);
     i += 1;
     break;
    case ENL_TX_COUNT:
     obj.tx_count = u16_1(data, i);
     i += 2;
     break;
    case ENL_POWER_UP_COUNT:
     obj.power_up_count = u16_1(data, i);
     i += 2;
     break;
    case ENL_USB_IN_COUNT:
     obj.usb_in_count = u16_1(data, i);
     i += 2;
     break;
    case ENL_LOGIN_OK_COUNT:
     obj.login_ok_count = u16_1(data, i);
     i += 2;
     break;
    case ENL_LOGIN_FAIL_COUNT:
     obj.login_fail_count = u16_1(data, i);
     i += 2;
     break;
    case ENL_FAN_RUN_TIME:
     obj.fan_run_time_s =
      u32_1(data, i);
     i += 4;
     break;
    default: // something is wrong with data
     obj.error = "Error at" + i + "byte value" + data[i];
     i = data.length;
     break;
   }
  }
  return obj;
 }

 return {
  data: DecodePayload(bytes),
  warnings: warnings,
  errors: errors
 };
}