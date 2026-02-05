// Synetica Payload Decoder for The Things Stack V3
// 05 Feb 2026 (FW Ver:7.20)
// 24 Apr 2025 Includes Temperature fix
// https://github.com/synetica/enlink-decoder

function decodeUplink(input) {
 let bytes=input.bytes;
 let fPort=input.fPort;
 let data={};
 let warnings=[];
 let errors=[];
 let i;
 // Show complex data as either an array, a simple data value, or both.
 let show_array=0;		// zero or 1
 let show_simple=1;

 const ENL_TEMP=0x01;
 const ENL_RH=0x02;
 const ENL_LUX=0x03;
 const ENL_PRESSURE=0x04;
 const ENL_VOC_IAQ=0x05;
 const ENL_O2PERC=0x06;
 const ENL_CO=0x07;
 const ENL_CO2=0x08;
 const ENL_OZONE=0x09;
 const ENL_POLLUTANTS=0x0A;
 const ENL_H2S=0x0D;
 const ENL_COUNTER=0x0E;
 const ENL_MB_EXCEPTION=0x0F;
 const ENL_MB_INTERVAL=0x10;
 const ENL_MB_CUMULATIVE=0x11;
 const ENL_BVOC=0x12;
 const ENL_DETECTION_COUNT=0x13;
 const ENL_OCC_TIME=0x14;
 const ENL_COS_STATUS=0x15;
 const ENL_DETECTION_STATUS=0x16;
 const ENL_TEMP_PROBE1=0x17;
 const ENL_TEMP_PROBE2=0x18;
 const ENL_TEMP_PROBE3=0x19;
 const ENL_TEMP_PROBE_IN_BAND_DURATION_S_1=0x1A;
 const ENL_TEMP_PROBE_IN_BAND_DURATION_S_2=0x1B;
 const ENL_TEMP_PROBE_IN_BAND_DURATION_S_3=0x1C;
 const ENL_TEMP_PROBE_IN_BAND_ALARM_COUNT_1=0x1D;
 const ENL_TEMP_PROBE_IN_BAND_ALARM_COUNT_2=0x1E;
 const ENL_TEMP_PROBE_IN_BAND_ALARM_COUNT_3=0x1F;
 const ENL_TEMP_PROBE_LOW_DURATION_S_1=0x20;
 const ENL_TEMP_PROBE_LOW_DURATION_S_2=0x21;
 const ENL_TEMP_PROBE_LOW_DURATION_S_3=0x22;
 const ENL_TEMP_PROBE_LOW_ALARM_COUNT_1=0x23;
 const ENL_TEMP_PROBE_LOW_ALARM_COUNT_2=0x24;
 const ENL_TEMP_PROBE_LOW_ALARM_COUNT_3=0x25;
 const ENL_TEMP_PROBE_HIGH_DURATION_S_1=0x26;
 const ENL_TEMP_PROBE_HIGH_DURATION_S_2=0x27;
 const ENL_TEMP_PROBE_HIGH_DURATION_S_3=0x28;
 const ENL_TEMP_PROBE_HIGH_ALARM_COUNT_1=0x29;
 const ENL_TEMP_PROBE_HIGH_ALARM_COUNT_2=0x2A;
 const ENL_TEMP_PROBE_HIGH_ALARM_COUNT_3=0x2B;
 const ENL_DIFF_PRESSURE=0X2C;
 const ENL_AIR_FLOW=0x2D;
 const ENL_VOLTAGE=0x2E;
 const ENL_CURRENT=0x2F;
 const ENL_RESISTANCE=0x30;
 const ENL_LEAK_DETECT_EVT=0x31;
 const ENL_GP_PRESSURE_PA=0x32;
 const ENL_GP_TEMPERATURE=0x33;
 const ENL_LL_DEPTH_MM=0x34;
 const ENL_LL_TEMPERATURE=0x35;
 const ENL_MIN_TVOC=0x36;
 const ENL_AVG_TVOC=0x37;
 const ENL_MAX_TVOC=0x38;
 const ENL_ETOH=0x39;
 const ENL_TVOC_IAQ=0x3A;
 const ENL_HIRES_RH=0x3B;
 const ENL_COMP_TEMP_C=0x3C;
 const ENL_COMP_RH=0x3D;
 const ENL_CO2E=0x3F;
 const ENL_SOUND_MIN=0x50;
 const ENL_SOUND_AVG=0x51;
 const ENL_SOUND_MAX=0x52;
 const ENL_NO=0x53;
 const ENL_NO2=0x54;
 const ENL_NO2_20=0x55;
 const ENL_SO2=0x56;
 const ENL_MC_PM1_0=0x57;
 const ENL_MC_PM2_5=0x58;
 const ENL_MC_PM4_0=0x59;
 const ENL_MC_PM10_0=0x5A;
 const ENL_NC_PM0_5=0x5B;
 const ENL_NC_PM1_0=0x5C;
 const ENL_NC_PM2_5=0x5D;
 const ENL_NC_PM4_0=0x5E;
 const ENL_NC_PM10_0=0x5F;
 const ENL_PM_TPS=0x60;
 const ENL_GAS_PPB=0x61;
 const ENL_GAS_UGM3=0x66;
 const ENL_CRN_THK=0x62;
 const ENL_CRN_MIN_THK=0x63;
 const ENL_CRN_MAX_THK=0x64;
 const ENL_CRN_PERC=0x65;
 const ENL_FAST_AQI=0x67;
 const ENL_EPA_AQI=0x68;
 const ENL_MC_PM0_1=0x69;
 const ENL_MC_PM0_3=0x6A;
 const ENL_MC_PM0_5=0x6B;
 const ENL_MC_PM5_0=0x6C;
 const ENL_NC_PM0_1=0x6D;
 const ENL_NC_PM0_3=0x6E;
 const ENL_NC_PM5_0=0x6F;
 const ENL_DE_EVENT=0x70;
 const ENL_DE_SMOKE=0x71;
 const ENL_DE_VAPE=0x72;
 const ENL_FGS_COUNT=0x73;
 const ENL_FGS_FLAM_GAS=0x74;
 const ENL_RAD_UPTIME=0x75;
 const ENL_RAD_UT_AVG=0x76;
 const ENL_RAD_6H_AVG=0x77;
 const ENL_RAD_12H_AVG=0x78;
 const ENL_RAD_24H_AVG=0x79;
 const ENL_RAD_48H_AVG=0x7A;
 const ENL_RAD_72H_AVG=0x7B;
 const ENL_RAD_96H_AVG=0x7C;

 // --------------------------------------------------------------------------------------
 
 const FLAM_NO_GAS=0x00;
 const FLAM_HYDROGEN=0x01;
 const FLAM_HYD_MIX=0x02;
 const FLAM_METHANE=0x03;
 const FLAM_LIGHT=0x04;
 const FLAM_MEDIUM=0x05;
 const FLAM_HEAVY=0x06;
 const FLAM_UNKNOWN_GAS=0xFD;
 const FLAM_UNDER_RNG=0xFE;
 const FLAM_OVER_RNG=0xFF;

 const ENL_CPU_TEMP_DEP=0x40;
 const ENL_BATT_STATUS=0x41;
 const ENL_BATT_VOLT=0x42;
 const ENL_RX_RSSI=0x43;
 const ENL_RX_SNR=0x44;
 const ENL_RX_COUNT=0x45;
 const ENL_TX_TIME=0x46;
 const ENL_TX_POWER=0x47;
 const ENL_TX_COUNT=0x48;
 const ENL_POWER_UP_COUNT=0x49;
 const ENL_USB_IN_COUNT=0x4A;
 const ENL_LOGIN_OK_COUNT=0x4B;
 const ENL_LOGIN_FAIL_COUNT=0x4C;
 const ENL_FAN_RUN_TIME=0x4D;
 const ENL_CPU_TEMP=0x4E;

 const ENL_FAULT=0xFE;

 function S8(bin) {
  let num=bin & 0xFF;
  if (0x80 & num)
   num=-(0x0100 - num);
  return num;
 }
 function S16(bin) {
  let num=bin & 0xFFFF;
  if (0x8000 & num)
   num=-(0x010000 - num);
  return num;
 }
 function U16(ival) {
  if (isNaN(ival) === false) {
   if (ival < 0) {
    ival=ival + 65536;
   }
  }
  return ival;
 }
 function U32(ival) {
  if (isNaN(ival) === false) {
   if (ival < 0) {
    ival=ival + 4294967296;
   }
  }
  return ival;
 }
 function S32(ival) {
  if (isNaN(ival) === false) {
   if (ival > 2147483647) {
    ival=ival - 4294967296;
   }
  }
  return ival;
 }
 function bytesToHexError(bytes, err) {
  let result="";
  for (let i=0; i < bytes.length; i += 1) {
   if (i == err) {
    result += '[' + ('0' + (bytes[i]).toString(16).toUpperCase()).slice(-2) + '] ';
   } else {
    result += ('0' + (bytes[i]).toString(16).toUpperCase() + ' ').slice(-3);
   }
  }
  return result.trim();
 }
 function fromF32(byte0, byte1, byte2, byte3) {
  let bits=(byte0 << 24) | (byte1 << 16) | (byte2 << 8) | (byte3);
  let sign=((bits >>> 31) === 0) ? 1.0 : -1.0;
  let e=((bits >>> 23) & 0xff);
  let m=(e === 0) ? (bits & 0x7fffff) << 1 : (bits & 0x7fffff) | 0x800000;
  let f=sign * m * Math.pow(2, e - 150);
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
 function u32_2(bytes, index) {
  return U32((bytes[index + 2] << 24) | (bytes[index + 3] << 16) | (bytes[index + 4] << 8) | (bytes[index + 5]));
 }

 function s32_1(bytes, index) {
  return S32((bytes[index + 1] << 24) | (bytes[index + 2] << 16) | (bytes[index + 3] << 8) | (bytes[index + 4]));
 }

 function GetCrnMetal(id_byte) {
  let id=(id_byte & 0x7F);
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
 function GetFlamGas(id) {
  switch (id) {
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
    return "Medium";
   case 0x06:
    return "Chromium";
   case 0xFD:
    return "Err: Unknown Gas";
   case 0xFE:
    return "Err: Under Range";
   case 0xFF:
    return "Err: Over Range";
  }
  return "Error";
 }
 // Workaround Fix for OAQ/IAQ/ZN2/ZV v7.01~7.09
 function t_fix_v7(t) {
  let num=t & 0xFFFF;
  if (0x8000 & num)
   num=655 + num;
  return num & 0xFFFF;
 }
 // Function to decode enLink Messages
 function DecodePayload(d) {
  let cpn;
  let metal;
  let o={};
  for (i=0; i < d.length; i++) {
   switch (d[i]) {
    case ENL_TEMP:
     o.temp_c=(S16((d[i + 1] << 8) | (d[i + 2]))) / 10;
     o.temp_c_fix_v7=(t_fix_v7((d[i + 1] << 8) | d[i + 2])) / 10;
     i += 2;
     break;
    case ENL_COMP_TEMP_C:
     o.comp_temp_c=(S16((d[i + 1] << 8) | (d[i + 2]))) / 10;
     i += 2;
     break;
    case ENL_RH:
     o.humidity=(d[i + 1]);
     i += 1;
     break;
    case ENL_HIRES_RH:
     o.rh=(u16_1(d, i)) / 100;
     i += 2;
     break;
    case ENL_COMP_RH:
     o.comp_rh=(u16_1(d, i)) / 100;
     i += 2;
     break;
    case ENL_LUX:
     o.lux=u16_1(d, i);
     i += 2;
     break;
    case ENL_PRESSURE:
     o.pressure=u16_1(d, i);
     i += 2;
     break;
    case ENL_VOC_IAQ:
     o.iaq=u16_1(d, i);
     i += 2;
     break;
    case ENL_O2PERC:
     o.o2perc=(d[i + 1]) / 10;
     i += 1;
     break;
    case ENL_CO:
     o.co_ppm=u16_1(d, i) / 100;
     i += 2;
     break;
    case ENL_CO2:
     o.co2_ppm=u16_1(d, i);
     i += 2;
     break;
    case ENL_OZONE:
     o.ozone_ppm=u16_1(d, i) / 10000;
     o.ozone_ppb=u16_1(d, i) / 10;
     i += 2;
     break;
    case ENL_POLLUTANTS:
     o.pollutants_kohm=u16_1(d, i) / 10;
     i += 2;
     break;
    case ENL_H2S:
     o.h2s_ppm=u16_1(d, i) / 100;
     i += 2;
     break;

    case ENL_COUNTER:
     let ip_no=d[i + 1];
     let pulseCount=u32_2(d, i);
     if (show_array == 1) {
      if (o.counter) {
       o.counter.push([ip_no, pulseCount]);
      } else {
       o.counter=[[ip_no, pulseCount]];
      }
     }
     if (show_simple == 1) {
      if (ip_no === 0x00) { o.pulse_ip1=pulseCount; }
      if (ip_no === 0x01) { o.pulse_ip2=pulseCount; }
      if (ip_no === 0x02) { o.pulse_ip3=pulseCount; }
     }
     i += 5;
     break;
    case ENL_MB_EXCEPTION:
     if (show_array == 1) {
      if (o.mb_ex) {
       o.mb_ex.push([d[i + 1], d[i + 2]]);
      } else {
       o.mb_ex=[[d[i + 1], d[i + 2]]];
      }
     }
     if (show_simple == 1) {
      // Show data as individual items
      let e_no=d[i + 1];
      let v=d[i + 2];
      if (e_no === 0) { o.mb_01_ex=v; }
      if (e_no === 1) { o.mb_02_ex=v; }
      if (e_no === 2) { o.mb_03_ex=v; }
      if (e_no === 3) { o.mb_04_ex=v; }
      if (e_no === 4) { o.mb_05_ex=v; }
      if (e_no === 5) { o.mb_06_ex=v; }
      if (e_no === 6) { o.mb_07_ex=v; }
      if (e_no === 7) { o.mb_08_ex=v; }

      if (e_no === 8) { o.mb_09_ex=v; }
      if (e_no === 9) { o.mb_10_ex=v; }
      if (e_no === 10) { o.mb_11_ex=v; }
      if (e_no === 11) { o.mb_12_ex=v; }
      if (e_no === 12) { o.mb_13_ex=v; }
      if (e_no === 13) { o.mb_14_ex=v; }
      if (e_no === 14) { o.mb_15_ex=v; }
      if (e_no === 15) { o.mb_16_ex=v; }

      if (e_no === 16) { o.mb_17_ex=v; }
      if (e_no === 17) { o.mb_18_ex=v; }
      if (e_no === 18) { o.mb_19_ex=v; }
      if (e_no === 19) { o.mb_20_ex=v; }
      if (e_no === 20) { o.mb_21_ex=v; }
      if (e_no === 21) { o.mb_22_ex=v; }
      if (e_no === 22) { o.mb_23_ex=v; }
      if (e_no === 23) { o.mb_24_ex=v; }

      if (e_no === 24) { o.mb_25_ex=v; }
      if (e_no === 25) { o.mb_26_ex=v; }
      if (e_no === 26) { o.mb_27_ex=v; }
      if (e_no === 27) { o.mb_28_ex=v; }
      if (e_no === 28) { o.mb_29_ex=v; }
      if (e_no === 29) { o.mb_30_ex=v; }
      if (e_no === 30) { o.mb_31_ex=v; }
      if (e_no === 31) { o.mb_32_ex=v; }
     }
     i += 2;
     break;
    case ENL_MB_INTERVAL: // Modbus Interval Read
     if (show_array == 1) {
      if (o.mb_int_val) {
       o.mb_int_val.push([d[i + 1], f32_2(d, i)]);
      } else {
       o.mb_int_val=[[d[i + 1], f32_2(d, i)]];
      }
     }
     if (show_simple == 1) {
      // Show data as individual items
      let i_no=d[i + 1];
      let v=f32_2(d, i);
      if (i_no === 0) { o.mb_01_int=v; }
      if (i_no === 1) { o.mb_02_int=v; }
      if (i_no === 2) { o.mb_03_int=v; }
      if (i_no === 3) { o.mb_04_int=v; }
      if (i_no === 4) { o.mb_05_int=v; }
      if (i_no === 5) { o.mb_06_int=v; }
      if (i_no === 6) { o.mb_07_int=v; }
      if (i_no === 7) { o.mb_08_int=v; }

      if (i_no === 8) { o.mb_09_int=v; }
      if (i_no === 9) { o.mb_10_int=v; }
      if (i_no === 10) { o.mb_11_int=v; }
      if (i_no === 11) { o.mb_12_int=v; }
      if (i_no === 12) { o.mb_13_int=v; }
      if (i_no === 13) { o.mb_14_int=v; }
      if (i_no === 14) { o.mb_15_int=v; }
      if (i_no === 15) { o.mb_16_int=v; }

      if (i_no === 16) { o.mb_17_int=v; }
      if (i_no === 17) { o.mb_18_int=v; }
      if (i_no === 18) { o.mb_19_int=v; }
      if (i_no === 19) { o.mb_20_int=v; }
      if (i_no === 20) { o.mb_21_int=v; }
      if (i_no === 21) { o.mb_22_int=v; }
      if (i_no === 22) { o.mb_23_int=v; }
      if (i_no === 23) { o.mb_24_int=v; }

      if (i_no === 24) { o.mb_25_int=v; }
      if (i_no === 25) { o.mb_26_int=v; }
      if (i_no === 26) { o.mb_27_int=v; }
      if (i_no === 27) { o.mb_28_int=v; }
      if (i_no === 28) { o.mb_29_int=v; }
      if (i_no === 29) { o.mb_30_int=v; }
      if (i_no === 30) { o.mb_31_int=v; }
      if (i_no === 31) { o.mb_32_int=v; }
     }
     i += 5;
     break;
    case ENL_MB_CUMULATIVE: // Modbus Cumulative Read
     if (show_array == 1) {
      if (o.mb_cum_val) {
       o.mb_cum_val.push([d[i + 1], f32_2(d, i)]);
      } else {
       o.mb_cum_val=[[d[i + 1], f32_2(d, i)]];
      }
     }
     if (show_simple == 1) {
      // Show data as individual items
      let c_no=d[i + 1];
      let v=f32_2(d, i);
      if (c_no === 0) { o.mb_01_cum=v; }
      if (c_no === 1) { o.mb_02_cum=v; }
      if (c_no === 2) { o.mb_03_cum=v; }
      if (c_no === 3) { o.mb_04_cum=v; }
      if (c_no === 4) { o.mb_05_cum=v; }
      if (c_no === 5) { o.mb_06_cum=v; }
      if (c_no === 6) { o.mb_07_cum=v; }
      if (c_no === 7) { o.mb_08_cum=v; }

      if (c_no === 8) { o.mb_09_cum=v; }
      if (c_no === 9) { o.mb_10_cum=v; }
      if (c_no === 10) { o.mb_11_cum=v; }
      if (c_no === 11) { o.mb_12_cum=v; }
      if (c_no === 12) { o.mb_13_cum=v; }
      if (c_no === 13) { o.mb_14_cum=v; }
      if (c_no === 14) { o.mb_15_cum=v; }
      if (c_no === 15) { o.mb_16_cum=v; }

      if (c_no === 16) { o.mb_17_cum=v; }
      if (c_no === 17) { o.mb_18_cum=v; }
      if (c_no === 18) { o.mb_19_cum=v; }
      if (c_no === 19) { o.mb_20_cum=v; }
      if (c_no === 20) { o.mb_21_cum=v; }
      if (c_no === 21) { o.mb_22_cum=v; }
      if (c_no === 22) { o.mb_23_cum=v; }
      if (c_no === 23) { o.mb_24_cum=v; }

      if (c_no === 24) { o.mb_25_cum=v; }
      if (c_no === 25) { o.mb_26_cum=v; }
      if (c_no === 26) { o.mb_27_cum=v; }
      if (c_no === 27) { o.mb_28_cum=v; }
      if (c_no === 28) { o.mb_29_cum=v; }
      if (c_no === 29) { o.mb_30_cum=v; }
      if (c_no === 30) { o.mb_31_cum=v; }
      if (c_no === 31) { o.mb_32_cum=v; }
     }
     i += 5;
     break;

    case ENL_BVOC:
     o.bvoc=f32_1(d, i);
     i += 4;
     break;

    case ENL_DETECTION_COUNT:
     o.det_count=u32_1(d, i);
     i += 4;
     break;
    case ENL_OCC_TIME:
     o.occ_time_s=u32_1(d, i);
     i += 4;
     break;
    case ENL_COS_STATUS:
     let b=false;
     b=(d[i + 1] & 0x01) > 0;
     o.cos_ip_1_hl=b ? 1 : 0;

     b=(d[i + 1] & 0x02) > 0;
     o.cos_ip_2_hl=b ? 1 : 0;

     b=(d[i + 1] & 0x04) > 0;
     o.cos_ip_3_hl=b ? 1 : 0;

     b=(d[i + 1] & 0x10) > 0;
     o.cos_ip_1_lh=b ? 1 : 0;

     b=(d[i + 1] & 0x20) > 0;
     o.cos_ip_2_lh=b ? 1 : 0;

     b=(d[i + 1] & 0x40) > 0;
     o.cos_ip_3_lh=b ? 1 : 0;

     o.state_ip_1=(d[i + 2] & 0x01) > 0 ? 1 : 0;
     o.state_ip_2=(d[i + 2] & 0x02) > 0 ? 1 : 0;
     o.state_ip_3=(d[i + 2] & 0x04) > 0 ? 1 : 0;
     i += 2;
     break;

    case ENL_DETECTION_STATUS:
     o.detection=(d[i + 1]) ? true : false;
     i += 1;
     break;
    case ENL_TEMP_PROBE1:
     o.temp_probe_1=S16((d[i + 1] << 8 | d[i + 2])) / 10;
     i += 2;
     break;
    case ENL_TEMP_PROBE2:
     o.temp_probe_2=S16((d[i + 1] << 8 | d[i + 2])) / 10;
     i += 2;
     break;
    case ENL_TEMP_PROBE3:
     o.temp_probe_3=S16((d[i + 1] << 8 | d[i + 2])) / 10;
     i += 2;
     break;
    case ENL_TEMP_PROBE_IN_BAND_DURATION_S_1:
     o.temp_probe_in_band_duration_s_1=u32_1(d, i);
     i += 4;
     break;
    case ENL_TEMP_PROBE_IN_BAND_DURATION_S_2:
     o.temp_probe_in_band_duration_s_2=u32_1(d, i);
     i += 4;
     break;
    case ENL_TEMP_PROBE_IN_BAND_DURATION_S_3:
     o.temp_probe_in_band_duration_s_3=u32_1(d, i);
     i += 4;
     break;
    case ENL_TEMP_PROBE_IN_BAND_ALARM_COUNT_1:
     o.temp_probe_in_band_alarm_count_1=u16_1(d, i);
     i += 2;
     break;
    case ENL_TEMP_PROBE_IN_BAND_ALARM_COUNT_2:
     o.temp_probe_in_band_alarm_count_2=u16_1(d, i);
     i += 2;
     break;
    case ENL_TEMP_PROBE_IN_BAND_ALARM_COUNT_3:
     o.temp_probe_in_band_alarm_count_3=u16_1(d, i);
     i += 2;
     break;
    case ENL_TEMP_PROBE_LOW_DURATION_S_1:
     o.temp_probe_low_duration_s_1=u32_1(d, i);
     i += 4;
     break;
    case ENL_TEMP_PROBE_LOW_DURATION_S_2:
     o.temp_probe_low_duration_s_2=u32_1(d, i);
     i += 4;
     break;
    case ENL_TEMP_PROBE_LOW_DURATION_S_3:
     o.temp_probe_low_duration_s_3=u32_1(d, i);
     i += 4;
     break;
    case ENL_TEMP_PROBE_LOW_ALARM_COUNT_1:
     o.temp_probe_low_alarm_count_1=u16_1(d, i);
     i += 2;
     break;
    case ENL_TEMP_PROBE_LOW_ALARM_COUNT_2:
     o.temp_probe_low_alarm_count_2=u16_1(d, i);
     i += 2;
     break;
    case ENL_TEMP_PROBE_LOW_ALARM_COUNT_3:
     o.temp_probe_low_alarm_count_3=u16_1(d, i);
     i += 2;
     break;
    case ENL_TEMP_PROBE_HIGH_DURATION_S_1:
     o.temp_probe_high_duration_s_1=u32_1(d, i);
     i += 4;
     break;
    case ENL_TEMP_PROBE_HIGH_DURATION_S_2:
     o.temp_probe_high_duration_s_2=u32_1(d, i);
     i += 4;
     break;
    case ENL_TEMP_PROBE_HIGH_DURATION_S_3:
     o.temp_probe_high_duration_s_3=u32_1(d, i);
     i += 4;
     break;
    case ENL_TEMP_PROBE_HIGH_ALARM_COUNT_1:
     o.temp_probe_high_alarm_count_1=u16_1(d, i);
     i += 2;
     break;
    case ENL_TEMP_PROBE_HIGH_ALARM_COUNT_2:
     o.temp_probe_high_alarm_count_2=u16_1(d, i);
     i += 2;
     break;
    case ENL_TEMP_PROBE_HIGH_ALARM_COUNT_3:
     o.temp_probe_high_alarm_count_3=u16_1(d, i);
     i += 2;
     break;

    case ENL_DIFF_PRESSURE:
     o.dp_pa=f32_1(d, i);
     i += 4;
     break;
    case ENL_AIR_FLOW:
     o.af_mps=f32_1(d, i);
     i += 4;
     break;
    case ENL_VOLTAGE:
     o.adc_v=u16_1(d, i) / 1000;
     i += 2;
     break;
    case ENL_CURRENT:
     o.adc_ma=u16_1(d, i) / 1000;
     i += 2;
     break;
    case ENL_RESISTANCE:
     o.adc_kohm=u16_1(d, i) / 10;
     i += 2;
     break;
    case ENL_LEAK_DETECT_EVT:
     o.leak_detect_event=(d[i + 1]) ? true : false;
     i += 1;
     break;
    case ENL_GP_PRESSURE_PA:
     o.gp_pa=f32_1(d, i);
     i += 4;
     break;
    case ENL_GP_TEMPERATURE:
     o.gp_t_c=(S16((d[i + 1] << 8) | (d[i + 2]))) / 100;
     i += 2;
     break;
    case ENL_LL_DEPTH_MM:
     o.ll_depth_mm=f32_1(d, i);
     i += 4;
     break;
    case ENL_LL_TEMPERATURE:
     o.ll_t_c=(S16((d[i + 1] << 8) | (d[i + 2]))) / 100;
     i += 2;
     break;

    case ENL_MIN_TVOC:
     o.tvoc_min_mg_m3=f32_1(d, i);
     i += 4;
     break;
    case ENL_AVG_TVOC:
     o.tvoc_avg_mg_m3=f32_1(d, i);
     i += 4;
     break;
    case ENL_MAX_TVOC:
     o.tvoc_max_mg_m3=f32_1(d, i);
     i += 4;
     break;
    case ENL_ETOH:
     o.etoh_ppm=f32_1(d, i);
     i += 4;
     break;
    case ENL_TVOC_IAQ:
     o.tvoc_iaq=f32_1(d, i);
     i += 4;
     break;

    case ENL_CO2E:
     o.co2e_ppm=f32_1(d, i);
     i += 4;
     break;

    case ENL_SOUND_MIN:
     o.sound_min_dba=f32_1(d, i);
     i += 4;
     break;

    case ENL_SOUND_AVG:
     o.sound_avg_dba=f32_1(d, i);
     i += 4;
     break;

    case ENL_SOUND_MAX:
     o.sound_max_dba=f32_1(d, i);
     i += 4;
     break;

    case ENL_NO:
     o.no_ppm=u16_1(d, i) / 100;
     i += 2;
     break;
    case ENL_NO2:
     o.no2_ppm=u16_1(d, i) / 10000;
     i += 2;
     break;
    case ENL_NO2_20:
     o.no2_20_ppm=u16_1(d, i) / 1000;
     i += 2;
     break;
    case ENL_SO2:
     o.so2_ppm=u16_1(d, i) / 1000;
     i += 2;
     break;

    case ENL_MC_PM0_1:
     o.mc_pm0_1=f32_1(d, i);
     i += 4;
     break;
    case ENL_MC_PM0_3:
     o.mc_pm0_3=f32_1(d, i);
     i += 4;
     break;
    case ENL_MC_PM0_5:
     o.mc_pm0_5=f32_1(d, i);
     i += 4;
     break;
    case ENL_MC_PM1_0:
     o.mc_pm1_0=f32_1(d, i);
     i += 4;
     break;
    case ENL_MC_PM2_5:
     o.mc_pm2_5=f32_1(d, i);
     i += 4;
     break;
    case ENL_MC_PM4_0:
     o.mc_pm4_0=f32_1(d, i);
     i += 4;
     break;
    case ENL_MC_PM5_0:
     o.mc_pm5_0=f32_1(d, i);
     i += 4;
     break;
    case ENL_MC_PM10_0:
     o.mc_pm10_0=f32_1(d, i);
     i += 4;
     break;

    case ENL_NC_PM0_1:
     o.nc_pm0_1=f32_1(d, i);
     i += 4;
     break;
    case ENL_NC_PM0_3:
     o.nc_pm0_3=f32_1(d, i);
     i += 4;
     break;
    case ENL_NC_PM0_5:
     o.nc_pm0_5=f32_1(d, i);
     i += 4;
     break;
    case ENL_NC_PM1_0:
     o.nc_pm1_0=f32_1(d, i);
     i += 4;
     break;
    case ENL_NC_PM2_5:
     o.nc_pm2_5=f32_1(d, i);
     i += 4;
     break;
    case ENL_NC_PM4_0:
     o.nc_pm4_0=f32_1(d, i);
     i += 4;
     break;
    case ENL_NC_PM5_0:
     o.nc_pm5_0=f32_1(d, i);
     i += 4;
     break;
    case ENL_NC_PM10_0:
     o.nc_pm10_0=f32_1(d, i);
     i += 4;
     break;

    case ENL_PM_TPS:
     o.pm_tps=f32_1(d, i);
     i += 4;
     break;

    case ENL_DE_EVENT:
     o.de_event=u16_1(d, i);
     i += 2;
     break;
    case ENL_DE_SMOKE:
     o.de_smoke=u16_1(d, i);
     i += 2;
     break;
    case ENL_DE_VAPE:
     o.de_vape=u16_1(d, i);
     i += 2;
     break;
    case ENL_GAS_PPB:
     switch (d[i + 1]) {
      case 0x17:
       o.HCHO_pbb=f32_2(d, i);
       break;
      case 0x18:
       o.TVOC_pbb=f32_2(d, i);
       break;
      case 0x19:
       o.CO_pbb=f32_2(d, i);
       break;
      case 0x1A:
       o.Cl2_pbb=f32_2(d, i);
       break;
      case 0x1B:
       o.H2_pbb=f32_2(d, i);
       break;
      case 0x1C:
       o.H2S_pbb=f32_2(d, i);
       break;
      case 0x1D:
       o.HCl_pbb=f32_2(d, i);
       break;
      case 0x1E:
       o.HCN_pbb=f32_2(d, i);
       break;
      case 0x1F:
       o.HF_pbb=f32_2(d, i);
       break;
      case 0x20:
       o.NH3_pbb=f32_2(d, i);
       break;
      case 0x21:
       o.NO2_pbb=f32_2(d, i);
       break;
      case 0x22:
       o.O2_pbb=f32_2(d, i);
       break;
      case 0x23:
       o.O3_pbb=f32_2(d, i);
       break;
      case 0x24:
       o.SO2_pbb=f32_2(d, i);
       break;
      case 0x25:
       o.HBr_pbb=f32_2(d, i);
       break;
      case 0x26:
       o.Br2_pbb=f32_2(d, i);
       break;
      case 0x27:
       o.F2_pbb=f32_2(d, i);
       break;
      case 0x28:
       o.PH3_pbb=f32_2(d, i);
       break;
      case 0x29:
       o.AsH3_pbb=f32_2(d, i);
       break;
      case 0x2A:
       o.SiH4_pbb=f32_2(d, i);
       break;
      case 0x2B:
       o.GeH4_pbb=f32_2(d, i);
       break;
      case 0x2C:
       o.B2H6_pbb=f32_2(d, i);
       break;
      case 0x2D:
       o.BF3_pbb=f32_2(d, i);
       break;
      case 0x2E:
       o.WF6_pbb=f32_2(d, i);
       break;
      case 0x2F:
       o.SiF4_pbb=f32_2(d, i);
       break;
      case 0x30:
       o.XeF2_pbb=f32_2(d, i);
       break;
      case 0x31:
       o.TiF4_pbb=f32_2(d, i);
       break;
      case 0x32:
       o.Odour_pbb=f32_2(d, i);
       break;
      case 0x33:
       o.IAQ_pbb=f32_2(d, i);
       break;
      case 0x34:
       o.AQI_pbb=f32_2(d, i);
       break;
      case 0x35:
       o.NMHC_pbb=f32_2(d, i);
       break;
      case 0x36:
       o.SOx_pbb=f32_2(d, i);
       break;
      case 0x37:
       o.NOx_pbb=f32_2(d, i);
       break;
      case 0x38:
       o.NO_pbb=f32_2(d, i);
       break;
      case 0x39:
       o.C4H8_pbb=f32_2(d, i);
       break;
      case 0x3A:
       o.C3H8O2_pbb=f32_2(d, i);
       break;
      case 0x3B:
       o.CH4S_pbb=f32_2(d, i);
       break;
      case 0x3C:
       o.C8H8_pbb=f32_2(d, i);
       break;
      case 0x3D:
       o.C4H10_pbb=f32_2(d, i);
       break;
      case 0x3E:
       o.C4H6_pbb=f32_2(d, i);
       break;
      case 0x3F:
       o.C6H14_pbb=f32_2(d, i);
       break;
      case 0x40:
       o.C2H4O_pbb=f32_2(d, i);
       break;
      case 0x41:
       o.C3H9N_pbb=f32_2(d, i);
       break;
      case 0x42:
       o.C3H7N_pbb=f32_2(d, i);
       break;
      case 0x43:
       o.C2H6O_pbb=f32_2(d, i);
       break;
      case 0x44:
       o.CS2_pbb=f32_2(d, i);
       break;
      case 0x45:
       o.C2H6S_pbb=f32_2(d, i);
       break;
      case 0x46:
       o.C2H6S2_pbb=f32_2(d, i);
       break;
      case 0x47:
       o.C2H4_pbb=f32_2(d, i);
       break;
      case 0x48:
       o.CH3OH_pbb=f32_2(d, i);
       break;
      case 0x49:
       o.C6H6_pbb=f32_2(d, i);
       break;
      case 0x4A:
       o.C8H10_pbb=f32_2(d, i);
       break;
      case 0x4B:
       o.C7H8_pbb=f32_2(d, i);
       break;
      case 0x4C:
       o.CH3COOH_pbb=f32_2(d, i);
       break;
      case 0x4D:
       o.ClO2_pbb=f32_2(d, i);
       break;
      case 0x4E:
       o.H2O2_pbb=f32_2(d, i);
       break;
      case 0x4F:
       o.N2H4_pbb=f32_2(d, i);
       break;
      case 0x50:
       o.C2H8N2_pbb=f32_2(d, i);
       break;
      case 0x51:
       o.C2HCl3_pbb=f32_2(d, i);
       break;
      case 0x52:
       o.CHCl3_pbb=f32_2(d, i);
       break;
      case 0x53:
       o.C2H3Cl3_pbb=f32_2(d, i);
       break;
      case 0x54:
       o.H2Se_pbb=f32_2(d, i);
       break;
     }
     i += 5;
     break;

    case ENL_GAS_UGM3:
     switch (d[i + 1]) {
      case 0x17:
       o.HCHO_ugm3=f32_2(d, i);
       break;
      case 0x18:
       o.TVOC_ugm3=f32_2(d, i);
       break;
      case 0x19:
       o.CO_ugm3=f32_2(d, i);
       break;
      case 0x1A:
       o.Cl2_ugm3=f32_2(d, i);
       break;
      case 0x1B:
       o.H2_ugm3=f32_2(d, i);
       break;
      case 0x1C:
       o.H2S_ugm3=f32_2(d, i);
       break;
      case 0x1D:
       o.HCl_ugm3=f32_2(d, i);
       break;
      case 0x1E:
       o.HCN_ugm3=f32_2(d, i);
       break;
      case 0x1F:
       o.HF_ugm3=f32_2(d, i);
       break;
      case 0x20:
       o.NH3_ugm3=f32_2(d, i);
       break;
      case 0x21:
       o.NO2_ugm3=f32_2(d, i);
       break;
      case 0x22:
       o.O2_ugm3=f32_2(d, i);
       break;
      case 0x23:
       o.O3_ugm3=f32_2(d, i);
       break;
      case 0x24:
       o.SO2_ugm3=f32_2(d, i);
       break;
      case 0x25:
       o.HBr_ugm3=f32_2(d, i);
       break;
      case 0x26:
       o.Br2_ugm3=f32_2(d, i);
       break;
      case 0x27:
       o.F2_ugm3=f32_2(d, i);
       break;
      case 0x28:
       o.PH3_ugm3=f32_2(d, i);
       break;
      case 0x29:
       o.AsH3_ugm3=f32_2(d, i);
       break;
      case 0x2A:
       o.SiH4_ugm3=f32_2(d, i);
       break;
      case 0x2B:
       o.GeH4_ugm3=f32_2(d, i);
       break;
      case 0x2C:
       o.B2H6_ugm3=f32_2(d, i);
       break;
      case 0x2D:
       o.BF3_ugm3=f32_2(d, i);
       break;
      case 0x2E:
       o.WF6_ugm3=f32_2(d, i);
       break;
      case 0x2F:
       o.SiF4_ugm3=f32_2(d, i);
       break;
      case 0x30:
       o.XeF2_ugm3=f32_2(d, i);
       break;
      case 0x31:
       o.TiF4_ugm3=f32_2(d, i);
       break;
      case 0x32:
       o.Odour_ugm3=f32_2(d, i);
       break;
      case 0x33:
       o.IAQ_ugm3=f32_2(d, i);
       break;
      case 0x34:
       o.AQI_ugm3=f32_2(d, i);
       break;
      case 0x35:
       o.NMHC_ugm3=f32_2(d, i);
       break;
      case 0x36:
       o.SOx_ugm3=f32_2(d, i);
       break;
      case 0x37:
       o.NOx_ugm3=f32_2(d, i);
       break;
      case 0x38:
       o.NO_ugm3=f32_2(d, i);
       break;
      case 0x39:
       o.C4H8_ugm3=f32_2(d, i);
       break;
      case 0x3A:
       o.C3H8O2_ugm3=f32_2(d, i);
       break;
      case 0x3B:
       o.CH4S_ugm3=f32_2(d, i);
       break;
      case 0x3C:
       o.C8H8_ugm3=f32_2(d, i);
       break;
      case 0x3D:
       o.C4H10_ugm3=f32_2(d, i);
       break;
      case 0x3E:
       o.C4H6_ugm3=f32_2(d, i);
       break;
      case 0x3F:
       o.C6H14_ugm3=f32_2(d, i);
       break;
      case 0x40:
       o.C2H4O_ugm3=f32_2(d, i);
       break;
      case 0x41:
       o.C3H9N_ugm3=f32_2(d, i);
       break;
      case 0x42:
       o.C3H7N_ugm3=f32_2(d, i);
       break;
      case 0x43:
       o.C2H6O_ugm3=f32_2(d, i);
       break;
      case 0x44:
       o.CS2_ugm3=f32_2(d, i);
       break;
      case 0x45:
       o.C2H6S_ugm3=f32_2(d, i);
       break;
      case 0x46:
       o.C2H6S2_ugm3=f32_2(d, i);
       break;
      case 0x47:
       o.C2H4_ugm3=f32_2(d, i);
       break;
      case 0x48:
       o.CH3OH_ugm3=f32_2(d, i);
       break;
      case 0x49:
       o.C6H6_ugm3=f32_2(d, i);
       break;
      case 0x4A:
       o.C8H10_ugm3=f32_2(d, i);
       break;
      case 0x4B:
       o.C7H8_ugm3=f32_2(d, i);
       break;
      case 0x4C:
       o.CH3COOH_ugm3=f32_2(d, i);
       break;
      case 0x4D:
       o.ClO2_ugm3=f32_2(d, i);
       break;
      case 0x4E:
       o.H2O2_ugm3=f32_2(d, i);
       break;
      case 0x4F:
       o.N2H4_ugm3=f32_2(d, i);
       break;
      case 0x50:
       o.C2H8N2_ugm3=f32_2(d, i);
       break;
      case 0x51:
       o.C2HCl3_ugm3=f32_2(d, i);
       break;
      case 0x52:
       o.CHCl3_ugm3=f32_2(d, i);
       break;
      case 0x53:
       o.C2H3Cl3_ugm3=f32_2(d, i);
       break;
      case 0x54:
       o.H2Se_ugm3=f32_2(d, i);
       break;

     }
     i += 5;
     break;

    case ENL_CRN_THK:
     cpn=(d[i + 1] & 0x80) === 0 ? 1 : 2;
     metal=GetCrnMetal(d[i + 1]);
     let thk_nm=f32_2(d, i);
     if (o.crn_thk_nm) {
      o.crn_thk_nm.push([cpn, metal, thk_nm]);
     } else {
      o.crn_thk_nm=[[cpn, metal, thk_nm]];
     }
     i += 5;
     break;

    case ENL_CRN_MIN_THK:
     cpn=(d[i + 1] & 0x80) === 0 ? 1 : 2;
     metal=GetCrnMetal(d[i + 1]);
     let min_nm=U16((d[i + 2] << 8) | (d[i + 3]));
     if (o.crn_min_nm) {
      o.crn_min_nm.push([cpn, metal, min_nm]);
     } else {
      o.crn_min_nm=[[cpn, metal, min_nm]];
     }
     i += 3;
     break;

    case ENL_CRN_MAX_THK:
     cpn=(d[i + 1] & 0x80) === 0 ? 1 : 2;
     metal=GetCrnMetal(d[i + 1]);
     let max_nm=U16((d[i + 2] << 8) | (d[i + 3]));
     if (o.crn_max_nm) {
      o.crn_max_nm.push([cpn, metal, max_nm]);
     } else {
      o.crn_max_nm=[[cpn, metal, max_nm]];
     }
     i += 3;
     break;

    case ENL_CRN_PERC:
     cpn=(d[i + 1] & 0x80) === 0 ? 1 : 2;
     metal=GetCrnMetal(d[i + 1]);
     let perc=f32_2(d, i);
     if (o.crn_perc) {
      o.crn_perc.push([cpn, metal, perc]);
     } else {
      o.crn_perc=[[cpn, metal, perc]];
     }
     i += 5;
     break;

    case ENL_FAST_AQI:
     o.fast_aqi=u16_1(d, i);
     i += 2;
     break;
    case ENL_EPA_AQI:
     o.epa_aqi=u16_1(d, i);
     i += 2;
     break;

    case ENL_FGS_COUNT:
     o.flam_count=s32_1(d, i);
     i += 4;
     break;
    case ENL_FGS_FLAM_GAS:
     let gas=GetFlamGas(d[i + 1]);
     let conc=f32_2(d, i);
     // Show with array
     if (o.flam) {
      o.flam.push([gas, conc]);
     } else {
      o.flam=[[gas, conc]];
     }
     // Create simple values also
     o.flam_no_gas=0;
     o.flam_hydrogen=0;
     o.flam_hydrogen_mix=0;
     o.flam_methane=0;
     o.flam_light=0;
     o.flam_medium=0;
     o.flam_heavy=0;

     switch (d[i + 1]) {
      case FLAM_NO_GAS:
       o.flam_no_gas=conc;
       break;
      case FLAM_HYDROGEN:
       o.flam_hydrogen=conc;
       break;
      case FLAM_HYD_MIX:
       o.flam_hydrogen_mix=conc;
       break;
      case FLAM_METHANE:
       o.flam_methane=conc;
       break;
      case FLAM_LIGHT:
       o.flam_light=conc;
       break;
      case FLAM_MEDIUM:
       o.flam_medium=conc;
       break;
      case FLAM_HEAVY:
       o.flam_heavy=conc;
       break;
      // Errors
      case FLAM_UNKNOWN_GAS:
       o.flam_err_unknown_gas=conc;
       break;
      case FLAM_UNDER_RNG:
       o.flam_err_under_range=conc;
       o.flam_no_gas=-1;
       o.flam_hydrogen=-1;
       o.flam_hydrogen_mix=-1;
       o.flam_methane=-1;
       o.flam_light=-1;
       o.flam_medium=-1;
       o.flam_heavy=-1;
       break;
      case FLAM_OVER_RNG:
       o.flam_err_over_range=conc;
       o.flam_no_gas=110;
       o.flam_hydrogen=110;
       o.flam_hydrogen_mix=110;
       o.flam_methane=110;
       o.flam_light=110;
       o.flam_medium=110;
       o.flam_heavy=110;
       break;

      default:
       o.flam_unknown_type=d[i + 1];
       o.flam_unknown_value=conc;
       break;
     }
     i += 5;
     break;

    case ENL_RAD_UPTIME:
     o.rad_uptime_s=u32_1(d, i);
     i += 4;
     break;
    case ENL_RAD_UT_AVG:
     o.rad_ut_avg=u16_1(d, i);
     i += 2;
     break;
    case ENL_RAD_6H_AVG:
     o.rad_6h_avg=u16_1(d, i);
     i += 2;
     break;
    case ENL_RAD_12H_AVG:
     o.rad_12h_avg=u16_1(d, i);
     i += 2;
     break;
    case ENL_RAD_24H_AVG:
     o.rad_24h_avg=u16_1(d, i);
     i += 2;
     break;
    case ENL_RAD_48H_AVG:
     o.rad_48h_avg=u16_1(d, i);
     i += 2;
     break;
    case ENL_RAD_72H_AVG:
     o.rad_72h_avg=u16_1(d, i);
     i += 2;
     break;
    case ENL_RAD_96H_AVG:
     o.rad_96h_avg=u16_1(d, i);
     i += 2;
     break;

    // Optional KPIs
    case ENL_CPU_TEMP_DEP:
     o.cpu_temp_dep=d[i + 1] + (Math.round(d[i + 2] * 100 / 256) / 100);
     i += 2;
     break;
    case ENL_CPU_TEMP:
     o.cpu_temp=(S16((d[i + 1] << 8) | (d[i + 2]))) / 10;
     i += 2;
     break;
    case ENL_BATT_STATUS:
     o.batt_status=d[i + 1];
     i += 1;
     break;
    case ENL_BATT_VOLT:
     o.batt_v=u16_1(d, i) / 1000;
     o.batt_mv=u16_1(d, i);
     i += 2;
     break;
    case ENL_RX_RSSI:
     o.rx_rssi=S16((d[i + 1] << 8) | (d[i + 2]));
     i += 2;
     break;
    case ENL_RX_SNR:
     o.rx_snr=S8(d[i + 1]);
     i += 1;
     break;
    case ENL_RX_COUNT:
     o.rx_count=u16_1(d, i);
     i += 2;
     break;
    case ENL_TX_TIME:
     o.tx_time_ms=u16_1(d, i);
     i += 2;
     break;
    case ENL_TX_POWER:
     o.tx_power_dbm=S8(d[i + 1]);
     i += 1;
     break;
    case ENL_TX_COUNT:
     o.tx_count=u16_1(d, i);
     i += 2;
     break;
    case ENL_POWER_UP_COUNT:
     o.power_up_count=u16_1(d, i);
     i += 2;
     break;
    case ENL_USB_IN_COUNT:
     o.usb_in_count=u16_1(d, i);
     i += 2;
     break;
    case ENL_LOGIN_OK_COUNT:
     o.login_ok_count=u16_1(d, i);
     i += 2;
     break;
    case ENL_LOGIN_FAIL_COUNT:
     o.login_fail_count=u16_1(d, i);
     i += 2;
     break;
    case ENL_FAN_RUN_TIME:
     o.fan_run_time_s=u32_1(d, i);
     i += 4;
     break;

    case ENL_FAULT:
     let sensor_id=(d[i + 1]);
     let fault_code=(d[i + 2]);
     let count_val=U16((d[i + 3] << 8) | d[i + 4]);
     // Show values in an array
     if (o.fault) {
      o.fault.push([sensor_id, fault_code, count_val]);
     } else {
      o.fault=[[sensor_id, fault_code, count_val]];
     }
     // Check for known values
     if (sensor_id == 28) {
      // SPS30 0x1C/28
      if (fault_code == 1) {
       o.fault_0x1C_01="SPS30 Fan Speed Error: " + count_val;
      } else if (fault_code == 2) {
       o.fault_0x1C_02="SPS30 Laser Failure: " + count_val;
      } else if (item_id_id == 3) {
       o.fault_0x1C_03="SPS30 Fan Failure: " + count_val;
      } else {
       o.fault_0x1C_x="SPS30 General Error. Fault Code: " + fault_code + " Count: " + count_val;
      }
     } else if (sensor_id == 36) {
      // Flammable Gas - 0x24/36
      if (fault_code == 0x01) {
       o.fault_0x24_01="FGS CRC Error: " + count_val;
      } else if (fault_code == 0x02) {
       o.fault_0x24_02="FGS Bad Parameter: " + count_val;
      } else if (fault_code == 0x05) {
       o.fault_0x24_05="FGS Unknown Cmd: " + count_val;
      } else if (fault_code == 0x07) {
       o.fault_0x24_07="FGS Incomplete Cmd: " + count_val;
      } else if (fault_code == 0x21) {
       o.fault_0x24_21="FGS VDD Out of Range: " + count_val;
      } else if (fault_code == 0x22) {
       o.fault_0x24_22="FGS VREF Out of Range: " + count_val;
      } else if (fault_code == 0x23) {
       o.fault_0x24_23="FGS Env. Sensor Out of Range: " + count_val;
      } else if (fault_code == 0x24) {
       o.fault_0x24_24="FGS Env. Sensor Failed: " + count_val;
      } else if (fault_code == 0x25) {
       o.fault_0x24_25="FGS Microcontroller Error: " + count_val;
      } else if (fault_code == 0x30) {
       o.fault_0x24_30="FGS Sensor Read Negative: " + count_val;
      } else if (fault_code == 0x31) {
       o.fault_0x24_31="FGS Condensation Detected: " + count_val;
      } else if (fault_code == 0x32) {
       o.fault_0x24_32="FGS Sensor Error: " + count_val;
      } else if (fault_code == 0x33) {
       o.fault_0x24_33="FGS Gas detected during startup: " + count_val;
      } else if (fault_code == 0x34) {
       o.fault_0x24_34="FGS Slow Gas accumulation detected: " + count_val;
      } else if (fault_code == 0x35) {
       o.fault_0x24_35="FGS Breath/Humidity Surge: " + count_val;
      } else if (fault_code == 0xF9) {
       o.fault_0x24_F9="FGS Reply Timeout: " + count_val;
      } else if (fault_code == 0xFA) {
       o.fault_0x24_FA="FGS Incomplete reply: " + count_val;
      } else if (fault_code == 0xFB) {
       o.fault_0x24_FB="FGS CRC Error on reply: " + count_val;
      } else if (fault_code == 0xFC) {
       o.fault_0x24_FC="FGS Sensor restart: " + count_val;
      } else if (fault_code == 0xFF) {
       o.fault_0x24_FF="FGS Unknown Status: " + count_val;
      } else {
       o.fault_0x24_x="FGS General Error. Fault Code: " + fault_code + " Count: " + count_val;
      }
    } else if (sensor_id == 45) {
      // Radon Gas - 0x2D/45
      if (fault_code == 0x01) {
        obj.fault_0x2D_01 = "Radon Restarts: " + count_val;
      } else {
        obj.fault_0x2D_x = "Radon General Error. Fault Code: " + fault_code + " Count: " + count_val;
      }
     } else {
      o.fault_x="Unknown Sensor ID: " + sensor_id + " Fault Code: " + fault_code + " Count: " + count_val;
     }
     i += 4;
     break;

    default: // something is wrong with data
     o.error="Data Error at byte index " + i + "  Data: " + bytesToHexError(d, i);
     i=d.length;
     break;
   }
  }
  return o;
 }

 return {
  data: DecodePayload(bytes),
  warnings: warnings,
  errors: errors
 };
}