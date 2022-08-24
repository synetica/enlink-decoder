# Change Log

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
