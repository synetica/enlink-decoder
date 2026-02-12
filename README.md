# Synetica - enLink LoRaWAN decoders

[![GitHub](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/synetica/enlink-decoder/blob/master/LICENSE)

Online decoder can be found here: [Live Decoder](https://synetica.github.io/enlink-decoder/)

> Latest firmware release is v7.20

> **Bug Workaround!** </br> There has been a problem introduced from firmware v7.01 to v7.09 inclusive. This affects the newer IAQ/OAQ, ZonePlus, Zone V2, and ZoneView. This is due to the introduction of a high-precision temperature/humidity sensor. The internal data structure changed, and a bug caused the transmitted data packet for temperatures to be wrong for ambient temperatures below 0.0°C or above 32.7°C. This has been fixed in firmware v7.10 and above. If a customer's enLink devices are experiencing temperatures above 32.7°C there is a decoder workaround that works for temperatures between 0.0°C and 65.5°C. Temperatures outside these values will be decoded incorrectly. Look for the function **t_fix_v7(t)** in the decoder samples.

## Table of Contents
- [Preamble](#preamble)
- [Payload Contents of each enLink Product](#payload-contents-of-each-enlink-product)
  - [AIR/AIR-X](#enlink-airair-x---indooroutdoor-air-quality-monitor)
  - [IAQ/OAQ/Duct](#enlink-iaqoaq---indooroutdoor-air-quality-and-iaq-duct)
  - [ZonePlus](#enlink-zoneplus)
  - [Zone](#enlink-zone)
  - [Zone V2](#enlink-zone-v2)
  - [Zone View](#enlink-zone-view)
  - [Modbus](#enlink-modbus)
  - [Status Pulse Counter](#enlink-status---pulse-counter)
  - [Status Leak Sensor](#enlink-status---leak-sensor)
  - [Status Differential Pressure / Air Flow (Velocity)](#enlink-status---differential-pressure--air-flow-velocity)
  - [Status Gauge Pressure](#enlink-status---gauge-pressure)
  - [Status Temperature Probes](#enlink-status---temperature-probes)
  - [Status Voltage/Current Sensor](#enlink-status---voltagecurrent-sensor)
- [Uplink Payload](#uplink-payload)
  - [Uplink Payload Structure](#uplink-payload-structure)
  - [Uplink Transmission Port](#uplink-transmission-port)
  - [Uplink Payload Type](#uplink-payload-type)
  - [Decoding Complex Uplinks](#decoding-complex-uplinks)
    - [Modbus](#modbus)
    - [Pulse Counters - Change of State](#pulse-counters---change-of-state)
    - [Gas Readings](#gas-readings)
    - [Corrosion](#corrosion)
    - [Flammable Gas Readings](#flammable-gas-readings)
    - [Sensor Fault Code Messages](#sensor-fault-code-messages)
      - [SPS30 Particulates](#sps30-particulates---sensor-id-28-0x1c)
      - [Flammable Gas](#flammable-gas---sensor-id-36-0x24)
      - [Radon Gas](#radon-gas-sensor---sensor-id-45-0x2d)
  - [enLink KPI Payload Data](#enlink-kpi-payload-data)
- [Downlink Payload](#downlink-payload)
  - [Downlink Payload Structure](#downlink-payload-structure)
  - [Downlink Receive Port](#downlink-receive-port)
  - [General Settings Details](#general-settings-details)
  - [Downlink Message Examples](#downlink-message-examples)
  - [Example Uplink Replies to Downlink Messages](#example-uplink-replies-to-downlink-messages)
  - [Downlink Message Index Tables](#downlink-message-index-tables)
  - [Product and Sensor Specific Downlinks](#product-and-sensor-specific-downlinks)
    - [Fan Run-Time (Air/Air-X) Downlinks](#fan-run-time-airair-x-downlinks)
    - [Temperature/Humidity Downlinks](#temperaturehumidity-downlinks)
    - [Light Sensor Downlinks](#light-sensor-downlinks)
    - [VOC Sensor Downlinks](#voc-sensor-downlinks)
    - [TVOC Sensor Downlinks](#tvoc-sensor-downlinks)
    - [EPA Sensor Downlinks](#epaozone-sensor-downlinks)
    - [CO<sub>2</sub> Sensor Downlinks](#carbon-dioxide-sensor-downlinks)
    - [Occupancy Sensor Downlinks](#occupancy-sensor-downlinks)
    - [Particulate Sensor Downlinks](#particulate-sensor-downlinks)
    - [Gas Sensor Downlinks](#gas-sensor-downlinks)
    - [Leak Sensor Downlinks](#leak-sensor-downlinks)
    - [Differential Pressure / Air Flow Downlinks](#differential-pressure--air-flow-downlinks)
    - [Zone View e-paper Display Downlinks](#zone-view-e-paper-display-downlinks)
    - [Flammable Gas Sensor Downlink](#flammable-gas-sensor-downlink)
    - [Radon Sensor Downlinks](#radon-sensor-downlinks)
- [Sample CODECs for Decoding Messages](#sample-codecs-for-decoding-messages)

</br>

# Preamble

**[Synetica](https://www.synetica.net)** is a UK based company that designs and develops energy and environmental sensors. We specialise in highly accurate and reliable air quality monitoring using LoRaWAN long range wireless.

The **enLink** range of LoRaWAN devices are categorised into the following:
- Air Quality Monitors (Indoor and Outdoor, mains and battery powered)
- Indoor Environmental Sensors
- Modbus Reader - Serial RS485 RTU
- Pulse Counter
- Leak Sensor
- Differential Pressure / Air Flow
- Gauge Pressure
- Liquid Level
- Temperature Probes
- Voltage/Current Sensor

This repository contains various decoders for the LoRaWAN data packets. The uplink data is telemetry data containing values like temperature, particulates and gas concentrations.

This enLink firmware implements LoRa Mac 4.4.0 release from Semtech/StackForce [LoRaMac-Node](https://github.com/Lora-net/LoRaMac-node/tree/f42be67be402a40b3586724800771bfe13fb18e6).

We implement EU868, US915 and AU915 as defined in [LoRaWAN Regional Parameters v1.0.2rB](https://lora-alliance.org/resource_hub/lorawan-regional-parameters-v1-0-2rb/) document. Class A endpoint implementation is fully compatible with "LoRaWAN specification 1.0.2".

</br>

# Payload Contents of each enLink Product

Each enLink device has specific sensors. Each sensor exposes one or more data values. The **firmware code** is used to determine the sensors in the device. Note: the product code is similar to, but not the same as the firmware code. The following table can be used to determine the expected values in a uplink message. The [KPI](#enlink-kpi-payload-data) values are optional.

The firmware code is a concatenation of the base model plus the options.

>For example: `FW-ZN-LVCM` is the firmware code for an enLink Zone(**ZN**) with **L**ight, **V**OCs, **C**O<sub>2</sub> and **M**otion.

<div style="page-break-after: always;"></div>

## enLink AIR/AIR-X - Indoor/Outdoor Air Quality Monitor

 > [enLink Air Web Page](https://synetica.net/enlink-air/)
 </br>[enLink Air-X Web Page](https://synetica.net/enlink-air-x/)

| Firmware Code | Options | Data Type(s) | Description |
|:-----------|:--------|:-------------|:------------|
| FW-AQM  | (default) | `0x01`, `0x02` | Temperature, Humidity
| | L | `0x03` | Light Level (Indoor Air only) - [Light Sensor Downlinks](#light-sensor-downlinks)
| | V | `0x04`, `0x05`, `0x12`, `0x3F` | Pressure, VOC IAQ, bVOC, CO<sub>2</sub>e - [VOC Sensor Downlinks](#voc-sensor-downlinks)
| | C | `0x08` | NDIR CO<sub>2</sub> ppm - [CO<sub>2</sub> Sensor Downlinks](#carbon-dioxide-sensor-downlinks)
| | X | `0x06` | Oxygen
| | S | `0x50`, `0x51`, `0x52` | Sound
| | P+ | `0x57`, `0x58`, `0x59`, `0x5A`,<br/>`0x5B`, `0x5C`, `0x5D`, `0x5E`,`0x5F`, `0x60` | Particles - [Particulate Sensor Downlinks](#airair-x-and-iaqoaq-particulate-sensor-downlinks)
| | O | `0x61` | Ozone (Discontinued after v7.10)
| | O3 | `0x61` | Ozone (From v7.11)
| | G+ | `0x61`, `0x66` | Up to 4 x Gas Sensors

Link to: [Air / Air-X Downlinks](#air--air-x-downlinks)

## enLink IAQ/OAQ - Indoor/Outdoor Air Quality and IAQ Duct

> [enLink IAQ Web Page](https://synetica.net/enlink-iaq/)
 </br>[enLink IAQ Plus Web Page](https://synetica.net/enlink-iaq-plus/)
 </br>[enLink IAQ Vape Web Page](https://synetica.net/enlink-iaq-vape/)
 </br>[enLink IAQ Duct Web Page](https://synetica.net/enlink-iaq-duct/)
 </br>[enLink OAQ Web Page](https://synetica.net/enlink-oaq/)
 

| Firmware Code | Options | Data Type(s) | Description |
|:-----------|:--------|:-------------|:------------|
| FW-AQ  | (default) | `0x01`, `0x02`, `0x3B` | Temperature, Humidity/Hi-Res Humidity (Selectable from v7.05) [Temperature/Humidity Downlinks](#temperaturehumidity-downlinks)
| | V | `0x04`, `0x05`, `0x12`, `0x3F` | Pressure, VOC IAQ, bVOC, CO<sub>2</sub>e - [VOC Sensor Downlinks](#voc-sensor-downlinks)
| | R | `0x75`, `0x76`, `0x77`, `0x78`, `0x79`, `0x7A`, `0x7B`, `0x7C` | Radon Gas Uptime and concentrations - [Radon Sensor Downlinks](#radon-sensor-downlinks)
| | C | `0x08` | NDIR CO<sub>2</sub> ppm - [CO<sub>2</sub> Sensor Downlinks](#carbon-dioxide-sensor-downlinks)
| | I | `0x36`, `0x37`, `0x38`, `0x39`, `0x3A` | Indoor TVOC Sensor (enLink IAQ) - [TVOC Sensor Downlinks](#tvoc-sensor-downlinks)
| | D | `0x67`, `0x68` | Outdoor EPA Sensor (enLink OAQ) [EPA Sensor Downlink](#epa-sensor-downlink)
| | O | `0x61` | Ozone (Discontinued after v7.10)
| | O3 | `0x61` | Ozone (From v7.11)
| | G | `0x61`, `0x66` | Single Gas Sensor - [Gas Sensor Downlinks](#gas-sensor-downlinks)
| | S | `0x50`, `0x51`, `0x52` | Sound
| | N | `0x73`, `0x74` | MPS (Molecular Property Spectrometer)
| | P+ | `0x57`, `0x58`, `0x59`, `0x5A`,<br/>`0x5B`, `0x5C`, `0x5D`, `0x5E`, `0x5F`, `0x60` | Particles ([IAQ](https://synetica.net/enlink-iaq/)/[OAQ](https://synetica.net/enlink-oaq/)) </br> [Particulate Sensor Downlinks](#airair-x-and-iaqoaq-particulate-sensor-downlinks)
| | PP | `0x69`, `0x6A`, `0x6B`, `0x57`, `0x58`, `0x6C`, <br/>`0x5A`, `0x6D`, `0x6E`, `0x5B`, `0x5C`, `0x5D`, <br/>`0x6F`, `0x5F`, <br/>`0x3C`, `0x3D` | Particles ([IAQ Plus](https://synetica.net/enlink-iaq-plus/)) </br> [Particulate Sensor Downlinks](#iaq-plusvape-particulate-sensor-downlinks) </br> **Unit must be externally powered** </br></br> Compensated Temp/Humidity
| | PV | `0x69`, `0x6A`, `0x6B`, `0x57`, `0x58`, `0x6C`, <br/>`0x5A`, `0x6D`, `0x6E`, `0x5B`, `0x5C`, `0x5D`, <br/>`0x6F`, `0x5F`, `0x70`, `0x71`, `0x72`, <br/>`0x3C`, `0x3D` | Particles, Smoke/Vape ([IAQ Vape](https://synetica.net/enlink-iaq-vape/)) - Includes [ATI](#ati---adaptive-transmission-interval) feature </br> [Particulate Sensor Downlinks](#iaq-plusvape-particulate-sensor-downlinks) </br> **Unit must be externally powered** </br></br> Compensated Temp/Humidity

## enLink ZonePlus

> [enLink Zone Plus Web Page](https://synetica.net/enlink-zone-plus/)

| Firmware Code | Options | Data Type(s) | Description |
|:-----------|:--------|:-------------|:------------|
| FW-ZNP  | (default) | `0x01`, `0x02`, `0x3B` | Temperature, Humidity/Hi-Res Humidity (Selectable from v7.05) [Temperature/Humidity Downlinks](#temperaturehumidity-downlinks)
| | L | `0x03` | Light Level - [Light Sensor Downlinks](#light-sensor-downlinks)
| | V | `0x04`, `0x05`, `0x12`, `0x3F` | Pressure, VOC IAQ, bVOC, CO<sub>2</sub>e - [VOC Sensor Downlinks](#voc-sensor-downlinks)
| | C | `0x08` | NDIR CO<sub>2</sub> ppm - [CO<sub>2</sub> Sensor Downlinks](#carbon-dioxide-sensor-downlinks)
| | M | `0x13`, `0x14` | Motion (PIR). Includes [ATI](#ati---adaptive-transmission-interval) feature
| | S | `0x50`, `0x51`, `0x52` | Sound

## enLink Zone

> [enLink Zone Web Page](https://synetica.net/enlink-zone/)

| Firmware Code | Options | Data Type(s) | Description |
|:-----------|:--------|:-------------|:------------|
| FW-ZN  | (default) | `0x01`, `0x02` | Temperature, Humidity
| | L | `0x03` | Light Level - [Light Sensor Downlinks](#light-sensor-downlinks)
| | V | `0x04`, `0x05`, `0x12`, `0x3F` | Pressure, VOC IAQ, bVOC, CO<sub>2</sub>e - [VOC Sensor Downlinks](#voc-sensor-downlinks)
| | C | `0x08` | NDIR CO<sub>2</sub> ppm - [CO<sub>2</sub> Sensor Downlinks](#carbon-dioxide-sensor-downlinks)
| | M | `0x13`, `0x14` | Motion (PIR). Includes [ATI](#ati---adaptive-transmission-interval) feature

## enLink Zone V2

Available from 2025

| Firmware Code | Options | Data Type(s) | Description |
|:-----------|:--------|:-------------|:------------|
| FW-ZN2  | (default) | `0x01`, `0x3B` | Temperature, High resolution humidity
| | V | `0x04`, `0x05`, `0x12`, `0x3F` | Pressure, VOC IAQ, bVOC, CO<sub>2</sub>e - [VOC Sensor Downlinks](#voc-sensor-downlinks)

## enLink Zone View

> [enLink Zone View Web Page](https://synetica.net/enlink-zone-view/)
</br> [enLink Zone View Home Web Page](https://synetica.net/enlink-zone-view-home/)

| Firmware Code | Options | Data Type(s) | Description |
|:-----------|:--------|:-------------|:------------|
| FW-ZV  | (default) | `0x01`, `0x3B` | Temperature, Hi-Res Humidity
| | L | `0x03` | Light Level - [Light Sensor Downlinks](#light-sensor-downlinks)
| | C | `0x08` | NDIR CO<sub>2</sub> ppm - [CO<sub>2</sub> Sensor Downlinks](#carbon-dioxide-sensor-downlinks)
| | H | `0x13`, `0x14`, `0x16` | Human Presence. Includes [ATI](#ati---adaptive-transmission-interval) feature - [Occupancy Sensor Downlinks](#occupancy-sensor-downlinks)
| | I | `0x36`, `0x37`, `0x38`, `0x39`, `0x3A` | Indoor TVOC Sensor (enLink IAQ) - [TVOC Sensor Downlinks](#tvoc-sensor-downlinks)

[Zone View e-paper Display Downlinks](#zone-view-e-paper-display-downlinks)

## enLink Modbus

> [enLink Modbus Web Page](https://synetica.net/enlink-modbus/)

| Firmware Code | Options | Data Type(s) | Description |
|:-----------|:--------|:-------------|:------------|
| FW-MB-32  | (None)  | `0x0F`, `0x10`, `0x11` | Exception, Interval, Cumulative readings

## enLink Status - Pulse Counter

> [enLink Status Pulse Web Page](https://synetica.net/enlink-status-p/)

| Firmware Code | Options | Data Type(s) | Description |
|:-----------|:--------|:-------------|:------------|
| FW-STS-P/PX | (None) | `0x0E`, `0x15` | Count (0 to 2^32), [Change of State](#pulse-counters---change-of-state) - Includes [ATI](#ati---adaptive-transmission-interval) feature

## enLink Status - Leak Sensor

> [enLink Status Leak Web Page](https://synetica.net/enlink-status-l/)

| Firmware Code | Options | Data Type(s) | Description |
|:-----------|:--------|:-------------|:------------|
| FW-STS-L  | (None)  | `0x30`, `0x31` | Resistance, Leak Event. Includes [ATI](#ati---adaptive-transmission-interval) feature on the leak event

 [Leak Sensor Downlinks](#leak-sensor-downlinks)

## enLink Status - Differential Pressure / Air Flow (Velocity)

> [enLink Status DP Web Page](https://synetica.net/enlink-status-dp/) /  [enLink Status AF Web Page](https://synetica.net/enlink-status-af/)

| Firmware Code | Options | Data Type(s) | Description |
|:-----------|:--------|:-------------|:------------|
| FW-STS-DP/AF | (None)  | `0x2C`, `0x2D` | Pressure, Air flow. Either one or both can be selected [DP/AF Downlinks](#differential-pressure--air-flow-downlinks)

## enLink Status - Gauge Pressure

> [enLink Status GP Web Page](https://synetica.net/enlink-status-gp/)

| Firmware Code | Options | Data Type(s) | Description |
|:-----------|:--------|:-------------|:------------|
| FW-STS-GP  | (None)  | `0x32`, `0x33` | Pressure Pa, Temperature (of the sensor)

## enLink Status - Temperature Probes

> [enLink Status T Web Page](https://synetica.net/enlink-status-t/)

| Firmware Code | Options | Data Type(s) | Description |
|:-----------|:--------|:-------------|:------------|
| FW-STS | 1T | `0x17`, `0x1A`, `0x1D`, `0x20`,<br/>`0x23`, `0x26`, `0x29` | Temperature, alarm status (if set) Includes [ATI](#ati---adaptive-transmission-interval) feature
| | 2T  | As above, plus<br/>`0x18`, `0x1B`, `0x1E`, `0x21`,<br/>`0x24`, `0x27`, `0x2A` | Temperature, alarm status (if set) Includes [ATI](#ati---adaptive-transmission-interval) feature

## enLink Status - Voltage/Current Sensor

> [enLink Status VC Web Page](https://synetica.net/enlink-status-vc/)

| Firmware Code | Options | Data Type(s) | Description |
|:-----------|:--------|:-------------|:------------|
| FW-STS-VC  | (None)  | `0x2E` | Mode: Voltage
|            |         | `0x2F` | Mode: Current
|            |         | `0x30` | Mode: Resistance

</br>

## ATI - Adaptive Transmission Interval

This is included on enLink devices where an alarm or status feature requires immediate transfer of a radio message. When a change of alarm state occurs a wireless message is sent immediately, however messages will not be sent more frequently than the **Adaptive Min interval**. The **Adaptive Max interval** acts like a heartbeat, so if no change of alarm state occurs then a message is sent at the Adaptive Max interval.

</br>

# Uplink Payload

The enLink payload structure is designed to be as efficient as possible. Data for multiple sensor values can be concatenated into a single payload which can be easily decoded. If the payload length is restricted due to channel time limits, the whole message will be split into multiple payloads. Each payload will always be split on a **Sensor Data** boundary. This is done so each payload can be easily decoded. A payload will always have the first byte as a **Data Type Identifier**.

## Uplink Transmission Port

The enLink device design uses a single port byte value to transmit uplink messages. This is by default set to 1. This can be changed to allow the user to easily decode packets from different manufacturers, if needed. This can be changed either via the serial port menu, accessed by a USB cable or with a downlink message.

## Uplink Payload Structure

The payload is an array of `Sensor Data` messages, each one is 2 or more bytes in length.

> `[Sensor-1 Data]  [Sensor-2 Data] ... [Sensor-n Data]`

</br>

Sensor data consists of a `Data Type Identifier` byte followed by the `Data Value` as one or more bytes. The number of bytes in the data value is determined by the Data Type Identifier and is fixed. Details are here: [Sensor Details](#sensor-details).

> Example Payload (hexadecimal): `01 01 23 02 56 03 01 A4`

These bytes can be split up as follows:

> Example Payload: `[01 01 23] [02 56] [03 01 A4]`

Finally, decoding the data:

| Data Type Identifier | Data Value Calculation | Result |
|:---------------------|:-----------------------|:------ |
| `01` - Temperature   | ((`0x01` * 256) + `0x23`) / 10 = (256 + 35) / 10 | 29.1 °C |
| `02` - Humidity      | `0x56` | 86 %rH |
| `03` - Ambient Light | (`0x01` * 256) + `0xA4` = 256 + 164 | 420 Lux |

Each **Data Type** can use 1 or more bytes to send the value according to the following table:

</br>

## Uplink Payload 'Type'

| Type Hex&nbsp;Dec| System Message | Num Bytes | 
|:----------:| --------------------- |:---------:|
| `0xA5` 165 | ACK/NACK reply from a [downlink](#downlink-payload). See [examples](#example-uplink-replies-to-downlink-messages) | 3 or 5 |
| `0x00` 000 | Firmware Version - 3 bytes, `0x00` `MAJOR` `MINOR` Only sent in first payload after power up, or by [downlink request](#send-firmware-version-in-downlink)| 3 | 


| Type Hex&nbsp;Dec| Sensor | Sensor Range | Units | Num Bytes | Format | Scaling |
|:----------:| ------ | ------------ | ----- |:---------:|:-----------:| ------- |
| `0x01` 001 | Temperature | -40 to 85 | °C | 2 | S16 | / 10
| `0x02` 002 | Humidity | 0 to 100 | %rH | 1 | U8
| `0x03` 003 | Ambient Light | 0.01 to 83k | lux | 2 | U16
| `0x04` 004 | Pressure | 300 to 1100 | mbar | 2 | U16
| `0x05` 005 | Volatile Organic Compounds (VOC) |  | Static IAQ | 2 | U16
| `0x06` 006 | Oxygen | 0 to 25 | % | 1 | U8 | / 10
| `0x07` 007 | Carbon Monoxide | 0 to 100  | ppm | 2 | U16 | / 100
| `0x08` 008 | Carbon Dioxide (2 sensor ranges) | 0 to 5000 or 0 to 50,000 | ppm | 2 | U16 | 
| `0x09` 009 | Ozone (O3) | 0 to 1<br />0 to 1000 | ppm<br />ppb | 2 | U16 | / 10000<br />/ 10
| `0x0A` 010 | Air Pollutants: CO, Ammonia, Ethanol, H2, Methane / Propane / Iso-Butane. | 100 to 1500 (Typ)| kΩ | 2 | U16 | / 10
| `0x0D` 013 | Hydrogen Sulphide (H<sub>2</sub>S) | 0 to 100 | ppm | 2 | U16 | / 100
| `0x0E` 014 | Pulse ID + Pulse Counter | ID: 0 to 2<br />Value: 0 to 2^32 | count | 1 + 4 | U32
| `0x0F` 015 | MB ID + Modbus Exception | ID: 0 to 31<br />Error Num | | 1 + 1 | U8
| `0x10` 016 | MB ID + Modbus Interval value | ID: 0 to 31<br />Interval Value | | 1 + 4 | F32
| `0x11` 017 | MB ID + Modbus Cumulative value | ID: 0 to 31<br />Cumulative&nbsp;Value | | 1 + 4 | F32
| `0x12` 018 | bVOC – VOC concentration |  | ppm | 4 | F32
| `0x13` 019 | Detection count (PIR etc.) |  | count | 4 | U32
| `0x14` 020 | Total occupied duration |  | seconds | 4 | U32
| `0x15` 021 | Change of State information | [Change of State](#pulse-counters---change-of-state) |  | 3 | U16
| `0x16` 022 | Detection Status (Occupancy, Liquid Level)| 0 = Inactive<br />1 = Detected | status | 1 | U8
| `0x17` 023 | Probe 1 Temperature | -55 to 125 | °C | 2 | S16 | / 10
| `0x18` 024 | Probe 2 Temperature | -55 to 125 | °C | 2 | S16 | / 10
| `0x19` 025 | Probe 3 Temperature | -55 to 125 | °C | 2 | S16 | / 10
| `0x1A` 026 | Time temperature probe 1 has spent in 'in band' zone |  | seconds | 4 | U32
| `0x1B` 027 | Time temperature probe 2 has spent in 'in band' zone |  | seconds | 4 | U32
| `0x1C` 028 | Time temperature probe 3 has spent in 'in band' zone |  | seconds | 4 | U32
| `0x1D` 029 | Number of times in band alarm has been activated for temperature probe 1 |  | count | 2 | U16
| `0x1E` 030 | Number of times in band alarm has been activated for temperature probe 2 |  | count | 2 | U16
| `0x1F` 031 | Number of times in band alarm has been activated for temperature probe 3 |  | count | 2 | U16
| `0x20` 032 | Time temperature probe 1 has spent below low threshold |  | seconds | 4 | U32
| `0x21` 033 | Time temperature probe 2 has spent below low threshold |  | seconds | 4 | U32
| `0x22` 034 | Time temperature probe 3 has spent below low threshold |  | seconds | 4 | U32
| `0x23` 035 | Number of times low threshold alarm has been activated for temperature probe 1  |  | count | 2 | U16
| `0x24` 036 | Number of times low threshold alarm has been activated for temperature probe 2 |  | count | 2 | U16
| `0x25` 037 | Number of times low threshold alarm has been activated for temperature probe 3 |  | count | 2 | U16
| `0x26` 038 | Time temperature probe 1 has spent above high threshold |  | seconds | 4 | U32
| `0x27` 039 | Time temperature probe 2 has spent above high threshold |  | seconds | 4 | U32
| `0x28` 040 | Time temperature probe 3 has spent above high threshold |  | seconds | 4 | U32
| `0x29` 041 | Number of times high threshold alarm has been activated for temperature probe 1  |  | count | 2 | U16
| `0x2A` 042 | Number of times high threshold alarm has been activated for temperature probe 2 |  | count | 2 | U16
| `0x2B` 043 | Number of times high threshold alarm has been activated for temperature probe 3 |  | count | 2 | U16
| `0x2C` 044 | Differential Pressure | +/- 5000 | Pa | 4 | F32
| `0x2D` 045 | Airflow | 0 to 100 | m/s   | 4 | F32
| `0x2E` 046 | Voltage | 0 to 10  | Volts | 2 | U16 | / 1000
| `0x2F` 047 | Current | 0 to 20  | mA    | 2 | U16 | / 1000
| `0x30` 048 | Resistance | 0 to 6553.5 kΩ (6.5MΩ) | kΩ | 2 | U16 | / 10
| `0x31` 049 | Leak Detection (resistance rope) | 0 = No Leak<br />1 = Leak Detected | status | 1 | U8
| `0x32` 050 | Gauge Pressure | 0 to 1000 kPa typ. | Pa | 4 | F32
| `0x33` 051 | Gauge Pressure Sensor Temperature | -40 to 85 | °C | 2 | S16 | /100
| `0x34` 052 | Liquid Level (Depth) | 0 to 5000 mm typ. | mm | 4 | F32
| `0x35` 053 | LL Sensor Temperature | -40 to 85 | °C | 2 | S16 | /100
| `0x36` 054 | TVOC Minimum |  | mg/m³ | 2 | F32
| `0x37` 055 | TVOC Average |  | mg/m³ | 2 | F32
| `0x38` 056 | TVOC Maximum |  | mg/m³ | 2 | F32
| `0x39` 057 | EtOH (Ethanol equivalent) |  | ppm | 4 | F32
| `0x3A` 058 | IAQ (1.0 to 5.0) Included on `PBAQ` version from v7.11 |  | IAQ | 4 | F32
| `0x3B` 059 | High resolution Relative Humidity   | 0 to 100.00% | %rH | 2 | U16 | / 100
| `0x3C` 060 | Compensated Temperature | -40 to 85 | °C | 2 | S16 | / 10
| `0x3D` 061 | Compensated Relative Humidity | 0 to 100.00% | %rH | 2 | U16 | / 100
| `0x3F` 063 | CO<sub>2</sub>e estimate equivalent (BME680) |  | ppm | 4 | F32
| `0x50` 080 | Sound Level Minimum |  | dB(A) | 4 | F32
| `0x51` 081 | Sound Level Average |  | dB(A) | 4 | F32
| `0x52` 082| Sound Level Maximum |  | dB(A) | 4 | F32
| `0x53` 083 | Nitric Oxide     | 0 - 100 | ppm | 2 | U16 | / 100
| `0x54` 084 | Nitrogen Dioxide | 0 – 5   | ppm | 2 | U16 | / 10000
| `0x55` 085 | Nitrogen Dioxide | 0 – 20  | ppm | 2 | U16 | / 1000
| `0x56` 086 | Sulphur Dioxide  | 0 – 20  | ppm | 2 | U16 | / 1000
| `0x57` 087 | Particulate matter mass concentration at PM1.0 |  | µg/m³ | 4 | F32
| `0x58` 088 | As above, PM2.5  |  | µg/m³ | 4 | F32
| `0x59` 089 | As above, PM4.0  |  | µg/m³ | 4 | F32
| `0x5A` 090 | As above, PM10.0 |  | µg/m³ | 4 | F32
| `0x5B` 091 | Particulate matter number concentration at PM0.5 |  | #/cm³ | 4 | F32
| `0x5C` 092 | As above, PM1.0  |  | #/cm³ | 4 | F32
| `0x5D` 093 | As above, PM2.5  |  | #/cm³ | 4 | F32
| `0x5E` 094 | As above, PM4.0  |  | #/cm³ | 4 | F32
| `0x5F` 095 | As above, PM10.0 |  | #/cm³ | 4 | F32
| `0x60` 096 | Particulate matter typical particle size |  | µm | 4 | F32
| `0x61` 097 | Gas ID + Gas Concentration |  | ppb | 1 + 4 | F32
| `0x62` 098 | Corrosion: Metal ID + Metal Thickness | ~ 1000nm | nm | 1 + 4 | F32
| `0x63` 099 | Corrosion: Metal ID + Minimum thickness |  | nm | 1 + 2 | U16
| `0x64` 100 | Corrosion: Metal ID + Original thickness |  | nm | 1 + 2 | U16
| `0x65` 101 | Corrosion: percentage of thickness between original thickness (100%) and minimum (0%) |  | % | 1 + 4 | F32
| `0x66` 102 | Gas ID + Gas Concentration |  | µg/m³ | 1 + 4 | F32
| `0x67` 103 | Outdoor EPA Index Sensor Fast AQI (reading taken over 1 minute) | 0 to 500 | AQI | 2 | U16
| `0x68` 104 | Outdoor EPA Index Sensor EPA AQI | 0 to 500 | AQI | 2 | U16
| `0x69` 105 | Particulate matter mass concentration at PM0.1 |  | µg/m³ | 4 | F32
| `0x6A` 106 | As above, PM0.3  |  | µg/m³ | 4 | F32
| `0x6B` 107 | As above, PM0.5  |  | µg/m³ | 4 | F32
| `0x6C` 108 | As above, PM5.0  |  | µg/m³ | 4 | F32
| `0x6D` 109 | Particulate matter number concentration at PM0.1 |  | #/cm³ | 4 | F32
| `0x6E` 110 | As above, PM0.3  |  | #/cm³ | 4 | F32
| `0x6F` 111 | As above, PM5.0  |  | #/cm³ | 4 | F32
| `0x70` 112 | Detection: Event Count  | 0 to 65535 | count | 2 | U16
| `0x71` 113 | Detection: Smoke Count  | 0 to 65535 | count | 2 | U16
| `0x72` 114 | Detection: Vape Count   | 0 to 65535 | count | 2 | U16
| `0x73` 115 | Flammable Gas Sensor Cycle Count (internal counter increments every 4 seconds)  |  | count | 4 | I32
| `0x74` 116 | Flammable Gas ID + %LEL(Lower Explosive Level) concentration   | < -15%  to > +110% | %LEL(ISO) | 1 + 4 | F32
| `0x75` 117 | Radon Sensor Uptime | 0 to 2^32 | seconds | 4 | U32
| `0x76` 118 | Radon Gas average over uptime | 0 to 2^16 | Bq/m³ | 4 | U16
| `0x77` 119 | Radon Gas average over 6 hours | 0 to 2^16 | Bq/m³ | 4 | U16
| `0x78` 119 | Radon Gas average over 12 hours | 0 to 2^16 | Bq/m³ | 4 | U16
| `0x79` 119 | Radon Gas average over 24 hours | 0 to 2^16 | Bq/m³ | 4 | U16
| `0x7A` 119 | Radon Gas average over 48 hours | 0 to 2^16 | Bq/m³ | 4 | U16
| `0x7B` 119 | Radon Gas average over 72 hours | 0 to 2^16 | Bq/m³ | 4 | U16
| `0x7C` 119 | Radon Gas average over 96 hours | 0 to 2^16 | Bq/m³ | 4 | U16
| `0xFE` 254 | Fault: [Sensor ID] + [Fault ID] + [Fault Value] |  |  | 1 + 1 + 2 | U16
</br>

## Decoding Complex Uplinks

Most sensor data values are self-explanatory, additional information for decoding more complex sensor data is given in the sections below.

### Modbus

Types: `0x0F`, `0x10`, `0x11`

The enLink Modbus data types for Interval and Cumulative values use 5 bytes to encode the `item index` and `value`.

- Modbus Exception – standard Modbus exception codes, e.g. Code `02` – Illegal Data Address.
- Modbus Interval Value – for Modbus data types which do not accumulate, e.g. Voltage, Current, Temperature etc.
- Modbus Cumulative Value – for Modbus data types which are linked to a value which accumulates, e.g. kWh, Volume etc.

The first byte indicates which of the 32 available Modbus items is being accessed (0 to 31), followed by the Modbus Value represented as a 32 bit floating point value ([IEEE 754](https://en.wikipedia.org/wiki/IEEE_754) format). Interval Value types are used for instantaneous values, such as Voltage, Current, Temperature, Pressure etc. Cumulative Values are used for items such as energy consumption and total volume.

> Example Payload Data: `10 04 41 BC 7A E1`

This is an interval data value, from configured item number 5. The value is 23.56.

For an online converter, see [Hex to Float Converter](https://gregstoll.com/~gregstoll/floattohex/)


### Pulse Counters - Change of State

---

Type: `0x15`

The full message is sent as 3 bytes. The second byte indicates the reason for the radio transmission (Trigger Status), the third byte gives the open/close state of the inputs (Input State).

> Note: To enable the Change-of-State feature to transmit when a change is detected, the device configuration requires that **[ATI](#ati---adaptive-transmission-interval)** is enabled, and the **Transmit on Change of State** option is enabled.

The two data value bytes are bit-encoded as follows:

### Trigger Status

- Bit 0 - Set to 1 when Input 1 Changed from *Closed* to *Open*
- Bit 1 - Set to 1 when Input 2 Changed from *Closed* to *Open*
- Bit 2 - Set to 1 when Input 3 Changed from *Closed* to *Open*
- Bit 3 - Not used
- Bit 4 - Set to 1 when Input 1 Changed from *Open* to *Closed*
- Bit 5 - Set to 1 when Input 2 Changed from *Open* to *Closed*
- Bit 6 - Set to 1 when Input 3 Changed from *Open* to *Closed*
- Bit 7 - Not used

If a message is received and the *trigger status* byte value is zero, then the message was either sent after a config button press, or because a regular transmission was scheduled. I.e. the ATI maximum interval has expired. In the NodeRed example decoder, this event is marked as a *heartbeat*.

You may receive a *trigger status* byte value where multiple bits are set. This could be that these events occurred before the radio packet could be sent. For example, a fast transition from *open* -> *closed* -> *open*. This may also be caused by a duty cycle restriction delaying the transmission, or the message sending was paused because a previous message was sent within the minimum ATI interval.

### Input State

- Bit 0 - Input 1 state. Set to 1 when *Closed*
- Bit 1 - Input 2 state. Set to 1 when *Closed*
- Bit 2 - Input 3 state. Set to 1 when *Closed*
- Bit 3 - Not used
- Bit 4 - Not used
- Bit 5 - Not used
- Bit 6 - Not used
- Bit 7 - Not used

> Example Payload Data: `15 01 05`

The example shows the transmission was triggered when Input #1 changed from *Closed* to *Open*, and the state of the inputs are:

- Input 1: Closed
- Input 2: Open
- Input 3: Closed

### Gas Readings

---

Types: `0x61`, `0x66`

The full message is sent as 6 bytes. For example:

> Example Payload Data: `61 19 41 BC 7A E1`

Ths translates to Gas Type `0x19` or 25 which is **Carbon Monoxide**. The value is 23.56 ppb.

The Gas types are listed here:

|  |  |  |
|--|--|--|
| `0x17` - Formaldehyde - HCHO / CH<sub>2</sub>O                      | | `0x18` - Volatile Organic Compounds
| `0x19` - Carbon Monoxide - CO                                       | | `0x1A` - Chlorine - Cl<sub>2</sub>     
| `0x1B` - Hydrogen - H<sub>2</sub>                                   | | `0x1C` - Hydrogen Sulphide - H<sub>2</sub>S     
| `0x1D` - Hydrogen Chloride – HCl                                    | | `0x1E` - Hydrogen Cyanide - HCN
| `0x1F` - Hydrogen Fluoride - HF                                     | | `0x20` - Ammonia - NH<sub>3</sub>
| `0x21` - Nitrogen Dioxide - NO<sub>2</sub>                          | | `0x22` - Oxygen - O<sub>2</sub>
| `0x23` - Ozone - O<sub>3</sub>                                      | | `0x24` - Sulphur Dioxide - SO<sub>2</sub>
| `0x25` - Hydrogen Bromide – HBr                                     | | `0x26` - Bromine – Br<sub>2</sub>
| `0x27` - Fluorine – F<sub>2</sub>                                   | | `0x28` - Phosphine – PH<sub>3</sub>
| `0x29` - Arsine – AsH<sub>3</sub>                                   | | `0x2A` - Silane – SiH<sub>4</sub>
| `0x2B` - Germanium Alkane – GeH<sub>4</sub>                         | | `0x2C` - Diborane – B<sub>2</sub>H<sub>6</sub>
| `0x2D` - Boron Trifluoride – BF<sub>3</sub>                         | | `0x2E` - Tungsten Hexafluoride – WF<sub>6</sub>
| `0x2F` - Silicon Tetrafluoride – SiF<sub>4</sub>                    | | `0x30` - Xenon Difluoride - XeF<sub>2</sub>
| `0x31` - Titanium(IV) Fluoride – TiF<sub>4</sub>                    | | `0x32` - Odour/Smell
| `0x33` - IAQ - Indoor Air Quality (TVOCs)                           | | `0x34` - AQI - Outdoor Air Quality (TVOCs)
| `0x35` - Nonmethane Hydrocarbons - NMHC                             | | `0x36` - Sulphur Oxides – SOx
| `0x37` - Nitrogen Oxides – NOx                                      | | `0x38` - Nitric Oxide – NO
| `0x39` - Isobutylene – C<sub>4</sub>H<sub>8</sub>                   | | `0x3A` - Propylene Glycol – C<sub>3</sub>H<sub>8</sub>O<sub>2</sub>
| `0x3B` - Methanethiol – CH<sub>4</sub>S                             | | `0x3C` - Styrene – C<sub>8</sub>H<sub>8</sub>
| `0x3D` - Butane – C<sub>4</sub>H<sub>10</sub>                       | | `0x3E` - Butadiene – C<sub>4</sub>H<sub>6</sub>
| `0x3F` - Hexane – C<sub>6</sub>H<sub>14</sub>                       | | `0x40` - Ethylene Oxide – C<sub>2</sub>H<sub>4</sub>O
| `0x41` - Trimethylamine – C<sub>3</sub>H<sub>9</sub>N               | | `0x42` - Dimethylamine – C<sub>2</sub>H<sub>7</sub>N
| `0x43` - Ethyl Alcohol (Ethanol) – C<sub>2</sub>H<sub>6</sub>O      | | `0x44` - Carbon Disulphide – CS<sub>2</sub>
| `0x45` - Ethanethiol – C<sub>2</sub>H<sub>6</sub>S                  | | `0x46` - Dimethyl Disulphide – C<sub>2</sub>H<sub>6</sub>S<sub>2</sub>
| `0x47` - Ethylene – C<sub>2</sub>H<sub>4</sub>                      | | `0x48` - Methanol – CH<sub>3</sub>OH
| `0x49` - Benzene – C<sub>6</sub>H<sub>6</sub>                       | | `0x4A` - Paraxylene – C<sub>8</sub>H<sub>10</sub>
| `0x4B` - Toluene – C<sub>7</sub>H<sub>8</sub>                       | | `0x4C` - Acetic Acid – CH<sub>3</sub>COOH
| `0x4D` - Chlorine Dioxide – ClO<sub>2</sub>                         | | `0x4E` - Hydrogen Peroxide – H<sub>2</sub>O<sub>2</sub>
| `0x4F` - Nitrogen Hydride (Hydrazine) – N<sub>2</sub>H<sub>4</sub>  | | `0x50` - Ethylenediamine – C<sub>2</sub>H<sub>8</sub>N<sub>2</sub>
| `0x51` - Trichloroethylene – C<sub>2</sub>HCl<sub>3</sub>           | | `0x52` - Trichloromethane (Chloroform) – CHCl<sub>3</sub>
| `0x53` - 1,1,1-Trichloroethane – C<sub>2</sub>H<sub>3</sub>Cl<sub>3</sub> | | `0x54` - Hydrogen Selenide – H<sub>2</sub>Se

### Corrosion

---

Types: `0x62`, `0x63`, `0x64`, `0x65`

The full message is sent as 6 bytes. The second byte indicates the coupon and sacrificial metal of the sensor.

> Example Payload Data: `62 01 44 58 D0 27`

The example shows Coupon #1 is Copper and the thickness is 867.252 nanometres (equivalent to 8672.52 Ångströms).

Other Coupon/Metal types are:

| Coupon #1 |  | Coupon #2 |
|--|--|--|
| `0x00` - Unknown Metal / Error | | `0x80` - Unknown Metal / Error
| `0x01` - Copper                | | `0x81` - Copper
| `0x02` - Silver                | | `0x82` - Silver
| `0x03` - Chromium              | | `0x83` - Chromium

### Flammable Gas Readings

---

Available from v7.16 onwards.

Type: `0x74`

The full message is sent as 6 bytes. For example:

> Example Payload Data: `74 03 41 BC 7A E1`

This translates to Gas Type `0x03` which is **Methane**. The next four bytes are a floating point (F32) number. In this example the value is **23.56 %LEL(ISO)**.

The Gas classes are listed here:

|  |  |  |  |  |
|--|--|--|--|--|
| 0 - `0x00`   | No Gas             | | 1 - `0x01`   | Hydrogen
| 2 - `0x02`   | Hydrogen Mixture   | | 3 - `0x03`   | Methane
| 4 - `0x04`   | Light Gas          | | 5 - `0x05`   | Medium Gas
| 6 - `0x06`   | Heavy Gas          | |
| 253 - `0xFD` | Unknown Gas        | | 254 - `0xFE` | Under Range: < -5%LEL
| 255 - `0xFF` | Over Range: >= 110%LEL

</br>

### Sensor Fault Code Messages

---

Available from v7.14 onwards.

Type: `0xFE`

The fault code messages are used to report a sensor state. Communication or transducer faults may be reported by the sensor. The full message is sent as 5 bytes. The second byte indicates the Sensor-ID, third byte the Fault-Code and the next two are the unsigned 16 bit value.

#### SPS30 Particulates - Sensor ID: 28 `0x1C`

Available from v7.14 onwards.

> Example Payload Data: `FE 1C 01 02 27`

The example shows Sensor-ID `0x1C` (28 decimal). This is the SPS30 particulate sensor. Fault-Code is `0x01` (1 decimal). This is 'Fan-Speed-Error'. The value is 0x0227 (551 decimal) - this is the number of errors occured since last power-up.

| Fault Code | Name | Value Description |
|--|--|--|
| `0x01` | Fan Speed Error | Count. Can occur once per sample
| `0x02` | Laser Fail | Count. Can occur once per sample
| `0x03` | Fan Failure | Count. Can occur once per sample

> Note: These packets are only sent if the count is greater than zero.

#### Flammable Gas - Sensor ID: 36 `0x24`

Available from v7.16 onwards.

> Example Payload Data: `FE 24 35 00 27`

The example shows Sensor-ID `0x24` (36 decimal). Fault-Code is `0x35` (53 decimal). This is 'Breath/Humidity Surge'. The value is 0x0027 (39 decimal) - this is the number of errors occured since last  powered up.

All the values are a count of the occurence of each condition.

| Fault Code | Name | Value Description |
|--|--|--|
| `0x01` | CRC Failed                     | Transmitted data failed checksum. The message will be retried up to 20 times before the sensor is restarted.
| `0x02` | Bad Parameter                  | Transmitted parameter failed to be understood. The message will be retried up to 20 times before the sensor is restarted.
| `0x05` | Unknown Cmd                    | Transmitted command failed to be understood. The message will be retried up to 20 times before the sensor is restarted.
| `0x07` | Incomplete Cmd                 | Transmitted command failed to be understood. The message will be retried up to 20 times before the sensor is restarted.
| `0x21` | VDD Out of Range               | -100%LEL - Power cycle the device. If this error persists, contact support.
| `0x22` | VREF Out of Range              | -100%LEL - Contact support.
| `0x23` | Env. Sensor Out of Range       | Environment sensor (temp, humidity, pressure) out of range. Return the device to specified operating conditions.
| `0x24` | Env. Sensor Failed             | -100%LEL - The sensor was exposed to an extreme environmental condition that can permanently damage it, rendering it unsuitable for accurate readings. As a fail-safe, this error permanently latches the sensor and disables further operation.
| `0x25` | Microcontroller Error          | -100%LEL - Contact support.
| `0x30` | Sensor read Negative           | -15%LEL - Wait for sensor to return to zero. If message persists >10 minutes, contact support.
| `0x31` | Condensation                   | Condensation condition exists at sensor (out of specification). Raise temperature and/or lower humidity.
| `0x32` | Sensor Error                   | -100%LEL - Transducer malfunction. Contact support.
| `0x33` | Gas detected during startup    | Sensor has detected flammable gas during start-up period. Re-start sensor in clean air.
| `0x34` | Slow Gas accumulation detected | Sensor has detected a slow accumulation of gas. Re-start sensor in clean air.
| `0x35` | Breath/Humidity Surge          | Sensor has detected condition indicative of human breath or humidity surge. Exposure to breath or humidity surges may result in false positive readings.
| `0xF9` | Reply Timeout                  | Received data time out. The message will be retried up to 20 times before the sensor is restarted.
| `0xFA` | Incomplete reply               | Received data failed to be understood. The message will be retried up to 20 times before the sensor is restarted.
| `0xFB` | CRC error on reply             | Received data failed checksum. The message will be retried up to 20 times before the sensor is restarted.
| `0xFC` | Sensor restart                 | Transmit/Receive failed too many times and the sensor was restarted.
| `0xFF` | Unknown Status                 | Unknown status ID received from sensor.

> Note: These packets are only sent if the count is greater than zero. </br> You can reset these counters with a downlink.

#### Radon Gas Sensor - Sensor ID: 45 `0x2D`

Available from v7.20 onwards.

> Example Payload Data: `FE 2D 01 02 27`

The example shows Sensor-ID `0x2D` (45 decimal). This is the Radon gas sensor. The Fault-Code is `0x01`. This is 'Restarts'. The value is 0x0227 (551 decimal) - this is the number of times errors have forced the sensor to restart (power cycle) since last power-up of the device.

| Fault Code | Name | Value Description |
|--|--|--|
| `0x01` | Restart | Count. After 7 comms failures the sensor will be power cycled.

> Note: These packets are only sent if the count is greater than zero.

</br>

## enLink KPI Payload Data

Each enLink end-node device can have optional Key Performance Indicators (KPI) added to the payload message. Each KPI can use 1 or more bytes to send the value according to the following table.

| Type Hex&nbsp;Dec | KPI             | Comments     | Units | Num Bytes | Format |
|:---------:| --------------- | ------------ | ----- |:---------:| ------ |
| `0x40` 064 | CPU&nbsp;Temperature | Packed Byte. See JS Code | °C | 2 | S16
| `0x41` 065 | Battery Status | 0=Ext Power; 1 - 254 (1.8 - 3.3V); 255=Error | status | 1 | U8
| `0x42` 066 | Battery Voltage | 0 -> 3600 mV (3600=Ext Power) | mV | 2 | U16
| `0x43` 067 | RX RSSI  | Received Signal Strength | dBm | 2 | S16
| `0x44` 068 | RX SNR   | Received Signal-Noise Ratio | dB | 1 | S8
| `0x45` 069 | RX Count | Downlink message count | count | 2 | U16
| `0x46` 070 | TX Time  | Time to send message | ms | 2 | U16
| `0x47` 071 | TX Power | Transmit power | dBm | 1 | S8
| `0x48` 072 | TX Count | Uplink message count | count | 2 | U16
| `0x49` 073 | Power up count | Number of times unit powered up | count | 2 | U16
| `0x4A` 074 | USB insertions count | Number of times USB activated | count | 2 | U16
| `0x4B` 075 | Login OK count | Successful logon count | count | 2 | U16
| `0x4C` 076 | Login fail count | Failed logon count | count | 2 | U16
| `0x4D` 077 | Fan runtime | Total time the air intake fan has run (AIR models only) | seconds | 4 | U32
| `0x4E` 078 | CPU Temperature | New from Ver: 4.9 | °C | 2 | S16 /10

Example code for different LoRaWAN Network Servers (LNS) is included in the folders on this site.

![pic01](_img/nr-01.png)
*Screenshot of example using NodeRED*

</br>

</br>

# Downlink Payload

Downlink payloads are sent to re-configure the device. When the device processes the payload, it acknowledges the message by transmitting an ACK/NACK and the identifier code. This is to notify the user that the message has been received. An example to decode the ACK/NACK messages that are sent from the end-node to the LNS is included in the example decoder source files.

## Downlink Payload Structure
| Header | Msg Len | Command | Value      |
| ------ | ------- | ------- | ---------- |
| 1 byte | 1 byte  | 1 byte  | *n bytes*  |

The header byte is is always `0xA5`.

**Msg Len** is the number of bytes in the settings data. The settings data starts with a **Command** byte and then the command **Value**. The Value can be empty.

## Downlink Receive Port

When the enLink device receives a downlink message, it first checks the port byte value. If this value matches the expected value, it then attempts to decode the message and process the result. By default the expected value is set to **All**, so it will, in effect, ignore the port value and simple decode and process the message. Only valid port values are allowed, as per the LoRaWAN Specification. These values are 1 to 223.

</br>

## General Settings Details

| Name | Msg Len | Command | Value | Reboot Required? |
| -----| ------- | ------- | ------| ---------------- |
| Reboot | 1  | `0xFF`
| Send Firmware Version | 1  | `0x00` | See reply in ACK [here](#example-uplink-replies-to-downlink-messages)
| Antenna Gain (v5.12) | 2  | `0x01` | `0` to `25.5` dBi (single byte `0` to `255`) Default is 2.0 dBi | Yes
| Public Network | 2  | `0x02` | `0`/`1` (Disable/Enable) | Yes
| AppEUI | 9  | `0x05` | 8 Bytes for the **EUI**  | Yes
| AppKey | 17 | `0x06` | 16 bytes for the **Key** | Yes
| Auto Data Rate (ADR) | 2  | `0x07` | `0`/`1` (Disable/Enable)
| Duty Cycle | 2  | `0x08` | `0`/`1` (Disable/Enable)
| Message Confirmation | 2  | `0x09` | `0`/`1` (Disable/Enable)
| Transmit Port | 2  | `0x0A` | `1` to `223` (Default is 1)
| Default Data Rate Index | 2  | `0x0B` | `1` to `6` (Requires ADR disabled)
| Transmit Interval Index | 2  | `0x0C` | `1` to `11` when [ATI](#ati---adaptive-transmission-interval) is available, use `255` (`0xFF`) to activate it
| Transmit Power Index | 2  | `0x0D` | `1` to `6`
| Receive Port | 2  | `0x0E` | `0` to `223` (`0` indicates **All** Ports. Default is **All**)
| Set Join Check Interval (v5.07) | 2 | `0x0F` | `1` to `255` hours
| Set Join Check Packet Type (v5.07) | 2 | `0x10` | `0` = 'Standard' or `1` = 'Single Byte' of value `0x00`
| [ATI](#ati---adaptive-transmission-interval) Min TX Interval Index (v5.08) | 2  | `0x11` | `1` to `11`
| [ATI](#ati---adaptive-transmission-interval) Max TX Interval Index (v5.08) | 2  | `0x12` | `1` to `11`
| Disable/Enable KPI values in radio packet | 5  | `0x15` | `0x0000` to `0x3FFF` Each bit corresponds to the 14 KPI messages `0x41` to `0x4E`
| Disable/Enable KPI values in radio packet: Alternative method | 5  | `0x16` | First byte is the index: 0 to 14. `0x00` to `0x0E`. Index corresponds to the 15 KPI messages `0x40` to `0x4E`. Second byte is either off or on, `0x00`, `0x01`

### WELL Specfic Downlink Messages

| Name | Msg Len | Command | Value |
| -----| ------- | ------- | ------|
| * Set Full Packet Multiplier (v5.12) | 2 | `0x13` | `1` to `200`
| ** Set WELL defaults (v5.12) | 2 | `0x14` | `1`

 > \* *Set Full Packet Multiplier* is a feature that enables only the CO<sub>2</sub> value to be sent every TX interval. Then, every (*n* x TX Interval), send all the data.  
 As an example; If the transmit interval is set to 10 minutes, a multiplier value of 6 will transmit a full packet every hour, and only the CO<sub>2</sub> value the other 10 minute intervals.  
 This feature is enabled in firmware for `ENL-IAQ-C` for WELL standard, on request.

> \** This will change the options to:  
>> Transmit Interval: 10 mins  
Full Packet Multiplier: 6  
Join Check Packet: Single Zero Byte  
VOC included data packets: bVOC and IAQ only  
Particulates included data packets: PM 2.5 and PM 10.0 only
>>  
> This feature is enabled in firmware for `ENL-IAQ-C` for WELL standard, on request.

</br>

## Downlink Message Examples

### Reboot

> Payload Data:  `A5 01 FF`

### Send Firmware Version in downlink

Available from v7.20 onwards.

> Payload Data:  `A5 01 00`<br/>

The version is sent in the ACK message and the next payload.

### Set Antenna Gain to default (2.0 dBi)

> Payload Data: `A5 02 01 14`

### Enable Message Confirmation

> Payload Data: `A5 02 09 01`

### Set included KPIs - First Method (Command `0x15`)

Available from v7.02 onwards.

This uses a bit-map to enable/disable all KPI options in one message.

| Byte 1 - KPI Name (Uplink Type byte)  |    | Byte 2 - KPI Name (Uplink Type byte) |
| ------------------------------------- | -- | ------------------------------------ |
| Bit 0 - Transmit power (0x47)         |    | Bit 0 - n/a
| Bit 1 - Transmit Time (0x46)          |    | Bit 1 - CPU Temperature (0x4E)
| Bit 2 - Downlink message count (0x45) |    | Bit 2 - Air Fan Run Time (0x4D)
| Bit 3 - Received SNR  (0x44)          |    | Bit 3 - Login Fail Count (0x4C)
| Bit 4 - Received RSSI (0x43)          |    | Bit 4 - Login OK Count (0x4B)
| Bit 5 - Battery Voltage (0x42)        |    | Bit 5 - USB Insert Count (0x4A)
| Bit 6 - Battery Status (0x41)         |    | Bit 6 - Power up count (0x49)
| Bit 7 - CPU Temperature (0x40)        |    | Bit 7 - Transmit message count (0x48)

| Example Setting | Message |
| --------------- | ------- |
| Include Battery Status and Battery Voltage | `A5 03 15 60 00`
| Include RX RSSI, RX SNR and CPU Temperature (0x4E) | `A5 03 15 18 02`

### Set included KPIs - Second Method (Command `0x16`)

Available from v7.02 onwards.

This uses a message to enable/disable a single KPI at a time. The message is a simple `index` byte followed by the disable/enable byte `0x00`/`0x01`.

| Index - KPI Name (Uplink Type Byte)    |    | Index - KPI Name (Uplink Type Byte)    |
| -------------------------------------- | -- | -------------------------------------- |
| `0x00` - CPU Temperature (0x40)        |    | `0x08` - Transmit message count (0x48)
| `0x01` - Battery Status (0x41)         |    | `0x09` - Power up count (0x49)
| `0x02` - Battery Voltage (0x42)        |    | `0x0A` - USB Insert Count (0x4A)
| `0x03` - Received RSSI (0x43)          |    | `0x0B` - Login OK Count (0x4B)
| `0x04` - Received SNR  (0x44)          |    | `0x0C` - Login Fail Count (0x4C)
| `0x05` - Downlink message count (0x45) |    | `0x0D` - Air Fan Run Time (0x4D)
| `0x06` - Transmit Time (0x46)          |    | `0x0E` - CPU Temperature (0x4E)
| `0x07` - Transmit power (0x47)         |    | 

| Example Setting | Message |
| --------------- | ------- |
| Include Battery Status  | `A5 03 16 01 01`
| Include Battery Voltage | `A5 03 16 02 01`
| Disable Battery Voltage | `A5 03 16 02 00`

</br>

## Example Uplink Replies to Downlink Messages

**ACK** `0x06` - Successfully changed the Message Confirmation Option (`0x09`)

> Return Data: `A5 06 09`

**ACK** `0x06` - Request for Firmware Version (`0x00`)

> Return Data: `A5 06 00 07 14` Shows the firmware is v7.20

**NACK** `0x15` - failed to change the Transmit Port (`0x0A`)

> Return Data: `A5 15 0A`

</br>

## Downlink Message Index Tables

The Indexes for some settings depend on the region the unit is programmed for.

`0x0B` - Data Rate Index

| Index | EU868 |   | Index | US915 Hybrid |   | Index | AU915  |
| ----- | ----- | - | ----- | ------------ | - | ----- | ------ |
| 0 | DR0 SF12 BW125 |  | 0 | DR0 SF10 BW125 | | 0 | DR0 SF12 BW125
| 1 | DR1 SF11 BW125 |  | 1 | DR1 SF9 BW125  | | 1 | DR1 SF11 BW125
| 2 | DR2 SF10 BW125 |  | 2 | DR2 SF8 BW125  | | 2 | DR2 SF10 BW125
| 3 | DR3 SF9 BW125  |  | 3 | DR3 SF7 BW125  | | 3 | DR3 SF9  BW125
| 4 | DR4 SF8 BW125  |  | 4 | DR4 SF8 BW500  | | 4 | DR4 SF8  BW125
| 5 | DR5 SF7 BW125  |  |   |                | | 5 | DR5 SF7  BW125
|   |                |  |   |                | | 6 | DR6 SF8  BW500

`0x0C` - Transmit Interval Index

| Index | Transmit Interval | Message |
| -- | -- | -- |
| 1 | 30 s | `A5 02 0C 01`
| 2 | 1 min | `A5 02 0C 02`
| 3 | 2 min | `A5 02 0C 03`
| 4 | 5 min | `A5 02 0C 04`
| 5 | 10 min | `A5 02 0C 05`
| 6 | 15 min | `A5 02 0C 06`
| 7 | 20 min | `A5 02 0C 07`
| 8 | 30 min | `A5 02 0C 08`
| 9 | 1 hour | `A5 02 0C 09`
| 10 | 2 hours | `A5 02 0C 0A`
| 11 | 3 hours | `A5 02 0C 0B`

`0x0D` - Transmit Power Index

| Index | EU868 |   | Index | US195 Hybrid |   | Index | AU195 |
| ----- | ----- | - | ----- | ------------ | - | ----- | ----- |
| 1 | 16 dBm     |  | 6  | 20 dBm  |  | 6  | 20 dBm
| 2 | 14 dBm     |  | 7  | 18 dBm  |  | 7  | 18 dBm
| 3 | 11 dBm     |  | 8  | 16 dBm  |  | 8  | 16 dBm
| 4 | 9 dBm      |  | 9  | 14 dBm  |  | 9  | 14 dBm
| 5 | 8 dBm      |  | 10 | 12 dBm  |  | 10 | 12 dBm
| 6 | 6 dBm      |  | 11 | 10 dBm  |  | 11 | 10 dBm
| 7 | 4 dBm
| 8 | 2 dBm 

</br>

## Product and Sensor Specific Downlinks

### Fan Run-Time (Air/Air-X) Downlinks

The following are used in the enLink Air/Air-X

| Name | Msg Len | Command | Value |
| ---- | ------- | ------- | ----- |
| Case Fan Run Time| 3 | `0x22` | `10` to `600` Seconds (`0x000A` to `0x0258`)

> For example, to set the fan run-time to 30 seconds: </br>
> -- Payload Data: `A5 03 22 00 1E`

### Temperature/Humidity Downlinks

Available from v7.06 onwards.

The following is used in the Zone Plus, IAQ and OAQ

| Name | Msg Len | Command | Value | Description |
| ---- | ------- | ------- | ----- | ---------- |
| Transmit Humidity Data | 2 | `0x51` | `0`/`1` | Low/High resolution data

The humidity data is, by default, transmitted as a single byte. Type is `0x02`. From v7.06 you can choose to send the data using the type `0x3B` as two bytes. Divide the unsigned 16bit result by 100 to see the humidity value.

> For example, set the radio transmission to use high-resolution data:</br>
> -- Payload Data: `A5 02 51 01`

### Light Sensor Downlinks

The following are used in the Air, Zone and Zone Plus (with Light Sensor)

| Name | Msg Len | Command | Value | Scaling |
| ---- | ------- | ------- | ----- | ------- |
| Lux Scale Parameter | 3 | `0x20` | `0` to `65535` | /1000 (`0xFFFF` represents 65.535)
| Lux Offset Parameter | 3 | `0x21` | `0` to `65535` | None (`0xFFFF` represents 65535)

To scale the lux reading to compensate for the enclosure light pipe, a scaling factor is applied to the sensor value:

> Adjusted_Reading = (Sensor_Value x Scale) + Offset

Defaults are:
- Scale = **2.0** (Air), **1.678** (Zone and Zone Plus)
- Offset = **0** (All devices)

> For example, set Scale to **12.345** (12345 in hexadecimal is `0x3039`):</br>
> -- Payload Data: `A5 03 20 30 39`

### VOC Sensor Downlinks

Available from v5.12 onwards.

The following are used in devices with the BME680 VOC sensor (Firmware option code `V`). These options are for setting which data values are included in the transmitted radio packets. Sending smaller radio packets size will reduce battery consumption.

| Name | Msg Len | Command | Value |
| ---- | ------- | ------- | ----- |
| Include Parameter | 2 | `0x3C` | `0x00` to `0x0F` as a bit pattern (see below)

Set the bit value to `1` to include the data value; `0` to exclude it.

- Bit 0 - `Pressure`
- Bit 1 - `CO2e Estimate`
- Bit 2 - `bVOC`
- Bit 3 - `IAQ`
- Bit 4 - Not used
- Bit 5 - Not used
- Bit 6 - Not used
- Bit 7 - Not used

> For example, to include the `bVOC` and `IAQ` data values: </br>
> -- Payload Data: `A5 02 3C 0C`

### TVOC Sensor Downlinks

Include Parameter available from v6.02 onwards.</br>
Cleaning trigger available from v7.11 onwards.

The following are used in devices with the ZMOD4410 indoor TVOC sensor (Firmware option code `I`). These options are for setting which data values are included in the transmitted radio packets. Sending smaller radio packets size will reduce battery consumption. There is a standard and a PBAQ option with this sensor.

| Name | Msg Len | Command | Value |
| ---- | ------- | ------- | ----- |
| Include Parameter | 2 | `0x42` | `0x00` to `0x1F` as a bit pattern (see below)
| Trigger Cleaning Cycle | 2 | `0x53` | `0x01`

Set the bit value to `1` to include the data value; `0` to exclude it.

- Bit 0 - `Minimum TVOC`
- Bit 1 - `Average TVOC`
- Bit 2 - `Maximum TVOC`
- Bit 3 - `Latest EtOH reading` (Ethanol equivalent)
- Bit 4 - `Latest IAQ reading` (Included on `PBAQ` version from v7.11)
- Bit 5 - Not used
- Bit 6 - Not used
- Bit 7 - Not used

> Note: The Minimum, Average and Maximum are calculated between radio transmissions. The `PBAQ` version samples every 5 seconds.

Examples:

> To include the `Maximum TVOC` and the `Latest EtOH reading` data values: </br>
> -- Payload Data: `A5 02 42 0C`</br>
> To trigger a 'one-time-only' cleaning cycle of the sensor:</br>
> -- Payload Data: `A5 02 53 01`

### EPA/Ozone Sensor Downlinks

Enable/Disable available from v7.04 onwards.</br>
Cleaning trigger available from v7.11 onwards.

This sensor is used in IAQ/OAQ and with Air/Air-X units.
This single sensor can be used as an outdoor EPA sensor (Firmware option code `D`) and/or Ozone sensor (Firmware code `O3`)

| Name | Msg Len | Command | Value |
| ---- | ------- | ------- | ----- |
| Disable/Enable Sensor | 2 | `0x50` | `0x00`/`0x01`
| Trigger Cleaning Cycle | 2 | `0x52` | `0x01`

Example:

> To enable the sensor:</br>
> -- Payload Data: `A5 02 50 01`</br>
> To trigger a 'one-time-only' cleaning cycle of the sensor (Only works when sensor is enabled):</br>
> -- Payload Data: `A5 02 52 01`

### Carbon Dioxide Sensor Downlinks

The following are used in devices with CO<sub>2</sub> sensor

| Name | Msg Len | Command | Value |
| ---- | ------- | ------- | ----- |
| Enable/Disable Auto-Calibration | 2 | `0x24` | `0`/`1` (Disable/Enable)
| Set Target CO<sub>2</sub> Level | 3 | `0x25` | `100` to `1000` ppm (`0x0064` to `0x03E8`)
| Set to Known CO<sub>2</sub> Level | 3 | `0x26` | `10` to `2000` ppm (`0x000A` to `0x07D0`)
| Reset to factory Calibration<br /> **Only Sunrise model**| 1 | `0x27` |
| Set Regular Auto-Cal Interval | 3 | `0x28` | `24` to `8760` hours (`0x0018` to `0x2238`)
| Set the Out-of-Bounds limits<br />**Only GSS model** | 3 | `0x29` | `10` to `5000` ppm (`0x000A` to `0x1388`)
| Set initial auto-cal interval<br />**Only GSS model** | 3 | `0x2A` | `1` to `8760` hours (`0x0001` to `0x2238`)

| Example Setting | Message |
| --------------- | ------- |
| Enable Auto-Calibration | `A5 02 24 01` |
| Set the auto-calibration target to 450ppm | `A5 03 25 01 C2` |
| Set the sensor to known CO<sub>2</sub> concentration of 780ppm (`0x030C`) | `A5 03 26 03 0C` |
| To reset the sensor back to factory calibration (Sunrise Only) | `A5 01 27` |
| Set the auto-calibration interval to 10 days (240 hours, `0x00F0`) | `A5 03 28 00 F0` |

### Occupancy Sensor Downlinks

Available from v7.15 onwards.
The following are used in devices with the STHS34PF80 sensor. Firmware code 'H'.

| Name | Msg Len | Command | Value |
| ---- | ------- | ------- | ----- |
| Set presence threshold | 3 | `0x54` | `0` to `32767` (`0x0000` to `0x7FFF`) |
| Set presence hysteresis | 2 | `0x55` | `0` to `255` (`0x00` to `0xFF`) |
| Set the inactivity timeout | 3 | `0x56` | `0` to `21600` (`0x0000` to `0x5460`) |
| Set the detection count and duration time to zero | 1 | `0x57` |
| Reboot/Reset the sensor  | 1 | `0x58` |

| Example Setting | Message |
| --------------- | ------- |
| Set the presence threshold to 200 | `A5 03 54 00 C8` |
| Set the presence hysteresis to 50 | `A5 02 55 32` |
| Set the inactivity timeout to 25 minutes (1500 seconds) | `A5 03 56 05 DC` |
| Zero the count and duration variables | `A5 01 57` |
| Reset the sensor | `A5 01 58` |

### Particulate Sensor Downlinks

Available from v5.03 onwards.  
The following are used in devices with SPS30 particulate sensors.

#### Air/Air-X and IAQ/OAQ Particulate Sensor Downlinks

| Name | Msg Len | Command | Value |
| ---- | ------- | ------- | ----- |
| Enable and set fan run period (Sample time) | 2 | `0x2B` | `3` to `180` Seconds (`0x03` to `0xB4`) </br> `0` disables the sensor. (from v7.16) |
| Set cleaning interval | 3 | `0x2C` | `6` to `1440` hours (`0x0006` to `0x05A0`) |
| Message Include Parameter (from v5.12) | 3 | `0x3D` | `0x0000` to `0xFFFF` as a bit pattern (see below) |

'Message Include' is for setting which data values are included in the transmitted radio packets. Sending smaller radio packets size will reduce battery consumption.

| Example Setting | Message |
| --------------- | ------- |
| Set the fan run period to 35 seconds | `A5 02 2B 23` |
| Disable the SPS30 sensor (save power) | `A5 02 2B 00` |
| Set the cleaning interval to 8 days (192 hours, `0x00C0`) | `A5 03 2C 00 C0` |

For the 'Message Include' settings, you should set the bit value to `1` to include the data value; `0` to exclude it.

 PM = Particle Mass  
 PC = Particle Count

| Byte 1 |    | Byte 2 |
| ------ | -- | ------ |
| Bit 0 - `PM 1.0`  | | Bit 0 - `PC 10.0`
| Bit 1 - `PM 2.5`  | | Bit 1 - `Typical Particle Size`
| Bit 2 - `PM 4.0`  | | Bit 2 - Not used
| Bit 3 - `PM 10.0` | | Bit 3 - Not used
| Bit 4 - `PC 0.5`  | | Bit 4 - Not used
| Bit 5 - `PC 1.0`  | | Bit 5 - Not used
| Bit 6 - `PC 2.5`  | | Bit 6 - Not used
| Bit 7 - `PC 4.0`  | | Bit 7 - Not used

Example:

> To include `PM 10.0`, `PM 2.5` and `Typical Particle Size` data values: </br>
> -- Payload Data: `A5 03 3D 0A 02`

#### IAQ Plus/Vape Particulate Sensor Downlinks

| Name | Msg Len | Command | Value |
| ---- | ------- | ------- | ----- |
| Set fan run period (Sample time) | 2 | `0x2B` | `3` to `180` Seconds (`0x03` to `0xB4`)
| Set cleaning interval | 3 | `0x2C` | `6` to `1440` hours (`0x0006` to `0x05A0`)
| Message Include Parameter (from v5.12) | 3 | `0x3E` | `0x0000` to `0xFFFF` as a bit pattern (see below)

'Message Include' is for setting which data values are included in the transmitted radio packets. Sending smaller radio packets size will reduce battery consumption.

| Example Setting | Message |
| --------------- | ------- |
| Set the fan run period to 35 seconds | `A5 02 2B 23`
| Set the cleaning interval to 8 days (192 hours, `0x00C0`) | `A5 03 2C 00 C0`

For the 'Message Include' settings, you should set the bit value to `1` to include the data value; `0` to exclude it.

 PM = Particle Mass  
 PC = Particle Count

| Byte 1 |    | Byte 2 |
| ------ | -- | ------ |
| Bit 0 - `PM 0.1`  | | Bit 0 - `PC 0.1`
| Bit 1 - `PM 0.3`  | | Bit 1 - `PC 0.3`
| Bit 2 - `PM 0.5`  | | Bit 2 - `PC 0.5`
| Bit 3 - `PM 1.0`  | | Bit 3 - `PC 1.0`
| Bit 4 - `PM 2.5`  | | Bit 4 - `PC 2.5`
| Bit 5 - `PM 5.0`  | | Bit 5 - `PC 5.0`
| Bit 6 - `PM 10.0` | | Bit 6 - `PC 10.0`
| Bit 7 - Not used | | Bit 7 - Not used

> To include `PM 10.0`, `PM 2.5`, `PM 1.0`, `PM 0.5` and `PC 1.0` data values: </br>
> -- Payload Data:  `A5 03 3E 59 08`

### Gas Sensor Downlinks

Available from v5.07 onwards.

The following are used in devices with a Gas sensor (Option Code 'G')

| Name | Msg Len | Command | Value |
| ---- | ------- | ------- | ----- |
| Set Idle State | 2 | `0x2D` | `0`/`1`/`2` Powered Off/Sleep/Powered On
| Set Preamble Delay | 2 | `0x2E` | `2` to `240` seconds (`0x02` to `0xF0`)
| Set Number of Reads per Sample | 2 | `0x2F` | `1` to `60` (`0x01` to `0x3C`)
| Set Read Interval | 2 | `0x30` | `1` to `60` seconds (`0x01` to `0x3C`)
| Set Aggregation Method | 2 | `0x31` | `0` to `3` None/Min/Avg/Max
| Set the EMA (smoothing) Factor | 2 | `0x32` | `1` to `100` (`0x01` to `0x64`)
| Set trim value for ppb reading | 2 | `0x33` | `-100` to `100` (`0x9C` to `0x64`)
| Set trim value for µg/m³ reading | 2 | `0x34` | `-100` to `100` (`0x9C` to `0x64`)

### Leak Sensor Downlinks

Available from v5.08 onwards.

The following are used in the enLink Status Leak Sensor.

| Name | Msg Len | Command | Value |
| ---- | ------- | ------- | ----- |
| Alarm Mode | 2 | `0x35` | `0`/`1`/`2` Off/High Threshold/Low Threshold
| High Alarm Level | 3 | `0x36` | `0` to `5000` kOhms (`0x0000` to `0x1388`)
| High Alarm Hysteresis | 3 | `0x37` | `0` to `300` kOhms (`0x0000` to `0x012C`)
| Low Alarm Level | 3 | `0x38` | `0` to `5000` kOhms (`0x0000` to `0x1388`)
| Low Alarm Hysteresis | 3 | `0x39` | `0` to `300` kOhms (`0x0000` to `0x012C`)
| Sample Interval | 3 | `0x3A` | `10` to `7200` seconds (`0x000A` to `0x1C20`)
| Test Duration (v5.12) | 2 | `0x3B` | `1` to `20` minutes (`0x01` to `0x14`)

Note: All options are shown. However, for the supplied leak cable, the Alarm Mode should be set to **Low Threshold** (2). Low alarm level to **1000 kOhms** with a Low hysteresis of **100 kOhms**.

| Example Setting | Message |
| --------------- | ------- |
| Mode = Low Threshold | `A5 02 35 02`
| Low Alarm Level = 1000 kOhm | `A5 03 38 03 E8`
| Low Hysteresis = 100 kOhm | `A5 03 39 01 2C`
| Sample Interval = 3 minutes | `A5 03 3A 00 B4`

### Differential Pressure / Air Flow Downlinks

Available from v5.14 onwards.

The following over-the-air settings are used for the enLink Status Differential Pressure / Airflow device.

| Name | Msg Len | Command | Value |
| ---- | ------- | ------- | ----- |
| Values to include in Radio Packets | 2 | `0x3F` | `0`/`1`/`2` Pressure Only/Air flow Only/Both
| Zero reading (auto delta) | 1 | `0x40`
| Set Delta Offset | 5 | `0x41` | Floating point value

> Note: When the device receives a `Zero reading` downlink message it performs a measurement and uses the result as a delta offset value, effectively causing the reading to be zero.

| Example Setting | Message |
| --------------- | ------- |
| Only transmit pressure value | `A5 02 3F 00`
| Zero the reading | `A5 01 40`
| Set delta offset to `-1.234` | `A5 05 41 BF 9D F3 B6`

For an online value converter, see [Hex to Float Converter](https://gregstoll.com/~gregstoll/floattohex/)

### Zone View e-paper Display Downlinks

Available from v7.01 onwards.

The following are used in the Zone View product that includes an e-paper display.

| Name | Msg Len | Command | Value |
| ---- | ------- | ------- | ----- |
| Screen Refresh Interval | 2 | `0x43` | `5` to `30` minutes
| Top line of display | 2 | `0x44` | `0`/`1` Temperature or Humidity
| Temperature Units | 2 | `0x45` | `0`/`1` Celsius or Fahrenheit
| Comfort Indicator | 2 | `0x46` | `0`/`1`/`2` None/Face/House
| Comfort Indicator Location | 2 | `0x47` | `0`/`1` Left or Right
| Comfort Indicator Status logic based on | 2 | `0x48` | `0`/`1` Internal rH Sensor/Downlink Message
| Comfort Indicator Status | 2 | `0x49` | `0`/`1`/`2`/`3` None/Dry/Humid/Damp
| Internal Sensor Logic - Low Threshold | 2 | `0x4A` | `10` to `70` %rH - Below this is `Dry`
| Internal Sensor Logic - High Threshold | 2 | `0x4B` | `30` to `90` %rH - Above this is `Damp`
| Help Screen | 2 | `0x4C` | `0`/`1` Disable/Enable
| Set text for information screens</br>(* use this field for the text index. `0x00` to `0x03` for the 4 information screens. `0x04` for Help text.) | * | `0xD0` | Hexadecimal values for ASCII Text.</br>See example, below.
| Set text to default | 2 | `0xD1` | Use this field for the text index. `0x00` to `0x03` for the 4 information screens. `0x04` for Help text.

| Example Setting | Message |
| --------------- | ------- |
| To set the display refresh interval to 10 minutes                        | `A5 02 43 0A`
| To set the comfort icon logic to use a downlink message (`0x49`)         | `A5 02 48 01`
| Show the comfort icon as `Humid`                                         | `A5 02 49 02`
| Enable the Help Screen (Disabled by default)                             | `A5 02 4C 01`
| Set the text for the `Damp` (index `0x03`) comfort icon as `Hello World` | `A5 03 D0 48 65 6C 6C 6F 20 57 6F 72 6C 64`
| Set the text for the `Damp` (index `0x03`) to default | `A5 04 D1 03`
| Set the text for the `Dry` (index `0x01`) to default | `A5 04 D1 01`

> Be aware of the maximum message size for the 'Set Text' feature. You can send a downlink up to 242 bytes at SF7 for EU868. Look out for downlink failures for your Region and Data Rates.

See the device configuration screens via the USB connection for more information on formatting screen messages.

### Flammable Gas Sensor Downlink

Available from v7.16 onwards.

The following is used in products that include a flammable gas sensor.

| Name | Msg Len | Command | Value |
| ---- | ------- | ------- | ----- |
| Set condition counters to zero | 1 | `0x59` | 

| Example Setting | Message |
| --------------- | ------- |
| To set all the counters to zero | `A5 01 59` |

### Radon Sensor Downlinks

Available from v7.20 onwards.

The following is used in products that include a radon gas sensor.

| Name | Msg Len | Command | Value |
| ---- | ------- | ------- | ----- |
| Reset sensor options | 2 | `0x5A` | `1` - Reset Sensor, `2` - Reset fault code counter only
| Set read interval    | 2 | `0x5B` | `1` to `240` minutes

| Example Setting | Message |
| --------------- | ------- |
| To reset the radon sensor (power cycle) | `A5 02 5A 01` |
| To reset the fault code count | `A5 02 5A 02` |
| Set read interval to 10 minutes (default) | `A5 02 5B 0A` |
| Set read interval to 60 minutes | `A5 02 5B 3C` |

</br>

# Sample CODECs for Decoding Messages

Examples for decoding these messages are included in the folders on this site. These include all the sensor options to give basic decoding to enable feedback during evaluation and commissioning. If you require these messages in your system, please modify the code to suit your platform.
