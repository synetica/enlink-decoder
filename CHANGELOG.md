# Change Log

## 2023 August Updates

- Updated firmware to 5.14
- Added some more models.
- Removed colour formatting in README to allow copy-paste for downlink sample messages
- Added OTA settings for Status DP/AF device
- Added individual codecs for Chirpstack

## 2023 May Updates

- Updated firmware to 5.12
- Formatted README with colours for clearer identification of byte meanings
- Added downlink to adjust antenna gain (normally 2.0). A higher value uses less power. Setting a lower value (to the minimum of zero) will cause more power output on amplifier, stronger radio transmissions, and more battery consumption. A reboot is required after changing the value.
- Added downlinks other low power options; Full Packet Multiplier, set to WELL defaults, plus selecting what data values are sent in the radio packets for VOC and particulates

## 2023 March Updates

- Updated uplink decoder to handle both v3 and v4 of Chirpstack
- Added downlink reply decoder (i.e. an uplink) to Chirpstack decoder

## 2023 February Updates

- Updated firmware to 5.09
- Scaled ADC Resistance reading for ADC and leak sensor models (from 0-65kΩ to 0-6553.5kΩ)

## 2023 January Updates

- Updated firmware to 5.08
- Added OTA configuration for leak sensor
- Added OTA configuration for ATI values
- Added particulate detection counters for Smoke/Vape. IAQ with PV option

## 2022 November Updates

- Updated firmware to 5.07
- Added options for gas sensor (Option 'G') to improve noise reduction
- Added OTA configuration for new gas sensor options
- Added OTA configuration for Join Check interval and new 'type' options

## 2022 September Updates

- Updated firmware to 5.03
- Removed TVOC uplink decoders from examples as it's not implemented
- Added extra particulate uplink decoders for new PM sensor
- Added OTA downlink messages for particulate sensors to set runtime and cleaning values

## 2022 August Updates

- Updated firmware to 5.02
- Added new **Change-of-State** feature to Status Pulse model, where any change to an input will transmit immediately. This requires the ATI feature enabled. This adds new *Data Type Identifier* byte of value `0x15`
- Added a new Status Pulse model - STS-PX. This is new hardware with extra battery capacity (D-Cell) and option for external power.

## 2022 July Updates

- Updated readme to refer to **firmware code**. Firmware from version 5.x onwards uses new **firmware code** name e.g. `FW-ZN-LVCM`
- Simplify the tables of data for payload codes for the different models.
- Reformat Chirpstack script (white space)

## 2022 June Updates

- Added Status-VC payload table
- Added live decoder website

## 2022 April Updates

- Documentation updates in readme

## 2022 March Updates

- Added decimal numbers to **Type** that were already shown as hexadecimal
- Removed Type `0x15` 021 - Occupied Status from documentation. Was never implemented.

## 2022 February Updates

- Improve readme to include details on radio packets for each enLink model
- Added error message to decoder examples

## 2022 January Updates

- Add Chirpstack decoder
- Add supported LoRaWAN Specs
- Minor documentation updates

## 2021 December - Site Created

- Created github site from existing documentation
