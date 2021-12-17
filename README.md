# Synetica - enLink LoRaWAN decoders

[![GitHub](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/synetica/enlink-decoder/blob/master/LICENSE)

## Preamble

[Synetica](https://www.synetica.net) is a UK based company that designs and develops energy and environmental sensors. We specialise in high accuracy air quality monitoring using LoRaWAN long range wireless.

The `enLink` range of LoRaWAN devices are categorised into the following:
- Air Quality Monitors (Indoor and Outdoor, mains and battery powered)
- Indoor Environmental Sensors
- Modbus Reader - Serial RS485 RTU
- Pulse Counter
- Leak Sensor
- Differential Pressure / Air Flow
- Temperature Probes

This repository contains various decoders for the LoRaWAN data packets. The uplink data is telemetry data containing values like temperature, particulates and gas concentrations.

## Uplink Payload

The enLink packet structure is designed to be as efficient as possible. Data for multiple sensor values can be concatenated into a single message which can be easily decoded. If the payload length is restricted due to channel time limits, the whole message may be split into multiple “packets”. These packets are simply multiple messages. Each packet will always be split on a Sensor data boundary. This is done so messages are easily decoded, as each message will always have the first byte as a Data Type Identifier.
